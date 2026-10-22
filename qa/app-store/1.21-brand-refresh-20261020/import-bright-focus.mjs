import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const source='/tmp/yixiu-bright-focus-20261020';
const manifest=JSON.parse(await fs.readFile(path.join(source,'manifest.json'),'utf8'));
for(const lang of ['zh','en'])for(const topic of ['focus']) {
  const matches=manifest.flatMap(x=>x.attachments).filter(x=>x.suggestedHumanReadableName.startsWith(`storebrand-${lang}-${topic}_`));
  if(matches.length!==1||matches[0].isAssociatedWithFailure||matches[0].deviceId!=='3BB7CA6E-B597-493F-911F-E1BC0DBC626B')throw Error('Invalid successful capture');
  await fs.copyFile(path.join(source,matches[0].exportedFileName),path.join(base,'raw',`duo-${lang}-${topic}.png`));
}
await fs.copyFile(path.join(source,'manifest.json'),path.join(base,'raw','duo-bright-focus-manifest.json'));
console.log('BRIGHT_FOCUS_CAPTURES_IMPORTED');
