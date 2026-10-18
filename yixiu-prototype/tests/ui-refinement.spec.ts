import { expect, test } from "@playwright/test";
import path from "node:path";

const root = process.env.YIXIU_UI_URL || "";
const phase = process.env.YIXIU_UI_PHASE || "local";
const output = path.resolve("../qa/h5-refinement-20261018");
declare global { interface Window { refinementAudio: HTMLMediaElement[] } }

for (const [width, height, lang] of [[390, 844, "zh"], [320, 740, "en"], [1280, 900, "zh"], [844, 390, "en"]] as const) {
  test(`refined H5 ${width}x${height} ${lang}`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.addInitScript(() => {
      // Exercise the browser/WeChat preview path, not an OS-owned share sheet.
      Object.defineProperty(navigator, "share", { value: undefined, configurable: true });
      window.refinementAudio = [];
      const play = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () {
        if (!window.refinementAudio.includes(this)) window.refinementAudio.push(this);
        return play.call(this);
      };
    });
    await page.setViewportSize({ width, height });
    await page.goto(`${root}/?scene=rain&lang=${lang}`);
    const decline = page.getByRole("button", { name: lang === "zh" ? "暂不分享" : "Not now", exact: true });
    if (await decline.isVisible()) await decline.click();
    await expect(page.locator(".brand-app-icon")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await expect.poll(() => page.locator(".scene-current-backdrop").evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    const nav = page.getByRole("navigation", { name: lang === "zh" ? "主导航" : "Main navigation" });
    await expect(nav.getByRole("button")).toHaveText(lang === "zh" ? ["声音", "静心", "我的"] : ["Sounds", "Focus", "Me"]);
    expect(await nav.evaluate(el => Math.round(el.getBoundingClientRect().width))).toBe(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await expect(page.getByRole("button", { name: lang === "zh" ? "播放" : "Play", exact: true })).toBeInViewport();
    await page.screenshot({ path: `${output}/${phase}-${width}-${lang}-home.png`, animations: "disabled" });

    if (width === 390) {
      await page.getByRole("button", { name: "播放", exact: true }).click();
      await expect.poll(() => page.evaluate(() => window.refinementAudio.some(audio => !audio.paused && audio.currentTime > 0.2))).toBe(true);
      await nav.getByRole("button", { name: "静心", exact: true }).click();
      await expect(page.locator(".focus-screen h1")).toHaveText("屋檐雨");
      expect(await page.evaluate(() => window.refinementAudio.length)).toBe(1);
      expect(await page.evaluate(() => !window.refinementAudio[0].paused)).toBe(true);
      await nav.getByRole("button", { name: "声音", exact: true }).click();
      await page.locator(".sound-library-entry button").click();
      await page.locator('[data-scene-id="cloudBlanket"]').click();
      await expect(page.getByRole("dialog", { name: "升级一休 Plus", exact: true })).toBeVisible();
      expect(await page.evaluate(() => !window.refinementAudio[0].paused)).toBe(true);
      await page.locator(".plus-upgrade-close").click();
      const openLibrary = page.getByRole("dialog", { name: "声音库", exact: true });
      if (await openLibrary.isVisible()) await openLibrary.getByRole("button", { name: "关闭声音库", exact: true }).click();
      await page.getByRole("button", { name: "暂停", exact: true }).click();
      await page.locator(".header-share-button").click();
      await expect(page.locator(".share-card-dialog img")).toBeVisible({ timeout: 15_000 });
      await page.locator(".share-card-close").click();
    }

    await page.locator(".sound-library-entry button").click();
    const library = page.getByRole("dialog", { name: lang === "zh" ? "声音库" : "Sound library" });
    await expect(library).toBeVisible();
    await expect(library.locator(".scene-grid article")).toHaveCount(54);
    await library.getByRole("button", { name: lang === "zh" ? "搜索声音" : "Search sounds", exact: true }).click();
    const search = library.getByRole("searchbox");
    expect(await search.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
    await search.fill("Moon Anchorage");
    await expect(library.locator(".scene-grid article")).toHaveCount(1);
    await search.fill("");
    await library.getByRole("combobox").selectOption("free");
    await expect(library.locator(".scene-grid article")).toHaveCount(27);
    const headerBefore = await library.locator(".library-title-row").boundingBox();
    await library.locator(".scene-grid").evaluate(el => { el.scrollTop = 400; });
    expect((await library.locator(".library-title-row").boundingBox())!.y).toBe(headerBefore!.y);
    await library.locator(".scene-grid").evaluate(el => { el.scrollTop = 0; });
    await expect.poll(() => library.locator(".scene-grid").evaluate(el => {
      const bounds = el.getBoundingClientRect();
      return [...el.querySelectorAll("img")].filter(img => {
        const r = img.getBoundingClientRect(); return r.bottom > bounds.top && r.top < bounds.bottom;
      }).every(img => img.complete && img.naturalWidth > 0);
    })).toBe(true);
    await page.screenshot({ path: `${output}/${phase}-${width}-${lang}-library.png`, animations: "disabled" });
    await library.getByRole("button", { name: lang === "zh" ? "关闭声音库" : "Close sound library", exact: true }).click();

    await nav.getByRole("button", { name: lang === "zh" ? "静心" : "Focus", exact: true }).click();
    await expect(page.locator(".focus-screen")).toBeVisible();
    await page.screenshot({ path: `${output}/${phase}-${width}-${lang}-focus.png`, animations: "disabled" });
    await nav.getByRole("button", { name: lang === "zh" ? "我的" : "Me", exact: true }).click();
    await expect(page.locator(".me-screen")).toBeVisible();
    await page.screenshot({ path: `${output}/${phase}-${width}-${lang}-me.png`, animations: "disabled" });
    await page.locator(".me-screen").evaluate(el => { el.scrollTop = el.scrollHeight; });
    const last = page.locator(".me-works a").last();
    await expect(last).toBeInViewport();
    expect((await last.boundingBox())!.y + (await last.boundingBox())!.height).toBeLessThanOrEqual((await nav.boundingBox())!.y);
  });
}
