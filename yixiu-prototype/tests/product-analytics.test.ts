import test from "node:test";
import assert from "node:assert/strict";
import { ListeningClock, observeAudio } from "../src/product-analytics.ts";

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
