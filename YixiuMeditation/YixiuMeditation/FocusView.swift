import SwiftUI

struct FocusView: View {
    @EnvironmentObject private var appState: AppState
    @State private var isRunning = false
    @State private var expanded = false

    var body: some View {
        VStack(spacing: 0) {
            Text(appState.language.text(zh: "水之呼吸", en: "WATER BREATH"))
                .yixiuSecondary(10)
                .padding(.top, 72)

            Text(appState.language.text(zh: "吸气，停驻，流动", en: "Breathe in, pause, flow"))
                .font(YixiuTheme.chineseDisplay(31))
                .foregroundStyle(YixiuTheme.ink)
                .multilineTextAlignment(.center)
                .padding(.top, 10)

            Text(
                appState.language.text(
                    zh: "跟随水波完成一分钟呼吸练习。",
                    en: "Follow the ripple through a one-minute breathing practice."
                )
            )
            .font(.system(size: 14))
            .foregroundStyle(YixiuTheme.inkSoft)
            .multilineTextAlignment(.center)
            .padding(.horizontal, 42)
            .padding(.top, 8)

            ZStack {
                Circle()
                    .stroke(YixiuTheme.gold.opacity(0.20), lineWidth: 1)
                    .frame(width: 200, height: 200)
                    .scaleEffect(expanded ? 1.13 : 0.82)

                Circle()
                    .fill(Color.white.opacity(0.60))
                    .frame(width: 150, height: 150)
                    .overlay(Circle().stroke(YixiuTheme.hairline, lineWidth: 1))
                    .shadow(color: YixiuTheme.ink.opacity(0.14), radius: 24, y: 14)
                    .scaleEffect(expanded ? 1.06 : 0.86)

                Image(systemName: "drop.fill")
                    .font(.system(size: 46, weight: .light))
                    .foregroundStyle(YixiuTheme.ink)
            }
            .padding(.top, 54)
            .animation(
                isRunning
                    ? .easeInOut(duration: 4).repeatForever(autoreverses: true)
                    : .easeOut(duration: 0.4),
                value: expanded
            )

            Button {
                isRunning.toggle()
                expanded = isRunning
            } label: {
                Text(
                    isRunning
                        ? appState.language.text(zh: "暂停", en: "Pause")
                        : appState.language.text(zh: "开始 1 分钟", en: "Start 1 minute")
                )
                .font(.system(size: 15, weight: .semibold))
                .foregroundStyle(.white)
                .frame(width: 220, height: 52)
                .background(Capsule().fill(YixiuTheme.ink))
            }
            .buttonStyle(.plain)
            .padding(.top, 42)

            Spacer()
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background {
            Image("MorningWaterHero")
                .resizable()
                .scaledToFill()
                .opacity(0.12)
                .overlay(YixiuTheme.ivory.opacity(0.78))
        }
        .clipped()
    }
}
