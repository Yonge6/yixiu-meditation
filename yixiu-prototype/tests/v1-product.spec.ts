import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?lang=zh");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("opens on the ocean scene in a paused 30-minute state", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "大海" })).toBeVisible();
  await expect(page.getByRole("button", { name: "播放" })).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("button", { name: "30 分钟" })).toBeVisible();
  await expect(page.getByRole("button", { name: "上一种声音" })).toBeDisabled();
  await expect(page.getByRole("navigation", { name: "主导航" })).toBeVisible();
  const durationBox = await page.getByRole("button", { name: "30 分钟" }).boundingBox();
  const playBox = await page.getByRole("button", { name: "播放" }).boundingBox();
  expect(durationBox!.y + durationBox!.height).toBeLessThanOrEqual(playBox!.y + 4);
});

test("keeps a low-saturation color in every scene image slot while assets load", async ({ page }) => {
  const backdrop = page.locator(".scene-current-backdrop");
  await expect(backdrop).toHaveAttribute("data-image-scene", "ocean");
  expect(await backdrop.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe("rgb(82, 109, 120)");

  await page.getByRole("button", { name: "我的 ME" }).click();
  const soundSpaceImage = page.locator(".me-sound-space img");
  await expect(soundSpaceImage).toHaveAttribute("data-image-scene", "ocean");
  expect(await soundSpaceImage.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe("rgb(82, 109, 120)");
});

test("opens shared scene links and shares the current scene URL", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async (payload: ShareData) => {
        (window as Window & { __yixiuShare?: ShareData }).__yixiuShare = payload;
      },
    });
  });
  await page.goto("/?scene=birds&lang=en");

  await expect(page.getByRole("heading", { name: "MORNING BIRDS" })).toBeVisible();
  await page.getByRole("button", { name: "Share Morning Birds" }).click();

  const payload = await page.evaluate(() => (window as Window & { __yixiuShare?: ShareData }).__yixiuShare);
  expect(payload?.title).toContain("Morning Birds");
  expect(payload?.url).toBe("https://yixiu.wonderelian.com/?scene=birds&lang=en&utm_source=share&utm_medium=referral&utm_campaign=scene_share&utm_content=birds_en");
});

test("shows an attributed Instagram profile guide only for link-in-bio visitors", async ({ page }) => {
  await page.goto("/?lang=en&utm_source=ig&utm_medium=social&utm_content=link_in_bio");

  const guide = page.getByRole("region", { name: "Instagram profile guide" });
  await expect(guide).toBeVisible();
  await expect(guide.getByRole("heading", { name: "Find the sound you saw" })).toBeVisible();
  await expect(guide.getByRole("link", { name: "Rain + dark screen" })).toHaveAttribute(
    "href",
    "/sleep-sounds/?utm_source=instagram&utm_medium=profile&utm_campaign=yixiu_profile&utm_content=instagram_bio_rain_dark_screen",
  );
  await expect(guide.getByRole("link", { name: "Forest sleep" })).toHaveAttribute(
    "href",
    "/forest-sounds-for-sleep/?utm_source=instagram&utm_medium=profile&utm_campaign=yixiu_profile&utm_content=instagram_bio_forest_sleep",
  );
  await expect(guide.getByRole("link", { name: "Ocean focus" })).toHaveAttribute(
    "href",
    "/ocean-waves-for-focus/?utm_source=instagram&utm_medium=profile&utm_campaign=yixiu_profile&utm_content=instagram_bio_ocean_focus",
  );
  await expect(guide.getByRole("link", { name: "1-minute reset" })).toHaveAttribute(
    "href",
    "/one-minute-reset/?utm_source=instagram&utm_medium=profile&utm_campaign=yixiu_profile&utm_content=instagram_bio_one_minute_reset",
  );

  await guide.getByRole("button", { name: "Dismiss Instagram guide" }).click();
  await expect(guide).toBeHidden();

  await page.goto("/?lang=en");
  await expect(page.getByRole("region", { name: "Instagram profile guide" })).toHaveCount(0);
});

test("animates the scene gently only while sound is playing", async ({ page }) => {
  const app = page.locator(".yixiu-app");
  const backdrop = page.locator(".scene-current-backdrop");

  await expect(app).not.toHaveClass(/is-audio-playing/);
  expect(await backdrop.evaluate((element) => getComputedStyle(element).animationName)).toBe("none");

  await page.getByRole("button", { name: "播放" }).click();
  await expect(app).toHaveClass(/is-audio-playing/);
  expect(await backdrop.evaluate((element) => getComputedStyle(element).animationName)).toBe("yixiu-scene-breathe");

  await page.getByRole("button", { name: "暂停" }).click();
  await expect(app).not.toHaveClass(/is-audio-playing/);
  expect(await backdrop.evaluate((element) => getComputedStyle(element).animationName)).toBe("none");
});

