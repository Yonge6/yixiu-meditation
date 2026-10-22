import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { originalMusic } from "../src/data/original-music.ts";

const root = new URL("../../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root));
const ledger = JSON.parse(read("docs/audio/ai-originals-20261014.json").toString());
const levels = JSON.parse(read("docs/audio/ai-original-playback-levels-20261019.json").toString());

test("ten formal AI originals preserve audio identity across H5 and App", () => {
  assert.equal(originalMusic.length, 10);
  assert.equal(new Set(originalMusic.map(track => track.id)).size, 10);
  const hashes = new Set<string>();
  for (const track of originalMusic) {
    const source = ledger.tracks.find((item: { id: string }) => item.id === track.id);
    assert.ok(source);
    const web = read(`yixiu-prototype/public/assets/yixiu/audio/meditation/${track.slug}.m4a`);
    const native = read(`YixiuMeditation/YixiuMeditation/Audio/Meditation/${track.slug}.m4a`);
    assert.deepEqual(web, native, track.id + " must use the exact verified recording");
    const hash = createHash("sha256").update(web).digest("hex");
    const processed = levels.tracks.find((item: { id: string }) => item.id === track.id);
    assert.equal(processed.originalSha256, source.audioSha256, "Original delivery identity must remain preserved");
    assert.equal(hash, processed.playbackSha256);
    assert.ok(processed.gainDB > 0 && processed.gainDB <= 6);
    assert.ok(Math.abs(processed.afterLUFS + 18) <= 0.2);
    assert.ok(processed.afterTruePeakDBTP <= -1.5);
    assert.ok(Math.abs(processed.afterRangeLU - processed.beforeRangeLU) <= 0.5, "Linear gain must preserve musical dynamics");
    hashes.add(hash);
    assert.ok(existsSync(new URL(`yixiu-prototype/public/assets/yixiu/original/${track.slug}.jpg`, root)));
    assert.ok(existsSync(new URL(`yixiu-prototype/public/assets/yixiu/card-thumbs/original/${track.slug}.webp`, root)));
    const asset = JSON.parse(read(`YixiuMeditation/YixiuMeditation/Assets.xcassets/${source.assetName}.imageset/Contents.json`).toString());
    const nativeImage = read(`YixiuMeditation/YixiuMeditation/Assets.xcassets/${source.assetName}.imageset/${asset.images[0].filename}`);
    assert.deepEqual(nativeImage, read(`yixiu-prototype/public/assets/yixiu/original/${track.slug}.jpg`));
  }
  assert.equal(hashes.size, 10, "no duplicate recording may replace an original");
});

test("AI originals use the approved five free and five member tracks", () => {
  assert.deepEqual(originalMusic.filter(track => track.free).map(track => track.zh), ["月泊", "雨灯", "蓝眠", "雪絮", "暖枕"]);
  assert.deepEqual(originalMusic.filter(track => !track.free).map(track => track.zh), ["云被", "竹息", "一叶", "松影", "归静"]);
  assert.ok(Math.abs(originalMusic.reduce((sum, track) => sum + track.seconds, 0) - 1728.312) < 0.01);
  for (const track of originalMusic) {
    assert.equal(track.free, ledger.tracks.find((item: { id: string }) => item.id === track.id).free);
    assert.ok(track.seconds > 160 && track.seconds < 181);
  }
});
