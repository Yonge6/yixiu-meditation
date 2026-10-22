import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const filename=path.join(base,'asset-upload-receipts.json');
const receipts=JSON.parse(await fs.readFile(filename,'utf8'));
const manifest=JSON.parse(await fs.readFile(path.join(base,'asset-manifest.json'),'utf8'));
const retained=[],superseded=[];
for(const receipt of receipts) {
  const prior=manifest.find(x=>x.id===receipt.id);
  if(!prior)throw Error('Cannot establish existing uploaded bytes');
  const bytes=await fs.readFile(receipt.file),hash=crypto.createHash('sha256').update(bytes).digest('hex');
  (hash===prior.sha256?retained:superseded).push(receipt);
}
await fs.writeFile(path.join(base,'asset-upload-receipts-before-bright.json'),JSON.stringify(receipts,null,2)+'\n',{flag:'wx'});
await fs.writeFile(path.join(base,'superseded-bright-assets.json'),JSON.stringify(superseded,null,2)+'\n',{flag:'wx'});
const associationsPath=path.join(base,'asset-association-receipts.json');
const associations=JSON.parse(await fs.readFile(associationsPath,'utf8'));
await fs.writeFile(path.join(base,'asset-association-receipts-before-bright.json'),JSON.stringify(associations,null,2)+'\n',{flag:'wx'});
const activeIDs=new Set(retained.map(x=>x.id));
await fs.writeFile(associationsPath,JSON.stringify(associations.filter(x=>activeIDs.has(x.imageId)),null,2)+'\n');
await fs.writeFile(filename,JSON.stringify(retained,null,2)+'\n');
console.log({retained:retained.length,toReupload:superseded.length,oldRemoteLibraryImagesDeleted:false});
