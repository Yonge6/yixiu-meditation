import ActivityKit
import Foundation

struct QuietMinuteActivityAttributes: ActivityAttributes {
    struct ContentState: Codable, Hashable {
        var isComplete: Bool
    }

    let startDate: Date
    let endDate: Date
}
