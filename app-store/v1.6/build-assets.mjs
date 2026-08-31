import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("/Users/yongyuan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp");

const root = path.resolve("app-store/v1.6");
const canvas = { width: 1290, height: 2796 };
const screen = { left: 118, top: 612, width: 1054, height: 2292, radius: 78 };

const backgrounds = [
  "01-ocean-chatgpt.png",
  "02-still-water-chatgpt.png",
  "03-breathing-chatgpt.png",
  "04-meadow-chatgpt.png",
  "05-personal-water-chatgpt.png",
];

const sourceNames = [
  "01-sounds.png",
  "02-meditation-library.png",
  "03-focus.png",
  "04-bright-plus-scene.png",
  "05-my-yixiu.png",
];

const copy = {
  "en-US": [
    [["Press play.", "Let the day soften."], "Nature soundscapes for sleep, focus, and reading"],
    [["Twenty-four ways", "to pause."], "14 nature sounds + 10 meditation tracks"],
    [["One minute is enough", "to begin."], "Water Breathing in 1, 3, 5, or 10 minute sessions"],
    [["Light, color, and", "room to breathe."], "Long sessions and 88-second resets in one library"],
    [["Keep your own", "rhythm."], "Favorites, timers, background playback, and bilingual controls"],
  ],
  "zh-Hans": [
    [["按下播放，", "让一天慢下来"], "自然声陪你睡前、专注与阅读"],
    [["24 种声音，", "留一刻停驻"], "14 种自然声 + 10 首冥想音乐"],
    [["从一分钟开始，", "就够了"], "1、3、5 或 10 分钟水之呼吸"],
    [["让光与颜色，", "留出呼吸空间"], "长时练习与 88 秒短时停驻"],
    [["保留自己的", "节奏"], "收藏、定时、后台播放与中英切换"],
  ],
};

const esc = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function overlaySvg(locale, index, lines, subtitle) {
  const zh = locale === "zh-Hans";
  const longest = Math.max(...lines.map((line) => line.length));
  const titleSize = zh ? 72 : (longest > 21 ? 60 : 70);
  const brand = zh ? "一休冥想" : "YIXIU · WHITE NOISE & MEDITATION";
  const number = String(index + 1).padStart(2, "0");
  return Buffer.from(`
    <svg width="${canvas.width}" height="${canvas.height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fbfaf5" stop-opacity="0.98"/>
          <stop offset="0.18" stop-color="#fbfaf5" stop-opacity="0.78"/>
          <stop offset="0.31" stop-color="#fbfaf5" stop-opacity="0"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-10%" width="140%" height="140%">
          <feDropShadow dx="0" dy="28" stdDeviation="28" flood-color="#062c35" flood-opacity="0.30"/>
        </filter>
      </defs>
      <rect width="${canvas.width}" height="820" fill="url(#wash)"/>
      <rect x="${screen.left - 10}" y="${screen.top - 10}" width="${screen.width + 20}" height="${screen.height + 20}" rx="${screen.radius + 8}" fill="#062c35" fill-opacity="0.24" stroke="#f4efe1" stroke-width="3" filter="url(#shadow)"/>
      <rect x="${screen.left - 2}" y="${screen.top - 2}" width="${screen.width + 4}" height="${screen.height + 4}" rx="${screen.radius + 2}" fill="none" stroke="#9ecfd0" stroke-opacity="0.55" stroke-width="2"/>
      <text x="94" y="82" font-family="Noto Sans SC, Helvetica Neue, Arial, sans-serif" font-size="21" font-weight="600" letter-spacing="4" fill="#176575">${esc(brand)}</text>
      <text x="1196" y="82" text-anchor="end" font-family="Noto Sans SC, Helvetica Neue, Arial, sans-serif" font-size="21" font-weight="600" letter-spacing="4" fill="#176575">${number}</text>
      <text x="94" y="198" font-family="Noto Serif SC, serif" font-size="${titleSize}" font-weight="560" fill="#073f49">${esc(lines[0])}</text>
      <text x="94" y="292" font-family="Noto Serif SC, serif" font-size="${titleSize}" font-weight="560" fill="#073f49">${esc(lines[1])}</text>
      <line x1="94" y1="356" x2="164" y2="356" stroke="#b4944b" stroke-width="4"/>
      <text x="190" y="368" font-family="Noto Sans SC, Helvetica Neue, Arial, sans-serif" font-size="${zh ? 29 : 26}" font-weight="500" fill="#315f67">${esc(subtitle)}</text>
    </svg>
  `);
}

async function roundedScreenshot(inputPath) {
  const mask = Buffer.from(`<svg width="${screen.width}" height="${screen.height}"><rect width="${screen.width}" height="${screen.height}" rx="${screen.radius}" fill="white"/></svg>`);
  return sharp(inputPath)
    .resize(screen.width, screen.height, { fit: "cover", position: "top" })
    .flatten({ background: "#ffffff" })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function buildOne(locale, index) {
  const outputDir = path.join(root, "screenshots", locale);
  await fs.mkdir(outputDir, { recursive: true });
  const screenshot = await roundedScreenshot(path.join(root, "source", locale, sourceNames[index]));
  await sharp(path.join(root, "backgrounds", backgrounds[index]))
    .resize(canvas.width, canvas.height, { fit: "cover", position: "centre" })
    .modulate({ saturation: 0.90, brightness: 1.04 })
    .composite([
      { input: overlaySvg(locale, index, ...copy[locale][index]), left: 0, top: 0 },
      { input: screenshot, left: screen.left, top: screen.top },
    ])
    .flatten({ background: "#dceceb" })
    .removeAlpha()
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(path.join(outputDir, sourceNames[index]));
}

for (const locale of ["en-US", "zh-Hans"]) {
  for (let index = 0; index < sourceNames.length; index += 1) await buildOne(locale, index);
}

await fs.mkdir(path.join(root, "previews"), { recursive: true });
for (const locale of ["en-US", "zh-Hans"]) {
  const files = sourceNames;
  const width = 330;
  const height = Math.round(width * canvas.height / canvas.width);
  const gutter = 18;
  const images = await Promise.all(files.map(async (file, index) => ({
    input: await sharp(path.join(root, "screenshots", locale, file)).resize(width, height).jpeg({ quality: 88 }).toBuffer(),
    left: gutter + index * (width + gutter),
    top: gutter,
  })));
  await sharp({ create: { width: width * 5 + gutter * 6, height: height + gutter * 2, channels: 3, background: { r: 229, g: 238, b: 235 } } })
    .composite(images)
    .jpeg({ quality: 92 })
    .toFile(path.join(root, "previews", `${locale}-contact-sheet.jpg`));
}
