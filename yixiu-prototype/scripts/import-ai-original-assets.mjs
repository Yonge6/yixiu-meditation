import { readFile, mkdir, copyFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const delivery = process.argv[2];
if (!delivery) throw new Error("Provide the verified album delivery folder");
const ledger = JSON.parse(await readFile(path.join(root, "docs/audio/ai-originals-20261014.json"), "utf8"));
let playbackLevels;
try { playbackLevels = JSON.parse(await readFile(path.join(root, "docs/audio/ai-original-playback-levels-20261019.json"), "utf8")); }
catch (error) { if (error.code !== "ENOENT") throw error; }
const art = JSON.parse(await readFile(path.join(root, "docs/audio/ai-original-artwork-20261014.json"), "utf8"));
const { default: sharp } = await import(process.env.YIXIU_SHARP_MODULE || "sharp");
const web = path.join(root, "yixiu-prototype/public/assets/yixiu");
const native = path.join(root, "YixiuMeditation/YixiuMeditation");
await mkdir(path.join(web, "original"), { recursive: true });
const layers = [];
let audioBytes = 0, artworkBytes = 0;
for (const [index, track] of ledger.tracks.entries()) {
  const sourceAudio = path.join(delivery, track.sourceFile);
  const audio = await readFile(sourceAudio);
  if (createHash("sha256").update(audio).digest("hex") !== track.audioSha256) throw new Error("Audio hash mismatch: " + track.id);
  const webAudio = path.join(web, "audio/meditation", track.slug + ".m4a");
  const nativeAudio = path.join(native, "Audio/Meditation", track.slug + ".m4a");
  if (playbackLevels) {
    const corrected = playbackLevels.tracks.find(item => item.id === track.id);
    if (!corrected || corrected.originalSha256 !== track.audioSha256) throw new Error("Missing playback calibration: " + track.id);
    for (const file of [webAudio, nativeAudio]) {
      if (createHash("sha256").update(await readFile(file)).digest("hex") !== corrected.playbackSha256) {
        throw new Error("Preserve the calibrated playback copies; restore them before importing artwork: " + track.id);
      }
    }
  } else {
    await copyFile(sourceAudio, webAudio);
    await copyFile(sourceAudio, nativeAudio);
  }
  audioBytes += audio.length;
  const sourceImage = art.find(item => item.slug === track.slug)?.sourceImage;
  if (!sourceImage) throw new Error("Missing original artwork: " + track.id);
  const imageFile = path.join(web, "original", track.slug + ".jpg");
  await sharp(sourceImage).rotate().resize({ width: 1024, height: 1536, fit: "cover" }).jpeg({ quality: 88, mozjpeg: true }).toFile(imageFile);
  await copyFile(imageFile, path.join(native, "Assets.xcassets", track.assetName + ".imageset", track.slug + ".jpg"));
  artworkBytes += (await stat(imageFile)).size;
  layers.push({ input: await sharp(imageFile).resize(200, 300).png().toBuffer(), left: (index % 5) * 200, top: Math.floor(index / 5) * 300 });
}
await sharp({ create: { width: 1000, height: 600, channels: 3, background: "#edf6ed" } }).composite(layers).jpeg({ quality: 92 }).toFile(path.join(root, "docs/audio/ai-originals-contact-sheet-20261014.jpg"));
console.log(JSON.stringify({ tracks: ledger.tracks.length, hashVerified: true, audioBytes, artworkBytes }));

