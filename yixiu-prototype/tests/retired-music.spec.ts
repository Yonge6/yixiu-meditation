import { expect, test } from '@playwright/test';

const retired = ['sunlitShore', 'oceanPassage', 'cloudDrift', 'quietOrbit'];
for (const scene of retired) test(`${scene} old links fall back without playback`, async ({ page }) => {
  const audioRequests: string[] = [];
  page.on('request', r => { if (r.url().includes('/meditation/')) audioRequests.push(r.url()); });
  await page.goto(`/?music=${scene}&lang=zh`);
  await expect(page.locator('.yixiu-app')).toHaveAttribute('data-scene', 'ocean');
  await expect(page.getByRole('heading', { name: '大海', exact: true })).toBeVisible();
  expect(audioRequests).toEqual([]);
});

test('saved removed scenes are sanitized and library contains 24 available sounds', async ({ page }) => {
  await page.addInitScript(ids => {
    localStorage.setItem('yixiu.scene', JSON.stringify(ids[0]));
    localStorage.setItem('yixiu.favorites', JSON.stringify([...ids, 'rain']));
    localStorage.setItem('yixiu.recentScenes', JSON.stringify([...ids, 'rain']));
  }, retired);
  await page.goto('/?lang=zh');
  await expect(page.locator('.yixiu-app')).toHaveAttribute('data-scene', 'ocean');
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('yixiu.favorites')!))).toEqual(['rain']);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('yixiu.recentScenes')!))).toEqual(['rain']);
  await page.getByRole('button', { name: '我的 ME' }).click();
  await page.getByRole('button', { name: '浏览全部声音' }).click();
  const library = page.getByRole('dialog', { name: '声音库' });
  await expect(library.locator('.scene-grid article')).toHaveCount(24);
  for (const name of ['日光浅岸', '海上行旅', '云间漂浮', '静默星轨']) await expect(library).not.toContainText(name);
  await library.getByRole('tab', { name: '冥想音乐', exact: true }).click();
  await expect(library.locator('.scene-grid article')).toHaveCount(10);
  await expect(library.locator('.scene-access-badge.is-free')).toHaveCount(2);
});
