import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";
import worker from "../worker/index.js";

test("serves existing static assets without a fallback", async () => {
  const calls = [];
  const response = await worker.fetch(new Request("https://example.test/assets/app.js"), {
    ASSETS: {
      fetch: async (request) => {
        calls.push(new URL(request.url).pathname);
        return new Response("asset", { status: 200 });
      },
    },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/assets/app.js"]);
});

test("falls back to index.html for an unknown app route", async () => {
  const calls = [];
  const response = await worker.fetch(
    new Request("https://example.test/flow/step-two?source=share", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async (request) => {
          const url = new URL(request.url);
          calls.push(url.pathname + url.search);
          return new Response(url.pathname === "/index.html" ? "app" : "missing", {
            status: url.pathname === "/index.html" ? 200 : 404,
          });
        },
      },
    },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/flow/step-two?source=share", "/index.html"]);
});

test("does not turn missing API or write requests into the app shell", async () => {
  for (const request of [
    new Request("https://example.test/api/missing", { headers: { accept: "application/json" } }),
    new Request("https://example.test/flow", { method: "POST", headers: { accept: "text/html" } }),
  ]) {
    let calls = 0;
    const response = await worker.fetch(request, {
      ASSETS: {
        fetch: async () => {
          calls += 1;
          return new Response("missing", { status: 404 });
        },
      },
    });

    assert.equal(response.status, 404);
    assert.equal(calls, 1);
  }
});

test("emits the files required by Sites packaging", async () => {
  await access(new URL("../dist/client/index.html", import.meta.url));
  await access(new URL("../dist/server/index.js", import.meta.url));
  await access(new URL("../dist/.openai/hosting.json", import.meta.url));
});

test("root page exposes truthful software application structured data", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const website = schema["@graph"].find((entry) => entry["@type"] === "WebSite");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");

  assert.equal(website.url, "https://yixiu.wonderelian.com/");
  assert.equal(software.name, "Yixiu: White Noise & Sleep");
  assert.equal(software.operatingSystem, "iOS");
  assert.equal(software.offers.price, "0");
  assert.match(software.downloadUrl, /id1461182261$/);
  assert.ok(software.featureList.includes("14 nature soundscapes"));
  assert.doesNotMatch(schemaSource, /aggregateRating|reviewCount/);
});

test("all H5 App Store actions use the shared Apple campaign attribution", async () => {
  const pagePaths = [
    "../index.html",
    "../public/guides/index.html",
    "../public/sleep-sounds/index.html",
    "../public/thunderstorm-sounds-for-sleep/index.html",
    "../public/rain-sounds-for-reading/index.html",
    "../public/focus-sounds/index.html",
    "../public/morning-bird-sounds-for-focus/index.html",
    "../public/forest-sounds-for-focus/index.html",
    "../public/wind-sounds-for-sleeping/index.html",
    "../public/underwater-white-noise-for-sleep/index.html",
    "../public/ocean-waves-for-sleeping/index.html",
    "../public/ocean-waves-for-focus/index.html",
    "../public/mountain-stream-sounds-for-focus/index.html",
    "../public/waterfall-sounds-for-noise-masking/index.html",
    "../public/river-sounds-for-studying/index.html",
    "../public/best-nature-sounds-for-studying/index.html",
    "../public/one-minute-reset/index.html",
  ];

  for (const pagePath of pagePaths) {
    const html = await readFile(new URL(pagePath, import.meta.url), "utf8");
    const appStoreHrefs = [...html.matchAll(/href="(https:\/\/apps\.apple\.com\/[^"]*id1461182261[^"]*)"/g)]
      .map((match) => match[1].replaceAll("&amp;", "&"));

    assert.ok(appStoreHrefs.length > 0, `${pagePath} should expose an App Store action`);
    for (const href of appStoreHrefs) {
      const url = new URL(href);
      assert.equal(url.searchParams.get("pt"), "120014121", pagePath);
      assert.equal(url.searchParams.get("ct"), "yixiu_h5_20260827", pagePath);
      assert.equal(url.searchParams.get("mt"), "8", pagePath);
    }
  }
});

test("sleep intent page keeps its search promise, visible FAQ, and conversion path aligned", async () => {
  const html = await readFile(new URL("../public/sleep-sounds/index.html", import.meta.url), "utf8");
  const hero = await stat(new URL("../public/assets/yixiu/window-rain.webp", import.meta.url));
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const image = schema["@graph"].find((entry) => entry["@type"] === "ImageObject");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const video = schema["@graph"].find((entry) => entry["@type"] === "VideoObject");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^Rain Sounds for Sleeping/);
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.match(description, /real rain sounds for sleeping/i);
  assert.equal(h1Count, 1);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.equal(video.duration, "PT15M");
  assert.equal(video.uploadDate, "2026-08-24T15:08:09+00:00");
  assert.match(video.contentUrl, /8LJoPKN3CO4$/);
  assert.match(html, /youtube-nocookie\.com\/embed\/8LJoPKN3CO4/);
  assert.equal(image.width, 941);
  assert.equal(image.height, 1672);
  assert.equal(image.representativeOfPage, true);
  assert.equal(software.image["@id"], image["@id"]);
  assert.equal(software.softwareVersion, "1.4");
  assert.ok(hero.size < 100_000);
  assert.match(html, /href="\/discover\.css\?v=20260828-sleep-timer"/);
  assert.match(html, /src="\/discover\.js\?v=20260828-sleep-timer"/);
  assert.match(html, /<source srcset="\/assets\/yixiu\/window-rain\.webp" type="image\/webp"/);
  assert.match(html, /data-preview-timer/);
  assert.match(html, /data-preview-minutes="15"/);
  assert.match(html, /data-preview-minutes="30"/);
  assert.match(html, /data-preview-minutes="60"/);
  assert.match(html, /property="og:image:width" content="941"/);
  assert.match(html, /property="og:image:height" content="1672"/);
  assert.match(html, /property="og:image:alt" content="Rain falling beyond a quiet window at night"/);
  assert.match(html, /name="twitter:image" content="https:\/\/yixiu\.wonderelian\.com\/assets\/yixiu\/window-rain\.png"/);
  assert.match(html, /name="twitter:image:alt" content="Rain falling beyond a quiet window at night"/);
  assert.match(software.downloadUrl, /id1461182261\?ppid=67cb8784-2b16-4849-b940-90fdf4d99752$/);
  assert.match(html, /data-analytics-event="yixiu_download_click"/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/light-rain\.m4a"/);
  assert.match(html, /Real window rain/);
  assert.match(html, /data-analytics-placement="sleep_after_preview"/);
  assert.doesNotMatch(html, /utm_source=google/);
  assert.match(html, /href="\/focus-sounds\/"/);
  assert.match(html, /href="\/one-minute-reset\/"/);
});

test("focus intent page answers the query and keeps its App Store path aligned", async () => {
  const html = await readFile(new URL("../public/focus-sounds/index.html", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 40 && title.length <= 60);
  assert.match(title, /^Nature Sounds for Focus/);
  assert.equal(h1Count, 1);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.match(software.downloadUrl, /id1461182261\?ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759$/);
  assert.match(html, /data-analytics-event="yixiu_download_click"/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/river-flow\.m4a"/);
  assert.match(html, /data-analytics-placement="focus_after_preview"/);
  assert.doesNotMatch(html, /utm_source=google/);
  assert.match(html, /href="\/ocean-waves-for-focus\/"/);
  assert.match(html, /href="\/mountain-stream-sounds-for-focus\/"/);
});

test("reset intent page offers a real one-tap preview before its matched App Store path", async () => {
  const html = await readFile(new URL("../public/one-minute-reset/index.html", import.meta.url), "utf8");

  assert.match(html, /src="\/discover\.js"/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/sunrise-river\.m4a"/);
  assert.match(html, /data-analytics-placement="reset_after_preview"/);
  assert.match(html, /ppid=6c015245-76ff-4266-8837-5a0ffc289b9c/);
  assert.doesNotMatch(html, /utm_source=google/);
});

test("ocean focus page aligns visible video, structured data, and attributed download CTA", async () => {
  const html = await readFile(new URL("../public/ocean-waves-for-focus/index.html", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const video = schema["@graph"].find((entry) => entry["@type"] === "VideoObject");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^Ocean Waves for Focus/);
  assert.equal(h1Count, 1);
  assert.equal(video.duration, "PT10M");
  assert.equal(video.uploadDate, "2026-08-24T10:50:56+00:00");
  assert.match(video.contentUrl, /2nJUyIr9EOY$/);
  assert.match(html, /youtube-nocookie\.com\/embed\/2nJUyIr9EOY/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/ocean-waves\.m4a"/);
  assert.match(html, /data-analytics-placement="ocean_focus_after_preview"/);
  assert.match(software.downloadUrl, /id1461182261\?ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759$/);
  assert.match(html, /data-analytics-placement="ocean_focus_landing"/);
  assert.match(html, /href="\/mountain-stream-sounds-for-focus\/"/);
});

test("ocean sleep page serves real waves and the matched Sleep download path", async () => {
  const html = await readFile(new URL("../public/ocean-waves-for-sleeping/index.html", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const webpage = schema["@graph"].find((entry) => entry["@type"] === "WebPage");
  const image = schema["@graph"].find((entry) => entry["@type"] === "ImageObject");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^Ocean Waves for Sleeping/);
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.equal(h1Count, 1);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.match(webpage.url, /ocean-waves-for-sleeping\/$/);
  assert.equal(image.width, 941);
  assert.equal(image.height, 1672);
  assert.equal(image.representativeOfPage, true);
  assert.equal(software.image["@id"], image["@id"]);
  assert.match(image.contentUrl, /night-tide\.png$/);
  assert.match(software.downloadUrl, /id1461182261\?ppid=67cb8784-2b16-4849-b940-90fdf4d99752$/);
  assert.match(html, /rel="canonical" href="https:\/\/yixiu\.wonderelian\.com\/ocean-waves-for-sleeping\/"/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/ocean-waves\.m4a"/);
  assert.match(html, /data-analytics-placement="ocean_sleep_after_preview"/);
  assert.match(html, /href="\/ocean-waves-for-focus\/"/);
  assert.match(html, /href="\/sleep-sounds\/"/);
  assert.match(html, /href="\/wind-sounds-for-sleeping\/"/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/ocean-waves-for-sleeping\/<\/loc><lastmod>2026-08-26<\/lastmod>/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|cure|treat|guarantee|insomnia/i);
});

test("mountain stream focus page keeps its search promise, real preview, and schema aligned", async () => {
  const html = await readFile(new URL("../public/mountain-stream-sounds-for-focus/index.html", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const image = schema["@graph"].find((entry) => entry["@type"] === "ImageObject");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const video = schema["@graph"].find((entry) => entry["@type"] === "VideoObject");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^Mountain Stream Sounds for Focus/);
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.equal(h1Count, 1);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.equal(image.width, 1280);
  assert.equal(image.height, 720);
  assert.equal(image.representativeOfPage, true);
  assert.equal(software.image["@id"], image["@id"]);
  assert.equal(video.duration, "PT15M");
  assert.equal(video.uploadDate, "2026-08-24T16:54:29+00:00");
  assert.match(video.contentUrl, /lfDiI0TAq1c$/);
  assert.match(html, /youtube-nocookie\.com\/embed\/lfDiI0TAq1c/);
  assert.match(software.downloadUrl, /id1461182261\?ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759$/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/river-flow\.m4a"/);
  assert.match(html, /data-analytics-placement="mountain_stream_focus_after_preview"/);
  assert.match(html, /property="og:image:width" content="1280"/);
  assert.match(html, /property="og:image:height" content="720"/);
  assert.match(html, /name="twitter:image" content="https:\/\/yixiu\.wonderelian\.com\/assets\/yixiu\/mountain-stream-focus-share\.jpg"/);
  assert.equal(video.thumbnailUrl, image.contentUrl);
  assert.doesNotMatch(html, /aggregateRating|reviewCount/);
  assert.match(html, /href="\/focus-sounds\/"/);
  assert.match(html, /href="\/ocean-waves-for-focus\/"/);
  assert.match(html, /href="\/sleep-sounds\/"/);
});

test("robots and sitemap expose the crawlable focus routes", async () => {
  const robots = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");

  assert.match(robots, /Sitemap: https:\/\/yixiu\.wonderelian\.com\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/ocean-waves-for-focus\/<\/loc><lastmod>2026-08-26<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/mountain-stream-sounds-for-focus\/<\/loc><lastmod>2026-08-26<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/waterfall-sounds-for-noise-masking\/<\/loc><lastmod>2026-08-25<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/river-sounds-for-studying\/<\/loc><lastmod>2026-08-26<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/best-nature-sounds-for-studying\/<\/loc><lastmod>2026-08-25<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/guides\/<\/loc><lastmod>2026-08-26<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/sleep-sounds\/<\/loc><lastmod>2026-08-28<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/rain-sounds-for-reading\/<\/loc><lastmod>2026-08-25<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/thunderstorm-sounds-for-sleep\/<\/loc><lastmod>2026-08-25<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/morning-bird-sounds-for-focus\/<\/loc><lastmod>2026-08-25<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/forest-sounds-for-focus\/<\/loc><lastmod>2026-08-26<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/wind-sounds-for-sleeping\/<\/loc><lastmod>2026-08-27<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/rain-sounds-for-studying\/<\/loc><lastmod>2026-08-28<\/lastmod>/);
});

test("river study page keeps its student intent, real preview, and Focus download path aligned", async () => {
  const html = await readFile(new URL("../public/river-sounds-for-studying/index.html", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const video = schema["@graph"].find((entry) => entry["@type"] === "VideoObject");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^River Sounds for Studying/);
  assert.equal(h1Count, 1);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.equal(video.duration, "PT15M");
  assert.equal(video.uploadDate, "2026-08-24T16:54:29+00:00");
  assert.match(video.contentUrl, /lfDiI0TAq1c$/);
  assert.match(software.downloadUrl, /id1461182261\?ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759$/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/river-flow\.m4a"/);
  assert.match(html, /data-analytics-placement="river_study_after_preview"/);
  assert.match(html, /youtube-nocookie\.com\/embed\/lfDiI0TAq1c/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount/);
});

test("study-sound comparison page exposes three real previews and a truthful comparison schema", async () => {
  const html = await readFile(new URL("../public/best-nature-sounds-for-studying/index.html", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const previewCount = [...html.matchAll(/data-audio-preview=/g)].length;
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const article = schema["@graph"].find((entry) => entry["@type"] === "Article");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const itemList = schema["@graph"].find((entry) => entry["@type"] === "ItemList");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^Best Nature Sounds for Studying/);
  assert.equal(h1Count, 1);
  assert.equal(previewCount, 3);
  assert.equal(itemList.itemListElement.length, 3);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.equal(article.author.name, "WonderElian");
  assert.match(software.downloadUrl, /id1461182261\?ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759$/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/river-flow\.m4a"/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/light-rain\.m4a"/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/ocean-waves\.m4a"/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|guarantee/i);
});

test("rain reading page answers a distinct reading intent with a real preview and compressed hero", async () => {
  const html = await readFile(new URL("../public/rain-sounds-for-reading/index.html", import.meta.url), "utf8");
  const imageAsset = await readFile(new URL("../public/assets/yixiu/rain.webp", import.meta.url));
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const webpage = schema["@graph"].find((entry) => entry["@type"] === "WebPage");
  const image = schema["@graph"].find((entry) => entry["@type"] === "ImageObject");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^Rain Sounds for Reading/);
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.equal(h1Count, 1);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.match(webpage.url, /rain-sounds-for-reading\/$/);
  assert.equal(image.width, 941);
  assert.equal(image.height, 1672);
  assert.equal(image.representativeOfPage, true);
  assert.equal(software.image["@id"], image["@id"]);
  assert.ok(imageAsset.length < 150_000);
  assert.match(image.contentUrl, /rain\.webp$/);
  assert.match(software.downloadUrl, /id1461182261\?ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759$/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/light-rain\.m4a"/);
  assert.match(html, /data-analytics-placement="rain_reading_after_preview"/);
  assert.match(html, /href="\/sleep-sounds\/"/);
  assert.match(html, /href="\/mountain-stream-sounds-for-focus\/"/);
  assert.match(html, /href="\/guides\/">Guides<\/a>/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|cure|treat|guarantee/i);
});

test("rain study page keeps its study intent, real preview, and Focus download path aligned", async () => {
  const html = await readFile(new URL("../public/rain-sounds-for-studying/index.html", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const webpage = schema["@graph"].find((entry) => entry["@type"] === "WebPage");
  const image = schema["@graph"].find((entry) => entry["@type"] === "ImageObject");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^Rain Sounds for Studying/);
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.equal(h1Count, 1);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.match(webpage.url, /rain-sounds-for-studying\/$/);
  assert.equal(image.width, 941);
  assert.equal(image.height, 1672);
  assert.equal(image.representativeOfPage, true);
  assert.equal(software.image["@id"], image["@id"]);
  assert.match(image.contentUrl, /rain\.webp$/);
  assert.match(software.downloadUrl, /id1461182261\?ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759$/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/light-rain\.m4a"/);
  assert.match(html, /data-analytics-placement="rain_studying_after_preview"/);
  assert.match(html, /href="\/rain-sounds-for-reading\/"/);
  assert.match(html, /href="\/river-sounds-for-studying\/"/);
  assert.match(html, /href="\/guides\/">Guides<\/a>/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|cure|treat|guarantee/i);
});

test("guides hub organizes every English intent page and exposes a real preview and truthful collection schema", async () => {
  const html = await readFile(new URL("../public/guides/index.html", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const collection = schema["@graph"].find((entry) => entry["@type"] === "CollectionPage");
  const itemList = schema["@graph"].find((entry) => entry["@type"] === "ItemList");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^Nature Sound Guides/);
  assert.equal(h1Count, 1);
  assert.equal(collection.mainEntity["@id"], itemList["@id"]);
  assert.equal(itemList.itemListElement.length, 16);
  assert.equal(faq.mainEntity.length, 3);
  assert.match(software.downloadUrl, /id1461182261$/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/river-flow\.m4a"/);
  for (const route of ["sleep-sounds", "thunderstorm-sounds-for-sleep", "wind-sounds-for-sleeping", "underwater-white-noise-for-sleep", "ocean-waves-for-sleeping", "focus-sounds", "morning-bird-sounds-for-focus", "forest-sounds-for-focus", "rain-sounds-for-reading", "rain-sounds-for-studying", "river-sounds-for-studying", "best-nature-sounds-for-studying", "ocean-waves-for-focus", "mountain-stream-sounds-for-focus", "waterfall-sounds-for-noise-masking", "one-minute-reset"]) {
    assert.match(html, new RegExp(`href="/${route}/"`));
  }
  assert.doesNotMatch(html, /aggregateRating|reviewCount|guarantee/i);
});

test("every English intent page links back to the guides hub", async () => {
  for (const route of ["sleep-sounds", "thunderstorm-sounds-for-sleep", "wind-sounds-for-sleeping", "underwater-white-noise-for-sleep", "ocean-waves-for-sleeping", "focus-sounds", "morning-bird-sounds-for-focus", "forest-sounds-for-focus", "rain-sounds-for-reading", "rain-sounds-for-studying", "river-sounds-for-studying", "best-nature-sounds-for-studying", "ocean-waves-for-focus", "mountain-stream-sounds-for-focus", "waterfall-sounds-for-noise-masking", "one-minute-reset"]) {
    const html = await readFile(new URL(`../public/${route}/index.html`, import.meta.url), "utf8");
    assert.match(html, /href="\/guides\/">Guides<\/a>/);
  }
});

test("waterfall masking page serves a real recording and keeps every claim, schema and download path aligned", async () => {
  const html = await readFile(new URL("../public/waterfall-sounds-for-noise-masking/index.html", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1].replace("&amp;", "&");
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const image = schema["@graph"].find((entry) => entry["@type"] === "ImageObject");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^Waterfall Sounds for Noise Masking/);
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.equal(h1Count, 1);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.equal(image.width, 941);
  assert.equal(image.height, 1672);
  assert.equal(image.representativeOfPage, true);
  assert.match(image.contentUrl, /forest-falls\.webp$/);
  assert.equal(software.image["@id"], image["@id"]);
  assert.match(software.downloadUrl, /id1461182261\?ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759$/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/forest-waterfall\.m4a"/);
  assert.match(html, /data-analytics-placement="waterfall_masking_after_preview"/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|cure|treat|guarantee/i);
  assert.match(html, /It does not remove sound or replace hearing protection/);
  assert.match(html, /href="\/focus-sounds\/"/);
  assert.match(html, /href="\/mountain-stream-sounds-for-focus\/"/);
  assert.match(html, /href="\/guides\/">Guides<\/a>/);
});

test("thunderstorm sleep page serves distant thunder and keeps every claim, schema and download path aligned", async () => {
  const html = await readFile(new URL("../public/thunderstorm-sounds-for-sleep/index.html", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const webpage = schema["@graph"].find((entry) => entry["@type"] === "WebPage");
  const image = schema["@graph"].find((entry) => entry["@type"] === "ImageObject");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^Thunderstorm Sounds for Sleep/);
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.equal(h1Count, 1);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.match(webpage.url, /thunderstorm-sounds-for-sleep\/$/);
  assert.equal(image.width, 941);
  assert.equal(image.height, 1672);
  assert.equal(image.representativeOfPage, true);
  assert.equal(software.image["@id"], image["@id"]);
  assert.match(image.contentUrl, /distant-thunder\.png$/);
  assert.match(software.downloadUrl, /id1461182261\?ppid=67cb8784-2b16-4849-b940-90fdf4d99752$/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/distant-thunder\.m4a"/);
  assert.match(html, /data-analytics-placement="thunder_sleep_after_preview"/);
  assert.match(html, /href="\/sleep-sounds\/"/);
  assert.match(html, /href="\/ocean-waves-for-focus\/"/);
  assert.match(html, /href="\/guides\/">Guides<\/a>/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|cure|treat|guarantee/i);
});

test("underwater white noise sleep page serves the real recording and matched Sleep download path", async () => {
  const html = await readFile(new URL("../public/underwater-white-noise-for-sleep/index.html", import.meta.url), "utf8");
  const hero = await stat(new URL("../public/assets/yixiu/underwater-echo.webp", import.meta.url));
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const webpage = schema["@graph"].find((entry) => entry["@type"] === "WebPage");
  const image = schema["@graph"].find((entry) => entry["@type"] === "ImageObject");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^Deep White Noise for Sleeping/);
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.equal(h1Count, 1);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.match(webpage.url, /underwater-white-noise-for-sleep\/$/);
  assert.equal(image.width, 941);
  assert.equal(image.height, 1672);
  assert.equal(image.representativeOfPage, true);
  assert.equal(software.image["@id"], image["@id"]);
  assert.equal(software.softwareVersion, "1.4");
  assert.ok(hero.size < 100_000);
  assert.match(image.contentUrl, /underwater-echo\.png$/);
  assert.match(html, /href="\/discover\.css\?v=20260828-white-noise-timer"/);
  assert.match(html, /src="\/discover\.js\?v=20260828-white-noise-timer"/);
  assert.match(html, /<source srcset="\/assets\/yixiu\/underwater-echo\.webp" type="image\/webp"/);
  assert.match(html, /data-preview-timer/);
  assert.match(html, /data-preview-minutes="15"/);
  assert.match(html, /data-preview-minutes="30"/);
  assert.match(html, /data-preview-minutes="60"/);
  assert.match(software.downloadUrl, /id1461182261\?ppid=67cb8784-2b16-4849-b940-90fdf4d99752$/);
  assert.match(html, /rel="canonical" href="https:\/\/yixiu\.wonderelian\.com\/underwater-white-noise-for-sleep\/"/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/underwater-white-noise\.m4a"/);
  assert.match(html, /data-analytics-placement="underwater_white_noise_after_preview"/);
  assert.match(html, /href="\/sleep-sounds\/"/);
  assert.match(html, /href="\/thunderstorm-sounds-for-sleep\/"/);
  assert.match(html, /href="\/guides\/">Guides<\/a>/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|cure|treat|guarantee/i);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/underwater-white-noise-for-sleep\/<\/loc><lastmod>2026-08-28<\/lastmod>/);
});

test("morning birds focus page serves real birdsong and keeps its bright focus promise aligned", async () => {
  const html = await readFile(new URL("../public/morning-bird-sounds-for-focus/index.html", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const webpage = schema["@graph"].find((entry) => entry["@type"] === "WebPage");
  const image = schema["@graph"].find((entry) => entry["@type"] === "ImageObject");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^Morning Bird Sounds for Focus/);
  assert.ok(description.length >= 140 && description.length <= 160);
  assert.equal(h1Count, 1);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.match(webpage.url, /morning-bird-sounds-for-focus\/$/);
  assert.equal(image.width, 941);
  assert.equal(image.height, 1672);
  assert.equal(image.representativeOfPage, true);
  assert.equal(software.image["@id"], image["@id"]);
  assert.match(image.contentUrl, /morning-birds\.png$/);
  assert.match(software.downloadUrl, /id1461182261\?ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759$/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/morning-birds\.m4a"/);
  assert.match(html, /data-analytics-placement="morning_birds_focus_after_preview"/);
  assert.match(html, /href="\/river-sounds-for-studying\/"/);
  assert.match(html, /href="\/rain-sounds-for-reading\/"/);
  assert.match(html, /href="\/guides\/">Guides<\/a>/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|cure|treat|guarantee/i);
});

test("forest focus page serves its real forest-breeze recording and aligned search promise", async () => {
  const html = await readFile(new URL("../public/forest-sounds-for-focus/index.html", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const webpage = schema["@graph"].find((entry) => entry["@type"] === "WebPage");
  const image = schema["@graph"].find((entry) => entry["@type"] === "ImageObject");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^Forest Sounds for Focus/);
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.equal(h1Count, 1);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.match(webpage.url, /forest-sounds-for-focus\/$/);
  assert.equal(image.width, 941);
  assert.equal(image.height, 1672);
  assert.equal(image.representativeOfPage, true);
  assert.equal(software.image["@id"], image["@id"]);
  assert.match(image.contentUrl, /sunny-valley\.png$/);
  assert.match(software.downloadUrl, /id1461182261\?ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759$/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/forest-breeze\.m4a"/);
  assert.match(html, /data-scene="valley"/);
  assert.match(html, /data-analytics-placement="forest_focus_after_preview"/);
  assert.match(html, /href="\/focus-sounds\/"/);
  assert.match(html, /href="\/morning-bird-sounds-for-focus\/"/);
  assert.match(html, /href="\/mountain-stream-sounds-for-focus\/"/);
  assert.match(html, /href="\/guides\/">Guides<\/a>/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|cure|treat|guarantee/i);
});

test("wind sleep page serves real mountain wind and keeps its no-music bedtime promise aligned", async () => {
  const html = await readFile(new URL("../public/wind-sounds-for-sleeping/index.html", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const webpage = schema["@graph"].find((entry) => entry["@type"] === "WebPage");
  const image = schema["@graph"].find((entry) => entry["@type"] === "ImageObject");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^Wind Sounds for Sleeping/);
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.equal(h1Count, 1);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.match(webpage.url, /wind-sounds-for-sleeping\/$/);
  assert.equal(image.width, 941);
  assert.equal(image.height, 1672);
  assert.equal(image.representativeOfPage, true);
  assert.equal(software.image["@id"], image["@id"]);
  assert.match(image.contentUrl, /snow-wind\.png$/);
  assert.match(software.downloadUrl, /id1461182261\?ppid=67cb8784-2b16-4849-b940-90fdf4d99752$/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/mountain-wind\.m4a"/);
  assert.match(html, /data-analytics-placement="wind_sleep_after_preview"/);
  assert.match(html, /href="\/sleep-sounds\/"/);
  assert.match(html, /href="\/ocean-waves-for-sleeping\/"/);
  assert.match(html, /href="\/thunderstorm-sounds-for-sleep\/"/);
  assert.match(html, /href="\/guides\/">Guides<\/a>/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|cure|treat|guarantee/i);
});

test("keeps the Google Search Console verification file exact", async () => {
  const verification = await readFile(
    new URL("../public/google56101fb62f40fa0c.html", import.meta.url),
    "utf8",
  );

  assert.equal(
    verification.trim(),
    "google-site-verification: google56101fb62f40fa0c.html",
  );
});

test("keeps the public IndexNow key file exact", async () => {
  const key = await readFile(
    new URL("../public/0d28a7f9686f4a45871ea685d741dc75.txt", import.meta.url),
    "utf8",
  );

  assert.equal(key.trim(), "0d28a7f9686f4a45871ea685d741dc75");
});

test("production deploy acceptance checks the HTTPS origin instead of its redirect", async () => {
  const script = await readFile(
    new URL("../scripts/deploy-production-nginx.sh", import.meta.url),
    "utf8",
  );

  assert.match(script, /--resolve 'yixiu\.wonderelian\.com:443:127\.0\.0\.1'/);
  assert.match(script, /https:\/\/yixiu\.wonderelian\.com\//);
  assert.match(script, /forest-sounds-for-focus\/index\.html/);
  assert.match(script, /assets\/yixiu\/audio\/forest-breeze\.m4a/);
  assert.match(script, /underwater-white-noise-for-sleep\/index\.html/);
  assert.match(script, /assets\/yixiu\/audio\/underwater-white-noise\.m4a/);
  assert.match(script, /ocean-waves-for-sleeping\/index\.html/);
  assert.match(script, /assets\/yixiu\/audio\/ocean-waves\.m4a/);
  assert.doesNotMatch(script, /-H 'Host: yixiu\.wonderelian\.com' http:\/\/127\.0\.0\.1\//);
});
