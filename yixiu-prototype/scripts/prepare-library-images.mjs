import { mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { default: sharp } = await import(process.env.YIXIU_SHARP_MODULE || "sharp");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assets = path.join(root, "public/assets/yixiu");
const source = await readFile(path.join(root, "src/Prototype.tsx"), "utf8");
const paths = new Set([...source.matchAll(/image:\s*"\/assets\/yixiu\/([^"\n]+\.(?:png|jpg|webp))"/g)].map(match => match[1]));
const classicalSource = await readFile(path.join(root, "src/data/classical-music.ts"), "utf8");
const classical = JSON.parse(classicalSource.match(/export const classicalMusic = (\[[\s\S]*\]) as const;/)[1]);
for (const track of classical) paths.add(`classical/${track.art ?? track.slug}.jpg`);
const originalSource = await readFile(path.join(root, "src/data/original-music.ts"), "utf8");
const originals = JSON.parse(originalSource.match(/export const originalMusic = (\[[\s\S]*\]) as const;/)[1]);
for (const track of originals) paths.add(`original/${track.slug}.jpg`);
let before = 0;
let after = 0;
for (const relative of paths) {
  if (relative.includes("..") || path.isAbsolute(relative)) throw new Error("Invalid asset path");
  const input = path.join(assets, relative);
  const output = path.join(assets, "card-thumbs", relative.replace(/\.[^.]+$/, ".webp"));
  const metadata = await sharp(input).metadata();
  if (!metadata.width || !metadata.height) throw new Error(`Unreadable image: ${input}`);
  await mkdir(path.dirname(output), { recursive: true });
  await sharp(input).resize({ width: 480, height: 720, fit: "inside", withoutEnlargement: true }).webp({ quality: 78 }).toFile(output);
  before += (await stat(input)).size;
  after += (await stat(output)).size;
}
for (const width of [96, 192]) {
  await sharp(path.join(assets, "app-icon.png")).resize({ width, withoutEnlargement: true }).webp({ quality: 85 }).toFile(path.join(assets, `app-icon-${width}.webp`));
}
console.log(JSON.stringify({ thumbnails: paths.size, sourceBytes: before, thumbnailBytes: after, reduction: `${(100 * (1 - after / before)).toFixed(1)}%` }));
