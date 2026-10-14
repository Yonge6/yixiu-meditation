import AVFoundation
import Foundation

// Compile this harness with the real AmbientAudioEngine for iOS Simulator.
// The observer is isolated because development tests must not send analytics.
final class ProductAnalytics {
    static let shared = ProductAnalytics()
    func event(_ name: String, _ parameters: [String: Any] = [:]) {}
    func observe(_ player: AVAudioPlayer, scene: MeditationScene) -> AudioUsageObserver {
        AudioUsageObserver()
    }
}

final class AudioUsageObserver {
    func stop(reason: String) {}
}

@main
enum AudioEngineResumeSmoke {
    static func main() throws {
        precondition(CommandLine.arguments.count == 2)
        let bundle = Bundle(path: CommandLine.arguments[1])!
        let engine = AmbientAudioEngine(resourceBundle: bundle)
        try engine.play(scene: .clairDeLune, volume: 0)
        let first = player(in: engine)!
        RunLoop.current.run(until: Date().addingTimeInterval(0.6))
        precondition(first.currentTime > 0.2)
        engine.pause()
        let position = first.currentTime
        RunLoop.current.run(until: Date().addingTimeInterval(0.3))
        precondition(!first.isPlaying && abs(first.currentTime - position) < 0.03)
        try engine.play(scene: .clairDeLune, volume: 0)
        precondition(player(in: engine) === first, "Resume must reuse the same AVAudioPlayer")
        RunLoop.current.run(until: Date().addingTimeInterval(0.4))
        precondition(first.isPlaying && first.currentTime > position + 0.2)
        engine.pause()
        try engine.play(scene: .rain, volume: 0.01)
        let second = player(in: engine)!
        precondition(second !== first && second.currentTime < 0.2)
        precondition(second.volume == 0.01, "A new scene after a pause must not remain at zero crossfade volume")
        engine.stop()
        precondition(player(in: engine) == nil)
        print("AUDIO_ENGINE_RESUME_PASS: real AVAudioPlayer position frozen on pause, retained on resume, changed scene replaced, paused-to-new-scene volume correct, stop released player.")
    }

    private static func player(in engine: AmbientAudioEngine) -> AVAudioPlayer? {
        Mirror(reflecting: engine).children.first { $0.label == "player" }?.value as? AVAudioPlayer
    }
}
