import { expect, test } from "@playwright/test";

declare global { interface Window { focusTestAudio: HTMLMediaElement[] } }

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    localStorage.clear();
    window.focusTestAudio = [];
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (!window.focusTestAudio.includes(this)) window.focusTestAudio.push(this);
      return play.call(this);
    };
  });
});

test("Focus shares rain artwork and audio without restarting on tab switches", async ({ page }) => {
  await page.goto("/?scene=rain&lang=zh");
  const background = page.locator(".scene-current-backdrop");
  const image = await background.getAttribute("src");
  await page.getByRole("button", { name: "播放", exact: true }).click();
  const playingSources = () => page.evaluate(() => window.focusTestAudio
    .filter(audio => !audio.paused && audio.src).map(audio => new URL(audio.src).pathname));
  await expect.poll(playingSources).toEqual(["/assets/yixiu/audio/light-rain.m4a"]);
  await page.getByRole("button", { name: "静心 FOCUS" }).click();
  await expect(page.locator(".focus-screen h1")).toHaveText("屋檐雨");
  await expect(background).toHaveAttribute("src", image!);
  await expect(background).toHaveAttribute("data-image-scene", "rain");
  const sound = page.getByRole("switch", { name: "场景声音：屋檐雨" });
  await sound.click();
  await page.getByRole("button", { name: "开始 1 分钟" }).click();
  await expect.poll(playingSources).toEqual(["/assets/yixiu/audio/light-rain.m4a"]);
  expect(await page.evaluate(() => window.focusTestAudio.length)).toBe(1);
  await sound.click();
  await expect.poll(playingSources).toEqual([]);
  await sound.click();
  await expect.poll(playingSources).toEqual(["/assets/yixiu/audio/light-rain.m4a"]);
  await page.getByRole("button", { name: "声音 SOUNDS" }).click();
  await expect(page.getByRole("button", { name: "暂停", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "下一种声音" }).click();
  await page.getByRole("button", { name: "静心 FOCUS" }).click();
  await expect(page.locator(".focus-screen h1")).toHaveText("春日花溪");
  await expect(background).toHaveAttribute("data-image-scene", "spring");
  await expect(page.getByRole("button", { name: "开始 1 分钟" })).toBeVisible();
  await expect.poll(playingSources).toEqual(["/assets/yixiu/audio/sunrise-river.m4a"]);
});

test("Focus follows music and preserves a paused home session", async ({ page }) => {
  await page.goto("/?music=oasisRest&lang=en");
  const image = await page.locator(".scene-current-backdrop").getAttribute("src");
  await page.getByRole("button", { name: "Focus 静心" }).click();
  await expect(page.locator(".focus-screen h1")).toHaveText("Oasis Rest");
  await expect(page.locator(".scene-current-backdrop")).toHaveAttribute("src", image!);
  const sound = page.getByRole("switch", { name: "Scene sound: Oasis Rest" });
  await expect(sound).toHaveAttribute("aria-checked", "false");
  expect(await page.evaluate(() => window.focusTestAudio.length)).toBe(0);
  await sound.click();
  await page.getByRole("button", { name: "Start 1 minute", exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.focusTestAudio.some(audio => !audio.paused && audio.src.endsWith("/meditation/oasis-rest.m4a")))).toBe(true);
  await page.getByRole("button", { name: "Pause breathing" }).click();
  await page.getByRole("button", { name: "Continue breathing" }).click();
  await page.getByRole("button", { name: "Sounds 声音" }).click();
  await expect(page.getByRole("button", { name: "Play", exact: true })).toBeVisible();
});

test("Focus cannot unlock a premium scene through its sound switch", async ({ page }) => {
  await page.goto("/?scene=lake&lang=zh");
  await page.getByRole("button", { name: "静心 FOCUS" }).click();
  await page.getByRole("switch").click();
  await expect(page.getByRole("dialog", { name: "升级一休 Plus" })).toBeVisible();
  expect(await page.evaluate(() => window.focusTestAudio.length)).toBe(0);
});
