import assert from "node:assert/strict";
import test from "node:test";
import { AmbientAudioController, type AmbientScene, type AmbientState } from "../src/ambient-audio.ts";

type PendingPlay = { resolve(): void; reject(error: unknown): void };
class MockAudio extends EventTarget {
  src: string;
  loop = false;
  preload = "";
  playbackRate = 1;
  volume = 1;
  currentTime = 0;
  readyState = 0;
  paused = true;
  error: { code: number } | null = null;
  playCalls = 0;
  pauseCalls = 0;
  loadCalls = 0;
  pending: PendingPlay[] = [];
  constructor(source: string) { super(); this.src = source; }
  play() {
    this.playCalls += 1;
    return new Promise<void>((resolve, reject) => this.pending.push({ resolve, reject }));
  }
  succeed(index = this.pending.length - 1) {
    this.paused = false;
    this.readyState = 4;
    this.dispatchEvent(new Event("playing"));
    this.pending[index].resolve();
  }
  pause() {
    this.pauseCalls += 1;
    const wasPlaying = !this.paused;
    this.paused = true;
    if (wasPlaying) this.dispatchEvent(new Event("pause"));
  }
  load() { this.loadCalls += 1; this.currentTime = 0; this.readyState = 0; this.error = null; }
  removeAttribute(attribute: string) { if (attribute === "src") this.src = ""; }
}

const rain: AmbientScene = { id: "rain", audio: "/rain.m4a", level: 0.08, category: "nature", free: true };
const piano: AmbientScene = { ...rain, id: "piano", audio: "/piano.m4a", category: "classical" };
const third: AmbientScene = { ...rain, id: "third", audio: "/third.m4a" };
const flush = () => new Promise<void>(resolve => queueMicrotask(resolve));

function harness() {
  const audios: MockAudio[] = [];
  const states: AmbientState[] = [];
  const ended: string[] = [];
  let interrupted = 0;
  let failures = 0;
  let now = 0;
  let frameId = 0;
  const frames = new Map<number, FrameRequestCallback>();
  const controller = new AmbientAudioController({
    createAudio: source => {
      const audio = new MockAudio(source);
      audios.push(audio);
      return audio as unknown as HTMLAudioElement;
    },
    observe: (_audio, scene) => ({ failed: () => { failures += 1; }, dispose: reason => { ended.push(`${scene.id}:${reason}`); } }),
    onState: state => states.push(state),
    onInterrupted: () => { interrupted += 1; },
    now: () => now,
    requestFrame: callback => { frames.set(++frameId, callback); return frameId; },
    cancelFrame: id => { frames.delete(id); },
  });
  return {
    controller, audios, states, ended,
    get status() { return states.at(-1)?.status ?? "idle"; },
    get interrupted() { return interrupted; },
    get failures() { return failures; },
    step(time: number) {
      now = time;
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach(callback => callback(time));
    },
    get pendingFrames() { return frames.size; },
  };
}

test("reports loading until real audio starts, buffering stops the playing state", async () => {
  const h = harness();
  h.controller.update(rain, true);
  assert.equal(h.status, "loading");
  const audio = h.audios[0];
  audio.succeed(); await flush();
  assert.equal(h.status, "playing");
  audio.readyState = 2;
  audio.dispatchEvent(new Event("waiting"));
  assert.equal(h.status, "loading");
  audio.readyState = 4;
  audio.dispatchEvent(new Event("playing"));
  assert.equal(h.status, "playing");
  audio.dispatchEvent(new Event("stalled"));
  assert.equal(h.status, "playing", "network stalled with enough buffered audio does not pause the timer");
  h.controller.dispose();
});

test("pause and resume preserve the element, source and exact music position", async () => {
  const h = harness();
  h.controller.update(piano, true);
  const audio = h.audios[0];
  audio.succeed(); await flush();
  audio.currentTime = 83.4;
  h.controller.update(piano, false);
  assert.equal(h.status, "paused");
  assert.equal(audio.src, piano.audio);
  assert.equal(audio.currentTime, 83.4);
  assert.equal(audio.loadCalls, 0);
  h.controller.update(piano, true);
  assert.equal(h.audios.length, 1);
  assert.equal(audio.playCalls, 2);
  assert.equal(audio.currentTime, 83.4);
  audio.succeed(); await flush();
  assert.equal(h.status, "playing");
  assert.equal(h.interrupted, 0);
  h.controller.dispose();
});

test("rejected play exposes an error, interrupts intent, and a retry can succeed", async () => {
  const h = harness();
  h.controller.update(rain, true);
  const audio = h.audios[0];
  audio.pending[0].reject(new DOMException("Tap to start", "NotAllowedError"));
  await flush(); await flush();
  assert.deepEqual(h.states.at(-1), { status: "error", error: "blocked" });
  assert.equal(h.interrupted, 1);
  assert.equal(h.failures, 1);
  assert.equal(audio.paused, true);
  h.controller.update(rain, false);
  assert.equal(h.status, "error", "React syncing the interrupted intent must not hide the error");
  h.controller.retry();
  assert.equal(h.status, "loading");
  audio.succeed(); await flush();
  assert.equal(h.status, "playing");
  h.controller.dispose();
});

