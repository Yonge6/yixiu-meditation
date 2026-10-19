import { expect, test, type Page } from "@playwright/test";

const root = process.env.YIXIU_UI_URL || "";
type Language = "zh" | "en";

declare global { interface Window { everydayRestAudio: HTMLMediaElement[] } }

async function open(page: Page, language: Language, query = "", history = false, focusSound = false) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(({ history, focusSound }) => {
    localStorage.clear();
    localStorage.setItem("yixiu.focusSoundEnabled", JSON.stringify(focusSound));
    if (history) {
      localStorage.setItem("yixiu.favorites", JSON.stringify(["rain"]));
      localStorage.setItem("yixiu.recentScenes", JSON.stringify(["rain"]));
      localStorage.setItem("yixiu.practiceJournal.v1", JSON.stringify([
        { id: "rest-review-completed", sceneID: "rain", kind: "breathing", seconds: 60, completedAt: Date.now() - 60_000 },
      ]));
    }
    window.everydayRestAudio = [];
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (!window.everydayRestAudio.includes(this)) window.everydayRestAudio.push(this);
      return play.call(this);
    };
  }, { history, focusSound });
  await page.goto(`${root}/?scene=rain&lang=${language}${query}`);
  const decline = page.getByRole("button", { name: language === "zh" ? "暂不分享" : "Not now", exact: true });
  if (await decline.isVisible()) await decline.click();
}

function nav(page: Page, language: Language) {
  return page.getByRole("navigation", { name: language === "zh" ? "主导航" : "Main navigation" });
}

