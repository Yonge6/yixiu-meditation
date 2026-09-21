// One-time, mechanical catalog synchronization from the verified recording manifest.
import fs from 'node:fs';
const tracks=JSON.parse(fs.readFileSync('docs/audio/classical-expansion-sources.json')).tracks;
if (fs.readFileSync('YixiuMeditation/YixiuMeditation/Models.swift', 'utf8').includes('    case traumerei\n')) {
  console.log('Expansion already integrated; no files changed.');
  process.exit(0);
}
const edit=(path,fn)=>fs.writeFileSync(path,fn(fs.readFileSync(path,'utf8')));
const native='YixiuMeditation/YixiuMeditation/';
const free=tracks.filter(t=>t.free);
edit('yixiu-prototype/src/data/classical-music.ts',s=>s.replace('\n] as const;',',\n'+tracks.map(t=>JSON.stringify(t,null,2)).join(',\n')+'\n] as const;'));
edit('yixiu-prototype/src/Prototype.tsx',s=>s.replace('"moonlightSonata", "preludeC"]);','"moonlightSonata", "preludeC", '+free.map(t=>JSON.stringify(t.id)).join(', ')+']);').replace('"/assets/yixiu/classical/" + track.slug + ".jpg"','"/assets/yixiu/classical/" + ("art" in track ? track.art : track.slug) + ".jpg"'));
edit(native+'Models.swift',s=>{
  s=s.replace('    case prelude17\n','    case prelude17\n'+tracks.map(t=>'    case '+t.id).join('\n')+'\n');
  const properties={zhName:t=>t.zh,enName:t=>t.en,useZh:t=>t.composerZh+' · '+t.duration,useEn:t=>t.composer+' · '+t.duration,assetName:t=>t.asset,audioResource:t=>t.slug};
  for(const [key,value] of Object.entries(properties)) s=s.replace('var '+key+': String {\n        switch self {','var '+key+': String {\n        switch self {\n'+tracks.map(t=>'        case .'+t.id+': '+JSON.stringify(value(t))).join('\n'));
  s=s.replace('var isMeditationMusic: Bool {\n        switch self {','var isMeditationMusic: Bool {\n        switch self {\n        case '+tracks.map(t=>'.'+t.id).join(', ')+': true');
  s=s.replace('"berceuse","prelude17"].contains(rawValue)','"berceuse","prelude17",'+tracks.map(t=>JSON.stringify(t.id)).join(',')+'].contains(rawValue)');
  return s;
});
edit(native+'SubscriptionAccessPolicy.swift',s=>s.replace('.moonlightSonata, .preludeC]', '.moonlightSonata, .preludeC, '+free.map(t=>'.'+t.id).join(', ')+']'));
for(const file of ['AppState.swift','ListenView.swift']) edit(native+file,s=>s.replaceAll('MeditationScene.availableScenes.firstIndex','MeditationScene.homeScenes.firstIndex').replaceAll('MeditationScene.availableScenes.indices','MeditationScene.homeScenes.indices').replaceAll('MeditationScene.availableScenes[','MeditationScene.homeScenes['));
const replacements=[['20 首音乐','30 首音乐'],['20 music tracks','30 music tracks'],['20 MUSIC TRACKS','30 MUSIC TRACKS'],['10 首古典','20 首古典'],['10 classical works','20 classical works'],['7 首音乐','12 首音乐'],['7 music tracks','12 music tracks'],['7 free music tracks','12 free music tracks'],['5 首古典','10 首古典'],['5 classical','10 classical'],['5 more classical','10 more classical'],['13 首音乐','18 首音乐'],['13 music tracks','18 music tracks'],['全部 34 种声音','全部 44 种声音'],['All 34 sounds','All 44 sounds']];
for(const path of ['yixiu-prototype/src/Prototype.tsx',native+'MeView.swift',native+'PlusPaywallView.swift']) edit(path,s=>{for(const [a,b] of replacements)s=s.replaceAll(a,b);return s;});
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
edit('yixiu-prototype/public/music-credits.html',s=>s.replace('</section>',tracks.map(t=>`<article id="${t.slug}"><h2>${esc(t.zh)} / ${esc(t.en)}</h2><p>${esc(t.composer)} · ${esc(t.performer)} · ${t.duration}</p><p>录音及 AAC 转码保留 ${esc(t.license)} 许可。仅转换格式，未剪辑、循环、变速或变调。 / Recording and AAC conversion retain the original license. Format conversion only.</p><audio controls preload="none" src="/assets/yixiu/audio/meditation/${t.slug}.m4a"></audio><nav><a href="/assets/yixiu/audio/meditation/${t.slug}.m4a" download>下载 AAC / Download</a><a href="${esc(t.source)}">录音来源 / Source</a><a href="${t.licenseUrl}">${esc(t.license)}</a><a href="/?music=${t.id}&amp;lang=zh">查看场景 / Scene</a></nav></article>`).join('\n')+'\n</section>').replace('10 首古典','20 首古典').replace('10 classical','20 classical'));
edit('YixiuMeditation/Tests/FreeMusicPolicyHarness.swift',s=>s.replace('.moonlightSonata, .preludeC]', '.moonlightSonata, .preludeC, '+free.map(t=>'.'+t.id).join(', ')+']').replace('freeScenes.count == 17','freeScenes.count == 22').replace('freeClassicalScenes.count == 5','freeClassicalScenes.count == 10').replace('availableScenes.count == 34','availableScenes.count == 44').replace('filter(\\.isMeditationMusic).count == 20','filter(\\.isMeditationMusic).count == 30').replace('matches(.classical) }.count == 10','matches(.classical) }.count == 20').replace('        print(',`        precondition(Array(MeditationScene.homeScenes.prefix(22)).allSatisfy { SubscriptionAccessPolicy.freeScenes.contains($0) })\n        precondition(MeditationScene.homeScenes.count == Set(MeditationScene.homeScenes).count)\n        precondition(MeditationScene.homeScenes.first == .ocean)\n        print(`).replace('7 Free music tracks (5 classical), 34 available scenes, ten classical works','12 Free music tracks (10 classical), 44 available scenes, twenty classical works'));
console.log('Integrated ten recordings, five new Free entitlements, free-first home ordering.');
