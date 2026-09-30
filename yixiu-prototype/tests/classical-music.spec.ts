import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { classicalMusic } from '../src/data/classical-music';
const freeClassical = new Set(["clairDeLune", "gymnopedie", "canon", "moonlightSonata", "preludeC", "traumerei", "raindrop", "waltzAMinor", "gnossienne", "mozartAndante"]);
const manifest = JSON.parse(readFileSync('../docs/audio/classical-ten-sources.json', 'utf8'));

test('ten complete recordings and artworks match native assets and verified hashes', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/music-credits.html');
  await expect(page.locator('#classical article')).toHaveCount(20);
  for (const track of manifest.tracks) {
    const web = readFileSync(`public/assets/yixiu/audio/meditation/${track.slug}.m4a`);
    expect(web.equals(readFileSync(`../YixiuMeditation/YixiuMeditation/Audio/Meditation/${track.slug}.m4a`))).toBe(true);
    expect(createHash('sha256').update(web).digest('hex')).toBe(track.sha256);
    const image = readFileSync(`public/assets/yixiu/classical/${track.slug}.jpg`);
    expect(createHash('sha256').update(image).digest('hex')).toBe(track.artSha256);
    const result = await page.evaluate(async ({ slug }) => {
      const audio = document.querySelector<HTMLAudioElement>(`#${slug} audio`)!;
      audio.muted = true;
      await Promise.race([audio.play(), new Promise((_, reject) => setTimeout(() => reject(new Error(JSON.stringify({ slug, readyState: audio.readyState, networkState: audio.networkState, error: audio.error?.message, duration: audio.duration }))), 10_000))]);
      await new Promise(resolve => setTimeout(resolve, 150));
      const r = { duration: audio.duration, playing: !audio.paused, time: audio.currentTime, error: audio.error?.message };
      audio.pause();
      audio.removeAttribute('src');
      audio.load(); // Release each HTTP connection before loading the next fixture.
      return r;
    }, track);
    expect(result.error).toBeUndefined();
    expect(result.playing).toBe(true);
    expect(result.time).toBeGreaterThan(0);
    expect(Math.abs(result.duration - track.durationSeconds)).toBeLessThan(0.2);
    const article = page.locator(`#${track.slug}`);
    await expect(article.getByRole('link', { name: track.license, exact: true })).toHaveAttribute('href', track.licenseUrl);
    await expect(article.locator('a[download]')).toHaveCount(1);
  }
});

for (const width of [390, 768]) test(`classical library has twenty cards and scrolls at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 844 });
  await page.goto('/?lang=zh');
  await page.getByRole('button', { name: '我的 ME' }).click();
  await page.getByRole('button', { name: '浏览全部声音' }).click();
  const library = page.getByRole('dialog', { name: '声音库' });
  await library.getByRole('tab', { name: '古典静听', exact: true }).click();
  await expect(library.locator('.scene-grid article')).toHaveCount(20);
  await expect(library.locator('.scene-access-badge.is-plus')).toHaveCount(10);
  for (const track of classicalMusic) await expect(library.locator(`[data-scene-id="${track.id}"]`)).toHaveCount(1);
  await library.locator('[data-scene-id="prelude17"]').scrollIntoViewIfNeeded();
  await expect(library.locator('[data-scene-id="prelude17"]')).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `/tmp/yixiu-classical-library-${width}.png` });
  await expect(library.locator('.classical-listening-note')).toHaveCount(0);
  await expect(library.locator('.scene-access-badge.is-free')).toHaveCount(10);
});

for (const track of classicalMusic) test(`${track.id} share preserves artwork and assigned access`, async ({ page }) => {
  await page.goto(`/?music=${track.id}&lang=zh`);
  await expect(page.getByRole('heading', { name: track.zh, exact: true })).toBeVisible();
  await expect(page.locator('.yixiu-app')).toHaveAttribute('data-scene', track.id);
  await page.getByRole('button', { name: '播放', exact: true }).click();
  if (freeClassical.has(track.id)) {
    await expect(page.getByRole('button', { name: '暂停', exact: true })).toBeVisible();
    await expect(page.getByRole('dialog', { name: '升级一休 Plus' })).toHaveCount(0);
    return;
  }
  await expect(page.getByRole('dialog', { name: '升级一休 Plus' })).toBeVisible();
  await expect(page.getByRole('link', { name: '20 首古典名曲 · 免费完整试听' })).toHaveAttribute('href', '/music-credits.html#classical');
});
