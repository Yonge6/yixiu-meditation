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
    @Published var drawerOpen = false
    @Published var audioError: String?
    @Published var sessionCompleted = false

    private let audio = AmbientAudioEngine()
    private let defaults = UserDefaults.standard
    private var timer: Timer?

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
            isPlaying = true
            startTimer()
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
    }

    func selectScene(_ newScene: MeditationScene, autoplay: Bool = true) {
        scene = newScene
        if isPlaying || autoplay {
            do {
                try audio.play(scene: newScene, volume: Float(volume) * fadeFactor)
                audioError = nil
                isPlaying = true
                startTimer()
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
        duration = minutes
        if isPlaying {
            startTimer()
        }
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
                } else {
                    self.remainingSeconds = 0
                    self.pause()
                    self.sessionCompleted = true
                }
            }
        }
    }
}
