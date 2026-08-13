import SwiftUI
import StoreKit

private enum MePage: Equatable {
    case home
    case about
    case privacy
    case sources
    case support
}

struct MeView: View {
    @EnvironmentObject private var appState: AppState
    @Environment(\.requestReview) private var requestReview
    @State private var page: MePage = .home
    @State private var libraryOpen = false
    @State private var videoChannelOpen = false
    @GestureState private var detailBackOffset: CGFloat = 0

    private var language: AppLanguage { appState.language }

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                background

                home(geometry: geometry)
                    .opacity(page == .home ? 1 : 0)
                    .allowsHitTesting(page == .home)
                    .accessibilityHidden(page != .home)

                if page != .home {
                    detail(geometry: geometry)
                        .offset(x: min(detailBackOffset, 36))
                        .simultaneousGesture(detailBackGesture)
                        .transition(.move(edge: .trailing).combined(with: .opacity))
                }
            }
            .frame(width: geometry.size.width, height: geometry.size.height)
            .clipped()
        }
        .sheet(isPresented: $libraryOpen) {
            SoundLibraryView()
                .presentationDetents([.large])
                .presentationDragIndicator(.visible)
                .presentationBackground(YixiuTheme.deepWater)
        }
        .sheet(isPresented: $videoChannelOpen) {
            VideoChannelSheet(language: language)
                .presentationDetents([.medium])
                .presentationDragIndicator(.visible)
                .presentationBackground(YixiuTheme.deepWater)
        }
    }

    private var background: some View {
        ZStack {
            Image("NightTide")
                .resizable()
                .scaledToFill()
                .ignoresSafeArea()

            Color(red: 0, green: 18 / 255, blue: 26 / 255)
                .opacity(0.58)
                .ignoresSafeArea()

            LinearGradient(
                colors: [YixiuTheme.deepWater.opacity(0.16), YixiuTheme.deepWater.opacity(0.98)],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
        }
    }

    private func home(geometry: GeometryProxy) -> some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 0) {
                Text(language.text(zh: "我的一休 · MY YIXIU", en: "MY YIXIU · 我的一休"))
                    .yixiuSecondary(9)
                    .padding(.top, 70)

                Text(language.text(zh: "回到自己的节奏", en: "Return to your own rhythm"))
                    .font(language == .zh ? YixiuTheme.chineseDisplay(29) : YixiuTheme.englishSerif(28))
                    .foregroundStyle(YixiuTheme.moon)
                    .padding(.top, 12)

                soundSpaceCard
                    .padding(.top, 20)

                if !appState.recentScenes.isEmpty {
                    recentScenesCard
                        .padding(.top, 12)
                }

                favoritesCard
                    .padding(.top, 12)

                timerCard
                    .padding(.top, 12)

                settingsCard
                    .padding(.top, 12)

                sectionLabel(language.text(zh: "关于一休", en: "ABOUT YIXIU"))
                    .padding(.top, 24)

                aboutCard

                sectionLabel(language.text(zh: "沿途所作", en: "WORKS ALONG THE WAY"))
                    .padding(.top, 24)

                worksCard

                Text(language.text(zh: "向内认识自己，向外如水而行。", en: "Know within. Move like water."))
                    .font(YixiuTheme.chineseDisplay(12))
                    .tracking(1)
                    .foregroundStyle(YixiuTheme.mist.opacity(0.52))
                    .padding(.top, 24)

                Spacer(minLength: 122)
            }
            .frame(width: max(geometry.size.width - 36, 0))
            .padding(.horizontal, 18)
        }
        .frame(width: geometry.size.width)
        .clipped()
    }

    private var soundSpaceCard: some View {
        ZStack(alignment: .bottomLeading) {
            Image(appState.scene.assetName)
                .resizable()
                .scaledToFill()
                .frame(height: 158)
                .clipped()

            LinearGradient(
                colors: [YixiuTheme.deepWater.opacity(0.05), YixiuTheme.deepWater.opacity(0.96)],
                startPoint: .top,
                endPoint: .bottom
            )

            VStack(alignment: .leading, spacing: 5) {
                Text(language.text(zh: "声音空间", en: "SOUND SPACE"))
                    .yixiuSecondary(8)
                Text(language.text(zh: appState.scene.zhName, en: appState.scene.enName))
                    .font(YixiuTheme.chineseDisplay(20))
                    .foregroundStyle(YixiuTheme.moon)
                Text(language.text(zh: "正在聆听 · 共 14 种真实自然声", en: "Now listening · 14 real nature sounds"))
                    .font(.system(size: 10))
                    .foregroundStyle(YixiuTheme.mist)

                Button {
                    libraryOpen = true
                } label: {
                    Label(language.text(zh: "浏览全部声音", en: "Browse all sounds"), systemImage: "water.waves")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundStyle(YixiuTheme.deepWater)
                        .padding(.horizontal, 16)
                        .frame(height: 38)
                        .background(Capsule().fill(YixiuTheme.aquaStrong))
                }
                .buttonStyle(.plain)
                .padding(.top, 5)
            }
            .padding(17)
        }
        .frame(height: 158)
        .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 22, style: .continuous)
                .stroke(YixiuTheme.hairline, lineWidth: 0.8)
        )
        .shadow(color: .black.opacity(0.2), radius: 18, y: 10)
    }

    private var favoritesCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                VStack(alignment: .leading, spacing: 3) {
                    Text(language.text(zh: "我的收藏", en: "Favorites"))
                        .font(YixiuTheme.chineseDisplay(17))
                    Text(language.text(zh: "常听的水声", en: "Your returning waters"))
                        .font(.system(size: 10))
                        .foregroundStyle(YixiuTheme.mist)
                }
                Spacer()
                Image(systemName: "heart")
                    .foregroundStyle(YixiuTheme.mist)
            }

            if appState.favorites.isEmpty {
                Text(language.text(
                    zh: "在声音页点亮心形，常听的自然声会留在这里。",
                    en: "Tap the heart while listening and your favorite sounds will stay here."
                ))
                .font(.system(size: 12))
                .foregroundStyle(YixiuTheme.mist.opacity(0.66))
                .lineSpacing(5)
            } else {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 9) {
                        ForEach(appState.favorites) { scene in
                            Button {
                                appState.selectScene(scene, autoplay: false)
                                appState.activeTab = .listen
                            } label: {
                                ZStack(alignment: .bottomLeading) {
                                    Image(scene.assetName)
                                        .resizable()
                                        .scaledToFill()
                                        .frame(width: 105, height: 88)
                                        .clipped()
                                    LinearGradient(
                                        colors: [.clear, YixiuTheme.deepWater.opacity(0.9)],
                                        startPoint: .center,
                                        endPoint: .bottom
                                    )
                                    Text(language.text(zh: scene.zhName, en: scene.enName))
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

    private var recentScenesCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                VStack(alignment: .leading, spacing: 3) {
                    Text(language.text(zh: "最近聆听", en: "Recently played"))
                        .font(YixiuTheme.chineseDisplay(17))
                    Text(language.text(zh: "一点继续，不必重新寻找", en: "Continue with one tap"))
                        .font(.system(size: 10))
                        .foregroundStyle(YixiuTheme.mist)
                }
                Spacer()
                Image(systemName: "clock")
                    .foregroundStyle(YixiuTheme.mist)
            }

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 9) {
                ForEach(appState.recentScenes) { scene in
                    Button {
                        appState.selectScene(scene)
                        appState.activeTab = .listen
                    } label: {
                        ZStack(alignment: .bottomLeading) {
                            Image(scene.assetName)
                                .resizable()
                                .scaledToFill()
                                .frame(height: 78)
                                .clipped()

                            LinearGradient(
                                colors: [.clear, YixiuTheme.deepWater.opacity(0.94)],
                                startPoint: .center,
                                endPoint: .bottom
                            )

                            VStack(alignment: .leading, spacing: 3) {
                                Text(language.text(zh: scene.zhName, en: scene.enName))
                                    .font(YixiuTheme.chineseDisplay(13))
                                    .lineLimit(1)
                                Text(language.text(zh: scene.useZh, en: scene.useEn))
                                    .font(.system(size: 8))
                                    .foregroundStyle(YixiuTheme.aqua)
                                    .lineLimit(1)
                            }
                            .foregroundStyle(YixiuTheme.moon)
                            .padding(11)
                        }
                        .frame(height: 78)
                        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                        .overlay(
                            RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .stroke(YixiuTheme.hairline, lineWidth: 0.8)
                        )
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel(language.text(
                        zh: "继续聆听\(scene.zhName)",
                        en: "Continue listening to \(scene.enName)"
                    ))
                }
            }
        }
        .padding(17)
        .yixiuPanel()
    }

    private var timerCard: some View {
        VStack(spacing: 14) {
            HStack {
                Text(language.text(zh: "默认定时", en: "Default timer"))
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
                        Text(minutes == 0
                            ? language.text(zh: "不限时", en: "∞")
                            : "\(minutes) \(language == .zh ? "分钟" : "MIN")")
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
                VStack(alignment: .leading, spacing: 3) {
                    Text(language.text(zh: "界面语言", en: "Language"))
                    Text(language.text(zh: "中英双语随时切换", en: "Switch between Chinese and English"))
                        .font(.system(size: 9))
                        .foregroundStyle(YixiuTheme.mist)
                }
                Spacer()
                HStack(spacing: 4) {
                    languageButton(.zh, title: "中")
                    languageButton(.en, title: "EN")
                }
            }
            .frame(minHeight: 62)

            Divider().overlay(YixiuTheme.hairline)

            settingToggle(
                title: language.text(zh: "结束提示音", en: "End bell"),
                subtitle: language.text(zh: "定时结束时轻声提醒", en: "A gentle sound when time ends"),
                isOn: $appState.endBell
            )

            Divider().overlay(YixiuTheme.hairline)

            settingToggle(
                title: language.text(zh: "后台播放", en: "Background playback"),
                subtitle: language.text(zh: "离开画面，水声仍可继续", en: "Keep listening outside the app"),
                isOn: $appState.backgroundPlayback
            )
        }
        .font(.system(size: 13))
        .padding(.horizontal, 17)
        .yixiuPanel()
    }

    private var aboutCard: some View {
        VStack(spacing: 0) {
            infoRow(
                title: language.text(zh: "关于我们", en: "About Us"),
                subtitle: language.text(zh: "一休是谁，我们相信什么", en: "Who we are and what we believe"),
                icon: "drop",
                target: .about
            )
            Divider().overlay(YixiuTheme.hairline)
            infoRow(
                title: language.text(zh: "隐私说明", en: "Privacy"),
                subtitle: language.text(zh: "偏好只保存在这台设备", en: "Preferences stay on this device"),
                icon: "lock",
                target: .privacy
            )
            Divider().overlay(YixiuTheme.hairline)
            infoRow(
                title: language.text(zh: "声音来源", en: "Audio sources"),
                subtitle: language.text(zh: "真实自然录音与授权", en: "Field recordings and licensing"),
                icon: "waveform",
                target: .sources
            )
            Divider().overlay(YixiuTheme.hairline)
            infoRow(
                title: language.text(zh: "联系与反馈", en: "Contact and feedback"),
                subtitle: language.text(zh: "邮箱与社交媒体", en: "Email and social channels"),
                icon: "envelope",
                target: .support
            )
            Divider().overlay(YixiuTheme.hairline)
            Button {
                requestReview()
            } label: {
                HStack(spacing: 12) {
                    Image(systemName: "star")
                        .font(.system(size: 16, weight: .light))
                        .foregroundStyle(YixiuTheme.aqua)
                        .frame(width: 36, height: 36)
                        .overlay(Circle().stroke(YixiuTheme.hairline, lineWidth: 0.8))
                    VStack(alignment: .leading, spacing: 3) {
                        Text(language.text(zh: "给一休评分", en: "Rate Yixiu"))
                            .font(YixiuTheme.chineseDisplay(15))
                        Text(language.text(zh: "在 App Store 分享你的感受", en: "Share your experience on the App Store"))
                            .font(.system(size: 10))
                            .foregroundStyle(YixiuTheme.mist)
                            .lineLimit(1)
                    }
                    Spacer()
                    Image(systemName: "star.fill")
                        .font(.system(size: 12, weight: .light))
                        .foregroundStyle(YixiuTheme.mist)
                }
                .foregroundStyle(YixiuTheme.moon)
                .frame(minHeight: 66)
                .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 16)
        .yixiuPanel()
    }

    private var worksCard: some View {
        VStack(spacing: 0) {
            workLink(
                index: language.text(zh: "一", en: "01"),
                title: language.text(zh: "虾子曰", en: "Xiazi Says"),
                tagline: language.text(zh: "昨日世界", en: "Yesterday's World"),
                description: language.text(zh: "每天用全球热点与双语海报，看清复杂世界。", en: "Global stories and bilingual posters make the world easier to see."),
                url: "https://xiazishuo.com"
            )
            Divider().overlay(YixiuTheme.hairline)
            workLink(
                index: language.text(zh: "二", en: "02"),
                title: language.text(zh: "三慢问道", en: "Wendao"),
                tagline: language.text(zh: "慢读经典", en: "Read slowly"),
                description: language.text(zh: "读懂经典，也在慢下来时读懂自己。", en: "Read the classic slowly—and yourself with it."),
                url: "https://wendao.wonderelian.com"
            )
            Divider().overlay(YixiuTheme.hairline)
            workLink(
                index: language.text(zh: "三", en: "03"),
                title: language.text(zh: "艺术风格图鉴", en: "Style Atlas"),
                tagline: language.text(zh: "学习看懂一种美", en: "Learn to see a style"),
                description: language.text(zh: "沿着艺术与设计风格的脉络，找到自己的观看方式。", en: "Follow art and design lineages to find your own way of looking."),
                url: "https://style-atlas.wonderelian.com"
            )
            Divider().overlay(YixiuTheme.hairline)
            workLink(
                index: language.text(zh: "四", en: "04"),
                title: language.text(zh: "不二", en: "Not Two"),
                tagline: language.text(zh: "认识自己", en: "Know yourself"),
                description: language.text(zh: "看见自己的能量结构，理解真实而独特的自己。", en: "See your energy design and understand your authentic, individual self."),
                url: "https://human-design.wonderelian.com/"
            )
        }
        .padding(.horizontal, 16)
        .yixiuPanel()
    }

    private func detail(geometry: GeometryProxy) -> some View {
        VStack(spacing: 0) {
            HStack(spacing: 12) {
                Button {
                    withAnimation(.easeOut(duration: 0.2)) {
                        page = .home
                    }
                } label: {
                    Image(systemName: "chevron.left")
                        .font(.system(size: 18, weight: .medium))
                        .foregroundStyle(YixiuTheme.moon)
                        .frame(width: 48, height: 48)
                        .background(Circle().fill(YixiuTheme.aqua.opacity(0.08)))
                        .contentShape(Circle())
                }
                .buttonStyle(.plain)
                .accessibilityLabel(language.text(zh: "返回", en: "Back"))

                VStack(alignment: .leading, spacing: 4) {
                    Text("一休 · YIXIU")
                        .yixiuSecondary(8)
                    Text(detailTitle)
                        .font(YixiuTheme.chineseDisplay(22))
                        .foregroundStyle(YixiuTheme.moon)
                }

                Spacer()
            }
            .padding(.horizontal, 18)
            .padding(.top, max(geometry.safeAreaInsets.top + 8, 60))
            .padding(.bottom, 12)
            .background(YixiuTheme.deepWater.opacity(0.82))

            Divider().overlay(YixiuTheme.hairline)

            ScrollView(showsIndicators: false) {
                detailBody
                    .frame(width: max(geometry.size.width - 40, 0), alignment: .leading)
                    .padding(.horizontal, 20)
                    .padding(.top, 26)
                    .padding(.bottom, 124)
            }
            .frame(width: geometry.size.width)
            .clipped()
        }
        .frame(width: geometry.size.width, height: geometry.size.height)
        .clipped()
        .ignoresSafeArea(edges: .top)
    }

    private var detailBackGesture: some Gesture {
        DragGesture(minimumDistance: 10)
            .updating($detailBackOffset) { value, state, _ in
                let horizontal = value.translation.width > 0
                    && value.translation.width > abs(value.translation.height) * 1.15
                state = horizontal ? value.translation.width * 0.18 : 0
            }
            .onEnded { value in
                let distance = max(value.translation.width, value.predictedEndTranslation.width)
                guard distance >= 72,
                      value.translation.width > abs(value.translation.height) * 1.15 else { return }
                withAnimation(.easeOut(duration: 0.2)) {
                    page = .home
                }
            }
    }

    @ViewBuilder
    private var detailBody: some View {
        switch page {
        case .about:
            AboutYixiuView(language: language)
        case .privacy:
            MeArticle(
                eyebrow: language.text(zh: "你的数据", en: "YOUR DATA"),
                title: language.text(zh: "安静，也应该是私密的", en: "Quiet should remain private"),
                paragraphs: [
                    language.text(
                        zh: "一休无需账号。你选择的声音、收藏、语言、音量与定时时长，只保存在当前设备。",
                        en: "Yixiu requires no account. Your sound, favorites, language, volume and timer preferences stay on this device."
                    ),
                    language.text(
                        zh: "一休不会读取位置、照片、通讯录或健康数据。卸载 App 会同时移除本地偏好。",
                        en: "Yixiu does not access location, photos, contacts or health data. Removing the app also removes local preferences."
                    )
                ],
                quote: language.text(zh: "少一些记录，多一些当下。", en: "Less tracking. More presence.")
            )
        case .sources:
            VStack(alignment: .leading, spacing: 18) {
                Text(language.text(zh: "真实自然录音", en: "FIELD RECORDINGS"))
                    .yixiuSecondary(9)
                Text(language.text(zh: "每个场景，都有相应的声音", en: "A fitting sound for every scene"))
                    .font(YixiuTheme.chineseDisplay(27))
                    .foregroundStyle(YixiuTheme.moon)
                Text(language.text(
                    zh: "鸟语、雨声、河流、海浪、瀑布、远雷与山风均使用对应的自然环境录音，不以合成噪音替代具名场景。",
                    en: "Birds, rain, rivers, waves, waterfalls, thunder and wind use matching field recordings rather than generic generated noise."
                ))
                .font(.system(size: 14))
                .lineSpacing(7)
                .foregroundStyle(YixiuTheme.mist)
                Text(language.text(
                    zh: "录音素材按 Mixkit Sound Effects Free License 使用。",
                    en: "Recordings are used under the Mixkit Sound Effects Free License."
                ))
                .font(.system(size: 14))
                .lineSpacing(7)
                .foregroundStyle(YixiuTheme.mist)

                Link(destination: URL(string: "https://mixkit.co/license/")!) {
                    actionLinkLabel(
                        language.text(zh: "查看 Mixkit 授权", en: "View Mixkit license"),
                        icon: "doc.text"
                    )
                }
            }
        case .support:
            supportDetail
        case .home:
            EmptyView()
        }
    }

    private var supportDetail: some View {
        VStack(alignment: .leading, spacing: 18) {
            Text(language.text(zh: "联系与反馈", en: "CONTACT"))
                .yixiuSecondary(9)
            Text(language.text(zh: "让一休更像你需要的样子", en: "Help Yixiu become more useful to you"))
                .font(YixiuTheme.chineseDisplay(27))
                .foregroundStyle(YixiuTheme.moon)
            Text(language.text(
                zh: "如果声音无法播放、画面显示异常，或你希望加入新的自然声，请告诉我们设备、系统版本与声音名称。",
                en: "If audio cannot play, a scene looks wrong, or you would like a new sound, tell us your device, system version and the sound name."
            ))
            .font(.system(size: 14))
            .lineSpacing(7)
            .foregroundStyle(YixiuTheme.mist)

            VStack(spacing: 0) {
                contactLink(title: "WonderElian", value: "wonderelian.com", icon: "globe", url: "https://wonderelian.com/")
                Divider().overlay(YixiuTheme.hairline)
                contactLink(title: language.text(zh: "邮箱", en: "Email"), value: "hustyy986@gmail.com", icon: "envelope", url: "mailto:hustyy986@gmail.com?subject=Yixiu%20Feedback")
                Divider().overlay(YixiuTheme.hairline)
                contactLink(title: language.text(zh: "小红书", en: "RED"), value: language.text(zh: "打开主页", en: "Open profile"), icon: "book", url: "https://xhslink.cn/m/3OF5qu7Peui")
                Divider().overlay(YixiuTheme.hairline)
                contactLink(title: language.text(zh: "抖音", en: "Douyin"), value: language.text(zh: "打开主页", en: "Open profile"), icon: "music.note", url: "https://v.douyin.com/d9L1thkye0Y/")
                Divider().overlay(YixiuTheme.hairline)
                contactLink(title: "X", value: "@yongyuan1", icon: "at", url: "https://x.com/yongyuan1?s=11")
                Divider().overlay(YixiuTheme.hairline)
                contactLink(title: "TikTok", value: "@wonderelian", icon: "play.rectangle", url: "https://www.tiktok.com/@wonderelian")
                Divider().overlay(YixiuTheme.hairline)
                Button {
                    videoChannelOpen = true
                } label: {
                    HStack(spacing: 12) {
                        Image(systemName: "qrcode")
                            .font(.system(size: 15, weight: .light))
                            .foregroundStyle(YixiuTheme.aqua)
                            .frame(width: 34)
                        Text(language.text(zh: "视频号", en: "WeChat Channels"))
                            .font(YixiuTheme.chineseDisplay(14))
                        Spacer()
                        Text(language.text(zh: "扫码关注", en: "View QR code"))
                            .font(.system(size: 10))
                            .foregroundStyle(YixiuTheme.mist)
                        Image(systemName: "chevron.right")
                            .font(.system(size: 10, weight: .light))
                            .foregroundStyle(YixiuTheme.mist)
                    }
                    .foregroundStyle(YixiuTheme.moon)
                    .frame(minHeight: 58)
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
            }
            .padding(.horizontal, 16)
            .yixiuPanel()
        }
    }

    private var detailTitle: String {
        switch page {
        case .home: language.text(zh: "我的一休", en: "My Yixiu")
        case .about: language.text(zh: "关于我们", en: "About Us")
        case .privacy: language.text(zh: "隐私说明", en: "Privacy")
        case .sources: language.text(zh: "声音来源", en: "Audio Sources")
        case .support: language.text(zh: "联系与反馈", en: "Contact")
        }
    }

    private func sectionLabel(_ title: String) -> some View {
        Text(title)
            .yixiuSecondary(8)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.bottom, 10)
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

    private func settingToggle(title: String, subtitle: String, isOn: Binding<Bool>) -> some View {
        HStack {
            VStack(alignment: .leading, spacing: 3) {
                Text(title)
                Text(subtitle)
                    .font(.system(size: 9))
                    .foregroundStyle(YixiuTheme.mist)
            }
            Spacer()
            Toggle("", isOn: isOn)
                .labelsHidden()
                .tint(YixiuTheme.aqua)
        }
        .frame(minHeight: 62)
    }

    private func infoRow(title: String, subtitle: String, icon: String, target: MePage) -> some View {
        Button {
            withAnimation(.easeOut(duration: 0.2)) {
                page = target
            }
        } label: {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.system(size: 16, weight: .light))
                    .foregroundStyle(YixiuTheme.aqua)
                    .frame(width: 36, height: 36)
                    .overlay(Circle().stroke(YixiuTheme.hairline, lineWidth: 0.8))
                VStack(alignment: .leading, spacing: 3) {
                    Text(title)
                        .font(YixiuTheme.chineseDisplay(15))
                    Text(subtitle)
                        .font(.system(size: 10))
                        .foregroundStyle(YixiuTheme.mist)
                        .lineLimit(1)
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.system(size: 12, weight: .light))
                    .foregroundStyle(YixiuTheme.mist)
            }
            .foregroundStyle(YixiuTheme.moon)
            .frame(minHeight: 66)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    private func workLink(index: String, title: String, tagline: String, description: String, url: String) -> some View {
        Link(destination: URL(string: url)!) {
            HStack(alignment: .top, spacing: 13) {
                Text(index)
                    .font(YixiuTheme.chineseDisplay(16))
                    .foregroundStyle(YixiuTheme.aqua)
                    .frame(width: 28, alignment: .leading)
                VStack(alignment: .leading, spacing: 5) {
                    HStack(spacing: 8) {
                        Text(title)
                            .font(YixiuTheme.chineseDisplay(15))
                        Text(tagline)
                            .font(.system(size: 9))
                            .foregroundStyle(YixiuTheme.aqua)
                    }
                    Text(description)
                        .font(.system(size: 10))
                        .lineSpacing(3)
                        .foregroundStyle(YixiuTheme.mist)
                        .multilineTextAlignment(.leading)
                }
                Spacer(minLength: 4)
                Image(systemName: "arrow.up.right")
                    .font(.system(size: 11, weight: .light))
                    .foregroundStyle(YixiuTheme.mist)
            }
            .foregroundStyle(YixiuTheme.moon)
            .padding(.vertical, 14)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    private func contactLink(title: String, value: String, icon: String, url: String) -> some View {
        Link(destination: URL(string: url)!) {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.system(size: 15, weight: .light))
                    .foregroundStyle(YixiuTheme.aqua)
                    .frame(width: 34)
                Text(title)
                    .font(YixiuTheme.chineseDisplay(14))
                Spacer()
                Text(value)
                    .font(.system(size: 10))
                    .foregroundStyle(YixiuTheme.mist)
                Image(systemName: "arrow.up.right")
                    .font(.system(size: 10, weight: .light))
                    .foregroundStyle(YixiuTheme.mist)
            }
            .foregroundStyle(YixiuTheme.moon)
            .frame(minHeight: 58)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    private func actionLinkLabel(_ title: String, icon: String) -> some View {
        Label(title, systemImage: icon)
            .font(.system(size: 13, weight: .semibold))
            .foregroundStyle(YixiuTheme.deepWater)
            .padding(.horizontal, 18)
            .frame(height: 48)
            .background(Capsule().fill(YixiuTheme.aquaStrong))
    }
}

private struct VideoChannelSheet: View {
    let language: AppLanguage
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack(spacing: 16) {
                Image("VideoChannelQR")
                    .resizable()
                    .interpolation(.high)
                    .scaledToFit()
                    .frame(maxWidth: 260)
                    .padding(12)
                    .background(
                        RoundedRectangle(cornerRadius: 22, style: .continuous)
                            .fill(.white)
                    )

                Text(language.text(zh: "微信扫码关注 WonderElian 视频号", en: "Scan in WeChat to follow WonderElian Channels"))
                    .font(YixiuTheme.chineseDisplay(16))
                    .foregroundStyle(YixiuTheme.moon)
                    .multilineTextAlignment(.center)
            }
            .padding(.horizontal, 24)
            .padding(.vertical, 18)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(YixiuTheme.deepWater)
            .navigationTitle(language.text(zh: "视频号", en: "WeChat Channels"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button(language.text(zh: "完成", en: "Done")) {
                        dismiss()
                    }
                    .foregroundStyle(YixiuTheme.aqua)
                }
            }
        }
        .preferredColorScheme(.dark)
    }
}

private struct AboutYixiuView: View {
    let language: AppLanguage

    private var pathItems: [String] {
        language == .zh
            ? ["认识自己", "接纳自己", "成为自己", "活出自己"]
            : ["Know yourself", "Accept yourself", "Become yourself", "Live as yourself"]
    }

    private var principles: [(String, String)] {
        language == .zh
            ? [
                ("一休", "先照顾身体，安顿情绪，再继续前行。"),
                ("不二", "接纳高峰与低谷，拥抱完整而非完美。"),
                ("三慢", "慢下来、慢慢来、慢慢成为，尊重生命的节奏。"),
                ("如水", "向内扎根，向外流动；顺应变化，不失本心。")
            ]
            : [
                ("Pause", "Care for the body, settle emotion, then continue."),
                ("Wholeness", "Accept peaks and valleys; choose wholeness over perfection."),
                ("Go slowly", "Slow down, take your time, and respect the rhythm of becoming."),
                ("Be Water", "Root inwardly, move outwardly; adapt without losing your center.")
            ]
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(language.text(zh: "真实自己，流动人生", en: "TRUE TO YOURSELF. FLOW WITH LIFE."))
                .yixiuSecondary(9)

            Text(language.text(
                zh: "一休，是一处让声音带你回到当下的空间。",
                en: "Yixiu is a space where sound brings you back to the present."
            ))
            .font(YixiuTheme.chineseDisplay(25))
            .lineSpacing(7)
            .foregroundStyle(YixiuTheme.moon)
            .padding(.top, 12)

            Text(language.text(
                zh: "我们用真实自然声、定时聆听与水之呼吸，陪你在工作、阅读、睡眠或情绪起伏时先停一停，照顾身体，听见自己，再继续前行。",
                en: "Through real nature sounds, timed listening and water breathing, we help you pause, care for the body, hear yourself and continue—through work, reading, sleep and emotional change."
            ))
            .font(.system(size: 13))
            .lineSpacing(7)
            .foregroundStyle(YixiuTheme.mist)
            .padding(.top, 16)

            VStack(alignment: .leading, spacing: 0) {
                Text(language.text(zh: "我们的生命观", en: "OUR PHILOSOPHY OF LIFE"))
                    .yixiuSecondary(9)

                Text(language.text(
                    zh: "生命不是用来证明自己的，而是用来认识、接纳、成为并活出自己。",
                    en: "Life is not for proving yourself. It is for knowing, accepting, becoming, and living as yourself."
                ))
                .font(YixiuTheme.chineseDisplay(20))
                .lineSpacing(8)
                .foregroundStyle(YixiuTheme.moon)
                .padding(.top, 11)

                Text(language.text(
                    zh: "真正的成长，不是把自己改造成某个标准答案，而是在变化中越来越诚实地看见自己，越来越从容地选择自己的活法。",
                    en: "Growth is not the work of turning yourself into a standard answer. It is learning to see yourself more honestly through change, and to choose your way of living with greater ease."
                ))
                .font(.system(size: 12))
                .lineSpacing(7)
                .foregroundStyle(YixiuTheme.mist)
                .padding(.top, 12)

                HStack(spacing: 0) {
                    ForEach(Array(pathItems.enumerated()), id: \.offset) { entry in
                        let index = entry.offset
                        let item = entry.element
                        VStack(alignment: .leading, spacing: 7) {
                            Text(String(format: "%02d", index + 1))
                                .font(.system(size: 9))
                                .foregroundStyle(YixiuTheme.aqua)
                            Text(item)
                                .font(YixiuTheme.chineseDisplay(11))
                                .lineLimit(2)
                                .minimumScaleFactor(0.75)
                                .foregroundStyle(YixiuTheme.moon)
                        }
                        .frame(maxWidth: .infinity, minHeight: 68, alignment: .leading)
                        .padding(.horizontal, 7)
                        .overlay(alignment: .trailing) {
                            if index < pathItems.count - 1 {
                                Rectangle().fill(YixiuTheme.hairline).frame(width: 0.7)
                            }
                        }
                    }
                }
                .overlay(alignment: .top) { Rectangle().fill(YixiuTheme.hairline).frame(height: 0.7) }
                .overlay(alignment: .bottom) { Rectangle().fill(YixiuTheme.hairline).frame(height: 0.7) }
                .padding(.vertical, 22)

                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 9) {
                    ForEach(Array(principles.enumerated()), id: \.offset) { entry in
                        let principle = entry.element
                        VStack(alignment: .leading, spacing: 6) {
                            Text(principle.0)
                                .font(YixiuTheme.chineseDisplay(14))
                                .foregroundStyle(YixiuTheme.aqua)
                            Text(principle.1)
                                .font(.system(size: 10))
                                .lineSpacing(4)
                                .foregroundStyle(YixiuTheme.mist)
                        }
                        .frame(maxWidth: .infinity, minHeight: 96, alignment: .topLeading)
                        .padding(13)
                        .background(YixiuTheme.aqua.opacity(0.045))
                        .overlay(Rectangle().stroke(YixiuTheme.hairline, lineWidth: 0.7))
                    }
                }

                Text(language.text(
                    zh: "向内认识自己，向外如水而行。",
                    en: "Know yourself within; move through the world like water."
                ))
                .font(YixiuTheme.chineseDisplay(17))
                .lineSpacing(7)
                .foregroundStyle(YixiuTheme.moon)
                .frame(maxWidth: .infinity)
                .multilineTextAlignment(.center)
                .padding(.top, 22)

                Text(language.text(
                    zh: "我们愿陪伴彼此走过低谷与高峰，探索身心健康的工作与生活方式；真实面对自己与世界，善待自己、他人与生命，并在创造和欣赏中活出生命之美。",
                    en: "We hope to accompany one another through valleys and peaks, exploring healthier ways to work and live: facing self and world truthfully, treating life with kindness, and creating and appreciating beauty."
                ))
                .font(.system(size: 11))
                .lineSpacing(6)
                .foregroundStyle(YixiuTheme.mist)
                .padding(.top, 16)
                .overlay(alignment: .top) {
                    Rectangle()
                        .fill(YixiuTheme.hairline)
                        .frame(height: 0.7)
                }
                .padding(.top, 16)
            }
            .padding(.vertical, 24)
            .overlay(alignment: .top) { Rectangle().fill(YixiuTheme.hairline).frame(height: 0.7) }
            .overlay(alignment: .bottom) { Rectangle().fill(YixiuTheme.hairline).frame(height: 0.7) }
            .padding(.top, 30)
        }
    }
}

private struct MeArticle: View {
    let eyebrow: String
    let title: String
    let paragraphs: [String]
    let quote: String

    var body: some View {
        VStack(alignment: .leading, spacing: 18) {
            Text(eyebrow)
                .yixiuSecondary(9)
            Text(title)
                .font(YixiuTheme.chineseDisplay(27))
                .foregroundStyle(YixiuTheme.moon)
            ForEach(paragraphs, id: \.self) { paragraph in
                Text(paragraph)
                    .font(.system(size: 14))
                    .lineSpacing(7)
                    .foregroundStyle(YixiuTheme.mist)
            }
            Text(quote)
                .font(YixiuTheme.chineseDisplay(17))
                .lineSpacing(6)
                .foregroundStyle(YixiuTheme.aquaStrong)
                .padding(18)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(
                    RoundedRectangle(cornerRadius: 20, style: .continuous)
                        .fill(YixiuTheme.aqua.opacity(0.06))
                        .overlay(
                            RoundedRectangle(cornerRadius: 20, style: .continuous)
                                .stroke(YixiuTheme.hairline, lineWidth: 0.8)
                        )
                )
                .padding(.top, 6)
        }
    }
}
