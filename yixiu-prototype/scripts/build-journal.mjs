import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const entries = JSON.parse(await readFile(path.join(root, "src/data/quiet-journal.json"), "utf8"));
const origin = "https://yixiu.wonderelian.com";
const escape = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const route = (lang, slug = "") => `/journal/${lang === "zh" ? "zh/" : ""}${slug ? slug + "/" : ""}`;
const slugs = new Set();
for (const entry of entries) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug) || slugs.has(entry.slug)) throw new Error("Invalid or duplicate journal slug");
  slugs.add(entry.slug);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date) || !["sleep", "focus", "reset", "guide"].includes(entry.category)) throw new Error("Invalid journal metadata");
  if (!["rain", "ocean", "spring", "birds", "stream", "firstBreath", "oasisRest", "oceanPassage"].includes(entry.scene)) throw new Error("Journal must link to a verified free scene");
  if (!["listen", "focus"].includes(entry.action) || !entry.image.startsWith("/assets/yixiu/") || entry.image.includes("..")) throw new Error("Invalid journal target");
  await access(path.join(publicDir, entry.image));
  for (const source of entry.sources ?? []) {
    const url = new URL(source.url);
    if (url.protocol !== "https:" || !["yixiu.wonderelian.com", "apps.apple.com"].includes(url.hostname) || !source.zh || !source.en) throw new Error("Invalid journal reference");
  }
  if (!Number.isInteger(entry.imageWidth) || !Number.isInteger(entry.imageHeight) || entry.imageWidth <= 0 || entry.imageHeight <= 0) throw new Error("Invalid image dimensions");
  for (const lang of ["zh", "en"]) {
    const copy = entry[lang];
    if (!copy?.title || !copy.summary || !copy.category || !copy.readTime || !copy.cta || copy.sections?.length < 2 || copy.sections.some(section => !section.title || !section.body)) throw new Error("Journal needs complete bilingual copy");
  }
}

