import Foundation

@main
enum SubscriptionAccessPolicySmoke {
    static func main() {
        precondition(MeditationScene.availableScenes.count == 44)
        precondition(MeditationScene.availableScenes.filter(\.isMeditationMusic).count == 30)
        precondition(SubscriptionAccessPolicy.freeNatureScenes.count == 10)
        precondition(SubscriptionAccessPolicy.freeMeditationScenes.count == 12)
        precondition(SubscriptionAccessPolicy.freeScenes.count == 22)

        for scene in MeditationScene.availableScenes {
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
        print("Subscription access policy smoke passed: 44 sounds and free/legacy/Plus focus and timer matrix.")
    }
}
