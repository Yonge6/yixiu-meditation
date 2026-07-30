import Combine
import Foundation

@MainActor
final class AppState: ObservableObject {
    @Published var language: AppLanguage = .zh {
        didSet { defaults.set(language.rawValue, forKey: "language") }
    }
    @Published var scene: MeditationScene = .morning {
        didSet { defaults.set(scene.rawValue, forKey: "scene") }
    }
    @Published var duration = 15 {
        didSet { defaults.set(duration, forKey: "duration") }
    }
    @Published var isPlaying = false
    @Published var remainingSeconds = 15 * 60
    @Published var activeTab: RootTab = .listen

    private let audio = AmbientAudioEngine()
    private let defaults = UserDefaults.standard
    private var timer: Timer?

    init() {
        if
            let savedLanguage = UserDefaults.standard.string(forKey: "language"),
            let restoredLanguage = AppLanguage(rawValue: savedLanguage)
        {
            language = restoredLanguage
        }

        if
            let savedScene = UserDefaults.standard.string(forKey: "scene"),
            let restoredScene = MeditationScene(rawValue: savedScene)
        {
            scene = restoredScene
        }

        let savedDuration = UserDefaults.standard.integer(forKey: "duration")
        if [15, 30, 60].contains(savedDuration) {
            duration = savedDuration
            remainingSeconds = savedDuration * 60
        }
    }

    var formattedRemaining: String {
        let minutes = remainingSeconds / 60
        let seconds = remainingSeconds % 60
        return String(format: "%02d:%02d", minutes, seconds)
    }

    func togglePlayback() {
        isPlaying ? pause() : play()
    }

    func play() {
        do {
            try audio.play(scene: scene)
            isPlaying = true
            startTimer()
        } catch {
            isPlaying = false
        }
    }

    func pause() {
        audio.stop()
        timer?.invalidate()
        timer = nil
        isPlaying = false
    }

    func selectScene(_ newScene: MeditationScene) {
        scene = newScene
        remainingSeconds = duration * 60
        if isPlaying {
            do {
                try audio.play(scene: newScene)
            } catch {
                pause()
            }
        } else {
            play()
        }
    }

    func selectDuration(_ minutes: Int) {
        duration = minutes
        remainingSeconds = minutes * 60
        if isPlaying {
            startTimer()
        }
    }

    private func startTimer() {
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in
            Task { @MainActor in
                guard let self else { return }
                if self.remainingSeconds > 1 {
                    self.remainingSeconds -= 1
                } else {
                    self.remainingSeconds = 0
                    self.pause()
                }
            }
        }
    }
}
