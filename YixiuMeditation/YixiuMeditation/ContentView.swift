import StoreKit
import SwiftUI
import UIKit

struct ContentView: View {
    @EnvironmentObject private var appState: AppState
    @EnvironmentObject private var subscriptionStore: SubscriptionStore
    @EnvironmentObject private var dailyReminder: DailyReminderManager
    @Environment(\.requestReview) private var requestReview

    var body: some View {
        NativeSystemTabView(
            appState: appState,
            subscriptionStore: subscriptionStore,
            dailyReminder: dailyReminder
        )
        .ignoresSafeArea()
        .background(YixiuTheme.deepWater)
        .preferredColorScheme(.dark)
        .onChange(of: appState.reviewRequestToken) { _, token in
            guard token > 0 else { return }
            requestReview()
            appState.markReviewRequestHandled()
        }
    }
}

private struct NativeSystemTabView: UIViewControllerRepresentable {
    let appState: AppState
    let subscriptionStore: SubscriptionStore
    let dailyReminder: DailyReminderManager

    private let tabs = RootTab.allCases

    func makeCoordinator() -> Coordinator {
        Coordinator(parent: self)
    }

    func makeUIViewController(context: Context) -> UITabBarController {
        let controller = UITabBarController()
        controller.delegate = context.coordinator
        controller.view.backgroundColor = UIColor(red: 3 / 255, green: 23 / 255, blue: 33 / 255, alpha: 1)
        controller.tabBar.tintColor = UIColor(red: 174 / 255, green: 241 / 255, blue: 244 / 255, alpha: 1)
        controller.tabBar.unselectedItemTintColor = UIColor(red: 170 / 255, green: 193 / 255, blue: 202 / 255, alpha: 0.72)

        controller.setViewControllers(tabs.map(hostingController(for:)), animated: false)
        controller.selectedIndex = tabs.firstIndex(of: appState.activeTab) ?? 0
        updateTitles(on: controller)
        return controller
    }

    func updateUIViewController(_ controller: UITabBarController, context: Context) {
        context.coordinator.parent = self
        let selectedIndex = tabs.firstIndex(of: appState.activeTab) ?? 0
        if controller.selectedIndex != selectedIndex {
            controller.selectedIndex = selectedIndex
        }
        updateTitles(on: controller)
    }

    private func hostingController(for tab: RootTab) -> UIViewController {
        let content: AnyView
        switch tab {
        case .listen:
            content = AnyView(ListenView())
        case .focus:
            content = AnyView(FocusView())
        case .me:
            content = AnyView(MeView())
        }

        let controller = UIHostingController(rootView: content
            .environmentObject(appState)
            .environmentObject(subscriptionStore)
            .environmentObject(dailyReminder)
        )
        controller.view.backgroundColor = .clear
        controller.tabBarItem = UITabBarItem(
            title: title(for: tab),
            image: UIImage(systemName: tab.icon),
            selectedImage: UIImage(systemName: selectedIcon(for: tab))
        )
        return controller
    }

    private func updateTitles(on controller: UITabBarController) {
        for (index, tab) in tabs.enumerated() {
            controller.viewControllers?[safe: index]?.tabBarItem.title = title(for: tab)
        }
    }

    private func title(for tab: RootTab) -> String {
        appState.language.text(zh: tab.zhName, en: tab.enName.capitalized)
    }

    private func selectedIcon(for tab: RootTab) -> String {
        switch tab {
        case .listen: "water.waves"
        case .focus: "circle.circle.fill"
        case .me: "person.fill"
        }
    }

    final class Coordinator: NSObject, UITabBarControllerDelegate {
        var parent: NativeSystemTabView

        init(parent: NativeSystemTabView) {
            self.parent = parent
        }

        func tabBarController(_ tabBarController: UITabBarController, didSelect viewController: UIViewController) {
            guard parent.tabs.indices.contains(tabBarController.selectedIndex) else { return }
            parent.appState.activeTab = parent.tabs[tabBarController.selectedIndex]
        }
    }
}

private extension Collection {
    subscript(safe index: Index) -> Element? {
        indices.contains(index) ? self[index] : nil
    }
}
