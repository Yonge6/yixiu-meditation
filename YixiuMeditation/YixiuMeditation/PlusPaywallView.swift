import Foundation

enum PaywallPriceState: Equatable {
    case loading
    case available
    case unavailable

    static func resolve(isLoading: Bool, hasRequestedPrices: Bool, hasProduct: Bool) -> Self {
        if isLoading { return .loading }
        if hasProduct { return .available }
        return hasRequestedPrices ? .unavailable : .loading
    }
}

#if canImport(StoreKit) && canImport(SwiftUI) && canImport(UIKit)
import StoreKit
import SwiftUI

struct PlusPaywallView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var subscriptionStore: SubscriptionStore
    @Environment(\.dismiss) private var dismiss
    @Environment(\.openURL) private var openURL
    @State private var selectedPlan: YixiuPlusPlan = .yearly
    @State private var resultMessage: String?
    @State private var hasRequestedPrices = false

    private var language: AppLanguage { appState.language }

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: 22) {
                    hero
                    benefits
                    planPicker
                    purchaseButton
                    legacyNote
                    footer
                }
                .padding(.horizontal, 20)
                .padding(.top, 18)
                .padding(.bottom, 34)
                .frame(maxWidth: 600)
                .frame(maxWidth: .infinity)
            }
            .background(background)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button { dismiss() } label: {
                        Image(systemName: "xmark")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundStyle(YixiuTheme.moon)
                            .frame(width: 36, height: 36)
                            .background(Circle().fill(YixiuTheme.deepWaterSoft.opacity(0.74)))
                    }
                    .accessibilityLabel(language.text(zh: "关闭", en: "Close"))
                }
            }
            .toolbarBackground(.hidden, for: .navigationBar)
        }
        .preferredColorScheme(.dark)
        .task {
            ProductAnalytics.shared.event("paywall_view")
            await reloadPrices()
        }
        .onChange(of: subscriptionStore.hasPlus) { _, hasPlus in
            if hasPlus { dismiss() }
        }
    }

    private var background: some View {
        ZStack {
            Image("UnderwaterEcho")
                .resizable()
                .scaledToFill()
                .ignoresSafeArea()
            LinearGradient(
                colors: [YixiuTheme.deepWater.opacity(0.58), YixiuTheme.deepWater.opacity(0.99)],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
        }
    }

    private var hero: some View {
        VStack(spacing: 10) {
            PremiumGemIcon()
                .frame(width: 39, height: 36)
                .frame(width: 70, height: 70)
                .background(Circle().fill(YixiuTheme.plusGold.opacity(0.08)))
                .overlay(Circle().stroke(YixiuTheme.plusGold.opacity(0.35), lineWidth: 0.8))

            Text("YIXIU PLUS")
                .yixiuSecondary(10)
            Text(language.text(zh: "让安静，陪伴久一点", en: "More room for quiet"))
                .font(language == .zh ? YixiuTheme.chineseDisplay(30) : YixiuTheme.englishSerif(29))
                .foregroundStyle(YixiuTheme.moon)
            Text(language.text(
                zh: "更丰富的声音，更从容的聆听。无需账号；免费声音与一分钟呼吸始终可用。",
                en: "More sounds and longer listening. No account needed; free sounds and one-minute breathing stay available."
            ))
            .font(YixiuTheme.sans(13))
            .foregroundStyle(YixiuTheme.mist)
            .multilineTextAlignment(.center)
            .lineSpacing(5)
        }
    }

    private var benefits: some View {
        VStack(spacing: 0) {
            benefit("waveform", zh: "全部 14 种自然声与 40 首音乐（20 首古典、10 首 AI 原创）", en: "All 14 nature sounds and 40 music tracks (20 classical and 10 AI originals)")
            Divider().overlay(YixiuTheme.hairline)
            benefit("timer", zh: "60 分钟与不限时聆听", en: "60-minute and unlimited listening")
            Divider().overlay(YixiuTheme.hairline)
            benefit("circle.circle", zh: "3 / 5 / 10 分钟水之呼吸", en: "3 / 5 / 10-minute water breathing")
        }
        .padding(.horizontal, 16)
        .yixiuPanel()
    }

    private func benefit(_ icon: String, zh: String, en: String) -> some View {
        HStack(spacing: 13) {
            Image(systemName: icon)
                .font(.system(size: 15, weight: .light))
                .foregroundStyle(YixiuTheme.aquaStrong)
                .frame(width: 28)
            Text(language.text(zh: zh, en: en))
                .font(YixiuTheme.sans(14, weight: .medium))
                .foregroundStyle(YixiuTheme.moon)
            Spacer()
            Image(systemName: "checkmark")
                .font(.system(size: 11, weight: .semibold))
                .foregroundStyle(YixiuTheme.aqua)
        }
        .frame(minHeight: 52)
    }

    private var planPicker: some View {
        VStack(spacing: 10) {
            planCard(.yearly)
            planCard(.monthly)
        }
    }

    private func planCard(_ plan: YixiuPlusPlan) -> some View {
        Button {
            selectedPlan = plan
            ProductAnalytics.shared.event("plan_select", ["plan": plan.rawValue])
        } label: {
            VStack(alignment: .leading, spacing: 9) {
                HStack(alignment: .firstTextBaseline, spacing: 12) {
                    HStack(spacing: 10) {
                        Image(systemName: selectedPlan == plan ? "checkmark.circle.fill" : "circle")
                            .font(.system(size: 20, weight: .light))
                            .foregroundStyle(selectedPlan == plan ? YixiuTheme.aquaStrong : YixiuTheme.mist)
                        Text(plan == .yearly
                             ? language.text(zh: "连续包年", en: "Annual")
                             : language.text(zh: "连续包月", en: "Monthly"))
                            .font(YixiuTheme.sans(14, weight: .medium))
                            .foregroundStyle(YixiuTheme.moon)
                    }
                    Spacer()
                    if subscriptionStore.introductoryOffer(for: plan) != nil {
                        Text(language.text(zh: "首次订阅优惠", en: "Introductory offer"))
                            .font(YixiuTheme.sans(9, weight: .medium))
                            .foregroundStyle(YixiuTheme.aqua)
                    }
                }

                if priceState(for: plan) == .available, let product = subscriptionStore.product(for: plan) {
                    HStack(alignment: .firstTextBaseline, spacing: 7) {
                        Text(subscriptionStore.introductoryOffer(for: plan)?.displayPrice ?? product.displayPrice)
                            .font(YixiuTheme.englishSerif(28, weight: .semibold))
                            .monospacedDigit()
                        Text(subscriptionStore.introductoryOffer(for: plan).map { offerPeriod($0.period) } ?? (plan == .yearly
                             ? language.text(zh: "/ 年", en: "/ year")
                             : language.text(zh: "/ 月", en: "/ month")))
                            .font(YixiuTheme.sans(13, weight: .medium))
                            .foregroundStyle(YixiuTheme.mist)
                    }
                    .foregroundStyle(YixiuTheme.moon)
                } else {
                    HStack(spacing: 8) {
                        if priceState(for: plan) == .loading {
                            ProgressView().tint(YixiuTheme.aqua)
                        }
                        Text(priceState(for: plan) == .loading
                             ? language.text(zh: "载入 Apple 价格中", en: "Loading Apple prices")
                             : language.text(zh: "价格暂未载入", en: "Price unavailable"))
                            .font(YixiuTheme.sans(16, weight: .medium))
                            .foregroundStyle(YixiuTheme.mist)
                    }
                    .frame(minHeight: 34)
                }

                Text(planSubtitle(plan))
                    .font(YixiuTheme.sans(11))
                    .foregroundStyle(YixiuTheme.mist)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
            .frame(maxWidth: .infinity, minHeight: 108, alignment: .leading)
            .background(
                RoundedRectangle(cornerRadius: 19, style: .continuous)
                    .fill(YixiuTheme.deepWaterSoft.opacity(selectedPlan == plan ? 0.88 : 0.56))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 19, style: .continuous)
                    .stroke(selectedPlan == plan ? YixiuTheme.aqua : YixiuTheme.hairline, lineWidth: 0.9)
            )
        }
        .buttonStyle(.plain)
    }

    private func planSubtitle(_ plan: YixiuPlusPlan) -> String {
        guard priceState(for: plan) == .available, let product = subscriptionStore.product(for: plan) else {
            return priceState(for: plan) == .loading
                ? language.text(zh: "正在获取你所在地区的价格与订阅优惠。", en: "Fetching prices and offers for your region.")
                : language.text(zh: "暂时无法取得 Apple 价格，请重试。", en: "Apple prices are unavailable. Please retry.")
        }
        if let offer = subscriptionStore.introductoryOffer(for: plan) {
            let period = offerPeriod(offer.period)
            let intro: String
            switch offer.paymentMode {
            case .freeTrial:
                intro = language.text(zh: "免费试用 \(period)。", en: "Free trial for \(period). ")
            case .payAsYouGo:
                intro = language.text(zh: "前 \(offer.periodCount) 期，每 \(period) \(offer.displayPrice)。", en: "\(offer.displayPrice) every \(period) for \(offer.periodCount) periods. ")
            case .payUpFront:
                intro = language.text(zh: "首 \(period) 共 \(offer.displayPrice)。", en: "\(offer.displayPrice) total for the first \(period). ")
            default:
                intro = ""
            }
            let renewal = plan == .yearly ? language.text(zh: "年", en: "year") : language.text(zh: "月", en: "month")
            return intro + language.text(zh: "之后每\(renewal) \(product.displayPrice) 自动续订，可随时取消。", en: "Then \(product.displayPrice) per \(renewal), auto-renewing until canceled.")
        }
        if plan == .yearly {
            return language.text(
                zh: "每年 \(product.displayPrice) 自动续订，可随时取消。",
                en: "\(product.displayPrice) per year. Renews automatically until canceled."
            )
        }
        return language.text(
            zh: "每月 \(product.displayPrice) 自动续订，可随时取消。",
            en: "\(product.displayPrice) per month. Renews automatically until canceled."
        )
    }

    private func priceState(for plan: YixiuPlusPlan) -> PaywallPriceState {
        PaywallPriceState.resolve(
            isLoading: subscriptionStore.isLoadingProducts,
            hasRequestedPrices: hasRequestedPrices,
            hasProduct: subscriptionStore.product(for: plan) != nil
        )
    }

    @MainActor
    private func reloadPrices() async {
        await subscriptionStore.loadProducts()
        hasRequestedPrices = true
    }

    private func offerPeriod(_ period: Product.SubscriptionPeriod) -> String {
        let unit: String
        switch period.unit {
        case .day: unit = language.text(zh: "天", en: period.value == 1 ? "day" : "days")
        case .week: unit = language.text(zh: "周", en: period.value == 1 ? "week" : "weeks")
        case .month: unit = language.text(zh: "个月", en: period.value == 1 ? "month" : "months")
        case .year: unit = language.text(zh: "年", en: period.value == 1 ? "year" : "years")
        @unknown default: return language.text(zh: "Apple 所示周期", en: "the period shown by Apple")
        }
        return "\(period.value) \(unit)"
    }

    private var purchaseButton: some View {
        VStack(spacing: 10) {
            Button {
                Task {
                    resultMessage = message(for: await subscriptionStore.purchase(selectedPlan))
                }
            } label: {
                HStack(spacing: 9) {
                    if subscriptionStore.isBusy || priceState(for: selectedPlan) == .loading {
                        ProgressView().tint(YixiuTheme.deepWater)
                    }
                    Text(priceState(for: selectedPlan) == .loading
                         ? language.text(zh: "载入价格中", en: "Loading prices")
                         : language.text(zh: "继续", en: "Continue"))
                }
                .font(YixiuTheme.sans(15, weight: .semibold))
                .foregroundStyle(YixiuTheme.deepWater)
                .frame(maxWidth: .infinity)
                .frame(height: 54)
                .background(Capsule().fill(YixiuTheme.aquaStrong))
                .shadow(color: YixiuTheme.aqua.opacity(0.18), radius: 18, y: 8)
            }
            .buttonStyle(.plain)
            .disabled(subscriptionStore.isBusy || priceState(for: selectedPlan) != .available)
            .opacity(priceState(for: selectedPlan) == .available ? 1 : 0.55)

            Text(purchaseDisclosure)
                .font(YixiuTheme.sans(11, weight: .medium))
                .foregroundStyle(YixiuTheme.moon.opacity(0.92))
                .multilineTextAlignment(.center)
                .lineSpacing(3)
                .fixedSize(horizontal: false, vertical: true)

            if !subscriptionStore.isLoadingProducts && hasRequestedPrices && subscriptionStore.productsUnavailable {
                Button {
                    Task { await reloadPrices() }
                } label: {
                    Label(language.text(zh: "重新载入 Apple 价格", en: "Retry Apple prices"), systemImage: "arrow.clockwise")
                        .font(YixiuTheme.sans(12, weight: .medium))
                        .foregroundStyle(YixiuTheme.aqua)
                        .frame(minHeight: 44)
                }
                .buttonStyle(.plain)
                .disabled(subscriptionStore.isBusy)
                .accessibilityIdentifier("paywall.retryPrices")
            }
            if let resultMessage {
                Text(resultMessage)
                    .font(YixiuTheme.sans(11))
                    .foregroundStyle(YixiuTheme.mist)
                    .multilineTextAlignment(.center)
            }
        }
    }

    private var purchaseDisclosure: String {
        planSubtitle(selectedPlan)
    }

    private var legacyNote: some View {
        Text(language.text(
            zh: "已拥有一休 1.2 或更早版本的用户，原有 14 种自然声与功能继续保留；绿洲停歇、初息、10 首古典名曲及 5 首 AI 原创免费，其余音乐属于 Plus。",
            en: "If you owned Yixiu 1.2 or earlier, all 14 original nature sounds remain yours. Oasis Rest, First Breath, 10 classical works and 5 AI originals are free; the other music tracks require Plus."
        ))
        .font(YixiuTheme.sans(11))
        .foregroundStyle(YixiuTheme.mist.opacity(0.78))
        .multilineTextAlignment(.center)
        .lineSpacing(4)
        .padding(.horizontal, 8)
    }

    private var footer: some View {
        VStack(spacing: 13) {
            Button {
                Task { resultMessage = message(for: await subscriptionStore.restorePurchases()) }
            } label: {
                Text(language.text(zh: "恢复购买", en: "Restore Purchases"))
            }

            HStack(spacing: 18) {
                Link(language.text(zh: "隐私说明", en: "Privacy"), destination: URL(string: "https://yixiu.wonderelian.com/privacy.html")!)
                Link(language.text(zh: "使用条款", en: "Terms"), destination: URL(string: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")!)
                Button(language.text(zh: "管理订阅", en: "Manage")) {
                    openURL(URL(string: "https://apps.apple.com/account/subscriptions")!)
                }
            }
            .font(YixiuTheme.sans(10))
        }
        .font(YixiuTheme.sans(12, weight: .medium))
        .foregroundStyle(YixiuTheme.mist)
        .buttonStyle(.plain)
    }

    private func message(for result: SubscriptionActionResult) -> String? {
        switch result {
        case .purchased:
            language.text(zh: "欢迎来到一休 Plus。", en: "Welcome to Yixiu Plus.")
        case .restored:
            language.text(zh: "已恢复你的权益。", en: "Your access has been restored.")
        case .nothingToRestore:
            language.text(zh: "没有找到可恢复的订阅。", en: "No subscription was found to restore.")
        case .pending:
            language.text(zh: "购买等待确认，完成后会自动解锁。", en: "Purchase pending. Access will unlock after approval.")
        case .unavailable:
            language.text(zh: "商店暂时不可用，请稍后重试。", en: "The store is temporarily unavailable.")
        case .failed:
            language.text(zh: "购买未完成，请稍后重试。", en: "The purchase could not be completed.")
        case .cancelled:
            nil
        }
    }
}
#endif
