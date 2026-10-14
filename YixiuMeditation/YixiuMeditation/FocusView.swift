import SwiftUI

struct FocusView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var subscriptionStore: SubscriptionStore
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.dynamicTypeSize) private var dynamicTypeSize
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    @State private var paywallOpen = false

    private var status: BreathingStatus { appState.focusStatus }
    private var elapsed: Int { appState.focusElapsed }

    private var totalSeconds: Int { appState.focusDuration * 60 }
    private var sceneName: String {
        appState.language.text(zh: appState.scene.zhName, en: appState.scene.enName)
    }

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
                ScrollView(showsIndicators: false) {
                VStack(spacing: 28) {
                focusLayout(geometry.size).callAsFunction {
                VStack(spacing: 0) {
                Text(appState.language.text(zh: "静心 · FOCUS", en: "FOCUS · 静心"))
                    .yixiuSecondary(11)

                Text(sceneName)
                    .font(
                        appState.language == .zh
                            ? YixiuTheme.chineseDisplay(32)
                            : YixiuTheme.englishSerif(30)
                    )
                    .foregroundStyle(YixiuTheme.moon)
                    .padding(.top, 12)
                    .accessibilityIdentifier("focus.sceneTitle")

                Text(appState.language.text(zh: "吸气，停驻，流动", en: "Breathe in, pause, flow"))
                    .font(YixiuTheme.chineseDisplay(14))
                    .tracking(2)
                    .foregroundStyle(YixiuTheme.mist)
                    .padding(.top, 8)

                focusPreferences
                    .padding(.top, 18)
                }
                .frame(maxWidth: .infinity)

                VStack(spacing: 0) {
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
                .scaleEffect(phaseScale * (geometry.size.height < 500 ? 0.65 : 1))
                .animation(reduceMotion ? nil : .easeInOut(duration: phase == "exhale" ? 6 : 4), value: phase)
                .frame(height: geometry.size.height < 500 ? 144 : 230)
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
                    .accessibilityIdentifier("focus-countdown")

                controls
                    .padding(.top, geometry.size.height < 500 ? 16 : 32)

                Text(appState.language.text(
                    zh: "顺其自然；如有不适，请暂停。",
                    en: "Let it be easy. Pause if you feel uncomfortable."
                ))
                .font(YixiuTheme.sans(11))
                .foregroundStyle(YixiuTheme.mist.opacity(0.58))
                .padding(.top, geometry.size.height < 500 ? 12 : 23)
                }
                .frame(maxWidth: .infinity)
                }

                if status == .idle || status == .complete {
                    quickPractices
                }
                }
                .multilineTextAlignment(.center)
                .padding(24)
                .frame(maxWidth: 960)
                .frame(minHeight: geometry.size.height)
                .frame(maxWidth: .infinity)
                }
            }
            .frame(
                width: geometry.size.width,
                height: max(0, geometry.size.height - bottomTabBarClearance(in: geometry)),
                alignment: .top
            )
            .clipped()
        }
        .background {
            GeometryReader { geometry in
                Image(appState.scene.assetName)
                    .resizable()
                    .scaledToFill()
                    .frame(width: geometry.size.width, height: geometry.size.height)
                    .clipped()
                    .overlay(Color(red: 0, green: 18 / 255, blue: 26 / 255).opacity(0.42))
                    .overlay(LinearGradient(
                        colors: [YixiuTheme.deepWater.opacity(0.14), YixiuTheme.deepWater.opacity(0.94)],
                        startPoint: .top, endPoint: .bottom
                    ))
            }
            .ignoresSafeArea()
        }
        .onDisappear { appState.leaveFocusSession() }
        .sensoryFeedback(.selection, trigger: phase)
        .sheet(isPresented: $paywallOpen) {
            PlusPaywallView()
                .presentationDetents([.large])
                .presentationDragIndicator(.visible)
                .presentationBackground(YixiuTheme.deepWater)
        }
    }

    private func bottomTabBarClearance(in geometry: GeometryProxy) -> CGFloat {
        max(96, 112 - geometry.safeAreaInsets.bottom)
    }

    private func focusLayout(_ size: CGSize) -> AnyLayout {
        YixiuAdaptiveLayout.usesColumns(
            size: size, horizontalSizeClass: horizontalSizeClass,
            dynamicTypeSize: dynamicTypeSize, minimumColumnWidth: 286
        )
            ? AnyLayout(HStackLayout(spacing: 32))
            : AnyLayout(VStackLayout(spacing: 12))
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
                        appState.resetFocusSession()
                    } label: {
                        Text("\(minutes) \(appState.language == .zh ? "分钟" : "MIN")")
                            .font(.system(size: 10, weight: .medium))
                            .foregroundStyle(appState.focusDuration == minutes ? YixiuTheme.deepWater : YixiuTheme.mist)
                            .frame(width: 53, height: 44)
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
            } label: {
                Label(
                    sceneName,
                    systemImage: "water.waves"
                )
                .font(.system(size: 10, weight: .medium))
                .lineLimit(1)
                .minimumScaleFactor(0.8)
                .foregroundStyle(appState.focusSoundEnabled ? YixiuTheme.aquaStrong : YixiuTheme.mist)
                .padding(.horizontal, 12)
                .frame(width: 220, height: 44)
                .background(Capsule().fill(YixiuTheme.deepWaterSoft.opacity(0.56)))
                .overlay(
                    Capsule().stroke(
                        appState.focusSoundEnabled ? YixiuTheme.aqua.opacity(0.7) : YixiuTheme.hairline,
                        lineWidth: 0.8
                    )
                )
            }
            .buttonStyle(.plain)
            .accessibilityIdentifier("focus.sceneSound")
            .accessibilityLabel(appState.language.text(zh: "场景声音：\(sceneName)", en: "Scene sound: \(sceneName)"))
            .accessibilityValue(appState.focusSoundEnabled
                ? appState.language.text(zh: "开启", en: "On")
                : appState.language.text(zh: "关闭", en: "Off"))
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
            .accessibilityIdentifier("focus.start")

        case .running, .paused:
            HStack(spacing: 12) {
                Button {
                    if status == .running {
                        appState.pauseFocusSession()
                    } else {
                        appState.resumeFocusSession()
                    }
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
        appState.beginFocusSession()
    }

    private func resetSession() {
        appState.resetFocusSession()
    }

    private var quickPractices: some View {
        VStack(spacing: 12) {
            Rectangle().fill(YixiuTheme.hairline).frame(height: 0.7).padding(.bottom, 10)
            Text(appState.language.text(zh: "换一种放松方式", en: "Another way to unwind"))
                .font(YixiuTheme.sans(11))
                .foregroundStyle(YixiuTheme.mist)
            HStack(alignment: .top, spacing: 12) {
            quickPractice(title: appState.language.text(zh: "睡前放松", en: "Bedtime"), minutes: 15) {
                appState.startQuickListening(scene: .rain, minutes: 15)
            }
            quickPractice(title: appState.language.text(zh: "片刻呼吸", en: "Breathe"), minutes: 1) {
                appState.focusDuration = 1
                appState.focusSoundEnabled = true
                beginSession()
            }
            quickPractice(title: appState.language.text(zh: "清晨唤醒", en: "Morning"), minutes: 5) {
                appState.startQuickListening(scene: .birds, minutes: 5)
            }
            }
        }
        .frame(maxWidth: 420)
    }

    private func quickPractice(title: String, minutes: Int,
                               action: @escaping () -> Void) -> some View {
        Button(action: action) {
            VStack(spacing: 7) {
                Image(systemName: "play").font(.system(size: 14)).foregroundStyle(YixiuTheme.aquaStrong)
                VStack(spacing: 4) {
                    Text(title).font(YixiuTheme.sans(12, weight: .medium))
                    Text("\(minutes) \(appState.language == .zh ? "分钟" : "MIN")")
                        .font(YixiuTheme.sans(10)).foregroundStyle(YixiuTheme.mist)
                }
            }
            .foregroundStyle(YixiuTheme.moon)
            .padding(.horizontal, 4)
            .padding(.vertical, 12)
            .frame(maxWidth: .infinity, minHeight: 84)
            .background(YixiuTheme.deepWater.opacity(0.72))
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .overlay(RoundedRectangle(cornerRadius: 16).stroke(YixiuTheme.hairline, lineWidth: 0.7))
            .multilineTextAlignment(.center)
        }.buttonStyle(.plain)
    }
}
