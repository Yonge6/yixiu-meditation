import AVFoundation
import Foundation

final class AmbientAudioEngine {
    private let engine = AVAudioEngine()
    private let player = AVAudioPlayerNode()
    private var isAttached = false
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

        if !isAttached {
            engine.attach(player)
            isAttached = true
        }

        let sampleRate = 44_100.0
        guard
            let format = AVAudioFormat(standardFormatWithSampleRate: sampleRate, channels: 1),
            let buffer = AVAudioPCMBuffer(
                pcmFormat: format,
                frameCapacity: AVAudioFrameCount(sampleRate * 4)
            ),
            let samples = buffer.floatChannelData?[0]
        else {
            return
        }

        buffer.frameLength = buffer.frameCapacity
        var smoothed: Float = 0

        for index in 0 ..< Int(buffer.frameLength) {
            let white = Float.random(in: -1 ... 1)
            let time = Float(index) / Float(sampleRate)
            let value: Float

            switch scene {
            case .ocean:
                smoothed += 0.012 * (white - smoothed)
                let swell = 0.45 + 0.55 * sin(time * .pi * 0.48)
                value = smoothed * swell * 0.36
            case .rain:
                smoothed += 0.24 * (white - smoothed)
                value = white * 0.09 + smoothed * 0.25
            case .spring:
                smoothed += 0.16 * (white - smoothed)
                let glint = sin(time * .pi * 5.4) * 0.018
                value = white * 0.038 + smoothed * 0.21 + glint
            case .birds:
                smoothed += 0.29 * (white - smoothed)
                let birdsong = max(0, sin(time * .pi * 1.8)) * sin(time * .pi * 16) * 0.018
                value = white * 0.032 + smoothed * 0.12 + birdsong
            case .stream:
                smoothed += 0.09 * (white - smoothed)
                let shimmer = sin(time * .pi * 7.2) * 0.025
                value = smoothed * 0.30 + shimmer
            case .lake:
                smoothed += 0.016 * (white - smoothed)
                let lap = 0.58 + 0.42 * sin(time * .pi * 0.30)
                value = smoothed * lap * 0.24
            case .valley:
                smoothed += 0.18 * (white - smoothed)
                let breeze = 0.68 + 0.32 * sin(time * .pi * 0.56)
                value = (white * 0.025 + smoothed * 0.14) * breeze
            case .bamboo:
                smoothed += 0.13 * (white - smoothed)
                let leaves = sin(time * .pi * 4.7) * 0.014
                value = white * 0.045 + smoothed * 0.18 + leaves
            case .falls:
                smoothed += 0.11 * (white - smoothed)
                value = white * 0.035 + smoothed * 0.31
            case .window:
                smoothed += 0.10 * (white - smoothed)
                let pane = 0.72 + 0.28 * sin(time * .pi * 0.48)
                value = (white * 0.048 + smoothed * 0.20) * pane
            case .thunder:
                smoothed += 0.006 * (white - smoothed)
                let rumble = 0.56 + 0.44 * sin(time * .pi * 0.11)
                value = smoothed * rumble * 0.48
            case .underwater:
                smoothed += 0.008 * (white - smoothed)
                let pulse = 0.64 + 0.36 * sin(time * .pi * 0.18)
                value = smoothed * pulse * 0.38
            case .snow:
                smoothed += 0.035 * (white - smoothed)
                let gust = 0.55 + 0.45 * sin(time * .pi * 0.32)
                value = (white * 0.025 + smoothed * 0.23) * gust
            case .tide:
                smoothed += 0.009 * (white - smoothed)
                let slowSwell = 0.38 + 0.62 * sin(time * .pi * 0.27)
                value = smoothed * slowSwell * 0.34
            }

            samples[index] = value
        }

        engine.disconnectNodeOutput(player)
        engine.connect(player, to: engine.mainMixerNode, format: format)
        setVolume(volume)
        player.scheduleBuffer(buffer, at: nil, options: .loops)
        try engine.start()
        player.play()
    }

    func setVolume(_ volume: Float) {
        engine.mainMixerNode.outputVolume = max(0, min(volume, 1))
    }

    func stop() {
        player.stop()
        engine.stop()
    }
}
