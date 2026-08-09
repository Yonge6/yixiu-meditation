import Foundation

enum AppLanguage: String, CaseIterable, Identifiable {
    case zh
    case en

    var id: String { rawValue }

    func text(zh: String, en: String) -> String {
        self == .zh ? zh : en
    }

    func secondary(zh: String, en: String) -> String {
        self == .zh ? en : zh
    }
}

enum MeditationScene: String, CaseIterable, Identifiable, Codable {
    case ocean
    case rain
    case spring
    case birds
    case stream
    case lake
    case valley
    case bamboo
    case falls
    case window
    case thunder
    case underwater
    case snow
    case tide

    var id: String { rawValue }

    var zhName: String {
        switch self {
        case .ocean: "大海"
        case .rain: "屋檐雨"
        case .spring: "春日花溪"
        case .birds: "晨林鸟语"
        case .stream: "山间溪流"
        case .lake: "晨雾湖岸"
        case .valley: "晴谷微风"
        case .bamboo: "竹林细雨"
        case .falls: "林间瀑布"
        case .window: "窗边夜雨"
        case .thunder: "远雷"
        case .underwater: "水下回响"
        case .snow: "雪山风"
        case .tide: "夜潮"
        }
    }

    var enName: String {
        switch self {
        case .ocean: "Ocean Waves"
        case .rain: "Rain on Eaves"
        case .spring: "Spring Creek"
        case .birds: "Morning Birds"
        case .stream: "Mountain Stream"
        case .lake: "Morning Lake"
        case .valley: "Sunny Valley"
        case .bamboo: "Bamboo Rain"
        case .falls: "Forest Falls"
        case .window: "Window Rain"
        case .thunder: "Distant Thunder"
        case .underwater: "Underwater Echo"
        case .snow: "Snow Wind"
        case .tide: "Night Tide"
        }
    }

    var useZh: String {
        switch self {
        case .ocean: "放松 · 睡眠"
        case .rain: "睡眠 · 阅读"
        case .spring: "清晨 · 舒展"
        case .birds: "醒神 · 阅读"
        case .stream: "工作 · 专注"
        case .lake: "清晨 · 冥想"
        case .valley: "工作 · 提振"
        case .bamboo: "专注 · 冥想"
        case .falls: "遮噪 · 放松"
        case .window: "睡眠 · 安定"
        case .thunder: "遮噪 · 入睡"
        case .underwater: "深度专注"
        case .snow: "安静 · 遮噪"
        case .tide: "深度睡眠"
        }
    }

    var useEn: String {
        switch self {
        case .ocean: "Relax · Sleep"
        case .rain: "Sleep · Read"
        case .spring: "Morning · Stretch"
        case .birds: "Awaken · Read"
        case .stream: "Work · Focus"
        case .lake: "Morning · Meditate"
        case .valley: "Work · Uplift"
        case .bamboo: "Focus · Meditate"
        case .falls: "Mask · Relax"
        case .window: "Sleep · Settle"
        case .thunder: "Mask · Sleep"
        case .underwater: "Deep Focus"
        case .snow: "Quiet · Mask"
        case .tide: "Deep Sleep"
        }
    }

    var assetName: String {
        switch self {
        case .ocean: "DeepOceanHero"
        case .rain: "Rain"
        case .spring: "SpringCreek"
        case .birds: "MorningBirds"
        case .stream: "Stream"
        case .lake: "MorningLake"
        case .valley: "SunnyValley"
        case .bamboo: "BambooRain"
        case .falls: "ForestFalls"
        case .window: "WindowRain"
        case .thunder: "DistantThunder"
        case .underwater: "UnderwaterEcho"
        case .snow: "SnowWind"
        case .tide: "NightTide"
        }
    }

    var audioResource: String {
        switch self {
        case .ocean, .lake, .tide: "ocean-waves"
        case .rain, .bamboo, .window: "light-rain"
        case .spring: "sunrise-river"
        case .birds: "morning-birds"
        case .stream: "river-flow"
        case .valley: "forest-breeze"
        case .falls: "forest-waterfall"
        case .thunder: "distant-thunder"
        case .underwater: "underwater-white-noise"
        case .snow: "mountain-wind"
        }
    }

    var playbackRate: Float {
        switch self {
        case .lake: 0.86
        case .bamboo: 1.04
        case .window: 0.92
        case .tide: 0.78
        default: 1
        }
    }

    var isBright: Bool {
        switch self {
        case .spring, .birds, .stream, .lake, .valley, .bamboo, .falls, .snow:
            true
        default:
            false
        }
    }
}

enum RootTab: String, CaseIterable, Identifiable {
    case listen
    case focus
    case me

    var id: String { rawValue }

    var icon: String {
        switch self {
        case .listen: "water.waves"
        case .focus: "circle.circle"
        case .me: "person"
        }
    }

    var zhName: String {
        switch self {
        case .listen: "声音"
        case .focus: "静心"
        case .me: "我的"
        }
    }

    var enName: String {
        switch self {
        case .listen: "SOUNDS"
        case .focus: "FOCUS"
        case .me: "ME"
        }
    }
}

enum BreathingStatus {
    case idle
    case running
    case paused
    case complete
}
