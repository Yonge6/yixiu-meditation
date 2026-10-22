import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const device='3BB7CA6E-B597-493F-911F-E1BC0DBC626B';
const env={...process.env,DEVELOPER_DIR:'/Volumes/LaCie/XcodePlatforms/Xcode.app/Contents/Developer'};
const run=args=>execFileSync('/usr/bin/xcrun',['simctl',...args],{env,encoding:'utf8',timeout:60000});
const records=[];
for(const lang of ['zh','en'])for(const [topic,scene] of [['nature','oasisRest'],['classical','canon']]) {
  console.log(run(['launch','--terminate-running-process',device,'com.health.yixiu','-language',lang,'-scene',scene,'-volume','0.72','-YixiuForceFreeAccess']).trim());
  await new Promise(resolve=>setTimeout(resolve,5000));
  const file=`duo-${lang}-${topic}.png`,destination=path.join(base,'raw',file);
  run(['io',device,'screenshot',destination]);
  const bytes=await fs.readFile(destination);
  records.push({file,device,scene,lang,topic,method:'simctl io screenshot',capturedAt:new Date().toISOString(),sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
}
await fs.writeFile(path.join(base,'raw','duo-bright-capture-manifest.json'),JSON.stringify(records,null,2)+'\n');
console.log({brightDuoCaptures:records.length});
