import SwiftUI

struct ListenView: View {
    @EnvironmentObject private var appState: AppState

    private var language: AppLanguage { appState.language }

    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .top) {
                hero

                ScrollView(.vertical, showsIndicators: false) {
                    Color.clear.frame(height: 232)
                    waterSheet
                }
                .scrollBounceBehavior(.basedOnSize)

                heroCopy
                    .allowsHitTesting(false)
            }
            .frame(width: geometry.size.width, height: geometry.size.height)
            .background(YixiuTheme.ivory)
        }
        .ignoresSafeArea(edges: .top)
    }

    private var hero: some View {
        ZStack {
            Image("MorningWaterHero")
                .resizable()
                .scaledToFill()
                .frame(height: 300)
                .clipped()

            LinearGradient(
                colors: [
                    YixiuTheme.ivory.opacity(0.33),
                    Color.clear,
                    YixiuTheme.ink.opacity(0.08),
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        }
        .frame(maxWidth: .infinity)
        .frame(height: 300)
    }

    private var heroCopy: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(language.text(zh: "早上好", en: "Good morning"))
                .font(
                    language == .zh
                        ? YixiuTheme.chineseDisplay(44)
                        : YixiuTheme.englishSerif(39)
                )
                .tracking(language == .zh ? 2 : -0.6)
                .foregroundStyle(YixiuTheme.ink)

            Text(language.secondary(zh: "早上好", en: "GOOD MORNING"))
                .yixiuSecondary(11)
                .padding(.top, 6)

            Text(language.text(zh: "真实自己，流动人生", en: "True to yourself, flow with life"))
                .font(
                    language == .zh
                        ? YixiuTheme.chineseDisplay(20, weight: .semibold)
                        : YixiuTheme.englishSerif(20, weight: .semibold)
                )
                .tracking(language == .zh ? 2 : 0.2)
                .foregroundStyle(YixiuTheme.ink)
                .padding(.top, 29)

            Text(language.secondary(zh: "真实自己，流动人生", en: "TRUE TO YOURSELF, FLOW WITH LIFE"))
                .yixiuSecondary(9)
                .padding(.top, 5)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.top, 66)
        .padding(.horizontal, 28)
        .shadow(color: YixiuTheme.ivory.opacity(0.92), radius: 4)
        .frame(maxWidth: .infinity)
    }

    private var waterSheet: some View {
        VStack(spacing: 0) {
            sceneHeading
            primaryPlay
                .padding(.top, 15)
            sessionBadge
                .padding(.top, 20)
            waterWisdom
                .padding(.top, 14)
            sceneCards
                .padding(.top, 10)
            utilityControls
                .padding(.top, 20)
        }
        .padding(.top, 30)
        .padding(.horizontal, 22)
        .padding(.bottom, 20)
        .frame(maxWidth: .infinity)
        .background {
            ZStack {
                WaterSheetShape()
                    .fill(YixiuTheme.ivory.opacity(0.96))
                Image("MorningWaterHero")
                    .resizable()
                    .scaledToFill()
                    .opacity(0.07)
                    .clipShape(WaterSheetShape())
            }
            .overlay {
                WaterSheetShape()
                    .stroke(YixiuTheme.hairline.opacity(0.65), lineWidth: 0.8)
            }
            .shadow(color: YixiuTheme.ink.opacity(0.08), radius: 20, y: -8)
        }
    }

    private var sceneHeading: some View {
        HStack(spacing: 12) {
            Image(systemName: "drop")
                .font(.system(size: 19, weight: .light))
                .foregroundStyle(YixiuTheme.gold)
                .frame(width: 38, height: 38)
                .background(Circle().fill(Color.white.opacity(0.55)))
                .overlay(Circle().stroke(YixiuTheme.hairline, lineWidth: 0.8))

            VStack(alignment: .leading, spacing: 2) {
                Text(language.text(zh: appState.scene.zhName, en: appState.scene.enName))
                    .font(YixiuTheme.chineseDisplay(23, weight: .semibold))
                    .tracking(1.5)
                Text(language.secondary(zh: appState.scene.zhName, en: appState.scene.enName.uppercased()))
                    .yixiuSecondary(8)
            }
        }
        .foregroundStyle(YixiuTheme.ink)
    }

    private var primaryPlay: some View {
        Button {
            appState.togglePlayback()
        } label: {
            Image(systemName: appState.isPlaying ? "pause.fill" : "play.fill")
                .font(.system(size: 33, weight: .regular))
                .foregroundStyle(YixiuTheme.ink)
                .frame(width: 94, height: 94)
                .background(Circle().fill(Color.white.opacity(0.64)))
                .overlay(Circle().stroke(YixiuTheme.gold.opacity(0.8), lineWidth: 1))
                .shadow(color: YixiuTheme.ink.opacity(0.16), radius: 20, y: 12)
        }
        .buttonStyle(.plain)
        .accessibilityLabel(appState.isPlaying ? "暂停 Pause" : "播放 Play")
    }

    private var sessionBadge: some View {
        VStack(spacing: 2) {
            Text(
                appState.isPlaying
                    ? appState.formattedRemaining
                    : "\(appState.duration) \(language == .zh ? "分钟" : "MIN")"
            )
            .font(YixiuTheme.chineseDisplay(18))

            Text(
                appState.isPlaying
                    ? language.text(zh: "正在流动", en: "FLOWING NOW")
                    : "\(appState.duration) \(language == .zh ? "MIN" : "分钟")"
            )
            .yixiuSecondary(7)
        }
        .padding(.horizontal, 18)
        .padding(.vertical, 7)
        .background(Capsule().fill(Color.white.opacity(0.58)))
        .overlay(Capsule().stroke(YixiuTheme.hairline.opacity(0.65), lineWidth: 0.7))
        .shadow(color: YixiuTheme.ink.opacity(0.08), radius: 8, y: 5)
    }

    private var waterWisdom: some View {
        HStack(spacing: 13) {
            YixiuTheme.hairline.frame(height: 0.8)
            VStack(spacing: 2) {
                Text(language.text(zh: "如水而行", en: "Be water, my friend."))
                    .font(YixiuTheme.chineseDisplay(18, weight: .semibold))
                    .tracking(language == .zh ? 2 : 0)
                    .lineLimit(1)
                Text(language.secondary(zh: "如水而行", en: "BE WATER, MY FRIEND."))
                    .yixiuSecondary(7)
                    .lineLimit(1)
            }
            YixiuTheme.hairline.frame(height: 0.8)
        }
    }

    private var sceneCards: some View {
        HStack(spacing: 10) {
            ForEach([MeditationScene.rain, .ocean, .stream]) { scene in
                Button {
                    appState.selectScene(scene)
                } label: {
                    GeometryReader { proxy in
                        ZStack(alignment: .bottomLeading) {
                            Image(scene.assetName)
                                .resizable()
                                .scaledToFill()
                                .frame(width: proxy.size.width, height: 132)
                                .clipped()

                            LinearGradient(
                                colors: [.clear, YixiuTheme.ink.opacity(0.68)],
                                startPoint: .center,
                                endPoint: .bottom
                            )

                            VStack(alignment: .leading, spacing: 1) {
                                Text(language.text(zh: scene.zhName, en: scene.enName))
                                    .font(YixiuTheme.chineseDisplay(15, weight: .medium))
                                Text(language.secondary(zh: scene.zhName, en: scene.enName.uppercased()))
                                    .font(YixiuTheme.englishSerif(7))
                                    .tracking(0.8)
                                    .foregroundStyle(Color(red: 228 / 255, green: 189 / 255, blue: 114 / 255))
                            }
                            .foregroundStyle(.white)
                            .padding(10)

                            Image(systemName: appState.scene == scene && appState.isPlaying ? "pause.fill" : "play.fill")
                                .font(.system(size: 9))
                                .foregroundStyle(.white)
                                .frame(width: 28, height: 28)
                                .background(Circle().fill(YixiuTheme.ink.opacity(0.54)))
                                .overlay(Circle().stroke(Color.white.opacity(0.72), lineWidth: 0.8))
                                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomTrailing)
                                .padding(8)
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .frame(height: 132)
                    .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                    .overlay(
                        RoundedRectangle(cornerRadius: 18, style: .continuous)
                            .stroke(
                                appState.scene == scene
                                    ? YixiuTheme.gold
                                    : YixiuTheme.gold.opacity(0.45),
                                lineWidth: 0.8
                            )
                    )
                    .shadow(color: YixiuTheme.ink.opacity(0.16), radius: 8, y: 5)
                }
                .buttonStyle(.plain)
                .accessibilityLabel("\(scene.zhName) \(scene.enName)")
            }
        }
        .frame(maxWidth: .infinity)
    }

    private var utilityControls: some View {
        GeometryReader { proxy in
            HStack(spacing: 14) {
                Menu {
                    ForEach([15, 30, 60], id: \.self) { minutes in
                        Button("\(minutes)") {
                            appState.selectDuration(minutes)
                        }
                    }
                } label: {
                    HStack {
                        Image(systemName: "clock")
                        Spacer()
                        VStack(spacing: 1) {
                            Text("\(appState.duration) \(language == .zh ? "分钟" : "MIN")")
                                .font(YixiuTheme.chineseDisplay(14, weight: .semibold))
                            Text("\(appState.duration) \(language == .zh ? "MIN" : "分钟")")
                                .yixiuSecondary(6)
                        }
                        Spacer()
                        Image(systemName: "chevron.down")
                            .font(.system(size: 10, weight: .semibold))
                    }
                    .foregroundStyle(YixiuTheme.ink)
                    .padding(.horizontal, 14)
                    .frame(width: max(150, proxy.size.width - 146), height: 46)
                    .background(Capsule().fill(Color.white.opacity(0.64)))
                    .overlay(Capsule().stroke(YixiuTheme.gold.opacity(0.55), lineWidth: 0.8))
                }

                HStack(spacing: 0) {
                    languageButton(.zh, title: "中")
                    YixiuTheme.gold.opacity(0.22).frame(width: 1, height: 23)
                    languageButton(.en, title: "EN")
                }
                .frame(width: 132, height: 46)
                .background(Capsule().fill(Color.white.opacity(0.64)))
                .overlay(Capsule().stroke(YixiuTheme.gold.opacity(0.55), lineWidth: 0.8))
            }
        }
        .frame(height: 46)
    }

    private func languageButton(_ languageOption: AppLanguage, title: String) -> some View {
        Button {
            appState.language = languageOption
        } label: {
            Text(title)
                .font(
                    language == languageOption
                        ? YixiuTheme.chineseDisplay(18, weight: .bold)
                        : YixiuTheme.englishSerif(15)
                )
                .foregroundStyle(
                    language == languageOption
                        ? YixiuTheme.ink
                        : YixiuTheme.gold.opacity(0.72)
                )
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
        .buttonStyle(.plain)
    }
}

private struct WaterSheetShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: 0, y: 28))
        path.addCurve(
            to: CGPoint(x: rect.width, y: 28),
            control1: CGPoint(x: rect.width * 0.22, y: -8),
            control2: CGPoint(x: rect.width * 0.76, y: -8)
        )
        path.addLine(to: CGPoint(x: rect.width, y: rect.height))
        path.addLine(to: CGPoint(x: 0, y: rect.height))
        path.closeSubpath()
        return path
    }
}
