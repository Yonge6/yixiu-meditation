import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var appState: AppState

    var body: some View {
        ZStack(alignment: .bottom) {
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

            BottomNavigation()
        }
        .background(YixiuTheme.deepWater)
        .preferredColorScheme(.dark)
        .ignoresSafeArea(edges: .bottom)
    }
}

private struct BottomNavigation: View {
    @EnvironmentObject private var appState: AppState

    var body: some View {
        HStack(spacing: 0) {
            ForEach(RootTab.allCases) { tab in
                Button {
                    if tab != .listen {
                        appState.pause()
                    }
                    appState.activeTab = tab
                } label: {
                    VStack(spacing: 3) {
                        Image(systemName: tab.icon)
                            .font(.system(size: 22, weight: .light))
                            .frame(height: 25)
                        Text(appState.language.text(zh: tab.zhName, en: tab.enName.capitalized))
                            .font(YixiuTheme.chineseDisplay(12, weight: .medium))
                        Text(appState.language.secondary(zh: tab.zhName, en: tab.enName))
                            .font(YixiuTheme.englishSerif(7))
                            .tracking(1)
                    }
                    .frame(maxWidth: .infinity)
                    .foregroundStyle(
                        appState.activeTab == tab
                            ? YixiuTheme.moon
                            : YixiuTheme.mist.opacity(0.48)
                    )
                    .overlay(alignment: .bottom) {
                        if appState.activeTab == tab {
                            Capsule()
                                .fill(YixiuTheme.aquaStrong)
                                .frame(width: 34, height: 2)
                                .offset(y: 8)
                        }
                    }
                }
                .buttonStyle(.plain)
                .accessibilityLabel("\(tab.zhName) \(tab.enName)")
            }
        }
        .padding(.horizontal, 18)
        .padding(.top, 8)
        .padding(.bottom, 22)
        .frame(height: 88)
        .background(
            LinearGradient(
                colors: [YixiuTheme.deepWater.opacity(0.12), YixiuTheme.deepWater.opacity(0.97)],
                startPoint: .top,
                endPoint: .bottom
            )
        )
    }
}
