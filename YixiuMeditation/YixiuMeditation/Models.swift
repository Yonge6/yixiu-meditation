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
    case stillWater
    case deepCurrent
    case moonlitDrift
    case quietOrbit
    case dreamscape
    case firstBreath
    case openMeadow
    case oasisRest
    case sunlitShore
    case oceanPassage

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
        case .stillWater: "静水"
        case .deepCurrent: "深流"
        case .moonlitDrift: "月下漂流"
        case .quietOrbit: "静默星轨"
        case .dreamscape: "梦境水域"
        case .firstBreath: "初息"
        case .openMeadow: "原野舒展"
        case .oasisRest: "绿洲停歇"
        case .sunlitShore: "日光浅岸"
        case .oceanPassage: "海上行旅"
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
        case .stillWater: "Still Water"
        case .deepCurrent: "Deep Current"
        case .moonlitDrift: "Moonlit Drift"
        case .quietOrbit: "Quiet Orbit"
        case .dreamscape: "Dreamscape"
        case .firstBreath: "First Breath"
        case .openMeadow: "Open Meadow"
        case .oasisRest: "Oasis Rest"
        case .sunlitShore: "Sunlit Shore"
        case .oceanPassage: "Ocean Passage"
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
        case .stillWater: "冥想 · 21 分钟"
        case .deepCurrent: "冥想 · 20 分钟"
        case .moonlitDrift: "冥想 · 20 分钟"
        case .quietOrbit: "冥想 · 21 分钟"
        case .dreamscape: "冥想 · 22 分钟"
        case .firstBreath, .openMeadow, .oasisRest, .sunlitShore, .oceanPassage: "短时 · 88 秒"
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
        case .stillWater: "Meditate · 21 min"
        case .deepCurrent: "Meditate · 20 min"
        case .moonlitDrift: "Meditate · 20 min"
        case .quietOrbit: "Meditate · 21 min"
        case .dreamscape: "Meditate · 22 min"
        case .firstBreath, .openMeadow, .oasisRest, .sunlitShore, .oceanPassage: "Short · 88 sec"
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
        case .stillWater: "MeditationStillWater"
        case .deepCurrent: "MeditationDeepCurrent"
        case .moonlitDrift: "MeditationMoonlitDrift"
        case .quietOrbit: "MeditationQuietOrbit"
        case .dreamscape: "MeditationDreamscape"
        case .firstBreath: "MeditationFirstBreath"
        case .openMeadow: "MeditationOpenMeadow"
        case .oasisRest: "MeditationOasisRest"
        case .sunlitShore: "MeditationSunlitShore"
        case .oceanPassage: "MeditationOceanPassage"
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
        case .stillWater: "still-water"
        case .deepCurrent: "deep-current"
        case .moonlitDrift: "moonlit-drift"
        case .quietOrbit: "quiet-orbit"
        case .dreamscape: "dreamscape"
        case .firstBreath: "first-breath"
        case .openMeadow: "open-meadow"
        case .oasisRest: "oasis-rest"
        case .sunlitShore: "sunlit-shore"
        case .oceanPassage: "ocean-passage"
        }
    }

    var isMeditationMusic: Bool {
        switch self {
        case .stillWater, .deepCurrent, .moonlitDrift, .quietOrbit, .dreamscape,
             .firstBreath, .openMeadow, .oasisRest, .sunlitShore, .oceanPassage:
            true
        default:
            false
        }
    }

    var audioSubdirectory: String {
        isMeditationMusic ? "Audio/Meditation" : "Audio"
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
        case .ocean, .spring, .birds, .stream, .lake, .valley, .bamboo, .falls, .snow,
             .stillWater, .openMeadow, .oasisRest, .sunlitShore, .oceanPassage:
            true
        default:
            false
        }
    }

    var isNight: Bool {
        switch self {
        case .window, .thunder, .underwater, .tide, .deepCurrent, .moonlitDrift, .quietOrbit, .dreamscape:
            true
        default:
            false
        }
    }

    func matches(_ category: SceneCategory) -> Bool {
        switch category {
        case .all:
            true
        case .nature:
            !isMeditationMusic
        case .meditation:
            isMeditationMusic
        case .sleep:
            [.ocean, .rain, .window, .thunder, .snow, .tide].contains(self)
        case .focus:
            [.rain, .birds, .stream, .bamboo, .falls, .underwater, .snow].contains(self)
        case .morning:
            [.spring, .birds, .lake, .valley].contains(self)
        case .relax:
            [.ocean, .spring, .lake, .valley, .falls, .tide].contains(self)
        }
    }

    func shareURL(language: AppLanguage) -> URL {
        var components = URLComponents(string: "https://yixiu.wonderelian.com/")!
        components.queryItems = [
            URLQueryItem(name: isMeditationMusic ? "music" : "scene", value: rawValue),
            URLQueryItem(name: "lang", value: language.rawValue)
        ]
        return components.url!
    }

    func shareTitle(language: AppLanguage) -> String {
        language.text(
            zh: "一休 · \(zhName)｜如水而行",
            en: "Yixiu · \(enName) | Be water, my friend."
        )
    }

    func shareMessage(language: AppLanguage) -> String {
        language.text(
            zh: "此刻，我在一休聆听「\(zhName)」。真实自己，流动人生。",
            en: "I am listening to \(enName) in Yixiu. True to yourself, flow with life."
        )
    }
}

enum SceneCategory: String, CaseIterable, Identifiable {
    case all
    case nature
    case meditation
    case sleep
    case focus
    case morning
    case relax

    var id: String { rawValue }

    func title(language: AppLanguage) -> String {
        switch self {
        case .all: language.text(zh: "全部", en: "All")
        case .nature: language.text(zh: "自然声", en: "Nature")
        case .meditation: language.text(zh: "冥想音乐", en: "Meditation")
        case .sleep: language.text(zh: "睡眠", en: "Sleep")
        case .focus: language.text(zh: "专注", en: "Focus")
        case .morning: language.text(zh: "清晨", en: "Morning")
        case .relax: language.text(zh: "放松", en: "Relax")
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
