import SwiftUI

struct ListenView: View {
    @EnvironmentObject private var appState: AppState
    @State private var menuOpen = false
    @State private var libraryOpen = false
    @State private var timerOpen = false
    @State private var sceneDragOffset: CGFloat = 0
    @State private var sceneSwipeProgress: CGFloat = 0
    @State private var sceneSwipeSettling = false

    private var language: AppLanguage { appState.language }

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                background

                Color.clear
                    .contentShape(Rectangle())
                    .gesture(sceneSwipeGesture(width: geometry.size.width))
                    .accessibilityHidden(true)

                header
                    .position(
                        x: geometry.size.width / 2,
                        y: max(geometry.safeAreaInsets.top + 26, 58)
                    )

                sceneIdentity
                    .position(x: geometry.size.width / 2, y: geometry.size.height * 0.565)
                    .offset(x: sceneDragOffset * 0.12)
                    .opacity(1 - sceneSwipeProgress * 0.55)
                    .allowsHitTesting(false)

                transport
                    .position(x: geometry.size.width / 2, y: geometry.size.height * 0.725)

                volume
                    .position(x: geometry.size.width / 2, y: geometry.size.height * 0.815)

                durationButton
                    .position(x: geometry.size.width / 2, y: geometry.size.height * 0.865)

                if menuOpen {
                    menuPanel
                        .padding(.horizontal, 20)
                        .position(x: geometry.size.width / 2, y: 122)
                }

                if timerOpen {
                    timerPanel
                        .padding(.horizontal, 18)
                        .position(x: geometry.size.width / 2, y: geometry.size.height - 128)
                }

