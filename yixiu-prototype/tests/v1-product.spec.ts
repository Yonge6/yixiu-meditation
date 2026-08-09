import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("opens on the ocean scene in a paused 30-minute state", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "大海" })).toBeVisible();
  await expect(page.getByRole("button", { name: "播放" })).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("button", { name: "30 分钟" })).toBeVisible();
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

test("selects timer and switches the interface language", async ({ page }) => {
  await page.getByRole("button", { name: "30 分钟" }).click();
  await page.getByRole("button", { name: "15 分钟" }).click();
  await expect(page.getByRole("button", { name: "15 分钟" })).toBeVisible();

  await page.getByRole("button", { name: "切换到英文" }).click();
  await expect(page.getByRole("heading", { name: "OCEAN WAVES" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Focus/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "Switch to Chinese" })).toContainText("中文");
});

test("opens a Wendao-style right drawer and closes it with Escape", async ({ page }) => {
  await page.getByRole("button", { name: "打开菜单" }).click();

  const drawer = page.getByRole("dialog", { name: "你的空间" });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByText("一休 · YIXIU")).toBeVisible();
  await expect(drawer.getByRole("button", { name: "浏览全部声音" })).toBeVisible();
  await expect(drawer.getByRole("button", { name: /产品哲学/ })).toBeVisible();
  await expect(drawer.getByText("界面语言")).toHaveCount(0);
  await expect(drawer.getByRole("button", { name: "EN", exact: true })).toHaveCount(0);

  await page.keyboard.press("Escape");
  await expect(drawer).toBeHidden();
});

test("runs and pauses the one-minute water breathing practice", async ({ page }) => {
  await page.getByRole("button", { name: "静心 FOCUS" }).click();
  await expect(page.getByRole("heading", { name: "水之呼吸" })).toBeVisible();

  await page.getByRole("button", { name: "开始 1 分钟" }).click();
  await expect(page.getByText("吸气", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "暂停呼吸" }).click();
  await expect(page.getByRole("button", { name: "继续呼吸" })).toBeVisible();
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
