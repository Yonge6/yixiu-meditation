import SwiftUI

@main
struct YixiuMeditationApp: App {
    @StateObject private var appState = AppState()
    @StateObject private var subscriptionStore = SubscriptionStore()
    @StateObject private var dailyReminder = DailyReminderManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .environmentObject(subscriptionStore)
                .environmentObject(dailyReminder)
                .preferredColorScheme(.dark)
                .task {
#if DEBUG
                    if ProcessInfo.processInfo.arguments.contains("-yixiuStartQuietMinute") {
                        try? await QuietMinuteActivityManager.start()
                    }
#endif
                    appState.enforceAccessLevel(subscriptionStore.accessLevel)
                    await subscriptionStore.start()
                    appState.enforceAccessLevel(subscriptionStore.accessLevel)
                    await dailyReminder.refresh(languageCode: appState.language.rawValue)
                }
                .onChange(of: subscriptionStore.accessLevel) { _, level in
                    guard subscriptionStore.isReady else { return }
                    appState.enforceAccessLevel(level)
                }
                .onChange(of: appState.language) { _, language in
                    Task { await dailyReminder.rescheduleForLanguage(language.rawValue) }
                }
        }
    }
}
