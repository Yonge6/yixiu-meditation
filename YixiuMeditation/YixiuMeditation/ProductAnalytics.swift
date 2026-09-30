import Foundation
import StoreKit
import AVFoundation
import FirebaseCore
import FirebaseAnalytics

/// No configuration, no consent or no verified production install => no collection.
/// Never forward journal entries, account identity, transaction IDs or free text.
final class ProductAnalytics {
    static let shared = ProductAnalytics()
    static let consentKey = "yixiu.analyticsConsent.v2"
    static let consentChanged = Notification.Name("yixiu.analyticsConsentChanged")
    private var configured = false
    private var configuring = false
    private var productionInstall = false
    private var enabled: Bool { configured && productionInstall && UserDefaults.standard.bool(forKey: Self.consentKey) }

    @MainActor func configure() async {
#if DEBUG || YIXIU_INTERNAL_PLUS || targetEnvironment(simulator)
        return
#else
        guard !configured, !configuring, UserDefaults.standard.bool(forKey: Self.consentKey) else { return }
        configuring = true
        defer { configuring = false }
        guard let path = Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist"),
              let options = FirebaseOptions(contentsOfFile: path),
              options.bundleID == Bundle.main.bundleIdentifier,
              case .verified(let transaction) = try? await AppTransaction.shared,
              transaction.environment == .production,
              UserDefaults.standard.bool(forKey: Self.consentKey) else { return }
        productionInstall = true
        FirebaseApp.configure(options: options)
        configured = true
        updateConsent()
#endif
    }

    func updateConsent() {
        if !configured && UserDefaults.standard.bool(forKey: Self.consentKey) {
            Task { @MainActor in await self.configure() }
        }
        if configured {
            Analytics.setConsent([.analyticsStorage: enabled ? .granted : .denied,
                                  .adStorage: .denied, .adUserData: .denied, .adPersonalization: .denied])
            Analytics.setAnalyticsCollectionEnabled(enabled)
            if !enabled { Analytics.resetAnalyticsData() }
        }
        NotificationCenter.default.post(name: Self.consentChanged, object: nil)
    }

    func event(_ name: String, _ parameters: [String: Any] = [:]) {
        guard enabled else { return }
        let allowed: Set<String> = ["scene_id", "content_category", "access_level", "value", "listened_seconds", "end_reason", "error_code", "action", "filter", "timer_minutes", "focus_minutes", "plan", "tab"]
        var safe = parameters.filter { allowed.contains($0.key) }
        safe["schema_version"] = 2
        safe["surface"] = "ios"
        Analytics.logEvent("yixiu_v2_" + name, parameters: safe)
    }

    func verifiedPurchase(_ transaction: StoreKit.Transaction, plan: YixiuPlusPlan) {
        guard enabled, transaction.environment == .production else { return }
        // Idempotency is local only. No Apple transaction identifier leaves this device.
        let key = "yixiu.analytics.verifiedPurchases"
        var seen = UserDefaults.standard.stringArray(forKey: key) ?? []
        let id = String(transaction.id)
        guard !seen.contains(id) else { return }
        event("purchase_verified", ["plan": plan.rawValue])
        seen.append(id)
        UserDefaults.standard.set(Array(seen.suffix(100)), forKey: key)
    }

    func observe(_ player: AVAudioPlayer, scene: MeditationScene) -> AudioUsageObserver {
        AudioUsageObserver(player: player, scene: scene, isEnabled: { [weak self] in self?.enabled == true })
    }
}

final class AudioUsageObserver {
    private weak var player: AVAudioPlayer?
    private let scene: MeditationScene
    private let isEnabled: () -> Bool
    private var clock = ListeningProgress()
    private var timer: Timer?
    private var consentToken: NSObjectProtocol?
    private var pending = 0.0
    private var total = 0.0
    private var qualified = false
    private var started = false
    private var stopped = false

    init(player: AVAudioPlayer, scene: MeditationScene, isEnabled: @escaping () -> Bool) {
        self.player = player; self.scene = scene; self.isEnabled = isEnabled
        sample()
        timer = Timer.scheduledTimer(withTimeInterval: 5, repeats: true) { [weak self] _ in self?.sample() }
        consentToken = NotificationCenter.default.addObserver(forName: ProductAnalytics.consentChanged, object: nil, queue: .main) { [weak self] _ in
            guard let self else { return }
            self.clock.reset(); self.pending = 0; self.total = 0; self.qualified = false; self.started = false
            self.sample()
        }
    }

    private func emit(_ name: String, _ extra: [String: Any] = [:]) {
        var context: [String: Any] = ["scene_id": scene.rawValue,
            "content_category": scene.matches(.classical) ? "classical" : (scene.isMeditationMusic ? "meditation" : "nature"),
            "access_level": SubscriptionAccessPolicy.freeScenes.contains(scene) ? "free" : "plus"]
        context.merge(extra) { _, new in new }
        ProductAnalytics.shared.event(name, context)
    }

    private func sample() {
        guard isEnabled(), let player else { clock.reset(); return }
        if player.isPlaying && !started { started = true; emit("playback_start") }
        let delta = clock.sample(position: player.currentTime, at: ProcessInfo.processInfo.systemUptime,
                                 duration: player.duration, rate: Double(player.rate))
        pending += delta; total += delta
        if total >= 60 && !qualified { qualified = true; emit("qualified_listen") }
        if pending >= 30 { flush() }
        if !player.isPlaying { clock.reset() }
    }

    private func flush() {
        if pending >= 0.1 { emit("listen_time", ["value": (pending * 100).rounded() / 100]); pending = 0 }
    }

    func stop(reason: String) {
        guard !stopped else { return }
        sample(); flush(); stopped = true
        if started { emit("playback_end", ["listened_seconds": Int(total), "end_reason": reason]) }
        timer?.invalidate(); timer = nil
        if let consentToken { NotificationCenter.default.removeObserver(consentToken) }
        consentToken = nil
    }
    deinit { timer?.invalidate(); if let consentToken { NotificationCenter.default.removeObserver(consentToken) } }
}
