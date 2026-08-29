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

        print("Subscription access policy smoke test passed (24 items, free 5+2, legacy 14+2, Plus 24).")
    }
}
