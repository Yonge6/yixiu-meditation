import Foundation
import Testing
@testable import YixiuActivityCore

@Suite("Quiet practice reliability")
struct PracticeJournalTests {
    @Test func delayedTickAndPause() {
        var clock = PracticeCountdown(seconds: 60)
        clock.start(now: 100)
        #expect(clock.secondsRemaining(now: 130.2) == 30)
        clock.pause(now: 130.2)
        #expect(clock.secondsRemaining(now: 500) == 30)
        clock.start(now: 500)
        #expect(clock.secondsRemaining(now: 529.7) == 1)
        #expect(clock.secondsRemaining(now: 530) == 0)
        clock.reset(seconds: 60)
        #expect(clock.secondsRemaining(now: 900) == 60)
    }

    @Test func repeatedStartDoesNotExtendDeadline() {
        var clock = PracticeCountdown(seconds: 60)
        clock.start(now: 100)
        clock.start(now: 140)
        #expect(clock.secondsRemaining(now: 160) == 0)
    }

    @Test func boundedValidatedJournal() throws {
        let entry = PracticeEntry(sceneID: "rain", seconds: 900, kind: .listening)
        let invalid = PracticeEntry(sceneID: "rain", seconds: -1, kind: .listening)
        var entries = (0..<205).map { _ in PracticeEntry(sceneID: "birds", seconds: 300, kind: .listening) }
        entries.insert(contentsOf: [entry, entry, invalid], at: 0)
        let journal = PracticeEntry.sanitized(entries)
        #expect(journal.count == 200)
        #expect(Set(journal.map(\.id)).count == 200)
        #expect(!journal.contains(invalid))
        #expect(try JSONDecoder().decode([PracticeEntry].self, from: JSONEncoder().encode(journal)) == journal)
    }

    @Test func weekUsesLocalMondayAndExcludesFuture() {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone(secondsFromGMT: 8 * 3600)!
        let now = calendar.date(from: DateComponents(year: 2026, month: 9, day: 5, hour: 12))!
        let week = PracticeEntry.weekDays(containing: now, calendar: calendar)
        #expect(week.count == 7)
        #expect(calendar.component(.weekday, from: week[0]) == 2)
        let entries = [PracticeEntry(completedAt: now, sceneID: "rain", seconds: 900, kind: .listening),
                       PracticeEntry(completedAt: now.addingTimeInterval(86400), sceneID: "rain", seconds: 900, kind: .listening)]
        #expect(PracticeEntry.weekMinutes(entries, now: now, calendar: calendar) == 15)
    }
}
