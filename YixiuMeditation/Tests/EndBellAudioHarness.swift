// Compile with the actual Models.swift and AmbientAudioEngine.swift for an iOS simulator.
// Deliberately inspects the engine rather than mocking AVAudioPlayer.
import AVFoundation
import Foundation

@main
struct EndBellAudioHarness {
    static func cue(_ engine: AmbientAudioEngine) -> AVAudioPlayer? {
        Mirror(reflecting: engine).children.first { $0.label == "endBellPlayer" }?.value as? AVAudioPlayer
    }

    static func main() throws {
        let engine = AmbientAudioEngine()
        try engine.playEndBell(volume: 0.72)
        guard let player = cue(engine) else { fatalError("Missing cue player") }
        precondition(player.isPlaying && player.numberOfLoops == 0)
        precondition(abs(player.duration - 2.8) < 0.01)
        engine.setVolume(0) // The ambience fade must not mute the independent cue.
        precondition(abs(player.volume - 0.72) < 0.01)
        RunLoop.current.run(until: Date().addingTimeInterval(3.1))
        precondition(!player.isPlaying)
        try engine.playEndBell(volume: 0.5)
        precondition(cue(engine)?.isPlaying == true)
        engine.setEndBellVolume(0.2)
        precondition(abs((cue(engine)?.volume ?? 0) - 0.2) < 0.01)
        engine.stopEndBell()
        precondition(cue(engine) == nil)
        try engine.playEndBell(volume: 0)
        precondition(cue(engine) == nil)
        print("END_BELL_NATIVE_AUDIO_PASS: bundled decode, playback, one-shot ending, fade independence, volume, stop and mute")
    }
}
