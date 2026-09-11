import { expect, test } from "@playwright/test";

test.beforeEach(async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto("/?lang=zh");
  await page.evaluate(()=>localStorage.clear());
  await page.reload();
});

test("all Focus choices are visible, extended options stay gated", async ({page}) => {
  await page.getByRole("button", {name:"静心 FOCUS"}).click();
  for (const minutes of [3,5,10]) {
    await page.locator(".focus-duration-options").getByRole("button", {name:`${minutes} 分钟`,exact:true}).click();
    const modal = page.getByRole("dialog", {name:"升级一休 Plus"});
    await expect(modal).toBeVisible();
    await modal.locator(".plus-upgrade-close").click();
  }
  await expect(page.getByRole("button", {name:"开始 1 分钟"})).toBeVisible();
});

test("compact shortcuts launch the matching scene and timer", async ({page}) => {
  await page.getByRole("button", {name:"静心 FOCUS"}).click();
  const quick = page.locator(".quick-practices");
  const boxes = await quick.locator("button").evaluateAll(nodes => nodes.map(node=>({y:node.getBoundingClientRect().y,height:node.getBoundingClientRect().height})));
  expect(new Set(boxes.map(b=>Math.round(b.y))).size).toBe(1);
  expect(Math.max(...boxes.map(b=>b.height))).toBeLessThanOrEqual(100);
  await quick.getByRole("button", {name:"清晨唤醒 5 分钟"}).click();
  await expect(page.getByRole("heading", {name:"晨林鸟语"})).toBeVisible();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem("yixiu.duration")!))).toBe(5);
  await page.getByRole("button", {name:"静心 FOCUS"}).click();
  await quick.getByRole("button", {name:"睡前放松 15 分钟"}).click();
  await expect(page.getByRole("heading", {name:"屋檐雨"})).toBeVisible();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem("yixiu.duration")!))).toBe(15);
});

test("elapsed-time Focus records once, excludes pauses and persists", async ({page}) => {
  await page.clock.install();
  await page.getByRole("button", {name:"静心 FOCUS"}).click();
  await page.getByRole("button", {name:"开始 1 分钟"}).click();
  await page.clock.fastForward(20000);
  await page.getByRole("button", {name:"暂停呼吸"}).click();
  await page.clock.fastForward(600000);
  await expect(page.locator(".breathing-readout span")).toHaveText("00:40");
  await page.getByRole("button", {name:"继续呼吸"}).click();
  await page.clock.fastForward(41000);
  await expect(page.getByRole("button", {name:"再来一次"})).toBeVisible();
  await page.clock.fastForward(5000);
  await page.getByRole("button", {name:"我的 ME"}).click();
  await expect(page.getByTestId("week-minutes")).toHaveText("1");
  await expect(page.locator(".journal-entries button")).toHaveCount(1);
  await page.reload();
  await page.getByRole("button", {name:"我的 ME"}).click();
  await expect(page.getByTestId("week-minutes")).toHaveText("1");
  await page.getByRole("button", {name:"再次练习 大海"}).click();
  await expect(page.getByRole("button", {name:"开始 1 分钟"})).toBeVisible();
});

test("listening completion records matching scene after a delayed tick", async ({page}) => {
  await page.clock.install();
  await page.getByRole("button", {name:"静心 FOCUS"}).click();
  await page.getByRole("button", {name:"清晨唤醒 5 分钟"}).click();
  await page.clock.fastForward(301000);
  await expect(page.getByRole("dialog", {name:"水之箴言"})).toBeVisible();
  const journal = await page.evaluate(()=>JSON.parse(localStorage.getItem("yixiu.practiceJournal.v1")!));
  expect(journal).toHaveLength(1);
  expect(journal[0]).toMatchObject({sceneID:"birds",kind:"listening",seconds:300});
});

test("migrates old durations and ignores invalid journals without granting membership", async ({page}) => {
  await page.evaluate(()=>{
    localStorage.setItem("yixiu.focusDuration", "10"); localStorage.setItem("yixiu.duration", "60");
    localStorage.setItem("yixiu.practiceJournal.v1", '{"bad":true}');
    localStorage.setItem("yixiu.plus", "true");
  });
  await page.reload();
  await page.getByRole("button", {name:"静心 FOCUS"}).click();
  await expect(page.getByRole("button", {name:"开始 1 分钟"})).toBeVisible();
  await page.getByRole("button", {name:"我的 ME"}).click();
  await expect(page.getByTestId("week-minutes")).toHaveText("0");
  await expect(page.getByText("一休 · 免费版", {exact:true})).toBeVisible();
});

for (const size of [{width:390,height:600},{width:768,height:1024},{width:1024,height:768},{width:844,height:390}]) {
  test(`Focus scroll and Me card gaps ${size.width}x${size.height}`, async ({page}) => {
    await page.setViewportSize(size);
    await page.getByRole("button", {name:"静心 FOCUS"}).click();
    const quick = page.locator(".quick-practices");
    await quick.scrollIntoViewIfNeeded();
    await page.locator(".focus-screen").evaluate(el=>{el.scrollTop = el.scrollHeight;});
    expect(await page.locator(".focus-screen").evaluate(el=>el.scrollHeight>el.clientHeight ? el.scrollTop>0 : true)).toBe(true);
    const orbit = await page.locator(".breathing-orbit").boundingBox();
    const prefs = await page.locator(".focus-preferences").boundingBox();
    if (size.width<760) expect(orbit!.y).toBeGreaterThanOrEqual(prefs!.y+prefs!.height);
    await page.getByRole("button", {name:"我的 ME"}).click();
    const gaps = await page.locator(".me-scroll").evaluate(el=>{const visible=Array.from(el.children).filter(node=>getComputedStyle(node).display!=="none");return visible.slice(1).map((node,i)=>node.getBoundingClientRect().top-visible[i].getBoundingClientRect().bottom);});
    for (const gap of gaps) expect(Math.abs(gap-16)).toBeLessThan(1);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  });
}
