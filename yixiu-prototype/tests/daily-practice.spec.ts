import { expect, test } from "@playwright/test";
import { decodeJournal, weekDays } from "../src/practiceJournal";

test("journal decoding caps history at 200 and rejects unsupported durations", () => {
  const entries = Array.from({ length: 205 }, (_, index) => ({ id: String(index), completedAt: Date.now() - index * 1000, sceneId: "birds", seconds: 300, kind: "listening" }));
  const decoded = decodeJournal([{}, null, { ...entries[0], id: "bad", seconds: 5 }, ...entries], ["birds"]);
  expect(decoded).toHaveLength(200);
  expect(new Set(decoded.map(entry => entry.id)).size).toBe(200);
  expect(decodeJournal({ entries }, ["birds"])).toEqual([]);
});

test("journal week begins at local Monday across month boundaries", () => {
  const week = weekDays(new Date(2026, 8, 5, 12));
  expect(week).toHaveLength(7);
  expect(week[0].getDay()).toBe(1);
  expect(week[0].getDate()).toBe(31);
  expect(week[0].getMonth()).toBe(7);
  expect(week[6].getDate()).toBe(6);
});

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?lang=en");
});

test("three quick practices start their matching free sound and timer", async ({ page }) => {
  await page.getByRole("button", { name: "Focus 静心" }).click();
  await expect(page.locator(".daily-practice")).toHaveCount(3);
  await page.getByRole("button", { name: /Let the day settle/ }).click();
  await expect(page).toHaveURL(/scene=rain/);
  await expect(page.locator(".duration-button")).toHaveText(/15:00/);
  await expect(page.getByRole("button", { name: "Pause", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Focus 静心" }).click();
  await page.getByRole("button", { name: /Begin a little lighter/ }).click();
  await expect(page).toHaveURL(/scene=birds/);
  await expect(page.locator(".duration-button")).toHaveText(/05:00/);
});

test("only a completed practice creates a persistent replayable journal entry", async ({ page }) => {
  await page.clock.install();
  await page.getByRole("button", { name: "Me 我的" }).click();
  await expect(page.locator(".journal-empty")).toBeVisible();
  await page.getByRole("button", { name: "Focus 静心" }).click();
  await page.getByRole("button", { name: /Begin a little lighter/ }).click();
  await page.clock.fastForward(120_000);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("yixiu.practiceJournal.v1")!))).toHaveLength(0);
  await page.clock.fastForward(180_000);
  await page.getByRole("dialog", { name: "Water wisdom" }).getByRole("button").click();
  await page.getByRole("button", { name: "Me 我的" }).click();
  await expect(page.locator(".journal-heading strong")).toHaveText("5");
  await expect(page.locator(".journal-entry")).toHaveCount(1);
  await page.reload();
  await page.getByRole("button", { name: "Me 我的" }).click();
  await page.getByRole("button", { name: "Practice again: Morning Birds" }).click();
  await expect(page.locator(".duration-button")).toHaveText("05:00");
});

test("one-minute breathing with ambience counts once and supports pause and replay", async ({ page }) => {
  await page.clock.install();
  await page.getByRole("button", { name: "Focus 静心" }).click();
  await page.getByRole("button", { name: /A pause between things/ }).click();
  await expect(page.locator(".daily-practices")).toHaveCount(0);
  await expect(page).toHaveURL(/scene=stream/);
  await page.clock.fastForward(20_000);
  await page.getByRole("button", { name: "Pause breathing" }).click();
  await page.clock.fastForward(90_000);
  await expect(page.locator(".breathing-readout span")).toHaveText("00:40");
  await page.getByRole("button", { name: "Continue breathing" }).click();
  await page.clock.fastForward(40_000);
  await expect(page.getByRole("button", { name: "Begin again", exact: true })).toBeVisible();
  await page.clock.fastForward(1800_000);
  await page.getByRole("button", { name: "Me 我的" }).click();
  await expect(page.locator(".journal-entry")).toHaveCount(1);
  await expect(page.locator(".journal-heading strong")).toHaveText("1");
  await page.getByRole("button", { name: "Practice again: Water Breathing" }).click();
  await expect(page.locator(".breathing-readout span")).toHaveText("01:00");
});

