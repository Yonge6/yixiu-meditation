export type RestIntent = "none" | "lunch" | "night_waking" | "work_break";
export type RestPurpose = "all" | "lunch" | "sleep" | "night_waking" | "work_break" | "focus" | "morning" | "relax";
export type SoundType = "all" | "nature" | "classical" | "original" | "meditation";

export const restPresets = {
  lunch: { intent: "lunch", scene: "lake", timerMinutes: 15, focusMinutes: 1, mode: "listen" },
  night_waking: { intent: "night_waking", scene: "window", timerMinutes: 15, focusMinutes: 1, mode: "listen" },
  work_break: { intent: "work_break", scene: "rain", timerMinutes: 15, focusMinutes: 1, mode: "breathe" },
} as const;

/** Prepare an explicit-tap experience. Query parameters never start media. */
export function readRestLink(search: string) {
  const intent = new URLSearchParams(search).get("rest");
  return intent && Object.hasOwn(restPresets, intent) ? restPresets[intent as keyof typeof restPresets] : null;
}

const curatedPurposes: Record<string, readonly string[]> = {
  lunch: ["lake", "spring", "stream", "softLightRest", "quietHour", "gymnopedie", "mozartAndante", "bedsideGlow"],
  night_waking: ["window", "rain", "ocean", "tide", "moonAnchorage", "blueQuiet", "nocturne", "moonlightSonata"],
  work_break: ["lake", "spring", "birds", "bamboo"],
};

export function matchesRestPurpose(purpose: RestPurpose, id: string, existingMatches: readonly string[]) {
  return purpose === "all" || (curatedPurposes[purpose] ?? existingMatches).includes(id) || (purpose === "work_break" && existingMatches.includes(id));
}
