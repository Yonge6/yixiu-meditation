import SwiftUI

struct ListenView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var subscriptionStore: SubscriptionStore
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var timerOpen = false
    @State private var libraryOpen = false
    @State private var paywallOpen = false
    @State private var sharePayload: SceneSharePayload?
    @State private var shareRenderingFailed = false
    @State private var sceneDragOffset: CGFloat = 0
    @State private var sceneSwipeProgress: CGFloat = 0
    @State private var sceneSwipeSettling = false

    private var language: AppLanguage { appState.language }

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                background
                    .frame(width: geometry.size.width, height: geometry.size.height)
                    .clipped()
                    .allowsHitTesting(false)

                Color.clear
                    .contentShape(Rectangle())
                    .gesture(sceneSwipeGesture(width: geometry.size.width))
                    .accessibilityHidden(true)

                header
                    .frame(width: min(geometry.size.width, 720))
                    .position(
                        x: geometry.size.width / 2,
                        y: max(geometry.safeAreaInsets.top + 30, 84)
                    )

                sceneIdentity
                    .position(x: geometry.size.width / 2, y: geometry.size.height * 0.53)
                    .offset(x: sceneDragOffset * 0.12)
                    .opacity(1 - sceneSwipeProgress * 0.55)
                    .allowsHitTesting(false)

                if timerOpen {
                    timerPanel
                        .frame(maxWidth: 520)
                        .padding(.horizontal, 18)
                        .position(x: geometry.size.width / 2, y: geometry.size.height * 0.615)
                        .transition(.scale(scale: 0.96).combined(with: .opacity))
                } else {
                    durationButton
                        .position(x: geometry.size.width / 2, y: geometry.size.height * 0.64)
                }

                transport
                    .position(x: geometry.size.width / 2, y: geometry.size.height * 0.73)

                volume
                    .position(x: geometry.size.width / 2, y: geometry.size.height * 0.84)

                Text(language.text(zh: "上滑浏览全部声音", en: "SWIPE UP FOR ALL SOUNDS"))
                    .font(YixiuTheme.sans(9, weight: .medium))
                    .tracking(1.2)
                    .foregroundStyle(YixiuTheme.mist.opacity(0.62))
                    .position(x: geometry.size.width / 2, y: geometry.size.height - 108)
                    .allowsHitTesting(false)

                if let audioError = appState.audioError {
                    Text(audioError)
                        .font(YixiuTheme.sans(12))
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
        .sheet(isPresented: $paywallOpen) {
            PlusPaywallView()
                .presentationDetents([.large])
                .presentationDragIndicator(.visible)
                .presentationBackground(YixiuTheme.deepWater)
        }
        .sheet(item: $sharePayload) { payload in
            ActivityShareSheet(items: [payload.image, payload.url])
                .presentationDetents([.large])
                .presentationDragIndicator(.visible)
        }
        .alert(
            language.text(zh: "暂时无法生成分享图", en: "Could not create the share card"),
            isPresented: $shareRenderingFailed
        ) {
            Button(language.text(zh: "好", en: "OK"), role: .cancel) {}
        } message: {
            Text(language.text(zh: "请稍后再试。", en: "Please try again in a moment."))
        }
    }

    private var background: some View {
        TimelineView(.animation(minimumInterval: 1 / 30, paused: !backgroundMotionEnabled)) { context in
            let phase = context.date.timeIntervalSinceReferenceDate
            let driftX = backgroundMotionEnabled ? CGFloat(sin(phase * 0.25)) * 4 : 0
            let driftY = backgroundMotionEnabled ? CGFloat(cos(phase * 0.20)) * 3 : 0
            let breathingScale = backgroundMotionEnabled
                ? 1.05 + CGFloat(sin(phase * 0.18)) * 0.015
                : 1

            ZStack {
                if abs(sceneDragOffset) > 0.5, let preview = sceneSwipePreview {
                    Image(preview.assetName)
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
                    .offset(x: sceneDragOffset * 0.16 + driftX, y: driftY)
                    .scaleEffect((1 - sceneSwipeProgress * 0.025) * breathingScale)
                    .opacity(1 - sceneSwipeProgress * 0.90)
                    .ignoresSafeArea()

                if backgroundMotionEnabled {
                    RadialGradient(
                        colors: [YixiuTheme.moon.opacity(0.12), .clear],
                        center: .center,
                        startRadius: 18,
                        endRadius: 210
                    )
                    .scaleEffect(1.08 + CGFloat(sin(phase * 0.16)) * 0.04)
                    .offset(x: CGFloat(sin(phase * 0.11)) * 22, y: CGFloat(cos(phase * 0.13)) * 14)
                    .blendMode(.softLight)
                    .allowsHitTesting(false)
                }

                Color(red: 0, green: 17 / 255, blue: 25 / 255)
                    .opacity(appState.scene.isBright ? 0.035 : (appState.scene.isNight ? 0.09 : 0.055))

                LinearGradient(
                    colors: [
                        .clear,
                        YixiuTheme.deepWater.opacity(appState.scene.isBright ? 0.07 : (appState.scene.isNight ? 0.16 : 0.11)),
                        YixiuTheme.deepWater.opacity(appState.scene.isBright ? 0.56 : (appState.scene.isNight ? 0.76 : 0.64))
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .ignoresSafeArea()
            }
        }
    }

    private var backgroundMotionEnabled: Bool {
        appState.isPlaying
            && !reduceMotion
            && abs(sceneDragOffset) < 0.5
            && !sceneSwipeSettling
    }

    private var sceneSwipePreview: MeditationScene? {
        guard let index = MeditationScene.allCases.firstIndex(of: appState.scene) else { return nil }
        let direction = sceneDragOffset < 0 ? 1 : -1
        let previewIndex = index + direction
        guard MeditationScene.allCases.indices.contains(previewIndex) else { return nil }
        return MeditationScene.allCases[previewIndex]
    }

    private func sceneSwipeGesture(width: CGFloat) -> some Gesture {
        DragGesture(minimumDistance: 8)
            .onChanged { value in
                guard !sceneSwipeSettling else { return }
                let horizontal = value.translation.width
                let vertical = value.translation.height
                guard abs(horizontal) > abs(vertical) * 1.15 else { return }
                let direction = horizontal < 0 ? 1 : -1
                guard appState.canMoveScene(direction) else {
                    sceneDragOffset = max(-18, min(18, horizontal * 0.09))
                    sceneSwipeProgress = 0
                    return
                }
                let limit = max(width * 0.48, 1)
                sceneDragOffset = max(-limit, min(limit, horizontal))
                sceneSwipeProgress = min(abs(sceneDragOffset) / max(width * 0.42, 1), 1)
            }
            .onEnded { value in
                let horizontal = value.translation.width
                let vertical = value.translation.height

                if vertical <= -64, abs(vertical) > abs(horizontal) * 1.2 {
                    sceneDragOffset = 0
                    sceneSwipeProgress = 0
                    libraryOpen = true
                    return
                }

                let direction = horizontal < 0 ? 1 : -1
                guard
                    appState.canMoveScene(direction),
                    abs(horizontal) >= 48,
                    abs(horizontal) > abs(vertical) * 1.2
                else {
                    withAnimation(.spring(response: 0.34, dampingFraction: 0.82)) {
                        sceneDragOffset = 0
                        sceneSwipeProgress = 0
                    }
                    return
                }

                guard let target = scene(in: direction), subscriptionStore.canAccess(target) else {
                    withAnimation(.spring(response: 0.34, dampingFraction: 0.82)) {
                        sceneDragOffset = 0
                        sceneSwipeProgress = 0
                    }
                    paywallOpen = true
                    return
                }

                sceneSwipeSettling = true
                withAnimation(.timingCurve(0.22, 1, 0.36, 1, duration: 0.26)) {
                    sceneDragOffset = direction == 1 ? -width * 0.72 : width * 0.72
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

    private func scene(in direction: Int) -> MeditationScene? {
        guard let currentIndex = MeditationScene.allCases.firstIndex(of: appState.scene) else { return nil }
        let targetIndex = currentIndex + direction
        guard MeditationScene.allCases.indices.contains(targetIndex) else { return nil }
        return MeditationScene.allCases[targetIndex]
    }

    private func moveScene(_ direction: Int) {
        guard let target = scene(in: direction) else { return }
        guard subscriptionStore.canAccess(target) else {
            paywallOpen = true
            return
        }
        appState.moveScene(direction)
    }

    private var header: some View {
        HStack {
            HStack(alignment: .firstTextBaseline, spacing: 11) {
                Text(language == .zh ? "一休" : "YIXIU")
                    .font(language == .zh ? YixiuTheme.chineseDisplay(25) : YixiuTheme.englishSerif(25))
                    .tracking(2)
                Text(language == .zh ? "YIXIU" : "一休")
                    .font(YixiuTheme.sans(11, weight: .regular))
                    .tracking(4)
            }
            .foregroundStyle(YixiuTheme.moon)
            .accessibilityElement(children: .combine)

            Spacer()

            HStack(spacing: 8) {
                Button {
                    appState.language = language == .zh ? .en : .zh
                } label: {
                    Text(language == .en ? "中" : "EN")
                        .font(language == .en ? YixiuTheme.chineseDisplay(15, weight: .medium) : YixiuTheme.sans(10, weight: .semibold))
                        .tracking(language == .en ? 0 : 0.8)
                        .foregroundStyle(YixiuTheme.moon)
                        .frame(width: 44, height: 44)
                        .background(Circle().fill(YixiuTheme.deepWater.opacity(0.48)))
                        .overlay(
                            Circle()
                                .stroke(
                                    LinearGradient(
                                        colors: [YixiuTheme.moon.opacity(0.46), YixiuTheme.aqua.opacity(0.24)],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    ),
                                    lineWidth: 0.8
                                )
                        )
                }
                .buttonStyle(.plain)
                .accessibilityLabel(language.text(zh: "切换到英文", en: "Switch to Chinese"))

                Button {
                    guard let image = SceneShareCardRenderer.render(scene: appState.scene, language: language) else {
                        shareRenderingFailed = true
                        return
                    }
                    sharePayload = SceneSharePayload(
                        image: image,
                        url: appState.scene.shareURL(language: language)
                    )
                } label: {
                    Image(systemName: "square.and.arrow.up")
                        .font(.system(size: 17, weight: .regular))
                        .foregroundStyle(YixiuTheme.moon)
                        .frame(width: 44, height: 44)
                        .background(Circle().fill(YixiuTheme.deepWater.opacity(0.48)))
                        .overlay(Circle().stroke(YixiuTheme.hairline, lineWidth: 0.8))
                }
                .buttonStyle(.plain)
                .accessibilityLabel(language.text(
                    zh: "分享\(appState.scene.zhName)",
                    en: "Share \(appState.scene.enName)"
                ))
            }
        }
        .padding(.horizontal, 24)
        .frame(maxWidth: .infinity)
    }

    private var sceneIdentity: some View {
        VStack(spacing: 0) {
            Text(language.text(zh: appState.scene.zhName, en: appState.scene.enName))
                .font(
                    language == .zh
                        ? YixiuTheme.chineseDisplay(appState.scene.zhName.count > 4 ? 39 : 47)
                        : YixiuTheme.englishSerif(appState.scene.enName.count > 13 ? 31 : 38)
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
                    .frame(width: 44, height: 44)
                    .background(Circle().fill(YixiuTheme.deepWaterSoft.opacity(0.34)))
                    .overlay(Circle().stroke(YixiuTheme.hairline, lineWidth: 0.8))
            }
            .accessibilityLabel(language.text(zh: "收藏", en: "Favorite"))

            Spacer()

            Button { moveScene(-1) } label: {
                Image(systemName: "backward.end")
                    .frame(width: 44, height: 44)
                    .background(Circle().fill(YixiuTheme.deepWaterSoft.opacity(0.34)))
                    .overlay(Circle().stroke(YixiuTheme.hairline, lineWidth: 0.8))
            }
            .disabled(!appState.canMoveScene(-1))
            .opacity(appState.canMoveScene(-1) ? 1 : 0.28)
            .accessibilityLabel(language.text(zh: "上一种声音", en: "Previous sound"))

            Spacer()

            Button {
                appState.togglePlayback()
            } label: {
                Image(systemName: appState.isPlaying ? "pause.fill" : "play.fill")
                    .font(.system(size: 29, weight: .medium))
                    .frame(width: 82, height: 82)
                    .background(Circle().fill(YixiuTheme.deepWaterSoft.opacity(0.62)))
                    .overlay(Circle().stroke(YixiuTheme.aqua.opacity(0.84), lineWidth: 1))
                    .overlay(Circle().inset(by: 6).stroke(YixiuTheme.aquaStrong.opacity(0.1), lineWidth: 1))
                    .shadow(color: YixiuTheme.aqua.opacity(0.18), radius: 24)
            }
            .accessibilityLabel(appState.isPlaying ? language.text(zh: "暂停", en: "Pause") : language.text(zh: "播放", en: "Play"))

            Spacer()

            Button { moveScene(1) } label: {
                Image(systemName: "forward.end")
                    .frame(width: 44, height: 44)
                    .background(Circle().fill(YixiuTheme.deepWaterSoft.opacity(0.34)))
                    .overlay(Circle().stroke(YixiuTheme.hairline, lineWidth: 0.8))
            }
            .disabled(!appState.canMoveScene(1))
            .opacity(appState.canMoveScene(1) ? 1 : 0.28)
            .accessibilityLabel(language.text(zh: "下一种声音", en: "Next sound"))

            Spacer()

            Button {
                withAnimation(.easeOut(duration: 0.18)) {
                    timerOpen.toggle()
                }
            } label: {
                Image(systemName: "timer")
                    .frame(width: 44, height: 44)
                    .background(Circle().fill(YixiuTheme.deepWaterSoft.opacity(0.34)))
                    .overlay(Circle().stroke(YixiuTheme.hairline, lineWidth: 0.8))
            }
            .accessibilityLabel(language.text(zh: "定时", en: "Timer"))
        }
        .font(.system(size: 20, weight: .light))
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
            withAnimation(.easeOut(duration: 0.18)) {
                timerOpen.toggle()
            }
        } label: {
            Text(appState.isPlaying ? appState.formattedRemaining : appState.durationLabel)
            .font(YixiuTheme.chineseDisplay(17))
            .tracking(1.2)
            .foregroundStyle(YixiuTheme.mist)
            .frame(minWidth: 150, minHeight: 44)
        }
        .buttonStyle(.plain)
    }

    private var timerPanel: some View {
        HStack(spacing: 7) {
            ForEach([15, 30, 60, 0], id: \.self) { minutes in
                Button {
                    guard subscriptionStore.canUseTimer(minutes) else {
                        timerOpen = false
                        paywallOpen = true
                        return
                    }
                    appState.selectDuration(minutes)
                    timerOpen = false
                } label: {
                    VStack(spacing: 3) {
                        Text(minutes == 0 ? "∞" : "\(minutes)")
                            .font(YixiuTheme.sans(17, weight: .medium))
                        Text(minutes == 0 ? language.text(zh: "不限时", en: "UNLIMITED") : language.text(zh: "分钟", en: "MIN"))
                            .font(YixiuTheme.sans(7))
                            .tracking(0.5)
                    }
                    .foregroundStyle(appState.duration == minutes ? YixiuTheme.deepWater : YixiuTheme.mist)
                    .frame(maxWidth: .infinity)
                    .frame(height: 58)
                    .background(
                        RoundedRectangle(cornerRadius: 13)
                            .fill(appState.duration == minutes ? YixiuTheme.aquaStrong : .clear)
                    )
                    .overlay(alignment: .topTrailing) {
                        if !subscriptionStore.canUseTimer(minutes) {
                            Image(systemName: "lock.fill")
                                .font(.system(size: 7, weight: .semibold))
                                .foregroundStyle(YixiuTheme.aqua)
                                .padding(7)
                        }
                    }
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
                    .font(YixiuTheme.sans(14, weight: .semibold))
                    .foregroundStyle(YixiuTheme.deepWater)
                    .frame(width: 150, height: 44)
                    .background(Capsule().fill(YixiuTheme.aquaStrong))
            }
        }
        .padding(28)
        .yixiuPanel()
    }
}

struct SoundLibraryView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var subscriptionStore: SubscriptionStore
    @Environment(\.dismiss) private var dismiss
    @State private var selectedCategory: SceneCategory = .all
    @State private var paywallOpen = false

    private var language: AppLanguage { appState.language }
    private var filteredScenes: [MeditationScene] {
        MeditationScene.allCases.filter { $0.matches(selectedCategory) }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 14) {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 7) {
                            ForEach(SceneCategory.allCases) { category in
                                Button {
                                    selectedCategory = category
                                } label: {
                                    Text(category.title(language: language))
                                        .font(.system(size: 11, weight: .medium))
                                        .foregroundStyle(selectedCategory == category ? YixiuTheme.deepWater : YixiuTheme.mist)
                                        .padding(.horizontal, 15)
                                        .frame(height: 34)
                                        .background(
                                            Capsule().fill(selectedCategory == category ? YixiuTheme.aquaStrong : YixiuTheme.deepWaterSoft.opacity(0.56))
                                        )
                                        .overlay(
                                            Capsule().stroke(selectedCategory == category ? .clear : YixiuTheme.hairline, lineWidth: 0.8)
                                        )
                                }
                                .buttonStyle(.plain)
                                .accessibilityAddTraits(selectedCategory == category ? .isSelected : [])
                            }
                        }
                        .padding(.horizontal, 1)
                    }

                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 11) {
                        ForEach(filteredScenes) { scene in
                            sceneCard(scene)
                        }
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
        .sheet(isPresented: $paywallOpen) {
            PlusPaywallView()
                .presentationDetents([.large])
                .presentationDragIndicator(.visible)
                .presentationBackground(YixiuTheme.deepWater)
        }
    }

    private func sceneCard(_ scene: MeditationScene) -> some View {
        ZStack(alignment: .topTrailing) {
            Button {
                guard subscriptionStore.canAccess(scene) else {
                    paywallOpen = true
                    return
                }
                appState.selectScene(scene)
                dismiss()
            } label: {
                GeometryReader { geometry in
                    ZStack(alignment: .bottomLeading) {
                        Image(scene.assetName)
                            .resizable()
                            .scaledToFill()
                            .frame(width: geometry.size.width, height: geometry.size.height)
                            .clipped()

                        LinearGradient(
                            colors: [.clear, YixiuTheme.deepWater.opacity(0.92)],
                            startPoint: .center,
                            endPoint: .bottom
                        )

                        VStack(alignment: .leading, spacing: 3) {
                            Text(language.text(zh: scene.zhName, en: scene.enName))
                                .font(YixiuTheme.chineseDisplay(17))
                            Text(language.secondary(zh: scene.zhName, en: scene.enName.uppercased()))
                                .font(YixiuTheme.englishSerif(8))
                                .tracking(1)
                            Text(language.text(zh: scene.useZh, en: scene.useEn))
                                .font(YixiuTheme.sans(9))
                                .foregroundStyle(YixiuTheme.aqua)
                                .padding(.top, 6)
                        }
                        .foregroundStyle(YixiuTheme.moon)
                        .padding(13)
                    }
                    .contentShape(Rectangle())
                }
            }
            .buttonStyle(.plain)
            .accessibilityLabel(language.text(
                zh: subscriptionStore.canAccess(scene) ? "切换到\(scene.zhName)" : "\(scene.zhName)，一休 Plus",
                en: subscriptionStore.canAccess(scene) ? "Switch to \(scene.enName)" : "\(scene.enName), Yixiu Plus"
            ))

            Button {
                appState.toggleFavorite(scene)
            } label: {
                Image(systemName: appState.favorites.contains(scene) ? "heart.fill" : "heart")
                    .foregroundStyle(appState.favorites.contains(scene) ? YixiuTheme.aquaStrong : YixiuTheme.moon)
                    .frame(width: 36, height: 36)
                    .background(Circle().fill(YixiuTheme.deepWater.opacity(0.62)))
            }
            .buttonStyle(.plain)
            .padding(8)
            .accessibilityLabel(language.text(
                zh: "收藏\(scene.zhName)",
                en: "Favorite \(scene.enName)"
            ))
        }
        .frame(height: 190)
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .stroke(appState.scene == scene ? YixiuTheme.aqua : YixiuTheme.hairline, lineWidth: 0.8)
        )
        .overlay(alignment: .topLeading) {
            if SubscriptionAccessPolicy.freeScenes.contains(scene) {
                Text("FREE")
                    .font(YixiuTheme.sans(8, weight: .semibold))
                    .tracking(0.8)
                    .foregroundStyle(YixiuTheme.deepWater)
                    .padding(.horizontal, 9)
                    .frame(height: 26)
                    .background(Capsule().fill(YixiuTheme.aquaStrong))
                    .padding(9)
            } else {
                PremiumGemBadge()
                    .padding(9)
                    .accessibilityHidden(true)
            }
        }
    }
}

private struct PremiumGemBadge: View {
    var body: some View {
        ZStack {
            CutCornerMedallion()
                .fill(
                    LinearGradient(
                        colors: [
                            YixiuTheme.moon.opacity(0.16),
                            YixiuTheme.deepWaterSoft.opacity(0.94),
                            YixiuTheme.deepWater.opacity(0.98)
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )

            CutCornerMedallion()
                .stroke(
                    LinearGradient(
                        colors: [
                            YixiuTheme.moon.opacity(0.78),
                            YixiuTheme.aquaStrong.opacity(0.46),
                            YixiuTheme.mist.opacity(0.18)
                        ],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ),
                    lineWidth: 0.8
                )

            FacetedGemShape()
                .stroke(
                    LinearGradient(
                        colors: [YixiuTheme.moon, YixiuTheme.aquaStrong, YixiuTheme.mist],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ),
                    style: StrokeStyle(lineWidth: 1.05, lineCap: .round, lineJoin: .round)
                )
                .frame(width: 16, height: 14)
        }
        .frame(width: 30, height: 30)
        .shadow(color: .black.opacity(0.34), radius: 5, y: 2)
        .shadow(color: YixiuTheme.aqua.opacity(0.16), radius: 7)
        .drawingGroup()
    }
}

private struct CutCornerMedallion: Shape {
    func path(in rect: CGRect) -> Path {
        let cut = min(rect.width, rect.height) * 0.20
        var path = Path()
        path.move(to: CGPoint(x: rect.minX + cut, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX - cut, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY + cut))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY - cut))
        path.addLine(to: CGPoint(x: rect.maxX - cut, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX + cut, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY - cut))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.minY + cut))
        path.closeSubpath()
        return path
    }
}

private struct FacetedGemShape: Shape {
    func path(in rect: CGRect) -> Path {
        let left = CGPoint(x: rect.minX + 0.8, y: rect.minY + rect.height * 0.34)
        let topLeft = CGPoint(x: rect.minX + rect.width * 0.26, y: rect.minY + 0.8)
        let topRight = CGPoint(x: rect.maxX - rect.width * 0.26, y: rect.minY + 0.8)
        let right = CGPoint(x: rect.maxX - 0.8, y: rect.minY + rect.height * 0.34)
        let crown = CGPoint(x: rect.midX, y: rect.minY + rect.height * 0.34)
        let tip = CGPoint(x: rect.midX, y: rect.maxY - 0.8)

        var path = Path()
        path.move(to: left)
        path.addLine(to: topLeft)
        path.addLine(to: topRight)
        path.addLine(to: right)
        path.addLine(to: tip)
        path.closeSubpath()

        path.move(to: left)
        path.addLine(to: right)
        path.move(to: topLeft)
        path.addLine(to: crown)
        path.addLine(to: topRight)
        path.move(to: crown)
        path.addLine(to: tip)
        return path
    }
}
