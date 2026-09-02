import AppIntents
import WidgetKit

struct ToggleQuietMinuteIntent: SetValueIntent, LiveActivityIntent {
    static let title: LocalizedStringResource = "One-Minute Pause"
    static let description = IntentDescription("Start or stop a quiet 60-second breathing pause.")

    @Parameter(title: "Running")
    var value: Bool

    func perform() async throws -> some IntentResult {
        if value {
            try await QuietMinuteActivityManager.start()
        } else {
            await QuietMinuteActivityManager.stopAll()
        }

        ControlCenter.shared.reloadControls(ofKind: OneMinuteControl.kind)
        return .result()
    }
}

struct EndQuietMinuteIntent: LiveActivityIntent {
    static let title: LocalizedStringResource = "Finish Quiet Minute"

    func perform() async throws -> some IntentResult {
        await QuietMinuteActivityManager.stopAll()
        ControlCenter.shared.reloadControls(ofKind: OneMinuteControl.kind)
        return .result()
    }
}
