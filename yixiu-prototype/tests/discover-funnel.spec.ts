import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(HTMLMediaElement.prototype, "play", {
      configurable: true,
      value() { return Promise.resolve(); },
    });
  });
  await page.setViewportSize({ width: 390, height: 844 });
});

test("focus landing starts a real one-tap preview and reveals the matched download action", async ({ page }) => {
  await page.goto("/focus-sounds/index.html?utm_source=youtube&utm_medium=organic_video&utm_campaign=focus_sounds&utm_content=funnel_test");

  const preview = page.locator("button[data-audio-preview]");
  await expect(preview).toBeVisible();
  await expect(preview).toHaveAccessibleName("Play Mountain Stream");
  await expect(preview).toHaveAttribute("aria-pressed", "false");
  await preview.click();

  await expect(preview).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Pause Mountain Stream")).toBeVisible();
  const afterPreview = page.locator("[data-after-preview]");
  await expect(afterPreview).toBeVisible();
  await expect(afterPreview.getByRole("link", { name: "Get Yixiu for iPhone." })).toHaveAttribute(
    "href",
    /ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759$/,
  );

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("all search landings expose a preview, trust message and matched iPhone path", async ({ page }) => {
  for (const item of [
    { path: "/sleep-sounds/index.html", preview: "Play Window Rain", ppid: "67cb8784-2b16-4849-b940-90fdf4d99752" },
    { path: "/one-minute-reset/index.html", preview: "Play Morning Water", ppid: "6c015245-76ff-4266-8837-5a0ffc289b9c" },
    { path: "/ocean-waves-for-focus/index.html", preview: "Play Ocean Waves", ppid: "7890afd3-dd12-4215-a5c5-17f4ebc28759" },
  ]) {
    await page.goto(item.path, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: item.preview })).toBeVisible();
    await expect(page.getByRole("link", { name: "Get Yixiu for iPhone", exact: true })).toHaveAttribute(
      "href",
      new RegExp(`ppid=${item.ppid}$`),
    );
    await expect(page.locator(".intent-trustline")).toBeVisible();
  }
});

test("successful native sharing creates an attributed referral after preview", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async (data: ShareData) => {
        (window as typeof window & { __sharedData?: ShareData }).__sharedData = data;
      },
    });
  });
  await page.goto("/wind-sounds-for-sleeping/index.html?utm_source=pinterest&utm_campaign=sleep_sounds");
  await page.evaluate(() => {
    const state = window as typeof window & { __shareEvents?: Array<Record<string, unknown>> };
    state.__shareEvents = [];
    window.addEventListener("yixiu:analytics", ((event: CustomEvent) => {
      state.__shareEvents?.push(event.detail);
    }) as EventListener);
  });

  await page.getByRole("button", { name: "Play Mountain Wind" }).click();
  const share = page.locator(".intent-share");
  await expect(share).toBeVisible();
  await share.click();

  await expect(share).toHaveText("Shared");
  const result = await page.evaluate(() => ({
    data: (window as typeof window & { __sharedData?: ShareData }).__sharedData,
    events: (window as typeof window & { __shareEvents?: Array<Record<string, unknown>> }).__shareEvents,
  }));
  expect(result.data?.url).toBe(
    "https://yixiu.wonderelian.com/wind-sounds-for-sleeping/?utm_source=share&utm_medium=referral&utm_campaign=scene_share&utm_content=wind_sleep_share",
  );
  expect(result.events).toContainEqual(expect.objectContaining({
    event: "yixiu_share",
    share_method: "native",
    placement: "wind_sleep_share",
  }));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("clipboard fallback records a share only after the link is copied", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          (window as typeof window & { __copiedShareUrl?: string }).__copiedShareUrl = value;
        },
      },
    });
  });
  await page.goto("/focus-sounds/index.html");
  await page.evaluate(() => {
    const state = window as typeof window & { __shareEvents?: Array<Record<string, unknown>> };
    state.__shareEvents = [];
    window.addEventListener("yixiu:analytics", ((event: CustomEvent) => {
      state.__shareEvents?.push(event.detail);
    }) as EventListener);
  });

  await page.getByRole("button", { name: "Play Mountain Stream" }).click();
  const share = page.locator(".intent-share");
  await share.click();

  await expect(share).toHaveText("Link copied");
  const result = await page.evaluate(() => ({
    copied: (window as typeof window & { __copiedShareUrl?: string }).__copiedShareUrl,
    events: (window as typeof window & { __shareEvents?: Array<Record<string, unknown>> }).__shareEvents,
  }));
  expect(result.copied).toBe(
    "https://yixiu.wonderelian.com/focus-sounds/?utm_source=share&utm_medium=referral&utm_campaign=scene_share&utm_content=focus_landing_share",
  );
  expect(result.events).toContainEqual(expect.objectContaining({
    event: "yixiu_share",
    share_method: "clipboard",
    placement: "focus_landing_share",
  }));
});

test("cancelling the native share sheet does not record a share", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async () => {
        throw new DOMException("Share cancelled", "AbortError");
      },
    });
  });
  await page.goto("/ocean-waves-for-focus/index.html", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    const state = window as typeof window & { __shareEvents?: Array<Record<string, unknown>> };
    state.__shareEvents = [];
    window.addEventListener("yixiu:analytics", ((event: CustomEvent) => {
      state.__shareEvents?.push(event.detail);
    }) as EventListener);
  });

  await page.getByRole("button", { name: "Play Ocean Waves" }).click();
  const share = page.locator(".intent-share");
  await share.click();

  await expect(share).toHaveText("Share this sound");
  const shareEvents = await page.evaluate(() => (
    (window as typeof window & { __shareEvents?: Array<Record<string, unknown>> }).__shareEvents
  ));
  expect(shareEvents).not.toContainEqual(expect.objectContaining({ event: "yixiu_share" }));
});
