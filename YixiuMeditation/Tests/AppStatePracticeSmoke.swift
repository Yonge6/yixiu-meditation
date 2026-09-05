import Foundation

// Isolates state transitions from AVAudioSession, StoreKit and real user preferences.
@MainActor
final class AmbientAudioEngine {
    var onShouldPause: (() -> Void)?
    var onPlay: (() -> Void)?
    var onPause: (() -> Void)?
    var onNext: (() -> Void)?
    var onPrevious: (() -> Void)?
    func setVolume(_ value: Float) {}
    func play(scene: MeditationScene, volume: Float) throws {}
    func stop() {}
    func updateNowPlaying(scene: MeditationScene, language: AppLanguage, isPlaying: Bool,
                          remainingSeconds: Int, durationMinutes: Int, canMovePrevious: Bool, canMoveNext: Bool) {}
}

@main
enum AppStatePracticeSmoke {
    @MainActor static func main() {
        let suite = "com.health.yixiu.tests.\(UUID().uuidString)"
        let defaults = UserDefaults(suiteName: suite)!
        defer { defaults.removePersistentDomain(forName: suite) }
        var now: TimeInterval = 100
        let state = AppState(defaults: defaults, now: { now })
        state.enforceAccessLevel(.free)
        state.startQuickListening(scene: .birds, minutes: 5)
        precondition(state.scene == .birds && state.duration == 5 && state.isPlaying)
        now += 90.25
        state.reconcilePlayback()
        precondition(state.remainingSeconds == 210)
        state.pause()
        now += 600
        state.play()
        now += 9.75
        state.reconcilePlayback()
        precondition(state.remainingSeconds == 200)
        state.selectScene(.rain)
        now += 200
        state.reconcilePlayback()
        state.reconcilePlayback()
        precondition(!state.isPlaying && state.practiceJournal.count == 1)
        precondition(state.practiceJournal[0].seconds == 300)

        state.startQuickListening(scene: .rain, minutes: 15)
        now += 100
        state.selectDuration(15)
        now += 60
        state.reconcilePlayback()
        precondition(state.remainingSeconds == 840)
        state.isFocusActive = true
        now += 1200
        state.reconcilePlayback()
        precondition(state.practiceJournal.count == 1)
        state.recordCompletedSession(isFocus: true, seconds: 60, sceneID: "stream")
        state.isFocusActive = false
        state.reconcilePlayback()
        precondition(state.remainingSeconds == 840 && state.practiceJournal.count == 2)
        state.pause()
        let restored = AppState(defaults: defaults)
        precondition(restored.practiceJournal.count == 2)
        restored.prepareFocus()
        precondition(restored.activeTab == .focus && restored.focusDuration == 1 && !restored.isPlaying)
        precondition(SubscriptionAccessPolicy.canUseTimer(minutes: 5, level: .free))
        precondition(!SubscriptionAccessPolicy.canUseTimer(minutes: 60, level: .free))
        print("AppState practice smoke passed: delayed ticks, fractional pause, same-duration reset, no double count, persistence, free presets and silent focus route.")
    }
}
