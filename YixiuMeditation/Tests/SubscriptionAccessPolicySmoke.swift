import Foundation

@main
enum SubscriptionAccessPolicySmoke {
    static func main() {
        precondition(MeditationScene.allCases.count == 24)
        precondition(MeditationScene.allCases.filter(\.isMeditationMusic).count == 10)
        precondition(SubscriptionAccessPolicy.freeNatureScenes.count == 5)
        precondition(SubscriptionAccessPolicy.freeMeditationScenes.count == 2)
        precondition(SubscriptionAccessPolicy.freeScenes.count == 7)

        for scene in MeditationScene.allCases {
            let freeExpected = SubscriptionAccessPolicy.freeScenes.contains(scene)
            precondition(SubscriptionAccessPolicy.canAccess(scene: scene, level: .free) == freeExpected)
            precondition(SubscriptionAccessPolicy.canAccess(scene: scene, level: .plus))

            let legacyExpected = !scene.isMeditationMusic || SubscriptionAccessPolicy.freeMeditationScenes.contains(scene)
            precondition(SubscriptionAccessPolicy.canAccess(scene: scene, level: .legacy) == legacyExpected)
        }

        for minutes in [1, 3, 5, 10] {
            precondition(SubscriptionAccessPolicy.canUseFocus(minutes: minutes, level: .free) == (minutes == 1))
            precondition(SubscriptionAccessPolicy.canUseFocus(minutes: minutes, level: .legacy) == [1, 3].contains(minutes))
            precondition(SubscriptionAccessPolicy.canUseFocus(minutes: minutes, level: .plus))
        }
        for minutes in [0, 5, 15, 30, 60] {
            precondition(SubscriptionAccessPolicy.canUseTimer(minutes: minutes, level: .free) == [5, 15, 30].contains(minutes))
            precondition(SubscriptionAccessPolicy.canUseTimer(minutes: minutes, level: .legacy))
            precondition(SubscriptionAccessPolicy.canUseTimer(minutes: minutes, level: .plus))
        }
        print("Subscription access policy smoke passed: 24 sounds and free/legacy/Plus focus and timer matrix.")
    }
}
