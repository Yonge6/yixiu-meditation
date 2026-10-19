import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from '/Users/yongyuan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs';

const base=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(base,'../../..');
const icon=path.join(root,'YixiuMeditation/YixiuMeditation/Assets.xcassets/BrandAppIcon.imageset/AppIcon-1024.png');
const backdrop=path.join(base,'editorial-lake-approved.png');
const topics=[
  {id:'nature',zh:['不必等到有空，','才可以休息。'],en:['Make room','for quiet.'],subZh:'随时，给自己一休。',subEn:'A quiet moment, whenever you need it.',noteZh:['无需注册','没有广告'],noteEn:['No account','No ads']},
  {id:'focus',zh:['工作间隙。','先休息一分钟。'],en:['Between tasks.','One minute for you.'],subZh:'跟着呼吸，或只是安静坐一会儿。',subEn:'Follow your breath. Nothing to finish.',noteZh:['一分钟呼吸','免费使用'],noteEn:['One-minute breathing','Free to use']},
  {id:'original',zh:['夜里醒了。','听一会儿就好。'],en:['Awake at night.','Just listen awhile.'],subZh:'轻柔音乐与定时，留一点自己的空间。',subEn:'Gentle music, with a timer when you want it.',noteZh:['AI 辅助原创','月泊 · 免费'],noteEn:['AI-assisted original','Free to listen']},
  {id:'classical',zh:['让名曲流淌。','不必做点什么。'],en:['Let music flow.','Nothing you have to do.'],subZh:'从德彪西到巴赫，让经典陪伴日常。',subEn:'From Debussy to Bach. Space to simply listen.',noteZh:['20 首古典','10 首免费'],noteEn:['20 classical works','10 free']},
  {id:'original-library',zh:['十段安静。','陪伴平常日子。'],en:['Ten quiet moments.','For ordinary days.'],subZh:'一休创作 · AI 辅助生成',subEn:'Created for Yixiu with AI assistance.',noteZh:['10 首 AI 原创','5 首免费'],noteEn:['10 AI originals','5 free']},
  {id:'library',zh:['喜欢的声音。','随时回来听。'],en:['Find your sound.','Come back anytime.'],subZh:'搜索、筛选、收藏，不必重新寻找。',subEn:'Search, filters, favorites and recent listening.',noteZh:['54 个声音','27 个免费'],noteEn:['54 sounds','27 free']}
];
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const svg=(w,h,b)=>Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${b}</svg>`);
for(const device of ['iphone','duo','ipad'])for(const lang of ['zh','en'])for(let i=0;i<topics.length;i++){
  const t=topics[i],input=path.join(base,'raw',`${device}-${lang}-${t.id}.png`);
  try{await fs.access(input);}catch{continue;}
  const [w,h]={iphone:[1320,2868],duo:[1398,2034],ipad:[2064,2752]}[device];
  const m=await sharp(input).metadata(),top=Math.round(h*.30);
  const sw=Math.round(Math.min(w*.67,(h*.935-top)*m.width/m.height)),sh=Math.round(sw*m.height/m.width);
  const sx=Math.round(w*.955-sw),r=Math.round(w*.015);
  const titleSize=w*(lang==='zh'?.075:.057),lineSpace=titleSize*1.3;
  const heading=t[lang],sub=t[lang==='zh'?'subZh':'subEn'],notes=t[lang==='zh'?'noteZh':'noteEn'];
  const text=svg(w,h,`<defs><linearGradient id="top" x2="0" y2="1"><stop stop-color="#efece4" stop-opacity=".2"/><stop offset=".5" stop-color="#efece4" stop-opacity="0"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#top)"/><g fill="#15352f"><text x="${w*.14}" y="${h*.068}" font-family="PingFang SC,Helvetica" font-size="${w*.022}" letter-spacing="${w*.001}">${lang==='zh'?'一休冥想':'YIXIU MEDITATION'}</text><text x="${w*.095}" y="${h*.145}" font-family="Songti SC,Georgia,serif" font-size="${titleSize}" letter-spacing="${lang==='zh'?w*.002:0}">${esc(heading[0])}</text><text x="${w*.095}" y="${h*.145+lineSpace}" font-family="Songti SC,Georgia,serif" font-size="${titleSize}" letter-spacing="${lang==='zh'?w*.002:0}">${esc(heading[1])}</text><text x="${w*.097}" y="${h*.145+lineSpace+titleSize*.72}" font-family="PingFang SC,Helvetica" font-size="${w*.022}" fill="#486356">${esc(sub)}</text></g><line x1="${w*.098}" x2="${w*.24}" y1="${h*.36}" y2="${h*.36}" stroke="#486356" stroke-opacity=".5" stroke-width="1"/><g font-family="PingFang SC,Helvetica" fill="#234b40"><text x="${w*.098}" y="${h*.39}" font-size="${w*.021}">${esc(notes[0])}</text><text x="${w*.098}" y="${h*.415}" font-size="${w*.021}">${esc(notes[1])}</text><text x="${w*.098}" y="${h*.974}" font-size="${w*.016}" letter-spacing="${w*.002}">${lang==='zh'?'休息、睡眠与静心':'REST, SLEEP &amp; CALM'}</text></g><text x="${w*.95}" y="${h*.974}" text-anchor="end" font-family="Georgia" font-size="${w*.016}" fill="#234b40">${String(i+1).padStart(2,'0')} / 06</text>`);
  const screen=await sharp(input).resize(sw,sh).composite([{input:svg(sw,sh,`<rect width="${sw}" height="${sh}" rx="${r}" fill="white"/>`),blend:'dest-in'}]).png().toBuffer();
  const shadow=await sharp(svg(sw+40,sh+40,`<rect x="20" y="20" width="${sw}" height="${sh}" rx="${r}" fill="#193e35" opacity=".30"/>`)).blur(16).toBuffer();
  const iconSize=Math.round(w*.034),iconBuffer=await sharp(icon).resize(iconSize).composite([{input:svg(iconSize,iconSize,`<rect width="100%" height="100%" rx="${iconSize*.2}" fill="white"/>`),blend:'dest-in'}]).png().toBuffer();
  const out=path.join(base,'posters-v2',`${device}-${lang}`);await fs.mkdir(out,{recursive:true});
  await sharp(backdrop).resize(w,h,{fit:'cover'}).composite([{input:text,top:0,left:0},{input:iconBuffer,top:Math.round(h*.049),left:Math.round(w*.096)},{input:shadow,top:top-20,left:sx-20},{input:screen,top,left:sx}]).removeAlpha().jpeg({quality:95,chromaSubsampling:'4:4:4'}).toFile(path.join(out,`${String(i+1).padStart(2,'0')}-${t.id}.jpg`));
}
for(const lang of ['zh','en'])for(const type of ['header','search']){
  const [w,h]=type==='header'?[3840,1646]:[3840,2560];
  const content=svg(w,h,`<rect width="100%" height="100%" fill="#f2f0e9" opacity=".18"/><g fill="#143c32"><text x="${w*.09}" y="${h*.22}" font-family="PingFang SC,Helvetica" font-size="62" letter-spacing="8">${lang==='zh'?'一休冥想':'YIXIU MEDITATION'}</text><text x="${w*.09}" y="${h*.45}" font-family="Songti SC,Georgia,serif" font-size="${lang==='zh'?210:170}">${lang==='zh'?'随时，给自己一休。':'Make room for quiet.'}</text><line x1="${w*.095}" x2="${w*.36}" y1="${h*.55}" y2="${h*.55}" stroke="#315648"/><text x="${w*.095}" y="${h*.64}" font-family="PingFang SC,Helvetica" font-size="53">${lang==='zh'?'午休 · 夜醒 · 工作间隙':'Lunch breaks · Quiet nights · A breath between tasks'}</text><text x="${w*.095}" y="${h*.84}" font-family="Georgia" font-size="38" letter-spacing="8">REST, SLEEP &amp; CALM</text></g>`);
  const out=path.join(base,'creative-v2');await fs.mkdir(out,{recursive:true});
  const rendered=sharp(backdrop).resize(w,h,{fit:'cover',position:'center'}).composite([{input:content}]).removeAlpha();
  if(type==='header')await rendered.png().toFile(path.join(out,`yixiu-${type}-${lang}-v2.png`));
  else await rendered.jpeg({quality:95,chromaSubsampling:'4:4:4'}).toFile(path.join(out,`yixiu-${type}-${lang}-v2.jpg`));
}
for(const lang of ['zh','en']){
  const w=416,h=496,raw=path.join(root,'docs/app-store/evidence/2026-09-02-watch-surface/watch-smart-stack.png');
  const widget=await sharp(raw).extract({left:12,top:246,width:392,height:166}).resize(362).png().toBuffer();
  const text=svg(w,h,`<rect width="100%" height="100%" fill="#eeebe3" opacity=".28"/><g fill="#163c33"><text x="35" y="47" font-family="PingFang SC,Helvetica" font-size="12" letter-spacing="2">${lang==='zh'?'一休冥想':'YIXIU MEDITATION'}</text><text x="35" y="110" font-family="Songti SC,Georgia" font-size="${lang==='zh'?34:31}">${lang==='zh'?'安静，随身。':'Quiet, with you.'}</text><text x="35" y="146" font-family="PingFang SC,Helvetica" font-size="13">${lang==='zh'?'智能叠放中的一分钟提醒':'A minute in your Smart Stack.'}</text></g>`);
  const out=path.join(base,'posters-v2',`watch-${lang}`);await fs.mkdir(out,{recursive:true});
  await sharp(backdrop).resize(w,h,{fit:'cover'}).composite([{input:text},{input:widget,left:27,top:220}]).removeAlpha().png().toFile(path.join(out,'01-smart-stack.png'));
}
console.log('EDITORIAL_V2_RENDERED');
