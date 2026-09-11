export type PracticeEntry = {
  id: string;
  sceneID: string;
  kind: "listening" | "breathing";
  seconds: number;
  completedAt: number;
};

// Only verified native Apple access can grant extended durations. H5 is Free.
export const canUseWebTimer = (minutes: number) => [5, 15, 30].includes(minutes);
export const canUseWebFocus = (minutes: number) => minutes === 1;

export class PracticeClock {
  private remainingMs = 0;
  private startedAt: number | null = null;
  reset(seconds: number) { this.remainingMs = Math.max(0, seconds * 1000); this.startedAt = null; }
  start(now = Date.now()) { if (this.startedAt === null && this.remainingMs > 0) this.startedAt = now; }
  pause(now = Date.now()) {
    this.remainingMs = this.millisecondsRemaining(now);
    this.startedAt = null;
  }
  private millisecondsRemaining(now: number) {
    return Math.max(0, this.remainingMs - (this.startedAt === null ? 0 : Math.max(0, now - this.startedAt)));
  }
  remaining(now = Date.now()) { return Math.ceil(this.millisecondsRemaining(now) / 1000); }
}

export function validateJournal(raw: unknown, validScenes: readonly string[], now = Date.now()): PracticeEntry[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  return raw.filter((entry): entry is PracticeEntry => {
    if (!entry || typeof entry !== "object") return false;
    const valid = typeof entry.id === "string" && entry.id.length > 0 && entry.id.length <= 100
      && !seen.has(entry.id) && validScenes.includes(entry.sceneID)
      && ["listening", "breathing"].includes(entry.kind)
      && Number.isInteger(entry.seconds) && entry.seconds >= 60 && entry.seconds <= 86400
      && Number.isFinite(entry.completedAt) && entry.completedAt > 0 && entry.completedAt <= now;
    if (valid) seen.add(entry.id);
    return valid;
  }).sort((a, b) => b.completedAt - a.completedAt).slice(0, 200);
}

export function weekSummary(entries: PracticeEntry[], now = new Date()) {
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
  const days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday); day.setDate(day.getDate() + index); return day;
  });
  const current = entries.filter(entry => entry.completedAt >= monday.getTime() && entry.completedAt <= now.getTime());
  return { days, minutes: Math.floor(current.reduce((sum, entry) => sum + entry.seconds, 0) / 60),
    practiced: days.map(day => current.some(entry => new Date(entry.completedAt).toDateString() === day.toDateString())) };
}
