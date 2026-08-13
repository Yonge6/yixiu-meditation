import AVFoundation
import Foundation
import MediaPlayer
import UIKit

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
    private var fadingPlayer: AVAudioPlayer?
    private var fadeGeneration = 0
    private var notificationTokens: [NSObjectProtocol] = []
    private var remoteCommandTokens: [(command: MPRemoteCommand, token: Any)] = []
    private var artworkCache: [String: MPMediaItemArtwork] = [:]

    var onShouldPause: (() -> Void)?
    var onPlay: (() -> Void)?
    var onPause: (() -> Void)?
    var onNext: (() -> Void)?
    var onPrevious: (() -> Void)?

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

        configureRemoteCommands()
    }

    deinit {
        notificationTokens.forEach(NotificationCenter.default.removeObserver)
        remoteCommandTokens.forEach { $0.command.removeTarget($0.token) }
    }

    func play(scene: MeditationScene, volume: Float) throws {
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
        let targetVolume = max(0, min(volume, 1))
        let previousPlayer = player
        nextPlayer.volume = previousPlayer == nil ? targetVolume : 0
        nextPlayer.prepareToPlay()

        guard nextPlayer.play() else {
            throw AmbientAudioError.playbackFailed(scene.audioResource)
        }
        fadeGeneration += 1
        let generation = fadeGeneration
        fadingPlayer?.stop()
        fadingPlayer = previousPlayer
        player = nextPlayer

        guard let previousPlayer else { return }

        previousPlayer.setVolume(0, fadeDuration: 0.6)
        nextPlayer.setVolume(targetVolume, fadeDuration: 0.6)
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.65) { [weak self, weak previousPlayer] in
            guard let self, self.fadeGeneration == generation else { return }
            previousPlayer?.stop()
            if self.fadingPlayer === previousPlayer {
                self.fadingPlayer = nil
            }
        }
    }

    func setVolume(_ volume: Float) {
        player?.volume = max(0, min(volume, 1))
    }

    func stop() {
        fadeGeneration += 1
        player?.stop()
        fadingPlayer?.stop()
        player = nil
        fadingPlayer = nil
    }

    func updateNowPlaying(
        scene: MeditationScene,
        language: AppLanguage,
        isPlaying: Bool,
        remainingSeconds: Int,
        durationMinutes: Int,
        canMovePrevious: Bool,
        canMoveNext: Bool
    ) {
        var info: [String: Any] = [
            MPMediaItemPropertyTitle: language.text(zh: scene.zhName, en: scene.enName),
            MPMediaItemPropertyArtist: "一休 · YIXIU",
            MPMediaItemPropertyAlbumTitle: language.text(zh: "如水而行", en: "Be Water, My Friend."),
            MPNowPlayingInfoPropertyPlaybackRate: isPlaying ? 1.0 : 0.0,
            MPNowPlayingInfoPropertyDefaultPlaybackRate: 1.0
        ]

        if durationMinutes > 0 {
            let total = TimeInterval(durationMinutes * 60)
            info[MPMediaItemPropertyPlaybackDuration] = total
            info[MPNowPlayingInfoPropertyElapsedPlaybackTime] = max(0, total - TimeInterval(remainingSeconds))
        }

        if let cachedArtwork = artworkCache[scene.rawValue] {
            info[MPMediaItemPropertyArtwork] = cachedArtwork
        } else if let image = UIImage(named: scene.assetName) {
            let artwork = MPMediaItemArtwork(boundsSize: image.size) { _ in image }
            artworkCache[scene.rawValue] = artwork
            info[MPMediaItemPropertyArtwork] = artwork
        }

        MPNowPlayingInfoCenter.default().nowPlayingInfo = info
        let center = MPRemoteCommandCenter.shared()
        center.previousTrackCommand.isEnabled = canMovePrevious
        center.nextTrackCommand.isEnabled = canMoveNext
        center.playCommand.isEnabled = !isPlaying
        center.pauseCommand.isEnabled = isPlaying
    }

    private func configureRemoteCommands() {
        let center = MPRemoteCommandCenter.shared()
        center.togglePlayPauseCommand.isEnabled = false

        remoteCommandTokens.append((center.playCommand, center.playCommand.addTarget { [weak self] _ in
            guard let self, self.onPlay != nil else { return .commandFailed }
            DispatchQueue.main.async { self.onPlay?() }
            return .success
        }))
        remoteCommandTokens.append((center.pauseCommand, center.pauseCommand.addTarget { [weak self] _ in
            guard let self, self.onPause != nil else { return .commandFailed }
            DispatchQueue.main.async { self.onPause?() }
            return .success
        }))
        remoteCommandTokens.append((center.nextTrackCommand, center.nextTrackCommand.addTarget { [weak self] _ in
            guard let self, self.onNext != nil else { return .commandFailed }
            DispatchQueue.main.async { self.onNext?() }
            return .success
        }))
        remoteCommandTokens.append((center.previousTrackCommand, center.previousTrackCommand.addTarget { [weak self] _ in
            guard let self, self.onPrevious != nil else { return .commandFailed }
            DispatchQueue.main.async { self.onPrevious?() }
            return .success
        }))
    }
}
