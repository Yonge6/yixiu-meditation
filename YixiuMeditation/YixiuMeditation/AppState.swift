import Combine
import Foundation

@MainActor
final class AppState: ObservableObject {
    @Published var language: AppLanguage = .en {
        didSet { defaults.set(language.rawValue, forKey: "language") }
    }
    @Published var scene: MeditationScene = .ocean {
        didSet { defaults.set(scene.rawValue, forKey: "scene") }
    }
    @Published var duration = 30 {
        didSet {
            defaults.set(duration, forKey: "duration")
            remainingSeconds = duration == 0 ? 0 : duration * 60
            playbackClock.reset(seconds: remainingSeconds)
        }
    }
    @Published var favorites: [MeditationScene] = [] {
        didSet { defaults.set(favorites.map(\.rawValue), forKey: "favorites") }
    }
    @Published var recentScenes: [MeditationScene] = [] {
        didSet { defaults.set(recentScenes.map(\.rawValue), forKey: "recentScenes") }
    }
    @Published var focusDuration = 1 {
        didSet { defaults.set(focusDuration, forKey: "focusDuration") }
    }
    @Published var focusSoundEnabled = false {
        didSet {
            defaults.set(focusSoundEnabled, forKey: "focusSoundEnabled")
            syncFocusSound()
        }
    }
    @Published var endBell = false {
        didSet {
            defaults.set(endBell, forKey: "endBell")
            if !endBell { audio.stopEndBell() }
        }
    }
    @Published var backgroundPlayback = true {
        didSet { defaults.set(backgroundPlayback, forKey: "backgroundPlayback") }
    }
    @Published var volume: Double = 0.72 {
        didSet {
            defaults.set(volume, forKey: "volume")
            audio.setVolume(Float(volume) * fadeFactor)
            audio.setEndBellVolume(Float(volume))
        }
    }
    @Published var isPlaying = false
    @Published var remainingSeconds = 30 * 60
    @Published var activeTab: RootTab = .listen {
        didSet { if activeTab != oldValue { ProductAnalytics.shared.event("tab_select", ["tab": activeTab.rawValue]) } }
    }
    @Published var audioError: String?
    @Published var sessionCompleted = false
    @Published private(set) var reviewRequestToken = 0
    @Published private(set) var practiceJournal: [PracticeEntry] = []
    @Published var focusRequestToken = 0
    @Published var focusRestMode: FocusRestMode = .breathing
    @Published private(set) var focusStatus: BreathingStatus = .idle
    @Published private(set) var focusElapsed = 0
    var isFocusActive = false {
        didSet {
            playbackClock.pause(now: now())
            if isPlaying { startTimer() }
        }
    }

    private let audio: AmbientAudioEngine
    private let defaults: UserDefaults
    private let now: () -> TimeInterval
    private var timer: Timer?
    private var playbackClock = PracticeCountdown(seconds: 30 * 60)
    private var hasStartedPlayback = false
    private var enforcedAccessLevel: YixiuAccessLevel?
    private var focusClock = PracticeCountdown(seconds: 60)
    private var focusTimer: Timer?
    private var practiceSceneID = ""
    private var originalAudioWasPlaying = false
    private var mayRestoreOriginalPlayback = true
    private var restIntent = "none"
    private var restEntryPoint = "sounds"
    private var preparedFocusRestIntent = "none"
    private var preparedFocusEntryPoint = "focus_breathing"
    private var lastAudioPauseTime: TimeInterval?
    private var startsNewRestOnPlay = true

    private enum EngagementKey {
        static let firstLaunchDate = "yixiu.engagement.firstLaunchDate"
        static let activeDays = "yixiu.engagement.activeDays"
        static let playbackStarts = "yixiu.engagement.playbackStarts"
        static let completedSessions = "yixiu.engagement.completedSessions"
        static let completedFocusSessions = "yixiu.engagement.completedFocusSessions"
        static let promptedVersion = "yixiu.engagement.reviewPromptedVersion"
    }

