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
            .padding(.bottom, 86)

            BottomNavigation()
        }
        .background(YixiuTheme.ivory)
        .ignoresSafeArea(edges: .bottom)
    }
}

private struct BottomNavigation: View {
    @EnvironmentObject private var appState: AppState

    var body: some View {
        HStack(spacing: 0) {
            ForEach(RootTab.allCases) { tab in
                Button {
                    appState.activeTab = tab
                } label: {
                    VStack(spacing: 2) {
                        Image(systemName: tab.icon)
                            .font(.system(size: 21, weight: .light))
                            .frame(height: 25)
                        Text(appState.language.text(zh: tab.zhName, en: tab.enName.capitalized))
                            .font(YixiuTheme.chineseDisplay(13, weight: .semibold))
                        Text(appState.language.secondary(zh: tab.zhName, en: tab.enName))
                            .font(YixiuTheme.englishSerif(7))
                            .tracking(1)
                            .foregroundStyle(YixiuTheme.gold)
                    }
                    .frame(maxWidth: .infinity)
                    .foregroundStyle(
                        appState.activeTab == tab
                            ? YixiuTheme.ink
                            : YixiuTheme.ink.opacity(0.4)
                    )
                }
                .buttonStyle(.plain)
                .accessibilityLabel("\(tab.zhName) \(tab.enName)")
            }
        }
        .padding(.top, 10)
        .padding(.horizontal, 24)
        .padding(.bottom, 21)
        .frame(height: 94)
        .background(
            UnevenRoundedRectangle(
                topLeadingRadius: 48,
                bottomLeadingRadius: 0,
                bottomTrailingRadius: 0,
                topTrailingRadius: 48
            )
            .fill(YixiuTheme.ivory.opacity(0.98))
            .overlay(alignment: .top) {
                YixiuTheme.hairline.frame(height: 0.7)
            }
            .shadow(color: YixiuTheme.ink.opacity(0.08), radius: 18, y: -8)
        )
    }
}
