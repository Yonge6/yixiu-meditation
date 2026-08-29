import Foundation

enum YixiuAccessLevel: String, Equatable {
    case free
    case legacy
    case plus
}

enum YixiuPlusPlan: String, CaseIterable, Identifiable {
    case monthly
    case yearly

    var id: String { rawValue }

    var productID: String {
        switch self {
        case .monthly: "com.health.yixiu.plus.monthly"
        case .yearly: "com.health.yixiu.plus.yearly"
        }
    }
}

enum SubscriptionAccessPolicy {
    static let legacyCutoffVersion = "1.2"
    static let freeNatureScenes: Set<MeditationScene> = [.ocean, .rain, .spring, .birds, .stream]
    static let freeMeditationScenes: Set<MeditationScene> = [.stillWater, .firstBreath]
    static let freeScenes = freeNatureScenes.union(freeMeditationScenes)

    static func isLegacyPurchase(originalAppVersion: String) -> Bool {
        compareVersions(originalAppVersion, legacyCutoffVersion) != .orderedDescending
    }

    static func canAccess(scene: MeditationScene, level: YixiuAccessLevel) -> Bool {
        switch level {
        case .free:
            freeScenes.contains(scene)
        case .legacy:
            !scene.isMeditationMusic || freeMeditationScenes.contains(scene)
        case .plus:
            true
        }
    }

    static func canUseTimer(minutes: Int, level: YixiuAccessLevel) -> Bool {
        [15, 30].contains(minutes) || level != .free
    }

    static func canUseFocus(minutes: Int, level: YixiuAccessLevel) -> Bool {
        switch level {
        case .free:
            minutes == 1
        case .legacy:
            [1, 3].contains(minutes)
        case .plus:
            [1, 3, 5, 10].contains(minutes)
        }
    }

    private static func compareVersions(_ lhs: String, _ rhs: String) -> ComparisonResult {
        lhs.compare(rhs, options: .numeric)
    }
}
