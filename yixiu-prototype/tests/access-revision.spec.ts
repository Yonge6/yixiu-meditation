import { test, expect } from '@playwright/test';

const freeNature = new Set(['ocean', 'rain', 'spring', 'birds', 'stream', 'lake', 'valley', 'bamboo', 'window', 'tide']);
const nature = [...freeNature, 'falls', 'thunder', 'underwater', 'snow'];
for (const scene of nature) test(`nature ${scene} follows the 10 Free / 4 Plus policy`, async ({ page }) => {
  await page.goto(`/?scene=${scene}&lang=zh`);
  await page.getByRole('button', { name: '播放', exact: true }).click();
  if (freeNature.has(scene)) {
    await expect(page.getByRole('button', { name: '暂停', exact: true })).toBeVisible();
    await expect(page.getByRole('dialog', { name: '升级一休 Plus' })).toHaveCount(0);
  } else {
    await expect(page.getByRole('dialog', { name: '升级一休 Plus' })).toBeVisible();
  }
});

for (const width of [390, 572, 768, 1248]) test(`simplified header and library at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1170 });
  await page.goto('/?scene=rain&lang=zh');
  await expect(page.locator('.header-journal-button')).toHaveCount(0);
  await expect(page.locator('.player-header .header-actions button')).toHaveCount(2);
  await expect(page.locator('.player-header .header-actions a')).toHaveCount(1);
  const header = await page.locator('.player-header').boundingBox();
  expect(header!.y).toBeLessThanOrEqual(46);
  expect(header!.y).toBeGreaterThanOrEqual(8);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `/tmp/yixiu-access-header-${width}.png` });
  await page.getByRole('button', { name: '我的 ME', exact: true }).click();
  await expect(page.getByText('10 种自然声 + 12 首音乐（含 10 首古典）', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '浏览全部声音' }).click();
  const library = page.getByRole('dialog', { name: '声音库' });
  await library.getByRole('tab', { name: '自然声', exact: true }).click();
  await expect(library.locator('.scene-grid article')).toHaveCount(14);
  await expect(library.locator('.scene-access-badge.is-free')).toHaveCount(10);
  await expect(library.locator('.scene-access-badge.is-plus')).toHaveCount(4);
  await library.getByRole('tab', { name: '古典静听', exact: true }).click();
  await expect(library.locator('.scene-access-badge.is-free')).toHaveCount(10);
  await expect(library.locator('.scene-access-badge.is-plus')).toHaveCount(10);
  await expect(library.getByRole('link', { name: /免费完整试听/ })).toHaveCount(0);
  await page.screenshot({ path: `/tmp/yixiu-access-classical-${width}.png` });
});