    init(defaults: UserDefaults = .standard,
         now: @escaping () -> TimeInterval = { Date.timeIntervalSinceReferenceDate },
         audio: AmbientAudioEngine? = nil) {
        self.defaults = defaults
        self.now = now
        self.audio = audio ?? AmbientAudioEngine()
        recordLaunch()

        if
            let savedLanguage = defaults.string(forKey: "language"),
            let restoredLanguage = AppLanguage(rawValue: savedLanguage)
        {
            language = restoredLanguage
        }

        if
            let savedScene = defaults.string(forKey: "scene"),
            let restoredScene = MeditationScene(rawValue: savedScene)
        {
            scene = restoredScene.isAvailable ? restoredScene : .ocean
        }

        let savedDuration = defaults.integer(forKey: "duration")
        if [0, 5, 15, 30, 60].contains(savedDuration), defaults.object(forKey: "duration") != nil {
            duration = savedDuration
            remainingSeconds = savedDuration == 0 ? 0 : savedDuration * 60
        }

        favorites = (defaults.stringArray(forKey: "favorites") ?? [])
            .compactMap(MeditationScene.init(rawValue:))
            .filter(\.isAvailable)
        recentScenes = (defaults.stringArray(forKey: "recentScenes") ?? [])
            .compactMap(MeditationScene.init(rawValue:))
            .filter(\.isAvailable)
        let savedFocusDuration = defaults.integer(forKey: "focusDuration")
        if [1, 3, 5, 10].contains(savedFocusDuration) {
            focusDuration = savedFocusDuration
        }
        if defaults.object(forKey: "focusSoundEnabled") != nil {
            focusSoundEnabled = defaults.bool(forKey: "focusSoundEnabled")
        }
        endBell = defaults.bool(forKey: "endBell")
        if defaults.object(forKey: "backgroundPlayback") != nil {
            backgroundPlayback = defaults.bool(forKey: "backgroundPlayback")
        }
        if defaults.object(forKey: "volume") != nil {
            volume = defaults.double(forKey: "volume")
        }
        playbackClock.reset(seconds: remainingSeconds)
        if let data = defaults.data(forKey: "yixiu.practiceJournal.v1"),
           let entries = try? JSONDecoder().decode([PracticeEntry].self, from: data) {
            practiceJournal = PracticeEntry.sanitized(entries).filter { MeditationScene(rawValue: $0.sceneID) != nil }
        }

        self.audio.onShouldPause = { [weak self] in
            Task { @MainActor in
                self?.handleAudioInterruption()
            }
        }
        self.audio.onPlay = { [weak self] in
            Task { @MainActor in
                guard let self else { return }
                if self.isFocusActive, self.focusStatus == .paused {
                    self.resumeFocusSession()
                } else {
                    self.play()
                }
            }
        }
        self.audio.onPause = { [weak self] in
            Task { @MainActor in
                guard let self else { return }
                if self.isFocusActive, self.focusStatus == .running {
                    self.pauseFocusSession(allowPlaybackRestoration: false)
                } else {
                    self.pause()
                }
            }
        }
        self.audio.onNext = { [weak self] in
            Task { @MainActor in self?.moveScene(1) }
        }
        self.audio.onPrevious = { [weak self] in
            Task { @MainActor in self?.moveScene(-1) }
        }
    }

    var formattedRemaining: String {
        guard duration != 0 else { return language.text(zh: "不限时", en: "UNLIMITED") }
        let minutes = remainingSeconds / 60
        let seconds = remainingSeconds % 60
        return String(format: "%02d:%02d", minutes, seconds)
    }

    var durationLabel: String {
        duration == 0
            ? language.text(zh: "不限时", en: "UNLIMITED")
            : "\(duration) \(language == .zh ? "分钟" : "MIN")"
    }

    var fadeFactor: Float {
        guard !isFocusActive else { return 1 }
        guard duration != 0, remainingSeconds <= 20 else { return 1 }
        return max(0, min(Float(remainingSeconds) / 20, 1))
    }

    func togglePlayback() {
        isPlaying ? pause() : play()
    }

