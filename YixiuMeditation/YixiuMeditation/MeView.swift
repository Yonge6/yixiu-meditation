import SwiftUI

struct MeView: View {
    @EnvironmentObject private var appState: AppState
    @State private var infoTitle = ""
    @State private var infoBody = ""
    @State private var showInfo = false

    var body: some View {
        ZStack {
            Image("NightTide")
                .resizable()
                .scaledToFill()
                .ignoresSafeArea()

            Color(red: 0, green: 18 / 255, blue: 26 / 255)
                .opacity(0.54)
                .ignoresSafeArea()

            LinearGradient(
                colors: [YixiuTheme.deepWater.opacity(0.12), YixiuTheme.deepWater.opacity(0.96)],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(spacing: 0) {
                    Text(appState.language.text(zh: "我的一休 · MY YIXIU", en: "MY YIXIU · 我的一休"))
                        .yixiuSecondary(9)
                        .padding(.top, 70)

                    Text(appState.language.text(zh: "回到自己的节奏", en: "Return to your own rhythm"))
                        .font(
                            appState.language == .zh
                                ? YixiuTheme.chineseDisplay(29)
                                : YixiuTheme.englishSerif(28)
                        )
                        .foregroundStyle(YixiuTheme.moon)
                        .padding(.top, 12)

                    favoritesCard
                        .padding(.top, 18)

                    timerCard
                        .padding(.top, 12)

                    settingsCard
                        .padding(.top, 12)

                    trustCard
                        .padding(.top, 12)

                    Text("YIXIU 2.0 · \(appState.language.text(zh: "偏好只保存在这台设备", en: "Preferences stay on this device"))")
                        .font(YixiuTheme.englishSerif(9))
                        .tracking(1)
                        .foregroundStyle(YixiuTheme.mist.opacity(0.42))
                        .padding(.top, 18)
                        .padding(.bottom, 112)
                }
                .padding(.horizontal, 18)
            }
        }
        .alert(infoTitle, isPresented: $showInfo) {
            Button(appState.language.text(zh: "知道了", en: "Done"), role: .cancel) { }
        } message: {
            Text(infoBody)
        }
    }

