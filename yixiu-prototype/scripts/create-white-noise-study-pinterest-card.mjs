import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const projectRoot = resolve(import.meta.dirname, "..");
const input = resolve(projectRoot, "public/assets/yixiu/underwater-echo.webp");
const output = resolve(projectRoot, "../docs/growth/assets/white-noise-studying-pin-01.png");

const overlay = Buffer.from(`
  <svg width="1000" height="1500" viewBox="0 0 1000 1500" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#031b26" stop-opacity="0.92"/>
        <stop offset="0.7" stop-color="#031b26" stop-opacity="0.48"/>
        <stop offset="1" stop-color="#031b26" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#031b26" stop-opacity="0"/>
        <stop offset="1" stop-color="#031b26" stop-opacity="0.78"/>
      </linearGradient>
    </defs>
    <rect width="1000" height="760" fill="url(#top)"/>
    <rect y="1080" width="1000" height="420" fill="url(#bottom)"/>
    <text x="500" y="92" text-anchor="middle" fill="#d8eef2" font-family="Arial, sans-serif" font-size="22" letter-spacing="6">YIXIU · DEEP FOCUS SOUND</text>
    <text x="500" y="222" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="82" letter-spacing="2">WHITE NOISE</text>
    <text x="500" y="318" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="82" letter-spacing="2">FOR STUDYING</text>
    <line x1="350" y1="372" x2="650" y2="372" stroke="#c9e7ec" stroke-width="2"/>
    <text x="500" y="430" text-anchor="middle" fill="#e8f5f7" font-family="Arial, sans-serif" font-size="25" letter-spacing="4">NO MUSIC · NO TALKING</text>
    <rect x="240" y="1190" width="520" height="62" rx="31" fill="#d2f4f4" fill-opacity="0.94"/>
    <text x="500" y="1231" text-anchor="middle" fill="#083342" font-family="Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="2">FREE 15 · 30 · 60 MIN TIMER</text>
    <text x="500" y="1368" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="26" letter-spacing="4">LISTEN FREE WITH YIXIU</text>
    <text x="500" y="1416" text-anchor="middle" fill="#d8eef2" font-family="Arial, sans-serif" font-size="21" letter-spacing="2">yixiu.wonderelian.com</text>
  </svg>
`);

await mkdir(dirname(output), { recursive: true });
await sharp(input)
  .resize(1000, 1500, { fit: "cover", position: "centre" })
  .composite([{ input: overlay, top: 0, left: 0 }])
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(output);

console.log(output);
