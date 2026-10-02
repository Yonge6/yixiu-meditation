import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tags = '<link rel="stylesheet" href="/app-banner.css?v=20261001"><script src="/app-banner.js?v=20261001" defer></script>';
async function inject(file) {
  const source = await readFile(file, "utf8");
  if (!source.includes("</head>") || source.includes('/app-banner.js?')) return;
  await writeFile(file, source.replace("</head>", `${tags}\n</head>`));
}
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory() && entry.name !== "assets") await walk(file);
    else if (entry.isFile() && entry.name.endsWith(".html") && entry.name !== "download.html") await inject(file);
  }
}
await inject(path.join(root, "index.html"));
await walk(path.join(root, "public"));
console.log("Prepared shared Yixiu download banner on public pages (excluding download handoff).");
