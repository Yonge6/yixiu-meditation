import ActivityKit
import Foundation

enum QuietMinuteActivityManager {
    static func start(at startDate: Date = .now) async throws {
        await stopAll()

        guard ActivityAuthorizationInfo().areActivitiesEnabled else {
            throw QuietMinuteActivityError.liveActivitiesDisabled
        }

        let schedule = QuietMinuteSchedule(startDate: startDate)
        let attributes = QuietMinuteActivityAttributes(
            startDate: schedule.startDate,
            endDate: schedule.endDate
        )
        let content = ActivityContent(
            state: QuietMinuteActivityAttributes.ContentState(isComplete: false),
            staleDate: schedule.endDate,
            relevanceScore: 100
        )

        if #available(iOS 18.0, *) {
            _ = try Activity.request(
                attributes: attributes,
                content: content,
                pushType: nil,
                style: .standard
            )
        } else {
            _ = try Activity.request(
                attributes: attributes,
                content: content,
                pushType: nil
            )
        }
    }

    static func stopAll() async {
        let finalContent = ActivityContent(
            state: QuietMinuteActivityAttributes.ContentState(isComplete: true),
            staleDate: nil,
            relevanceScore: 0
        )

        for activity in Activity<QuietMinuteActivityAttributes>.activities {
            await activity.end(finalContent, dismissalPolicy: .immediate)
        }
    }

    static var isRunning: Bool {
        Activity<QuietMinuteActivityAttributes>.activities.contains { activity in
            activity.activityState == .active && activity.attributes.endDate > .now
        }
    }
}

enum QuietMinuteActivityError: LocalizedError {
    case liveActivitiesDisabled

    var errorDescription: String? {
        switch self {
        case .liveActivitiesDisabled:
            String(localized: "Live Activities are turned off for Yixiu.")
        }
    }
}
