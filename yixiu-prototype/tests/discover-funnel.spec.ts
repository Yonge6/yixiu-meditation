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
    /ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759&pt=120014121&ct=yixiu_h5_20260827&mt=8$/,
  );

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("all search landings expose a preview, trust message and matched iPhone path", async ({ page }) => {
  for (const item of [
    { path: "/sleep-sounds/index.html", preview: "Play Window Rain", ppid: "67cb8784-2b16-4849-b940-90fdf4d99752" },
    { path: "/rain-sounds-when-iphone-locked/index.html", preview: "Play Rain for Lock Screen", ppid: "67cb8784-2b16-4849-b940-90fdf4d99752" },
    { path: "/underwater-white-noise-for-sleep/index.html", preview: "Play Underwater White Noise", ppid: "67cb8784-2b16-4849-b940-90fdf4d99752" },
    { path: "/ocean-waves-for-sleeping/index.html", preview: "Play Ocean Waves", ppid: "67cb8784-2b16-4849-b940-90fdf4d99752" },
    { path: "/forest-sounds-for-sleep/index.html", preview: "Play Forest Sounds", ppid: "67cb8784-2b16-4849-b940-90fdf4d99752" },
    { path: "/one-minute-reset/index.html", preview: "Play Morning Water", ppid: "6c015245-76ff-4266-8837-5a0ffc289b9c" },
    { path: "/ocean-waves-for-focus/index.html", preview: "Play Audio Only", ppid: "7890afd3-dd12-4215-a5c5-17f4ebc28759" },
  ]) {
    await page.goto(item.path, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: item.preview })).toBeVisible();
    await expect(page.getByRole("link", { name: "Get Yixiu for iPhone", exact: true })).toHaveAttribute(
      "href",
      new RegExp(`ppid=${item.ppid}&pt=120014121&ct=yixiu_h5_20260827&mt=8$`),
    );
    await expect(page.locator(".intent-trustline")).toBeVisible();
  }
});

