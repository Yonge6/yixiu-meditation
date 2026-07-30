import SwiftUI

struct MeView: View {
    @EnvironmentObject private var appState: AppState

    var body: some View {
        VStack(spacing: 0) {
            Text(appState.language.text(zh: "我的一休", en: "MY YIXIU"))
                .yixiuSecondary(10)
                .padding(.top, 72)

            Text(appState.language.text(zh: "回到自己的节奏", en: "Return to your own rhythm"))
                .font(YixiuTheme.chineseDisplay(31))
                .foregroundStyle(YixiuTheme.ink)
                .multilineTextAlignment(.center)
                .padding(.top, 10)

            Image(systemName: "person")
                .font(.system(size: 38, weight: .light))
                .foregroundStyle(YixiuTheme.ink)
                .frame(width: 98, height: 98)
                .background(Circle().fill(Color.white.opacity(0.62)))
                .overlay(Circle().stroke(YixiuTheme.hairline, lineWidth: 1))
                .shadow(color: YixiuTheme.ink.opacity(0.14), radius: 22, y: 12)
                .padding(.top, 54)

            VStack(alignment: .leading, spacing: 18) {
                HStack {
                    Text(appState.language.text(zh: "默认定时", en: "Default timer"))
                        .font(.system(size: 14))
                    Spacer()
                    Text("\(appState.duration) \(appState.language == .zh ? "分钟" : "min")")
                        .font(YixiuTheme.chineseDisplay(16, weight: .semibold))
                }

                HStack(spacing: 8) {
                    ForEach([15, 30, 60], id: \.self) { minutes in
                        Button {
                            appState.selectDuration(minutes)
                        } label: {
                            Text("\(minutes)")
                                .font(.system(size: 14, weight: .medium))
                                .foregroundStyle(appState.duration == minutes ? .white : YixiuTheme.ink)
                                .frame(maxWidth: .infinity)
                                .frame(height: 42)
                                .background(
                                    RoundedRectangle(cornerRadius: 14)
                                        .fill(appState.duration == minutes ? YixiuTheme.ink : Color.clear)
                                )
                                .overlay(
                                    RoundedRectangle(cornerRadius: 14)
                                        .stroke(YixiuTheme.ink.opacity(0.16), lineWidth: 0.8)
                                )
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
            .padding(22)
            .background(
                RoundedRectangle(cornerRadius: 28)
                    .fill(Color.white.opacity(0.62))
                    .overlay(
                        RoundedRectangle(cornerRadius: 28)
                            .stroke(YixiuTheme.gold.opacity(0.32), lineWidth: 0.8)
                    )
            )
            .padding(.horizontal, 28)
            .padding(.top, 34)

            Text(
                appState.language.text(
                    zh: "无需账号。偏好只保存在这台设备上。",
                    en: "No account is required. Preferences stay on this device."
                )
            )
            .font(.system(size: 13))
            .foregroundStyle(YixiuTheme.inkSoft)
            .multilineTextAlignment(.center)
            .padding(.horizontal, 42)
            .padding(.top, 24)

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
