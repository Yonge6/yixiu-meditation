export type AmbientStatus = "idle" | "loading" | "playing" | "paused" | "error";
export type AmbientError = "blocked" | "network" | "unsupported" | "unknown";
export type AmbientState = { status: AmbientStatus; error: AmbientError | null };
export type AmbientScene = {
  id: string;
  audio: string;
  playbackRate?: number;
  level: number;
  category: string;
  free: boolean;
};

type AudioObserver = { failed(): void; dispose(reason?: string): void };
type Track = {
  scene: AmbientScene;
  audio: HTMLAudioElement;
  observer: AudioObserver | null;
  listeners: Array<[string, EventListener]>;
};
type ControllerOptions = {
  createAudio(source: string): HTMLAudioElement;
  observe?(audio: HTMLAudioElement, scene: AmbientScene): AudioObserver;
  onState(state: AmbientState): void;
  onInterrupted(): void;
  requestFrame(callback: FrameRequestCallback): number;
  cancelFrame(frame: number): void;
  now(): number;
};

/** Owns media lifetime independently of React's render and timer state. */
export class AmbientAudioController {
  private options: ControllerOptions;
  private scene: AmbientScene | null = null;
  private current: Track | null = null;
  private outgoing: Track | null = null;
  private requested = false;
  private disposed = false;
  private generation = 0;
  private frame: number | null = null;
  private fading = false;
  private volume = 72;
  private fadeFactor = 1;
  private state: AmbientState = { status: "idle", error: null };

  constructor(options: ControllerOptions) { this.options = options; }

  update(scene: AmbientScene, requested: boolean) {
    if (this.disposed) return;
    const changed = this.scene?.id !== scene.id || this.scene.audio !== scene.audio;
    this.scene = scene;
    if (changed) {
      this.generation += 1;
      this.cancelFade();
      this.release(this.outgoing, "scene_change");
      this.outgoing = null;
      const previous = this.current;
      this.current = null;
      if (requested && previous && !previous.audio.paused && this.state.status === "playing") this.outgoing = previous;
      else this.release(previous, "scene_change");
      this.requested = requested;
      if (requested) this.beginPlay();
      else this.publish("paused");
      return;
    }
    if (!requested) {
      this.pause();
    } else if (!this.requested || this.state.status === "paused" || this.state.status === "idle" || this.state.status === "error") {
      this.requested = true;
      this.beginPlay();
    }
  }

  setVolume(volume: number, fadeFactor: number) {
    this.volume = volume;
    this.fadeFactor = fadeFactor;
    if (this.current && !this.fading && !this.outgoing) this.current.audio.volume = this.targetVolume(this.current.scene);
  }

  retry() {
    if (this.disposed || !this.scene) return;
    this.requested = true;
    this.beginPlay();
  }

  pause() {
    if (this.disposed) return;
    this.requested = false;
    this.generation += 1;
    this.cancelFade();
    this.release(this.outgoing, "pause_or_switch");
    this.outgoing = null;
    // Keep the same element and currentTime so music resumes at the same phrase.
    this.current?.audio.pause();
    if (this.state.status !== "error") this.publish(this.current ? "paused" : "idle");
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.generation += 1;
    this.cancelFade();
    this.release(this.current);
    this.release(this.outgoing);
    this.current = this.outgoing = null;
  }

  private publish(status: AmbientStatus, error: AmbientError | null = null) {
    if (this.disposed || (status === this.state.status && error === this.state.error)) return;
    this.state = { status, error };
    this.options.onState(this.state);
  }

  private targetVolume(scene: AmbientScene) {
    return Math.min(1, Math.max(0, (this.volume / 100) * Math.min(scene.level * 11, 1) * this.fadeFactor));
  }

