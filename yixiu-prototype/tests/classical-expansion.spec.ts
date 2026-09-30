import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const { tracks } = JSON.parse(readFileSync('../docs/audio/classical-expansion-sources.json', 'utf8'));

test('new recordings decode, match native copies, and retain open credits', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/music-credits.html');
  await expect(page.locator('#classical article')).toHaveCount(20);
  for (const t of tracks) {
    const web = readFileSync(`public/assets/yixiu/audio/meditation/${t.slug}.m4a`);
    expect(createHash('sha256').update(web).digest('hex')).toBe(t.sha256);
    expect(web.equals(readFileSync(`../YixiuMeditation/YixiuMeditation/Audio/Meditation/${t.slug}.m4a`))).toBe(true);
    const audio = page.locator(`#${t.slug} audio`);
    const duration = await audio.evaluate(async (element: HTMLAudioElement) => {
      element.muted = true;
      await element.play();
      const duration = element.duration;
      element.pause(); element.removeAttribute('src'); element.load();
      return duration;
    });
    expect(Math.abs(duration - t.durationSeconds)).toBeLessThan(0.2);
    await expect(page.locator(`#${t.slug} a[download]`)).toHaveCount(1);
  }
});

for (const width of [390, 768, 1248]) test(`filters stay pinned while all twenty classical cards scroll at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 844 });
  await page.goto('/?lang=zh');
  await page.getByRole('button', { name: '我的 ME', exact: true }).click();
  await page.getByRole('button', { name: '浏览全部声音' }).click();
  const library = page.getByRole('dialog', { name: '声音库' });
  const tabs = library.getByRole('tablist');
  await library.getByRole('tab', { name: '古典静听', exact: true }).click();
  await expect(library.locator('.scene-grid article')).toHaveCount(20);
  await expect(library.locator('.scene-access-badge.is-free')).toHaveCount(10);
  await expect(library.locator('.scene-access-badge.is-plus')).toHaveCount(10);
  const before = await tabs.boundingBox();
  await library.locator('[data-scene-id="preludeBMinor"]').scrollIntoViewIfNeeded();
  await expect(library.locator('[data-scene-id="preludeBMinor"]')).toBeInViewport();
  const after = await tabs.boundingBox();
  expect(Math.abs(before!.y - after!.y)).toBeLessThan(1);
  await expect(library.getByRole('tab', { name: '古典静听', exact: true })).toBeInViewport();
  await page.screenshot({ path: `/tmp/yixiu-expanded-library-${width}.png` });
});

test('home next and previous traverse all Free scenes before Plus, preserving boundaries', async ({ page }) => {
  await page.goto('/?scene=ocean&lang=zh');
  const order = ['ocean','rain','spring','birds','stream','lake','valley','bamboo','window','tide','firstBreath','oasisRest','clairDeLune','gymnopedie','canon','moonlightSonata','preludeC',...tracks.filter((t: any)=>t.free).map((t: any)=>t.id)];
  await expect(page.getByRole('button', { name: '上一种声音' })).toBeDisabled();
  for (const id of order.slice(1)) {
    await page.getByRole('button', { name: '下一种声音' }).click();
    await expect(page.locator('.yixiu-app')).toHaveAttribute('data-scene', id);
    await expect(page.getByRole('dialog', { name: '升级一休 Plus' })).toHaveCount(0);
  }
  await page.getByRole('button', { name: '上一种声音' }).click();
  await expect(page.locator('.yixiu-app')).toHaveAttribute('data-scene', order.at(-2)!);
});

for (const t of tracks) test(`${t.id} has assigned Free or Plus access`, async ({ page }) => {
  await page.goto(`/?music=${t.id}&lang=zh`);
  await expect(page.getByRole('heading', { name: t.zh, exact: true })).toBeVisible();
  await page.getByRole('button', { name: '播放', exact: true }).click();
  if (t.free) await expect(page.getByRole('button', { name: '暂停', exact: true })).toBeVisible();
  else await expect(page.getByRole('dialog', { name: '升级一休 Plus' })).toBeVisible();
});

test('horizontal gestures skip intervening Plus scenes in both directions', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?scene=stream&lang=zh');
  const zone = page.locator('.scene-swipe-zone');
  for (const [start, end, expected] of [[320, 60, 'lake'], [60, 320, 'stream']] as const) {
    const common = { pointerId: 1, pointerType: 'touch', button: 0, clientY: 300 };
    await zone.dispatchEvent('pointerdown', { ...common, clientX: start });
    await zone.dispatchEvent('pointermove', { ...common, clientX: (start + end) / 2 });
    await zone.dispatchEvent('pointerup', { ...common, clientX: end });
    await expect(page.locator('.yixiu-app')).toHaveAttribute('data-scene', expected);
    await expect(page.locator('.yixiu-app')).not.toHaveClass(/is-swipe-settling/);
    await expect(page.getByRole('dialog', { name: '升级一休 Plus' })).toHaveCount(0);
  }
});
