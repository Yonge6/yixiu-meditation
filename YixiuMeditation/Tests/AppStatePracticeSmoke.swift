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
    var playCount = 0
    var pauseCount = 0
    var stopCount = 0
    var failPlayback = false
    var nowPlaying: (playing: Bool, remaining: Int, minutes: Int)?
    func play(scene: MeditationScene, volume: Float) throws {
        playCount += 1
        if failPlayback { throw CocoaError(.fileReadUnknown) }
    }
    func pause() { pauseCount += 1 }
    func stop() { stopCount += 1 }
    func stopEndBell() {}
    func setEndBellVolume(_ value: Float) {}
    func playEndBell(volume: Float) throws {}
    func clearNowPlaying() { nowPlaying = nil }
    func updateNowPlaying(scene: MeditationScene, language: AppLanguage, isPlaying: Bool,
                          remainingSeconds: Int, durationMinutes: Int, canMovePrevious: Bool, canMoveNext: Bool) {
        nowPlaying = (isPlaying, remainingSeconds, durationMinutes)
    }
}

final class ProductAnalytics {
    static let shared = ProductAnalytics()
    func event(_ name: String, _ parameters: [String: Any] = [:]) {}
    private(set) var restIntent = "none"
    private(set) var entryPoint = "sounds"
    private(set) var meaningfulKinds: [String] = []
    func beginRestSession(restIntent: String, entryPoint: String) {
        self.restIntent = restIntent; self.entryPoint = entryPoint
    }
    func recordMeaningfulRest(kind: String) { meaningfulKinds.append(kind) }
}

