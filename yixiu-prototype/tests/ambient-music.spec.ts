import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const tracks = [
  { id: 'cloudDrift', file: 'cloud-drift', zh: '云间漂浮', seconds: 532.173, hash: 'ff0c1a3741068ea6c2811ba8fe09a00a03d4ab9d34d10aa8c759510b58059ac0' },
  { id: 'softLightRest', file: 'soft-light-rest', zh: '柔光午憩', seconds: 338.88, hash: '11780f8702c10706364a6f3b34b30546277622046df230d98bd53e44ffdc8dc0' },
  { id: 'deepWaterRest', file: 'deep-water-rest', zh: '深水安歇', seconds: 322.827, hash: 'd1a35f8dac51ba4a6b994c6ef8d4c42736e629295200f9a91886d568c27f9a4f' },
];

test('ambient assets are identical in native/web and fully decode with gentle boundaries', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/music-credits.html');
  for (const track of tracks) {
    const web = readFileSync(`public/assets/yixiu/audio/meditation/${track.file}.m4a`);
    const native = readFileSync(`../YixiuMeditation/YixiuMeditation/Audio/Meditation/${track.file}.m4a`);
    expect(web.equals(native)).toBe(true);
    expect(createHash('sha256').update(web).digest('hex')).toBe(track.hash);
    const decoded = await page.evaluate(async file => {
      const context = new AudioContext();
      try {
        const response = await fetch(`/assets/yixiu/audio/meditation/${file}.m4a`);
        if (!response.ok) throw new Error(`Audio HTTP ${response.status}`);
        const buffer = await context.decodeAudioData(await response.arrayBuffer());
        let peak = 0, edge = 0, sum = 0;
        for (let c = 0; c < buffer.numberOfChannels; c++) {
          const data = buffer.getChannelData(c);
          for (let i = 0; i < data.length; i++) {
            peak = Math.max(peak, Math.abs(data[i])); sum += data[i] ** 2;
            if (i < 100 || i > data.length - 100) edge = Math.max(edge, Math.abs(data[i]));
          }
        }
        return { duration: buffer.duration, channels: buffer.numberOfChannels, peak, edge, rms: Math.sqrt(sum / (buffer.length * buffer.numberOfChannels)) };
      } finally { await context.close(); }
    }, track.file);
    expect(Math.abs(decoded.duration - track.seconds)).toBeLessThan(0.15);
    expect(decoded.channels).toBe(2);
    expect(decoded.peak).toBeLessThan(0.8);
    expect(decoded.edge).toBeLessThan(0.01);
    expect(decoded.rms).toBeGreaterThan(0.04);
    expect(decoded.rms).toBeLessThan(0.08);
  }
});

test('all three additions appear in matching categories and remain Plus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?lang=zh');
  await page.getByRole('button', { name: '我的 ME' }).click();
  await page.getByRole('button', { name: '浏览全部声音' }).click();
  const library = page.getByRole('dialog', { name: '声音库' });
  await expect(library.locator('.scene-grid article')).toHaveCount(27);
  for (const category of ['冥想音乐', '睡眠', '放松']) {
    await library.getByRole('tab', { name: category, exact: true }).click();
    for (const track of tracks) {
      const card = library.locator('.scene-grid article').filter({ hasText: track.zh });
      await expect(card).toHaveCount(1);
      await expect(card.locator('.scene-access-badge.is-plus')).toHaveCount(1);
    }
  }
  await library.getByRole('button', { name: '切换到深水安歇', exact: true }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: '/tmp/yixiu-ambient-library.png' });
  await library.getByText('柔光午憩', { exact: true }).click();
  await expect(page.getByRole('dialog', { name: '升级一休 Plus' })).toContainText('13 首冥想音乐');
  await expect(page.locator('.yixiu-app')).toHaveAttribute('data-scene', 'ocean');
});

test('credits preserve original titles, license, changes and ungated downloads', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 });
  await page.goto('/?lang=zh');
  await page.getByRole('button', { name: '我的 ME' }).click();
  await page.getByRole('button', { name: /声音来源/ }).click();
  await expect(page.locator('.me-article')).toContainText('Cylinder Seven');
  await page.getByRole('link', { name: '原曲与可下载音频' }).click();
  await expect(page).toHaveURL(/music-credits.html/);
  await expect(page.getByRole('link', { name: 'CC BY 4.0', exact: true })).toHaveAttribute('href', 'https://creativecommons.org/licenses/by/4.0/');
  await expect(page.locator('main')).toContainText('2 秒淡入、4 秒淡出');
  await expect(page.locator('audio')).toHaveCount(3);
  await expect(page.locator('a[download]')).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

for (const track of tracks) test(`shared ${track.id} links cannot grant Plus`, async ({ page }) => {
  await page.goto(`/?music=${track.id}&lang=zh`);
  await expect(page.getByRole('heading', { name: track.zh, exact: true })).toBeVisible();
  await page.getByRole('button', { name: '播放', exact: true }).click();
  await expect(page.getByRole('dialog', { name: '升级一休 Plus' })).toBeVisible();
  await expect(page.getByRole('button', { name: '播放', exact: true })).toHaveAttribute('aria-pressed', 'false');
});