for (const language of ["zh", "en"] as const) {
  const zh = language === "zh";

  test(`rest entries stay in Focus, not the immersive home (${language})`, async ({ page }) => {
    await open(page, language);
    await expect(page.locator(".sound-library-entry button")).toBeVisible();
    await expect(page.locator(".quick-practices")).toHaveCount(0);
    await expect(page.locator(".focus-mode-switch")).toHaveCount(0);
    await expect(page.getByRole("button", { name: zh ? "播放" : "Play", exact: true })).toBeVisible();
    await nav(page, language).getByRole("button", { name: zh ? "静心" : "Focus", exact: true }).click();
    await expect(page.locator(".focus-screen")).toHaveAttribute("data-focus-mode", "breathe");
    await expect(page.locator(".focus-screen h1")).toHaveText(zh ? "给自己一分钟" : "A minute to yourself");
    await expect(page.locator(".quick-practice-grid button")).toHaveCount(3);
    await expect(page.getByRole("group", { name: zh ? "休息方式" : "Rest style" })).toBeVisible();
    expect(await page.evaluate(() => window.everydayRestAudio.length)).toBe(0);
  });

  for (const preset of [
    { intent: "lunch", name: zh ? /^午休一下/ : /^Lunch break/, scene: "lake", title: zh ? "晨雾湖岸" : "Morning Lake" },
    { intent: "night_waking", name: zh ? /^夜里醒了/ : /^Awake at night/, scene: "window", title: zh ? "窗边夜雨" : "Window Rain" },
  ]) {
    test(`${preset.intent} is a free 15-minute listen in Focus (${language})`, async ({ page }) => {
      await open(page, language);
      await nav(page, language).getByRole("button", { name: zh ? "静心" : "Focus", exact: true }).click();
      await page.locator(".quick-practices").getByRole("button", { name: preset.name }).click();
      await expect(page.locator(".focus-screen")).toHaveAttribute("data-focus-mode", "listen");
      await expect(nav(page, language).getByRole("button", { name: zh ? "静心" : "Focus", exact: true })).toHaveAttribute("aria-current", "page");
      await expect(page.locator(".focus-listen-card strong")).toHaveText(preset.title);
      await expect(page.locator(".scene-current-backdrop")).toHaveAttribute("data-image-scene", preset.scene);
      await expect(page.locator(".plus-upgrade-modal")).toHaveCount(0);
      expect(await page.evaluate(() => JSON.parse(localStorage.getItem("yixiu.duration")!))).toBe(15);
      await expect.poll(() => page.evaluate(() => window.everydayRestAudio.some(audio => !audio.paused && audio.currentTime > 0.1))).toBe(true);
    });
  }

  test(`work break is free one-minute breathing, with no forced sound (${language})`, async ({ page }) => {
    await open(page, language);
    await nav(page, language).getByRole("button", { name: zh ? "静心" : "Focus", exact: true }).click();
    await page.locator(".quick-practices").getByRole("button", { name: zh ? /^工作间隙/ : /^Work break/ }).click();
    await expect(page.locator(".focus-screen")).toHaveAttribute("data-focus-mode", "breathe");
    await expect(page.getByRole("button", { name: zh ? "暂停呼吸" : "Pause breathing", exact: true })).toBeVisible();
    await expect(page.getByRole("switch", { name: zh ? "场景声音：屋檐雨" : "Scene sound: Rain on Eaves" })).toHaveAttribute("aria-checked", "false");
    await expect(page.locator(".plus-upgrade-modal")).toHaveCount(0);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem("yixiu.focusDuration")!))).toBe(1);
    expect(await page.evaluate(() => window.everydayRestAudio.length)).toBe(0);
  });

  test(`work break preserves saved sound-on choice and advances breathing (${language})`, async ({ page }) => {
    await open(page, language, "", false, true);
    await nav(page, language).getByRole("button", { name: zh ? "静心" : "Focus", exact: true }).click();
    const sound = page.getByRole("switch", { name: zh ? "场景声音：屋檐雨" : "Scene sound: Rain on Eaves" });
    await expect(sound).toHaveAttribute("aria-checked", "true");
    await page.locator(".quick-practices").getByRole("button", { name: zh ? /^工作间隙/ : /^Work break/ }).click();
    await expect(page.locator(".focus-screen")).toHaveAttribute("data-focus-mode", "breathe");
    await expect(sound).toHaveAttribute("aria-checked", "true");
    await expect(page.getByRole("button", { name: zh ? "暂停呼吸" : "Pause breathing", exact: true })).toBeVisible();
    await expect(page.locator(".plus-upgrade-modal")).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => window.everydayRestAudio.some(audio => !audio.paused && audio.currentTime > 0.1))).toBe(true);
    await expect(page.locator(".breathing-readout span")).not.toHaveText("01:00");
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem("yixiu.focusSoundEnabled")!))).toBe(true);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem("yixiu.focusDuration")!))).toBe(1);
  });

  test(`campaign links prepare the matching free rest without autoplay (${language})`, async ({ page }) => {
    await open(page, language, "&rest=lunch");
    await expect(page.locator(".focus-screen")).toHaveAttribute("data-focus-mode", "listen");
    await expect(page.locator(".focus-listen-card strong")).toHaveText(zh ? "晨雾湖岸" : "Morning Lake");
    expect(await page.evaluate(() => window.everydayRestAudio.length)).toBe(0);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem("yixiu.duration")!))).toBe(15);
    await page.getByRole("button", { name: zh ? "先听 15 分钟" : "Listen for 15 minutes", exact: true }).click();
    await expect(page.locator(".focus-screen")).toHaveAttribute("data-focus-mode", "listen");
    await expect.poll(() => page.evaluate(() => window.everydayRestAudio.some(audio => !audio.paused && audio.currentTime > 0.1))).toBe(true);
  });

  test(`library purpose and sound type intersect with Free and search (${language})`, async ({ page }) => {
    await open(page, language);
    await page.locator(".sound-library-entry button").click();
    const library = page.getByRole("dialog", { name: zh ? "声音库" : "Sound library", exact: true });
    const scope = library.getByRole("combobox", { name: zh ? "聆听筛选" : "Listening filter" });
    const purpose = library.getByRole("combobox", { name: zh ? "休息场景" : "Rest purpose" });
    const type = library.getByRole("combobox", { name: zh ? "声音类型" : "Sound type" });
    await expect(library.locator(".scene-grid article")).toHaveCount(54);
    await scope.selectOption("free");
    await expect(library.locator(".scene-grid article")).toHaveCount(27);
    await purpose.selectOption("lunch");
    await type.selectOption("original");
    await expect(library.locator(".scene-select")).toHaveCount(1);
    await expect(library.locator('[data-scene-id="bedsideGlow"]')).toBeVisible();
    await library.getByRole("button", { name: zh ? "搜索声音" : "Search sounds", exact: true }).click();
    const search = library.getByRole("searchbox");
    expect(await search.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
    await search.fill("Bedside Glow");
    await expect(library.locator(".scene-select")).toHaveCount(1);
    await search.fill("no-matching-sound-20261019");
    await expect(library.locator(".library-empty")).toBeVisible();
    await library.locator(".library-empty").getByRole("button").click();
    await expect(scope).toHaveValue("all");
    await expect(purpose).toHaveValue("all");
    await expect(type).toHaveValue("all");
    await expect(search).toHaveValue("");
    await expect(library.locator(".scene-grid article")).toHaveCount(54);
    await scope.selectOption("free");
    await expect(library.locator(".scene-grid article")).toHaveCount(27);
    const header = await library.locator(".library-title-row").boundingBox();
    const discovery = await library.locator(".library-discovery-filters").boundingBox();
    await library.locator(".scene-grid").evaluate(el => { el.scrollTop = 600; });
    expect((await library.locator(".library-title-row").boundingBox())!.y).toBe(header!.y);
    expect((await library.locator(".library-discovery-filters").boundingBox())!.y).toBe(discovery!.y);
  });

  test(`Me keeps rest records optional and Lifestyle has Back (${language})`, async ({ page }) => {
    await open(page, language, "", true);
    await nav(page, language).getByRole("button", { name: zh ? "我的" : "Me", exact: true }).click();
    await expect(page.locator(".me-sound-space button")).toHaveText(zh ? "继续聆听" : "Continue listening");
    const history = page.locator("details.practice-journal");
    await expect(history).not.toHaveAttribute("open");
    await expect(history.locator(".journal-entries")).not.toBeVisible();
    expect(await page.locator(".me-scroll").evaluate(el => {
      const children = [...el.children];
      const settings = el.querySelector(".settings-list");
      const records = el.querySelector(".practice-journal");
      return settings !== null && records !== null && children.indexOf(settings) < children.indexOf(records);
    })).toBe(true);
    await expect(page.locator(".me-works")).toHaveCount(0);
    await page.locator(".trust-links").getByRole("button", { name: zh ? /^生活方式/ : /^Lifestyle/ }).click();
    await expect(page.locator(".me-screen")).toHaveAttribute("data-me-view", "works");
    await expect(page.locator(".me-works a")).toHaveCount(5);
    await page.getByRole("button", { name: zh ? "返回" : "Back", exact: true }).click();
    await expect(page.locator(".me-screen")).toHaveAttribute("data-me-view", "home");
    await history.locator("summary").click();
    await expect(history).toHaveAttribute("open", "");
    await expect(history.locator(".journal-entries button")).toHaveCount(1);
    await expect(history.locator(".journal-entries button")).toBeVisible();
  });
}
