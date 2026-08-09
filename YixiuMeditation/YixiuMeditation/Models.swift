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
    case stream
    case lake
    case falls
    case tide

    var id: String { rawValue }

    var zhName: String {
        switch self {
        case .ocean: "大海"
        case .rain: "屋檐雨"
        case .stream: "山间溪流"
        case .lake: "晨雾湖岸"
        case .falls: "林间瀑布"
        case .tide: "夜潮"
        }
    }

    var enName: String {
        switch self {
        case .ocean: "Ocean Waves"
        case .rain: "Rain on Eaves"
        case .stream: "Mountain Stream"
        case .lake: "Morning Lake"
        case .falls: "Forest Falls"
        case .tide: "Night Tide"
        }
    }

    var useZh: String {
        switch self {
        case .ocean: "放松 · 睡眠"
        case .rain: "睡眠 · 阅读"
        case .stream: "工作 · 专注"
        case .lake: "清晨 · 冥想"
        case .falls: "遮噪 · 放松"
        case .tide: "深度睡眠"
        }
    }

    var useEn: String {
        switch self {
        case .ocean: "Relax · Sleep"
        case .rain: "Sleep · Read"
        case .stream: "Work · Focus"
        case .lake: "Morning · Meditate"
        case .falls: "Mask · Relax"
        case .tide: "Deep Sleep"
        }
    }

    var assetName: String {
        switch self {
        case .ocean: "DeepOceanHero"
        case .rain: "Rain"
        case .stream: "Stream"
        case .lake: "MorningLake"
        case .falls: "ForestFalls"
        case .tide: "NightTide"
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