    func play() {
        guard canAccessScene(scene),
              isFocusActive || SubscriptionAccessPolicy.canUseTimer(minutes: duration, level: enforcedAccessLevel ?? .free) else {
            pauseAudio()
            audioError = enforcedAccessLevel == nil
                ? language.text(zh: "正在确认购买权益，请稍后再试。", en: "Checking your access. Please try again shortly.")
                : language.text(zh: "升级一休 Plus 即可聆听这首音乐。", en: "Upgrade to Yixiu Plus to play this track.")
            isPlaying = false
            return
        }
        if duration != 0, remainingSeconds == 0 {
            remainingSeconds = duration * 60
            playbackClock.reset(seconds: remainingSeconds)
        }

        do {
            if !isFocusActive, startsNewRestOnPlay || lastAudioPauseTime.map({ now() - $0 >= 30 * 60 }) == true {
                ProductAnalytics.shared.beginRestSession(restIntent: restIntent, entryPoint: restEntryPoint)
            }
            try audio.play(scene: scene, volume: Float(volume) * fadeFactor)
            audioError = nil
            sessionCompleted = false
            hasStartedPlayback = true
            startsNewRestOnPlay = false
            lastAudioPauseTime = nil
            increment(EngagementKey.playbackStarts)
            recordRecentScene(scene)
            isPlaying = true
            startTimer()
            syncNowPlaying()
        } catch {
            pauseAudio()
            audioError = language.text(
                zh: "声音暂时无法播放，请检查音量或输出设备。",
                en: "Audio could not start. Check volume or the output device."
            )
            isPlaying = false
        }
    }

    func pause() {
        if isFocusActive, focusStatus == .running {
            pauseFocusSession()
            return
        }
        pauseAudio()
    }

    private func pauseAudio() {
        playbackClock.pause(now: now())
        remainingSeconds = playbackClock.secondsRemaining(now: now())
        audio.pause()
        timer?.invalidate()
        timer = nil
        isPlaying = false
        lastAudioPauseTime = now()
        syncNowPlaying()
    }

    func selectScene(_ newScene: MeditationScene, autoplay: Bool = true,
                     restIntent: String = "none", entryPoint: String = "sounds", startsRest: Bool = true) {
        guard canAccessScene(newScene) else { return }
        if isFocusActive || ((focusStatus == .running || focusStatus == .paused) && scene != newScene) {
            resetFocusSession()
        }
        if startsRest {
            self.restIntent = restIntent
            self.restEntryPoint = entryPoint
            ProductAnalytics.shared.beginRestSession(restIntent: restIntent, entryPoint: entryPoint)
            startsNewRestOnPlay = false
            preparedFocusRestIntent = "none"
            preparedFocusEntryPoint = "focus_breathing"
        }
        scene = newScene
        recordRecentScene(newScene)
        if isPlaying || autoplay {
            play()
        }
    }

    func moveScene(_ direction: Int) {
        guard let currentIndex = MeditationScene.homeScenes.firstIndex(of: scene) else { return }
        let nextIndex = currentIndex + direction
        guard MeditationScene.homeScenes.indices.contains(nextIndex) else { return }
        selectScene(MeditationScene.homeScenes[nextIndex], autoplay: isPlaying)
    }

    func canMoveScene(_ direction: Int) -> Bool {
        guard let currentIndex = MeditationScene.homeScenes.firstIndex(of: scene) else { return false }
        return MeditationScene.homeScenes.indices.contains(currentIndex + direction)
    }

    func selectDuration(_ minutes: Int) {
        guard [0, 5, 15, 30, 60].contains(minutes) else { return }
        guard SubscriptionAccessPolicy.canUseTimer(minutes: minutes, level: enforcedAccessLevel ?? .free) else { return }
        duration = minutes
        if isPlaying {
            startTimer()
        }
        syncNowPlaying()
    }

    func toggleFavorite(_ target: MeditationScene? = nil) {
        let target = target ?? scene
        ProductAnalytics.shared.event("favorite", ["scene_id": target.rawValue, "action": favorites.contains(target) ? "remove" : "add"])
        if let index = favorites.firstIndex(of: target) {
            favorites.remove(at: index)
        } else {
            favorites.append(target)
        }
    }

    func resetCompletedSession() {
        sessionCompleted = false
        remainingSeconds = duration == 0 ? 0 : duration * 60
        playbackClock.reset(seconds: remainingSeconds)
    }

