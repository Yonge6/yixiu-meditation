import { expect, test } from "@playwright/test";

for (const language of ["zh", "en"]) {
  for (const width of [320, 390, 810, 1024]) {
    test(`compact shortcuts follow breathing / ${language} / ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`/?lang=${language}`);
      await page.getByRole("button", { name: language === "zh" ? "静心 FOCUS" : "Focus 静心" }).click();
      const geometry = await page.locator(".focus-screen").evaluate(root => {
        const action = root.querySelector(".focus-primary")!.getBoundingClientRect();
        const cards = [...root.querySelectorAll(".daily-practice")].map(node => {
          const box = node.getBoundingClientRect();
          return { x: box.x, y: box.y, width: box.width, height: box.height };
        });
        return { actionBottom: action.bottom, cards };
      });
      expect(geometry.cards).toHaveLength(3);
      for (const card of geometry.cards) {
        expect(card.y).toBeGreaterThan(geometry.actionBottom);
        expect(card.height).toBeGreaterThanOrEqual(80);
        expect(card.height).toBeLessThanOrEqual(100);
        expect(card.y).toBeCloseTo(geometry.cards[0].y, 0);
      }
      for (let index = 1; index < 3; index++) {
        expect(geometry.cards[index].x - geometry.cards[index - 1].x - geometry.cards[index - 1].width).toBeCloseTo(12, 0);
      }
      await expect(page.locator(".daily-practice img")).toHaveCount(0);
      if (language === "zh" && [390, 810].includes(width)) {
        await page.screenshot({ path: `/tmp/yixiu-compact-${width}-top.png` });
        await page.locator(".daily-practice").last().scrollIntoViewIfNeeded();
        await page.screenshot({ path: `/tmp/yixiu-compact-${width}-bottom.png` });
      }
    });
  }
}

test("free membership gates all longer focus options and preserves one minute", async ({ page }) => {
  await page.goto("/?lang=zh");
  await page.getByRole("button", { name: "静心 FOCUS" }).click();
  for (const minutes of [3, 5, 10]) {
    const choice = page.locator(".focus-duration-options button").filter({ hasText: `${minutes} 分钟` });
    await expect(choice.locator(".entitlement-lock")).toHaveCount(1);
    await choice.click();
    const dialog = page.getByRole("dialog", { name: "升级一休 Plus" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("尚不支持同步 Apple 订阅");
    await dialog.getByRole("button", { name: "关闭", exact: true }).last().click();
    await expect(page.locator(".breathing-readout span")).toHaveText("01:00");
  }
});

test("timer gates and membership entry match free native settings", async ({ page }) => {
  await page.goto("/?lang=en");
  await page.getByRole("button", { name: "Timer", exact: true }).click();
  const timer = page.locator(".timer-panel");
  await expect(timer.locator(".entitlement-lock")).toHaveCount(2);
  await timer.getByRole("button", { name: /60/ }).click();
  const dialog = page.getByRole("dialog", { name: "Upgrade to Yixiu Plus" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close", exact: true }).last().click();
  await page.getByRole("button", { name: "Me 我的" }).click();
  await expect(page.locator(".settings-duration .entitlement-lock")).toHaveCount(2);
  await page.locator(".settings-duration").getByRole("button", { name: /∞/ }).click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close", exact: true }).last().click();
  await page.locator(".membership-card button").click();
  await expect(dialog).toContainText("restore purchases in the app");
});

test("membership details remain scrollable on a short portrait screen", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/?lang=en");
  await page.getByRole("button", { name: "Focus 静心" }).click();
  await page.locator(".focus-duration-options button").filter({ hasText: "10 MIN" }).click();
  const panel = page.locator(".plus-upgrade-modal section");
  const box = await panel.boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(568);
  await panel.locator("em").scrollIntoViewIfNeeded();
  await expect(panel.locator("em")).toBeInViewport();
  await panel.getByRole("button", { name: "Close", exact: true }).click();
  await expect(panel).toHaveCount(0);
});

test("old premium settings and journal replay cannot grant H5 membership", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("yixiu.focusDuration", "10");
    localStorage.setItem("yixiu.duration", "60");
    localStorage.setItem("yixiu.practiceJournal.v1", JSON.stringify([{ id: "old", completedAt: Date.now(), sceneId: "stream", seconds: 600, kind: "breathing" }]));
  });
  await page.goto("/?lang=en");
  await expect(page.locator(".duration-button")).toHaveText(/30/);
  await page.getByRole("button", { name: "Focus 静心" }).click();
  await expect(page.locator(".breathing-readout span")).toHaveText("01:00");
  await page.getByRole("button", { name: "Me 我的" }).click();
  await page.getByRole("button", { name: "Practice again: Water Breathing" }).click();
  await expect(page.getByRole("dialog", { name: "Upgrade to Yixiu Plus" })).toBeVisible();
});