                if let audioError = appState.audioError {
                    Text(audioError)
                        .font(.system(size: 12))
                        .foregroundStyle(YixiuTheme.moon)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 18)
                        .padding(.vertical, 10)
                        .background(Capsule().fill(YixiuTheme.deepWater.opacity(0.92)))
                        .padding(.horizontal, 30)
                        .position(x: geometry.size.width / 2, y: geometry.size.height - 118)
                }

                if appState.sessionCompleted {
                    completionPanel
                        .padding(.horizontal, 28)
                }
            }
            .frame(width: geometry.size.width, height: geometry.size.height)
        }
        .ignoresSafeArea()
        .sheet(isPresented: $libraryOpen) {
            SoundLibraryView()
                .presentationDetents([.large])
                .presentationDragIndicator(.visible)
                .presentationBackground(YixiuTheme.deepWater)
        }
    }

    private var background: some View {
        ZStack {
            if abs(sceneDragOffset) > 0.5 {
                Image(sceneSwipePreview.assetName)
                    .resizable()
                    .scaledToFill()
                    .offset(x: (sceneDragOffset < 0 ? 1 : -1) * (1 - sceneSwipeProgress) * 42)
                    .scaleEffect(1.035 - sceneSwipeProgress * 0.035)
                    .opacity(sceneSwipeProgress)
                    .ignoresSafeArea()
            }

            Image(appState.scene.assetName)
                .resizable()
                .scaledToFill()
                .offset(x: sceneDragOffset * 0.16)
                .scaleEffect(1 - sceneSwipeProgress * 0.025)
                .opacity(1 - sceneSwipeProgress * 0.90)
                .ignoresSafeArea()

            Color(red: 0, green: 17 / 255, blue: 25 / 255)
                .opacity(0.18)

            LinearGradient(
                colors: [.clear, YixiuTheme.deepWater.opacity(0.20), YixiuTheme.deepWater.opacity(0.96)],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
        }
    }

    private var sceneSwipePreview: MeditationScene {
        guard let index = MeditationScene.allCases.firstIndex(of: appState.scene) else { return .ocean }
        let direction = sceneDragOffset < 0 ? 1 : -1
        let count = MeditationScene.allCases.count
        return MeditationScene.allCases[(index + direction + count) % count]
    }

    private func sceneSwipeGesture(width: CGFloat) -> some Gesture {
        DragGesture(minimumDistance: 8)
            .onChanged { value in
                guard !sceneSwipeSettling else { return }
                let horizontal = value.translation.width
                let vertical = value.translation.height
                guard abs(horizontal) > abs(vertical) * 1.15 else { return }
                let limit = max(width * 0.72, 1)
                sceneDragOffset = max(-limit, min(limit, horizontal))
                sceneSwipeProgress = min(abs(sceneDragOffset) / max(width * 0.62, 1), 1)
            }
            .onEnded { value in
                let horizontal = value.translation.width
                let vertical = value.translation.height
                guard abs(horizontal) >= 48, abs(horizontal) > abs(vertical) * 1.2 else {
                    withAnimation(.spring(response: 0.34, dampingFraction: 0.82)) {
                        sceneDragOffset = 0
                        sceneSwipeProgress = 0
                    }
                    return
                }

                let direction = horizontal < 0 ? 1 : -1
                sceneSwipeSettling = true
                withAnimation(.timingCurve(0.22, 1, 0.36, 1, duration: 0.26)) {
                    sceneDragOffset = direction == 1 ? -width : width
                    sceneSwipeProgress = 1
                }

                DispatchQueue.main.asyncAfter(deadline: .now() + 0.26) {
                    appState.moveScene(direction)
                    var transaction = Transaction()
                    transaction.disablesAnimations = true
                    withTransaction(transaction) {
                        sceneDragOffset = 0
                        sceneSwipeProgress = 0
                        sceneSwipeSettling = false
                    }
                }
            }
    }

    private var header: some View {
        HStack {
            Button {
                appState.language = appState.language == .zh ? .en : .zh
            } label: {
                HStack(alignment: .firstTextBaseline, spacing: 11) {
                    Text(language == .zh ? "一休" : "YIXIU")
                        .font(YixiuTheme.chineseDisplay(25))
                        .tracking(2)
                    Text(language == .zh ? "YIXIU" : "一休")
                        .font(.system(size: 11, weight: .regular))
                        .tracking(4)
                }
                .foregroundStyle(YixiuTheme.moon)
            }
            .buttonStyle(.plain)

            Spacer()

            Button {
                timerOpen = false
                withAnimation(.easeOut(duration: 0.18)) {
                    menuOpen.toggle()
                }
            } label: {
                Image(systemName: "line.3.horizontal")
                    .font(.system(size: 29, weight: .light))
                    .frame(width: 44, height: 44)
            }
            .buttonStyle(.plain)
            .accessibilityLabel(language.text(zh: "打开菜单", en: "Open menu"))
        }
        .padding(.horizontal, 24)
        .frame(maxWidth: .infinity)
    }

    private var sceneIdentity: some View {
        VStack(spacing: 0) {
            Text(language.text(zh: appState.scene.zhName, en: appState.scene.enName))
                .font(
                    language == .zh
                        ? YixiuTheme.chineseDisplay(47)
                        : YixiuTheme.englishSerif(38)
                )
                .tracking(language == .zh ? 5 : 2)
                .textCase(language == .en ? .uppercase : nil)

            Text(language.secondary(zh: appState.scene.zhName, en: appState.scene.enName.uppercased()))
                .font(language == .zh ? YixiuTheme.englishSerif(13) : YixiuTheme.chineseDisplay(17))
                .tracking(language == .zh ? 5 : 3)
                .foregroundStyle(YixiuTheme.mist)
                .padding(.top, 10)

            HStack(spacing: 11) {
                Text(language.text(zh: "如水而行", en: "Be water, my friend."))
                Text("·")
                Text(language.secondary(zh: "如水而行", en: "BE WATER, MY FRIEND."))
                    .italic()
            }
            .font(YixiuTheme.englishSerif(11))
            .tracking(1.4)
            .foregroundStyle(YixiuTheme.mist)
            .padding(.top, 16)
        }
        .foregroundStyle(YixiuTheme.moon)
        .shadow(color: .black.opacity(0.62), radius: 14, y: 3)
    }

    private var transport: some View {
        HStack {
            Button {
                appState.toggleFavorite()
            } label: {
                Image(systemName: appState.favorites.contains(appState.scene) ? "heart.fill" : "heart")
                    .foregroundStyle(appState.favorites.contains(appState.scene) ? YixiuTheme.aquaStrong : YixiuTheme.moon)
            }
            .accessibilityLabel(language.text(zh: "收藏", en: "Favorite"))

            Spacer()

            Button { appState.moveScene(-1) } label: {
                Image(systemName: "backward.end")
            }
            .accessibilityLabel(language.text(zh: "上一种声音", en: "Previous sound"))

            Spacer()

            Button {
                appState.togglePlayback()
            } label: {
                Image(systemName: appState.isPlaying ? "pause.fill" : "play.fill")
                    .font(.system(size: 31, weight: .regular))
                    .frame(width: 82, height: 82)
                    .background(Circle().fill(YixiuTheme.deepWaterSoft.opacity(0.62)))
                    .overlay(Circle().stroke(YixiuTheme.aqua.opacity(0.84), lineWidth: 1))
                    .shadow(color: YixiuTheme.aqua.opacity(0.18), radius: 24)
            }
            .accessibilityLabel(appState.isPlaying ? language.text(zh: "暂停", en: "Pause") : language.text(zh: "播放", en: "Play"))

            Spacer()

            Button { appState.moveScene(1) } label: {
                Image(systemName: "forward.end")
            }
            .accessibilityLabel(language.text(zh: "下一种声音", en: "Next sound"))

            Spacer()

            Button {
                menuOpen = false
                withAnimation(.easeOut(duration: 0.18)) {
                    timerOpen.toggle()
                }
            } label: {
                Image(systemName: "timer")
            }
            .accessibilityLabel(language.text(zh: "定时", en: "Timer"))
        }
        .font(.system(size: 24, weight: .light))
        .foregroundStyle(YixiuTheme.moon)
        .padding(.horizontal, 28)
        .frame(maxWidth: .infinity)
    }

    private var volume: some View {
        HStack(spacing: 14) {
            Image(systemName: "speaker.fill")
            Slider(value: $appState.volume, in: 0 ... 1)
                .tint(YixiuTheme.aqua)
                .accessibilityLabel(language.text(zh: "音量", en: "Volume"))
            Image(systemName: "speaker.wave.3.fill")
        }
        .font(.system(size: 17, weight: .light))
        .padding(.horizontal, 32)
        .frame(maxWidth: .infinity)
    }

    private var durationButton: some View {
        Button {
            menuOpen = false
            withAnimation(.easeOut(duration: 0.18)) {
                timerOpen.toggle()
            }
        } label: {
            HStack(spacing: 7) {
                Text(appState.isPlaying ? appState.formattedRemaining : appState.durationLabel)
                Image(systemName: "chevron.down")
                    .font(.system(size: 12, weight: .medium))
            }
            .font(YixiuTheme.chineseDisplay(17))
            .tracking(1.2)
            .foregroundStyle(YixiuTheme.mist)
            .frame(minWidth: 150, minHeight: 44)
        }
        .buttonStyle(.plain)
    }

    private var menuPanel: some View {
        VStack(spacing: 8) {
            Button {
                menuOpen = false
                libraryOpen = true
            } label: {
                HStack(spacing: 12) {
                    Image(systemName: "water.waves")
                    Text(language.text(zh: "浏览全部声音", en: "Browse all sounds"))
                    Spacer()
                }
                .foregroundStyle(YixiuTheme.aquaStrong)
                .padding(.horizontal, 14)
                .frame(height: 48)
                .background(RoundedRectangle(cornerRadius: 14).fill(YixiuTheme.aqua.opacity(0.08)))
            }

            HStack {
                Text(language.text(zh: "界面语言", en: "Language"))
                    .font(.system(size: 14))
                Spacer()
                languageToggle
            }
            .padding(.horizontal, 14)
            .frame(height: 48)
            .overlay(alignment: .top) {
                YixiuTheme.hairline.frame(height: 0.6)
            }
        }
        .padding(12)
        .yixiuPanel()
    }

    private var languageToggle: some View {
        HStack(spacing: 4) {
            languageButton(.zh, title: "中文")
            languageButton(.en, title: "EN")
        }
    }

    private func languageButton(_ option: AppLanguage, title: String) -> some View {
        Button {
            appState.language = option
        } label: {
            Text(title)
                .font(.system(size: 12, weight: .medium))
                .foregroundStyle(appState.language == option ? YixiuTheme.deepWater : YixiuTheme.mist)
                .frame(width: 54, height: 34)
                .background(Capsule().fill(appState.language == option ? YixiuTheme.aquaStrong : .clear))
        }
        .buttonStyle(.plain)
    }

    private var timerPanel: some View {
        HStack(spacing: 7) {
            ForEach([15, 30, 60, 0], id: \.self) { minutes in
                Button {
                    appState.selectDuration(minutes)
                    timerOpen = false
                } label: {
                    VStack(spacing: 3) {
                        Text(minutes == 0 ? "∞" : "\(minutes)")
                            .font(.system(size: 17, weight: .medium))
                        Text(minutes == 0 ? language.text(zh: "不限时", en: "UNLIMITED") : language.text(zh: "分钟", en: "MIN"))
                            .font(.system(size: 7))
                            .tracking(0.5)
                    }
                    .foregroundStyle(appState.duration == minutes ? YixiuTheme.deepWater : YixiuTheme.mist)
                    .frame(maxWidth: .infinity)
                    .frame(height: 58)
                    .background(
                        RoundedRectangle(cornerRadius: 13)
                            .fill(appState.duration == minutes ? YixiuTheme.aquaStrong : .clear)
                    )
                }
                .buttonStyle(.plain)
            }
        }
        .padding(11)
        .yixiuPanel()
    }

    private var completionPanel: some View {
        VStack(spacing: 20) {
            Text(language.text(zh: "水之箴言", en: "WATER WISDOM"))
                .yixiuSecondary(9)
            Text(language.text(
                zh: "水不争先，却从未停止。",
                en: "Water does not hurry, yet it keeps moving."
            ))
            .font(YixiuTheme.chineseDisplay(22))
            .multilineTextAlignment(.center)
            .lineSpacing(6)
            Button {
                appState.resetCompletedSession()
            } label: {
                Text(language.text(zh: "收下", en: "Keep it"))
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(YixiuTheme.deepWater)
                    .frame(width: 150, height: 44)
                    .background(Capsule().fill(YixiuTheme.aquaStrong))
            }
        }
        .padding(28)
        .yixiuPanel()
    }
}

