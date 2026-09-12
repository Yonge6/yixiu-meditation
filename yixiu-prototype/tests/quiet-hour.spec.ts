import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

test('Quiet Hour is identical on both platforms and honestly labeled as an extension', async ({ page }) => {
  const web = readFileSync('public/assets/yixiu/audio/meditation/quiet-hour.m4a');
  expect(createHash('sha256').update(web).digest('hex')).toBe('fc54aa9323b036c44b6a38871cc422361865fa6fedc9685a5705005a6d7eac74');
  expect(web.equals(readFileSync('../YixiuMeditation/YixiuMeditation/Audio/Meditation/quiet-hour.m4a'))).toBe(true);
  await page.goto('/?music=quietHour&lang=zh');
  await expect(page.getByRole('heading', { name: '午后留白', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '播放', exact: true }).click();
  await expect(page.getByRole('dialog', { name: '升级一休 Plus' })).toBeVisible();
});

test('Quiet Hour credits offer a full hour with working playback and seeking', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/music-credits.html#quiet-hour');
  const card = page.locator('#quiet-hour');
  await expect(card).toContainText('60 分钟延长版');
  await expect(card).toContainText('Too Brief A Time To Be Anything');
  await expect(card.getByRole('link', { name: 'CC0 1.0', exact: true })).toHaveAttribute('href', 'https://creativecommons.org/publicdomain/zero/1.0/');
  await card.locator('audio').evaluate(async (audio: HTMLAudioElement) => { await audio.play(); });
  await expect.poll(() => card.locator('audio').evaluate((a: HTMLAudioElement) => a.currentTime)).toBeGreaterThan(0);
  expect(await card.locator('audio').evaluate((a: HTMLAudioElement) => a.duration)).toBeCloseTo(3600, 0);
  await card.locator('audio').evaluate((a: HTMLAudioElement) => { a.currentTime = 2660; });
  await expect.poll(() => card.locator('audio').evaluate((a: HTMLAudioElement) => !a.seeking && a.currentTime > 2660)).toBe(true);
  await card.locator('audio').evaluate((a: HTMLAudioElement) => { a.currentTime = 3590; });
  await expect.poll(() => card.locator('audio').evaluate((a: HTMLAudioElement) => !a.seeking && a.currentTime > 3590)).toBe(true);
  await card.locator('audio').evaluate((a: HTMLAudioElement) => a.pause());
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '/tmp/yixiu-quiet-hour-credits.png' });
});

test('Quiet Hour appears in Meditation, Sleep and Relax with matching native names', async ({ page }) => {
  await page.goto('/?lang=zh');
  await page.getByRole('button', { name: '我的 ME' }).click();
  await page.getByRole('button', { name: '浏览全部声音' }).click();
  const library = page.getByRole('dialog', { name: '声音库' });
  await expect(library.locator('.scene-grid article')).toHaveCount(28);
  for (const category of ['冥想音乐', '睡眠', '放松']) {
    await library.getByRole('tab', { name: category, exact: true }).click();
    const card = library.locator('.scene-grid article').filter({ hasText: '午后留白' });
    await expect(card).toContainText('60 分钟延长版');
    await expect(card.locator('.scene-access-badge.is-plus')).toHaveCount(1);
  }
  const native = readFileSync('../YixiuMeditation/YixiuMeditation/Models.swift', 'utf8');
  for (const value of ['case quietHour', '午后留白', 'Quiet Hour', '60 min extended', '60 分钟延长版', 'quiet-hour']) expect(native).toContain(value);
});
