import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const receiptPath=path.join(base,'asset-upload-receipts.json');
export async function uploadAssets(page) {
  const targets=[];
  for(const device of ['iphone','duo','ipad','watch']) for(const lang of ['zh','en']) {
    const dir=path.join(base,'posters-v2',`${device}-${lang}`);
    let files;try{files=await fs.readdir(dir);}catch(e){if(e.code==='ENOENT')continue;throw e;}
    const group={iphone:'IPHONE_DYNAMIC_ISLAND_LARGE_PROFILE',duo:'IPHONE_DUO_PROFILE',ipad:'IPAD_13_PROFILE',watch:'WATCH_SERIES_10_PROFILE'}[device];
    for(const file of files.sort()) targets.push({file:path.join(dir,file),lang,group,type:'APP_SCREENSHOT',category:'APP_SCREENSHOTS_AND_PREVIEWS',name:`yixiu-121-brand-20261020-${device}-${lang}-${file}`});
  }
  for(const lang of ['zh','en']) for(const type of ['header','search']) {
    const file=path.join(base,'creative-v2',`yixiu-${type}-${lang}-v2.${type==='header'?'png':'jpg'}`);
    targets.push({file,lang,group:'DEFAULT_PROFILE',type:type==='header'?'PRODUCT_PAGE_HEADER_ASSET':'APP_STORE_SEARCH_RESULTS_ASSET',category:'CREATIVE_ASSETS',name:`yixiu-121-brand-20261020-${type}-${lang}.${type==='header'?'png':'jpg'}`});
  }
  let receipts=[];try{receipts=JSON.parse(await fs.readFile(receiptPath,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
  const save=()=>fs.writeFile(receiptPath,JSON.stringify(receipts,null,2));
  for(const target of targets) {
    const prior=receipts.find(x=>x.file===target.file);
    if(prior?.uploaded)continue;
    if(prior)throw Error('Uncertain reservation; inspect '+prior.id);
    const buffer=await fs.readFile(target.file);
    const r=await page.fetch('/iris/v1/appAssetLibraryImages',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({data:{type:'appAssetLibraryImages',attributes:{fileSize:buffer.length,fileName:target.name,category:target.category},relationships:{assetLibrary:{data:{type:'appAssetLibraries',id:'1461182261'}}}}})});
    if(!r.ok)throw Error(`Reserve ${target.name}: ${r.status} ${r.body}`);
    const asset=JSON.parse(r.body).data,record={...target,id:asset.id,uploaded:false};receipts.push(record);await save();
    for(const op of asset.attributes.uploadOperations??[]) {
      const response=await fetch(op.url,{method:op.method,headers:Object.fromEntries(op.requestHeaders.map(h=>[h.name,h.value])),body:buffer.subarray(op.offset,op.offset+op.length),signal:AbortSignal.timeout(60000)});
      if(!response.ok)throw Error(`Upload ${target.name}: ${response.status}`);
    }
    const complete=await page.fetch(`/iris/v1/appAssetLibraryImages/${asset.id}`,{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({data:{type:'appAssetLibraryImages',id:asset.id,attributes:{uploaded:true}}})});
    if(!complete.ok)throw Error(`Complete ${target.name}: ${complete.status} ${complete.body}`);
    record.uploaded=true;await save();console.log({uploaded:target.name,id:asset.id});
  }
  return {uploaded:receipts.filter(x=>x.uploaded).length,targets:targets.length};
}