private struct SoundLibraryView: View {
    @EnvironmentObject private var appState: AppState
    @Environment(\.dismiss) private var dismiss

    private var language: AppLanguage { appState.language }

    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 11) {
                    ForEach(MeditationScene.allCases) { scene in
                        sceneCard(scene)
                    }
                }
                .padding(18)
            }
            .background(YixiuTheme.deepWater)
            .navigationTitle(language.text(zh: "声音库", en: "Sound Library"))
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbarBackground(YixiuTheme.deepWater, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button(language.text(zh: "完成", en: "Done")) { dismiss() }
                }
            }
        }
    }

    private func sceneCard(_ scene: MeditationScene) -> some View {
        ZStack(alignment: .bottomLeading) {
            Image(scene.assetName)
                .resizable()
                .scaledToFill()
                .frame(height: 190)
                .clipped()

            LinearGradient(
                colors: [.clear, YixiuTheme.deepWater.opacity(0.92)],
                startPoint: .center,
                endPoint: .bottom
            )

            Button {
                appState.selectScene(scene)
                dismiss()
            } label: {
                VStack(alignment: .leading, spacing: 3) {
                    Text(language.text(zh: scene.zhName, en: scene.enName))
                        .font(YixiuTheme.chineseDisplay(17))
                    Text(language.secondary(zh: scene.zhName, en: scene.enName.uppercased()))
                        .font(YixiuTheme.englishSerif(8))
                        .tracking(1)
                    Text(language.text(zh: scene.useZh, en: scene.useEn))
                        .font(.system(size: 9))
                        .foregroundStyle(YixiuTheme.aqua)
                        .padding(.top, 6)
                }
                .foregroundStyle(YixiuTheme.moon)
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomLeading)
                .padding(13)
            }

            Button {
                appState.toggleFavorite(scene)
            } label: {
                Image(systemName: appState.favorites.contains(scene) ? "heart.fill" : "heart")
                    .foregroundStyle(appState.favorites.contains(scene) ? YixiuTheme.aquaStrong : YixiuTheme.moon)
                    .frame(width: 36, height: 36)
                    .background(Circle().fill(YixiuTheme.deepWater.opacity(0.62)))
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topTrailing)
            .padding(8)
        }
        .frame(height: 190)
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .stroke(appState.scene == scene ? YixiuTheme.aqua : YixiuTheme.hairline, lineWidth: 0.8)
        )
    }
}
