import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve(process.argv[2] ?? "dist-gh");
const requestedBase = process.argv[3] ?? "/yixiu-meditation/";
const base = `/${requestedBase.split("/").filter(Boolean).join("/")}/`;
const assetPrefix = `${base}assets/`;

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectFiles(entryPath));
    } else if (/\.(?:html|css|js)$/.test(entry.name)) {
      files.push(entryPath);
    }
  }

  return files;
}

for (const filePath of await collectFiles(outputDirectory)) {
  const source = await readFile(filePath, "utf8");
  const rewritten = source
    .replace(/(["'`])\/assets\//g, `$1${assetPrefix}`)
    .replace(
      "<title>Mobile Prototype Boilerplate</title>",
      "<title>一休冥想 EverEasy</title>",
    );

  if (rewritten !== source) {
    await writeFile(filePath, rewritten);
  }

  if (/["'`]\/assets\//.test(rewritten)) {
    throw new Error(`Unscoped asset URL remains in ${filePath}`);
  }
}

await writeFile(path.join(outputDirectory, ".nojekyll"), "");
console.log(`Prepared GitHub Pages bundle at ${outputDirectory} with base ${base}`);