@main
enum AppStatePracticeSmoke {
    @MainActor static func main() {
        let suite = "com.health.yixiu.tests.\(UUID().uuidString)"
        let defaults = UserDefaults(suiteName: suite)!
        defer { defaults.removePersistentDomain(forName: suite) }
        var now: TimeInterval = 100
        let audio = AmbientAudioEngine()
        let state = AppState(defaults: defaults, now: { now }, audio: audio)
        state.enforceAccessLevel(.free)
        state.focusSoundEnabled = false
        state.startQuickListening(scene: .lake, minutes: 15, restIntent: "lunch", entryPoint: "focus_quick", stayInFocus: true)
        precondition(state.scene == .lake && state.duration == 15 && state.isPlaying)
        precondition(state.activeTab == .focus && state.focusRestMode == .listening)
        precondition(ProductAnalytics.shared.restIntent == "lunch" && ProductAnalytics.shared.entryPoint == "focus_quick")
        precondition(!state.focusSoundEnabled, "Listening presets must not change the explicit silent breathing preference")
        state.startQuickListening(scene: .window, minutes: 15, restIntent: "night_waking", entryPoint: "focus_quick", stayInFocus: true)
        precondition(state.scene == .window && state.isPlaying && !state.endBell)
        precondition(state.activeTab == .focus && state.focusRestMode == .listening)
        state.prepareFocus(minutes: 1, restIntent: "work_break", entryPoint: "focus_quick")
        precondition(state.focusDuration == 1 && !state.focusSoundEnabled)
        precondition(state.activeTab == .focus && state.focusRestMode == .breathing)
        precondition(state.beginFocusSession())
        precondition(ProductAnalytics.shared.restIntent == "work_break")
        state.resetFocusSession()
        state.pause()
        let pauseCountBeforeMainTest = audio.pauseCount
        state.startQuickListening(scene: .birds, minutes: 5)
        precondition(state.scene == .birds && state.duration == 5 && state.isPlaying)
        now += 90.25
        state.reconcilePlayback()
        precondition(state.remainingSeconds == 210)
        state.pause()
        let stopCountBeforeResume = audio.stopCount
        precondition(audio.pauseCount == pauseCountBeforeMainTest + 2) // quick-session setup, then explicit pause
        now += 600
        state.play()
        precondition(audio.stopCount == stopCountBeforeResume, "Pause/resume must not stop or release the media player")
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

        // Entering the background only pauses when the preference is off.
        state.startQuickListening(scene: .rain, minutes: 5)
        state.backgroundPlayback = true
        state.enteredBackground()
        precondition(state.isPlaying)
        state.backgroundPlayback = false
        state.enteredBackground()
        precondition(!state.isPlaying)

        // Saved member content is preserved, but cannot play before StoreKit
        // finishes verifying access. Verified Plus restores that exact scene.
        defaults.set(MeditationScene.nocturne.rawValue, forKey: "scene")
        defaults.set(60, forKey: "duration")
        let gatedAudio = AmbientAudioEngine()
        let gated = AppState(defaults: defaults, now: { now }, audio: gatedAudio)
        precondition(gated.scene == .nocturne && gated.duration == 60)
        gated.play()
        precondition(!gated.isPlaying && gatedAudio.playCount == 0)
        precondition(defaults.string(forKey: "scene") == MeditationScene.nocturne.rawValue)
        gated.enforceAccessLevel(.plus)
        precondition(gated.scene == .nocturne && gated.duration == 60)
        gated.play()
        precondition(gated.isPlaying)
        gated.enforceAccessLevel(.free)
        precondition(gated.scene == .ocean && gated.duration == 30 && !gated.isPlaying)

        // Focus and audio share one pause path; a call cannot create a completed
        // practice while the sound is interrupted, or restart sound on exit.
        state.backgroundPlayback = true
        state.startQuickListening(scene: .rain, minutes: 5)
        state.focusSoundEnabled = true
        precondition(state.beginFocusSession())
        now += 20
        state.reconcilePlayback()
        precondition(state.focusElapsed == 20 && state.focusStatus == .running)
        precondition(audio.nowPlaying?.minutes == 1 && audio.nowPlaying?.remaining == 40)
        let journalBeforeInterruption = state.practiceJournal.count
        state.handleAudioInterruption()
        precondition(state.focusStatus == .paused && !state.isPlaying)
        now += 120
        state.reconcilePlayback()
        precondition(state.focusElapsed == 20 && state.practiceJournal.count == journalBeforeInterruption)
        state.leaveFocusSession()
        precondition(!state.isPlaying && audio.nowPlaying?.minutes == 5)
        precondition(state.resumeFocusSession())
        now += 40
        state.reconcilePlayback()
        precondition(state.focusStatus == .complete && state.practiceJournal.count == journalBeforeInterruption + 1)
        state.reconcilePlayback()
        precondition(state.practiceJournal.count == journalBeforeInterruption + 1)
        precondition(audio.nowPlaying?.minutes == 5)

        // Turning scene sound off intentionally is not an interruption. Even
        // audio-session events must leave an explicitly silent practice alone.
        state.pause()
        state.focusSoundEnabled = false
        precondition(state.beginFocusSession())
        now += 15
        state.handleAudioInterruption()
        state.reconcilePlayback()
        precondition(state.focusStatus == .running && state.focusElapsed == 15 && !state.isPlaying)
        state.focusSoundEnabled = true
        precondition(state.focusStatus == .running && state.isPlaying)
        state.focusSoundEnabled = false
        precondition(state.focusStatus == .running && !state.isPlaying)
        state.backgroundPlayback = false
        state.enteredBackground()
        precondition(state.focusStatus == .paused)
        now += 120
        state.reconcilePlayback()
        precondition(state.focusElapsed == 15)
        state.resetFocusSession()

        // A failed Focus audio start must not start a countdown or create a record.
        audio.failPlayback = true
        state.focusSoundEnabled = true
        let journalBeforeFailure = state.practiceJournal.count
        precondition(!state.beginFocusSession())
        now += 120
        state.reconcilePlayback()
        precondition(state.focusStatus == .idle && !state.isPlaying && state.practiceJournal.count == journalBeforeFailure)

        let silentAudio = AmbientAudioEngine()
        let silentDefaults = UserDefaults(suiteName: suite + ".silent")!
        defer { silentDefaults.removePersistentDomain(forName: suite + ".silent") }
        let silent = AppState(defaults: silentDefaults, now: { now }, audio: silentAudio)
        silent.enforceAccessLevel(.free)
        precondition(silent.beginFocusSession())
        precondition(silentAudio.nowPlaying?.minutes == 1)
        silent.leaveFocusSession()
        precondition(silentAudio.nowPlaying == nil, "Silent practice without previous audio must not leave stale lock-screen media")

        // A long Plus practice remains paused after leaving Focus. Downgrading
        // must invalidate its old clock even though it no longer owns audio.
        let downgradeAudio = AmbientAudioEngine()
        let downgradeDefaults = UserDefaults(suiteName: suite + ".downgrade")!
        defer { downgradeDefaults.removePersistentDomain(forName: suite + ".downgrade") }
        let downgrade = AppState(defaults: downgradeDefaults, now: { now }, audio: downgradeAudio)
        downgrade.enforceAccessLevel(.plus)
        downgrade.focusDuration = 5
        precondition(downgrade.beginFocusSession())
        now += 30
        downgrade.reconcilePlayback()
        downgrade.leaveFocusSession()
        precondition(downgrade.focusStatus == .paused && !downgrade.isFocusActive)
        downgrade.enforceAccessLevel(.free)
        precondition(downgrade.focusDuration == 1 && downgrade.focusStatus == .idle && downgrade.focusElapsed == 0)
        precondition(!downgrade.resumeFocusSession(), "The former Plus countdown must not resume as a Free practice")
        precondition(downgrade.beginFocusSession())
        now += 2
        downgrade.reconcilePlayback()
        precondition(downgrade.focusElapsed == 2)
        now += 58
        downgrade.reconcilePlayback()
        precondition(downgrade.focusStatus == .complete && downgrade.practiceJournal.last?.seconds == 60)
        print("APP_STATE_RELIABILITY_PASS: retained-player pause/resume, background preference, saved Plus scene gated until verified, Focus interruption/explicit silence, shared lock-screen clocks, audio failure and no duplicate records.")
    }
}