    private var favoritesCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                VStack(alignment: .leading, spacing: 3) {
                    Text(appState.language.text(zh: "我的收藏", en: "Favorites"))
                        .font(YixiuTheme.chineseDisplay(17))
                    Text(appState.language.text(zh: "常听的水声", en: "Your returning waters"))
                        .font(.system(size: 10))
                        .foregroundStyle(YixiuTheme.mist)
                }
                Spacer()
                Image(systemName: "heart")
                    .foregroundStyle(YixiuTheme.mist)
            }

            if appState.favorites.isEmpty {
                Text(appState.language.text(
                    zh: "在聆听页点亮心形，常听的水声会留在这里。",
                    en: "Tap the heart while listening and your favorite waters will stay here."
                ))
                .font(.system(size: 12))
                .foregroundStyle(YixiuTheme.mist.opacity(0.66))
                .lineSpacing(5)
            } else {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 9) {
                        ForEach(appState.favorites) { scene in
                            Button {
                                appState.activeTab = .listen
                                appState.selectScene(scene, autoplay: false)
                            } label: {
                                ZStack(alignment: .bottomLeading) {
                                    Image(scene.assetName)
                                        .resizable()
                                        .scaledToFill()
                                        .frame(width: 105, height: 88)
                                        .clipped()
                                    LinearGradient(colors: [.clear, YixiuTheme.deepWater.opacity(0.88)], startPoint: .center, endPoint: .bottom)
                                    Text(appState.language.text(zh: scene.zhName, en: scene.enName))
                                        .font(YixiuTheme.chineseDisplay(11))
                                        .foregroundStyle(YixiuTheme.moon)
                                        .padding(9)
                                }
                                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }
            }
        }
        .padding(17)
        .yixiuPanel()
    }

    private var timerCard: some View {
        VStack(spacing: 14) {
            HStack {
                Text(appState.language.text(zh: "默认定时", en: "Default timer"))
                    .font(YixiuTheme.chineseDisplay(17))
                Spacer()
                Text(appState.durationLabel)
                    .font(.system(size: 11))
                    .foregroundStyle(YixiuTheme.aqua)
            }

            HStack(spacing: 7) {
                ForEach([15, 30, 60, 0], id: \.self) { minutes in
                    Button {
                        appState.selectDuration(minutes)
                    } label: {
                        Text(minutes == 0 ? appState.language.text(zh: "不限时", en: "∞") : "\(minutes) \(appState.language == .zh ? "分钟" : "MIN")")
                            .font(.system(size: 10, weight: .medium))
                            .foregroundStyle(appState.duration == minutes ? YixiuTheme.deepWater : YixiuTheme.mist)
                            .frame(maxWidth: .infinity)
                            .frame(height: 40)
                            .background(
                                RoundedRectangle(cornerRadius: 13)
                                    .fill(appState.duration == minutes ? YixiuTheme.aquaStrong : .clear)
                            )
                            .overlay(
                                RoundedRectangle(cornerRadius: 13)
                                    .stroke(appState.duration == minutes ? .clear : YixiuTheme.hairline, lineWidth: 0.8)
                            )
                    }
                    .buttonStyle(.plain)
                }
            }
        }
        .padding(17)
        .yixiuPanel()
    }

    private var settingsCard: some View {
        VStack(spacing: 0) {
            HStack {
                Text(appState.language.text(zh: "界面语言", en: "Language"))
                Spacer()
                HStack(spacing: 4) {
                    languageButton(.zh, title: "中")
                    languageButton(.en, title: "EN")
                }
            }
            .frame(height: 56)

            Divider().overlay(YixiuTheme.hairline)

            Toggle(appState.language.text(zh: "结束提示音", en: "End bell"), isOn: $appState.endBell)
                .tint(YixiuTheme.aqua)
                .frame(height: 56)

            Divider().overlay(YixiuTheme.hairline)

            Toggle(appState.language.text(zh: "后台播放", en: "Background playback"), isOn: $appState.backgroundPlayback)
                .tint(YixiuTheme.aqua)
                .frame(height: 56)
        }
        .font(.system(size: 13))
        .padding(.horizontal, 17)
        .yixiuPanel()
    }

    private func languageButton(_ option: AppLanguage, title: String) -> some View {
        Button {
            appState.language = option
        } label: {
            Text(title)
                .font(.system(size: 12, weight: .medium))
                .foregroundStyle(appState.language == option ? YixiuTheme.deepWater : YixiuTheme.mist)
                .frame(width: 44, height: 32)
                .background(Capsule().fill(appState.language == option ? YixiuTheme.aquaStrong : .clear))
        }
        .buttonStyle(.plain)
    }

    private var trustCard: some View {
        VStack(spacing: 0) {
            trustButton(
                title: appState.language.text(zh: "产品哲学", en: "Our philosophy"),
                heading: appState.language.text(zh: "真实自己，流动人生", en: "True to yourself, flow with life"),
                body: appState.language.text(
                    zh: "向内认识自己，向外如水而行。认识、接纳、成为并活出自己。",
                    en: "Know yourself within, then move through the world like water."
                )
            )
            Divider().overlay(YixiuTheme.hairline)
            trustButton(
                title: appState.language.text(zh: "隐私说明", en: "Privacy"),
                heading: appState.language.text(zh: "安静，也包括不打扰你的数据", en: "Quiet includes your data"),
                body: appState.language.text(
                    zh: "无需账号。收藏、语言和时长只保存在当前设备。",
                    en: "No account is required. Preferences stay on this device."
                )
            )
            Divider().overlay(YixiuTheme.hairline)
            trustButton(
                title: appState.language.text(zh: "支持与反馈", en: "Support"),
                heading: appState.language.text(zh: "告诉我们你的感受", en: "Tell us how it feels"),
                body: appState.language.text(
                    zh: "如果声音无法播放或你希望加入新的水声，请通过 wonderelian.com 联系我们。",
                    en: "For audio issues or new water-scene requests, contact us through wonderelian.com."
                )
            )
        }
        .font(.system(size: 13))
        .padding(.horizontal, 17)
        .yixiuPanel()
    }

    private func trustButton(title: String, heading: String, body: String) -> some View {
        Button {
            infoTitle = heading
            infoBody = body
            showInfo = true
        } label: {
            HStack {
                Text(title)
                Spacer()
                Image(systemName: "chevron.right")
                    .foregroundStyle(YixiuTheme.aqua)
            }
            .frame(height: 50)
        }
        .buttonStyle(.plain)
    }
}
