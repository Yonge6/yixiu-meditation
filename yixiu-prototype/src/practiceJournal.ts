import { useEffect, useState } from "react";

export type PracticeEntry = {
  id: string;
  completedAt: number;
  sceneId: string;
  seconds: number;
  kind: "listening" | "breathing";
};

export const journalKey = "yixiu.practiceJournal.v1";

export function decodeJournal(value: unknown, sceneIds: readonly string[]): PracticeEntry[] {
  if (!Array.isArray(value)) return [];
  const ids = new Set<string>();
  return value.filter((entry): entry is PracticeEntry => {
    if (!entry || typeof entry !== "object" || typeof entry.id !== "string" || !entry.id || ids.has(entry.id)
      || typeof entry.completedAt !== "number" || !Number.isFinite(entry.completedAt) || entry.completedAt <= 0
      || !sceneIds.includes(entry.sceneId)
      || !(entry.kind === "listening" ? [300, 900, 1800, 3600] : entry.kind === "breathing" ? [60, 180, 300, 600] : []).includes(entry.seconds)) return false;
    ids.add(entry.id);
    return true;
  }).sort((a, b) => b.completedAt - a.completedAt).slice(0, 200);
}

export function weekDays(now = new Date()): Date[] {
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
  return Array.from({ length: 7 }, (_, index) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index));
}

export function usePracticeJournal(sceneIds: readonly string[]) {
  const [entries, setEntries] = useState<PracticeEntry[]>(() => {
    try { return decodeJournal(JSON.parse(localStorage.getItem(journalKey) ?? "[]"), sceneIds); }
    catch { return []; }
  });
  const [saved, setSaved] = useState(true);
  useEffect(() => {
    try { localStorage.setItem(journalKey, JSON.stringify(entries)); setSaved(true); }
    catch { setSaved(false); }
  }, [entries]);
  const complete = (entry: Omit<PracticeEntry, "id" | "completedAt">) => {
    const next = { ...entry, id: crypto.randomUUID(), completedAt: Date.now() };
    setEntries(current => decodeJournal([next, ...current], sceneIds));
  };
  return { entries, complete, saved };
}
