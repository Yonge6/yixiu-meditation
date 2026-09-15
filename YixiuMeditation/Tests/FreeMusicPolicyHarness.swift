import Foundation

@main
struct FreeMusicPolicyHarness {
    static func main() {
        let free: Set<MeditationScene> = [.oasisRest, .firstBreath]
        precondition(SubscriptionAccessPolicy.freeMeditationScenes == free)
        for scene in MeditationScene.availableScenes {
            precondition(SubscriptionAccessPolicy.canAccess(scene: scene, level: .plus))
            if scene.isMeditationMusic {
                precondition(SubscriptionAccessPolicy.canAccess(scene: scene, level: .free) == free.contains(scene))
                precondition(SubscriptionAccessPolicy.canAccess(scene: scene, level: .legacy) == free.contains(scene))
            } else {
                precondition(SubscriptionAccessPolicy.canAccess(scene: scene, level: .legacy))
            }
        }
        precondition(SubscriptionAccessPolicy.freeNatureScenes.count == 5)
        precondition(SubscriptionAccessPolicy.freeScenes.count == 7)
        precondition(MeditationScene.availableScenes.count == 24)
        precondition(MeditationScene.availableScenes.filter(\.isMeditationMusic).count == 10)
        for scene in [MeditationScene.sunlitShore, .oceanPassage, .cloudDrift, .quietOrbit] {
            precondition(MeditationScene(rawValue: scene.rawValue) == scene)
            precondition(!scene.matches(.all))
            for level in [YixiuAccessLevel.free, .legacy, .plus] {
                precondition(!SubscriptionAccessPolicy.canAccess(scene: scene, level: level))
            }
        }
        for scene in [MeditationScene.softLightRest, .deepWaterRest, .quietHour] {
            precondition(scene.matches(.meditation) && scene.matches(.sleep) && scene.matches(.relax))
            precondition(!scene.matches(.nature))
            precondition(scene.audioSubdirectory == "Audio/Meditation")
            precondition(scene.shareURL(language: .zh).query!.contains("music=\(scene.rawValue)"))
        }
        print("FREE_MUSIC_POLICY_PASS: two free tracks, 24 available scenes, retired tracks denied, historical IDs preserved")
    }
}
