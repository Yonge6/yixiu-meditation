import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var appState: AppState
    @State private var libraryOpen = false

    var body: some View {
        GeometryReader { rootGeometry in
            ZStack(alignment: .trailing) {
                Group {
                    switch appState.activeTab {
                    case .listen:
                        ListenView()
                    case .focus:
                        FocusView()
                    case .me:
                        MeView()
                    }
                }
                .frame(width: rootGeometry.size.width, height: rootGeometry.size.height)
                .clipped()

                TabBarOverlay(bottomInset: rootGeometry.safeAreaInsets.bottom)
                    .zIndex(4)

                if appState.activeTab != .listen {
                    DrawerTrigger()
                }

                if appState.drawerOpen {
                    YixiuDrawer {
                        libraryOpen = true
                    }
                    .transition(.move(edge: .trailing).combined(with: .opacity))
                    .zIndex(10)
                }
            }
            .frame(width: rootGeometry.size.width, height: rootGeometry.size.height)
        }
        .background(YixiuTheme.deepWater)
        .preferredColorScheme(.dark)
        .sheet(isPresented: $libraryOpen) {
            SoundLibraryView()
                .presentationDetents([.large])
                .presentationDragIndicator(.visible)
                .presentationBackground(YixiuTheme.deepWater)
        }
    }
}

private struct YixiuTabBar: View {
    @EnvironmentObject private var appState: AppState
    let bottomInset: CGFloat

    var body: some View {
        HStack(spacing: 4) {
            ForEach(RootTab.allCases) { tab in
                Button {
                    guard appState.activeTab != tab else { return }
                    if tab != .listen {
                        appState.pause()
                    }
                    withAnimation(.easeOut(duration: 0.18)) {
                        appState.activeTab = tab
                    }
                } label: {
                    VStack(spacing: 3) {
                        Image(systemName: tab.icon)
                            .font(.system(size: 19, weight: .light))
                            .frame(height: 22)
                        Text(appState.language.text(zh: tab.zhName, en: tab.enName.capitalized))
                            .font(YixiuTheme.chineseDisplay(13))
                        Text(appState.language.secondary(zh: tab.zhName, en: tab.enName))
                            .font(YixiuTheme.englishSerif(8, weight: .semibold))
                            .tracking(1)
                    }
                    .foregroundStyle(appState.activeTab == tab ? YixiuTheme.aquaStrong : YixiuTheme.mist.opacity(0.72))
                    .frame(maxWidth: .infinity)
                    .frame(minHeight: 58)
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .accessibilityLabel(appState.language.text(zh: tab.zhName, en: tab.enName.capitalized))
            }
        }
        .padding(.horizontal, 18)
        .padding(.top, 7)
        .padding(.bottom, max(bottomInset, 5))
        .background(
            YixiuTheme.deepWater.opacity(0.96)
                .overlay(alignment: .top) {
                    Rectangle()
                        .fill(YixiuTheme.hairline)
                        .frame(height: 0.7)
                }
                .ignoresSafeArea(edges: .bottom)
        )
    }
}

private struct TabBarOverlay: View {
    let bottomInset: CGFloat

    var body: some View {
        VStack(spacing: 0) {
            Spacer(minLength: 0)
            YixiuTabBar(bottomInset: bottomInset)
        }
        .ignoresSafeArea()
    }
}

private struct DrawerTrigger: View {
    @EnvironmentObject private var appState: AppState

    var body: some View {
        GeometryReader { geometry in
            Button {
                withAnimation(.easeOut(duration: 0.2)) {
                    appState.drawerOpen = true
                }
            } label: {
                Image(systemName: "line.3.horizontal")
                    .font(.system(size: 25, weight: .light))
                    .foregroundStyle(YixiuTheme.moon)
                    .frame(width: 48, height: 48)
                    .background(Circle().fill(YixiuTheme.deepWater.opacity(0.62)))
                    .overlay(Circle().stroke(YixiuTheme.hairline, lineWidth: 0.7))
            }
            .buttonStyle(.plain)
            .position(
                x: geometry.size.width - 42,
                y: geometry.safeAreaInsets.top + 30
            )
        }
    }
}

private enum DrawerPage: Equatable {
    case home
    case philosophy
    case privacy
    case support
}

private struct YixiuDrawer: View {
    @EnvironmentObject private var appState: AppState
    @State private var page: DrawerPage = .home
    let showLibrary: () -> Void

