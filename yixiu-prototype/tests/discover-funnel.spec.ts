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
    await page.goto(item.path);
    await expect(page.getByRole("button", { name: item.preview })).toBeVisible();
    await expect(page.getByRole("link", { name: "Get Yixiu for iPhone", exact: true })).toHaveAttribute(
      "href",
      new RegExp(`ppid=${item.ppid}$`),
    );
    await expect(page.locator(".intent-trustline")).toBeVisible();
  }
});
