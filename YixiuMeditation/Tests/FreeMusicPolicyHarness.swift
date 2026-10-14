import Foundation

@main
struct FreeMusicPolicyHarness {
    static func main() {
        let free: Set<MeditationScene> = [.oasisRest, .firstBreath, .clairDeLune, .gymnopedie, .canon, .moonlightSonata, .preludeC, .traumerei, .raindrop, .waltzAMinor, .gnossienne, .mozartAndante]
        let originalFree: Set<MeditationScene> = [.moonAnchorage, .rainLantern, .blueQuiet, .snowfallSilence, .bedsideGlow]
        let allFreeMusic = free.union(originalFree)
        precondition(SubscriptionAccessPolicy.freeOriginalScenes == originalFree)
        precondition(SubscriptionAccessPolicy.freeMeditationScenes == allFreeMusic)
        for scene in MeditationScene.availableScenes {
            precondition(SubscriptionAccessPolicy.canAccess(scene: scene, level: .plus))
            if scene.isMeditationMusic {
                precondition(SubscriptionAccessPolicy.canAccess(scene: scene, level: .free) == allFreeMusic.contains(scene))
                precondition(SubscriptionAccessPolicy.canAccess(scene: scene, level: .legacy) == allFreeMusic.contains(scene))
            } else {
                precondition(SubscriptionAccessPolicy.canAccess(scene: scene, level: .legacy))
            }
        }
        precondition(SubscriptionAccessPolicy.freeNatureScenes.count == 10)
        precondition(SubscriptionAccessPolicy.freeScenes.count == 27)
        precondition(SubscriptionAccessPolicy.freeNatureScenes == Set([.ocean, .rain, .spring, .birds, .stream, .lake, .valley, .bamboo, .window, .tide]))
        precondition(SubscriptionAccessPolicy.freeClassicalScenes.count == 10)
        precondition(MeditationScene.availableScenes.count == 54)
        precondition(MeditationScene.availableScenes.filter(\.isMeditationMusic).count == 40)
        precondition(MeditationScene.availableScenes.filter { $0.matches(.original) }.count == 10)
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
        let attributedShareURL = MeditationScene.rain.shareURL(language: .zh)
        let shareQuery = attributedShareURL.query ?? ""
        precondition(shareQuery.contains("scene=rain"))
        precondition(shareQuery.contains("utm_source=yixiu_app"))
        precondition(shareQuery.contains("utm_medium=share_poster"))
        precondition(shareQuery.contains("utm_campaign=scene_share"))
        precondition(shareQuery.contains("utm_content=rain_zh"))
        precondition(Array(MeditationScene.homeScenes.prefix(27)).allSatisfy { SubscriptionAccessPolicy.freeScenes.contains($0) })
        precondition(MeditationScene.homeScenes.count == Set(MeditationScene.homeScenes).count)
        precondition(MeditationScene.homeScenes.first == .ocean)
        if CommandLine.arguments.count == 2 {
            let bundle = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
            for scene in MeditationScene.availableScenes {
                let audio = bundle.appendingPathComponent(scene.audioSubdirectory)
                    .appendingPathComponent(scene.audioResource + ".m4a")
                let attributes = try! FileManager.default.attributesOfItem(atPath: audio.path)
                precondition((attributes[.size] as? NSNumber)?.intValue ?? 0 > 0,
                             "Missing archived audio for \(scene.rawValue)")
            }
            print("ARCHIVED_AUDIO_PASS: all 54 active scenes resolve to non-empty bundled audio")
        }
        print("FREE_MUSIC_POLICY_PASS: 54 scenes, 10 Free nature, 17 Free music, AI Originals 5 Free / 5 Plus, retired tracks denied")
    }
}
