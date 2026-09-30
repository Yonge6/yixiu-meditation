// Schema 2 is deliberately separate from the historic click-based playback metric.
export const analyticsConsentKey = "yixiu.analyticsConsent.v2";
export function analyticsConsent(): boolean {
  try { return localStorage.getItem(analyticsConsentKey) === "granted"; } catch { return false; }
}
export function setAnalyticsConsent(enabled: boolean) {
  try { localStorage.setItem(analyticsConsentKey, enabled ? "granted" : "denied"); } catch { /* Storage may be unavailable. */ }
  window.dispatchEvent(new CustomEvent("yixiu:consent", { detail: { enabled } }));
}
export function productEvent(name: string, parameters: Record<string, string | number | boolean> = {}) {
  window.dispatchEvent(new CustomEvent("yixiu:analytics", { detail: { event: `yixiu_v2_${name}`, schema_version: 2, ...parameters } }));
}

// Measure media progress, not configured duration or UI state. A throttled timer
// may undercount multiple loops, but must never count a stalled player as listening.
export class ListeningClock {
  private position: number | null = null;
  private at: number | null = null;
  sample(position: number, now: number, rate = 1, duration = Infinity): number {
    const previous = this.position, previousAt = this.at;
    this.position = position; this.at = now;
    if (previous === null || previousAt === null || rate <= 0) return 0;
    const elapsed = Math.max(0, (now - previousAt) / 1000);
    let mediaDelta = position - previous;
    if (mediaDelta < 0 && Number.isFinite(duration)) mediaDelta += duration;
    if (mediaDelta < 0 || mediaDelta / rate > elapsed + 0.5) return 0; // Seek, not listening.
    return Math.max(0, Math.min(elapsed, mediaDelta / rate));
  }
  reset() { this.position = null; this.at = null; }
}

export function observeAudio(audio: HTMLAudioElement, sceneId: string, category: string, free: boolean) {
  const clock = new ListeningClock();
  const context = { scene_id: sceneId, content_category: category, access_level: free ? "free" : "plus" };
  let pending = 0, total = 0, started = false, disposed = false, active = false, qualified = false, failed = false;
  const emit = (name: string, extra: Record<string, string | number | boolean> = {}) => productEvent(name, { ...context, ...extra });
  const sample = () => {
    if (!active || !analyticsConsent()) { clock.reset(); return; }
    const delta = clock.sample(audio.currentTime, performance.now(), audio.playbackRate, audio.duration);
    pending += delta; total += delta;
    if (total >= 60 && !qualified) { qualified = true; emit("qualified_listen"); }
  };
  const flush = () => { sample(); if (pending >= 0.1) { emit("listen_time", { value: Math.round(pending * 100) / 100 }); pending = 0; } };
  const playing = () => {
    active = true; clock.reset(); sample();
    if (!started) { started = true; emit("playback_start"); }
  };
  const pause = () => { flush(); active = false; clock.reset(); };
  const waiting = () => { pause(); emit("playback_buffer"); };
  const error = () => { pause(); if (!failed) emit("playback_error", { error_code: String(audio.error?.code ?? "play_rejected") }); failed = true; };
  const consent = () => { pending = 0; total = 0; qualified = false; started = false; clock.reset(); if (analyticsConsent() && active) playing(); };
  const seek = () => { clock.reset(); flush(); clock.reset(); };
  const resume = () => { clock.reset(); sample(); };
  const listeners: [string, EventListener][] = [["playing", playing], ["pause", pause], ["waiting", waiting], ["error", error], ["seeking", seek], ["seeked", resume]];
  listeners.forEach(([name, fn]) => audio.addEventListener(name, fn));
  const interval = window.setInterval(() => { sample(); if (pending >= 30) flush(); }, 5000);
  window.addEventListener("pagehide", flush);
  window.addEventListener("yixiu:consent", consent);
  const visibility = () => { if (document.visibilityState === "hidden") flush(); };
  document.addEventListener("visibilitychange", visibility);
  emit("playback_request");
  return {
    failed: error,
    dispose(reason = "pause_or_switch") {
      if (disposed) return;
      flush(); disposed = true;
      if (started) emit("playback_end", { listened_seconds: Math.round(total), end_reason: reason });
      listeners.forEach(([name, fn]) => audio.removeEventListener(name, fn));
      window.clearInterval(interval);
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("yixiu:consent", consent);
      document.removeEventListener("visibilitychange", visibility);
    },
  };
}
