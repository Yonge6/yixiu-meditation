import { expect, test } from "@playwright/test";

for (const width of [320, 390]) {
  for (const language of ["zh", "en"] as const) {
    test(`library header stays spacious at ${width}px in ${language}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 740 });
      await page.goto(`/?lang=${language}`);
      await page.getByRole("button", { name: language === "zh" ? "我的 ME" : "Me 我的" }).click();
      await page.getByRole("button", { name: language === "zh" ? "浏览全部声音" : "Browse all sounds" }).click();

      const library = page.getByRole("dialog", { name: language === "zh" ? "声音库" : "Sound library" });
      const title = await library.locator(".library-title-row").boundingBox();
      const filter = await library.locator(".library-filter-row").boundingBox();
      const categories = await library.locator(".scene-category-tabs").boundingBox();
      expect(title).not.toBeNull();
      expect(filter).not.toBeNull();
      expect(categories).not.toBeNull();
      expect(filter!.y).toBeGreaterThanOrEqual(title!.y + title!.height + 8);
      expect(categories!.y).toBeGreaterThanOrEqual(filter!.y + filter!.height + 8);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await expect(library.getByRole("button", { name: language === "zh" ? "关闭声音库" : "Close sound library" })).toBeInViewport();
      if ((width === 390 && language === "zh") || (width === 320 && language === "en")) {
        await library.screenshot({ path: `/tmp/yixiu-library-header-${language}-${width}.png` });
      }

      await library.getByRole("button", { name: language === "zh" ? "搜索声音" : "Search sounds" }).click();
      await expect(library.getByRole("searchbox")).toBeVisible();
      await expect(library.getByRole("tab", { name: language === "zh" ? "全部" : "All", exact: true })).toBeInViewport();
    });
  }
}
