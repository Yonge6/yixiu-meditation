import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const locales={zh:'0cde2c69-91c5-46ac-a579-a08c4c51e36d',en:'952a079e-1db9-4ecd-bf5d-d1a554d305f4'};
const endpoint=id=>`/iris/v1/appStoreVersionLocalizations/${id}/placements?include=image&filter[placementType]=APP_SCREENSHOT,PRODUCT_PAGE_HEADER_ASSET,APP_STORE_SEARCH_RESULTS_ASSET&sort=placementGroupPosition`;
export async function associateReadyAssets(page) {
  const v=await page.fetch('/iris/v1/appStoreVersions/f0556f3f-178a-43a6-8a6e-d0033b4d5af8?include=build');
  if(!v.ok)throw Error('Cannot verify version');
  const version=JSON.parse(v.body);
  if(version.data.attributes.versionString!=='1.21'||version.data.attributes.appStoreState!=='PREPARE_FOR_SUBMISSION'||version.included.find(x=>x.type==='builds')?.attributes.version!=='38')throw Error('Draft/build identity changed');
  const assets=JSON.parse(await fs.readFile(path.join(base,'asset-upload-receipts.json'),'utf8'));
  if(assets.some(x=>!x.uploaded)||assets.length<24)throw Error('Upload incomplete');
  const processed=[];
  for(const a of assets) {
    const r=await page.fetch(`/iris/v1/appAssetLibraryImages/${a.id}`);
    if(!r.ok)throw Error(`Processing read ${a.id}: ${r.status}`);
    const attr=JSON.parse(r.body).data.attributes;
    const size=a.type==='PRODUCT_PAGE_HEADER_ASSET'?[3840,1646]:a.type==='APP_STORE_SEARCH_RESULTS_ASSET'?[3840,2560]:({IPHONE_DUO_PROFILE:[1398,2034],IPHONE_DYNAMIC_ISLAND_LARGE_PROFILE:[1320,2868],IPAD_13_PROFILE:[2064,2752],WATCH_SERIES_10_PROFILE:[416,496]})[a.group];
    if(attr.state!=='PREPARE_FOR_SUBMISSION'||attr.stateDetails||attr.imageAsset?.width!==size[0]||attr.imageAsset?.height!==size[1])throw Error(`Asset not ready/dimension mismatch: ${a.name}`);
    processed.push({id:a.id,name:a.name,state:attr.state,stateDetails:attr.stateDetails,width:attr.imageAsset.width,height:attr.imageAsset.height});
  }
  await fs.writeFile(path.join(base,'asset-processing-readback.json'),JSON.stringify(processed,null,2));
  let receipts=[];try{receipts=JSON.parse(await fs.readFile(path.join(base,'asset-association-receipts.json'),'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
  const save=()=>fs.writeFile(path.join(base,'asset-association-receipts.json'),JSON.stringify(receipts,null,2));
  for(const lang of ['zh','en']) {
    const loc=locales[lang],selected=assets.filter(a=>a.lang===lang);
    const keys=[...new Set(selected.map(a=>`${a.group}|${a.type}`))];
    for(const key of keys) {
      const [group,type]=key.split('|'),items=selected.filter(a=>a.group===group&&a.type===type),ids=new Set(items.map(a=>a.id));
      const current=await page.fetch(endpoint(loc));if(!current.ok)throw Error('Read placements failed');
      const old=JSON.parse(current.body).data.filter(x=>x.attributes.placementGroup===group&&x.attributes.placementType===type);
      const filename=path.join(base,`placements-before-${lang}-${group}-${type}.json`);
      try{await fs.writeFile(filename,JSON.stringify(old,null,2),{flag:'wx'});}catch(e){if(e.code!=='EEXIST')throw e;}
      const remove=old.filter(x=>!ids.has(x.relationships.image.data.id));
      if(remove.length) {
        const r=await page.fetch('/iris/v1/appAssetLibraryPlacementsDeletionRequests',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({data:{type:'appAssetLibraryPlacementsDeletionRequests',relationships:{placements:{data:remove.map(x=>({type:x.type,id:x.id}))}}}})});
        if(!r.ok)throw Error(`Remove draft associations: ${r.status} ${r.body}`);
      }
      for(const a of items) {
        const existing=old.find(x=>x.relationships.image.data.id===a.id);
        let id=existing?.id;
        if(!id) {
          const r=await page.fetch('/iris/v1/appAssetLibraryPlacements',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({data:{type:'appAssetLibraryPlacements',attributes:{placementType:a.type,placementGroup:a.group},relationships:{image:{data:{type:'appAssetLibraryImages',id:a.id}},appStoreVersionLocalization:{data:{type:'appStoreVersionLocalizations',id:loc}}}}})});
          if(!r.ok)throw Error(`Associate ${a.name}: ${r.status} ${r.body}`);id=JSON.parse(r.body).data.id;
        }
        if(!receipts.some(x=>x.imageId===a.id&&x.locale===lang))receipts.push({locale:lang,group:a.group,type:a.type,name:a.name,imageId:a.id,placementId:id});
        await save();
      }
    }
  }
  const readbacks=[];
  for(const [lang,loc] of Object.entries(locales)) {
    const r=await page.fetch(endpoint(loc));if(!r.ok)throw Error('Final placement readback failed');
    const j=JSON.parse(r.body),expected=assets.filter(a=>a.lang===lang);
    for(const a of expected)if(!j.data.some(x=>x.relationships.image.data.id===a.id))throw Error(`Missing final association ${a.name}`);
    readbacks.push({locale:lang,associatedNew:expected.length,placements:j.data,images:j.included});
  }
  await fs.writeFile(path.join(base,'main-page-assets-readback.json'),JSON.stringify(readbacks,null,2));
  return {associated:receipts.length,iphoneRefreshed:assets.some(a=>a.group==='IPHONE_DYNAMIC_ISLAND_LARGE_PROFILE'),oldLibraryImagesRetained:true,versionState:'PREPARE_FOR_SUBMISSION'};
}
