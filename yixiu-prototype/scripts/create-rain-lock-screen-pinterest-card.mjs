import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const projectRoot = resolve(import.meta.dirname, "..");
const input = resolve(projectRoot, "public/assets/yixiu/window-rain.webp");
const output = resolve(projectRoot, "../docs/growth/assets/rain-lock-screen-pin-01.png");

const overlay = Buffer.from(`
  <svg width="1000" height="1500" viewBox="0 0 1000 1500" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#001923" stop-opacity="0.96"/>
        <stop offset="0.52" stop-color="#001923" stop-opacity="0.68"/>
        <stop offset="1" stop-color="#001923" stop-opacity="0.94"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#001016" flood-opacity="0.58"/>
      </filter>
    </defs>
    <rect width="1000" height="1500" fill="url(#shade)"/>

    <text x="500" y="88" text-anchor="middle" fill="#9fe9ea" font-family="Arial, sans-serif" font-size="21" font-weight="700" letter-spacing="5">YIXIU · IPHONE BACKGROUND AUDIO</text>

    <g filter="url(#shadow)">
      <text x="500" y="224" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="74" font-weight="700">RAIN STOPS WHEN</text>
      <text x="500" y="316" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="74" font-weight="700">YOUR IPHONE</text>
      <text x="500" y="408" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="74" font-weight="700">LOCKS?</text>
    </g>
    <text x="500" y="475" text-anchor="middle" fill="#b9f2f0" font-family="Arial, sans-serif" font-size="27" font-weight="700" letter-spacing="4">CHECK THIS SETTING</text>

    <g transform="translate(410 555)" stroke="#b9f2f0" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <rect x="0" y="58" width="180" height="150" rx="30" fill="#052c36" fill-opacity="0.72"/>
      <path d="M42 62V42C42 -14 138 -14 138 42V62"/>
      <circle cx="90" cy="132" r="13" fill="#b9f2f0" stroke="none"/>
      <path d="M90 145V173"/>
    </g>

    <rect x="92" y="840" width="816" height="360" rx="42" fill="#032731" fill-opacity="0.91" stroke="#73cfd2" stroke-opacity="0.54" stroke-width="2"/>
    <text x="500" y="915" text-anchor="middle" fill="#8fdfe1" font-family="Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="4">APPLE BACKGROUND SOUNDS</text>
    <text x="500" y="982" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="29" font-weight="700">Settings → Accessibility → Audio &amp; Visual</text>
    <text x="500" y="1032" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="29" font-weight="700">→ Background Sounds</text>
    <line x1="220" y1="1077" x2="780" y2="1077" stroke="#73cfd2" stroke-opacity="0.42" stroke-width="2"/>
    <text x="500" y="1135" text-anchor="middle" fill="#d9f7f6" font-family="Arial, sans-serif" font-size="27">Turn off “Stop Sounds When Locked”</text>

    <rect x="160" y="1270" width="680" height="72" rx="36" fill="#b9f2f0"/>
    <text x="500" y="1316" text-anchor="middle" fill="#052b35" font-family="Arial, sans-serif" font-size="23" font-weight="700" letter-spacing="2">STEP-BY-STEP GUIDE + FREE RAIN PREVIEW</text>
    <text x="500" y="1411" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="4">YIXIU.WONDERELIAN.COM</text>
    <text x="500" y="1453" text-anchor="middle" fill="#9ddadc" font-family="Arial, sans-serif" font-size="18" letter-spacing="2">NO ACCOUNT · NO ADS</text>
  </svg>
`);

await mkdir(dirname(output), { recursive: true });
await sharp(input)
  .resize(1000, 1500, { fit: "cover", position: "centre" })
  .composite([{ input: overlay, top: 0, left: 0 }])
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(output);

console.log(output);
