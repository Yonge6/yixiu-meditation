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
  assert.equal(software.softwareVersion, "1.5");
  assert.equal(software.offers.price, "0");
  assert.match(software.downloadUrl, /id1461182261$/);
  assert.ok(software.featureList.includes("14 nature soundscapes"));
  assert.doesNotMatch(schemaSource, /aggregateRating|reviewCount/);
});

test("root page exposes a useful no-JavaScript Yixiu entry point", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const fallback = html.match(/<main class="html-fallback">([\s\S]*?)<\/main>/)?.[1];

  assert.ok(fallback, "root should expose a semantic fallback before JavaScript runs");
  assert.match(fallback, /<h1>Free nature sounds for sleep, focus and study<\/h1>/);
  assert.match(fallback, /fourteen real nature-sound recordings/);
  assert.match(fallback, /no music, no talking, no account and no ads/);
  assert.match(fallback, /href="\/sleep-sounds\/"/);
  assert.match(fallback, /href="\/focus-sounds\/"/);
  assert.match(fallback, /href="\/best-sleep-sounds\/"/);
  assert.match(fallback, /href="\/best-nature-sounds-for-studying\/"/);
  assert.match(fallback, /href="\/nature-sounds-for-meditation\/"/);
  assert.match(fallback, /href="\/guides\/"/);
  assert.match(fallback, /id1461182261/);
  assert.doesNotMatch(fallback, /maker\.|onelaser\.|wendao\.|style atlas|aggregateRating|reviewCount|cure|treat|guarantee|insomnia/i);
});

test("every sitemap HTML page points agents to the covering llms.txt", async () => {
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const urls = [...sitemap.matchAll(/<loc>(https:\/\/yixiu\.wonderelian\.com\/[^<]*)<\/loc>/g)]
    .map((match) => new URL(match[1]));

  assert.equal(urls.length, 27);
  for (const url of urls) {
    const pagePath = url.pathname === "/"
      ? "../index.html"
      : url.pathname.endsWith(".html")
        ? `../public${url.pathname}`
        : `../public${url.pathname}index.html`;
    const html = await readFile(new URL(pagePath, import.meta.url), "utf8");
    const declarations = [...html.matchAll(/<link rel="describedby" href="\/llms\.txt" type="text\/plain" \/>/g)];

    assert.equal(declarations.length, 1, `${url.pathname} should declare exactly one llms.txt description`);
  }
});

test("every public Yixiu application schema matches the official App Store version", async () => {
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const urls = [...sitemap.matchAll(/<loc>(https:\/\/yixiu\.wonderelian\.com\/[^<]*)<\/loc>/g)]
    .map((match) => new URL(match[1]))
    .filter((url) => url.pathname !== "/privacy.html");

  assert.equal(urls.length, 26);
  for (const url of urls) {
    const pagePath = url.pathname === "/"
      ? "../index.html"
      : `../public${url.pathname}index.html`;
    const html = await readFile(new URL(pagePath, import.meta.url), "utf8");
    const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
    const schema = JSON.parse(schemaSource);
    const graph = schema["@graph"] ?? [schema];
    const software = graph.find((entry) => entry["@type"] === "SoftwareApplication");

    assert.ok(software, `${url.pathname} should expose SoftwareApplication data`);
    assert.equal(software.softwareVersion, "1.5", url.pathname);
  }
});

test("every shareable sitemap page exposes a complete large-image social card", async () => {
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const urls = [...sitemap.matchAll(/<loc>(https:\/\/yixiu\.wonderelian\.com\/[^<]*)<\/loc>/g)]
    .map((match) => new URL(match[1]))
    .filter((url) => url.pathname !== "/privacy.html");

  assert.equal(urls.length, 26);
  for (const url of urls) {
    const pagePath = url.pathname === "/"
      ? "../index.html"
      : `../public${url.pathname}index.html`;
    const html = await readFile(new URL(pagePath, import.meta.url), "utf8");
    const image = html.match(/<meta property="og:image" content="([^"]+)" \/>/)?.[1];
    const imageType = html.match(/<meta property="og:image:type" content="([^"]+)" \/>/)?.[1];
    const imageWidth = html.match(/<meta property="og:image:width" content="([^"]+)" \/>/)?.[1];
    const imageHeight = html.match(/<meta property="og:image:height" content="([^"]+)" \/>/)?.[1];
    const imageAlt = html.match(/<meta property="og:image:alt" content="([^"]+)" \/>/)?.[1];
    const twitterImage = html.match(/<meta name="twitter:image" content="([^"]+)" \/>/)?.[1];
    const twitterImageAlt = html.match(/<meta name="twitter:image:alt" content="([^"]+)" \/>/)?.[1];

    assert.match(html, /<meta name="twitter:card" content="summary_large_image" \/>/, url.pathname);
    assert.ok(image, `${url.pathname} should declare an Open Graph image`);
    assert.match(imageType || "", /^image\/(?:jpeg|png|webp)$/, url.pathname);
    assert.ok(Number(imageWidth) > 0, `${url.pathname} should declare a positive image width`);
    assert.ok(Number(imageHeight) > 0, `${url.pathname} should declare a positive image height`);
    assert.ok(imageAlt, `${url.pathname} should declare Open Graph image alt text`);
    assert.equal(twitterImage, image, `${url.pathname} should reuse the Open Graph image on Twitter`);
    assert.equal(twitterImageAlt, imageAlt, `${url.pathname} should reuse the image alt text on Twitter`);

    const imageUrl = new URL(image);
    assert.equal(imageUrl.origin, "https://yixiu.wonderelian.com", url.pathname);
    await access(new URL(`../public${imageUrl.pathname}`, import.meta.url));
  }
});

test("sitemap marks the completed social-card pages as updated", async () => {
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");

  for (const path of ["", "focus-sounds/", "ocean-waves-for-focus/", "one-minute-reset/"]) {
    const escapedPath = path.replaceAll("/", "\\/");
    assert.match(
      sitemap,
      new RegExp(`https:\\/\\/yixiu\\.wonderelian\\.com\\/${escapedPath}<\\/loc><lastmod>2026-08-29<\\/lastmod>`),
      path || "/",
    );
  }
});

