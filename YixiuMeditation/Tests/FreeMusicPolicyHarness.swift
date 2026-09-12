import Foundation

@main
struct FreeMusicPolicyHarness {
    static func main() {
        let free: Set<MeditationScene> = [.oasisRest, .oceanPassage, .firstBreath]
        precondition(SubscriptionAccessPolicy.freeMeditationScenes == free)
        for scene in MeditationScene.allCases {
            precondition(SubscriptionAccessPolicy.canAccess(scene: scene, level: .plus))
            if scene.isMeditationMusic {
                precondition(SubscriptionAccessPolicy.canAccess(scene: scene, level: .free) == free.contains(scene))
                precondition(SubscriptionAccessPolicy.canAccess(scene: scene, level: .legacy) == free.contains(scene))
            } else {
                precondition(SubscriptionAccessPolicy.canAccess(scene: scene, level: .legacy))
            }
        }
        precondition(SubscriptionAccessPolicy.freeNatureScenes.count == 5)
        precondition(SubscriptionAccessPolicy.freeScenes.count == 8)
        precondition(MeditationScene.allCases.count == 27)
        precondition(MeditationScene.allCases.filter(\.isMeditationMusic).count == 13)
        for scene in [MeditationScene.cloudDrift, .softLightRest, .deepWaterRest] {
            precondition(scene.matches(.meditation) && scene.matches(.sleep) && scene.matches(.relax))
            precondition(!scene.matches(.nature))
            precondition(scene.audioSubdirectory == "Audio/Meditation")
            precondition(scene.shareURL(language: .zh).query!.contains("music=\(scene.rawValue)"))
        }
        print("FREE_MUSIC_POLICY_PASS: exact three tracks, five nature sounds, legacy nature rights and Plus preserved")
    }
}