    func playCompletionBell() {
        guard endBell else { return }
        do {
            try audio.playEndBell(volume: Float(volume))
        } catch {
            audioError = language.text(zh: "结束提示音暂时无法播放。", en: "The end bell could not be played.")
        }
    }

    func recordRecentScene(_ target: MeditationScene) {
        recentScenes = [target] + recentScenes.filter { $0 != target }.prefix(3)
    }

    func enforceAccessLevel(_ level: YixiuAccessLevel) {
        enforcedAccessLevel = level
        if !SubscriptionAccessPolicy.canAccess(scene: scene, level: level) {
            if isFocusActive {
                mayRestoreOriginalPlayback = false
                resetFocusSession()
            }
            pause()
            audio.stop()
            scene = .ocean
        }
        if !SubscriptionAccessPolicy.canUseTimer(minutes: duration, level: level) {
            selectDuration(30)
        }
        if !SubscriptionAccessPolicy.canUseFocus(minutes: focusDuration, level: level) {
            focusDuration = 1
            // A paused practice can have released audio ownership when its tab
            // disappeared. Invalidate that old clock as well as an active one.
            if isFocusActive || focusStatus == .running || focusStatus == .paused {
                resetFocusSession()
            }
        }
    }

    func recordCompletedSession(isFocus: Bool = false, seconds: Int? = nil, sceneID: String? = nil) {
        ProductAnalytics.shared.event(isFocus ? "focus_complete" : "timer_complete", ["scene_id": sceneID ?? scene.rawValue])
        let entry = PracticeEntry(sceneID: sceneID ?? scene.rawValue,
                                  seconds: seconds ?? duration * 60,
                                  kind: isFocus ? .breathing : .listening)
        practiceJournal = PracticeEntry.sanitized([entry] + practiceJournal)
        if let data = try? JSONEncoder().encode(practiceJournal) {
            defaults.set(data, forKey: "yixiu.practiceJournal.v1")
        }
        increment(EngagementKey.completedSessions)
        if isFocus {
            increment(EngagementKey.completedFocusSessions)
        }

        guard shouldOfferReview else { return }
        reviewRequestToken += 1
    }

    func markReviewRequestHandled() {
        defaults.set(appVersion, forKey: EngagementKey.promptedVersion)
    }

    private func canAccessScene(_ target: MeditationScene) -> Bool {
        guard target.isAvailable else { return false }
        // Free content remains usable while StoreKit checks the account. A saved
        // Plus scene stays selected, but cannot play until access is verified.
        return SubscriptionAccessPolicy.canAccess(scene: target, level: enforcedAccessLevel ?? .free)
    }

    private func startTimer() {
        timer?.invalidate()
        timer = nil
        guard duration != 0, !isFocusActive else { return }
        playbackClock.start(now: now())

        timer = Timer.scheduledTimer(withTimeInterval: 0.25, repeats: true) { [weak self] _ in
            Task { @MainActor in
                self?.reconcilePlayback()
            }
        }
    }

    func reconcilePlayback() {
        if focusStatus == .running { reconcileFocusSession() }
        guard isPlaying, duration != 0, !isFocusActive else { return }
        let remaining = playbackClock.secondsRemaining(now: now())
        guard remaining != remainingSeconds else { return }
        remainingSeconds = remaining
        if remaining == 0 {
            pause()
            audio.stop()
            recordCompletedSession()
            sessionCompleted = true
            startsNewRestOnPlay = true
            playCompletionBell()
        } else {
            audio.setVolume(Float(volume) * fadeFactor)
            syncNowPlaying()
        }
    }

    func startQuickListening(scene: MeditationScene, minutes: Int, restIntent: String = "none", entryPoint: String = "focus_quick", stayInFocus: Bool = false) {
        guard canAccessScene(scene) else { return }
        if let enforcedAccessLevel,
           !SubscriptionAccessPolicy.canUseTimer(minutes: minutes, level: enforcedAccessLevel) { return }
        pause()
        audio.stop()
        self.restIntent = restIntent
        self.restEntryPoint = entryPoint
        preparedFocusRestIntent = "none"
        preparedFocusEntryPoint = "focus_breathing"
        ProductAnalytics.shared.beginRestSession(restIntent: restIntent, entryPoint: entryPoint)
        startsNewRestOnPlay = false
        selectDuration(minutes)
        selectScene(scene, autoplay: false, startsRest: false)
        focusRestMode = stayInFocus ? .listening : .breathing
        activeTab = stayInFocus ? .focus : .listen
        play()
    }

