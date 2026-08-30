import Combine
import Foundation
import StoreKit

enum SubscriptionActionResult: Equatable {
    case purchased
    case restored
    case nothingToRestore
    case pending
    case cancelled
    case unavailable
    case failed
}

@MainActor
final class SubscriptionStore: ObservableObject {
    static let productIDs = Set(YixiuPlusPlan.allCases.map(\.productID))

    @Published private(set) var products: [YixiuPlusPlan: Product] = [:]
    @Published private(set) var accessLevel: YixiuAccessLevel
    @Published private(set) var isLoadingProducts = false
    @Published private(set) var isBusy = false
    @Published private(set) var productsUnavailable = false
    @Published private(set) var isReady = false
    @Published private(set) var annualTrialEligible = false

    var hasPlus: Bool { accessLevel == .plus }
    var hasLegacyAccess: Bool { accessLevel == .legacy }
    var isInternalPlusExperience: Bool {
        #if DEBUG
        forcedAccessLevel == .plus
        #else
        false
        #endif
    }

    private let defaults: UserDefaults
    private let forcedAccessLevel: YixiuAccessLevel?
    private var verifiedLegacyAccess: Bool
    private var updatesTask: Task<Void, Never>?
    private var hasStarted = false

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        #if DEBUG && YIXIU_INTERNAL_PLUS
        forcedAccessLevel = ProcessInfo.processInfo.arguments.contains("-YixiuForceFreeAccess") ? .free : .plus
        #elseif DEBUG
        if ProcessInfo.processInfo.arguments.contains("-YixiuForceFreeAccess") {
            forcedAccessLevel = .free
        } else if ProcessInfo.processInfo.arguments.contains("-YixiuForcePlusAccess") {
            forcedAccessLevel = .plus
        } else {
            forcedAccessLevel = nil
        }
        #else
        forcedAccessLevel = nil
        #endif
        verifiedLegacyAccess = defaults.bool(forKey: "yixiu.verifiedLegacyAccess")
        accessLevel = forcedAccessLevel ?? (verifiedLegacyAccess ? .legacy : .free)
    }

    deinit {
        updatesTask?.cancel()
    }

    func start() async {
        guard !hasStarted else { return }
        hasStarted = true
        if let forcedAccessLevel {
            accessLevel = forcedAccessLevel
            await loadProducts()
            isReady = true
            return
        }
        listenForTransactions()
        await resolveLegacyAccess()
        await refreshEntitlements()
        await loadProducts()
        isReady = true
    }

    func product(for plan: YixiuPlusPlan) -> Product? {
        products[plan]
    }

    func canAccess(_ scene: MeditationScene) -> Bool {
        !isReady || SubscriptionAccessPolicy.canAccess(scene: scene, level: accessLevel)
    }

    func canUseTimer(_ minutes: Int) -> Bool {
        !isReady || SubscriptionAccessPolicy.canUseTimer(minutes: minutes, level: accessLevel)
    }

    func canUseFocus(_ minutes: Int) -> Bool {
        !isReady || SubscriptionAccessPolicy.canUseFocus(minutes: minutes, level: accessLevel)
    }

    func loadProducts() async {
        guard !isLoadingProducts else { return }
        isLoadingProducts = true
        defer { isLoadingProducts = false }

        do {
            let loadedProducts = try await Product.products(for: Array(Self.productIDs))
            products = Dictionary(uniqueKeysWithValues: YixiuPlusPlan.allCases.compactMap { plan in
                loadedProducts.first(where: { $0.id == plan.productID }).map { (plan, $0) }
            })
            if let subscription = products[.yearly]?.subscription {
                annualTrialEligible = await subscription.isEligibleForIntroOffer
            } else {
                annualTrialEligible = false
            }
            productsUnavailable = products.count != YixiuPlusPlan.allCases.count
        } catch {
            annualTrialEligible = false
            productsUnavailable = true
        }
    }

    func purchase(_ plan: YixiuPlusPlan) async -> SubscriptionActionResult {
        guard !isBusy else { return .unavailable }
        isBusy = true
        defer { isBusy = false }

        if products[plan] == nil {
            await loadProducts()
        }
        guard let product = products[plan] else { return .unavailable }

        do {
            switch try await product.purchase() {
            case .success(let verification):
                guard case .verified(let transaction) = verification,
                      Self.productIDs.contains(transaction.productID),
                      isActive(transaction) else {
                    return .failed
                }
                await transaction.finish()
                await refreshEntitlements()
                return hasPlus ? .purchased : .failed
            case .pending:
                return .pending
            case .userCancelled:
                return .cancelled
            @unknown default:
                return .failed
            }
        } catch {
            return .failed
        }
    }

    func restorePurchases() async -> SubscriptionActionResult {
        guard !isBusy else { return .unavailable }
        isBusy = true
        defer { isBusy = false }

        do {
            try await AppStore.sync()
            await resolveLegacyAccess()
            await refreshEntitlements()
            return hasPlus || hasLegacyAccess ? .restored : .nothingToRestore
        } catch {
            return .failed
        }
    }

    func refreshEntitlements() async {
        var activePlus = false
        for await result in Transaction.currentEntitlements {
            guard case .verified(let transaction) = result,
                  Self.productIDs.contains(transaction.productID),
                  isActive(transaction) else { continue }
            activePlus = true
            break
        }
        accessLevel = activePlus ? .plus : (verifiedLegacyAccess ? .legacy : .free)
    }

    private func resolveLegacyAccess() async {
        do {
            let result = try await AppTransaction.shared
            guard case .verified(let appTransaction) = result else { return }
            verifiedLegacyAccess = SubscriptionAccessPolicy.isLegacyPurchase(
                originalAppVersion: appTransaction.originalAppVersion
            )
            defaults.set(verifiedLegacyAccess, forKey: "yixiu.verifiedLegacyAccess")
            defaults.set(true, forKey: "yixiu.legacyAccessResolved")
            if accessLevel != .plus {
                accessLevel = verifiedLegacyAccess ? .legacy : .free
            }
        } catch {
            // Keep the last verified result. A temporary StoreKit failure must not remove access.
        }
    }

    private func isActive(_ transaction: Transaction) -> Bool {
        guard transaction.revocationDate == nil else { return false }
        guard let expirationDate = transaction.expirationDate else { return true }
        return expirationDate > Date()
    }

    private func listenForTransactions() {
        guard updatesTask == nil else { return }
        updatesTask = Task { [weak self] in
            for await result in Transaction.updates {
                guard let self else { return }
                guard case .verified(let transaction) = result else { continue }
                await transaction.finish()
                await self.refreshEntitlements()
            }
        }
    }
}
