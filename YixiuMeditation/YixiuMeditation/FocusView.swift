import SwiftUI

struct FocusView: View {
    @EnvironmentObject private var appState: AppState
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var status: BreathingStatus = .idle
    @State private var elapsed = 0

    private var phase: String {
        if status == .complete { return "complete" }
        let second = elapsed % 12
        if second < 4 { return "inhale" }
        if second < 6 { return "hold" }
        return "exhale"
    }

    private var phaseCopy: String {
        switch phase {
        case "hold": appState.language.text(zh: "停留", en: "Hold")
        case "exhale": appState.language.text(zh: "呼气", en: "Breathe out")
        case "complete": appState.language.text(zh: "完成", en: "Complete")
        default: appState.language.text(zh: "吸气", en: "Breathe in")
        }
    }

    private var phaseScale: CGFloat {
        if reduceMotion { return 1 }
        switch phase {
        case "inhale", "hold": return 1.12
        case "exhale": return 0.80
        default: return 1
        }
    }

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                Image("MorningLake")
                    .resizable()
                    .scaledToFill()
                    .frame(width: geometry.size.width, height: geometry.size.height)
                    .clipped()
                    .ignoresSafeArea()

                Color(red: 0, green: 18 / 255, blue: 26 / 255)
                    .opacity(0.42)
                    .ignoresSafeArea()

                LinearGradient(
                    colors: [YixiuTheme.deepWater.opacity(0.14), YixiuTheme.deepWater.opacity(0.94)],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .ignoresSafeArea()

                VStack(spacing: 0) {
                Text(appState.language.text(zh: "静心 · FOCUS", en: "FOCUS · 静心"))
                    .yixiuSecondary(9)
                    .padding(.top, 76)

                Text(appState.language.text(zh: "水之呼吸", en: "Water Breathing"))
                    .font(
                        appState.language == .zh
                            ? YixiuTheme.chineseDisplay(32)
                            : YixiuTheme.englishSerif(30)
                    )
                    .foregroundStyle(YixiuTheme.moon)
                    .padding(.top, 12)

                Text(appState.language.text(zh: "吸气，停驻，流动", en: "Breathe in, pause, flow"))
                    .font(YixiuTheme.chineseDisplay(14))
                    .tracking(2)
                    .foregroundStyle(YixiuTheme.mist)
                    .padding(.top, 8)

                ZStack {
                    Circle()
                        .stroke(YixiuTheme.aqua.opacity(0.28), lineWidth: 1)
                        .frame(width: 196, height: 196)
                    Circle()
                        .stroke(YixiuTheme.aqua.opacity(0.36), lineWidth: 1)
                        .frame(width: 150, height: 150)
                    Circle()
                        .fill(YixiuTheme.aqua.opacity(0.14))
                        .frame(width: 104, height: 104)
                        .overlay(Circle().stroke(YixiuTheme.aquaStrong.opacity(0.7), lineWidth: 1))
                        .shadow(color: YixiuTheme.aqua.opacity(0.2), radius: 34)
                }
                .scaleEffect(phaseScale)
                .animation(reduceMotion ? nil : .easeInOut(duration: phase == "exhale" ? 6 : 4), value: phase)
                .frame(height: 230)
                .padding(.top, 35)

                Text(phaseCopy)
                    .font(YixiuTheme.chineseDisplay(23))
                    .tracking(3)
                    .foregroundStyle(YixiuTheme.moon)

                Text(format(remaining: max(60 - elapsed, 0)))
                    .font(.system(size: 12, weight: .regular))
                    .tracking(2)
                    .foregroundStyle(YixiuTheme.mist)
                    .padding(.top, 7)

                controls
                    .padding(.top, 32)

                Text(appState.language.text(
                    zh: "顺其自然；如有不适，请暂停。",
                    en: "Let it be easy. Pause if you feel uncomfortable."
                ))
                .font(.system(size: 11))
                .foregroundStyle(YixiuTheme.mist.opacity(0.58))
                .padding(.top, 23)

                Spacer(minLength: 92)
                }
                .multilineTextAlignment(.center)
                .padding(.horizontal, 24)
                .frame(width: geometry.size.width)
            }
            .frame(width: geometry.size.width, height: geometry.size.height)
            .clipped()
        }
        .task(id: status) {
            guard status == .running else { return }

            while status == .running, elapsed < 60, !Task.isCancelled {
                try? await Task.sleep(nanoseconds: 1_000_000_000)
                guard status == .running, !Task.isCancelled else { return }

                elapsed += 1
                if elapsed >= 60 {
                    status = .complete
                    return
                }
            }
        }
        .onDisappear {
            if status == .running {
                status = .paused
            }
        }
    }

    @ViewBuilder
    private var controls: some View {
        switch status {
        case .idle, .complete:
            Button {
                elapsed = 0
                status = .running
            } label: {
                Text(status == .complete
                     ? appState.language.text(zh: "再来一次", en: "Begin again")
                     : appState.language.text(zh: "开始 1 分钟", en: "Start 1 minute"))
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundStyle(YixiuTheme.deepWater)
                    .frame(width: 220, height: 52)
                    .background(Capsule().fill(YixiuTheme.aquaStrong))
                    .shadow(color: .black.opacity(0.22), radius: 18, y: 10)
            }
            .buttonStyle(.plain)

        case .running, .paused:
            HStack(spacing: 12) {
                Button {
                    status = status == .running ? .paused : .running
                } label: {
                    Label(
                        status == .running
                            ? appState.language.text(zh: "暂停", en: "Pause")
                            : appState.language.text(zh: "继续", en: "Continue"),
                        systemImage: status == .running ? "pause.fill" : "play.fill"
                    )
                    .frame(width: 126, height: 48)
                    .background(Capsule().fill(YixiuTheme.deepWaterSoft.opacity(0.7)))
                    .overlay(Capsule().stroke(YixiuTheme.hairline, lineWidth: 0.8))
                }

                Button {
                    elapsed = 0
                    status = .idle
                } label: {
                    Text(appState.language.text(zh: "重新开始", en: "Restart"))
                        .frame(width: 116, height: 48)
                        .background(Capsule().fill(YixiuTheme.deepWaterSoft.opacity(0.7)))
                        .overlay(Capsule().stroke(YixiuTheme.hairline, lineWidth: 0.8))
                }
            }
            .font(.system(size: 13, weight: .medium))
            .foregroundStyle(YixiuTheme.moon)
            .buttonStyle(.plain)
        }
    }

    private func format(remaining: Int) -> String {
        String(format: "%02d:%02d", remaining / 60, remaining % 60)
    }
}
