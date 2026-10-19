import test from "node:test";
import assert from "node:assert/strict";
import { ListeningClock, observeAudio, beginRestSession, setRestContext, completeBreathingRest, setAnalyticsConsent, productEvent } from "../src/product-analytics.ts";

function withPlayer(run: (h: {
  audio: HTMLAudioElement;
  events: { event: string; [key: string]: unknown }[];
  advance: (seconds: number, mediaSeconds?: number) => void;
  signal: (name: string) => void;
}) => void, consent = "granted") {
  const names = ["window", "document", "localStorage", "performance"] as const;
  const originals = names.map(name => Object.getOwnPropertyDescriptor(globalThis, name));
  const events: { event: string; [key: string]: unknown }[] = [];
  let now = 0, storedConsent = consent, sample: (() => void) | undefined;
  const windowStub = Object.assign(new EventTarget(), { setInterval: (callback: () => void) => { sample = callback; return 1; }, clearInterval: () => { sample = undefined; } });
  const audio = Object.assign(new EventTarget(), { currentTime: 0, playbackRate: 1, duration: 600, error: null }) as unknown as HTMLAudioElement;
  const stubs = [windowStub, Object.assign(new EventTarget(), { visibilityState: "visible" }), { getItem: () => storedConsent, setItem: (_key: string, value: string) => { storedConsent = value; } }, { now: () => now }];
  names.forEach((name, i) => Object.defineProperty(globalThis, name, { value: stubs[i], writable: true, configurable: true }));
  windowStub.addEventListener("yixiu:analytics", event => events.push((event as CustomEvent).detail));
  try {
    beginRestSession({ rest_intent: "none", entry_point: "direct" });
    run({ audio, events, advance(seconds, mediaSeconds = seconds) { now += seconds * 1000; audio.currentTime += mediaSeconds; sample?.(); }, signal: name => audio.dispatchEvent(new Event(name)) });
  } finally {
    names.forEach((name, i) => { if (originals[i]) Object.defineProperty(globalThis, name, originals[i]!); else Reflect.deleteProperty(globalThis, name); });
  }
}

test("counts actual progress and excludes buffering", () => {
  const c = new ListeningClock();
  assert.equal(c.sample(0, 0), 0);
  assert.equal(c.sample(5, 5000), 5);
  assert.equal(c.sample(5, 10000), 0);
  c.reset();
  assert.equal(c.sample(5, 20000), 0);
  assert.equal(c.sample(7, 22000), 2);
});
test("rate corrected listening, loops and seeking", () => {
  const c = new ListeningClock();
  c.sample(8, 0, 0.5, 10);
  assert.equal(c.sample(1, 6000, 0.5, 10), 6);
  assert.equal(c.sample(9, 7000, 0.5, 10), 0);
  assert.equal(c.sample(9, 8000, 0.5, 10), 0);
});

test("intentional cancellation does not become a late playback failure", () => {
  const original = [globalThis.window, globalThis.document, globalThis.localStorage];
  const windowStub = Object.assign(new EventTarget(), {setInterval:()=>1,clearInterval:()=>{}});
  Object.assign(globalThis, {window:windowStub,document:new EventTarget(),localStorage:{getItem:()=>"granted"}});
  try {
    const events: string[]=[];
    windowStub.addEventListener("yixiu:analytics", (event: Event) => events.push((event as CustomEvent).detail.event));
    const audio=Object.assign(new EventTarget(),{currentTime:0,playbackRate:1,duration:20,error:null});
    const observer=observeAudio(audio as unknown as HTMLAudioElement,"rain","nature",true);
    observer.dispose(); observer.failed(); observer.dispose();
    assert.deepEqual(events,["yixiu_v2_playback_request"]);
  } finally {
    Object.assign(globalThis,{window:original[0],document:original[1],localStorage:original[2]});
  }
});

test("no consent means no playback, rest, or UI event is emitted", () => withPlayer(h => {
  const observer = observeAudio(h.audio, "rain", "nature", true);
  h.signal("playing"); h.advance(60);
  productEvent("favorite", { scene_id: "rain", action: "add" });
  completeBreathingRest({ focus_minutes: 1 });
  observer.dispose();
  assert.deepEqual(h.events, []);
}, "denied"));

