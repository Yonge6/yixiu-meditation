import assert from "node:assert/strict";
import test from "node:test";
import { PracticeClock, validateJournal, weekSummary, canUseWebFocus, canUseWebTimer } from "../src/practice.ts";

test("clock reconciles delayed ticks, pauses, repeated starts and completion", () => {
  const clock = new PracticeClock();
  clock.reset(60); clock.start(1000); clock.start(2000);
  assert.equal(clock.remaining(31500), 30);
  clock.pause(31500);
  assert.equal(clock.remaining(999999), 30);
  clock.start(1000000);
  assert.equal(clock.remaining(1029500), 0);
  assert.equal(clock.remaining(2000000), 0);
  clock.reset(300); assert.equal(clock.remaining(), 300);
});
test("journal validates, deduplicates, sorts and bounds completed records", () => {
  const now = Date.now();
  const entry = {id:"one",sceneID:"rain",kind:"breathing",seconds:60,completedAt:now};
  assert.equal(validateJournal(null, ["rain"]).length, 0);
  assert.equal(validateJournal([entry, entry, {...entry,id:"bad",seconds:-1}, {...entry,id:"future",completedAt:now+1000}, {...entry,id:"scene",sceneID:"nope"}], ["rain"], now).length, 1);
  assert.equal(validateJournal(Array.from({length:250}, (_,i)=>({...entry,id:String(i),completedAt:now-i})), ["rain"], now).length, 200);
});
test("weekly minutes start Monday and ignore future entries", () => {
  const now = new Date(2026, 8, 11, 12);
  const entry = {id:"one",sceneID:"rain",kind:"breathing" as const,seconds:60,completedAt:new Date(2026,8,7,10).getTime()};
  const summary = weekSummary([entry, {...entry,id:"old",completedAt:new Date(2026,8,6,10).getTime()}, {...entry,id:"future",completedAt:now.getTime()+1000}], now);
  assert.equal(summary.minutes, 1); assert.equal(summary.days[0].getDay(), 1);
  assert.deepEqual(summary.practiced, [true,false,false,false,false,false,false]);
});
test("web free gates match native Free, not unverifiable Plus or legacy", () => {
  assert.deepEqual([1,3,5,10].filter(canUseWebFocus), [1]);
  assert.deepEqual([5,15,30,60,0].filter(canUseWebTimer), [5,15,30]);
});
