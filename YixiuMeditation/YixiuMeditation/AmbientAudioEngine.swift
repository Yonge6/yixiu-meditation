import AVFoundation
import Foundation

enum AmbientAudioError: LocalizedError {
    case missingResource(String)
    case playbackFailed(String)

    var errorDescription: String? {
        switch self {
        case let .missingResource(name): "Missing bundled audio resource: \(name)"
        case let .playbackFailed(name): "Unable to play bundled audio resource: \(name)"
        }
    }
}

final class AmbientAudioEngine {
    private var player: AVAudioPlayer?
    private var notificationTokens: [NSObjectProtocol] = []

    var onShouldPause: (() -> Void)?

    init() {
        let center = NotificationCenter.default

        notificationTokens.append(
            center.addObserver(
                forName: AVAudioSession.interruptionNotification,
                object: AVAudioSession.sharedInstance(),
                queue: .main
            ) { [weak self] notification in
                guard
                    let rawType = notification.userInfo?[AVAudioSessionInterruptionTypeKey] as? UInt,
                    AVAudioSession.InterruptionType(rawValue: rawType) == .began
                else { return }
                self?.onShouldPause?()
            }
        )

        notificationTokens.append(
            center.addObserver(
                forName: AVAudioSession.routeChangeNotification,
                object: AVAudioSession.sharedInstance(),
                queue: .main
            ) { [weak self] notification in
                guard
                    let rawReason = notification.userInfo?[AVAudioSessionRouteChangeReasonKey] as? UInt,
                    AVAudioSession.RouteChangeReason(rawValue: rawReason) == .oldDeviceUnavailable
                else { return }
                self?.onShouldPause?()
            }
        )
    }

    deinit {
        notificationTokens.forEach(NotificationCenter.default.removeObserver)
    }

    func play(scene: MeditationScene, volume: Float) throws {
        stop()

        let session = AVAudioSession.sharedInstance()
        try session.setCategory(.playback, mode: .default, options: [.mixWithOthers])
        try session.setActive(true)

        guard let url = Bundle.main.url(
            forResource: scene.audioResource,
            withExtension: "m4a",
            subdirectory: "Audio"
        ) else {
            throw AmbientAudioError.missingResource(scene.audioResource)
        }

        let nextPlayer = try AVAudioPlayer(contentsOf: url)
        nextPlayer.numberOfLoops = -1
        nextPlayer.enableRate = true
        nextPlayer.rate = scene.playbackRate
        nextPlayer.volume = max(0, min(volume, 1))
        nextPlayer.prepareToPlay()

        guard nextPlayer.play() else {
            throw AmbientAudioError.playbackFailed(scene.audioResource)
        }
        player = nextPlayer
    }

    func setVolume(_ volume: Float) {
        player?.volume = max(0, min(volume, 1))
    }

    func stop() {
        player?.stop()
        player = nil
    }
}
