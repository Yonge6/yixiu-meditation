// Run at repo root: node scripts/prepare-quiet-hour.mjs <verified-source.mp3>
// CC0 source and precise edit recipe are recorded in AUDIO_SOURCES.md.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const source = process.argv[2];
const hash = value => createHash('sha256').update(value).digest('hex');
if (!source || hash(fs.readFileSync(source)) !== '161daca3df08017953dbe013bcdf5e59025900a055591b6d1e0a49c71703cd4f') {
  throw new Error('Expected complete verified Too Brief A Time To Be Anything MP3');
}
const scratch = fs.mkdtempSync('/tmp/yixiu-quiet-hour-');
const decoded = path.join(scratch, 'original.wav');
execFileSync('/usr/bin/afconvert', ['-f', 'WAVE', '-d', 'LEI16', source, decoded]);
const wav = fs.readFileSync(decoded);
let data, rate, channels;
for (let p = 12; p + 8 <= wav.length;) {
  const size = wav.readUInt32LE(p + 4);
  const tag = wav.toString('ascii', p, p + 4);
  if (p + 8 + size > wav.length) throw new Error('Truncated WAV chunk');
  if (tag === 'fmt ') {
    if (wav.readUInt16LE(p + 8) !== 1 || wav.readUInt16LE(p + 22) !== 16) throw new Error('Expected PCM16');
    channels = wav.readUInt16LE(p + 10); rate = wav.readUInt32LE(p + 12);
  }
  if (tag === 'data') data = wav.subarray(p + 8, p + 8 + size);
  p += 8 + size + size % 2;
}
if (!data || rate !== 48000 || channels !== 2 || Math.abs(data.length / 4 / rate - 2700) > 1) throw new Error('Unexpected source geometry');

const frames = 3600 * rate;
const crossfadeStart = 2660 * rate, crossfadeEnd = 2680 * rate, repeatStart = 1200 * rate;
const mix = (frame, channel) => {
  const offset = (frame * 2 + channel) * 2;
  if (frame < crossfadeStart) return data.readInt16LE(offset) / 32768;
  const repeated = data.readInt16LE(((repeatStart + frame - crossfadeStart) * 2 + channel) * 2) / 32768;
  if (frame >= crossfadeEnd) return repeated;
  // Smooth constant-sum weights do not add an equal-power level bump on correlated drones.
  const t = (frame - crossfadeStart) / (crossfadeEnd - crossfadeStart - 1);
  const blend = 0.5 - 0.5 * Math.cos(Math.PI * t);
  return data.readInt16LE(offset) / 32768 * (1 - blend) + repeated * blend;
};
let sum = 0, peak = 0;
for (let frame = 0; frame < frames; frame++) for (let c = 0; c < 2; c++) {
  const sample = mix(frame, c); sum += sample * sample; peak = Math.max(peak, Math.abs(sample));
}
const rms = Math.sqrt(sum / (frames * 2));
const gain = Math.min(1, 10 ** (-23 / 20) / rms, 0.7 / peak);
const output = Buffer.alloc(44 + frames * 4);
output.write('RIFF'); output.writeUInt32LE(output.length - 8, 4); output.write('WAVEfmt ', 8);
output.writeUInt32LE(16, 16); output.writeUInt16LE(1, 20); output.writeUInt16LE(2, 22);
output.writeUInt32LE(rate, 24); output.writeUInt32LE(rate * 4, 28); output.writeUInt16LE(4, 32);
output.writeUInt16LE(16, 34); output.write('data', 36); output.writeUInt32LE(frames * 4, 40);
for (let frame = 0; frame < frames; frame++) {
  const envelope = Math.min(1, frame / (rate * 8), (frames - 1 - frame) / (rate * 12));
  for (let c = 0; c < 2; c++) output.writeInt16LE(Math.round(mix(frame, c) * gain * envelope * 32767), 44 + (frame * 2 + c) * 2);
}
// Signal-level acceptance: no digital silence in internal 1-second windows or splice discontinuities.
let minInternalRms = 1;
for (let second = 8; second < 3588; second++) {
  let energy = 0;
  for (let i = second * rate * 2; i < (second + 1) * rate * 2; i++) energy += (output.readInt16LE(44 + i * 2) / 32768) ** 2;
  minInternalRms = Math.min(minInternalRms, Math.sqrt(energy / (rate * 2)));
}
if (minInternalRms < 0.0001) throw new Error(`Unexpected internal silence: ${minInternalRms}`);
const jumps = [crossfadeStart, crossfadeEnd].map(frame => Math.max(...[0, 1].map(c => Math.abs(
  output.readInt16LE(44 + (frame * 2 + c) * 2) - output.readInt16LE(44 + ((frame - 1) * 2 + c) * 2)
) / 32768)));
if (jumps.some(value => value > 0.02)) throw new Error(`Splice discontinuity: ${jumps}`);
const pcm = path.join(scratch, 'quiet-hour.wav'); fs.writeFileSync(pcm, output);
const encoded = path.join(scratch, 'quiet-hour.m4a');
execFileSync('/usr/bin/afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '160000', '-q', '127', pcm, encoded]);
for (const folder of ['YixiuMeditation/YixiuMeditation/Audio/Meditation', 'yixiu-prototype/public/assets/yixiu/audio/meditation']) {
  const target = path.join(folder, 'quiet-hour.m4a');
  if (fs.existsSync(target)) throw new Error(`Refusing to overwrite existing audio: ${target}`);
}
for (const folder of ['YixiuMeditation/YixiuMeditation/Audio/Meditation', 'yixiu-prototype/public/assets/yixiu/audio/meditation']) fs.copyFileSync(encoded, path.join(folder, 'quiet-hour.m4a'));
console.log(JSON.stringify({ seconds: 3600, rate, channels, attenuationDb: 20 * Math.log10(gain), minInternalRms, spliceJumps: jumps, sha256: hash(fs.readFileSync(encoded)), bytes: fs.statSync(encoded).size, scratch }));