test("60 actual seconds qualifies once, even when breathing also completes", () => withPlayer(h => {
  beginRestSession({ rest_intent: "lunch", entry_point: "focus_quick" });
  const observer = observeAudio(h.audio, "rain", "nature", true);
  h.signal("playing"); h.advance(30); h.advance(30);
  completeBreathingRest({ focus_minutes: 1 }); h.advance(30);
  const rests = h.events.filter(event => event.event === "yixiu_v2_meaningful_rest");
  assert.equal(rests.length, 1);
  assert.deepEqual(rests[0], { event: "yixiu_v2_meaningful_rest", schema_version: 2, rest_intent: "lunch", entry_point: "focus_quick", qualification_method: "audio_60s" });
  assert.equal(h.events.filter(event => event.event === "yixiu_v2_qualified_listen").length, 1);
  assert.ok(h.events.every(event => !Object.keys(event).some(key => /session_id|user_id|journal/.test(key))));
  observer.dispose();
}));

test("completed breathing qualifies without audio and is not duplicated by later audio", () => withPlayer(h => {
  beginRestSession({ rest_intent: "work_break", entry_point: "focus_breathing" });
  completeBreathingRest({ focus_minutes: 0 }); completeBreathingRest({ focus_minutes: NaN });
  assert.equal(h.events.length, 0);
  completeBreathingRest({ focus_minutes: 1 }); completeBreathingRest({ focus_minutes: 1 });
  const observer = observeAudio(h.audio, "rain", "nature", true);
  h.signal("playing"); h.advance(60);
  const rests = h.events.filter(event => event.event === "yixiu_v2_meaningful_rest");
  assert.equal(rests.length, 1);
  assert.equal(rests[0].qualification_method, "breathing_complete");
  assert.equal(rests[0].focus_minutes, 1);
  observer.dispose();
}));

test("seeks and stalled time cannot turn a short listen into a meaningful rest", () => withPlayer(h => {
  const observer = observeAudio(h.audio, "rain", "nature", true);
  h.signal("playing"); h.advance(20);
  h.signal("seeking"); h.audio.currentTime = 200; h.signal("seeked");
  h.advance(20); h.signal("waiting"); h.advance(120, 0); h.signal("playing");
  h.advance(19);
  assert.equal(h.events.filter(event => event.event === "yixiu_v2_meaningful_rest").length, 0);
  h.advance(1);
  assert.equal(h.events.filter(event => event.event === "yixiu_v2_meaningful_rest").length, 1);
  observer.dispose();
}));

test("explicit rest starts update an already-playing observer without restarting media", () => withPlayer(h => {
  beginRestSession({ rest_intent: "lunch", entry_point: "focus_quick" });
  const observer = observeAudio(h.audio, "rain", "nature", true);
  h.signal("playing"); h.advance(30);
  setRestContext({ rest_intent: "night_waking", entry_point: "scene_link" });
  h.advance(5);
  assert.equal(h.events.find(event => event.event === "yixiu_v2_playback_start")?.rest_intent, "lunch");
  beginRestSession({ rest_intent: "work_break", entry_point: "focus_quick" });
  h.advance(30);
  assert.equal(h.events.filter(event => event.event === "yixiu_v2_meaningful_rest").length, 0);
  h.advance(30);
  const rests = h.events.filter(event => event.event === "yixiu_v2_meaningful_rest");
  assert.equal(rests.length, 1); assert.equal(rests[0].rest_intent, "work_break");
  assert.equal(h.events.filter(event => event.event === "yixiu_v2_playback_start").length, 1);
  assert.equal(h.events.filter(event => event.event === "yixiu_v2_listen_time").at(-1)?.rest_intent, "work_break");
  observer.dispose();
}));

test("withdrawal clears accumulated qualification before a later opt-in", () => withPlayer(h => {
  const observer = observeAudio(h.audio, "rain", "nature", true);
  h.signal("playing"); h.advance(50);
  setAnalyticsConsent(false); const eventCount = h.events.length;
  h.advance(60); completeBreathingRest({ focus_minutes: 1 });
  assert.equal(h.events.length, eventCount);
  setAnalyticsConsent(true); h.advance(10);
  assert.equal(h.events.filter(event => event.event === "yixiu_v2_meaningful_rest").length, 0);
  h.advance(50);
  assert.equal(h.events.filter(event => event.event === "yixiu_v2_meaningful_rest").length, 1);
  observer.dispose();
}));
