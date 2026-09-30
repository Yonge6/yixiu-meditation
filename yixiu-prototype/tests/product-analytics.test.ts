import test from "node:test";
import assert from "node:assert/strict";
import { ListeningClock } from "../src/product-analytics.ts";

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
