import SwiftUI
import UserNotifications

@MainActor
final class PracticeRoute: ObservableObject {
    static let shared = PracticeRoute()
    @Published var pendingFocus = false
}

final class YixiuAppDelegate: NSObject, UIApplicationDelegate, UNUserNotificationCenterDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        UNUserNotificationCenter.current().delegate = self
        return true
    }

    func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse,
                                withCompletionHandler completionHandler: @escaping () -> Void) {
        if response.actionIdentifier == UNNotificationDefaultActionIdentifier,
           response.notification.request.identifier.hasPrefix(DailyReminderSchedule.identifier) {
            Task { @MainActor in PracticeRoute.shared.pendingFocus = true }
        }
        completionHandler()
    }
}

@main
struct YixiuMeditationApp: App {
    @UIApplicationDelegateAdaptor(YixiuAppDelegate.self) private var delegate
    @ObservedObject private var route = PracticeRoute.shared
    @Environment(\.scenePhase) private var scenePhase
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
                    consumeReminderRoute()
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
                .onChange(of: scenePhase) { _, phase in
                    if phase == .active {
                        appState.reconcilePlayback()
                        Task { await dailyReminder.refresh(languageCode: appState.language.rawValue) }
                    }
                }
                .onChange(of: route.pendingFocus) { _, _ in consumeReminderRoute() }
                .onOpenURL { url in
                    guard url.scheme == "yixiu" else { return }
                    if url.host == "focus" { appState.prepareFocus() }
                    if url.host == "resume" { appState.activeTab = .listen }
                }
        }
    }

    private func consumeReminderRoute() {
        guard route.pendingFocus else { return }
        route.pendingFocus = false
        appState.prepareFocus()
    }
}
