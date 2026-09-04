import Foundation
import Testing
@testable import YixiuActivityCore

@Suite("Daily reminder schedule")
struct DailyReminderScheduleTests {
    @Test("The default reminder is 21:30")
    func defaultTime() {
        let schedule = DailyReminderSchedule()

        #expect(schedule.hour == 21)
        #expect(schedule.minute == 30)
        #expect(schedule.dateComponents.hour == 21)
        #expect(schedule.dateComponents.minute == 30)
        #expect(DailyReminderSchedule.identifier == "com.health.yixiu.daily-quiet-reminder")
    }

    @Test("Invalid time values clamp to calendar bounds")
    func clampsTime() {
        #expect(DailyReminderSchedule(hour: -1, minute: -4) == DailyReminderSchedule(hour: 0, minute: 0))
        #expect(DailyReminderSchedule(hour: 30, minute: 80) == DailyReminderSchedule(hour: 23, minute: 59))
    }

    @Test("Reminder copy rotates and follows the selected language")
    func localizedRotation() {
        let schedule = DailyReminderSchedule()

        #expect(schedule.copy(languageCode: "zh-Hans", dayOrdinal: 0).title == "给自己一分钟")
        #expect(schedule.copy(languageCode: "en", dayOrdinal: 0).title == "One quiet minute")
        #expect(schedule.copy(languageCode: "en", dayOrdinal: 1) != schedule.copy(languageCode: "en", dayOrdinal: 0))
        #expect(schedule.copy(languageCode: "en", dayOrdinal: 3) == schedule.copy(languageCode: "en", dayOrdinal: 0))
    }

    @Test("Reminder identifiers are stable and dates move past elapsed time")
    func identifiersAndDates() {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone(secondsFromGMT: 0)!
        let start = calendar.date(from: DateComponents(year: 2026, month: 9, day: 4, hour: 22))!
        let schedule = DailyReminderSchedule()

        #expect(schedule.identifier(dayOffset: 4) == "com.health.yixiu.daily-quiet-reminder.4")
        #expect(schedule.fireDate(dayOffset: 0, after: start, calendar: calendar) == calendar.date(from: DateComponents(year: 2026, month: 9, day: 5, hour: 21, minute: 30)))
        #expect(schedule.fireDate(dayOffset: 1, after: start, calendar: calendar) == calendar.date(from: DateComponents(year: 2026, month: 9, day: 6, hour: 21, minute: 30)))
        #expect(DailyReminderSchedule.scheduledDayCount == 30)
    }
}
