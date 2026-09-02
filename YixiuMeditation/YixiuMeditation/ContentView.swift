import StoreKit
import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var appState: AppState
    @Environment(\.requestReview) private var requestReview

    var body: some View {
        TabView(selection: $appState.activeTab) {
            ListenView()
                .ignoresSafeArea()
                .tag(RootTab.listen)
                .tabItem { tabLabel(for: .listen) }

            FocusView()
                .ignoresSafeArea()
                .tag(RootTab.focus)
                .tabItem { tabLabel(for: .focus) }

            MeView()
                .ignoresSafeArea()
                .tag(RootTab.me)
                .tabItem { tabLabel(for: .me) }
        }
        .tint(YixiuTheme.aquaStrong)
        .background(YixiuTheme.deepWater)
        .preferredColorScheme(.dark)
        .onChange(of: appState.reviewRequestToken) { _, token in
            guard token > 0 else { return }
            requestReview()
            appState.markReviewRequestHandled()
        }
    }

    private func tabLabel(for tab: RootTab) -> some View {
        Label(
            appState.language.text(zh: tab.zhName, en: tab.enName.capitalized),
            systemImage: tab.icon
        )
    }
}
