const {execFileSync}=require('child_process');
const path=require('path');
const devices={iphone:'214C27B9-673A-48E2-96E8-001F175BE2EE',ipad:'89F0EC40-CE36-4870-9CFF-4793D744363D'};
const run=(...args)=>execFileSync('xcrun',['simctl',...args],{stdio:'inherit'});
const wait=()=>new Promise(r=>setTimeout(r,10000));
(async()=>{
 for(const lang of ['zh','en']) for(const scene of ['classical','sounds','focus']) {
  for(const id of Object.values(devices)) {
   try{run('terminate',id,'com.health.yixiu')}catch{}
   run('launch',id,'com.health.yixiu','-language',lang,'-scene',scene==='classical'?'clairDeLune':'rain','-duration','30');
  }
  await wait();
  if(scene==='focus'){for(const id of Object.values(devices))run('openurl',id,'yixiu://focus');await wait();}
  for(const [device,id]of Object.entries(devices))run('io',id,'screenshot',path.join(__dirname,'raw',`${device}-${lang}-${scene}.png`));
 }
})();
