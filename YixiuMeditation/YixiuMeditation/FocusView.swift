import SwiftUI

struct FocusView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var subscriptionStore: SubscriptionStore
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var status: BreathingStatus = .idle
    @State private var elapsed = 0
    @State private var originalAudioWasPlaying = false
    @State private var paywallOpen = false

    private var totalSeconds: Int { appState.focusDuration * 60 }

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

                focusPreferences
                    .padding(.top, 18)

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
                .padding(.top, 12)

                Text(phaseCopy)
                    .font(YixiuTheme.chineseDisplay(23))
                    .tracking(3)
                    .foregroundStyle(YixiuTheme.moon)

                Text(format(remaining: max(totalSeconds - elapsed, 0)))
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
                .font(YixiuTheme.sans(11))
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

            while status == .running, elapsed < totalSeconds, !Task.isCancelled {
                try? await Task.sleep(nanoseconds: 1_000_000_000)
                guard status == .running, !Task.isCancelled else { return }

                elapsed += 1
                if elapsed >= totalSeconds {
                    status = .complete
                    restoreOriginalPlayback()
                    return
                }
            }
        }
        .onDisappear {
            if status == .running || status == .paused {
                restoreOriginalPlayback()
                status = .paused
            }
        }
        .sensoryFeedback(.selection, trigger: phase)
        .sheet(isPresented: $paywallOpen) {
            PlusPaywallView()
                .presentationDetents([.large])
                .presentationDragIndicator(.visible)
                .presentationBackground(YixiuTheme.deepWater)
        }
    }

    private var focusPreferences: some View {
        VStack(spacing: 9) {
            HStack(spacing: 3) {
                ForEach([1, 3, 5, 10], id: \.self) { minutes in
                    Button {
                        guard status == .idle || status == .complete else { return }
                        guard subscriptionStore.canUseFocus(minutes) else {
                            paywallOpen = true
                            return
                        }
                        appState.focusDuration = minutes
                        elapsed = 0
                    } label: {
                        Text("\(minutes) \(appState.language == .zh ? "分钟" : "MIN")")
                            .font(.system(size: 10, weight: .medium))
                            .foregroundStyle(appState.focusDuration == minutes ? YixiuTheme.deepWater : YixiuTheme.mist)
                            .frame(width: 53, height: 34)
                            .background(
                                Capsule().fill(appState.focusDuration == minutes ? YixiuTheme.aquaStrong : .clear)
                            )
                            .overlay(alignment: .topTrailing) {
                                if !subscriptionStore.canUseFocus(minutes) {
                                    Image(systemName: "lock.fill")
                                        .font(.system(size: 6, weight: .semibold))
                                        .foregroundStyle(YixiuTheme.aqua)
                                        .padding(5)
                                }
                            }
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(3)
            .background(Capsule().fill(YixiuTheme.deepWaterSoft.opacity(0.56)))
            .overlay(Capsule().stroke(YixiuTheme.hairline, lineWidth: 0.8))

            Button {
                appState.focusSoundEnabled.toggle()
                syncFocusSound()
            } label: {
                Label(
                    appState.language.text(zh: "自然声", en: "Nature sound"),
                    systemImage: "water.waves"
                )
                .font(.system(size: 10, weight: .medium))
                .foregroundStyle(appState.focusSoundEnabled ? YixiuTheme.aquaStrong : YixiuTheme.mist)
                .padding(.horizontal, 12)
                .frame(width: 220, height: 38)
                .background(Capsule().fill(YixiuTheme.deepWaterSoft.opacity(0.56)))
                .overlay(
                    Capsule().stroke(
                        appState.focusSoundEnabled ? YixiuTheme.aqua.opacity(0.7) : YixiuTheme.hairline,
                        lineWidth: 0.8
                    )
                )
            }
            .buttonStyle(.plain)
        }
        .opacity(status == .running || status == .paused ? 0.58 : 1)
    }

    @ViewBuilder
    private var controls: some View {
        switch status {
        case .idle, .complete:
            Button {
                beginSession()
            } label: {
                Text(status == .complete
                     ? appState.language.text(zh: "再来一次", en: "Begin again")
                     : appState.language.text(
                        zh: "开始 \(appState.focusDuration) 分钟",
                        en: "Start \(appState.focusDuration) minute\(appState.focusDuration == 1 ? "" : "s")"
                     ))
                    .font(YixiuTheme.sans(15, weight: .semibold))
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
                    resetSession()
                } label: {
                    Text(appState.language.text(zh: "重新开始", en: "Restart"))
                        .frame(width: 116, height: 48)
                        .background(Capsule().fill(YixiuTheme.deepWaterSoft.opacity(0.7)))
                        .overlay(Capsule().stroke(YixiuTheme.hairline, lineWidth: 0.8))
                }
            }
            .font(YixiuTheme.sans(13, weight: .medium))
            .foregroundStyle(YixiuTheme.moon)
            .buttonStyle(.plain)
        }
    }

    private func format(remaining: Int) -> String {
        String(format: "%02d:%02d", remaining / 60, remaining % 60)
    }

    private func beginSession() {
        guard subscriptionStore.canUseFocus(appState.focusDuration) else {
            paywallOpen = true
            return
        }
        originalAudioWasPlaying = appState.isPlaying
        if appState.focusSoundEnabled {
            if !appState.isPlaying { appState.play() }
        } else if appState.isPlaying {
            appState.pause()
        }
        elapsed = 0
        status = .running
    }

    private func resetSession() {
        restoreOriginalPlayback()
        elapsed = 0
        status = .idle
    }

    private func syncFocusSound() {
        guard status == .running || status == .paused else { return }

        if appState.focusSoundEnabled, !appState.isPlaying {
            appState.play()
        } else if !appState.focusSoundEnabled, appState.isPlaying {
            appState.pause()
        }
    }

    private func restoreOriginalPlayback() {
        if originalAudioWasPlaying, !appState.isPlaying {
            appState.play()
        } else if !originalAudioWasPlaying, appState.isPlaying {
            appState.pause()
        }
    }
}
