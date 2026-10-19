import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import sharp from '/Users/yongyuan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs';
const base=path.dirname(fileURLToPath(import.meta.url));
const uploads=JSON.parse(await fs.readFile(path.join(base,'asset-upload-receipts.json'),'utf8'));
const processing=JSON.parse(await fs.readFile(path.join(base,'asset-processing-readback.json'),'utf8'));
const records=[];
for(const item of uploads) {
  const bytes=await fs.readFile(item.file),meta=await sharp(bytes).metadata(),remote=processing.find(x=>x.id===item.id);
  if(!remote||meta.width!==remote.width||meta.height!==remote.height||meta.hasAlpha)throw Error('Asset format/dimension mismatch '+item.name);
  records.push({file:path.relative(base,item.file),name:item.name,id:item.id,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),width:meta.width,height:meta.height,format:meta.format,hasAlpha:meta.hasAlpha,locale:item.lang,group:item.group});
}
await fs.writeFile(path.join(base,'asset-manifest.json'),JSON.stringify(records,null,2));
console.log({verifiedAssets:records.length,ordinaryIPhone:records.filter(x=>x.group==='IPHONE_DYNAMIC_ISLAND_LARGE_PROFILE').length});
