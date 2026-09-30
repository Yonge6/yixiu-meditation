import Testing
@testable import YixiuActivityCore

@Suite("Actual listening measurements")
struct ListeningProgressTests {
    @Test func countsProgressNotWallClock() {
        var clock = ListeningProgress()
        #expect(clock.sample(position: 0, at: 0, duration: 20) == 0)
        #expect(clock.sample(position: 5, at: 5, duration: 20) == 5)
        #expect(clock.sample(position: 5, at: 10, duration: 20) == 0)
        clock.reset()
        #expect(clock.sample(position: 5, at: 100, duration: 20) == 0)
    }
    @Test func handlesLoopsRateAndSeeks() {
        var clock = ListeningProgress()
        _ = clock.sample(position: 19, at: 0, duration: 20)
        #expect(clock.sample(position: 1, at: 2, duration: 20) == 2)
        #expect(clock.sample(position: 3, at: 6, duration: 20, rate: 0.5) == 4)
        #expect(clock.sample(position: 17, at: 7, duration: 20) == 0)
    }
    @Test func wallClockChangesNeverInventListening() {
        var clock = ListeningProgress()
        _ = clock.sample(position: 0, at: 100, duration: 60)
        #expect(clock.sample(position: 5, at: 90, duration: 60) == 0)
        #expect(clock.sample(position: 10, at: 3690, duration: 60) == 5)
        #expect(clock.sample(position: 10, at: 3700, duration: 60) == 0)
    }
}