  private createTrack(scene: AmbientScene): Track {
    const audio = this.options.createAudio(scene.audio);
    audio.loop = true;
    audio.preload = "auto";
    audio.playbackRate = scene.playbackRate ?? 1;
    audio.volume = this.outgoing ? 0 : this.targetVolume(scene);
    const track: Track = { scene, audio, observer: null, listeners: [] };
    const isCurrent = () => !this.disposed && this.current === track;
    track.listeners = [
      ["playing", () => {
        if (!isCurrent() || !this.requested || audio.paused || audio.readyState < 3) return;
        this.publish("playing");
        this.startFade(track);
      }],
      ["waiting", () => {
        if (!isCurrent() || !this.requested || audio.readyState >= 3) return;
        this.cancelFade();
        this.publish("loading");
      }],
      ["stalled", () => { if (isCurrent() && this.requested && audio.readyState < 3) this.publish("loading"); }],
      ["pause", () => {
        if (!isCurrent() || !this.requested || !audio.paused) return;
        this.requested = false;
        this.generation += 1;
        this.cancelFade();
        this.release(this.outgoing);
        this.outgoing = null;
        this.publish("paused");
        this.options.onInterrupted();
      }],
      ["error", () => { if (isCurrent() && audio.error) this.fail(track, audio.error); }],
    ];
    track.listeners.forEach(([name, listener]) => audio.addEventListener(name, listener));
    return track;
  }

  private beginPlay() {
    if (!this.scene || this.disposed) return;
    this.generation += 1;
    const generation = this.generation;
    const track = this.current ?? this.createTrack(this.scene);
    this.current = track;
    if (!track.observer) track.observer = this.options.observe?.(track.audio, track.scene) ?? null;
    if (track.audio.error) track.audio.load();
    if (!this.outgoing) track.audio.volume = this.targetVolume(track.scene);
    this.publish("loading");
    const valid = () => !this.disposed && generation === this.generation && this.current === track && this.requested;
    try {
      void track.audio.play().then(() => {
        if (!valid()) {
          // A pending play can settle after pause, dispose or a new scene. It
          // must never resurrect the old audio, or pause a newer same-track play.
          if (this.disposed || this.current !== track || !this.requested) track.audio.pause();
          return;
        }
        if (!track.audio.paused && track.audio.readyState >= 3) {
          this.publish("playing");
          this.startFade(track);
        }
      }).catch(error => { if (valid()) this.fail(track, error); });
    } catch (error) {
      if (valid()) this.fail(track, error);
    }
  }

  private fail(track: Track, cause: unknown) {
    if (this.disposed || this.current !== track) return;
    this.requested = false;
    this.generation += 1;
    this.cancelFade();
    track.observer?.failed();
    track.observer?.dispose("playback_error");
    track.observer = null;
    track.audio.pause();
    this.release(this.outgoing, "playback_error");
    this.outgoing = null;
    const name = cause && typeof cause === "object" && "name" in cause ? String(cause.name) : "";
    const code = cause && typeof cause === "object" && "code" in cause ? Number(cause.code) : 0;
    const error: AmbientError = name === "NotAllowedError" ? "blocked"
      : code === 2 ? "network" : code === 4 || name === "NotSupportedError" ? "unsupported" : "unknown";
    this.publish("error", error);
    this.options.onInterrupted();
  }

  private startFade(track: Track) {
    if (!this.outgoing || this.fading) return;
    const outgoing = this.outgoing;
    const generation = this.generation;
    const fromVolume = outgoing.audio.volume;
    const startedAt = this.options.now();
    this.fading = true;
    // Close the previous listening segment only once the replacement starts.
    outgoing.observer?.dispose("scene_change");
    outgoing.observer = null;
    const animate: FrameRequestCallback = now => {
      if (this.disposed || generation !== this.generation || this.current !== track || !this.requested) return;
      const progress = Math.max(0, Math.min((now - startedAt) / 600, 1));
      track.audio.volume = this.targetVolume(track.scene) * progress;
      outgoing.audio.volume = fromVolume * (1 - progress);
      if (progress < 1) this.frame = this.options.requestFrame(animate);
      else {
        this.release(outgoing, "scene_change");
        if (this.outgoing === outgoing) this.outgoing = null;
        this.frame = null;
        this.fading = false;
      }
    };
    this.frame = this.options.requestFrame(animate);
  }

  private cancelFade() {
    if (this.frame !== null) this.options.cancelFrame(this.frame);
    this.frame = null;
    this.fading = false;
  }

  private release(track: Track | null, reason = "pause_or_switch") {
    if (!track) return;
    track.listeners.forEach(([name, listener]) => track.audio.removeEventListener(name, listener));
    track.observer?.dispose(reason);
    track.observer = null;
    track.audio.pause();
    track.audio.removeAttribute("src");
    track.audio.load();
  }
}
