import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from '/Users/yongyuan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs';
const base=path.dirname(fileURLToPath(import.meta.url));
for(const lang of ['zh','en']) {
  const dir=path.join(base,'posters-v2',`iphone-${lang}`),files=(await fs.readdir(dir)).sort();
  if(files.length!==4)throw Error('Expected four phone posters per locale');
  const layers=[];
  for(const [i,file] of files.entries())layers.push({input:await sharp(path.join(dir,file)).resize({width:420}).jpeg({quality:95}).toBuffer(),left:16+(i%3)*436,top:16+Math.floor(i/3)*930});
  await sharp({create:{width:1324,height:1860,channels:3,background:'#f3f0e8'}}).composite(layers).jpeg({quality:96}).toFile(path.join(base,`iphone-${lang}-contact-sheet.jpg`));
}
console.log('PHONE_CONTACT_SHEETS_CREATED');
