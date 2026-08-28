import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const projectRoot = resolve(import.meta.dirname, "..");
const input = resolve(projectRoot, "public/assets/yixiu/underwater-echo.webp");
const output = resolve(projectRoot, "../docs/growth/assets/white-noise-studying-instagram-01.png");

const overlay = Buffer.from(`
  <svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#031b26" stop-opacity="0.94"/>
        <stop offset="0.72" stop-color="#031b26" stop-opacity="0.48"/>
        <stop offset="1" stop-color="#031b26" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#031b26" stop-opacity="0"/>
        <stop offset="1" stop-color="#031b26" stop-opacity="0.82"/>
      </linearGradient>
    </defs>
    <rect width="1080" height="650" fill="url(#top)"/>
    <rect y="880" width="1080" height="470" fill="url(#bottom)"/>
    <text x="540" y="80" text-anchor="middle" fill="#d8eef2" font-family="Arial, sans-serif" font-size="22" letter-spacing="6">YIXIU · DEEP FOCUS SOUND</text>
    <text x="540" y="190" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="76" letter-spacing="2">WHITE NOISE</text>
    <text x="540" y="280" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="76" letter-spacing="2">FOR STUDYING</text>
    <line x1="380" y1="332" x2="700" y2="332" stroke="#c9e7ec" stroke-width="2"/>
    <text x="540" y="390" text-anchor="middle" fill="#e8f5f7" font-family="Arial, sans-serif" font-size="25" letter-spacing="4">NO MUSIC · NO TALKING</text>
    <rect x="250" y="1010" width="580" height="68" rx="34" fill="#d2f4f4" fill-opacity="0.95"/>
    <text x="540" y="1055" text-anchor="middle" fill="#083342" font-family="Arial, sans-serif" font-size="25" font-weight="700" letter-spacing="2">FREE 15 · 30 · 60 MIN TIMER</text>
    <text x="540" y="1190" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="27" letter-spacing="4">LISTEN FREE WITH YIXIU</text>
    <text x="540" y="1240" text-anchor="middle" fill="#d8eef2" font-family="Arial, sans-serif" font-size="22" letter-spacing="2">yixiu.wonderelian.com</text>
  </svg>
`);

await mkdir(dirname(output), { recursive: true });
await sharp(input)
  .resize(1080, 1350, { fit: "cover", position: "centre" })
  .composite([{ input: overlay, top: 0, left: 0 }])
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(output);

console.log(output);
