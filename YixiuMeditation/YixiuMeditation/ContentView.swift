import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var appState: AppState

    var body: some View {
        GeometryReader { rootGeometry in
            ZStack {
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
                .ignoresSafeArea()

                TabBarOverlay(bottomInset: rootGeometry.safeAreaInsets.bottom)
            }
            .frame(width: rootGeometry.size.width, height: rootGeometry.size.height)
        }
        .background(YixiuTheme.deepWater)
        .preferredColorScheme(.dark)
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
                    withAnimation(.easeOut(duration: 0.18)) {
                        appState.activeTab = tab
                    }
                } label: {
                    VStack(spacing: 3) {
                        Image(systemName: tab.icon)
                            .font(.system(size: 19, weight: .light))
                            .frame(width: 28, height: 22)
                        Text(appState.language.text(zh: tab.zhName, en: tab.enName.capitalized))
                            .font(YixiuTheme.chineseDisplay(13))
                            .frame(height: 16)
                        Text(appState.language.secondary(zh: tab.zhName, en: tab.enName))
                            .font(YixiuTheme.englishSerif(8, weight: .semibold))
                            .tracking(1)
                            .frame(height: 10)
                    }
                    .foregroundStyle(appState.activeTab == tab ? YixiuTheme.aquaStrong : YixiuTheme.mist.opacity(0.72))
                    .frame(maxWidth: .infinity)
                    .frame(height: 58)
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
