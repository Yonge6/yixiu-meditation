import Foundation
import AVFoundation

/// Run against the built app's Audio/Meditation directory, not just source assets.
@main
struct AmbientMusicAudioHarness {
    static func main() throws {
        precondition(CommandLine.arguments.count == 2)
        let folder = URL(fileURLWithPath: CommandLine.arguments[1])
        for (name, seconds) in [("cloud-drift", 532.173), ("soft-light-rest", 338.88), ("deep-water-rest", 322.827)] {
            let url = folder.appendingPathComponent(name).appendingPathExtension("m4a")
            let file = try AVAudioFile(forReading: url)
            let format = file.processingFormat
            precondition(format.channelCount == 2)
            precondition(abs(Double(file.length) / format.sampleRate - seconds) < 0.15)
            let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: AVAudioFrameCount(file.length))!
            try file.read(into: buffer)
            precondition(buffer.frameLength == AVAudioFrameCount(file.length))
            var peak: Float = 0
            var edge: Float = 0
            for channel in 0..<Int(format.channelCount) {
                let data = buffer.floatChannelData![channel]
                for frame in 0..<Int(buffer.frameLength) {
                    peak = max(peak, abs(data[frame]))
                    if frame < 100 || frame > Int(buffer.frameLength) - 100 { edge = max(edge, abs(data[frame])) }
                }
            }
            precondition(peak > 0.05 && peak < 0.8)
            precondition(edge < 0.01)
            let player = try AVAudioPlayer(contentsOf: url)
            precondition(player.prepareToPlay())
            print("AMBIENT_DECODE_PASS: \(name), \(player.duration)s, peak=\(peak), edge=\(edge)")
        }
    }
}
