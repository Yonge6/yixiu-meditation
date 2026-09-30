import Foundation

/// Counts confirmed media progress rather than configured session duration.
struct ListeningProgress {
    private var position: Double?
    private var timestamp: Double?

    mutating func sample(position next: Double, at now: Double, duration: Double, rate: Double = 1) -> Double {
        defer { position = next; timestamp = now }
        guard let previous = position, let previousTime = timestamp, rate > 0 else { return 0 }
        let elapsed = max(0, now - previousTime)
        var delta = next - previous
        if delta < 0, duration.isFinite { delta += duration }
        guard delta >= 0, delta / rate <= elapsed + 0.5 else { return 0 }
        return max(0, min(elapsed, delta / rate))
    }

    mutating func reset() { position = nil; timestamp = nil }
}
