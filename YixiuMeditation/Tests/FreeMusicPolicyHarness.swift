import Foundation

@main
struct FreeMusicPolicyHarness {
    static func main() {
        let free: Set<MeditationScene> = [.oasisRest, .firstBreath, .clairDeLune, .gymnopedie, .canon, .moonlightSonata, .preludeC, .traumerei, .raindrop, .waltzAMinor, .gnossienne, .mozartAndante]
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
        precondition(SubscriptionAccessPolicy.freeNatureScenes.count == 10)
        precondition(SubscriptionAccessPolicy.freeScenes.count == 22)
        precondition(SubscriptionAccessPolicy.freeNatureScenes == Set([.ocean, .rain, .spring, .birds, .stream, .lake, .valley, .bamboo, .window, .tide]))
        precondition(SubscriptionAccessPolicy.freeClassicalScenes.count == 10)
        precondition(MeditationScene.availableScenes.count == 44)
        precondition(MeditationScene.availableScenes.filter(\.isMeditationMusic).count == 30)
        precondition(MeditationScene.availableScenes.filter { $0.matches(.classical) }.count == 20)
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
        precondition(Array(MeditationScene.homeScenes.prefix(22)).allSatisfy { SubscriptionAccessPolicy.freeScenes.contains($0) })
        precondition(MeditationScene.homeScenes.count == Set(MeditationScene.homeScenes).count)
        precondition(MeditationScene.homeScenes.first == .ocean)
        print("FREE_MUSIC_POLICY_PASS: 10 Free nature sounds, 12 Free music tracks (10 classical), 44 available scenes, twenty classical works, retired tracks denied, historical IDs preserved")
    }
}
