import AVFoundation
import Foundation

final class AmbientAudioEngine {
    private let engine = AVAudioEngine()
    private let player = AVAudioPlayerNode()
    private var isAttached = false

    func play(scene: MeditationScene) throws {
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
            case .morning:
                smoothed += 0.018 * (white - smoothed)
                value = smoothed * 0.28
            case .rain:
                smoothed += 0.24 * (white - smoothed)
                value = (white * 0.09 + smoothed * 0.25)
            case .ocean:
                smoothed += 0.012 * (white - smoothed)
                let swell = 0.45 + 0.55 * sin(time * .pi * 0.48)
                value = smoothed * swell * 0.36
            case .stream:
                smoothed += 0.09 * (white - smoothed)
                let shimmer = sin(time * .pi * 7.2) * 0.025
                value = smoothed * 0.30 + shimmer
            }

            samples[index] = value
        }

        engine.disconnectNodeOutput(player)
        engine.connect(player, to: engine.mainMixerNode, format: format)
        engine.mainMixerNode.outputVolume = 0.72
        player.scheduleBuffer(buffer, at: nil, options: .loops)
        try engine.start()
        player.play()
    }

    func stop() {
        player.stop()
        engine.stop()
    }
}
