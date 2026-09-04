import AppIntents
import SwiftUI
import WidgetKit

struct QuietMinuteEntry: TimelineEntry {
    let date: Date
}

struct QuietMinuteProvider: TimelineProvider {
    func placeholder(in context: Context) -> QuietMinuteEntry {
        QuietMinuteEntry(date: .now)
    }

    func getSnapshot(in context: Context, completion: @escaping (QuietMinuteEntry) -> Void) {
        completion(QuietMinuteEntry(date: .now))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<QuietMinuteEntry>) -> Void) {
        completion(Timeline(entries: [QuietMinuteEntry(date: .now)], policy: .never))
    }
}

struct QuietMinuteWidget: Widget {
    static let kind = "com.health.yixiu.quiet-minute-widget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: Self.kind, provider: QuietMinuteProvider()) { entry in
            QuietMinuteWidgetView(entry: entry)
                .containerBackground(for: .widget) {
                    LinearGradient(
                        colors: [Color(red: 0.02, green: 0.15, blue: 0.19), Color(red: 0.01, green: 0.06, blue: 0.10)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                }
        }
        .configurationDisplayName("One-Minute Pause")
        .description("Start a quiet 60-second breathing pause.")
        .supportedFamilies([.systemSmall, .systemMedium, .accessoryCircular, .accessoryRectangular])
    }
}

private struct QuietMinuteWidgetView: View {
    @Environment(\.widgetFamily) private var family
    let entry: QuietMinuteEntry

    var body: some View {
        Group {
            switch family {
            case .accessoryCircular:
                Button(intent: StartQuietMinuteIntent()) {
                    ZStack {
                        AccessoryWidgetBackground()
                        Circle()
                            .stroke(Color.cyan.opacity(0.46), lineWidth: 2)
                            .padding(4)
                        Image(systemName: "water.waves")
                            .font(.system(size: 20, weight: .medium))
                    }
                }
                .buttonStyle(.plain)
                .accessibilityLabel("One-Minute Pause")

            case .accessoryRectangular:
                Button(intent: StartQuietMinuteIntent()) {
                    HStack(spacing: 8) {
                        Image(systemName: "water.waves")
                        VStack(alignment: .leading, spacing: 1) {
                            Text("One quiet minute")
                                .font(.headline)
                            Text("Tap to begin")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
                .buttonStyle(.plain)

            case .systemMedium:
                Button(intent: StartQuietMinuteIntent()) {
                    HStack(spacing: 18) {
                        waterMark(size: 72)
                        VStack(alignment: .leading, spacing: 7) {
                            Text("YIXIU · 一休")
                                .font(.caption2.weight(.semibold))
                                .tracking(1.2)
                                .foregroundStyle(Color.cyan.opacity(0.9))
                            Text("One quiet minute")
                                .font(.title2.weight(.semibold))
                                .foregroundStyle(.white)
                            Text("Inhale 4 · Hold 2 · Exhale 6")
                                .font(.caption)
                                .foregroundStyle(.white.opacity(0.68))
                        }
                        Spacer(minLength: 0)
                        Image(systemName: "play.fill")
                            .font(.body.weight(.semibold))
                            .foregroundStyle(Color(red: 0.02, green: 0.16, blue: 0.19))
                            .frame(width: 42, height: 42)
                            .background(Circle().fill(Color(red: 0.42, green: 0.86, blue: 0.83)))
                    }
                }
                .buttonStyle(.plain)

            default:
                Button(intent: StartQuietMinuteIntent()) {
                    VStack(alignment: .leading, spacing: 0) {
                        Text("YIXIU · 一休")
                            .font(.caption2.weight(.semibold))
                            .tracking(1.1)
                            .foregroundStyle(Color.cyan.opacity(0.9))
                        Spacer()
                        waterMark(size: 58)
                        Spacer()
                        Text("One quiet minute")
                            .font(.headline)
                            .foregroundStyle(.white)
                        Text("Tap to begin")
                            .font(.caption2)
                            .foregroundStyle(.white.opacity(0.64))
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
                }
                .buttonStyle(.plain)
            }
        }
        .widgetAccentable()
    }

    private func waterMark(size: CGFloat) -> some View {
        ZStack {
            Circle()
                .fill(Color.cyan.opacity(0.12))
            Circle()
                .stroke(Color.cyan.opacity(0.42), lineWidth: 1)
                .padding(5)
            Image(systemName: "water.waves")
                .font(.system(size: size * 0.30, weight: .medium))
                .foregroundStyle(Color(red: 0.42, green: 0.86, blue: 0.83))
        }
        .frame(width: size, height: size)
    }
}