    private var language: AppLanguage { appState.language }

    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .trailing) {
                Color.black.opacity(0.52)
                    .ignoresSafeArea()
                    .onTapGesture { close() }

                VStack(spacing: 0) {
                    drawerHeader
                    Rectangle()
                        .fill(YixiuTheme.hairline)
                        .frame(height: 0.7)

                    ScrollView(showsIndicators: false) {
                        Group {
                            switch page {
                            case .home:
                                drawerHome
                            case .philosophy:
                                philosophyDetail
                            case .privacy:
                                privacyDetail
                            case .support:
                                supportDetail
                            }
                        }
                        .padding(.horizontal, 20)
                        .padding(.top, 22)
                        .padding(.bottom, 36)
                    }
                }
                .frame(width: min(geometry.size.width * 0.91, 390))
                .frame(maxHeight: .infinity)
                .background(
                    LinearGradient(
                        colors: [YixiuTheme.deepWaterSoft, YixiuTheme.deepWater],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .clipShape(
                    UnevenRoundedRectangle(
                        topLeadingRadius: 24,
                        bottomLeadingRadius: 24,
                        bottomTrailingRadius: 0,
                        topTrailingRadius: 0,
                        style: .continuous
                    )
                )
                .overlay(alignment: .leading) {
                    Rectangle().fill(YixiuTheme.hairline).frame(width: 0.7)
                }
                .padding(.top, geometry.safeAreaInsets.top + 6)
                .padding(.bottom, max(geometry.safeAreaInsets.bottom, 10))
                .shadow(color: .black.opacity(0.32), radius: 30, x: -12, y: 0)
            }
        }
    }