    func prepareFocus(minutes: Int = 1, restIntent: String = "none", entryPoint: String = "focus_breathing") {
        resetFocusSession()
        if !canAccessScene(scene) { selectScene(.rain, autoplay: false, startsRest: false) }
        self.restIntent = restIntent
        self.restEntryPoint = entryPoint
        preparedFocusRestIntent = restIntent
        preparedFocusEntryPoint = entryPoint
        focusRestMode = .breathing
        focusDuration = minutes
        activeTab = .focus
        focusRequestToken += 1
    }

    func replay(_ entry: PracticeEntry) {
        guard let target = MeditationScene(rawValue: entry.sceneID), canAccessScene(target) else { return }
        if entry.kind == .breathing {
            selectScene(target, autoplay: false)
            prepareFocus(minutes: entry.seconds / 60, restIntent: "none", entryPoint: "continue")
        } else {
            startQuickListening(scene: target, minutes: entry.seconds / 60, restIntent: "none", entryPoint: "continue")
        }
    }

    private func syncNowPlaying() {
        guard hasStartedPlayback || isFocusActive else {
            audio.clearNowPlaying()
            return
        }
        let focusOwnsPlayback = isFocusActive && (focusStatus == .running || focusStatus == .paused)
        audio.updateNowPlaying(
            scene: scene,
            language: language,
            isPlaying: isPlaying && (!focusOwnsPlayback || focusStatus == .running),
            remainingSeconds: focusOwnsPlayback ? max(focusDuration * 60 - focusElapsed, 0) : remainingSeconds,
            durationMinutes: focusOwnsPlayback ? focusDuration : duration,
            canMovePrevious: !focusOwnsPlayback && canMoveScene(-1),
            canMoveNext: !focusOwnsPlayback && canMoveScene(1)
        )
    }

    func enteredBackground() {
        guard !backgroundPlayback else { return }
        if isFocusActive, focusStatus == .running {
            pauseFocusSession(allowPlaybackRestoration: false)
        } else {
            pauseAudio()
        }
        audio.stopEndBell()
    }

    func handleAudioInterruption() {
        // Explicit silence is a valid breathing practice, not an audio error.
        // Only a practice using sound is interrupted by an audio-session event.
        if isFocusActive, focusStatus == .running, focusSoundEnabled {
            pauseFocusSession(allowPlaybackRestoration: false)
        } else if !isFocusActive {
            pauseAudio()
        }
    }

    @discardableResult
    func beginFocusSession() -> Bool {
        guard canAccessScene(scene),
              SubscriptionAccessPolicy.canUseFocus(minutes: focusDuration, level: enforcedAccessLevel ?? .free) else { return false }
        resetFocusSession()
        ProductAnalytics.shared.beginRestSession(restIntent: preparedFocusRestIntent, entryPoint: preparedFocusEntryPoint)
        practiceSceneID = scene.rawValue
        originalAudioWasPlaying = isPlaying
        mayRestoreOriginalPlayback = true
        isFocusActive = true
        focusClock.reset(seconds: focusDuration * 60)
        focusElapsed = 0
        guard acquireFocusSound() else {
            isFocusActive = false
            return false
        }
        focusStatus = .running
        focusClock.start(now: now())
        startFocusTimer()
        syncNowPlaying()
        ProductAnalytics.shared.event("focus_start", ["scene_id": practiceSceneID, "focus_minutes": focusDuration])
        return true
    }

    func pauseFocusSession(allowPlaybackRestoration: Bool = true) {
        guard focusStatus == .running else { return }
        focusClock.pause(now: now())
        focusElapsed = focusDuration * 60 - focusClock.secondsRemaining(now: now())
        focusStatus = .paused
        focusTimer?.invalidate()
        focusTimer = nil
        if !allowPlaybackRestoration { mayRestoreOriginalPlayback = false }
        pauseAudio()
        ProductAnalytics.shared.event("focus_pause", ["scene_id": practiceSceneID])
    }

