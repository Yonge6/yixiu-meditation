import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("membership card keeps one semantic dialog button with a full-card target", async () => {
  const source = await readFile(new URL("../src/Prototype.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../src/prototype.css", import.meta.url), "utf8");
  const card = source.match(/<section className="me-card web-membership"[\s\S]*?<\/section>/)?.[0];
  assert.ok(card);
  assert.equal((card.match(/<button\b/g) ?? []).length, 1);
  assert.match(card, /aria-haspopup="dialog" onClick=\{\(\) => setUpgradeOpen\(true\)\}/);
  assert.match(css, /\.web-membership > button::after\s*\{[^}]*position: absolute;[^}]*inset: 0;/);
  assert.match(css, /\.web-membership:has\(> button:focus-visible\)/);
  assert.match(source, /探索健康的工作和生活方式/);
});
