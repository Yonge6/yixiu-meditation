import SwiftUI

@main
struct YixiuMeditationApp: App {
    @StateObject private var appState = AppState()
    @StateObject private var subscriptionStore = SubscriptionStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .environmentObject(subscriptionStore)
                .preferredColorScheme(.dark)
                .task {
                    appState.enforceAccessLevel(subscriptionStore.accessLevel)
                    await subscriptionStore.start()
                    appState.enforceAccessLevel(subscriptionStore.accessLevel)
                }
                .onChange(of: subscriptionStore.accessLevel) { _, level in
                    guard subscriptionStore.isReady else { return }
                    appState.enforceAccessLevel(level)
                }
        }
    }
}
