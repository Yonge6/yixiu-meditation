import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [ffmpeg, output] = process.argv.slice(2);
if (!ffmpeg || !output) throw new Error('Usage: node measure-original-loudness.mjs /absolute/ffmpeg /absolute/report.json');
const ledger = JSON.parse(await readFile(path.join(root, 'docs/audio/ai-originals-20261014.json'), 'utf8'));
const audioRoot = path.join(root, 'yixiu-prototype/public/assets/yixiu/audio');
const inputs = [
  ...ledger.tracks.map(track => ({ id: track.id, kind: 'ai-original', file: `meditation/${track.slug}.m4a` })),
  ...['ocean-waves', 'light-rain'].map(id => ({ id, kind: 'nature-reference', file: `${id}.m4a` })),
  ...['clair-de-lune', 'oasis-rest', 'first-breath'].map(id => ({ id, kind: 'music-reference', file: `meditation/${id}.m4a` })),
];
const measurements = [];
for (let offset = 0; offset < inputs.length; offset += 3) {
  measurements.push(...await Promise.all(inputs.slice(offset, offset + 3).map(async input => {
    const { stderr } = await run(ffmpeg, ['-hide_banner', '-nostdin', '-i', path.join(audioRoot, input.file),
      '-af', 'loudnorm=I=-20:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], { maxBuffer: 1024 * 1024 });
    const data = JSON.parse(stderr.slice(stderr.lastIndexOf('{'), stderr.lastIndexOf('}') + 1));
    return { ...input, integratedLUFS: Number(data.input_i), truePeakDBTP: Number(data.input_tp), loudnessRangeLU: Number(data.input_lra), thresholdLUFS: Number(data.input_thresh) };
  })));
}
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, JSON.stringify({ measuredAt: new Date().toISOString(), method: 'FFmpeg loudnorm full-track EBU R128 analysis; source bytes unchanged', measurements }, null, 2) + '\n');
console.log(JSON.stringify(measurements));
