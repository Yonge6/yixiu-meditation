import Foundation
import UserNotifications

@MainActor
final class DailyReminderManager: ObservableObject {
    @Published private(set) var isEnabled: Bool
    @Published private(set) var authorizationStatus: UNAuthorizationStatus = .notDetermined
    @Published private(set) var reminderTime: Date

    private let center: UNUserNotificationCenter
    private let defaults: UserDefaults
    private let calendar: Calendar

    private enum Key {
        static let enabled = "yixiu.dailyReminder.enabled"
        static let hour = "yixiu.dailyReminder.hour"
        static let minute = "yixiu.dailyReminder.minute"
    }

    init(
        center: UNUserNotificationCenter = .current(),
        defaults: UserDefaults = .standard,
        calendar: Calendar = .current
    ) {
        self.center = center
        self.defaults = defaults
        self.calendar = calendar
        isEnabled = defaults.bool(forKey: Key.enabled)

        let hour = defaults.object(forKey: Key.hour) == nil
            ? DailyReminderSchedule.defaultHour
            : defaults.integer(forKey: Key.hour)
        let minute = defaults.object(forKey: Key.minute) == nil
            ? DailyReminderSchedule.defaultMinute
            : defaults.integer(forKey: Key.minute)
        reminderTime = Self.date(hour: hour, minute: minute, calendar: calendar)
    }

    var isDenied: Bool { authorizationStatus == .denied }

    func refresh(languageCode: String) async {
        authorizationStatus = await center.notificationSettings().authorizationStatus
        guard isEnabled else { return }
        guard authorizationStatus == .authorized || authorizationStatus == .provisional || authorizationStatus == .ephemeral else {
            isEnabled = false
            defaults.set(false, forKey: Key.enabled)
            return
        }
        await schedule(languageCode: languageCode)
    }

    func setEnabled(_ enabled: Bool, languageCode: String) async {
        if enabled {
            let allowed: Bool
            let settings = await center.notificationSettings()
            authorizationStatus = settings.authorizationStatus
            if settings.authorizationStatus == .notDetermined {
                allowed = (try? await center.requestAuthorization(options: [.alert, .sound])) == true
                authorizationStatus = await center.notificationSettings().authorizationStatus
            } else {
                allowed = settings.authorizationStatus == .authorized
                    || settings.authorizationStatus == .provisional
                    || settings.authorizationStatus == .ephemeral
            }

            guard allowed else {
                isEnabled = false
                defaults.set(false, forKey: Key.enabled)
                return
            }

            isEnabled = true
            defaults.set(true, forKey: Key.enabled)
            await schedule(languageCode: languageCode)
        } else {
            isEnabled = false
            defaults.set(false, forKey: Key.enabled)
            center.removePendingNotificationRequests(withIdentifiers: pendingIdentifiers)
        }
    }

    func updateTime(_ date: Date, languageCode: String) async {
        let components = calendar.dateComponents([.hour, .minute], from: date)
        let schedule = DailyReminderSchedule(
            hour: components.hour ?? DailyReminderSchedule.defaultHour,
            minute: components.minute ?? DailyReminderSchedule.defaultMinute
        )
        reminderTime = Self.date(hour: schedule.hour, minute: schedule.minute, calendar: calendar)
        defaults.set(schedule.hour, forKey: Key.hour)
        defaults.set(schedule.minute, forKey: Key.minute)
        guard isEnabled else { return }
        await self.schedule(languageCode: languageCode)
    }

    func rescheduleForLanguage(_ languageCode: String) async {
        guard isEnabled else { return }
        await schedule(languageCode: languageCode)
    }

    private var pendingIdentifiers: [String] {
        let schedule = currentSchedule
        return (0..<DailyReminderSchedule.scheduledDayCount).map(schedule.identifier(dayOffset:))
    }

    private var currentSchedule: DailyReminderSchedule {
        let components = calendar.dateComponents([.hour, .minute], from: reminderTime)
        return DailyReminderSchedule(
            hour: components.hour ?? DailyReminderSchedule.defaultHour,
            minute: components.minute ?? DailyReminderSchedule.defaultMinute
        )
    }

    private func schedule(languageCode: String) async {
        let schedule = currentSchedule
        center.removePendingNotificationRequests(withIdentifiers: pendingIdentifiers)
        let now = Date()
        let dayOrdinal = calendar.ordinality(of: .day, in: .era, for: now) ?? 0

        for offset in 0..<DailyReminderSchedule.scheduledDayCount {
            guard let fireDate = schedule.fireDate(dayOffset: offset, after: now, calendar: calendar) else { continue }
            let contentCopy = schedule.copy(languageCode: languageCode, dayOrdinal: dayOrdinal + offset)
            let content = UNMutableNotificationContent()
            content.title = contentCopy.title
            content.body = contentCopy.body
            content.sound = .default
            content.userInfo = ["destination": "quiet-minute"]

            let components = calendar.dateComponents([.year, .month, .day, .hour, .minute], from: fireDate)
            let request = UNNotificationRequest(
                identifier: schedule.identifier(dayOffset: offset),
                content: content,
                trigger: UNCalendarNotificationTrigger(dateMatching: components, repeats: false)
            )
            try? await center.add(request)
        }
    }

    private static func date(hour: Int, minute: Int, calendar: Calendar) -> Date {
        calendar.date(from: DateComponents(year: 2001, month: 1, day: 1, hour: hour, minute: minute)) ?? .now
    }
}
