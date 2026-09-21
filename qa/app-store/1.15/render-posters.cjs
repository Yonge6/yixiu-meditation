// Deterministic HTML composition: real app screenshots are never repainted.
const fs = require('fs');
const path = require('path');
const { chromium } = require('/Users/yongyuan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = __dirname;
const copy = {
  zh: [
    ['sounds', '把自然，留在耳边。', '14 种自然声音 · 10 种免费聆听', 'NATURE / 自然'],
    ['classical', '让名曲，慢慢流淌。', '20 首古典名曲 · 10 首免费聆听', 'CLASSICAL / 古典'],
    ['focus', '留一分钟，回到自己。', '跟随呼吸的节奏 · 开始一段静心', 'BREATHE / 呼吸'],
  ],
  en: [
    ['sounds', 'A little closer\nto nature.', '14 nature sounds. 10 free to enjoy.', 'NATURE / 01'],
    ['classical', 'Timeless music.\nA quieter moment.', '20 classical works. 10 free to enjoy.', 'CLASSICAL / 02'],
    ['focus', 'One minute.\nJust for you.', 'Follow your breath. Find your rhythm.', 'BREATHE / 03'],
  ],
};
const data = p => 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');
(async () => {
  const browser = await chromium.launch({headless:true, executablePath:process.env.POSTER_CHROMIUM || '/Users/yongyuan/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
  for (const device of ['iphone','ipad']) for (const lang of ['zh','en']) for (const [scene,title,sub,kicker] of copy[lang]) {
    const w=device==='iphone'?1320:2064, h=device==='iphone'?2868:2752;
    const raw=data(path.join(base,'raw',`${device}-${lang}-${scene}.png`));
    const page=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});
    const wide=device==='ipad';
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>
      *{box-sizing:border-box}body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:#061e26;color:#edf5ee}
      .wash{position:absolute;inset:0;background:radial-gradient(ellipse at 85% 5%,#33585280,transparent 65%),linear-gradient(155deg,#102e36,#041820 80%)}
      .brand{position:absolute;left:8%;top:4.7%;font:30px Georgia;letter-spacing:8px;color:#c7e0da}
      .index{position:absolute;right:8%;top:4.7%;font:22px Georgia;letter-spacing:5px;color:#99bbb7}
      .copy{position:absolute;left:8%;right:6%;top:${wide?'11':'10'}%}
      .kicker{font:24px Georgia;letter-spacing:7px;color:#94c8c5;margin-bottom:32px}
      h1{font-family:'Songti SC',Georgia,serif;font-weight:400;font-size:${wide?'108':lang==='zh'?'83':'105'}px;letter-spacing:${lang==='zh'?'3':'-2'}px;line-height:1.19;white-space:pre-line;margin:0 0 32px}
      p{font:32px 'PingFang SC',sans-serif;color:#b4cec9;letter-spacing:2px;margin:0}
      .screen{position:absolute;top:${wide?'31':'29'}%;left:${wide?'18':'17'}%;width:${wide?'64':'66'}%;border:3px solid #8caeaa66;border-radius:${wide?'38':'58'}px;overflow:hidden;box-shadow:0 50px 120px #0009;background:#061820}
      .screen img{display:block;width:100%;height:auto}
      .footer{position:absolute;bottom:2.5%;left:8%;right:8%;font:21px Georgia;letter-spacing:5px;color:#84aaa8;display:flex;justify-content:space-between}
    </style><div class="wash"></div><div class="brand">一休 · YIXIU</div><div class="index">${scene==='sounds'?'01':scene==='classical'?'02':'03'} / 03</div><div class="copy"><div class="kicker">${kicker}</div><h1>${title}</h1><p>${sub}</p></div><div class="screen"><img src="${raw}"></div><div class="footer"><span>${lang==='zh'?'自然 · 音乐 · 静心':'NATURE · MUSIC · MINDFULNESS'}</span><span>YIXIU</span></div>`);
    await page.evaluate(()=>document.fonts.ready);
    const folder=path.join(base,'posters',`${device}-${lang}`);
    fs.mkdirSync(folder,{recursive:true});
    await page.screenshot({path:path.join(folder,`${scene==='sounds'?'01':scene==='classical'?'02':'03'}-${scene}.png`)});
    await page.close();
  }
  await browser.close();
})();