function page(lang, entry) {
  const zh = lang === "zh";
  const name = zh ? "一休日常" : "Quiet Journal";
  const copy = entry?.[lang];
  const title = copy ? (copy.seoTitle || `${copy.title} · ${name} | Yixiu`) : `${name} · Yixiu`;
  const description = copy?.metaDescription ?? copy?.summary ?? (zh ? "把安静放进日常。关于睡前、专注，和属于自己的片刻。" : "A little quiet in everyday life. Notes for rest, focus, and a moment of your own.");
  const pathname = route(lang, entry?.slug);
  const hero = entry ?? entries[0];
  const imageType = hero.image.endsWith(".png") ? "image/png" : "image/jpeg";
  const cards = entries.map(item => `<a class="quiet-card" href="${route(lang, item.slug)}" data-journal-link data-analytics-event="yixiu_journal_read" data-analytics-value="${item.slug}"><img src="${escape(item.image)}" alt="" loading="lazy" width="${item.imageWidth}" height="${item.imageHeight}"><span class="quiet-card-copy"><span class="quiet-meta">${escape(item[lang].category)} · ${escape(item[lang].readTime)}</span><strong>${escape(item[lang].title)}</strong><span>${escape(item[lang].summary)}</span><span class="quiet-card-link">${zh ? "读一读" : "Read the note"} ↗</span></span></a>`).join("\n");
  const appQuery = entry ? new URLSearchParams({ scene: entry.scene, lang, ...(entry.action === "focus" ? { tab: "focus" } : {}) }) : null;
  const sources = entry?.sources?.length ? `<section class="quiet-sources"><h2>${zh ? "资料与核验" : "Sources and verification"}</h2><ul>${entry.sources.map(source => `<li><a href="${escape(source.url)}">${escape(source[lang])}</a></li>`).join("")}</ul></section>` : "";
  const related = entry ? `<nav class="quiet-related" aria-label="${zh ? "继续阅读" : "Keep reading"}"><h2>${zh ? "继续阅读" : "Keep reading"}</h2>${entries.filter(item => item.slug !== entry.slug).slice(0, 2).map(item => `<a class="quiet-permalink" href="${route(lang, item.slug)}" data-journal-link>${escape(item[lang].title)} ↗</a>`).join("")}</nav>` : "";
  const body = entry ? `<a class="quiet-permalink" href="${route(lang)}" data-journal-link>← ${name}</a><div class="quiet-meta"><span>${escape(copy.category)}</span><span>${escape(copy.readTime)}</span></div><h1>${escape(copy.title)}</h1><p class="quiet-intro">${escape(copy.summary)}</p><div class="quiet-article-cover"><img class="quiet-article-image" src="${escape(entry.image)}" alt="" width="${entry.imageWidth}" height="${entry.imageHeight}"></div>${copy.sections.map(section => `<section><h2>${escape(section.title)}</h2><p>${escape(section.body)}</p></section>`).join("")}<a class="quiet-practice" href="/?${escape(appQuery)}" data-journal-link data-analytics-event="yixiu_journal_practice" data-analytics-value="${entry.slug}">${escape(copy.cta)} <span aria-hidden="true">↗</span></a>${sources}${related}<p class="quiet-date">${zh ? "一休编辑" : "Yixiu Editorial"} · <time datetime="${entry.date}">${entry.date}</time></p>` : `<p class="quiet-meta">YIXIU · NOTES FOR EVERYDAY LIFE</p><h1>${name}</h1><p class="quiet-intro">${escape(description)}</p><div class="quiet-articles">${cards}</div>`;
  const structured = entry ? { "@context": "https://schema.org", "@type": "Article", headline: copy.title, description, datePublished: entry.date, inLanguage: zh ? "zh-Hans" : "en", image: origin + entry.image, mainEntityOfPage: origin + pathname, author: { "@type": "Organization", name: "Yixiu Editorial", url: origin + route(lang) }, publisher: { "@type": "Organization", name: "Yixiu", url: origin }, ...(entry.sources?.length ? { citation: entry.sources.map(source => source.url) } : {}) } : { "@context": "https://schema.org", "@type": "CollectionPage", name, description, url: origin + pathname, inLanguage: zh ? "zh-Hans" : "en" };
  return `<!doctype html>
<html lang="${zh ? "zh-Hans" : "en"}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)}</title><meta name="description" content="${escape(description)}">
<link rel="canonical" href="${origin + pathname}">
<link rel="alternate" hreflang="en" href="${origin + route("en", entry?.slug)}">
<link rel="alternate" hreflang="zh-Hans" href="${origin + route("zh", entry?.slug)}">
<link rel="alternate" hreflang="x-default" href="${origin + route("en", entry?.slug)}">
<meta property="og:type" content="${entry ? "article" : "website"}"><meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${origin + pathname}">
<meta property="og:image" content="${origin + hero.image}" />
<meta property="og:image:type" content="${imageType}" />
<meta property="og:image:width" content="${hero.imageWidth}" />
<meta property="og:image:height" content="${hero.imageHeight}" />
<meta property="og:image:alt" content="${escape(hero[lang].title)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="${origin + hero.image}" />
<meta name="twitter:image:alt" content="${escape(hero[lang].title)}" />
<link rel="describedby" href="/llms.txt" type="text/plain" />
<link rel="stylesheet" href="/journal.css?v=20260913-reading">
<script type="application/ld+json">${JSON.stringify(structured).replace(/</g, "\\u003c")}</script>
<script src="/analytics.js" defer></script><script src="/journal-links.js" defer></script>
</head>
<body class="quiet-page">
<header class="quiet-page-header"><a href="/?lang=${lang}" data-journal-link>← ${zh ? "回到一休" : "Back to Yixiu"}</a><a href="${route(zh ? "en" : "zh", entry?.slug)}" data-journal-link lang="${zh ? "en" : "zh-Hans"}">${zh ? "English" : "中文"}</a></header>
<main class="quiet-journal quiet-page-main ${entry ? "quiet-article" : ""}">${body}</main>
</body></html>\n`;
}

const urls = [];
for (const lang of ["en", "zh"]) {
  for (const entry of [undefined, ...entries]) {
    const pathname = route(lang, entry?.slug);
    const directory = path.join(publicDir, pathname);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "index.html"), page(lang, entry));
    urls.push(origin + pathname);
  }
}
const sitemapPath = path.join(publicDir, "sitemap.xml");
let sitemap = await readFile(sitemapPath, "utf8");
sitemap = sitemap.replace(/\s*<!-- quiet-journal:start -->[\s\S]*?<!-- quiet-journal:end -->\s*/g, "\n");
sitemap = sitemap.replace("</urlset>", `  <!-- quiet-journal:start -->\n${urls.map(url => `  <url><loc>${url}</loc></url>`).join("\n")}\n  <!-- quiet-journal:end -->\n</urlset>`);
await writeFile(sitemapPath, sitemap);
const llmsPath = path.join(publicDir, "llms.txt");
let llms = await readFile(llmsPath, "utf8");
llms = llms.replace(/\n<!-- quiet-journal:start -->[\s\S]*?<!-- quiet-journal:end -->\n?/g, "");
llms += `\n<!-- quiet-journal:start -->\n## Quiet Journal / 一休日常\n\n${["en", "zh"].flatMap(lang => [`- [${lang === "zh" ? "一休日常" : "Quiet Journal"}](${origin + route(lang)}): ${lang === "zh" ? "自然声、静心与使用指南。" : "Everyday listening and product guides."}`, ...entries.map(item => `- [${item[lang].title}](${origin + route(lang, item.slug)}): ${item[lang].summary}`)]).join("\n")}\n<!-- quiet-journal:end -->\n`;
await writeFile(llmsPath, llms);
console.log(`Generated ${urls.length} bilingual journal pages from ${entries.length} articles.`);
