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

enum MeditationScene: String, CaseIterable, Identifiable {
    case morning
    case rain
    case ocean
    case stream

    var id: String { rawValue }

    var zhName: String {
        switch self {
        case .morning: "晨雾之水"
        case .rain: "雨声"
        case .ocean: "海浪"
        case .stream: "溪流"
        }
    }

    var enName: String {
        switch self {
        case .morning: "Morning Water"
        case .rain: "Rain"
        case .ocean: "Ocean"
        case .stream: "Flow"
        }
    }

    var assetName: String {
        switch self {
        case .morning: "MorningWaterHero"
        case .rain: "Rain"
        case .ocean: "Ocean"
        case .stream: "Stream"
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
        case .listen: "speaker.wave.2"
        case .focus: "circle.circle"
        case .me: "person"
        }
    }

    var zhName: String {
        switch self {
        case .listen: "聆听"
        case .focus: "静心"
        case .me: "我的"
        }
    }

    var enName: String {
        rawValue.uppercased()
    }
}