test("video search landings keep one eager player prominent in the mobile first screen", async ({ page }) => {
  for (const path of [
    "/mountain-stream-sounds-for-focus/index.html",
    "/river-sounds-for-studying/index.html",
    "/ocean-waves-for-focus/index.html",
  ]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });

    const player = page.locator(".intent-watch-player .intent-video");
    await expect(player).toBeVisible();
    await expect(player.locator('iframe[loading="eager"]')).toHaveCount(1);
    await expect(page.locator("iframe")).toHaveCount(1);

    const bounds = await player.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds.y).toBeGreaterThanOrEqual(0);
    expect(bounds.y).toBeLessThan(844);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test("rain study landing starts real rain and reveals the attributed iPhone path", async ({ page }) => {
  await page.goto("/rain-sounds-for-studying/index.html?utm_source=search&utm_medium=organic", {
    waitUntil: "domcontentloaded",
  });

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://yixiu.wonderelian.com/rain-sounds-for-studying/",
  );
  await expect(page.locator("h1")).toHaveCount(1);

  const preview = page.locator('button[data-analytics-placement="rain_studying_preview"]');
  await expect(preview).toBeVisible();
  await expect(preview).toHaveAccessibleName("Play Eaves Rain");
  await expect(preview).toHaveAttribute("data-audio-preview", "/assets/yixiu/audio/light-rain.m4a");
  await preview.click();

  await expect(preview).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Pause Eaves Rain")).toBeVisible();
  const afterPreview = page.locator("[data-after-preview]");
  await expect(afterPreview).toBeVisible();
  await expect(afterPreview.getByRole("link", { name: "Continue in Yixiu for iPhone." })).toHaveAttribute(
    "href",
    /ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759&pt=120014121&ct=yixiu_h5_20260827&mt=8$/,
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("white noise study landing plays the real scene, advances its timer and reveals the Focus download path", async ({ page }) => {
  await page.clock.install();
  await page.goto("/white-noise-for-studying/index.html?utm_source=search&utm_medium=organic", {
    waitUntil: "domcontentloaded",
  });

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://yixiu.wonderelian.com/white-noise-for-studying/",
  );
  await expect(page.locator("h1")).toHaveCount(1);

  const timer = page.locator("[data-preview-timer]");
  await expect(timer).toBeVisible();
  await timer.getByRole("button", { name: "15 minutes" }).click();
  await expect(timer.locator("[data-preview-timer-status]")).toHaveText("15:00 remaining");

  const preview = page.locator('button[data-analytics-placement="white_noise_studying_preview"]');
  await expect(preview).toBeVisible();
  await expect(preview).toHaveAccessibleName("Play Study White Noise");
  await expect(preview).toHaveAttribute("data-audio-preview", "/assets/yixiu/audio/underwater-white-noise.m4a");
  await preview.click();

  await expect(preview).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Pause Study White Noise")).toBeVisible();
  await page.clock.runFor(1_000);
  await expect(timer.locator("[data-preview-timer-status]")).toHaveText("14:59 remaining");
  const afterPreview = page.locator("[data-after-preview]");
  await expect(afterPreview).toBeVisible();
  await expect(afterPreview.getByRole("link", { name: "Continue in Yixiu for iPhone." })).toHaveAttribute(
    "href",
    /ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759&pt=120014121&ct=yixiu_h5_20260827&mt=8$/,
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("rain sleep preview reveals its matched download and attributed Pinterest path without mobile overflow", async ({ page }) => {
  await page.goto("/sleep-sounds/index.html?utm_source=search&utm_medium=organic", { waitUntil: "domcontentloaded" });

  const preview = page.locator('button[data-analytics-placement="sleep_landing_preview"]');
  await expect(preview).toHaveAccessibleName("Play Window Rain");
  await preview.click();

  await expect(preview).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Pause Window Rain")).toBeVisible();
  const afterPreview = page.locator("[data-after-preview]");
  await expect(afterPreview).toBeVisible();
  await expect(afterPreview.getByRole("link", { name: "Get Yixiu for iPhone." })).toHaveAttribute(
    "href",
    /ppid=67cb8784-2b16-4849-b940-90fdf4d99752&pt=120014121&ct=yixiu_h5_20260827&mt=8$/,
  );
  const pinterest = page.getByRole("link", { name: "Save this sound to Pinterest" });
  const pinterestIntent = new URL(await pinterest.getAttribute("href") || "");
  expect(pinterestIntent.searchParams.get("url")).toBe(
    "https://yixiu.wonderelian.com/sleep-sounds/?utm_source=pinterest&utm_medium=organic_share&utm_campaign=scene_share&utm_content=sleep_landing_pinterest",
  );
  expect(pinterestIntent.searchParams.get("media")).toBe(
    "https://yixiu.wonderelian.com/assets/yixiu/window-rain.png",
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("rain sleep preview timer selects a duration and stops playback at zero", async ({ page }) => {
  await page.clock.install();
  await page.goto("/sleep-sounds/index.html", { waitUntil: "domcontentloaded" });

  const timer = page.locator("[data-preview-timer]");
  await expect(timer).toBeVisible();
  await expect(timer.getByRole("button", { name: "30 minutes" })).toHaveAttribute("aria-pressed", "true");

  await timer.getByRole("button", { name: "15 minutes" }).click();
  await expect(timer.getByRole("button", { name: "15 minutes" })).toHaveAttribute("aria-pressed", "true");
  await expect(timer.locator("[data-preview-timer-status]")).toHaveText("15:00 remaining");

  const preview = page.locator('button[data-analytics-placement="sleep_landing_preview"]');
  await expect(preview).toHaveAccessibleName("Play Window Rain");
  await preview.click();
  await expect(preview).toHaveAttribute("aria-pressed", "true");
  await page.clock.runFor(15 * 60 * 1000);

  await expect(preview).toHaveAttribute("aria-pressed", "false");
  await expect(timer.locator("[data-preview-timer-status]")).toHaveText("Timer complete");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("iPhone lock-screen guide plays rain, advances its timer and reveals the attributed Sleep path", async ({ page }) => {
  await page.clock.install();
  await page.goto("/rain-sounds-when-iphone-locked/index.html?utm_source=search&utm_medium=organic", {
    waitUntil: "domcontentloaded",
  });

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://yixiu.wonderelian.com/rain-sounds-when-iphone-locked/",
  );
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Apple's Background Sounds guide" })).toHaveAttribute(
    "href",
    "https://support.apple.com/en-sg/guide/iphone/iphb2cfa052c/ios",
  );

  const timer = page.locator("[data-preview-timer]");
  await timer.getByRole("button", { name: "15 minutes" }).click();
  await expect(timer.locator("[data-preview-timer-status]")).toHaveText("15:00 remaining");

  const preview = page.locator('button[data-analytics-placement="rain_lock_screen_preview"]');
  await expect(preview).toHaveAccessibleName("Play Rain for Lock Screen");
  await expect(preview).toHaveAttribute("data-audio-preview", "/assets/yixiu/audio/light-rain.m4a");
  await preview.click();

  await expect(preview).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Pause Rain for Lock Screen")).toBeVisible();
  await page.clock.runFor(1_000);
  await expect(timer.locator("[data-preview-timer-status]")).toHaveText("14:59 remaining");
  await expect(page.locator("[data-after-preview]")).toBeVisible();
  await expect(page.locator('[data-analytics-placement="rain_lock_screen_after_preview"]')).toHaveAttribute(
    "href",
    /ppid=67cb8784-2b16-4849-b940-90fdf4d99752&pt=120014121&ct=yixiu_h5_20260827&mt=8$/,
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("ocean sleep preview reveals sharing and its matched download path without mobile overflow", async ({ page }) => {
  await page.goto("/ocean-waves-for-sleeping/index.html?utm_source=search&utm_medium=organic", { waitUntil: "domcontentloaded" });

  const preview = page.locator('button[data-analytics-placement="ocean_sleep_preview"]');
  await expect(preview).toBeVisible();
  await expect(preview).toHaveAccessibleName("Play Ocean Waves");
  await preview.click();

  await expect(preview).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Pause Ocean Waves")).toBeVisible();
  const afterPreview = page.locator("[data-after-preview]");
  await expect(afterPreview).toBeVisible();
  await expect(afterPreview.getByRole("link", { name: "Continue in Yixiu for iPhone." })).toHaveAttribute(
    "href",
    /ppid=67cb8784-2b16-4849-b940-90fdf4d99752&pt=120014121&ct=yixiu_h5_20260827&mt=8$/,
  );
  const pinterest = page.getByRole("link", { name: "Save this sound to Pinterest" });
  await expect(pinterest).toBeVisible();
  const pinterestIntent = new URL(await pinterest.getAttribute("href") || "");
  expect(pinterestIntent.searchParams.get("url")).toBe(
    "https://yixiu.wonderelian.com/ocean-waves-for-sleeping/?utm_source=pinterest&utm_medium=organic_share&utm_campaign=scene_share&utm_content=ocean_sleep_pinterest",
  );
  expect(pinterestIntent.searchParams.get("media")).toBe(
    "https://yixiu.wonderelian.com/assets/yixiu/night-tide.png",
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("underwater white noise preview reveals its matched download action without mobile overflow", async ({ page }) => {
  await page.clock.install();
  await page.goto("/underwater-white-noise-for-sleep/index.html?utm_source=search&utm_medium=organic", { waitUntil: "domcontentloaded" });

  const timer = page.locator("[data-preview-timer]");
  await expect(timer).toBeVisible();
  await timer.getByRole("button", { name: "15 minutes" }).click();
  await expect(timer.getByRole("button", { name: "15 minutes" })).toHaveAttribute("aria-pressed", "true");
  await expect(timer.locator("[data-preview-timer-status]")).toHaveText("15:00 remaining");

  const preview = page.locator('button[data-analytics-placement="underwater_white_noise_preview"]');
  await expect(preview).toBeVisible();
  await expect(preview).toHaveAccessibleName("Play Underwater White Noise");
  await preview.click();

  await expect(preview).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Pause Underwater White Noise")).toBeVisible();
  await page.clock.runFor(1_000);
  await expect(timer.locator("[data-preview-timer-status]")).toHaveText("14:59 remaining");
  const afterPreview = page.locator("[data-after-preview]");
  await expect(afterPreview).toBeVisible();
  await expect(afterPreview.getByRole("link", { name: "Continue in Yixiu for iPhone." })).toHaveAttribute(
    "href",
    /ppid=67cb8784-2b16-4849-b940-90fdf4d99752&pt=120014121&ct=yixiu_h5_20260827&mt=8$/,
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("forest sleep preview plays the real scene, advances its timer and reveals the matched download action", async ({ page }) => {
  await page.clock.install();
  await page.goto("/forest-sounds-for-sleep/index.html?utm_source=search&utm_medium=organic", { waitUntil: "domcontentloaded" });

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://yixiu.wonderelian.com/forest-sounds-for-sleep/",
  );
  await expect(page.locator("h1")).toHaveCount(1);

  const timer = page.locator("[data-preview-timer]");
  await expect(timer).toBeVisible();
  await timer.getByRole("button", { name: "15 minutes" }).click();
  await expect(timer.locator("[data-preview-timer-status]")).toHaveText("15:00 remaining");

  const preview = page.locator('button[data-analytics-placement="forest_sleep_preview"]');
  await expect(preview).toBeVisible();
  await expect(preview).toHaveAccessibleName("Play Forest Sounds");
  await expect(preview).toHaveAttribute("data-audio-preview", "/assets/yixiu/audio/forest-breeze.m4a");
  await preview.click();

  await expect(preview).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Pause Forest Sounds")).toBeVisible();
  await page.clock.runFor(1_000);
  await expect(timer.locator("[data-preview-timer-status]")).toHaveText("14:59 remaining");
  const afterPreview = page.locator("[data-after-preview]");
  await expect(afterPreview).toBeVisible();
  await expect(afterPreview.getByRole("link", { name: "Continue in Yixiu for iPhone." })).toHaveAttribute(
    "href",
    /ppid=67cb8784-2b16-4849-b940-90fdf4d99752&pt=120014121&ct=yixiu_h5_20260827&mt=8$/,
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
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

test("Pinterest intent uses the public image and an attributed canonical destination", async ({ page }) => {
  await page.goto("/wind-sounds-for-sleeping/index.html", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    const state = window as typeof window & { __shareEvents?: Array<Record<string, unknown>> };
    state.__shareEvents = [];
    window.addEventListener("yixiu:analytics", ((event: CustomEvent) => {
      state.__shareEvents?.push(event.detail);
    }) as EventListener);
    document.addEventListener("click", (event) => {
      if ((event.target as Element | null)?.closest?.(".intent-pinterest")) event.preventDefault();
    }, true);
  });

  const pinterest = page.getByRole("link", { name: "Save this sound to Pinterest" });
  await expect(pinterest).toBeHidden();
  await page.getByRole("button", { name: "Play Mountain Wind" }).click();
  await expect(pinterest).toBeVisible();

  const href = await pinterest.getAttribute("href");
  const intent = new URL(href || "");
  expect(`${intent.origin}${intent.pathname}`).toBe("https://www.pinterest.com/pin/create/button/");
  expect(intent.searchParams.get("url")).toBe(
    "https://yixiu.wonderelian.com/wind-sounds-for-sleeping/?utm_source=pinterest&utm_medium=organic_share&utm_campaign=scene_share&utm_content=wind_sleep_pinterest",
  );
  expect(intent.searchParams.get("media")).toBe(
    "https://yixiu.wonderelian.com/assets/yixiu/snow-wind-pinterest-2x3.jpg",
  );
  expect(intent.searchParams.get("description")).toContain("Wind Sounds for Sleeping");

  await pinterest.click();
  const shareEvents = await page.evaluate(() => (
    (window as typeof window & { __shareEvents?: Array<Record<string, unknown>> }).__shareEvents
  ));
  expect(shareEvents).toContainEqual(expect.objectContaining({
    event: "yixiu_share",
    share_method: "pinterest_intent",
    placement: "wind_sleep_pinterest",
  }));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
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

  await page.getByRole("button", { name: "Play Audio Only" }).click();
  const share = page.locator(".intent-share");
  await share.click();

  await expect(share).toHaveText("Share this sound");
  const shareEvents = await page.evaluate(() => (
    (window as typeof window & { __shareEvents?: Array<Record<string, unknown>> }).__shareEvents
  ));
  expect(shareEvents).not.toContainEqual(expect.objectContaining({ event: "yixiu_share" }));
});
