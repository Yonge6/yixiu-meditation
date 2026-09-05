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
        didSet { defaults.set(focusSoundEnabled, forKey: "focusSoundEnabled") }
    }
    @Published var endBell = false {
        didSet { defaults.set(endBell, forKey: "endBell") }
    }
    @Published var backgroundPlayback = true {
        didSet { defaults.set(backgroundPlayback, forKey: "backgroundPlayback") }
    }
    @Published var volume: Double = 0.72 {
        didSet {
            defaults.set(volume, forKey: "volume")
            audio.setVolume(Float(volume) * fadeFactor)
        }
    }
    @Published var isPlaying = false
    @Published var remainingSeconds = 30 * 60
    @Published var activeTab: RootTab = .listen
    @Published var audioError: String?
    @Published var sessionCompleted = false
    @Published private(set) var reviewRequestToken = 0
    @Published private(set) var practiceJournal: [PracticeEntry] = []
    @Published var focusRequestToken = 0
    var isFocusActive = false {
        didSet {
            playbackClock.pause(now: now())
            if isPlaying { startTimer() }
        }
    }

    private let audio = AmbientAudioEngine()
    private let defaults: UserDefaults
    private let now: () -> TimeInterval
    private var timer: Timer?
    private var playbackClock = PracticeCountdown(seconds: 30 * 60)
    private var hasStartedPlayback = false
    private var enforcedAccessLevel: YixiuAccessLevel?

    private enum EngagementKey {
        static let firstLaunchDate = "yixiu.engagement.firstLaunchDate"
        static let activeDays = "yixiu.engagement.activeDays"
        static let playbackStarts = "yixiu.engagement.playbackStarts"
        static let completedSessions = "yixiu.engagement.completedSessions"
        static let completedFocusSessions = "yixiu.engagement.completedFocusSessions"
        static let promptedVersion = "yixiu.engagement.reviewPromptedVersion"
    }

    init(defaults: UserDefaults = .standard, now: @escaping () -> TimeInterval = { Date.timeIntervalSinceReferenceDate }) {
        self.defaults = defaults
        self.now = now
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
            scene = restoredScene
        }

        let savedDuration = defaults.integer(forKey: "duration")
        if [0, 5, 15, 30, 60].contains(savedDuration), defaults.object(forKey: "duration") != nil {
            duration = savedDuration
            remainingSeconds = savedDuration == 0 ? 0 : savedDuration * 60
        }

        favorites = (defaults.stringArray(forKey: "favorites") ?? [])
            .compactMap(MeditationScene.init(rawValue:))
        recentScenes = (defaults.stringArray(forKey: "recentScenes") ?? [])
            .compactMap(MeditationScene.init(rawValue:))
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

        audio.onShouldPause = { [weak self] in
            Task { @MainActor in
                self?.pause()
            }
        }
        audio.onPlay = { [weak self] in
            Task { @MainActor in self?.play() }
        }
        audio.onPause = { [weak self] in
            Task { @MainActor in self?.pause() }
        }
        audio.onNext = { [weak self] in
            Task { @MainActor in self?.moveScene(1) }
        }
        audio.onPrevious = { [weak self] in
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
        guard duration != 0, remainingSeconds <= 20 else { return 1 }
        return max(0, min(Float(remainingSeconds) / 20, 1))
    }

    func togglePlayback() {
        isPlaying ? pause() : play()
    }

    func play() {
        guard canAccessScene(scene) else {
            audioError = language.text(zh: "升级一休 Plus 即可聆听这首音乐。", en: "Upgrade to Yixiu Plus to play this track.")
            isPlaying = false
            return
        }
        if duration != 0, remainingSeconds == 0 {
            remainingSeconds = duration * 60
            playbackClock.reset(seconds: remainingSeconds)
        }

        do {
            try audio.play(scene: scene, volume: Float(volume) * fadeFactor)
            audioError = nil
            sessionCompleted = false
            hasStartedPlayback = true
            increment(EngagementKey.playbackStarts)
            recordRecentScene(scene)
            isPlaying = true
            startTimer()
            syncNowPlaying()
        } catch {
            audioError = language.text(
                zh: "声音暂时无法播放，请检查音量或输出设备。",
                en: "Audio could not start. Check volume or the output device."
            )
            isPlaying = false
        }
    }

    func pause() {
        playbackClock.pause(now: now())
        remainingSeconds = playbackClock.secondsRemaining(now: now())
        audio.stop()
        timer?.invalidate()
        timer = nil
        isPlaying = false
        syncNowPlaying()
    }

    func selectScene(_ newScene: MeditationScene, autoplay: Bool = true) {
        guard canAccessScene(newScene) else { return }
        scene = newScene
        recordRecentScene(newScene)
        if isPlaying || autoplay {
            do {
                try audio.play(scene: newScene, volume: Float(volume) * fadeFactor)
                audioError = nil
                isPlaying = true
                startTimer()
                hasStartedPlayback = true
                increment(EngagementKey.playbackStarts)
                syncNowPlaying()
            } catch {
                pause()
                audioError = language.text(zh: "该声音暂时无法播放。", en: "This sound could not be played.")
            }
        }
    }

    func moveScene(_ direction: Int) {
        guard let currentIndex = MeditationScene.allCases.firstIndex(of: scene) else { return }
        let nextIndex = currentIndex + direction
        guard MeditationScene.allCases.indices.contains(nextIndex) else { return }
        selectScene(MeditationScene.allCases[nextIndex], autoplay: isPlaying)
    }

    func canMoveScene(_ direction: Int) -> Bool {
        guard let currentIndex = MeditationScene.allCases.firstIndex(of: scene) else { return false }
        return MeditationScene.allCases.indices.contains(currentIndex + direction)
    }

    func selectDuration(_ minutes: Int) {
        guard [0, 5, 15, 30, 60].contains(minutes) else { return }
        if let enforcedAccessLevel,
           !SubscriptionAccessPolicy.canUseTimer(minutes: minutes, level: enforcedAccessLevel) {
            return
        }
        duration = minutes
        if isPlaying {
            startTimer()
        }
        syncNowPlaying()
    }

    func toggleFavorite(_ target: MeditationScene? = nil) {
        let target = target ?? scene
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

    func recordRecentScene(_ target: MeditationScene) {
        recentScenes = [target] + recentScenes.filter { $0 != target }.prefix(3)
    }

    func enforceAccessLevel(_ level: YixiuAccessLevel) {
        enforcedAccessLevel = level
        if !SubscriptionAccessPolicy.canAccess(scene: scene, level: level) {
            pause()
            scene = .ocean
        }
    }

    func recordCompletedSession(isFocus: Bool = false, seconds: Int? = nil, sceneID: String? = nil) {
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
        guard let enforcedAccessLevel else { return true }
        return SubscriptionAccessPolicy.canAccess(scene: target, level: enforcedAccessLevel)
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
        guard isPlaying, duration != 0, !isFocusActive else { return }
        let remaining = playbackClock.secondsRemaining(now: now())
        guard remaining != remainingSeconds else { return }
        remainingSeconds = remaining
        if remaining == 0 {
            pause()
            recordCompletedSession()
            sessionCompleted = true
        } else {
            audio.setVolume(Float(volume) * fadeFactor)
            syncNowPlaying()
        }
    }

    func startQuickListening(scene: MeditationScene, minutes: Int) {
        guard canAccessScene(scene) else { return }
        if let enforcedAccessLevel,
           !SubscriptionAccessPolicy.canUseTimer(minutes: minutes, level: enforcedAccessLevel) { return }
        pause()
        selectDuration(minutes)
        selectScene(scene, autoplay: false)
        activeTab = .listen
        play()
    }

    func prepareFocus(minutes: Int = 1) {
        focusDuration = minutes
        activeTab = .focus
        focusRequestToken += 1
    }

    func replay(_ entry: PracticeEntry) {
        guard let target = MeditationScene(rawValue: entry.sceneID), canAccessScene(target) else { return }
        if entry.kind == .breathing {
            selectScene(target, autoplay: false)
            prepareFocus(minutes: entry.seconds / 60)
        } else {
            startQuickListening(scene: target, minutes: entry.seconds / 60)
        }
    }

    private func syncNowPlaying() {
        guard hasStartedPlayback else { return }
        audio.updateNowPlaying(
            scene: scene,
            language: language,
            isPlaying: isPlaying,
            remainingSeconds: remainingSeconds,
            durationMinutes: duration,
            canMovePrevious: canMoveScene(-1),
            canMoveNext: canMoveScene(1)
        )
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
