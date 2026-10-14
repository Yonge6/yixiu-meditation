import assert from "node:assert/strict";
import test from "node:test";
import { filterLibrary } from "../src/library.ts";

const items = [
  { id: "rain", searchText: "屋檐雨 Rain on Eaves 睡眠" },
  { id: "moon", searchText: "月光 Clair de Lune Claude Debussy 德彪西" },
  { id: "nocturne", searchText: "降E大调夜曲 Nocturne Frédéric Chopin 肖邦" },
];
const defaults = { scope: "all" as const, query: "", free: new Set(["rain", "moon"]), favorites: ["nocturne"], recent: ["nocturne", "rain"] };

test("free scope and search intersect without including locked tracks", () => {
  assert.deepEqual(filterLibrary(items, { ...defaults, scope: "free" }).map(x => x.id), ["rain", "moon"]);
  assert.deepEqual(filterLibrary(items, { ...defaults, scope: "free", query: "chopin" }), []);
});
test("title and composer search handles Chinese, case, accents and multiple terms", () => {
  assert.deepEqual(filterLibrary(items, { ...defaults, query: "肖邦" }).map(x => x.id), ["nocturne"]);
  assert.deepEqual(filterLibrary(items, { ...defaults, query: "FREDERIC nocturne" }).map(x => x.id), ["nocturne"]);
  assert.deepEqual(filterLibrary(items, { ...defaults, query: "  DEBUSSY  " }).map(x => x.id), ["moon"]);
});
test("recent results preserve recency within a filtered category", () => {
  assert.deepEqual(filterLibrary(items, { ...defaults, scope: "recent" }).map(x => x.id), ["nocturne", "rain"]);
  assert.deepEqual(filterLibrary(items.slice(1), { ...defaults, scope: "recent" }).map(x => x.id), ["nocturne"]);
});
test("favorites and empty states do not fall back to the full catalog", () => {
  assert.deepEqual(filterLibrary(items, { ...defaults, scope: "favorites" }).map(x => x.id), ["nocturne"]);
  assert.deepEqual(filterLibrary(items, { ...defaults, scope: "favorites", favorites: [] }), []);
});