    private var drawerHeader: some View {
        HStack(spacing: 10) {
            Group {
                if page == .home {
                    Image(systemName: "water.waves")
                        .font(.system(size: 17, weight: .light))
                        .foregroundStyle(YixiuTheme.aqua)
                        .frame(width: 48, height: 48)
                        .accessibilityHidden(true)
                } else {
                    Button {
                        withAnimation(.easeOut(duration: 0.18)) {
                            page = .home
                        }
                    } label: {
                        Image(systemName: "chevron.left")
                            .font(.system(size: 18, weight: .medium))
                            .foregroundStyle(YixiuTheme.moon)
                            .frame(width: 48, height: 48)
                            .contentShape(Rectangle())
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel(language.text(zh: "返回", en: "Back"))
                }
            }

            VStack(alignment: .leading, spacing: 4) {
                Text("一休 · YIXIU")
                    .yixiuSecondary(8)
                Text(headerTitle)
                    .font(YixiuTheme.chineseDisplay(22))
                    .foregroundStyle(YixiuTheme.moon)
                    .lineLimit(1)
            }

            Spacer(minLength: 4)

            Button { close() } label: {
                Image(systemName: "xmark")
                    .font(.system(size: 19, weight: .light))
                    .foregroundStyle(YixiuTheme.moon)
                    .frame(width: 48, height: 48)
                    .background(Circle().fill(YixiuTheme.aqua.opacity(0.08)))
                    .contentShape(Circle())
            }
            .buttonStyle(.plain)
            .accessibilityLabel(language.text(zh: "关闭", en: "Close"))
        }
        .frame(height: 72)
        .padding(.horizontal, 14)
    }

    private var headerTitle: String {
        switch page {
        case .home:
            language.text(zh: "你的空间", en: "Your Space")
        case .philosophy:
            language.text(zh: "产品哲学", en: "Philosophy")
        case .privacy:
            language.text(zh: "隐私说明", en: "Privacy")
        case .support:
            language.text(zh: "支持与反馈", en: "Support")
        }
    }

    private var drawerHome: some View {
        VStack(alignment: .leading, spacing: 0) {
            VStack(alignment: .leading, spacing: 10) {
                Text(language.text(zh: "六律水声", en: "WATER SOUNDS"))
                    .yixiuSecondary(8)
                Text(language.text(zh: "让声音带你回到此刻", en: "Let sound return you to now"))
                    .font(YixiuTheme.chineseDisplay(19))
                Text(language.text(
                    zh: "正在聆听：\(appState.scene.zhName)",
                    en: "Now listening: \(appState.scene.enName)"
                ))
                .font(.system(size: 11))
                .foregroundStyle(YixiuTheme.mist)

                Button {
                    close()
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.24) {
                        showLibrary()
                    }
                } label: {
                    Label(language.text(zh: "浏览全部 14 种声音", en: "Browse all 14 sounds"), systemImage: "water.waves")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(YixiuTheme.deepWater)
                        .frame(maxWidth: .infinity)
                        .frame(height: 46)
                        .background(Capsule().fill(YixiuTheme.aquaStrong))
                }
                .buttonStyle(.plain)
                .padding(.top, 8)
            }
            .padding(18)
            .yixiuPanel()

            drawerSectionTitle(language.text(zh: "聆听设置", en: "LISTENING"))
                .padding(.top, 24)

            VStack(alignment: .leading, spacing: 14) {
                HStack(spacing: 12) {
                    drawerIcon("timer")
                    VStack(alignment: .leading, spacing: 3) {
                        Text(language.text(zh: "默认定时", en: "Default timer"))
                            .font(YixiuTheme.chineseDisplay(15))
                        Text(appState.durationLabel)
                            .font(.system(size: 10))
                            .foregroundStyle(YixiuTheme.mist)
                    }
                }

                HStack(spacing: 7) {
                    ForEach([15, 30, 60, 0], id: \.self) { minutes in
                        Button {
                            appState.selectDuration(minutes)
                        } label: {
                            Text(minutes == 0
                                ? language.text(zh: "不限", en: "∞")
                                : "\(minutes)")
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundStyle(appState.duration == minutes ? YixiuTheme.deepWater : YixiuTheme.moon)
                                .frame(maxWidth: .infinity)
                                .frame(height: 36)
                                .background(
                                    Capsule().fill(
                                        appState.duration == minutes
                                            ? YixiuTheme.aquaStrong
                                            : YixiuTheme.aqua.opacity(0.08)
                                    )
                                )
                                .overlay(Capsule().stroke(YixiuTheme.hairline, lineWidth: 0.7))
                        }
                        .buttonStyle(.plain)
                    }
                }

                Divider().overlay(YixiuTheme.hairline)

                HStack(spacing: 12) {
                    drawerIcon("speaker.wave.2")
                    VStack(alignment: .leading, spacing: 3) {
                        Text(language.text(zh: "后台播放", en: "Background audio"))
                            .font(YixiuTheme.chineseDisplay(15))
                        Text(language.text(zh: "离开画面，水声仍可继续", en: "Keep listening outside the app"))
                            .font(.system(size: 10))
                            .foregroundStyle(YixiuTheme.mist)
                    }
                    Spacer()
                    Toggle("", isOn: $appState.backgroundPlayback)
                        .labelsHidden()
                        .tint(YixiuTheme.aqua)
                }
                .frame(minHeight: 50)
            }
            .padding(16)
            .background(
                RoundedRectangle(cornerRadius: 20, style: .continuous)
                    .fill(YixiuTheme.aqua.opacity(0.035))
                    .overlay(
                        RoundedRectangle(cornerRadius: 20, style: .continuous)
                            .stroke(YixiuTheme.hairline, lineWidth: 0.7)
                    )
            )

            drawerSectionTitle(language.text(zh: "关于一休", en: "ABOUT YIXIU"))
                .padding(.top, 24)

            VStack(spacing: 0) {
                infoRow(language.text(zh: "产品哲学", en: "Our philosophy"), subtitle: language.text(zh: "真实自己，流动人生", en: "True to yourself, flow with life"), icon: "drop", page: .philosophy)
                Divider().overlay(YixiuTheme.hairline)
                infoRow(language.text(zh: "隐私说明", en: "Privacy"), subtitle: language.text(zh: "偏好只保存在这台设备", en: "Preferences stay on this device"), icon: "lock", page: .privacy)
                Divider().overlay(YixiuTheme.hairline)
                infoRow(language.text(zh: "支持与反馈", en: "Support"), subtitle: "hustyy986@gmail.com", icon: "questionmark", page: .support)
            }

            drawerSectionTitle(language.text(zh: "沿途所作", en: "MORE FROM US"))
                .padding(.top, 24)

            VStack(spacing: 0) {
                workLink("虾子曰", subtitle: language.text(zh: "全球热点与艺术表达", en: "Global stories through art"), url: "https://xiazishuo.com")
                Divider().overlay(YixiuTheme.hairline)
                workLink("三慢问道", subtitle: language.text(zh: "读懂经典，也读懂自己", en: "Ancient wisdom for modern life"), url: "https://wendao.wonderelian.com")
                Divider().overlay(YixiuTheme.hairline)
                workLink(language.text(zh: "艺术风格图鉴", en: "Style Atlas"), subtitle: language.text(zh: "探索视觉风格的边界", en: "Explore the language of style"), url: "https://style-atlas.wonderelian.com")
            }

            Text(language.text(zh: "向内认识自己，向外如水而行。", en: "Know within. Move like water."))
                .font(YixiuTheme.chineseDisplay(11))
                .tracking(1)
                .foregroundStyle(YixiuTheme.mist.opacity(0.48))
                .frame(maxWidth: .infinity)
                .padding(.top, 28)
        }
    }

