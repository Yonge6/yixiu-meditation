import Foundation
import AVFoundation

@main
struct QuietHourAudioHarness {
    static func main() throws {
        precondition(CommandLine.arguments.count == 2)
        let url = URL(fileURLWithPath: CommandLine.arguments[1])
        let file = try AVAudioFile(forReading: url)
        let format = file.processingFormat
        precondition(format.channelCount == 2)
        precondition(abs(Double(file.length) / format.sampleRate - 3600) < 0.15)
        let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: 8192)!
        var peak: Float = 0, edge: Float = 0, sum: Double = 0
        var frames: AVAudioFramePosition = 0
        while frames < file.length {
            try file.read(into: buffer)
            precondition(buffer.frameLength > 0)
            for c in 0..<2 {
                let data = buffer.floatChannelData![c]
                for i in 0..<Int(buffer.frameLength) {
                    let value = abs(data[i])
                    peak = max(peak, value); sum += Double(value * value)
                    if frames + Int64(i) < 100 || frames + Int64(i) >= file.length - 100 { edge = max(edge, value) }
                }
            }
            frames += Int64(buffer.frameLength)
        }
        precondition(frames == file.length)
        let rms = sqrt(sum / Double(frames * 2))
        precondition(peak > 0.05 && peak < 0.8 && edge < 0.01 && rms > 0.04 && rms < 0.08)
        let player = try AVAudioPlayer(contentsOf: url)
        precondition(player.prepareToPlay())
        for second: TimeInterval in [2660, 2680, 3590] {
            player.currentTime = second
            precondition(abs(player.currentTime - second) < 0.1)
        }
        print("QUIET_HOUR_PASS: full streamed decode, \(player.duration)s, frames=\(frames), peak=\(peak), rms=\(rms), edge=\(edge), seek OK")
    }
}
