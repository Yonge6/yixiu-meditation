import SwiftUI

private enum MePage: Equatable {
    case home
    case philosophy
    case privacy
    case sources
    case support
}

struct MeView: View {
    @EnvironmentObject private var appState: AppState
    @State private var page: MePage = .home
    @State private var libraryOpen = false

    private var language: AppLanguage { appState.language }

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                background

                if page == .home {
                    home
                        .transition(.opacity)
                } else {
                    detail(geometry: geometry)
                        .transition(.move(edge: .trailing).combined(with: .opacity))
                }
            }
            .frame(width: geometry.size.width, height: geometry.size.height)
        }
        .sheet(isPresented: $libraryOpen) {
            SoundLibraryView()
                .presentationDetents([.large])
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

    private var home: some View {
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

                Text("YIXIU 2.0 · \(language.text(zh: "偏好只保存在这台设备", en: "Preferences stay on this device"))")
                    .font(YixiuTheme.englishSerif(9))
                    .tracking(1)
                    .foregroundStyle(YixiuTheme.mist.opacity(0.38))
                    .padding(.top, 10)
                    .padding(.bottom, 122)
            }
            .padding(.horizontal, 18)
        }
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
                title: language.text(zh: "产品哲学", en: "Our philosophy"),
                subtitle: language.text(zh: "真实自己，流动人生", en: "True to yourself, flow with life"),
                icon: "drop",
                target: .philosophy
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
            .padding(.top, geometry.safeAreaInsets.top + 5)
            .padding(.bottom, 12)
            .background(YixiuTheme.deepWater.opacity(0.82))

            Divider().overlay(YixiuTheme.hairline)

            ScrollView(showsIndicators: false) {
                detailBody
                    .padding(.horizontal, 20)
                    .padding(.top, 26)
                    .padding(.bottom, 124)
            }
        }
        .ignoresSafeArea(edges: .top)
    }

    @ViewBuilder
    private var detailBody: some View {
        switch page {
        case .philosophy:
            MeArticle(
                eyebrow: language.text(zh: "生命观", en: "LIFE PHILOSOPHY"),
                title: language.text(zh: "真实自己，流动人生", en: "True to yourself. Flow with life."),
                paragraphs: [
                    language.text(
                        zh: "生命不是用来证明自己的，而是用来认识自己、接纳自己、成为自己、活出自己。",
                        en: "Life is not something to prove. It is a path to know, accept, become and live as yourself."
                    ),
                    language.text(
                        zh: "水不与万物争，却能抵达远方。每一次聆听，都是少一点对抗、多一点觉察。",
                        en: "Water competes with nothing, yet reaches far. Each listening session is an invitation to resist less and notice more."
                    )
                ],
                quote: language.text(zh: "向内认识自己，向外如水而行。", en: "Know within. Move like water.")
            )
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
                contactLink(title: language.text(zh: "邮箱", en: "Email"), value: "hustyy986@gmail.com", icon: "envelope", url: "mailto:hustyy986@gmail.com?subject=Yixiu%20Feedback")
                Divider().overlay(YixiuTheme.hairline)
                contactLink(title: language.text(zh: "小红书", en: "RED"), value: language.text(zh: "打开主页", en: "Open profile"), icon: "book", url: "https://xhslink.cn/m/3OF5qu7Peui")
                Divider().overlay(YixiuTheme.hairline)
                contactLink(title: language.text(zh: "抖音", en: "Douyin"), value: language.text(zh: "打开主页", en: "Open profile"), icon: "music.note", url: "https://v.douyin.com/d9L1thkye0Y/")
                Divider().overlay(YixiuTheme.hairline)
                contactLink(title: "X", value: "@yongyuan1", icon: "at", url: "https://x.com/yongyuan1?s=11")
                Divider().overlay(YixiuTheme.hairline)
                contactLink(title: "TikTok", value: "@wonderelian", icon: "play.rectangle", url: "https://www.tiktok.com/@wonderelian")
            }
            .padding(.horizontal, 16)
            .yixiuPanel()
        }
    }

    private var detailTitle: String {
        switch page {
        case .home: language.text(zh: "我的一休", en: "My Yixiu")
        case .philosophy: language.text(zh: "产品哲学", en: "Philosophy")
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
