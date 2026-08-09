import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var appState: AppState
    @State private var libraryOpen = false

    var body: some View {
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

            if appState.activeTab != .listen {
                Button {
                    withAnimation(.easeOut(duration: 0.2)) {
                        appState.drawerOpen = true
                    }
                } label: {
                    Image(systemName: "line.3.horizontal")
                        .font(.system(size: 27, weight: .light))
                        .foregroundStyle(YixiuTheme.moon)
                        .frame(width: 48, height: 48)
                        .background(Circle().fill(YixiuTheme.deepWater.opacity(0.44)))
                }
                .buttonStyle(.plain)
                .padding(.top, 10)
                .padding(.trailing, 18)
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topTrailing)
                .ignoresSafeArea(edges: .top)
            }

            if appState.drawerOpen {
                YixiuDrawer {
                    libraryOpen = true
                }
                .transition(.move(edge: .trailing).combined(with: .opacity))
                .zIndex(10)
            }
        }
        .background(YixiuTheme.deepWater)
        .preferredColorScheme(.dark)
        .ignoresSafeArea(edges: .bottom)
        .sheet(isPresented: $libraryOpen) {
            SoundLibraryView()
                .presentationDetents([.large])
                .presentationDragIndicator(.visible)
                .presentationBackground(YixiuTheme.deepWater)
        }
    }
}

private struct YixiuDrawer: View {
    @EnvironmentObject private var appState: AppState
    let showLibrary: () -> Void

    private var language: AppLanguage { appState.language }

    var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .trailing) {
                Color.black.opacity(0.46)
                    .ignoresSafeArea()
                    .onTapGesture { close() }

                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 0) {
                        HStack(alignment: .top) {
                            VStack(alignment: .leading, spacing: 5) {
                                Text("一休 · YIXIU")
                                    .yixiuSecondary(9)
                                Text(language.text(zh: "你的空间", en: "Your Space"))
                                    .font(YixiuTheme.chineseDisplay(27))
                                    .foregroundStyle(YixiuTheme.moon)
                            }
                            Spacer()
                            Button { close() } label: {
                                Image(systemName: "xmark")
                                    .font(.system(size: 20, weight: .light))
                                    .frame(width: 44, height: 44)
                            }
                            .buttonStyle(.plain)
                        }
                        .padding(.top, max(geometry.safeAreaInsets.top + 18, 44))

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
                                showLibrary()
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
                        .padding(.top, 24)

                        VStack(spacing: 0) {
                            drawerRow(.listen, subtitle: language.text(zh: "声音与画面", en: "Sound and scene"))
                            Divider().overlay(YixiuTheme.hairline)
                            drawerRow(.focus, subtitle: language.text(zh: "一分种水之呼吸", en: "One-minute breathing"))
                            Divider().overlay(YixiuTheme.hairline)
                            drawerRow(.me, subtitle: language.text(zh: "收藏、定时与设置", en: "Favorites, timer and settings"))
                        }
                        .padding(.top, 20)

                        Divider().overlay(YixiuTheme.hairline)
                            .padding(.top, 18)

                        VStack(spacing: 0) {
                            infoRow(language.text(zh: "产品哲学", en: "Our philosophy"), icon: "drop")
                            infoRow(language.text(zh: "隐私说明", en: "Privacy"), icon: "lock")
                            infoRow(language.text(zh: "支持与反馈", en: "Support"), icon: "questionmark")
                        }

                        Text(language.text(zh: "向内认识自己，向外如水而行。", en: "Know within. Move like water."))
                            .font(YixiuTheme.chineseDisplay(11))
                            .tracking(1)
                            .foregroundStyle(YixiuTheme.mist.opacity(0.48))
                            .frame(maxWidth: .infinity)
                            .padding(.top, 28)
                            .padding(.bottom, 46)
                    }
                    .padding(.horizontal, 20)
                }
                .frame(width: min(geometry.size.width * 0.88, 390))
                .frame(maxHeight: .infinity)
                .background(
                    LinearGradient(
                        colors: [YixiuTheme.deepWaterSoft, YixiuTheme.deepWater],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .overlay(alignment: .leading) {
                    Rectangle().fill(YixiuTheme.hairline).frame(width: 0.7)
                }
                .ignoresSafeArea()
            }
        }
    }

    private func drawerRow(_ tab: RootTab, subtitle: String) -> some View {
        Button {
            if tab != .listen { appState.pause() }
            appState.activeTab = tab
            close()
        } label: {
            HStack(spacing: 14) {
                Image(systemName: tab.icon)
                    .font(.system(size: 18, weight: .light))
                    .foregroundStyle(appState.activeTab == tab ? YixiuTheme.aquaStrong : YixiuTheme.aqua)
                    .frame(width: 36, height: 36)
                    .overlay(Circle().stroke(YixiuTheme.hairline, lineWidth: 0.8))
                VStack(alignment: .leading, spacing: 3) {
                    Text(language.text(zh: tab.zhName, en: tab.enName.capitalized))
                        .font(YixiuTheme.chineseDisplay(16))
                    Text(subtitle)
                        .font(.system(size: 10))
                        .foregroundStyle(YixiuTheme.mist)
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.system(size: 12, weight: .light))
                    .foregroundStyle(YixiuTheme.mist)
            }
            .foregroundStyle(YixiuTheme.moon)
            .frame(height: 66)
        }
        .buttonStyle(.plain)
    }

    private func infoRow(_ title: String, icon: String) -> some View {
        Button {
            appState.activeTab = .me
            close()
        } label: {
            HStack(spacing: 14) {
                Image(systemName: icon)
                    .foregroundStyle(YixiuTheme.aqua)
                    .frame(width: 24)
                Text(title)
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.system(size: 11, weight: .light))
                    .foregroundStyle(YixiuTheme.mist)
            }
            .font(.system(size: 13))
            .foregroundStyle(YixiuTheme.moon)
            .frame(height: 52)
        }
        .buttonStyle(.plain)
    }

    private func close() {
        withAnimation(.easeOut(duration: 0.2)) {
            appState.drawerOpen = false
        }
    }
}
