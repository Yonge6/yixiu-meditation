import Foundation

/// A deadline, not a tick counter: delayed UI updates never lengthen a practice.
struct PracticeCountdown {
    private var remaining: TimeInterval
    private var deadline: TimeInterval?

    init(seconds: Int) { remaining = TimeInterval(max(0, seconds)) }

    mutating func start(now: TimeInterval = Date.timeIntervalSinceReferenceDate) {
        guard deadline == nil else { return }
        deadline = now + remaining
    }

    mutating func pause(now: TimeInterval = Date.timeIntervalSinceReferenceDate) {
        if let deadline { remaining = max(0, deadline - now) }
        deadline = nil
    }

    mutating func reset(seconds: Int) {
        remaining = TimeInterval(max(0, seconds))
        deadline = nil
    }

    func secondsRemaining(now: TimeInterval = Date.timeIntervalSinceReferenceDate) -> Int {
        Int(ceil(max(0, deadline.map { $0 - now } ?? remaining)))
    }
}

struct PracticeEntry: Codable, Identifiable, Equatable {
    enum Kind: String, Codable { case listening, breathing }
    var id = UUID()
    var completedAt = Date()
    var sceneID: String
    var seconds: Int
    var kind: Kind

    static func sanitized(_ entries: [Self]) -> [Self] {
        var ids = Set<UUID>()
        return Array(entries.filter {
            $0.seconds > 0 && $0.seconds <= 3600 && !$0.sceneID.isEmpty && ids.insert($0.id).inserted
        }.sorted { $0.completedAt > $1.completedAt }.prefix(200))
    }

    static func weekDays(containing now: Date = Date(), calendar: Calendar = .current) -> [Date] {
        let today = calendar.startOfDay(for: now)
        let daysSinceMonday = (calendar.component(.weekday, from: today) + 5) % 7
        guard let monday = calendar.date(byAdding: .day, value: -daysSinceMonday, to: today) else { return [] }
        return (0..<7).compactMap { calendar.date(byAdding: .day, value: $0, to: monday) }
    }

    static func weekMinutes(_ entries: [Self], now: Date = Date(), calendar: Calendar = .current) -> Int {
        guard let start = weekDays(containing: now, calendar: calendar).first else { return 0 }
        return entries.filter { $0.completedAt >= start && $0.completedAt <= now }.reduce(0) { $0 + $1.seconds } / 60
    }
}