test("malformed and duplicate local journal records are handled defensively", async ({ page }) => {
  await page.evaluate(() => {
    const entry = { id: "test-record", completedAt: Date.now(), sceneId: "birds", seconds: 300, kind: "listening" };
    localStorage.setItem("yixiu.practiceJournal.v1", JSON.stringify([null, {}, entry, entry, { ...entry, id: "bad-scene", sceneId: "missing" }, { ...entry, id: "bad-time", seconds: -60 }]));
  });
  await page.reload();
  await page.getByRole("button", { name: "Me 我的" }).click();
  await expect(page.locator(".journal-entry")).toHaveCount(1);
  await expect(page.locator(".journal-heading strong")).toHaveText("5");
});

test("storage denial leaves the app usable and gives an honest journal notice", async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException("Unavailable", "QuotaExceededError"); }; });
  await page.reload();
  await page.getByRole("button", { name: "Me 我的" }).click();
  await expect(page.locator(".practice-journal").getByRole("status")).toContainText("Storage unavailable");
});

for (const minutes of [5, 10]) {
  test(`Focus offers, completes and restores the ${minutes}-minute practice`, async ({ page }) => {
    await page.clock.install();
    await page.getByRole("button", { name: "Focus 静心" }).click();
    await expect(page.locator(".focus-duration-options button")).toHaveCount(4);
    await page.locator(".focus-duration-options").getByRole("button", { name: `${minutes} MIN`, exact: true }).click();
    await expect(page.locator(".breathing-readout span")).toHaveText(`${String(minutes).padStart(2, "0")}:00`);
    await page.getByRole("button", { name: `Start ${minutes} minutes`, exact: true }).click();
    await page.clock.fastForward(minutes * 60_000);
    await page.getByRole("button", { name: "Me 我的" }).click();
    await expect(page.locator(".journal-heading strong")).toHaveText(String(minutes));
    await page.reload();
    await page.getByRole("button", { name: "Me 我的" }).click();
    await expect(page.locator(".journal-entry")).toHaveCount(1);
    await page.getByRole("button", { name: "Practice again: Water Breathing" }).click();
    await expect(page.locator(".breathing-readout span")).toHaveText(`${String(minutes).padStart(2, "0")}:00`);
  });
}

test("cards share a 12px gap and quick practices use play icons", async ({ page }) => {
  await page.getByRole("button", { name: "Focus 静心" }).click();
  await expect(page.locator(".daily-practice > .practice-play-icon")).toHaveCount(3);
  const quick = await page.locator(".daily-practice").evaluateAll(nodes => nodes.map(node => {
    const box = node.getBoundingClientRect(); return { top: box.top, bottom: box.bottom };
  }));
  expect(quick[1].top - quick[0].bottom).toBeCloseTo(12, 0);
  expect(quick[2].top - quick[1].bottom).toBeCloseTo(12, 0);
  await page.getByRole("button", { name: "Me 我的" }).click();
  const cards = await page.locator(".me-scroll > section").evaluateAll(nodes => nodes.slice(0, 5).map(node => {
    const box = node.getBoundingClientRect(); return { top: box.top, bottom: box.bottom };
  }));
  for (let index = 1; index < cards.length; index++) expect(cards[index].top - cards[index - 1].bottom).toBeCloseTo(12, 0);
});

for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 1024, height: 1366 }, { width: 1366, height: 1024 }]) {
  test(`daily UI stays within ${viewport.width} by ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.getByRole("button", { name: "Focus 静心" }).click();
    const preferences = await page.locator(".focus-duration-options").boundingBox();
    expect(preferences!.x).toBeGreaterThanOrEqual(0);
    expect(preferences!.x + preferences!.width).toBeLessThanOrEqual(viewport.width);
    const cards = page.locator(".daily-practice");
    for (const card of await cards.all()) {
      const box = await card.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 1);
    }
    await page.getByRole("button", { name: "Me 我的" }).click();
    const journal = await page.locator(".practice-journal").boundingBox();
    expect(journal!.x + journal!.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
