import Combine
import Foundation
import UserNotifications

@MainActor
protocol ReminderNotificationClient {
    func authorizationStatus() async -> UNAuthorizationStatus
    func requestAuthorization() async throws -> Bool
    func add(schedule: DailyReminderSchedule, copy: DailyReminderCopy) async throws
    func remove(identifiers: [String])
}

@MainActor
private struct SystemReminderNotificationClient: ReminderNotificationClient {
    let center = UNUserNotificationCenter.current()
    func authorizationStatus() async -> UNAuthorizationStatus {
        await center.notificationSettings().authorizationStatus
    }
    func requestAuthorization() async throws -> Bool {
        try await center.requestAuthorization(options: [.alert, .sound])
    }
    func add(schedule: DailyReminderSchedule, copy: DailyReminderCopy) async throws {
        let content = UNMutableNotificationContent()
        content.title = copy.title
        content.body = copy.body
        content.sound = .default
        content.userInfo = ["destination": "quiet-minute"]
        try await center.add(UNNotificationRequest(
            identifier: DailyReminderSchedule.recurringIdentifier,
            content: content,
            trigger: UNCalendarNotificationTrigger(dateMatching: schedule.dateComponents, repeats: true)
        ))
    }
    func remove(identifiers: [String]) {
        center.removePendingNotificationRequests(withIdentifiers: identifiers)
    }
}

@MainActor
final class DailyReminderManager: ObservableObject {
    @Published private(set) var isEnabled: Bool
    @Published private(set) var authorizationStatus: UNAuthorizationStatus = .notDetermined
    @Published private(set) var reminderTime: Date
    @Published private(set) var isUpdating = false
    @Published private(set) var hasScheduleError = false

    private let client: any ReminderNotificationClient
    private let defaults: UserDefaults
    private let calendar: Calendar
    private var operation: Task<Void, Never>?
    private var operationID = 0
    private enum Key {
        static let enabled = "yixiu.dailyReminder.enabled"
        static let hour = "yixiu.dailyReminder.hour"
        static let minute = "yixiu.dailyReminder.minute"
    }

    init(
        client: (any ReminderNotificationClient)? = nil,
        defaults: UserDefaults = .standard,
        calendar: Calendar = .autoupdatingCurrent
    ) {
        self.client = client ?? SystemReminderNotificationClient()
        self.defaults = defaults
        self.calendar = calendar
        isEnabled = defaults.bool(forKey: Key.enabled)
        let schedule = DailyReminderSchedule(
            hour: defaults.object(forKey: Key.hour) == nil ? DailyReminderSchedule.defaultHour : defaults.integer(forKey: Key.hour),
            minute: defaults.object(forKey: Key.minute) == nil ? DailyReminderSchedule.defaultMinute : defaults.integer(forKey: Key.minute)
        )
        reminderTime = Self.date(hour: schedule.hour, minute: schedule.minute, calendar: calendar)
    }

    var isDenied: Bool { authorizationStatus == .denied }
    private var isAuthorized: Bool {
        if authorizationStatus == .authorized || authorizationStatus == .provisional { return true }
#if os(iOS)
        if authorizationStatus == .ephemeral { return true }
#endif
        return false
    }

    func refresh(languageCode: String) async {
        await enqueue {
            // Re-anchor saved local wall time after a timezone change.
            let saved = DailyReminderSchedule(
                hour: self.defaults.object(forKey: Key.hour) == nil ? DailyReminderSchedule.defaultHour : self.defaults.integer(forKey: Key.hour),
                minute: self.defaults.object(forKey: Key.minute) == nil ? DailyReminderSchedule.defaultMinute : self.defaults.integer(forKey: Key.minute)
            )
            self.reminderTime = Self.date(hour: saved.hour, minute: saved.minute, calendar: self.calendar)
            self.authorizationStatus = await self.client.authorizationStatus()
            guard self.isEnabled else { return }
            guard self.isAuthorized else {
                self.disable()
                return
            }
            _ = await self.schedule(languageCode: languageCode)
        }
    }

    func setEnabled(_ enabled: Bool, languageCode: String) async {
        await enqueue {
            self.hasScheduleError = false
            guard enabled else {
                self.disable()
                return
            }
            self.authorizationStatus = await self.client.authorizationStatus()
            if self.authorizationStatus == .notDetermined {
                do {
                    _ = try await self.client.requestAuthorization()
                } catch {
                    self.hasScheduleError = true
                    return
                }
                self.authorizationStatus = await self.client.authorizationStatus()
            }
            guard self.isAuthorized else {
                self.disable()
                return
            }
            if await self.schedule(languageCode: languageCode) {
                self.isEnabled = true
                self.defaults.set(true, forKey: Key.enabled)
            }
        }
    }

    func updateTime(_ date: Date, languageCode: String) async {
        await enqueue {
            let oldTime = self.reminderTime
            let components = self.calendar.dateComponents([.hour, .minute], from: date)
            let schedule = DailyReminderSchedule(
                hour: components.hour ?? DailyReminderSchedule.defaultHour,
                minute: components.minute ?? DailyReminderSchedule.defaultMinute
            )
            self.reminderTime = Self.date(hour: schedule.hour, minute: schedule.minute, calendar: self.calendar)
            if self.isEnabled, !(await self.schedule(languageCode: languageCode)) {
                self.reminderTime = oldTime
                return
            }
            self.defaults.set(schedule.hour, forKey: Key.hour)
            self.defaults.set(schedule.minute, forKey: Key.minute)
        }
    }

    func rescheduleForLanguage(_ languageCode: String) async {
        await enqueue {
            guard self.isEnabled else { return }
            _ = await self.schedule(languageCode: languageCode)
        }
    }

    // Serialize add/remove, so an in-flight add cannot undo a later disable.
    private func enqueue(_ action: @escaping @MainActor () async -> Void) async {
        operationID += 1
        let id = operationID
        let previous = operation
        isUpdating = true
        let next = Task { @MainActor in
            await previous?.value
            await action()
        }
        operation = next
        await next.value
        if operationID == id {
            operation = nil
            isUpdating = false
        }
    }

    private func disable() {
        client.remove(identifiers: currentSchedule.legacyIdentifiers + [DailyReminderSchedule.recurringIdentifier])
        isEnabled = false
        defaults.set(false, forKey: Key.enabled)
        hasScheduleError = false
    }

    private var currentSchedule: DailyReminderSchedule {
        let components = calendar.dateComponents([.hour, .minute], from: reminderTime)
        return DailyReminderSchedule(
            hour: components.hour ?? DailyReminderSchedule.defaultHour,
            minute: components.minute ?? DailyReminderSchedule.defaultMinute
        )
    }

    private func schedule(languageCode: String) async -> Bool {
        let schedule = currentSchedule
        do {
            // One stable repeating ID. Keep the old queue until add succeeds.
            try await client.add(schedule: schedule, copy: schedule.copy(languageCode: languageCode, dayOrdinal: 0))
            client.remove(identifiers: schedule.legacyIdentifiers)
            hasScheduleError = false
            return true
        } catch {
            hasScheduleError = true
            return false
        }
    }

    private static func date(hour: Int, minute: Int, calendar: Calendar) -> Date {
        calendar.date(bySettingHour: hour, minute: minute, second: 0, of: .now) ?? .now
    }
}
