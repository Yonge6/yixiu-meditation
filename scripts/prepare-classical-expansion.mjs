import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const tracks = JSON.parse(fs.readFileSync('docs/audio/classical-expansion-selection.json'));
const ffmpeg = '/tmp/yixiu-audio-tools-20260921/node_modules/ffmpeg-static/ffmpeg';
const ffprobe = '/tmp/yixiu-audio-tools-20260921/node_modules/ffprobe-static/bin/darwin/arm64/ffprobe';
const cache = '/tmp/yixiu-classical-expansion-originals-20260921';
fs.mkdirSync(cache,{recursive:true});
const get = url => JSON.parse(execFileSync('curl',['--fail','-Ls','--retry','2',url],{maxBuffer:16e6}));
const archive = get('https://archive.org/metadata/musopen-chopin');
if (!archive.metadata.licenseurl.includes('/zero/1.0')) throw Error('Archive license changed');
for (const t of tracks) {
  if (t.archive) {
    if (!archive.files.some(f=>f.name===t.archive)) throw Error('Missing recording '+t.archive);
    t.source='https://archive.org/details/musopen-chopin';
    t.download='https://archive.org/download/musopen-chopin/'+encodeURIComponent(t.archive);
    t.license='CC0 1.0'; t.licenseUrl='https://creativecommons.org/publicdomain/zero/1.0/';
  } else {
    t.source='https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(t.file.replaceAll(' ','_'));
    const result=get('https://commons.wikimedia.org/w/api.php?'+new URLSearchParams({action:'query',titles:'File:'+t.file,prop:'imageinfo',iiprop:'url|extmetadata',format:'json'}));
    const info=Object.values(result.query.pages)[0].imageinfo[0];
    t.download=info.url.split('?')[0];
    fs.writeFileSync(cache+'/'+t.slug+'-source.json',JSON.stringify(info,null,2));
  }
  const original=cache+'/'+t.slug+(t.archive?'.mp3':'.ogg');
  if (!fs.existsSync(original)) execFileSync('curl',['--fail','-L','--retry','3','--max-time','180',t.download,'-o',original],{stdio:'inherit'});
  const output='yixiu-prototype/public/assets/yixiu/audio/meditation/'+t.slug+'.m4a';
  execFileSync(ffmpeg,['-v','error','-nostdin','-y','-i',original,'-vn','-c:a','aac','-b:a','192k','-ar','44100','-ac','2','-movflags','+faststart',output]);
  execFileSync(ffmpeg,['-v','error','-i',output,'-f','null','-']);
  const info=JSON.parse(execFileSync(ffprobe,['-v','error','-show_format','-of','json',output]));
  t.durationSeconds=Number(info.format.duration);
  t.duration=Math.floor(t.durationSeconds/60)+':'+String(Math.floor(t.durationSeconds%60)).padStart(2,'0');
  t.sha256=createHash('sha256').update(fs.readFileSync(output)).digest('hex');
  t.sourceSha256=createHash('sha256').update(fs.readFileSync(original)).digest('hex');
  t.bytes=fs.statSync(output).size;
  fs.copyFileSync(output,'YixiuMeditation/YixiuMeditation/Audio/Meditation/'+t.slug+'.m4a');
  console.log('PREPARED',t.id,t.duration,t.bytes);
}
fs.writeFileSync('docs/audio/classical-expansion-sources.json',JSON.stringify({verifiedOn:'2026-09-21',processing:'AAC 192 kbps; no cuts, looping, tempo or pitch changes. Original license retained, including ShareAlike for converted recordings.',tracks},null,2)+'\n');
