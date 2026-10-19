import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from '/Users/yongyuan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs';
const base=path.dirname(fileURLToPath(import.meta.url));
for(const lang of ['zh','en']) {
  const dir=path.join(base,'posters-v2',`duo-${lang}`);
  const layers=[];
  for(const [index,file] of (await fs.readdir(dir)).sort().entries()) {
    const buffer=await sharp(path.join(dir,file)).resize({width:420}).jpeg({quality:93}).toBuffer();
    layers.push({input:buffer,left:(index%3)*436+16,top:Math.floor(index/3)*628+16});
  }
  await sharp({create:{width:1324,height:1260,channels:3,background:'#f3f0e8'}}).composite(layers).jpeg({quality:95}).toFile(path.join(base,`duo-${lang}-contact-sheet.jpg`));
  const otherFiles=[];
  for(const device of ['ipad','watch']) {
    const folder=path.join(base,'posters-v2',`${device}-${lang}`);
    for(const file of (await fs.readdir(folder)).sort()) otherFiles.push(path.join(folder,file));
  }
  for(const type of ['header','search']) otherFiles.push(path.join(base,'creative-v2',`yixiu-${type}-${lang}-v2.${type==='header'?'png':'jpg'}`));
  const otherLayers=[];
  for(const [index,file] of otherFiles.entries()) {
    const buffer=await sharp(file).resize({width:420,height:600,fit:'inside'}).jpeg({quality:94}).toBuffer();
    otherLayers.push({input:buffer,left:(index%3)*436+16,top:Math.floor(index/3)*628+16});
  }
  await sharp({create:{width:1324,height:1260,channels:3,background:'#f3f0e8'}}).composite(otherLayers).jpeg({quality:95}).toFile(path.join(base,`supporting-${lang}-contact-sheet.jpg`));
}
console.log('CONTACT_SHEETS_CREATED');