test("changes scene and persists favorites", async ({ page }) => {
  await page.getByRole("button", { name: "下一种声音" }).click();
  await expect(page.getByRole("heading", { name: "屋檐雨" })).toBeVisible();

  await page.getByRole("button", { name: "收藏" }).click();
  await expect(page.getByRole("button", { name: "收藏" })).toHaveAttribute("aria-pressed", "true");

  await page.reload();
  await expect(page.getByRole("heading", { name: "屋檐雨" })).toBeVisible();
  await expect(page.getByRole("button", { name: "收藏" })).toHaveAttribute("aria-pressed", "true");
});

test("swipes horizontally to change both the sound and scene image", async ({ page }) => {
  const swipeZone = page.locator(".scene-swipe-zone");

  await swipeZone.dispatchEvent("pointerdown", {
    pointerId: 1,
    pointerType: "touch",
    button: 0,
    clientX: 320,
    clientY: 300,
  });
  await swipeZone.dispatchEvent("pointermove", {
    pointerId: 1,
    pointerType: "touch",
    button: 0,
    clientX: 150,
    clientY: 306,
  });

  await expect(page.locator(".scene-preview-backdrop")).toHaveAttribute("src", "/assets/yixiu/rain.jpg");
  await expect(page.locator(".scene-current-backdrop")).toHaveAttribute("style", /translate3d\(-/);

  await swipeZone.dispatchEvent("pointerup", {
    pointerId: 1,
    pointerType: "touch",
    button: 0,
    clientX: 60,
    clientY: 312,
  });

  await expect(page.locator(".yixiu-app")).toHaveClass(/is-swipe-settling/);
  await expect(page.getByRole("heading", { name: "屋檐雨" })).toBeVisible();
  await expect(page.locator(".yixiu-app")).toHaveAttribute("data-scene", "rain");
  await expect(page.locator(".ocean-backdrop")).toHaveAttribute("src", "/assets/yixiu/rain.jpg");

  await swipeZone.dispatchEvent("pointerdown", {
    pointerId: 2,
    pointerType: "touch",
    button: 0,
    clientX: 60,
    clientY: 300,
  });
  await swipeZone.dispatchEvent("pointermove", {
    pointerId: 2,
    pointerType: "touch",
    button: 0,
    clientX: 220,
    clientY: 296,
  });
  await swipeZone.dispatchEvent("pointerup", {
    pointerId: 2,
    pointerType: "touch",
    button: 0,
    clientX: 320,
    clientY: 292,
  });

  await expect(page.getByRole("heading", { name: "大海" })).toBeVisible();
  await expect(page.locator(".ocean-backdrop")).toHaveAttribute("src", "/assets/yixiu/deep-ocean-hero.png");
});

test("does not change sound for a primarily vertical gesture", async ({ page }) => {
  const swipeZone = page.locator(".scene-swipe-zone");

  await swipeZone.dispatchEvent("pointerdown", {
    pointerId: 3,
    pointerType: "touch",
    button: 0,
    clientX: 180,
    clientY: 220,
  });
  await swipeZone.dispatchEvent("pointermove", {
    pointerId: 3,
    pointerType: "touch",
    button: 0,
    clientX: 194,
    clientY: 390,
  });
  await swipeZone.dispatchEvent("pointerup", {
    pointerId: 3,
    pointerType: "touch",
    button: 0,
    clientX: 205,
    clientY: 520,
  });

  await expect(page.getByRole("heading", { name: "大海" })).toBeVisible();
});

test("gives only a small resisted response at the first scene boundary", async ({ page }) => {
  const swipeZone = page.locator(".scene-swipe-zone");

  await swipeZone.dispatchEvent("pointerdown", {
    pointerId: 4,
    pointerType: "touch",
    button: 0,
    clientX: 90,
    clientY: 300,
  });
  await swipeZone.dispatchEvent("pointermove", {
    pointerId: 4,
    pointerType: "touch",
    button: 0,
    clientX: 350,
    clientY: 302,
  });

  await expect(page.locator(".scene-preview-backdrop")).toHaveCount(0);
  const translatedPixels = await page.locator(".scene-current-backdrop").evaluate((element) => {
    const match = element.getAttribute("style")?.match(/translate3d\(([-\d.]+)px/);
    return Math.abs(Number(match?.[1] ?? 0));
  });
  expect(translatedPixels).toBeLessThanOrEqual(2);

  await swipeZone.dispatchEvent("pointerup", {
    pointerId: 4,
    pointerType: "touch",
    button: 0,
    clientX: 350,
    clientY: 302,
  });
  await expect(page.getByRole("heading", { name: "大海" })).toBeVisible();
});

test("selects timer and switches the interface language", async ({ page }) => {
  await page.getByRole("button", { name: "30 分钟" }).click();
  await page.getByRole("button", { name: "15 分钟" }).click();
  await expect(page.getByRole("button", { name: "15 分钟" })).toBeVisible();
  await page.getByRole("button", { name: "定时" }).click();
  const timerPanel = page.locator(".timer-panel");
  await expect(timerPanel).toBeVisible();
  const timerBox = await timerPanel.boundingBox();
  const transportBox = await page.locator(".transport").boundingBox();
  expect(timerBox).not.toBeNull();
  expect(transportBox).not.toBeNull();
  expect(timerBox!.y + timerBox!.height).toBeLessThan(transportBox!.y);
  await page.getByRole("button", { name: "15 分钟" }).last().click();

  await page.getByRole("button", { name: "切换到英文" }).click();
  await expect(page.getByRole("heading", { name: "OCEAN WAVES" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Switch to Chinese" })).toContainText("YIXIU");
  await expect(page.getByRole("button", { name: "Focus 静心" })).toBeVisible();
});

test("opens the full sound library with an upward gesture", async ({ page }) => {
  const swipeZone = page.locator(".scene-swipe-zone");
  await swipeZone.dispatchEvent("pointerdown", { pointerId: 8, pointerType: "touch", button: 0, clientX: 100, clientY: 520 });
  await swipeZone.dispatchEvent("pointermove", { pointerId: 8, pointerType: "touch", button: 0, clientX: 102, clientY: 390 });
  await swipeZone.dispatchEvent("pointerup", { pointerId: 8, pointerType: "touch", button: 0, clientX: 103, clientY: 300 });

  const library = page.getByRole("dialog", { name: "声音库" });
  await expect(library).toBeVisible();
  await expect(library.locator(".scene-grid article")).toHaveCount(14);
  await library.getByRole("button", { name: "完成" }).click();
  await expect(library).toBeHidden();
});

test("runs and pauses the one-minute water breathing practice", async ({ page }) => {
  await page.getByRole("button", { name: "静心 FOCUS" }).click();
  await expect(page.getByRole("heading", { name: "水之呼吸" })).toBeVisible();

  await page.getByRole("button", { name: "开始 1 分钟" }).click();
  await expect(page.getByText("吸气", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "暂停呼吸" }).click();
  await expect(page.getByRole("button", { name: "继续呼吸" })).toBeVisible();
});

test("offers a persistent three-minute focus session with optional nature sound", async ({ page }) => {
  await page.getByRole("button", { name: "静心 FOCUS" }).click();
  await page.getByRole("button", { name: "3 分钟" }).click();
  await expect(page.getByText("03:00", { exact: true })).toBeVisible();

  const natureSound = page.getByRole("switch", { name: "自然声" });
  await natureSound.click();
  await expect(natureSound).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: "开始 3 分钟" }).click();
  await expect(page.getByRole("button", { name: "暂停呼吸" })).toBeVisible();

  await page.reload();
  await page.getByRole("button", { name: "静心 FOCUS" }).click();
  await expect(page.getByRole("button", { name: "3 分钟", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("switch", { name: "自然声" })).toHaveAttribute("aria-checked", "true");
});

test("filters the sound library by use and serves lightweight thumbnails", async ({ page }) => {
  await page.getByRole("button", { name: "我的 ME" }).click();
  await page.getByRole("button", { name: "浏览全部声音" }).click();

  const library = page.getByRole("dialog", { name: "声音库" });
  await library.getByRole("tab", { name: "睡眠" }).click();
  await expect(library.locator(".scene-grid article")).toHaveCount(6);
  await library.getByRole("tab", { name: "清晨" }).click();
  await expect(library.locator(".scene-grid article")).toHaveCount(4);
  await expect(library.locator(".scene-grid img").first()).toHaveAttribute("src", /\/assets\/yixiu\/thumbs\/.+\.jpg$/);
});

test("keeps recent listening in My and restores it after reload", async ({ page }) => {
  await page.getByRole("button", { name: "播放" }).click();
  await page.getByRole("button", { name: "下一种声音" }).click();
  await page.getByRole("button", { name: "我的 ME" }).click();

  const recent = page.locator(".recent-card");
  await expect(recent.getByText("最近聆听", { exact: true })).toBeVisible();
  await expect(recent.getByRole("button")).toHaveCount(2);
  await expect(recent.getByRole("button").first()).toContainText("屋檐雨");

  await page.reload();
  await page.getByRole("button", { name: "我的 ME" }).click();
  await expect(page.locator(".recent-card").getByRole("button").first()).toContainText("屋檐雨");
});

test("updates and restores local settings", async ({ page }) => {
  await page.getByRole("button", { name: "我的 ME" }).click();
  await expect(page.getByRole("heading", { name: "回到自己的节奏" })).toBeVisible();
  await page.getByRole("button", { name: "60 分钟" }).click();
  await page.getByRole("switch", { name: "结束提示音" }).click();
  await page.reload();
  await page.getByRole("button", { name: "我的 ME" }).click();

  await expect(page.getByRole("button", { name: "60 分钟" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("switch", { name: "结束提示音" })).toHaveAttribute("aria-checked", "true");
});

test("keeps About Us and the Wendao life philosophy in My", async ({ page }) => {
  await page.getByRole("button", { name: "我的 ME" }).click();
  const groupLabels = page.locator(".me-group-label");
  await expect(groupLabels).toHaveCount(2);
  expect(await groupLabels.first().evaluate((element) => getComputedStyle(element).fontSize)).toBe("14px");
  expect(await page.locator(".card-heading strong").first().evaluate((element) => getComputedStyle(element).fontSize)).toBe("20px");
  expect(await page.locator(".setting-row > span strong").first().evaluate((element) => getComputedStyle(element).fontSize)).toBe("17px");
  expect(await page.locator(".trust-links button strong").first().evaluate((element) => getComputedStyle(element).fontSize)).toBe("17px");
  expect(await page.locator(".me-works strong").first().evaluate((element) => getComputedStyle(element).fontSize)).toBe("18px");
  expect(await page.locator(".me-screen").evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  const humanDesignLink = page.getByRole("link", { name: /不二 认识自己.*人生使用说明书/ });
  await expect(humanDesignLink).toHaveAttribute("href", "https://human-design.wonderelian.com/");
  const workLinks = page.locator(".me-works > a");
  await expect(workLinks).toHaveCount(5);
  await expect(workLinks.nth(0)).toHaveAttribute("href", "https://wonderelian.com/");
  await expect(workLinks.nth(0)).toContainText("WonderElian");
  await expect(workLinks.nth(0)).toContainText("让复杂的想法变得清晰、好看而有人情味");
  await expect(workLinks.nth(2)).toContainText("不二 认识自己");
  await expect(workLinks.nth(3)).toContainText("三慢问道");
  await expect(workLinks.nth(3)).toContainText("道德经");
  await expect(page.getByText(/YIXIU 2\.0/)).toHaveCount(0);
  const downloadLink = page.getByRole("link", { name: /下载一休 App/ });
  await expect(downloadLink).toHaveAttribute("href", /ppid=67cb8784-2b16-4849-b940-90fdf4d99752&pt=120014121&ct=yixiu_h5_20260827&mt=8$/);
  await downloadLink.evaluate((element) => {
    element.addEventListener("click", (event) => event.preventDefault(), { once: true });
  });
  await downloadLink.click();
  await expect(page.getByRole("status")).toHaveText("正在打开 App Store…");
  await expect(page.getByRole("status")).toHaveClass(/is-visible/);
  await page.getByRole("button", { name: /关于我们/ }).click();
  const detailHeaderBox = await page.locator(".me-detail-header").boundingBox();
  const detailBackBox = await page.locator(".me-detail-header > button").boundingBox();
  expect(detailHeaderBox).not.toBeNull();
  expect(detailHeaderBox!.y).toBe(0);
  expect(detailBackBox).not.toBeNull();
  expect(detailBackBox!.y).toBeGreaterThanOrEqual(12);
  expect(detailBackBox!.y).toBeLessThan(58);
  await expect(page.getByRole("heading", { name: "一休，是一处让声音带你回到当下的空间。" })).toBeVisible();
  expect(await page.locator(".me-article p").first().evaluate((element) => getComputedStyle(element).fontSize)).toBe("14px");
  await expect(page.getByText("生命不是用来证明自己的，而是用来认识、接纳、成为并活出自己。", { exact: true })).toBeVisible();
  await expect(page.getByText("认识自己", { exact: true })).toBeVisible();
  await expect(page.getByText("如水", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "返回" }).click();
  await expect(page.getByRole("heading", { name: "回到自己的节奏" })).toBeVisible();
  await expect(page.getByRole("button", { name: "打开菜单" })).toHaveCount(0);
});

test("keeps an attributable App Store action on the player first screen", async ({ page }) => {
  const downloadLink = page.getByRole("link", { name: "在 App Store 下载一休" });
  await expect(downloadLink).toBeVisible();
  await expect(downloadLink).toHaveAttribute("href", /ppid=67cb8784-2b16-4849-b940-90fdf4d99752&pt=120014121&ct=yixiu_h5_20260827&mt=8$/);
  await expect(downloadLink).toHaveAttribute("data-analytics-event", "yixiu_download_click");
  await expect(downloadLink).toHaveAttribute("data-analytics-placement", "player_header");
});

test("shows the WonderElian WeChat Channels QR code in Contact", async ({ page }) => {
  await page.getByRole("button", { name: "我的 ME" }).click();
  await page.getByRole("button", { name: /联系与反馈/ }).click();

  const website = page.getByRole("link", { name: "WonderElian wonderelian.com" });
  await expect(website).toHaveAttribute("href", "https://wonderelian.com/");

  await page.getByRole("button", { name: "视频号 查看二维码" }).click();
  const qrDialog = page.getByRole("dialog", { name: "视频号二维码" });
  await expect(qrDialog.getByRole("img", { name: "WonderElian 视频号二维码" })).toBeVisible();
  await qrDialog.getByRole("button", { name: "关闭" }).last().click();
  await expect(qrDialog).toBeHidden();
});

test("keeps the current sound playing across Focus and My tabs", async ({ page }) => {
  await page.getByRole("button", { name: "播放" }).click();
  await page.getByRole("button", { name: "静心 FOCUS" }).click();
  await page.getByRole("button", { name: "我的 ME" }).click();
  await page.getByRole("button", { name: "声音 SOUNDS" }).click();
  await expect(page.getByRole("button", { name: "暂停" })).toHaveAttribute("aria-pressed", "true");
});

test("keeps all three bottom tabs on one fixed baseline", async ({ page }) => {
  const tabs = page.locator(".bottom-nav button");
  const initialBoxes = await tabs.evaluateAll((buttons) => buttons.map((button) => {
    const box = button.getBoundingClientRect();
    return { y: box.y, height: box.height };
  }));
  expect(new Set(initialBoxes.map((box) => box.y)).size).toBe(1);
  expect(new Set(initialBoxes.map((box) => box.height)).size).toBe(1);

  await page.getByRole("button", { name: "静心 FOCUS" }).click();
  const activeBoxes = await tabs.evaluateAll((buttons) => buttons.map((button) => {
    const box = button.getBoundingClientRect();
    return { y: box.y, height: box.height };
  }));
  expect(activeBoxes).toEqual(initialBoxes);
});

test("loads a real morning-birds recording instead of generated noise", async ({ page }) => {
  const request = page.waitForRequest((candidate) => candidate.url().endsWith("/assets/yixiu/audio/morning-birds.m4a"));
  await page.getByRole("button", { name: "我的 ME" }).click();
  await page.getByRole("button", { name: "浏览全部声音" }).click();
  await page.getByText("晨林鸟语", { exact: true }).click();

  await expect(page.getByRole("heading", { name: "晨林鸟语" })).toBeVisible();
  await expect(page.getByRole("button", { name: "暂停" })).toHaveAttribute("aria-pressed", "true");
  expect((await request).url()).toContain("morning-birds.m4a");
});

test("lays out all fourteen sounds in an even two-column library", async ({ page }) => {
  await page.getByRole("button", { name: "我的 ME" }).click();
  await page.getByRole("button", { name: "浏览全部声音" }).click();

  const cards = page.locator(".scene-grid article");
  await expect(cards).toHaveCount(14);
  await expect(page.getByText("春日花溪", { exact: true })).toBeVisible();
  await expect(page.getByText("晨林鸟语", { exact: true })).toBeVisible();

  const firstRow = await cards.evaluateAll((elements) => elements.slice(0, 2).map((element) => {
    const rect = element.getBoundingClientRect();
    return { width: rect.width, height: rect.height, top: rect.top };
  }));
  expect(Math.abs(firstRow[0].width - firstRow[1].width)).toBeLessThan(1);
  expect(Math.abs(firstRow[0].height - firstRow[1].height)).toBeLessThan(1);
  expect(Math.abs(firstRow[0].top - firstRow[1].top)).toBeLessThan(1);
});
