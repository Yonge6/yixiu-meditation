import SwiftUI
import WidgetKit

struct OneMinuteControl: ControlWidget {
    nonisolated static let kind = "com.health.yixiu.one-minute-pause"

    var body: some ControlWidgetConfiguration {
        StaticControlConfiguration(kind: Self.kind, provider: Provider()) { isRunning in
            ControlWidgetToggle(
                "One-Minute Pause",
                isOn: isRunning,
                action: ToggleQuietMinuteIntent()
            ) { running in
                Label(
                    running ? "Running" : "Ready",
                    systemImage: running ? "water.waves" : "circle.dotted.circle"
                )
            }
            .tint(Color(red: 0.25, green: 0.78, blue: 0.78))
        }
        .displayName("One-Minute Pause")
        .description("Start a quiet 60-second breathing pause.")
    }
}

extension OneMinuteControl {
    struct Provider: ControlValueProvider {
        let previewValue = false

        func currentValue() async throws -> Bool {
            QuietMinuteActivityManager.isRunning
        }
    }
}