test("native pause and media error synchronize the visible state", async () => {
  const h = harness();
  h.controller.update(rain, true);
  const audio = h.audios[0];
  audio.succeed(); await flush();
  audio.pause();
  assert.equal(h.status, "paused");
  assert.equal(h.interrupted, 1);
  h.controller.update(rain, true); audio.succeed(); await flush();
  audio.error = { code: 2 };
  audio.dispatchEvent(new Event("error"));
  assert.deepEqual(h.states.at(-1), { status: "error", error: "network" });
  assert.equal(h.interrupted, 2);
  assert.equal(audio.paused, true);
  h.controller.dispose();
});

test("scene change keeps the old audio until the new one plays, then crossfades and releases it", async () => {
  const h = harness();
  h.controller.update(rain, true);
  const oldAudio = h.audios[0];
  oldAudio.succeed(); await flush();
  const oldVolume = oldAudio.volume;
  h.controller.update(piano, true);
  const newAudio = h.audios[1];
  assert.equal(oldAudio.paused, false);
  assert.equal(newAudio.volume, 0);
  assert.equal(h.status, "loading");
  newAudio.succeed(); await flush();
  h.step(300);
  assert.ok(Math.abs(newAudio.volume - oldVolume / 2) < 0.001);
  assert.ok(Math.abs(oldAudio.volume - oldVolume / 2) < 0.001);
  h.controller.setVolume(50, 0.5);
  h.step(600);
  assert.equal(newAudio.volume, 0.22);
  assert.equal(oldAudio.paused, true);
  assert.equal(oldAudio.src, "");
  assert.deepEqual(h.ended, ["rain:scene_change"]);
  h.controller.dispose();
});

test("late successful play after pause cannot restart the old request", async () => {
  const h = harness();
  h.controller.update(rain, true);
  const audio = h.audios[0];
  h.controller.update(rain, false);
  audio.succeed(0); await flush();
  assert.equal(audio.paused, true);
  assert.equal(h.status, "paused");
  assert.equal(h.interrupted, 0);
  h.controller.dispose();
});

test("late same-track rejection must not cancel a newer resumed play", async () => {
  const h = harness();
  h.controller.update(rain, true);
  const audio = h.audios[0];
  h.controller.update(rain, false);
  h.controller.update(rain, true);
  audio.succeed(1); await flush();
  audio.pending[0].reject(new DOMException("Old request cancelled", "AbortError"));
  await flush(); await flush();
  assert.equal(h.status, "playing");
  assert.equal(audio.paused, false);
  assert.equal(h.failures, 0);
  h.controller.dispose();
});

test("queued pause or buffering from an earlier request cannot interrupt resumed playback", async () => {
  const h = harness();
  h.controller.update(piano, true);
  const audio = h.audios[0];
  audio.succeed(); await flush();
  h.controller.update(piano, false);
  h.controller.update(piano, true); audio.succeed(); await flush();
  audio.dispatchEvent(new Event("pause"));
  audio.dispatchEvent(new Event("waiting"));
  assert.equal(h.status, "playing");
  assert.equal(h.interrupted, 0);
  h.controller.dispose();
});

test("rapid switches dispose pending tracks and late promises cannot revive them", async () => {
  const h = harness();
  h.controller.update(rain, true);
  h.audios[0].succeed(); await flush();
  h.controller.update(piano, true);
  h.controller.update(third, true);
  assert.equal(h.audios[0].src, "");
  assert.equal(h.audios[1].src, "");
  h.audios[2].succeed(); await flush();
  h.audios[1].succeed(); await flush();
  assert.equal(h.audios[1].paused, true);
  assert.equal(h.audios[2].paused, false);
  assert.equal(h.status, "playing");
  h.controller.dispose();
});

test("pause cancels a pending crossfade without losing the new track position", async () => {
  const h = harness();
  h.controller.update(rain, true); h.audios[0].succeed(); await flush();
  h.controller.update(piano, true); h.audios[1].succeed(); await flush();
  h.step(200);
  h.audios[1].currentTime = 2;
  h.controller.update(piano, false);
  assert.equal(h.pendingFrames, 0);
  assert.equal(h.audios[0].src, "");
  assert.equal(h.audios[1].src, piano.audio);
  assert.equal(h.audios[1].currentTime, 2);
  h.controller.update(piano, true); h.audios[1].succeed(); await flush();
  assert.ok(Math.abs(h.audios[1].volume - 0.6336) < 0.001);
  h.controller.dispose();
});

test("dispose removes listeners, cancels frames and quiesces a late promise", async () => {
  const h = harness();
  h.controller.update(rain, true);
  const audio = h.audios[0];
  h.controller.dispose();
  const stateCount = h.states.length;
  audio.succeed(); await flush();
  audio.dispatchEvent(new Event("error"));
  assert.equal(audio.paused, true);
  assert.equal(audio.src, "");
  assert.equal(h.states.length, stateCount);
  assert.equal(h.pendingFrames, 0);
  assert.equal(h.failures, 0);
  assert.equal(h.interrupted, 0);
});
