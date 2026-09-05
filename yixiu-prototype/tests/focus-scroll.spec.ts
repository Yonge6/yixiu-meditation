import { expect, test } from "@playwright/test";

for (const browserName of ["chromium", "webkit"] as const) {
  test.describe(`Focus vertical layout / ${browserName}`, () => {
    for (const viewport of [{ width: 810, height: 880 }, { width: 768, height: 820 }, { width: 1024, height: 600 }, { width: 390, height: 600 }]) {
      test(`uncompressed content and native scrolling at ${viewport.width}×${viewport.height}`, async ({ playwright, baseURL }) => {
        const browser = await playwright[browserName].launch();
        const context = await browser.newContext({ viewport, hasTouch: true, baseURL });
        const page = await context.newPage();
        try {
        await page.goto("/?lang=zh");
        await page.getByRole("button", { name: "静心 FOCUS" }).click();
        const focus = page.locator(".focus-screen");
        const positions = await focus.evaluate(root => {
          const box = (selector: string) => {
            const rect = root.querySelector(selector)!.getBoundingClientRect();
            return { top: rect.top, bottom: rect.bottom, height: rect.height };
          };
          return { intro: box(".section-intro"), settings: box(".focus-preferences"), orbit: box(".breathing-orbit"),
            readout: box(".breathing-readout"), action: box(".focus-primary"), scroll: root.scrollHeight, height: root.clientHeight };
        });
        expect(positions.settings.top).toBeGreaterThanOrEqual(positions.intro.bottom);
        expect(positions.orbit.top).toBeGreaterThanOrEqual(positions.settings.bottom);
        expect(positions.orbit.height).toBeGreaterThanOrEqual(viewport.width >= 720 ? 238 : 180);
        expect(positions.readout.top).toBeGreaterThanOrEqual(positions.orbit.bottom - 5);
        expect(positions.action.top).toBeGreaterThan(positions.readout.bottom);
        expect(positions.scroll).toBeGreaterThan(positions.height);

        // Native browser input, not synthetic DOM events or an assigned scrollTop.
        if (browserName === "chromium") {
          const input = await context.newCDPSession(page);
          const x = viewport.width / 2;
          const startY = viewport.height * 0.65;
          await input.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y: startY, id: 1 }] });
          for (let step = 1; step <= 8; step++) {
            await input.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: startY - step * 35, id: 1 }] });
            await page.waitForTimeout(20);
          }
          await input.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
          await input.detach();
        } else {
          await page.mouse.move(viewport.width / 2, viewport.height / 2);
          await page.mouse.wheel(0, 700);
        }
        await expect.poll(() => focus.evaluate(root => root.scrollTop)).toBeGreaterThan(20);
        await page.mouse.move(viewport.width / 2, viewport.height / 2);
        await page.mouse.wheel(0, 2000);
        const shortcuts = page.locator(".daily-practice");
        await expect(shortcuts.last()).toBeInViewport();
        await expect.poll(async () => {
          const last = await shortcuts.last().boundingBox();
          const nav = await page.locator(".bottom-nav").boundingBox();
          return last!.y + last!.height <= nav!.y;
        }).toBe(true);
        const start = page.getByRole("button", { name: "开始 1 分钟", exact: true });
        await expect(start).toBeInViewport();
        await expect.poll(async () => {
          const button = await start.boundingBox();
          const nav = await page.locator(".bottom-nav").boundingBox();
          return button!.y + button!.height <= nav!.y;
        }).toBe(true);
        await start.click();
        await expect(page.getByRole("button", { name: "暂停呼吸" })).toBeInViewport();
        await expect(focus).toHaveAttribute("data-practicing", "true");
        await expect(page.locator(".daily-practices")).toHaveCount(0);
        } finally { await browser.close(); }
      });
    }
  });
}