test("all H5 App Store actions use the shared Apple campaign attribution", async () => {
  const pagePaths = [
    "../index.html",
    "../public/guides/index.html",
    "../public/free-online-sound-machine/index.html",
    "../public/nature-sounds-for-meditation/index.html",
    "../public/sleep-sounds/index.html",
    "../public/rain-sounds-when-iphone-locked/index.html",
    "../public/thunderstorm-sounds-for-sleep/index.html",
    "../public/rain-sounds-for-reading/index.html",
    "../public/white-noise-for-studying/index.html",
    "../public/focus-sounds/index.html",
    "../public/morning-bird-sounds-for-focus/index.html",
    "../public/forest-sounds-for-focus/index.html",
    "../public/forest-sounds-for-sleep/index.html",
    "../public/wind-sounds-for-sleeping/index.html",
    "../public/underwater-white-noise-for-sleep/index.html",
    "../public/ocean-waves-for-sleeping/index.html",
    "../public/ocean-waves-for-focus/index.html",
    "../public/mountain-stream-sounds-for-focus/index.html",
    "../public/waterfall-sounds-for-noise-masking/index.html",
    "../public/river-sounds-for-studying/index.html",
    "../public/best-nature-sounds-for-studying/index.html",
    "../public/best-sleep-sounds/index.html",
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

test("every after-preview page loads the global share-prompt script version", async () => {
  const pagePaths = [
    "../public/guides/index.html",
    "../public/free-online-sound-machine/index.html",
    "../public/nature-sounds-for-meditation/index.html",
    "../public/sleep-sounds/index.html",
    "../public/rain-sounds-when-iphone-locked/index.html",
    "../public/thunderstorm-sounds-for-sleep/index.html",
    "../public/rain-sounds-for-reading/index.html",
    "../public/white-noise-for-studying/index.html",
    "../public/focus-sounds/index.html",
    "../public/morning-bird-sounds-for-focus/index.html",
    "../public/forest-sounds-for-focus/index.html",
    "../public/forest-sounds-for-sleep/index.html",
    "../public/wind-sounds-for-sleeping/index.html",
    "../public/underwater-white-noise-for-sleep/index.html",
    "../public/ocean-waves-for-sleeping/index.html",
    "../public/ocean-waves-for-focus/index.html",
    "../public/mountain-stream-sounds-for-focus/index.html",
    "../public/waterfall-sounds-for-noise-masking/index.html",
    "../public/river-sounds-for-studying/index.html",
    "../public/rain-sounds-for-studying/index.html",
    "../public/best-nature-sounds-for-studying/index.html",
    "../public/best-sleep-sounds/index.html",
    "../public/one-minute-reset/index.html",
  ];

  for (const pagePath of pagePaths) {
    const html = await readFile(new URL(pagePath, import.meta.url), "utf8");
    assert.match(html, /data-after-preview/);
    if (pagePath.endsWith("/guides/index.html")) {
      assert.match(html, /src="\/discover\.js\?v=20260830-duration-share"/, pagePath);
    } else {
      assert.match(html, /src="\/discover\.js\?v=20260829-global-share-prompt"/, pagePath);
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
  const faqAnswers = [...html.matchAll(/<details(?:\s+open)?><summary>[^<]+<\/summary><p>([^<]+)<\/p><\/details>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const image = schema["@graph"].find((entry) => entry["@type"] === "ImageObject");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const video = schema["@graph"].find((entry) => entry["@type"] === "VideoObject");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.equal(title, "Rain Sounds Black Screen for Sleep — Free, No Ads | Yixiu");
  assert.ok(title.length >= 50 && title.length <= 60);
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.match(description, /^Play real rain sounds with a black screen/i);
  assert.match(description, /free online/i);
  assert.equal(h1Count, 1);
  assert.equal(faqQuestions.length, 5);
  assert.equal(faqAnswers.length, faqQuestions.length);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry, index) => entry.name === faqQuestions[index] && entry.acceptedAnswer.text === faqAnswers[index]));
  assert.equal(video.duration, "PT15M");
  assert.equal(video.uploadDate, "2026-08-24T15:08:09+00:00");
  assert.match(video.contentUrl, /8LJoPKN3CO4$/);
  assert.match(html, /youtube-nocookie\.com\/embed\/8LJoPKN3CO4/);
  assert.equal(image.width, 941);
  assert.equal(image.height, 1672);
  assert.equal(image.representativeOfPage, true);
  assert.equal(software.image["@id"], image["@id"]);
  assert.equal(software.softwareVersion, "1.5");
  assert.ok(hero.size < 100_000);
  assert.match(html, /href="\/discover\.css\?v=20260829-sleep-share"/);
  assert.match(html, /src="\/discover\.js\?v=20260829-global-share-prompt"/);
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
  assert.match(html, /<h1>Rain sounds with a black screen for sleep\.<\/h1>/);
  assert.match(html, /<p class="intent-lede">Play real rain sounds with a black screen/);
  assert.match(html, /<summary>Are these black-screen rain sounds free and ad-free\?<\/summary>/);
  assert.match(html, /data-dark-screen-toggle[^>]*disabled/);
  assert.match(html, /data-analytics-placement="sleep_landing_dark_screen"/);
  assert.match(html, /data-dark-screen-overlay[^>]*hidden/);
  assert.match(html, />Black Screen<\/span><\/button>/);
  assert.match(html, /The browser black-screen mode covers this open page while the rain and timer keep running\./);
  assert.match(html, /For physical iPhone lock-screen playback, continue in Yixiu\./);
  assert.match(html, /Real window rain/);
  assert.match(html, /data-analytics-placement="sleep_after_preview"/);
  assert.match(html, /data-share-label="Send this rain to someone"/);
  assert.match(html, /Know someone who needs a quieter night\?/);
  assert.doesNotMatch(html, /utm_source=google/);
  assert.match(html, /href="\/focus-sounds\/"/);
  assert.match(html, /href="\/one-minute-reset\/"/);
});

test("iPhone lock-screen rain guide answers the setting intent and keeps source, schema and conversion aligned", async () => {
  const html = await readFile(new URL("../public/rain-sounds-when-iphone-locked/index.html", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const visibleSteps = [...html.matchAll(/<li><span>0[1-4]<\/span>/g)].length;
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const article = schema["@graph"].find((entry) => entry["@type"] === "TechArticle");
  const howTo = schema["@graph"].find((entry) => entry["@type"] === "HowTo");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^Rain Sounds When iPhone Locks/);
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.equal(h1Count, 1);
  assert.equal(article.dateModified, "2026-08-28");
  assert.equal(article.author.name, "WonderElian");
  assert.equal(visibleSteps, 4);
  assert.equal(howTo.step.length, visibleSteps);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.match(html, /https:\/\/support\.apple\.com\/en-sg\/guide\/iphone\/iphb2cfa052c\/ios/);
  assert.match(html, /Stop Sounds When Locked/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/light-rain\.m4a"/);
  assert.match(html, /data-preview-timer/);
  assert.match(html, /data-analytics-placement="rain_lock_screen_preview"/);
  assert.match(html, /data-analytics-placement="rain_lock_screen_landing"/);
  assert.match(html, /data-analytics-placement="rain_lock_screen_after_preview"/);
  assert.match(software.downloadUrl, /id1461182261\?ppid=67cb8784-2b16-4849-b940-90fdf4d99752$/);
  assert.match(html, /href="\/sleep-sounds\/"/);
  assert.match(html, /href="\/guides\/">Guides<\/a>/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|cure|guarantee/i);
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
  assert.match(html, /Watch a complete 15-minute mountain stream session/);
  assert.match(html, /data-analytics-event="yixiu_focus_path_click"/);
  assert.match(html, /data-analytics-placement="focus_landing_mountain_stream_path"/);
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/focus-sounds\/<\/loc><lastmod>2026-08-29<\/lastmod>/);
});

test("reset intent page offers a real one-tap preview before its matched App Store path", async () => {
  const html = await readFile(new URL("../public/one-minute-reset/index.html", import.meta.url), "utf8");

  assert.match(html, /href="\/discover\.css\?v=20260829-reset-funnel"/);
  assert.match(html, /src="\/discover\.js\?v=20260829-global-share-prompt"/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/sunrise-river\.m4a"/);
  assert.match(html, /data-analytics-placement="reset_after_preview"/);
  assert.match(html, /ppid=6c015245-76ff-4266-8837-5a0ffc289b9c/);
  assert.match(html, /Guided rhythm in the iPhone app/);
  assert.match(html, /use Yixiu on iPhone for the guided rhythm/);
  assert.match(html, /nature-sound preview in your browser/);
  assert.match(html, /Preview a quiet water sound in your browser/);
  assert.doesNotMatch(html, /A visible rhythm|soft expanding motion/);
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
  assert.equal([...html.matchAll(/<iframe[^>]+youtube-nocookie\.com\/embed\/2nJUyIr9EOY/g)].length, 1);
  assert.match(html, /<section class="intent-hero intent-watch-hero"/);
  assert.match(html, /<iframe[^>]+loading="eager"/);
  assert.match(html, /href="\/discover\.css\?v=20260829-video-watch"/);
  assert.equal(schema["@graph"].find((entry) => entry["@type"] === "WebPage").mainEntity["@id"], video["@id"]);
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
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/ocean-waves-for-sleeping\/<\/loc><lastmod>2026-08-29<\/lastmod>/);
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
  assert.equal([...html.matchAll(/<iframe[^>]+youtube-nocookie\.com\/embed\/lfDiI0TAq1c/g)].length, 1);
  assert.match(html, /<section class="intent-hero intent-watch-hero"/);
  assert.match(html, /<iframe[^>]+loading="eager"/);
  assert.match(html, /href="\/discover\.css\?v=20260829-video-watch"/);
  assert.equal(schema["@graph"].find((entry) => entry["@type"] === "WebPage").mainEntity["@id"], video["@id"]);
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
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/ocean-waves-for-focus\/<\/loc><lastmod>2026-08-29<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/mountain-stream-sounds-for-focus\/<\/loc><lastmod>2026-08-29<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/waterfall-sounds-for-noise-masking\/<\/loc><lastmod>2026-08-29<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/river-sounds-for-studying\/<\/loc><lastmod>2026-08-29<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/best-nature-sounds-for-studying\/<\/loc><lastmod>2026-08-29<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/guides\/<\/loc><lastmod>2026-08-31<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/sleep-sounds\/<\/loc><lastmod>2026-08-29<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/best-sleep-sounds\/<\/loc><lastmod>2026-08-29<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/rain-sounds-when-iphone-locked\/<\/loc><lastmod>2026-08-28<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/rain-sounds-for-reading\/<\/loc><lastmod>2026-08-29<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/thunderstorm-sounds-for-sleep\/<\/loc><lastmod>2026-08-31<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/morning-bird-sounds-for-focus\/<\/loc><lastmod>2026-08-29<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/forest-sounds-for-focus\/<\/loc><lastmod>2026-08-29<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/wind-sounds-for-sleeping\/<\/loc><lastmod>2026-08-28<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/rain-sounds-for-studying\/<\/loc><lastmod>2026-08-29<\/lastmod>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/nature-sounds-for-meditation\/<\/loc><lastmod>2026-08-29<\/lastmod>/);
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
  assert.equal([...html.matchAll(/<iframe[^>]+youtube-nocookie\.com\/embed\/lfDiI0TAq1c/g)].length, 1);
  assert.match(html, /<section class="intent-hero intent-watch-hero"/);
  assert.match(html, /<iframe[^>]+loading="eager"/);
  assert.match(html, /href="\/discover\.css\?v=20260829-video-watch"/);
  assert.equal(schema["@graph"].find((entry) => entry["@type"] === "WebPage").mainEntity["@id"], video["@id"]);
  assert.match(software.downloadUrl, /id1461182261\?ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759$/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/river-flow\.m4a"/);
  assert.match(html, /data-analytics-placement="river_study_after_preview"/);
  assert.match(html, /youtube-nocookie\.com\/embed\/lfDiI0TAq1c/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount/);
});

test("study-sound comparison page exposes three real previews and a truthful comparison schema", async () => {
  const html = await readFile(new URL("../public/best-nature-sounds-for-studying/index.html", import.meta.url), "utf8");
  const comparisonImage = await readFile(new URL("../public/assets/yixiu/study-sounds-comparison-pinterest.jpg", import.meta.url));
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const previewCount = [...html.matchAll(/data-audio-preview=/g)].length;
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const article = schema["@graph"].find((entry) => entry["@type"] === "Article");
  const image = schema["@graph"].find((entry) => entry["@type"] === "ImageObject");
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
  assert.equal(article.dateModified, "2026-08-29");
  assert.equal(article.image["@id"], image["@id"]);
  assert.equal(image.width, 1000);
  assert.equal(image.height, 1500);
  assert.match(image.contentUrl, /study-sounds-comparison-pinterest\.jpg$/);
  assert.match(itemList.itemListElement[1].url, /rain-sounds-for-studying\/$/);
  assert.ok(comparisonImage.byteLength < 300_000);
  assert.match(software.downloadUrl, /id1461182261\?ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759$/);
  assert.match(html, /src="\/assets\/yixiu\/study-sounds-comparison-pinterest\.jpg" width="1000" height="1500" loading="lazy"/);
  assert.match(html, /alt="Yixiu study sound guide comparing river for reading and writing, rain for noisy shared rooms, and ocean for repetitive practice"/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/river-flow\.m4a"/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/light-rain\.m4a"/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/ocean-waves\.m4a"/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|guarantee/i);
});

test("sleep-sound comparison page exposes seven real previews and an honest choice path", async () => {
  const html = await readFile(new URL("../public/best-sleep-sounds/index.html", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const previewAssets = [...html.matchAll(/data-audio-preview="([^"]+)"/g)].map((match) => match[1]);
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const collection = schema["@graph"].find((entry) => entry["@type"] === "CollectionPage");
  const itemList = schema["@graph"].find((entry) => entry["@type"] === "ItemList");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^Best Sleep Sounds/);
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.equal(h1Count, 1);
  assert.equal(collection.mainEntity["@id"], itemList["@id"]);
  assert.equal(itemList.itemListElement.length, 7);
  assert.deepEqual(previewAssets, [
    "/assets/yixiu/audio/light-rain.m4a",
    "/assets/yixiu/audio/ocean-waves.m4a",
    "/assets/yixiu/audio/forest-breeze.m4a",
    "/assets/yixiu/audio/distant-thunder.m4a",
    "/assets/yixiu/audio/mountain-wind.m4a",
    "/assets/yixiu/audio/underwater-white-noise.m4a",
    "/assets/yixiu/audio/forest-waterfall.m4a",
  ]);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.match(software.downloadUrl, /id1461182261\?ppid=67cb8784-2b16-4849-b940-90fdf4d99752$/);
  assert.match(html, /rel="canonical" href="https:\/\/yixiu\.wonderelian\.com\/best-sleep-sounds\/"/);
  assert.match(html, /There is no universal best sleep sound/);
  assert.match(html, /data-preview-timer/);
  assert.match(html, /data-analytics-placement="best_sleep_sounds_after_preview"/);
  assert.match(html, /data-ensure-visible="true"/);
  for (const route of ["sleep-sounds", "ocean-waves-for-sleeping", "forest-sounds-for-sleep", "thunderstorm-sounds-for-sleep", "wind-sounds-for-sleeping", "underwater-white-noise-for-sleep", "waterfall-sounds-for-noise-masking"]) {
    assert.match(html, new RegExp(`href="/${route}/"`));
  }
  assert.doesNotMatch(html, /aggregateRating|reviewCount|cure|treat|guarantee|insomnia|anxiety/i);
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

test("white noise study page serves the real focus recording and an honest conversion path", async () => {
  const html = await readFile(new URL("../public/white-noise-for-studying/index.html", import.meta.url), "utf8");
  const hero = await stat(new URL("../public/assets/yixiu/underwater-echo.webp", import.meta.url));
  const audio = await stat(new URL("../public/assets/yixiu/audio/underwater-white-noise.m4a", import.meta.url));
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
  assert.match(title, /^White Noise for Studying/);
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.equal(h1Count, 1);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.match(webpage.url, /white-noise-for-studying\/$/);
  assert.equal(image.width, 941);
  assert.equal(image.height, 1672);
  assert.equal(image.representativeOfPage, true);
  assert.equal(software.image["@id"], image["@id"]);
  assert.equal(software.softwareVersion, "1.5");
  assert.ok(hero.size < 100_000);
  assert.ok(audio.size > 40_000);
  assert.match(image.contentUrl, /underwater-echo\.png$/);
  assert.match(html, /rel="canonical" href="https:\/\/yixiu\.wonderelian\.com\/white-noise-for-studying\/"/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/underwater-white-noise\.m4a"/);
  assert.match(html, /data-preview-timer/);
  assert.match(html, /data-preview-minutes="15"/);
  assert.match(html, /data-preview-minutes="30"/);
  assert.match(html, /data-preview-minutes="60"/);
  assert.match(html, /data-analytics-placement="white_noise_studying_after_preview"/);
  assert.match(software.downloadUrl, /id1461182261\?ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759$/);
  assert.match(html, /href="\/rain-sounds-for-studying\/"/);
  assert.match(html, /href="\/river-sounds-for-studying\/"/);
  assert.match(html, /href="\/underwater-white-noise-for-sleep\/"/);
  assert.match(html, /href="\/guides\/">Guides<\/a>/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|cure|treat|guarantee|ADHD/i);
  assert.match(html, /does not help everyone|No\. Some people/i);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/white-noise-for-studying\/<\/loc><lastmod>2026-08-28<\/lastmod>/);
});

test("nature sounds meditation page serves four real recordings, a timer, and a truthful conversion path", async () => {
  const html = await readFile(new URL("../public/nature-sounds-for-meditation/index.html", import.meta.url), "utf8");
  const hero = await stat(new URL("../public/assets/yixiu/spring-creek.webp", import.meta.url));
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const previewFiles = [...html.matchAll(/data-audio-preview="([^"]+)"/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const webpage = schema["@graph"].find((entry) => entry["@type"] === "WebPage");
  const image = schema["@graph"].find((entry) => entry["@type"] === "ImageObject");
  const audio = schema["@graph"].find((entry) => entry["@type"] === "AudioObject");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^Nature Sounds for Meditation/);
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.equal(h1Count, 1);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.match(webpage.url, /nature-sounds-for-meditation\/$/);
  assert.equal(webpage.mainEntity["@id"], audio["@id"]);
  assert.equal(image.width, 640);
  assert.equal(image.height, 1137);
  assert.equal(image.representativeOfPage, true);
  assert.equal(software.image["@id"], image["@id"]);
  assert.equal(software.softwareVersion, "1.5");
  assert.ok(hero.size < 100_000);
  assert.match(image.contentUrl, /spring-creek\.webp$/);
  assert.match(audio.contentUrl, /sunrise-river\.m4a$/);
  assert.deepEqual(new Set(previewFiles), new Set([
    "/assets/yixiu/audio/sunrise-river.m4a",
    "/assets/yixiu/audio/forest-breeze.m4a",
    "/assets/yixiu/audio/light-rain.m4a",
    "/assets/yixiu/audio/ocean-waves.m4a",
  ]));
  assert.match(html, /data-preview-minutes="15"/);
  assert.match(html, /data-preview-minutes="30"/);
  assert.match(html, /data-preview-minutes="60"/);
  assert.match(html, /data-analytics-placement="meditation_landing_timer"/);
  assert.match(html, /data-analytics-placement="meditation_after_preview"/);
  assert.match(software.downloadUrl, /id1461182261\?ppid=6c015245-76ff-4266-8837-5a0ffc289b9c$/);
  assert.match(html, /href="\/one-minute-reset\/"/);
  assert.match(html, /href="\/forest-sounds-for-focus\/"/);
  assert.match(html, /href="\/ocean-waves-for-sleeping\/"/);
  assert.match(html, /href="\/guides\/">Guides<\/a>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/nature-sounds-for-meditation\/<\/loc><lastmod>2026-08-29<\/lastmod>/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|cure|treat|guarantee|anxiety|insomnia/i);
});

test("20-minute meditation music page serves the complete Still Water track with source and attribution", async () => {
  const html = await readFile(new URL("../public/20-minute-meditation-music/index.html", import.meta.url), "utf8");
  const audioFile = await stat(new URL("../public/assets/yixiu/audio/meditation/still-water.m4a", import.meta.url));
  const hero = await stat(new URL("../public/assets/yixiu/meditation/still-water.jpg", import.meta.url));
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const llms = await readFile(new URL("../public/llms.txt", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const webpage = schema["@graph"].find((entry) => entry["@type"] === "WebPage");
  const image = schema["@graph"].find((entry) => entry["@type"] === "ImageObject");
  const audio = schema["@graph"].find((entry) => entry["@type"] === "AudioObject");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");
  const breadcrumb = schema["@graph"].find((entry) => entry["@type"] === "BreadcrumbList");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^20-Minute Meditation Music/);
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.match(webpage.url, /20-minute-meditation-music\/$/);
  assert.equal(webpage.mainEntity["@id"], audio["@id"]);
  assert.equal(image.width, 1024);
  assert.equal(image.height, 1536);
  assert.equal(image.representativeOfPage, true);
  assert.ok(hero.size > 100_000);
  assert.ok(audioFile.size > 15_000_000);
  assert.match(audio.contentUrl, /audio\/meditation\/still-water\.m4a$/);
  assert.equal(audio.duration, "PT21M20S");
  assert.equal(audio.byArtist.name, "HoliznaCC0");
  assert.equal(audio.isAccessibleForFree, true);
  assert.match(audio.license, /creativecommons\.org\/publicdomain\/zero\/1\.0/);
  assert.equal(software.softwareVersion, "1.5");
  assert.match(software.downloadUrl, /id1461182261\?pt=120014121&ct=yixiu_h5_still_water_20260830&mt=8$/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/meditation\/still-water\.m4a"/);
  assert.match(html, /data-analytics-placement="still_water_meditation_after_preview"/);
  assert.equal(breadcrumb.itemListElement.length, 3);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/20-minute-meditation-music\/<\/loc><lastmod>2026-08-30<\/lastmod>/);
  assert.match(llms, /https:\/\/yixiu\.wonderelian\.com\/20-minute-meditation-music\//);
  assert.match(html, /href="\/nature-sounds-for-meditation\/"/);
  assert.match(html, /href="\/guides\/">Guides<\/a>/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|cure|treat|guarantee|anxiety|insomnia/i);
});

test("1-minute meditation music page serves the complete First Breath track with source and attribution", async () => {
  const html = await readFile(new URL("../public/1-minute-meditation-music/index.html", import.meta.url), "utf8");
  const audioFile = await stat(new URL("../public/assets/yixiu/audio/meditation/first-breath.m4a", import.meta.url));
  const hero = await stat(new URL("../public/assets/yixiu/meditation/first-breath.jpg", import.meta.url));
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const llms = await readFile(new URL("../public/llms.txt", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const webpage = schema["@graph"].find((entry) => entry["@type"] === "WebPage");
  const image = schema["@graph"].find((entry) => entry["@type"] === "ImageObject");
  const audio = schema["@graph"].find((entry) => entry["@type"] === "AudioObject");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");
  const breadcrumb = schema["@graph"].find((entry) => entry["@type"] === "BreadcrumbList");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^1-Minute Meditation Music/);
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.match(webpage.url, /1-minute-meditation-music\/$/);
  assert.equal(webpage.mainEntity["@id"], audio["@id"]);
  assert.equal(image.width, 1024);
  assert.equal(image.height, 1536);
  assert.equal(image.representativeOfPage, true);
  assert.ok(hero.size > 100_000);
  assert.ok(audioFile.size > 500_000);
  assert.match(audio.contentUrl, /audio\/meditation\/first-breath\.m4a$/);
  assert.equal(audio.duration, "PT1M28S");
  assert.equal(audio.byArtist.name, "Yanni Ziangos");
  assert.equal(audio.byArtist.alternateName, "YannZ");
  assert.equal(audio.isAccessibleForFree, true);
  assert.match(audio.license, /creativecommons\.org\/licenses\/by\/4\.0/);
  assert.equal(software.softwareVersion, "1.5");
  assert.match(software.downloadUrl, /id1461182261\?pt=120014121&ct=yixiu_h5_first_breath_20260830&mt=8$/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/meditation\/first-breath\.m4a"/);
  assert.match(html, /data-analytics-placement="first_breath_meditation_after_preview"/);
  assert.equal(breadcrumb.itemListElement.length, 3);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/1-minute-meditation-music\/<\/loc><lastmod>2026-08-30<\/lastmod>/);
  assert.match(llms, /https:\/\/yixiu\.wonderelian\.com\/1-minute-meditation-music\//);
  assert.match(html, /href="\/20-minute-meditation-music\/"/);
  assert.match(html, /href="\/guides\/">Guides<\/a>/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|cure|treat|guarantee|anxiety|insomnia/i);
});

test("quiet pass exposes three anonymous scene-specific gift pages without changing membership", async () => {
  const cases = [
    {
      route: "first-breath",
      canonical: "https://yixiu.wonderelian.com/gift/first-breath/",
      title: "Someone Sent You First Breath — A Quiet Minute | Yixiu",
      image: "/assets/yixiu/meditation/first-breath.jpg",
      audio: "/assets/yixiu/audio/meditation/first-breath.m4a",
      source: "/1-minute-meditation-music/",
      content: "first_breath_gift",
    },
    {
      route: "still-water",
      canonical: "https://yixiu.wonderelian.com/gift/still-water/",
      title: "Someone Sent You Still Water — A Quiet Moment | Yixiu",
      image: "/assets/yixiu/meditation/still-water.jpg",
      audio: "/assets/yixiu/audio/meditation/still-water.m4a",
      source: "/20-minute-meditation-music/",
      content: "still_water_gift",
    },
    {
      route: "window-rain",
      canonical: "https://yixiu.wonderelian.com/gift/window-rain/",
      title: "Someone Sent You Window Rain — A Quiet Moment | Yixiu",
      image: "/assets/yixiu/window-rain.png",
      audio: "/assets/yixiu/audio/light-rain.m4a",
      source: "/sleep-sounds/",
      content: "window_rain_gift",
    },
  ];

  const controller = await readFile(new URL("../public/quiet-pass.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../public/quiet-pass.css", import.meta.url), "utf8");
  assert.match(controller, /crypto\.getRandomValues/);
  assert.match(controller, /gift_qualified_60s/);
  assert.match(controller, /yixiu:playback-progress/);
  assert.match(styles, /prefers-reduced-motion/);

  for (const entry of cases) {
    const html = await readFile(new URL(`../public/gift/${entry.route}/index.html`, import.meta.url), "utf8");
    assert.match(html, new RegExp(`<title>${entry.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<\\/title>`));
    assert.match(html, new RegExp(`rel="canonical" href="${entry.canonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
    assert.match(html, /<meta name="robots" content="noindex,follow" \/>/);
    assert.match(html, new RegExp(`property="og:image" content="https://yixiu\\.wonderelian\\.com${entry.image.replaceAll("/", "\\/")}"`));
    assert.match(html, new RegExp(`data-quiet-pass-audio="${entry.audio.replaceAll("/", "\\/")}"`));
    assert.match(html, new RegExp(`href="${entry.source.replaceAll("/", "\\/")}"`));
    assert.match(html, /data-language-toggle/);
    assert.match(html, /Someone sent you a quiet moment/);
    assert.match(html, /有人送来一段安静/);
    assert.match(html, /No account\. No notifications\./);
    assert.match(html, /src="\/quiet-pass\.js\?v=20260830-quiet-pass"/);
    assert.match(html, /href="\/quiet-pass\.css\?v=20260830-quiet-pass"/);
    assert.match(html, /ct=yixiu_quiet_pass_20260830/);
    assert.match(html, new RegExp(`data-quiet-pass-content="${entry.content}"`));
    assert.doesNotMatch(html, /register|sign up|unlock|reward|membership|member|free month/i);
  }

  const firstBreath = await readFile(new URL("../public/1-minute-meditation-music/index.html", import.meta.url), "utf8");
  const stillWater = await readFile(new URL("../public/20-minute-meditation-music/index.html", import.meta.url), "utf8");
  const windowRain = await readFile(new URL("../public/sleep-sounds/index.html", import.meta.url), "utf8");
  assert.match(firstBreath, /data-quiet-pass-origin="first-breath"/);
  assert.match(firstBreath, /data-quiet-pass-threshold="60"/);
  assert.match(stillWater, /data-quiet-pass-origin="still-water"/);
  assert.match(stillWater, /data-quiet-pass-threshold="180"/);
  assert.match(windowRain, /data-quiet-pass-origin="window-rain"/);
  assert.match(windowRain, /data-quiet-pass-scene-key="window"/);
  assert.match(windowRain, /data-quiet-pass-threshold="60"/);
  assert.match(windowRain, /data-quiet-pass-gift-path="\/gift\/window-rain\/"/);
  assert.match(windowRain, /href="\/quiet-pass\.css\?v=20260831-window-rain"/);
  assert.match(windowRain, /src="\/quiet-pass\.js\?v=20260831-window-rain"/);
  assert.match(firstBreath, /src="\/quiet-pass\.js\?v=20260830-quiet-pass"/);
  assert.match(stillWater, /src="\/quiet-pass\.js\?v=20260830-quiet-pass"/);
});

test("free online sound machine serves 10 real recordings with a truthful timer and conversion path", async () => {
  const html = await readFile(new URL("../public/free-online-sound-machine/index.html", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1].replace("&amp;", "&");
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const previews = [...html.matchAll(/data-audio-preview="([^"]+\.m4a)"/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const webapp = schema["@graph"].find((entry) => entry["@type"] === "WebApplication");
  const itemList = schema["@graph"].find((entry) => entry["@type"] === "ItemList");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.equal(h1Count, 1);
  assert.match(html, /<h1>A free online sound machine for the moment you have\.<\/h1>/);
  assert.equal(previews.length, 11);
  assert.equal(new Set(previews).size, 10);
  for (const preview of previews) await access(new URL(`../public${preview}`, import.meta.url));
  assert.match(html, /data-preview-minutes="15"/);
  assert.match(html, /data-preview-minutes="30"/);
  assert.match(html, /data-preview-minutes="60"/);
  assert.equal(webapp.isAccessibleForFree, true);
  assert.equal(itemList.numberOfItems, 10);
  assert.equal(itemList.itemListElement.length, 10);
  assert.equal(itemList.itemListElement[3].url, "https://yixiu.wonderelian.com/thunderstorm-sounds-for-sleep/");
  assert.equal(itemList.itemListElement[6].url, "https://yixiu.wonderelian.com/waterfall-sounds-for-noise-masking/");
  assert.equal(software.softwareVersion, "1.5");
  assert.equal(faq.mainEntity.length, 4);
  assert.match(html, /ct=yixiu_h5_20260827/);
  assert.match(html, /data-analytics-placement="sound_machine_hero_rain"/);
  assert.match(html, /href="#sounds">Browse all 10 sounds<\/a>/);
  assert.match(html, /data-analytics-placement="sound_machine_after_preview"/);
  assert.match(html, /href="\/thunderstorm-sounds-for-sleep\/">Thunderstorm sounds for sleep guide/);
  assert.match(html, /href="\/waterfall-sounds-for-noise-masking\/">Waterfall sounds for noise masking guide/);
  assert.match(html, /href="\/guides\/">Guides<\/a>/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|cure|treat|guarantee|insomnia/i);

  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/free-online-sound-machine\/<\/loc><lastmod>2026-08-31<\/lastmod>/);
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
  assert.match(title, /^Choose Nature Sounds/);
  assert.equal(h1Count, 1);
  assert.equal(collection.mainEntity["@id"], itemList["@id"]);
  assert.equal(itemList.itemListElement.length, 24);
  assert.equal(itemList.itemListElement[0].name, "Rain Sounds Black Screen");
  assert.equal(faq.mainEntity.length, 4);
  assert.match(software.downloadUrl, /id1461182261$/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/river-flow\.m4a"/);
  assert.match(html, /<h3>Rain sounds black screen<\/h3>/);
  assert.match(html, /15-, 30- or 60-minute timer, then cover the open page with a black screen/);
  assert.match(html, /<h2 id="duration-choice-title">One minute or twenty\?<\/h2>/);
  assert.match(html, /data-analytics-placement="guides_duration_first_breath"/);
  assert.match(html, /data-analytics-placement="guides_duration_still_water"/);
  assert.match(html, /ct=yixiu_h5_20260827/);
  assert.match(html, /data-analytics-placement="guides_duration_choice"/);
  assert.match(html, /assets\/yixiu\/meditation-duration-choice-pinterest\.jpg/);
  assert.match(html, /property="og:image:width" content="1000"/);
  assert.match(html, /property="og:image:height" content="1500"/);
  assert.match(html, /data-share-placement="guides_duration_share"/);
  assert.match(html, /data-pinterest-placement="guides_duration_pinterest"/);
  assert.match(html, /Both complete tracks play free on the web with no account, ads or spoken guidance/);
  assert.equal(faq.mainEntity[3].name, "Should I choose one minute or 20 minutes of meditation music?");
  assert.match(faq.mainEntity[3].acceptedAnswer.text, /Both play free online without an account, ads or spoken guidance/);
  for (const route of ["free-online-sound-machine", "best-sleep-sounds", "sleep-sounds", "rain-sounds-when-iphone-locked", "thunderstorm-sounds-for-sleep", "wind-sounds-for-sleeping", "underwater-white-noise-for-sleep", "ocean-waves-for-sleeping", "forest-sounds-for-sleep", "focus-sounds", "morning-bird-sounds-for-focus", "forest-sounds-for-focus", "rain-sounds-for-reading", "rain-sounds-for-studying", "white-noise-for-studying", "river-sounds-for-studying", "best-nature-sounds-for-studying", "ocean-waves-for-focus", "mountain-stream-sounds-for-focus", "waterfall-sounds-for-noise-masking", "one-minute-reset", "nature-sounds-for-meditation", "1-minute-meditation-music", "20-minute-meditation-music"]) {
    assert.match(html, new RegExp(`href="/${route}/"`));
  }
  assert.doesNotMatch(html, /aggregateRating|reviewCount|guarantee/i);
});

test("every English intent page links back to the guides hub", async () => {
  for (const route of ["free-online-sound-machine", "best-sleep-sounds", "sleep-sounds", "rain-sounds-when-iphone-locked", "thunderstorm-sounds-for-sleep", "wind-sounds-for-sleeping", "underwater-white-noise-for-sleep", "ocean-waves-for-sleeping", "forest-sounds-for-sleep", "focus-sounds", "morning-bird-sounds-for-focus", "forest-sounds-for-focus", "rain-sounds-for-reading", "rain-sounds-for-studying", "white-noise-for-studying", "river-sounds-for-studying", "best-nature-sounds-for-studying", "ocean-waves-for-focus", "mountain-stream-sounds-for-focus", "waterfall-sounds-for-noise-masking", "one-minute-reset", "nature-sounds-for-meditation", "1-minute-meditation-music", "20-minute-meditation-music"]) {
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
  assert.match(title, /^Waterfall Sounds for Sleep & Noise Masking/);
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.equal(h1Count, 1);
  assert.equal(faqQuestions.length, 5);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.equal(image.width, 941);
  assert.equal(image.height, 1672);
  assert.equal(image.representativeOfPage, true);
  assert.match(image.contentUrl, /forest-falls\.webp$/);
  assert.equal(software.image["@id"], image["@id"]);
  assert.match(software.downloadUrl, /id1461182261\?ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759$/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/forest-waterfall\.m4a"/);
  assert.match(html, /data-play-label="Play Waterfall Sounds"/);
  assert.match(html, /data-preview-timer-status/);
  assert.match(html, /Free online preview/);
  assert.match(html, /data-analytics-placement="waterfall_masking_after_preview"/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|cure|treat|guarantee/i);
  assert.match(html, /It does not remove sound or replace hearing protection/);
  assert.match(html, /href="\/focus-sounds\/"/);
  assert.match(html, /href="\/mountain-stream-sounds-for-focus\/"/);
  assert.match(html, /href="\/guides\/">Guides<\/a>/);

  const sleepHtml = await readFile(new URL("../public/sleep-sounds/index.html", import.meta.url), "utf8");
  const guidesHtml = await readFile(new URL("../public/guides/index.html", import.meta.url), "utf8");
  assert.match(sleepHtml, /href="\/waterfall-sounds-for-noise-masking\/">Waterfall sounds for sleep and noise masking<\/a>/);
  assert.match(guidesHtml, /Sleep, focus or masking/);
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
  assert.equal(title, "Thunderstorm Sounds for Sleep — Free Preview | Yixiu");
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.match(description, /^Play free thunderstorm sounds for sleep:/);
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
  assert.match(html, /<h1>Play free thunderstorm sounds for sleep, kept at a distance\.<\/h1>/);
  assert.match(html, /Free browser preview · No account · No ads · iPhone background playback/);
  assert.match(html, /href="\/sleep-sounds\/"/);
  assert.match(html, /href="\/ocean-waves-for-focus\/"/);
  assert.match(html, /href="\/guides\/">Guides<\/a>/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|cure|treat|guarantee/i);
});

test("underwater white noise black screen page keeps its search promise, real recording and Sleep download path aligned", async () => {
  const html = await readFile(new URL("../public/underwater-white-noise-for-sleep/index.html", import.meta.url), "utf8");
  const hero = await stat(new URL("../public/assets/yixiu/underwater-echo.webp", import.meta.url));
  const guides = await readFile(new URL("../public/guides/index.html", import.meta.url), "utf8");
  const llms = await readFile(new URL("../public/llms.txt", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const h1Count = [...html.matchAll(/<h1\b/g)].length;
  const faqQuestions = [...html.matchAll(/<details(?:\s+open)?><summary>([^<]+)<\/summary>/g)].map((match) => match[1]);
  const faqAnswers = [...html.matchAll(/<details(?:\s+open)?><summary>[^<]+<\/summary><p>([^<]+)<\/p><\/details>/g)].map((match) => match[1]);
  const schemaSource = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const schema = JSON.parse(schemaSource);
  const webpage = schema["@graph"].find((entry) => entry["@type"] === "WebPage");
  const image = schema["@graph"].find((entry) => entry["@type"] === "ImageObject");
  const software = schema["@graph"].find((entry) => entry["@type"] === "SoftwareApplication");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.equal(title, "White Noise Black Screen for Sleep — Free, No Ads | Yixiu");
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.match(description, /underwater white noise with a black screen/i);
  assert.equal(h1Count, 1);
  assert.match(html, /<h1>White noise with a black screen for sleep\.<\/h1>/);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.deepEqual(faq.mainEntity.map((entry) => entry.name), faqQuestions);
  assert.deepEqual(faq.mainEntity.map((entry) => entry.acceptedAnswer.text), faqAnswers);
  assert.equal(faqQuestions[0], "Are these black-screen white noise sounds free and ad-free?");
  assert.match(webpage.url, /underwater-white-noise-for-sleep\/$/);
  assert.match(webpage.description, /black screen/i);
  assert.equal(image.width, 941);
  assert.equal(image.height, 1672);
  assert.equal(image.representativeOfPage, true);
  assert.equal(software.image["@id"], image["@id"]);
  assert.equal(software.softwareVersion, "1.5");
  assert.ok(hero.size < 100_000);
  assert.match(image.contentUrl, /underwater-echo\.png$/);
  assert.match(html, /href="\/discover\.css\?v=20260829-white-noise-dark-screen"/);
  assert.match(html, /src="\/discover\.js\?v=20260829-global-share-prompt"/);
  assert.match(html, /<source srcset="\/assets\/yixiu\/underwater-echo\.webp" type="image\/webp"/);
  assert.match(html, /data-preview-timer/);
  assert.match(html, /data-preview-minutes="15"/);
  assert.match(html, /data-preview-minutes="30"/);
  assert.match(html, /data-preview-minutes="60"/);
  assert.match(software.downloadUrl, /id1461182261\?ppid=67cb8784-2b16-4849-b940-90fdf4d99752$/);
  assert.match(html, /rel="canonical" href="https:\/\/yixiu\.wonderelian\.com\/underwater-white-noise-for-sleep\/"/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/underwater-white-noise\.m4a"/);
  assert.match(html, /data-dark-screen-toggle[^>]*disabled/);
  assert.match(html, /data-analytics-placement="underwater_white_noise_dark_screen"/);
  assert.match(html, /data-dark-screen-overlay[^>]*hidden/);
  assert.match(html, />Black Screen<\/span><\/button>/);
  assert.match(html, /The browser black-screen mode covers this open page while the white noise and timer keep running\./);
  assert.match(html, /For physical iPhone lock-screen playback, continue in Yixiu\./);
  assert.match(html, /data-analytics-placement="underwater_white_noise_after_preview"/);
  assert.match(html, /href="\/sleep-sounds\/"/);
  assert.match(html, /href="\/thunderstorm-sounds-for-sleep\/"/);
  assert.match(html, /href="\/guides\/">Guides<\/a>/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|cure|treat|guarantee/i);
  assert.match(guides, /href="\/underwater-white-noise-for-sleep\/"[^>]*><small>Low, steady texture<\/small><h3>White noise black screen<\/h3>/);
  assert.match(llms, /\[White noise black screen for sleep\]\(https:\/\/yixiu\.wonderelian\.com\/underwater-white-noise-for-sleep\/\)/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/underwater-white-noise-for-sleep\/<\/loc><lastmod>2026-08-29<\/lastmod>/);
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
  assert.match(html, /href="\/forest-sounds-for-sleep\/"/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|cure|treat|guarantee/i);
});

test("forest sleep page serves real forest ambience, timer, and an aligned Sleep App Store path", async () => {
  const html = await readFile(new URL("../public/forest-sounds-for-sleep/index.html", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  const hero = await stat(new URL("../public/assets/yixiu/sunny-valley.webp", import.meta.url));
  const audio = await stat(new URL("../public/assets/yixiu/audio/forest-breeze.m4a", import.meta.url));
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
  assert.match(title, /^Forest Sounds for Sleep/);
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.match(description, /real forest sounds for sleeping/i);
  assert.equal(h1Count, 1);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.match(webpage.url, /forest-sounds-for-sleep\/$/);
  assert.equal(image.width, 941);
  assert.equal(image.height, 1672);
  assert.equal(image.representativeOfPage, true);
  assert.equal(software.image["@id"], image["@id"]);
  assert.match(image.contentUrl, /sunny-valley\.png$/);
  assert.ok(hero.size < 100_000);
  assert.ok(audio.size > 0);
  assert.match(software.downloadUrl, /id1461182261\?ppid=67cb8784-2b16-4849-b940-90fdf4d99752$/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/forest-breeze\.m4a"/);
  assert.match(html, /<source srcset="\/assets\/yixiu\/sunny-valley\.webp" type="image\/webp"/);
  assert.match(html, /data-scene="valley"/);
  assert.match(html, /data-preview-timer/);
  assert.match(html, /data-preview-minutes="15"/);
  assert.match(html, /data-preview-minutes="30"/);
  assert.match(html, /data-preview-minutes="60"/);
  assert.match(html, /data-analytics-placement="forest_sleep_preview"/);
  assert.match(html, /data-analytics-placement="forest_sleep_landing"/);
  assert.match(html, /data-analytics-placement="forest_sleep_after_preview"/);
  assert.match(html, /href="\/sleep-sounds\/"/);
  assert.match(html, /href="\/wind-sounds-for-sleeping\/"/);
  assert.match(html, /href="\/ocean-waves-for-sleeping\/"/);
  assert.match(html, /href="\/forest-sounds-for-focus\/"/);
  assert.match(html, /href="\/guides\/">Guides<\/a>/);
  assert.doesNotMatch(html, /aggregateRating|reviewCount|cure|treat|guarantee|fall asleep faster/i);
  assert.match(html, /not a promise of better sleep/i);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/forest-sounds-for-sleep\/<\/loc><lastmod>2026-08-28<\/lastmod>/);
});

test("wind sleep page serves real mountain wind and keeps its no-music bedtime promise aligned", async () => {
  const html = await readFile(new URL("../public/wind-sounds-for-sleeping/index.html", import.meta.url), "utf8");
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
  const video = schema["@graph"].find((entry) => entry["@type"] === "VideoObject");
  const faq = schema["@graph"].find((entry) => entry["@type"] === "FAQPage");

  assert.ok(title.length >= 50 && title.length <= 60);
  assert.match(title, /^Wind Sounds for Sleeping/);
  assert.ok(description.length >= 150 && description.length <= 160);
  assert.equal(h1Count, 1);
  assert.equal(faqQuestions.length, 4);
  assert.equal(faq.mainEntity.length, faqQuestions.length);
  assert.ok(faq.mainEntity.every((entry) => faqQuestions.includes(entry.name)));
  assert.match(webpage.url, /wind-sounds-for-sleeping\/$/);
  assert.equal(image.width, 1000);
  assert.equal(image.height, 1500);
  assert.equal(image.representativeOfPage, true);
  assert.equal(software.image["@id"], image["@id"]);
  assert.match(image.contentUrl, /snow-wind-pinterest-2x3\.jpg$/);
  assert.equal(software.softwareVersion, "1.5");
  assert.equal(video.uploadDate, "2026-08-26");
  assert.equal(video.duration, "PT21S");
  assert.match(video.thumbnailUrl, /iMG8YanRAnA\/maxresdefault\.jpg$/);
  assert.match(video.contentUrl, /iMG8YanRAnA$/);
  assert.match(html, /youtube-nocookie\.com\/embed\/iMG8YanRAnA/);
  assert.match(html, /class="intent-video intent-video-short"/);
  assert.match(software.downloadUrl, /id1461182261\?ppid=67cb8784-2b16-4849-b940-90fdf4d99752$/);
  assert.match(html, /data-audio-preview="\/assets\/yixiu\/audio\/mountain-wind\.m4a"/);
  assert.match(html, /data-analytics-placement="wind_sleep_after_preview"/);
  assert.match(html, /href="\/sleep-sounds\/"/);
  assert.match(html, /href="\/ocean-waves-for-sleeping\/"/);
  assert.match(html, /href="\/thunderstorm-sounds-for-sleep\/"/);
  assert.match(html, /href="\/guides\/">Guides<\/a>/);
  assert.match(sitemap, /https:\/\/yixiu\.wonderelian\.com\/wind-sounds-for-sleeping\/<\/loc><lastmod>2026-08-28<\/lastmod>/);
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

test("llms.txt exposes the existing Yixiu collection without unrelated products or outcome claims", async () => {
  const llms = await readFile(new URL("../public/llms.txt", import.meta.url), "utf8");
  const links = [...llms.matchAll(/\[[^\]]+\]\((https:\/\/[^)]+)\)/g)].map((match) => match[1]);
  const yixiuLinks = links.filter((url) => url.startsWith("https://yixiu.wonderelian.com/"));

  assert.match(llms, /^# Yixiu\n\n> Free nature sounds and white noise/m);
  assert.match(llms, /^## Quick request routing$/m);
  assert.match(llms, /^## Accuracy boundaries for assistants$/m);
  assert.match(llms, /Prefer the most specific human-facing Yixiu page listed below/);
  assert.match(llms, /Free rain with a black browser screen: use \*\*Rain sounds black screen\*\*/);
  assert.match(llms, /Rain that continues after physically locking an iPhone/);
  assert.match(llms, /Browser black-screen mode covers the open web page/);
  assert.match(llms, /Do not infer downloads, reviews, ratings, prices, subscriptions, or outcomes/);
  assert.match(llms, /^## Sleep$/m);
  assert.match(llms, /^## Focus and Study$/m);
  assert.match(llms, /^## Meditation and Reset$/m);
  assert.match(llms, /^## Optional$/m);
  assert.match(llms, /https:\/\/apps\.apple\.com\/us\/app\/yixiu-white-noise-sleep\/id1461182261/);
  assert.match(llms, /https:\/\/yixiu\.wonderelian\.com\/guides\//);
  assert.match(llms, /https:\/\/yixiu\.wonderelian\.com\/best-sleep-sounds\//);
  assert.match(llms, /https:\/\/yixiu\.wonderelian\.com\/free-online-sound-machine\//);
  assert.match(llms, /https:\/\/yixiu\.wonderelian\.com\/nature-sounds-for-meditation\//);
  assert.match(llms, /https:\/\/yixiu\.wonderelian\.com\/one-minute-reset\//);
  assert.ok(yixiuLinks.length >= 22);
  assert.equal(new Set(links).size, links.length);
  assert.ok(links.every((url) => url.startsWith("https://yixiu.wonderelian.com/") || url.startsWith("https://apps.apple.com/")));
  assert.doesNotMatch(llms, /maker\.|onelaser\.|wendao\.|style atlas|aggregateRating|reviewCount|cure|treat|guarantee|insomnia/i);
});

test("production deploy acceptance checks the HTTPS origin instead of its redirect", async () => {
  const script = await readFile(
    new URL("../scripts/deploy-production-nginx.sh", import.meta.url),
    "utf8",
  );

  assert.match(script, /--resolve 'yixiu\.wonderelian\.com:443:127\.0\.0\.1'/);
  assert.match(script, /https:\/\/yixiu\.wonderelian\.com\//);
  assert.match(script, /Free nature sounds for sleep, focus and study/);
  assert.match(script, /rel="describedby" href="\/llms\.txt" type="text\/plain"/);
  assert.match(script, /OAI-SearchBot\/1\.0/);
  assert.match(script, /forest-sounds-for-focus\/index\.html/);
  assert.match(script, /forest-sounds-for-sleep\/index\.html/);
  assert.match(script, /assets\/yixiu\/audio\/forest-breeze\.m4a/);
  assert.match(script, /data-analytics-placement=\"forest_sleep_preview\"/);
  assert.match(script, /underwater-white-noise-for-sleep\/index\.html/);
  assert.match(script, /assets\/yixiu\/audio\/underwater-white-noise\.m4a/);
  assert.match(script, /White Noise Black Screen for Sleep/);
  assert.match(script, /discover\.js\?v=20260829-global-share-prompt/);
  assert.match(script, /data-analytics-placement="underwater_white_noise_dark_screen"/);
  assert.match(script, /https:\/\/yixiu\.wonderelian\.com\/underwater-white-noise-for-sleep\//);
  assert.match(script, /Keep rain playing on iPhone/);
  assert.match(script, /data-ensure-visible="true"/);
  assert.match(script, /grep -F 'dataset\.ensureVisible'/);
  assert.match(script, /discover\.css\?v=20260829-sleep-share/);
  assert.match(script, /discover\.js\?v=20260829-global-share-prompt/);
  assert.match(script, /data-share-label="Send this rain to someone"/);
  assert.match(script, /Know someone who needs a quieter night\?/);
  assert.match(script, /grep -F 'shareDefaultLabel'/);
  assert.match(script, /grep -F '\.intent-share-copy'/);
  assert.match(script, /Know someone who would enjoy this sound\?/);
  assert.match(script, /Send this sound to someone/);
  assert.match(script, /discover\.js\?v=20260829-global-share-prompt/);
  assert.match(script, /https:\/\/yixiu\.wonderelian\.com\/sleep-sounds\//);
  assert.match(script, /best-sleep-sounds\/index\.html/);
  assert.match(script, /free-online-sound-machine\/index\.html/);
  assert.match(script, /data-analytics-placement="sound_machine_after_preview"/);
  assert.match(script, /data-analytics-placement="best_sleep_sounds_after_preview"/);
  assert.match(script, /https:\/\/yixiu\.wonderelian\.com\/best-sleep-sounds\//);
  assert.equal((script.match(/data-analytics-placement="focus_landing_mountain_stream_path"/g) || []).length, 3);
  assert.match(script, /https:\/\/yixiu\.wonderelian\.com\/focus-sounds\//);
  assert.match(script, /https:\/\/yixiu\.wonderelian\.com\/discover\.js/);
  assert.match(script, /ocean-waves-for-sleeping\/index\.html/);
  assert.match(script, /assets\/yixiu\/audio\/ocean-waves\.m4a/);
  assert.match(script, /rain-sounds-for-studying\/index\.html/);
  assert.match(script, /study-sounds-comparison-pinterest\.jpg/);
  assert.match(script, /white-noise-for-studying\/index\.html/);
  assert.match(script, /assets\/yixiu\/audio\/light-rain\.m4a/);
  assert.match(script, /data-analytics-placement=\"rain_studying_preview\"/);
  assert.match(script, /data-analytics-placement=\"white_noise_studying_preview\"/);
  assert.match(script, /nature-sounds-for-meditation\/index\.html/);
  assert.match(script, /assets\/yixiu\/spring-creek\.webp/);
  assert.match(script, /assets\/yixiu\/audio\/sunrise-river\.m4a/);
  assert.match(script, /data-analytics-placement=\"meditation_landing_timer\"/);
  assert.match(script, /discover\.css\?v=20260830-duration-choice/);
  assert.match(script, /discover\.js\?v=20260830-duration-share/);
  assert.match(script, /duration-choice-title/);
  assert.equal((script.match(/data-analytics-placement=\"guides_duration_first_breath\"/g) || []).length, 2);
  assert.equal((script.match(/data-analytics-placement=\"guides_duration_still_water\"/g) || []).length, 2);
  assert.equal((script.match(/data-analytics-placement=\"guides_duration_choice\"/g) || []).length, 3);
  assert.match(script, /https:\/\/yixiu\.wonderelian\.com\/guides\//);
  assert.match(script, /1-minute-meditation-music\/index\.html/);
  assert.match(script, /assets\/yixiu\/audio\/meditation\/first-breath\.m4a/);
  assert.match(script, /ct=yixiu_h5_first_breath_20260830/);
  assert.match(script, /data-analytics-placement=\"first_breath_meditation_after_preview\"/);
  assert.equal((script.match(/softwareVersion[^\n]+1\\\.5[^\n]+-eq 26/g) ?? []).length, 2);
  assert.equal((script.match(/describedby[^\n]+llms\.txt[^\n]+-eq 30/g) ?? []).length, 2);
  assert.equal((script.match(/global-share-prompt[^\n]+-eq 22/g) ?? []).length, 2);
  assert.equal((script.match(/quiet-pass-progress[^\n]+-eq 2/g) ?? []).length, 2);
  assert.match(script, /meditation-duration-choice-pinterest\.jpg/);
  assert.match(script, /data-share-placement=\"guides_duration_share\"/);
  assert.match(script, /data-pinterest-placement=\"guides_duration_pinterest\"/);
  assert.match(script, /20-minute-meditation-music\/index\.html/);
  assert.match(script, /assets\/yixiu\/audio\/meditation\/still-water\.m4a/);
  assert.match(script, /ct=yixiu_h5_still_water_20260830/);
  assert.match(script, /data-analytics-placement=\"still_water_meditation_after_preview\"/);
  assert.match(script, /gift\/first-breath\/index\.html/);
  assert.match(script, /gift\/still-water\/index\.html/);
  assert.match(script, /gift\/window-rain\/index\.html/);
  assert.match(script, /Someone Sent You First Breath/);
  assert.match(script, /Someone Sent You Still Water/);
  assert.match(script, /Someone Sent You Window Rain/);
  assert.match(script, /data-quiet-pass-origin=\"first-breath\"/);
  assert.match(script, /data-quiet-pass-threshold=\"180\"/);
  assert.match(script, /data-quiet-pass-origin=\"window-rain\"/);
  assert.match(script, /data-quiet-pass-audio=\"\/assets\/yixiu\/audio\/light-rain\.m4a\"/);
  assert.match(script, /ct=yixiu_quiet_pass_20260830/);
  assert.match(script, /gift_qualified_60s/);
  assert.match(script, /https:\/\/yixiu\.wonderelian\.com\/gift\/first-breath\//);
  assert.match(script, /https:\/\/yixiu\.wonderelian\.com\/gift\/still-water\//);
  assert.match(script, /https:\/\/yixiu\.wonderelian\.com\/gift\/window-rain\//);
  assert.match(script, /site_path\/llms\.txt/);
  assert.match(script, /deploy_target\/llms\.txt/);
  assert.match(script, /https:\/\/yixiu\.wonderelian\.com\/llms\.txt/);
  assert.match(script, /Waterfall Sounds for Sleep &amp; Noise Masking/);
  assert.match(script, /discover\.css\?v=20260829-waterfall-search/);
  assert.match(script, /discover\.js\?v=20260829-global-share-prompt/);
  assert.doesNotMatch(script, /-H 'Host: yixiu\.wonderelian\.com' http:\/\/127\.0\.0\.1\//);
});