    private var philosophyDetail: some View {
        DrawerArticle(
            eyebrow: language.text(zh: "生命观", en: "LIFE PHILOSOPHY"),
            title: language.text(zh: "真实自己，流动人生", en: "True to yourself. Flow with life."),
            paragraphs: [
                language.text(
                    zh: "生命不是用来证明自己的，而是用来认识自己、接纳自己、成为自己、活出自己。",
                    en: "Life is not something to prove. It is a path to know, accept, become and live as yourself."
                ),
                language.text(
                    zh: "水不与万物争，却能抵达远方。我们希望每一次聆听，都让你少一点对抗，多一点觉察。",
                    en: "Water competes with nothing, yet reaches far. Each listening session is an invitation to resist less and notice more."
                )
            ],
            quote: language.text(zh: "向内认识自己，向外如水而行。", en: "Know within. Move like water.")
        )
    }

    private var privacyDetail: some View {
        DrawerArticle(
            eyebrow: language.text(zh: "你的数据", en: "YOUR DATA"),
            title: language.text(zh: "安静，也应该是私密的", en: "Quiet should remain private"),
            paragraphs: [
                language.text(
                    zh: "一休无需账号。你选择的声音、收藏、界面语言、音量与定时时长，只保存在当前设备。",
                    en: "Yixiu requires no account. Your sound, favorites, language, volume and timer preferences stay on this device."
                ),
                language.text(
                    zh: "卸载 App 会同时移除这些本地偏好。我们不会将你的冥想选择出售给第三方。",
                    en: "Removing the app also removes these local preferences. We do not sell your meditation choices to third parties."
                )
            ],
            quote: language.text(zh: "少一些记录，多一些当下。", en: "Less tracking. More presence.")
        )
    }

    private var supportDetail: some View {
        VStack(alignment: .leading, spacing: 18) {
            Text(language.text(zh: "支持与反馈", en: "SUPPORT"))
                .yixiuSecondary(9)
            Text(language.text(zh: "让一休更像你需要的样子", en: "Help Yixiu become more useful to you"))
                .font(YixiuTheme.chineseDisplay(27))
                .foregroundStyle(YixiuTheme.moon)
            Text(language.text(
                zh: "如果声音无法播放、画面显示异常，或你希望加入新的白噪音，请告诉我们使用的设备、系统版本和声音名称。",
                en: "If audio cannot play, a scene looks wrong, or you would like a new sound, tell us your device, system version and the sound name."
            ))
            .font(.system(size: 14))
            .lineSpacing(7)
            .foregroundStyle(YixiuTheme.mist)

            Link(destination: URL(string: "mailto:hustyy986@gmail.com?subject=Yixiu%20Feedback")!) {
                HStack {
                    Image(systemName: "envelope")
                    Text(language.text(zh: "发送反馈邮件", en: "Send feedback email"))
                    Spacer()
                    Image(systemName: "arrow.up.right")
                }
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(YixiuTheme.deepWater)
                .padding(.horizontal, 18)
                .frame(height: 50)
                .background(Capsule().fill(YixiuTheme.aquaStrong))
            }
            .buttonStyle(.plain)
            .padding(.top, 6)
        }
    }

    private func drawerSectionTitle(_ title: String) -> some View {
        Text(title)
            .yixiuSecondary(8)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.bottom, 10)
    }

    private func drawerIcon(_ symbol: String) -> some View {
        Image(systemName: symbol)
            .font(.system(size: 16, weight: .light))
            .foregroundStyle(YixiuTheme.aqua)
            .frame(width: 36, height: 36)
            .overlay(Circle().stroke(YixiuTheme.hairline, lineWidth: 0.8))
    }

    private func infoRow(_ title: String, subtitle: String, icon: String, page target: DrawerPage) -> some View {
        Button {
            withAnimation(.easeOut(duration: 0.18)) {
                page = target
            }
        } label: {
            HStack(spacing: 12) {
                drawerIcon(icon)
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

    private func workLink(_ title: String, subtitle: String, url: String) -> some View {
        Link(destination: URL(string: url)!) {
            HStack(spacing: 12) {
                Image(systemName: "circle.grid.cross")
                    .font(.system(size: 15, weight: .light))
                    .foregroundStyle(YixiuTheme.aqua)
                    .frame(width: 36, height: 36)
                    .overlay(Circle().stroke(YixiuTheme.hairline, lineWidth: 0.8))
                VStack(alignment: .leading, spacing: 3) {
                    Text(title)
                        .font(YixiuTheme.chineseDisplay(14))
                    Text(subtitle)
                        .font(.system(size: 10))
                        .foregroundStyle(YixiuTheme.mist)
                        .lineLimit(1)
                }
                Spacer()
                Image(systemName: "arrow.up.right")
                    .font(.system(size: 11, weight: .light))
                    .foregroundStyle(YixiuTheme.mist)
            }
            .foregroundStyle(YixiuTheme.moon)
            .frame(minHeight: 62)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    private func close() {
        withAnimation(.easeOut(duration: 0.2)) {
            appState.drawerOpen = false
        }
    }
}

private struct DrawerArticle: View {
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
