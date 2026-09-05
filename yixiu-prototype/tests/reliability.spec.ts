import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?lang=en");
});

test("playback reconciles elapsed time after a delayed callback and completes once", async ({ page }) => {
  await page.clock.install();
  await page.evaluate(() => {
    (window as any).__completions = 0;
    window.addEventListener("yixiu:analytics", (event: any) => {
      if (event.detail.event === "yixiu_listening_complete") (window as any).__completions++;
    });
  });
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await page.clock.fastForward(5 * 60_000);
  await expect(page.locator(".duration-button")).toHaveText("25:00");
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await page.clock.fastForward(60_000);
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(page.locator(".duration-button")).toHaveText("25:00");
  await page.clock.fastForward(25 * 60_000);
  await expect(page.getByRole("dialog", { name: "Water wisdom" })).toBeVisible();
  await page.clock.fastForward(60_000);
  expect(await page.evaluate(() => (window as any).__completions)).toBe(1);
});

test("selecting the current duration restarts the running deadline", async ({ page }) => {
  await page.clock.install();
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await page.clock.fastForward(60_000);
  await page.getByRole("button", { name: "Timer", exact: true }).click();
  await page.locator(".timer-panel button").filter({ hasText: "30" }).click();
  await page.clock.fastForward(60_000);
  await expect(page.locator(".duration-button")).toHaveText("29:00");
});

test("failed share image generation is visible and retry succeeds", async ({ page }) => {
  await page.evaluate(() => {
    const original = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function(callback, ...args) {
      HTMLCanvasElement.prototype.toBlob = original;
      callback(null);
    };
  });
  await page.getByRole("button", { name: "Share Ocean Waves", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Couldn't create the image");
  await page.getByRole("button", { name: "Share Ocean Waves", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Share Ocean Waves", exact: true })).toBeVisible();
});

test("share is busy during rendering and rejects repeated clicks", async ({ page }) => {
  await page.evaluate(() => {
    const original = HTMLCanvasElement.prototype.toBlob;
    (window as any).__encodes = 0;
    HTMLCanvasElement.prototype.toBlob = function(callback, ...args) {
      (window as any).__encodes++;
      original.call(this, blob => {
        (window as any).__finishShare = () => callback(blob);
      }, ...args);
    };
  });
  const share = page.getByRole("button", { name: "Share Ocean Waves", exact: true });
  await share.click();
  await expect(share).toBeDisabled();
  await expect(page.getByRole("status")).toContainText("Creating");
  await share.dispatchEvent("click");
  await expect.poll(() => page.evaluate(() => typeof (window as any).__finishShare)).toBe("function");
  expect(await page.evaluate(() => (window as any).__encodes)).toBe(1);
  await page.evaluate(() => (window as any).__finishShare());
  await expect(page.getByRole("dialog", { name: "Share Ocean Waves", exact: true })).toBeVisible();
  await expect(share).toBeEnabled();
});

test("focus catches up after suspension and preserves pause time", async ({ page }) => {
  await page.goto("/?lang=zh");
  await page.clock.install();
  await page.getByRole("button", { name: "静心 FOCUS" }).click();
  await page.getByRole("button", { name: "开始 1 分钟" }).click();
  await page.clock.fastForward(20_000);
  await expect(page.getByText("00:40", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "暂停呼吸" }).click();
  await page.clock.fastForward(60_000);
  await expect(page.getByText("00:40", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "继续呼吸" }).click();
  await page.clock.fastForward(40_000);
  await expect(page.getByText("00:00", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "暂停呼吸" })).toHaveCount(0);
});

test("page restoration reconciles the deadline without waiting for a tick", async ({ page }) => {
  await page.clock.install({ time: new Date("2026-09-05T00:00:00Z") });
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await page.clock.setSystemTime(new Date("2026-09-05T00:05:00Z"));
  await page.evaluate(() => window.dispatchEvent(new Event("pageshow")));
  await expect(page.locator(".duration-button")).toHaveText("25:00");
});

test("a fresh explicit tap retries prepared file sharing after lost activation", async ({ page }) => {
  await page.evaluate(() => {
    (window as any).__shares = 0;
    Object.defineProperty(navigator, "canShare", { configurable: true, value: () => true });
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async (payload: ShareData) => {
        (window as any).__shares++;
        if ((window as any).__shares === 1) throw new DOMException("Expired activation", "NotAllowedError");
        (window as any).__sharedFile = payload.files?.[0]?.type;
      },
    });
  });
  await page.getByRole("button", { name: "Share Ocean Waves", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Share Ocean Waves", exact: true });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Share image", exact: true }).click();
  expect(await page.evaluate(() => (window as any).__shares)).toBe(2);
  expect(await page.evaluate(() => (window as any).__sharedFile)).toBe("image/png");
});