    @discardableResult
    func resumeFocusSession() -> Bool {
        guard focusStatus == .paused, practiceSceneID == scene.rawValue,
              canAccessScene(scene),
              SubscriptionAccessPolicy.canUseFocus(minutes: focusDuration, level: enforcedAccessLevel ?? .free) else { return false }
        if !isFocusActive { originalAudioWasPlaying = isPlaying }
        isFocusActive = true
        mayRestoreOriginalPlayback = true
        guard acquireFocusSound() else { return false }
        focusStatus = .running
        focusClock.start(now: now())
        startFocusTimer()
        syncNowPlaying()
        ProductAnalytics.shared.event("focus_resume", ["scene_id": practiceSceneID])
        return true
    }

    func leaveFocusSession() {
        if focusStatus == .running { pauseFocusSession() }
        restoreListeningAfterFocus()
    }

    func resetFocusSession() {
        if focusStatus == .running || focusStatus == .paused {
            ProductAnalytics.shared.event("focus_exit", ["scene_id": practiceSceneID])
        }
        focusTimer?.invalidate()
        focusTimer = nil
        focusClock.reset(seconds: focusDuration * 60)
        focusElapsed = 0
        focusStatus = .idle
        restoreListeningAfterFocus()
        practiceSceneID = ""
    }

    func syncFocusSound() {
        guard isFocusActive, focusStatus == .running else { return }
        if !acquireFocusSound() { pauseFocusSession(allowPlaybackRestoration: false) }
        syncNowPlaying()
    }

    private func acquireFocusSound() -> Bool {
        if focusSoundEnabled {
            if !isPlaying { play() }
            else { audio.setVolume(Float(volume)) }
            return isPlaying
        }
        if isPlaying { pauseAudio() }
        return true
    }

    private func startFocusTimer() {
        focusTimer?.invalidate()
        focusTimer = Timer.scheduledTimer(withTimeInterval: 0.25, repeats: true) { [weak self] _ in
            Task { @MainActor in self?.reconcileFocusSession() }
        }
    }

    private func reconcileFocusSession() {
        guard focusStatus == .running else { return }
        focusElapsed = focusDuration * 60 - focusClock.secondsRemaining(now: now())
        syncNowPlaying()
        guard focusElapsed >= focusDuration * 60 else { return }
        focusClock.pause(now: now())
        focusTimer?.invalidate()
        focusTimer = nil
        focusStatus = .complete
        ProductAnalytics.shared.recordMeaningfulRest(kind: "breathing")
        recordCompletedSession(isFocus: true, seconds: focusDuration * 60, sceneID: practiceSceneID)
        restoreListeningAfterFocus()
        playCompletionBell()
    }

    private func restoreListeningAfterFocus() {
        guard isFocusActive else { return }
        isFocusActive = false
        if originalAudioWasPlaying, mayRestoreOriginalPlayback {
            if !isPlaying { play() }
        } else if isPlaying {
            pauseAudio()
        }
        audio.setVolume(Float(volume) * fadeFactor)
        syncNowPlaying()
    }

    private var appVersion: String {
        Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "unknown"
    }

    private var shouldOfferReview: Bool {
        let completedSessions = defaults.integer(forKey: EngagementKey.completedSessions)
        let activeDays = defaults.stringArray(forKey: EngagementKey.activeDays)?.count ?? 0
        let promptedVersion = defaults.string(forKey: EngagementKey.promptedVersion)
        return completedSessions >= 3 && activeDays >= 2 && promptedVersion != appVersion
    }

    private func increment(_ key: String) {
        defaults.set(defaults.integer(forKey: key) + 1, forKey: key)
    }

    private func recordLaunch() {
        if defaults.object(forKey: EngagementKey.firstLaunchDate) == nil {
            defaults.set(Date(), forKey: EngagementKey.firstLaunchDate)
        }

        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withFullDate]
        let today = formatter.string(from: Date())
        var activeDays = defaults.stringArray(forKey: EngagementKey.activeDays) ?? []
        if !activeDays.contains(today) {
            activeDays.append(today)
            defaults.set(Array(activeDays.suffix(90)), forKey: EngagementKey.activeDays)
        }
    }
}
