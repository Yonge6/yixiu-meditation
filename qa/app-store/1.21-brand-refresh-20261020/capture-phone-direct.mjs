import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import sharp from '/Users/yongyuan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs';
const base=path.dirname(fileURLToPath(import.meta.url));
const device='00008120-000A341C0E0BC01E';
const env={...process.env,DEVELOPER_DIR:'/Volumes/LaCie/XcodePlatforms/Xcode.app/Contents/Developer'};
const run=args=>execFileSync('/usr/bin/xcrun',['devicectl','device',...args],{env,encoding:'utf8',timeout:60000});
const records=[];
for(const lang of ['zh','en'])for(const [topic,scene] of [['nature','oasisRest'],['focus','oasisRest'],['original','moonAnchorage'],['classical','canon']]) {
  const args=['process','launch','--device',device,'--terminate-existing'];
  if(topic==='focus')args.push('--payload-url','yixiu://focus');
  args.push('com.health.yixiu','--','-language',lang,'-scene',scene,'-volume','0.72','-YixiuForceFreeAccess');
  console.log(run(args).trim());
  await new Promise(resolve=>setTimeout(resolve,2500));
  const file=`iphone-${lang}-${topic}.png`,destination=path.join(base,'raw',file);
  console.log(run(['capture','screenshot','--device',device,'--destination',destination]).trim());
  const bytes=await fs.readFile(destination),meta=await sharp(bytes).metadata();
  if(meta.width!==1290||meta.height!==2796)throw Error('Unexpected native display size');
  records.push({file,device,topic,scene,lang,width:meta.width,height:meta.height,capturedAt:new Date().toISOString(),method:'devicectl device capture screenshot',launchArguments:args.slice(args.indexOf('--')+1),payloadURL:topic==='focus'?'yixiu://focus':null,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
  await fs.writeFile(path.join(base,'raw','iphone-direct-capture-manifest.json'),JSON.stringify(records,null,2)+'\n');
}
console.log({nativePhoneCaptures:records.length});
