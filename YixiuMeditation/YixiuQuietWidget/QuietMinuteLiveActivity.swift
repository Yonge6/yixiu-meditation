import ActivityKit
import SwiftUI
import WidgetKit

struct QuietMinuteLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: QuietMinuteActivityAttributes.self) { context in
            QuietMinuteActivityView(context: context)
                .activityBackgroundTint(Color(red: 0.02, green: 0.10, blue: 0.13))
                .activitySystemActionForegroundColor(.white)
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    Image(systemName: "water.waves")
                        .foregroundStyle(YixiuQuietPalette.aqua)
                        .accessibilityHidden(true)
                }

                DynamicIslandExpandedRegion(.center) {
                    VStack(spacing: 3) {
                        Text("Quiet Minute")
                            .font(.caption2.weight(.semibold))
                        countdown(for: context)
                            .font(.title3.monospacedDigit().weight(.medium))
                    }
                }

                DynamicIslandExpandedRegion(.trailing) {
                    Button(intent: EndQuietMinuteIntent()) {
                        Image(systemName: "checkmark.circle")
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel("Done")
                }

                DynamicIslandExpandedRegion(.bottom) {
                    Text("Breathe in · Hold · Breathe out")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            } compactLeading: {
                Image(systemName: "water.waves")
                    .foregroundStyle(YixiuQuietPalette.aqua)
            } compactTrailing: {
                countdown(for: context)
                    .font(.caption2.monospacedDigit())
                    .frame(maxWidth: 42)
            } minimal: {
                Image(systemName: "circle.dotted.circle")
                    .foregroundStyle(YixiuQuietPalette.aqua)
            }
            .keylineTint(YixiuQuietPalette.aqua)
        }
        .supplementalActivityFamilies([.small, .medium])
    }

    private func countdown(
        for context: ActivityViewContext<QuietMinuteActivityAttributes>
    ) -> Text {
        Text(
            timerInterval: context.attributes.startDate...context.attributes.endDate,
            countsDown: true
        )
    }
}
private struct QuietMinuteActivityView: View {
    @Environment(\.activityFamily) private var activityFamily
    let context: ActivityViewContext<QuietMinuteActivityAttributes>

    private var isComplete: Bool {
        context.isStale || context.state.isComplete || context.attributes.endDate <= .now
    }

    var body: some View {
        Group {
            if activityFamily == .small {
                watchLayout
            } else {
                lockScreenLayout
            }
        }
        .foregroundStyle(.white)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(accessibilitySummary)
    }

    private var watchLayout: some View {
        HStack(spacing: 10) {
            ZStack {
                Circle()
                    .fill(YixiuQuietPalette.aqua.opacity(0.16))
                Image(systemName: isComplete ? "checkmark" : "water.waves")
                    .foregroundStyle(YixiuQuietPalette.aqua)
            }
            .frame(width: 36, height: 36)

            VStack(alignment: .leading, spacing: 3) {
                Text(isComplete ? "Complete" : "Quiet Minute")
                    .font(.caption.weight(.semibold))
                if isComplete {
                    Button(intent: EndQuietMinuteIntent()) {
                        Label("Done", systemImage: "checkmark.circle")
                    }
                    .font(.caption2)
                    .buttonStyle(.plain)
                } else {
                    countdown
                        .font(.title3.monospacedDigit().weight(.medium))
                }
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
    }

    private var lockScreenLayout: some View {
        HStack(spacing: 14) {
            ZStack {
                Circle()
                    .stroke(YixiuQuietPalette.aqua.opacity(0.45), lineWidth: 1)
                Circle()
                    .fill(YixiuQuietPalette.aqua.opacity(0.14))
                    .padding(6)
                Image(systemName: isComplete ? "checkmark" : "water.waves")
                    .foregroundStyle(YixiuQuietPalette.aqua)
            }
            .frame(width: 48, height: 48)

            VStack(alignment: .leading, spacing: 4) {
                Text(isComplete ? "Complete" : "Quiet Minute")
                    .font(.headline)
                Text("Breathe in · Hold · Breathe out")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.68))
            }

            Spacer(minLength: 8)

            if isComplete {
                Button(intent: EndQuietMinuteIntent()) {
                    Label("Done", systemImage: "checkmark.circle")
                        .labelStyle(.iconOnly)
                        .font(.title2)
                }
                .buttonStyle(.plain)
                .accessibilityLabel("Done")
            } else {
                countdown
                    .font(.title2.monospacedDigit().weight(.medium))
                    .accessibilityLabel("Time remaining")
            }
        }
        .padding(16)
    }

    private var countdown: Text {
        Text(
            timerInterval: context.attributes.startDate...context.attributes.endDate,
            countsDown: true
        )
    }

    private var accessibilitySummary: Text {
        if isComplete {
            Text("Quiet minute complete")
        } else {
            Text("Quiet minute in progress")
        }
    }
}

private enum YixiuQuietPalette {
    static let aqua = Color(red: 0.38, green: 0.88, blue: 0.84)
}
