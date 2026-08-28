import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const projectRoot = resolve(import.meta.dirname, "..");
const input = resolve(projectRoot, "public/assets/yixiu/sunny-valley.webp");
const output = resolve(projectRoot, "../docs/growth/assets/forest-sounds-for-sleep-pin-01.png");

const overlay = Buffer.from(`
  <svg width="1000" height="1500" viewBox="0 0 1000 1500" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#071a13" stop-opacity="0.92"/>
        <stop offset="0.72" stop-color="#071a13" stop-opacity="0.48"/>
        <stop offset="1" stop-color="#071a13" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#071a13" stop-opacity="0"/>
        <stop offset="1" stop-color="#071a13" stop-opacity="0.82"/>
      </linearGradient>
    </defs>
    <rect width="1000" height="770" fill="url(#top)"/>
    <rect y="1060" width="1000" height="440" fill="url(#bottom)"/>
    <text x="500" y="92" text-anchor="middle" fill="#dcebd9" font-family="Arial, sans-serif" font-size="22" letter-spacing="5">YIXIU · REAL FOREST RECORDING</text>
    <text x="500" y="222" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="76" letter-spacing="2">FOREST SOUNDS</text>
    <text x="500" y="312" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="76" letter-spacing="2">FOR SLEEP</text>
    <line x1="350" y1="366" x2="650" y2="366" stroke="#d2e3ce" stroke-width="2"/>
    <text x="500" y="424" text-anchor="middle" fill="#eff7ec" font-family="Arial, sans-serif" font-size="24" letter-spacing="3">WIND · DISTANT BIRDS · NO MUSIC</text>
    <rect x="225" y="1182" width="550" height="66" rx="33" fill="#e1f1dc" fill-opacity="0.96"/>
    <text x="500" y="1225" text-anchor="middle" fill="#123522" font-family="Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="2">FREE 15 · 30 · 60 MIN TIMER</text>
    <text x="500" y="1368" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="26" letter-spacing="4">LISTEN FREE WITH YIXIU</text>
    <text x="500" y="1416" text-anchor="middle" fill="#dcebd9" font-family="Arial, sans-serif" font-size="21" letter-spacing="2">yixiu.wonderelian.com</text>
  </svg>
`);

await mkdir(dirname(output), { recursive: true });
await sharp(input)
  .resize(1000, 1500, { fit: "cover", position: "centre" })
  .composite([{ input: overlay, top: 0, left: 0 }])
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(output);

console.log(output);
