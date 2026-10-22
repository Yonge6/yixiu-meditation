import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, writeFile, copyFile, mkdtemp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [ffmpeg, measurementFile] = process.argv.slice(2);
if (!ffmpeg || !measurementFile) throw new Error('Provide FFmpeg and the full-track before-measurement JSON.');
const reportFile = path.join(root, 'docs/audio/ai-original-playback-levels-20261019.json');
const ledger = JSON.parse(await readFile(path.join(root, 'docs/audio/ai-originals-20261014.json'), 'utf8'));
const before = JSON.parse(await readFile(measurementFile, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const webRoot = path.join(root, 'yixiu-prototype/public/assets/yixiu/audio/meditation');
const nativeRoot = path.join(root, 'YixiuMeditation/YixiuMeditation/Audio/Meditation');
let existing;
try { existing = JSON.parse(await readFile(reportFile, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
if (existing) {
  for (const track of existing.tracks) {
    for (const dir of [webRoot, nativeRoot]) {
      if (hash(await readFile(path.join(dir, `${track.slug}.m4a`))) !== track.playbackSha256) throw new Error('Existing processed output changed: ' + track.id);
    }
  }
  console.log('Already calibrated; no second gain or re-encode applied.');
  process.exit(0);
}
const staging = await mkdtemp(path.join(os.tmpdir(), 'yixiu-original-levels-'));
const tracks = [];
for (const track of ledger.tracks) {
  const file = `${track.slug}.m4a`;
  const source = path.join(webRoot, file);
  const input = await readFile(source);
  if (hash(input) !== track.audioSha256 || hash(await readFile(path.join(nativeRoot, file))) !== track.audioSha256) throw new Error('Original identity mismatch: ' + track.id);
  const measure = before.measurements.find(item => item.id === track.id);
  if (!measure || measure.kind !== 'ai-original') throw new Error('Missing before-measurement: ' + track.id);
  const gainDB = Number(Math.max(0, Math.min(-18 - measure.integratedLUFS, -1.5 - measure.truePeakDBTP, 6)).toFixed(2));
  const output = path.join(staging, file);
  await copyFile(source, path.join(staging, `${track.slug}-before.m4a`));
  await run(ffmpeg, ['-hide_banner', '-nostdin', '-y', '-i', source, '-vn', '-af', `volume=${gainDB}dB`, '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-ac', '2', '-movflags', '+faststart', output]);
  const { stderr } = await run(ffmpeg, ['-hide_banner', '-nostdin', '-i', output, '-af', 'loudnorm=I=-18:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], { maxBuffer: 1024 * 1024 });
  const analysis = JSON.parse(stderr.slice(stderr.lastIndexOf('{'), stderr.lastIndexOf('}') + 1));
  const afterLUFS = Number(analysis.input_i), afterTruePeakDBTP = Number(analysis.input_tp);
  if (afterTruePeakDBTP > -1.5 || Math.abs(afterLUFS + 18) > 0.2) throw new Error('Peak/loudness acceptance failed: ' + track.id);
  tracks.push({ id: track.id, slug: track.slug, originalSha256: track.audioSha256, playbackSha256: hash(await readFile(output)), gainDB,
    beforeLUFS: measure.integratedLUFS, beforeTruePeakDBTP: measure.truePeakDBTP, afterLUFS, afterTruePeakDBTP,
    beforeRangeLU: measure.loudnessRangeLU, afterRangeLU: Number(analysis.input_lra) });
}
// Validate the entire album before changing either platform's playback copies.
for (const track of tracks) {
  for (const dir of [webRoot, nativeRoot]) await copyFile(path.join(staging, `${track.slug}.m4a`), path.join(dir, `${track.slug}.m4a`));
}
await writeFile(reportFile, JSON.stringify({ version: 'ai-level-20261019', targetLUFS: -18, maximumGainDB: 6, truePeakCeilingDBTP: -1.5,
  method: 'Per-track constant gain then AAC 192k, 44.1kHz stereo; no limiting, dynamic compression, speed, pitch or fade changes. Entire decoded outputs measured with FFmpeg EBU R128.',
  originalSourceLedger: 'docs/audio/ai-originals-20261014.json', sourceGitRevision: 'c371a01', localRecoverableStaging: staging, tracks }, null, 2) + '\n');
await writeFile(path.join(root, 'yixiu-prototype/public/ai-original-checksums.txt'), tracks.map(track => `${track.playbackSha256}  assets/yixiu/audio/meditation/${track.slug}.m4a`).join('\n') + '\n');
console.log(JSON.stringify({ tracks: tracks.length, staging, reportFile, measured: tracks }));
