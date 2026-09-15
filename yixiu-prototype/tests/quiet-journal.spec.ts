import { expect, test } from "@playwright/test";
import entries from "../src/data/quiet-journal.json" with { type: "json" };

test("journal contains fifteen complete bilingual notes across four categories", () => {
  expect(entries).toHaveLength(15);
  expect(new Set(entries.map(entry => entry.slug)).size).toBe(15);
  for (const [category, count] of Object.entries({ sleep: 4, focus: 4, reset: 4, guide: 3 })) {
    expect(entries.filter(entry => entry.category === category)).toHaveLength(count);
  }
  for (const entry of entries) for (const language of ["zh", "en"] as const) {
    expect(entry[language].sections.length).toBeGreaterThanOrEqual(4);
    expect(entry[language].sections.every(section => section.body.length > 45)).toBeTruthy();
    expect(entry[language].seoTitle).toBeTruthy();
    expect(entry[language].metaDescription).toBeTruthy();
  }
});

test("every bilingual article has a real page, matching metadata and free practice target", async ({ request }) => {
  for (const entry of entries) for (const language of ["zh", "en"] as const) {
    const path = `/journal/${language === "zh" ? "zh/" : ""}${entry.slug}/`;
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html).toContain(`<h1>${entry[language].title}</h1>`);
    expect(html).toContain(`rel="canonical" href="https://yixiu.wonderelian.com${path}"`);
    expect(html).toContain(`hreflang="zh-Hans" href="https://yixiu.wonderelian.com/journal/zh/${entry.slug}/"`);
    expect(html).toContain(`hreflang="en" href="https://yixiu.wonderelian.com/journal/${entry.slug}/"`);
    expect(html).toContain(`scene=${entry.scene}&amp;lang=${language}`);
    expect(html).toContain(entry.action === "focus" ? "&amp;tab=focus" : 'class="quiet-practice"');
    expect((await request.get(entry.image)).status()).toBe(200);
  }
});

test("fifteen-card drawer filters correctly and the final note remains reachable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 });
  await page.goto("/?lang=zh&scene=rain");
  await page.getByRole("button", { name: "我的 ME", exact: true }).click();
  await page.getByRole("button", { name: "一休日常 睡前、专注与片刻放松" }).click();
  const drawer = page.getByRole("dialog", { name: "一休日常" });
  for (const [label, category] of [["睡前", "sleep"], ["专注", "focus"], ["片刻", "reset"], ["使用指南", "guide"]]) {
    await drawer.getByRole("button", { name: label, exact: true }).click();
    await expect(drawer.locator(".quiet-card")).toHaveCount(entries.filter(entry => entry.category === category).length);
  }
  await drawer.getByRole("button", { name: "全部", exact: true }).click();
  await expect(drawer.locator(".quiet-card")).toHaveCount(15);
  await drawer.locator(".quiet-card").last().click();
  await expect(drawer.locator("h3")).toHaveText(entries.at(-1)!.zh.title);
});

test("product guide exposes verifiable free access without unlocking Plus", async ({ page }) => {
  await page.goto("/?lang=zh&scene=ocean");
  await page.getByRole("button", { name: "我的 ME", exact: true }).click();
  await page.getByRole("button", { name: "一休日常 睡前、专注与片刻放松" }).click();
  const drawer = page.getByRole("dialog", { name: "一休日常" });
  await drawer.getByRole("button", { name: "使用指南", exact: true }).click();
  await drawer.locator(".quiet-card").filter({ hasText: "一休免费版能做什么？" }).click();
  await expect(drawer.getByRole("link", { name: "一休 App Store 官方介绍" })).toHaveAttribute("href", "https://apps.apple.com/app/id1461182261");
  await drawer.getByRole("button", { name: "先听一段免费大海声" }).click();
  await expect(page.locator(".yixiu-app")).toHaveAttribute("data-scene", "ocean");
  await expect(page.locator(".yixiu-app")).toHaveClass(/is-audio-playing/);
  await page.goto("/journal/yixiu-free-and-plus-guide/");
  await expect(page.getByRole("heading", { name: "What does Yixiu Plus add?" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Keep reading" }).getByRole("link")).toHaveCount(2);
  const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent() || "{}");
  expect(schema.citation).toContain("https://apps.apple.com/app/id1461182261");
  await expect(page.getByRole("link", { name: "Official Yixiu App Store listing" })).toHaveAttribute("href", schema.citation[0]);
});

test("journal navigation preserves playback, closes with Escape and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?lang=zh&scene=ocean");
  await page.locator(".primary-transport").click();
  await expect(page.locator(".yixiu-app")).toHaveClass(/is-audio-playing/);
  await page.getByRole("button", { name: "我的 ME", exact: true }).click();
  const entry = page.getByRole("button", { name: "一休日常 睡前、专注与片刻放松" });
  await entry.click();
  const drawer = page.getByRole("dialog", { name: "一休日常" });
  await expect(drawer.locator(".quiet-card")).toHaveCount(entries.length);
  await drawer.locator(".quiet-card").filter({ hasText: "睡前，给今天留一个雨声的结尾" }).click();
  await expect(drawer.getByRole("heading", { name: "先把下一件事放一放" })).toBeVisible();
  await expect(page.locator(".yixiu-app")).toHaveClass(/is-audio-playing/);
  await expect(page.locator(".yixiu-app")).toHaveAttribute("data-scene", "ocean");
  await drawer.getByRole("button", { name: "返回", exact: true }).click();
  await expect(drawer.locator(".quiet-card")).toHaveCount(entries.length);
  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
  await expect(entry).toBeFocused();
  await page.getByRole("button", { name: "声音 SOUNDS", exact: true }).click();
  await page.locator(".primary-transport").click();
});

