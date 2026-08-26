import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const projectRoot = resolve(import.meta.dirname, "..");
const input = resolve(projectRoot, "public/assets/yixiu/forest-falls.webp");
const output = resolve(projectRoot, "../docs/growth/assets/waterfall-noise-masking-pin-01.png");

const overlay = Buffer.from(`
  <svg width="1000" height="1500" viewBox="0 0 1000 1500" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#071a1a" stop-opacity="0.86"/>
        <stop offset="0.66" stop-color="#071a1a" stop-opacity="0.42"/>
        <stop offset="1" stop-color="#071a1a" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#071a1a" stop-opacity="0"/>
        <stop offset="1" stop-color="#071a1a" stop-opacity="0.64"/>
      </linearGradient>
    </defs>
    <rect width="1000" height="650" fill="url(#top)"/>
    <rect y="1160" width="1000" height="340" fill="url(#bottom)"/>
    <text x="500" y="96" text-anchor="middle" fill="#d9ebe6" font-family="Arial, sans-serif" font-size="22" letter-spacing="5">YIXIU · REAL NATURE RECORDING</text>
    <text x="500" y="210" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="68" letter-spacing="2">WATERFALL SOUNDS</text>
    <text x="500" y="292" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="68" letter-spacing="2">FOR NOISE MASKING</text>
    <line x1="370" y1="344" x2="630" y2="344" stroke="#c7ded7" stroke-width="2"/>
    <text x="500" y="400" text-anchor="middle" fill="#e8f2ef" font-family="Arial, sans-serif" font-size="24" letter-spacing="4">NO MUSIC · NO TALKING</text>
    <text x="500" y="1374" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="26" letter-spacing="4">LISTEN FREE WITH YIXIU</text>
    <text x="500" y="1420" text-anchor="middle" fill="#d9ebe6" font-family="Arial, sans-serif" font-size="20" letter-spacing="2">yixiu.wonderelian.com</text>
  </svg>
`);

await mkdir(dirname(output), { recursive: true });
await sharp(input)
  .resize(1000, 1500, { fit: "cover", position: "centre" })
  .composite([{ input: overlay, top: 0, left: 0 }])
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(output);

console.log(output);
