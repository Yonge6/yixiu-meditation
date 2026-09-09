import Foundation
import UserNotifications

@MainActor
private final class FakeNotifications: ReminderNotificationClient {
    var status: UNAuthorizationStatus = .authorized
    var fail = false
    var requested = false
    var pending: Set<String> = []
    var saved: DailyReminderSchedule?
    var copy: DailyReminderCopy?
    var blockAdd = false
    var addStarted = false
    var continuation: CheckedContinuation<Void, Never>?

    func authorizationStatus() async -> UNAuthorizationStatus { status }
    func requestAuthorization() async throws -> Bool {
        requested = true
        status = .authorized
        return true
    }
    func add(schedule: DailyReminderSchedule, copy: DailyReminderCopy) async throws {
        addStarted = true
        if blockAdd { await withCheckedContinuation { continuation = $0 } }
        if fail { throw NSError(domain: "YixiuReminderTest", code: 1) }
        saved = schedule
        self.copy = copy
        pending.insert(DailyReminderSchedule.recurringIdentifier)
    }
    func remove(identifiers: [String]) { pending.subtract(identifiers) }
}

@main
struct DailyReminderManagerSmoke {
    @MainActor static func main() async {
        let suite = "com.health.yixiu.tests.reminder." + UUID().uuidString
        let defaults = UserDefaults(suiteName: suite)!
        defer { defaults.removePersistentDomain(forName: suite) }
        let client = FakeNotifications()
        let manager = DailyReminderManager(client: client, defaults: defaults)
        let legacy = DailyReminderSchedule().legacyIdentifiers
        client.pending = Set(legacy + ["unrelated-notification"])
        client.fail = true
        await manager.setEnabled(true, languageCode: "en")
        precondition(!manager.isEnabled && manager.hasScheduleError)
        precondition(client.pending == Set(legacy + ["unrelated-notification"]))

        client.fail = false
        await manager.setEnabled(true, languageCode: "en")
        precondition(manager.isEnabled && !manager.hasScheduleError)
        precondition(client.pending == [DailyReminderSchedule.recurringIdentifier, "unrelated-notification"])
        precondition(client.saved?.hour == 21 && client.saved?.minute == 30)
        let oldTime = manager.reminderTime
        client.fail = true
        await manager.updateTime(oldTime.addingTimeInterval(3600), languageCode: "en")
        precondition(manager.reminderTime == oldTime && manager.isEnabled && manager.hasScheduleError)
        precondition(client.saved?.hour == 21)

        client.fail = false
        await manager.updateTime(oldTime.addingTimeInterval(3600), languageCode: "zh")
        precondition(client.saved?.hour == 22 && client.copy?.title == "给自己一分钟")
        await manager.rescheduleForLanguage("en")
        precondition(client.copy?.title == "One quiet minute")
        client.status = .denied
        await manager.refresh(languageCode: "en")
        precondition(!manager.isEnabled && manager.isDenied)
        precondition(client.pending == ["unrelated-notification"])
        client.status = .notDetermined
        await manager.setEnabled(true, languageCode: "en")
        precondition(client.requested && manager.isEnabled)

        // A slow add followed by OFF must end with no Yixiu reminder.
        client.blockAdd = true
        client.addStarted = false
        let enabling = Task { await manager.setEnabled(true, languageCode: "en") }
        while !client.addStarted { await Task.yield() }
        let disabling = Task { await manager.setEnabled(false, languageCode: "en") }
        await Task.yield()
        client.continuation?.resume()
        await enabling.value
        await disabling.value
        precondition(!manager.isEnabled && !manager.isUpdating)
        precondition(client.pending == ["unrelated-notification"])
        precondition(!defaults.bool(forKey: "yixiu.dailyReminder.enabled"))
        print("PASS: reminder failure, migration, time rollback, localization, permission refresh, opt-in, serialized disable, unrelated request preservation")
    }
}
