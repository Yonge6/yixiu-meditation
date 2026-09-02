import Foundation
import Testing
@testable import YixiuActivityCore

@Suite("Quiet minute schedule")
struct QuietMinuteScheduleTests {
    private let start = Date(timeIntervalSince1970: 1_800_000_000)

    @Test("A quiet minute lasts exactly sixty seconds")
    func fixedDuration() {
        let schedule = QuietMinuteSchedule(startDate: start)

        #expect(schedule.endDate == start.addingTimeInterval(60))
        #expect(QuietMinuteSchedule.duration == 60)
    }

    @Test(
        "Breathing uses the existing four-two-six rhythm",
        arguments: [
            (0.0, QuietMinutePhase.inhale),
            (3.999, QuietMinutePhase.inhale),
            (4.0, QuietMinutePhase.hold),
            (5.999, QuietMinutePhase.hold),
            (6.0, QuietMinutePhase.exhale),
            (11.999, QuietMinutePhase.exhale),
            (12.0, QuietMinutePhase.inhale),
            (59.999, QuietMinutePhase.exhale),
            (60.0, QuietMinutePhase.complete),
        ]
    )
    func breathingPhases(offset: TimeInterval, expected: QuietMinutePhase) {
        let schedule = QuietMinuteSchedule(startDate: start)

        #expect(schedule.phase(at: start.addingTimeInterval(offset)) == expected)
    }

    @Test("Times before the start clamp to the first inhale")
    func clampsBeforeStart() {
        let schedule = QuietMinuteSchedule(startDate: start)

        #expect(schedule.phase(at: start.addingTimeInterval(-20)) == .inhale)
        #expect(schedule.remainingSeconds(at: start.addingTimeInterval(-20)) == 60)
    }

    @Test("Times after the end stay complete with no negative remainder")
    func clampsAfterEnd() {
        let schedule = QuietMinuteSchedule(startDate: start)

        #expect(schedule.phase(at: start.addingTimeInterval(90)) == .complete)
        #expect(schedule.remainingSeconds(at: start.addingTimeInterval(90)) == 0)
    }
}
