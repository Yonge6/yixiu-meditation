import { expect, test, type Page } from '@playwright/test';

declare global {
  interface Window {
    bellDecoded: number;
    bellStarts: { duration: number; peak: number; loop: boolean }[];
  }
}

async function open(page: Page, enabled = true) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript((on) => {
    localStorage.clear();
    if (on) localStorage.setItem('yixiu.endBell', 'true');
    localStorage.setItem('yixiu.duration', '5');
    window.bellDecoded = 0;
    window.bellStarts = [];
    const decode = AudioContext.prototype.decodeAudioData;
    AudioContext.prototype.decodeAudioData = function (data) {
      return decode.call(this, data).then(buffer => { window.bellDecoded++; return buffer; });
    };
    const start = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function (when = 0, offset = 0, duration?) {
      if (this.buffer) {
        const samples = this.buffer.getChannelData(0);
        let peak = 0;
        for (const value of samples) peak = Math.max(peak, Math.abs(value));
        window.bellStarts.push({ duration: this.buffer.duration, peak, loop: this.loop });
      }
      start.call(this, when, offset, duration);
    };
  }, enabled);
  await page.clock.install();
  await page.goto('/?scene=rain&lang=zh');
}

async function focus(page: Page) {
  await page.getByRole('button', { name: '静心 FOCUS' }).click();
  await page.getByRole('button', { name: '开始 1 分钟', exact: true }).click();
}

async function ready(page: Page) {
  await expect.poll(() => page.evaluate(() => window.bellDecoded)).toBe(1);
}

const rings = (page: Page) => page.evaluate(() => window.bellStarts.length);

test('silent Focus rings once on completion, repeat session can ring again', async ({ page }) => {
  await open(page);
  await focus(page);
  await ready(page);
  await page.clock.fastForward(61000);
  await expect(page.getByRole('button', { name: '再来一次' })).toBeVisible();
  await expect.poll(() => rings(page)).toBe(1);
  const cue = await page.evaluate(() => window.bellStarts[0]);
  expect(cue.duration).toBeCloseTo(2.8);
  expect(cue.peak).toBeGreaterThan(0.1);
  expect(cue.peak).toBeLessThan(0.5);
  expect(cue.loop).toBe(false);
  await page.clock.fastForward(10000);
  await page.evaluate(() => { document.dispatchEvent(new Event('visibilitychange')); });
  expect(await rings(page)).toBe(1);
  await page.getByRole('button', { name: '再来一次' }).click();
  await page.clock.fastForward(61000);
  await expect.poll(() => rings(page)).toBe(2);
});

test('listening rings despite ambience reaching zero-volume fade', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: '播放', exact: true }).click();
  await ready(page);
  await page.clock.fastForward(301000);
  await expect(page.getByRole('dialog', { name: '水之箴言' })).toBeVisible();
  await expect.poll(() => rings(page)).toBe(1);
  await page.clock.fastForward(10000);
  expect(await rings(page)).toBe(1);
});

test('default-off does not ring for either completion path', async ({ page }) => {
  await open(page, false);
  await focus(page);
  await page.clock.fastForward(61000);
  await expect(page.getByRole('button', { name: '再来一次' })).toBeVisible();
  expect(await rings(page)).toBe(0);
  await page.getByRole('button', { name: '声音 SOUNDS' }).click();
  await page.getByRole('button', { name: '播放', exact: true }).click();
  await page.clock.fastForward(301000);
  await expect(page.getByRole('dialog', { name: '水之箴言' })).toBeVisible();
  expect(await rings(page)).toBe(0);
});

test('pausing and resetting Focus never ring; resume excludes paused time', async ({ page }) => {
  await open(page);
  await focus(page);
  await ready(page);
  await page.clock.fastForward(20000);
  await page.getByRole('button', { name: '暂停呼吸' }).click();
  await page.clock.fastForward(120000);
  expect(await rings(page)).toBe(0);
  await page.getByRole('button', { name: '继续呼吸' }).click();
  await page.clock.fastForward(41000);
  await expect.poll(() => rings(page)).toBe(1);
  await page.getByRole('button', { name: '再来一次' }).click();
  await page.clock.fastForward(10000);
  await page.getByRole('button', { name: '重新开始', exact: true }).click();
  await page.clock.fastForward(120000);
  expect(await rings(page)).toBe(1);
});

test('turning bell off mid-listening uses current preference without restarting timer', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: '播放', exact: true }).click();
  await ready(page);
  await page.clock.fastForward(100000);
  await page.getByRole('button', { name: '我的 ME' }).click();
  await page.getByRole('switch', { name: '结束提示音' }).click();
  await page.clock.fastForward(201000);
  await expect(page.getByRole('dialog', { name: '水之箴言' })).toBeVisible();
  expect(await rings(page)).toBe(0);
});

test('enabling bell mid-listening works without another gesture', async ({ page }) => {
  await open(page, false);
  await page.getByRole('button', { name: '播放', exact: true }).click();
  await ready(page);
  await page.clock.fastForward(100000);
  await page.getByRole('button', { name: '我的 ME' }).click();
  await page.getByRole('switch', { name: '结束提示音' }).click();
  await page.clock.fastForward(201000);
  await expect(page.getByRole('dialog', { name: '水之箴言' })).toBeVisible();
  await expect.poll(() => rings(page)).toBe(1);
});

test('pausing listening and leaving Focus early never ring', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: '播放', exact: true }).click();
  await ready(page);
  await page.clock.fastForward(100000);
  await page.getByRole('button', { name: '暂停', exact: true }).click();
  await page.clock.fastForward(301000);
  expect(await rings(page)).toBe(0);
  await focus(page);
  await page.clock.fastForward(10000);
  await page.getByRole('button', { name: '声音 SOUNDS' }).click();
  await page.clock.fastForward(61000);
  expect(await rings(page)).toBe(0);
});