test("Me entry filters notes and launches free one-minute Focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 });
  await page.goto("/?lang=en&scene=ocean");
  await page.getByRole("button", { name: "Me 我的", exact: true }).click();
  await page.getByRole("button", { name: "Quiet Journal Notes for rest, focus and a small pause" }).click();
  const drawer = page.getByRole("dialog", { name: "Quiet Journal" });
  await drawer.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(drawer.locator(".quiet-card")).toHaveCount(entries.filter(entry => entry.category === "reset").length);
  await drawer.locator(".quiet-card").filter({ hasText: "A minute between things" }).click();
  await drawer.getByRole("button", { name: "Open one-minute Focus" }).click();
  await expect(drawer).toBeHidden();
  await expect(page.locator(".yixiu-app")).toHaveAttribute("data-tab", "focus");
  await expect(page.getByRole("button", { name: "Start 1 minute", exact: true })).toBeVisible();
});

test("bilingual public article keeps attribution through language and practice links", async ({ page }) => {
  await page.goto("/journal/a-minute-between-things/?utm_source=pinterest&utm_campaign=one_minute_reset&utm_content=journal_test");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A minute between things");
  await page.getByRole("link", { name: "中文", exact: true }).click();
  await expect(page).toHaveURL(/journal\/zh\/a-minute-between-things\//);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("在两件事之间，留一分钟给自己");
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute("href", "https://yixiu.wonderelian.com/journal/zh/a-minute-between-things/");
  await page.getByRole("link", { name: "打开一分钟静心" }).click();
  await expect(page).toHaveURL(/utm_source=pinterest/);
  await expect(page.locator(".yixiu-app")).toHaveAttribute("data-tab", "focus");
  await expect(page.locator(".yixiu-app")).toHaveAttribute("data-language", "zh");
  await page.getByRole("button", { name: "声音 SOUNDS", exact: true }).click();
  await page.reload();
  await expect(page.locator(".yixiu-app")).toHaveAttribute("data-tab", "sounds");
});

for (const size of [{ width: 320, height: 640 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }]) {
  test(`journal remains readable at ${size.width}px`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.goto("/?lang=en");
    await page.getByRole("button", { name: "Me 我的", exact: true }).click();
    await page.getByRole("button", { name: "Quiet Journal Notes for rest, focus and a small pause" }).click();
    const drawer = page.getByRole("dialog", { name: "Quiet Journal" });
    await expect(drawer).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await expect(drawer.locator(".quiet-card").first()).toBeVisible();
    const thumbnail = await drawer.locator(".quiet-card img").first().boundingBox();
    expect(thumbnail?.height).toBeLessThanOrEqual(90);
    await drawer.locator(".quiet-card").filter({ hasText: "Is Yixiu free?" }).click();
    const title = await drawer.locator("h3").boundingBox();
    const cover = await drawer.locator(".quiet-article-cover").boundingBox();
    const coverImage = await drawer.locator(".quiet-article-image").boundingBox();
    expect(title!.y + title!.height).toBeLessThan(cover!.y);
    expect(title!.y + title!.height).toBeLessThan(size.height);
    expect(coverImage!.height).toBeLessThanOrEqual(192);
    expect(Math.abs(coverImage!.height - cover!.height)).toBeLessThan(1);

    await page.goto("/journal/zh/");
    await expect(page.locator(".quiet-card")).toHaveCount(entries.length);
    expect((await page.locator(".quiet-card img").first().boundingBox())!.height).toBeLessThanOrEqual(90);
    await expect(page.locator('link[href="/journal.css?v=20260913-reading"]')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });
}
