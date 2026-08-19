import Combine
import Foundation

@MainActor
final class AppState: ObservableObject {
    @Published var language: AppLanguage = .zh {
        didSet { defaults.set(language.rawValue, forKey: "language") }
    }
    @Published var scene: MeditationScene = .ocean {
        didSet { defaults.set(scene.rawValue, forKey: "scene") }
    }
    @Published var duration = 30 {
        didSet {
            defaults.set(duration, forKey: "duration")
            remainingSeconds = duration == 0 ? 0 : duration * 60
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

    private let audio = AmbientAudioEngine()
    private let defaults = UserDefaults.standard
    private var timer: Timer?
    private var hasStartedPlayback = false
    private var enforcedAccessLevel: YixiuAccessLevel?

    init() {
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
        if [0, 15, 30, 60].contains(savedDuration), defaults.object(forKey: "duration") != nil {
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
        if duration != 0, remainingSeconds == 0 {
            remainingSeconds = duration * 60
        }

        do {
            try audio.play(scene: scene, volume: Float(volume) * fadeFactor)
            audioError = nil
            sessionCompleted = false
            hasStartedPlayback = true
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
        guard [0, 15, 30, 60].contains(minutes) else { return }
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
    }

    func recordRecentScene(_ target: MeditationScene) {
        recentScenes = [target] + recentScenes.filter { $0 != target }.prefix(3)
    }

    func enforceAccessLevel(_ level: YixiuAccessLevel) {
        enforcedAccessLevel = level
    }

    private func canAccessScene(_ target: MeditationScene) -> Bool {
        guard let enforcedAccessLevel else { return true }
        return SubscriptionAccessPolicy.canAccess(scene: target, level: enforcedAccessLevel)
    }

    private func startTimer() {
        timer?.invalidate()
        timer = nil
        guard duration != 0 else { return }

        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in
            Task { @MainActor in
                guard let self else { return }
                if self.remainingSeconds > 1 {
                    self.remainingSeconds -= 1
                    self.audio.setVolume(Float(self.volume) * self.fadeFactor)
                    self.syncNowPlaying()
                } else {
                    self.remainingSeconds = 0
                    self.pause()
                    self.sessionCompleted = true
                }
            }
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
}
