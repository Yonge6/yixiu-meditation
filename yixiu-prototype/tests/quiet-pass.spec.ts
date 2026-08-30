import { expect, test } from "@playwright/test";

async function captureAnalytics(page) {
  await page.addInitScript(() => {
    window.__quietPassEvents = [];
    window.__quietPassShares = [];
    window.addEventListener("yixiu:analytics", (event) => {
      window.__quietPassEvents.push(event.detail);
    });
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async (payload) => {
        window.__quietPassShares.push(payload);
      },
    });
    HTMLMediaElement.prototype.play = async function () {
      Object.defineProperty(this, "paused", { configurable: true, value: false });
    };
    HTMLMediaElement.prototype.pause = function () {
      Object.defineProperty(this, "paused", { configurable: true, value: true });
    };
  });
}

test("First Breath reveals its anonymous gift only after the listening threshold", async ({ page }) => {
  await captureAnalytics(page);
  await page.goto("/1-minute-meditation-music/index.html");

  const invitation = page.locator('[data-quiet-pass-origin="first-breath"]');
  await expect(invitation).toBeHidden();
  await page.evaluate(() => window.dispatchEvent(new CustomEvent("yixiu:playback-progress", {
    detail: { scene: "firstBreath", currentTime: 59 },
  })));
  await expect(invitation).toBeHidden();
  await page.evaluate(() => window.dispatchEvent(new CustomEvent("yixiu:playback-progress", {
    detail: { scene: "firstBreath", currentTime: 60 },
  })));
  await expect(invitation).toBeVisible();

  await invitation.getByRole("button", { name: "Send First Breath to someone" }).click();
  const payload = await page.evaluate(() => window.__quietPassShares.at(-1));
  const shared = new URL(payload.url);
  expect(shared.pathname).toBe("/gift/first-breath/");
  expect(shared.searchParams.get("g")).toMatch(/^[A-Za-z0-9_-]{12}$/);
  expect(shared.searchParams.get("utm_campaign")).toBe("quiet_pass");
  expect(shared.searchParams.get("utm_content")).toBe("first_breath_gift");
  const events = await page.evaluate(() => window.__quietPassEvents);
  expect(events.some((event) => event.event === "gift_created" && event.scene === "first-breath")).toBe(true);
});

test("Still Water waits for three minutes before offering a quiet pass", async ({ page }) => {
  await captureAnalytics(page);
  await page.goto("/20-minute-meditation-music/index.html");
  const invitation = page.locator('[data-quiet-pass-origin="still-water"]');
  await expect(invitation).toBeHidden();
  await page.evaluate(() => window.dispatchEvent(new CustomEvent("yixiu:playback-progress", {
    detail: { scene: "stillWater", currentTime: 179 },
  })));
  await expect(invitation).toBeHidden();
  await page.evaluate(() => window.dispatchEvent(new CustomEvent("yixiu:playback-progress", {
    detail: { scene: "stillWater", currentTime: 180 },
  })));
  await expect(invitation).toBeVisible();
});

test("recipient can listen, qualify once, switch language, and pass the moment onward", async ({ page }) => {
  await captureAnalytics(page);
  await page.goto("/gift/first-breath/index.html?g=Abcdef_12345&utm_source=share&utm_medium=referral&utm_campaign=quiet_pass&utm_content=first_breath_gift");

  await expect(page.getByRole("heading", { name: "Someone sent you a quiet moment." })).toBeVisible();
  await page.getByRole("button", { name: "中 / EN" }).click();
  await expect(page.getByRole("heading", { name: "有人送来一段安静。" })).toBeVisible();
  await page.getByRole("button", { name: "中 / EN" }).click();

  await page.getByRole("button", { name: "Receive & Listen" }).click();
  await expect(page.getByRole("status").first()).toHaveText("Now playing");
  await page.getByRole("button", { name: "中 / EN" }).click();
  await expect(page.getByRole("status").first()).toHaveText("正在播放");
  await page.getByRole("button", { name: "中 / EN" }).click();
  const audio = page.locator("[data-quiet-pass-audio-element]");
  await audio.evaluate((element) => {
    Object.defineProperty(element, "currentTime", { configurable: true, value: 60 });
    Object.defineProperty(element, "duration", { configurable: true, value: 88 });
    element.dispatchEvent(new Event("timeupdate"));
    element.dispatchEvent(new Event("timeupdate"));
  });

  await expect(page.locator("[data-quiet-pass-complete]")).toBeVisible();
  const events = await page.evaluate(() => window.__quietPassEvents);
  expect(events.filter((event) => event.event === "gift_opened")).toHaveLength(1);
  expect(events.filter((event) => event.event === "gift_play_started")).toHaveLength(1);
  expect(events.filter((event) => event.event === "gift_qualified_60s")).toHaveLength(1);

  await page.getByRole("button", { name: "Pass this quiet moment on" }).click();
  const payload = await page.evaluate(() => window.__quietPassShares.at(-1));
  const reshared = new URL(payload.url);
  expect(reshared.pathname).toBe("/gift/first-breath/");
  expect(reshared.searchParams.get("g")).toMatch(/^[A-Za-z0-9_-]{12}$/);
  expect(reshared.searchParams.get("g")).not.toBe("Abcdef_12345");
});

test("invalid attribution and audio failure never block the gift", async ({ page }) => {
  await captureAnalytics(page);
  await page.goto("/gift/still-water/index.html?g=%3Cscript%3E");
  await expect(page.getByRole("button", { name: "Receive & Listen" })).toBeVisible();
  const opened = await page.evaluate(() => window.__quietPassEvents.find((event) => event.event === "gift_opened"));
  expect(opened.gift_id_state).toBe("invalid");
  expect(JSON.stringify(opened)).not.toContain("script");

  await page.locator("[data-quiet-pass-audio-element]").evaluate((element) => element.dispatchEvent(new Event("error")));
  await expect(page.locator("[data-quiet-pass-error]")).toBeVisible();
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open the original full track" })).toHaveAttribute("href", "/20-minute-meditation-music/");
});

test("gift page stays within a phone viewport and honors reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/gift/first-breath/index.html?g=Abcdef_12345");
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    animationDuration: getComputedStyle(document.querySelector(".quiet-pass-ripple")).animationDuration,
  }));
  expect(metrics.scrollWidth).toBe(metrics.innerWidth);
  expect(metrics.animationDuration).toBe("0s");
});

declare global {
  interface Window {
    __quietPassEvents: Array<Record<string, string>>;
    __quietPassShares: Array<{ title: string; text: string; url: string }>;
  }
}
