import { expect, test } from '@playwright/test';

for (const [scene, title, file] of [
  ['oasisRest', '绿洲停歇', 'oasis-rest'],
  ['oceanPassage', '海上行旅', 'ocean-passage'],
  ['firstBreath', '初息', 'first-breath'],
]) {
  test(`${title} is Free from a deep link and plays its own track`, async ({ page }) => {
    await page.goto(`/?music=${scene}&lang=zh`);
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    const request = page.waitForRequest(r => r.url().endsWith(`/meditation/${file}.m4a`));
    await page.getByRole('button', { name: '播放', exact: true }).click();
    await request;
    await expect(page.getByRole('button', { name: '暂停', exact: true })).toBeVisible();
    await expect(page.getByRole('dialog', { name: '升级一休 Plus' })).toHaveCount(0);
  });
}

test('Still Water is Plus even with old saved preferences or local membership flags', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('yixiu.plus', 'true');
    localStorage.setItem('yixiu.activeScene', '"stillWater"');
  });
  await page.goto('/?music=stillWater&lang=zh');
  await page.getByRole('button', { name: '播放', exact: true }).click();
  await expect(page.getByRole('dialog', { name: '升级一休 Plus' })).toBeVisible();
});
