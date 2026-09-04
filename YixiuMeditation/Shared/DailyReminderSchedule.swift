import Foundation

public struct DailyReminderCopy: Equatable, Sendable {
    public let title: String
    public let body: String

    public init(title: String, body: String) {
        self.title = title
        self.body = body
    }
}

public struct DailyReminderSchedule: Equatable, Sendable {
    public static let identifier = "com.health.yixiu.daily-quiet-reminder"
    public static let scheduledDayCount = 30
    public static let defaultHour = 21
    public static let defaultMinute = 30

    public let hour: Int
    public let minute: Int

    public init(hour: Int = Self.defaultHour, minute: Int = Self.defaultMinute) {
        self.hour = min(max(hour, 0), 23)
        self.minute = min(max(minute, 0), 59)
    }

    public var dateComponents: DateComponents {
        DateComponents(hour: hour, minute: minute)
    }

    public func identifier(dayOffset: Int) -> String {
        "\(Self.identifier).\(dayOffset)"
    }

    public func fireDate(dayOffset: Int, after startDate: Date, calendar: Calendar = .current) -> Date? {
        guard dayOffset >= 0 else { return nil }
        let startOfToday = calendar.startOfDay(for: startDate)
        guard let todayFireDate = calendar.date(bySettingHour: hour, minute: minute, second: 0, of: startOfToday) else { return nil }
        let firstOffset = todayFireDate <= startDate ? 1 : 0
        guard let targetDay = calendar.date(byAdding: .day, value: dayOffset + firstOffset, to: startOfToday) else { return nil }
        return calendar.date(bySettingHour: hour, minute: minute, second: 0, of: targetDay)
    }

    public func copy(languageCode: String, dayOrdinal: Int) -> DailyReminderCopy {
        let isChinese = languageCode.lowercased().hasPrefix("zh")
        let copies = isChinese ? Self.chineseCopies : Self.englishCopies
        let index = abs(dayOrdinal) % copies.count
        return copies[index]
    }

    private static let chineseCopies = [
        DailyReminderCopy(title: "给自己一分钟", body: "放下今天，跟着水的节奏慢慢呼吸。"),
        DailyReminderCopy(title: "今晚，也可以很安静", body: "打开一休，让一种自然声陪你回到自己。"),
        DailyReminderCopy(title: "睡前的一小段留白", body: "不必完成什么，只听一分钟。"),
    ]

    private static let englishCopies = [
        DailyReminderCopy(title: "One quiet minute", body: "Let today go and breathe with the rhythm of water."),
        DailyReminderCopy(title: "A quieter evening", body: "Open Yixiu and return to yourself with a natural sound."),
        DailyReminderCopy(title: "A little space before sleep", body: "Nothing to finish. Just listen for one minute."),
    ]
}
