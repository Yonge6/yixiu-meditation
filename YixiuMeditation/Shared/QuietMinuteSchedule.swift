import Foundation

public enum QuietMinutePhase: String, Codable, Hashable, Sendable {
    case inhale
    case hold
    case exhale
    case complete
}

public struct QuietMinuteSchedule: Hashable, Sendable {
    public static let duration: TimeInterval = 60

    public let startDate: Date
    public let endDate: Date

    public init(startDate: Date) {
        self.startDate = startDate
        self.endDate = startDate.addingTimeInterval(Self.duration)
    }

    public func phase(at date: Date) -> QuietMinutePhase {
        let elapsed = min(max(date.timeIntervalSince(startDate), 0), Self.duration)
        guard elapsed < Self.duration else { return .complete }

        switch elapsed.truncatingRemainder(dividingBy: 12) {
        case ..<4:
            return .inhale
        case ..<6:
            return .hold
        default:
            return .exhale
        }
    }

    public func remainingSeconds(at date: Date) -> Int {
        Int(ceil(min(max(endDate.timeIntervalSince(date), 0), Self.duration)))
    }
}
