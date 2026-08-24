import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
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

test("sleep intent page keeps its search promise, visible FAQ, and conversion path aligned", async () => {
  const html = await readFile(new URL("../public/sleep-sounds/index.html", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^Rain Sounds for Sleep/);
  assert.equal(h1Count, 1);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.match(software.downloadUrl, /id1461182261\?ppid=67cb8784-2b16-4849-b940-90fdf4d99752$/);
  assert.match(html, /data-analytics-event="yixiu_download_click"/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/light-rain\.m4a"/);
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
  assert.match(video.contentUrl, /2nJUyIr9EOY$/);
  assert.match(html, /youtube-nocookie\.com\/embed\/2nJUyIr9EOY/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/ocean-waves\.m4a"/);
  assert.match(html, /data-analytics-placement="ocean_focus_after_preview"/);
  assert.match(software.downloadUrl, /id1461182261\?ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759$/);
  assert.match(html, /data-analytics-placement="ocean_focus_landing"/);
});

test("robots and sitemap expose the crawlable ocean focus route", async () => {
  const robots = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");

  assert.match(robots, /Sitemap: https:\/\/yixiu\.wonderelian\.com\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/ocean-waves-for-focus\//);
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
