import assert from "node:assert/strict";
import test from "node:test";
import { readRestLink, restPresets, matchesRestPurpose } from "../src/rest-presets.ts";

test("campaign links prepare only known free rest presets, never autoplay", () => {
  assert.deepEqual(readRestLink("?rest=lunch&lang=zh"), restPresets.lunch);
  assert.equal(readRestLink("?rest=night_waking")?.scene, "window");
  assert.equal(readRestLink("?rest=work_break")?.focusMinutes, 1);
  assert.equal(readRestLink("?rest=unknown"), null);
  assert.equal(readRestLink("?scene=rain&tab=focus"), null);
  for (const preset of Object.values(restPresets)) {
    assert.equal(preset.timerMinutes, 15);
    assert.ok(["lake", "window", "rain"].includes(preset.scene));
    assert.equal("autoplay" in preset, false);
  }
});

test("purposes intersect with sound types without dropping the catalog", () => {
  assert.equal(matchesRestPurpose("all", "anything", []), true);
  assert.equal(matchesRestPurpose("lunch", "lake", []), true);
  assert.equal(matchesRestPurpose("night_waking", "window", []), true);
  assert.equal(matchesRestPurpose("work_break", "birds", []), true);
  assert.equal(matchesRestPurpose("work_break", "rain", ["rain"]), true);
  assert.equal(matchesRestPurpose("lunch", "thunder", []), false);
  assert.equal(matchesRestPurpose("sleep", "custom", ["custom"]), true);
});
