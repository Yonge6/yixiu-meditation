import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
const root = new URL("../", import.meta.url);

test("every public HTML page receives exactly one banner except the handoff", async () => {
  let checked = 0;
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.name === "assets") continue;
      const file = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory);
      if (entry.isDirectory()) await walk(file);
      else if (entry.name.endsWith(".html")) {
        const html = await readFile(file, "utf8");
        if (!html.includes("</head>")) continue;
        const expected = entry.name === "download.html" ? 0 : 1;
        assert.equal((html.match(/src="\/app-banner.js\?/g) ?? []).length, expected, file.pathname);
        checked++;
      }
    }
  }
  await walk(new URL("public/", root));
  assert.ok(checked >= 60);
  const index = await readFile(new URL("index.html", root), "utf8");
  assert.equal((index.match(/src="\/app-banner.js\?/g) ?? []).length, 1);
});

test("banner preserves the region-neutral attributed destination and session-only dismissal", async () => {
  const source = await readFile(new URL("public/app-banner.js", root), "utf8");
  assert.match(source, /https:\/\/apps\.apple\.com\/app\/id1461182261\?ppid=/);
  assert.match(source, /sessionStorage\.setItem\(key, "1"\)/);
  assert.doesNotMatch(source, /localStorage|target="_blank"/);
  assert.match(source, /new URL\("\/download\.html", location\.origin\)/);
  assert.match(source, /target: store/);
  assert.match(source, /attributeFilter: \["data-language"\]/);
  assert.match(source, /resize\.disconnect\(\)/);
  const handoff = await readFile(new URL("public/download.js", root), "utf8");
  assert.match(handoff, /window\.location\.replace\(storeUrl\)/);
  assert.match(handoff, /candidate\.hostname !== "apps.apple.com"/);
});
