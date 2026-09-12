// macOS: node scripts/prepare-ambient-music.mjs <download-directory>
// Reads licensed originals, softens their level, and writes identical native/H5 AAC assets.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const input = process.argv[2];
if (!input || !fs.statSync(input).isDirectory()) throw new Error('Provide the source download directory');
const scratch = fs.mkdtempSync('/tmp/yixiu-ambient-encode-');
const tracks = [
  ['cylinder-seven', 'cloud-drift', 'b065596eeca06a82aabc6a46cd7446e56d62ff5fa761abf92d8147a3c3adde96'],
  ['cylinder-eight', 'soft-light-rest', '4f980cf97608dd9f0c7dbed8a9742d0083584767b2e8338ac50514ca0700129a'],
  ['cylinder-nine', 'deep-water-rest', '108c6a8babb1d088787d59442412a5bb50506c787892e5f8099a2b714dc659b7'],
];
for (const [original, , expected] of tracks) {
  const bytes = fs.readFileSync(path.join(input, `${original}.mp3`));
  if (createHash('sha256').update(bytes).digest('hex') !== expected) throw new Error(`Unverified or incomplete original: ${original}`);
}
for (const [original, name] of tracks) {
  const source = path.join(input, `${original}.mp3`);
  const decoded = path.join(scratch, `${name}-source.wav`);
  execFileSync('/usr/bin/afconvert', ['-f', 'WAVE', '-d', 'LEI16', source, decoded]);
  const wav = fs.readFileSync(decoded);
  let rate, channels, data;
  for (let p = 12; p + 8 <= wav.length;) {
    const size = wav.readUInt32LE(p + 4);
    const tag = wav.toString('ascii', p, p + 4);
    if (tag === 'fmt ') {
      if (wav.readUInt16LE(p + 8) !== 1 || wav.readUInt16LE(p + 22) !== 16) throw new Error('Expected PCM16');
      channels = wav.readUInt16LE(p + 10);
      rate = wav.readUInt32LE(p + 12);
    }
    if (tag === 'data') data = wav.subarray(p + 8, p + 8 + size);
    p += 8 + size + size % 2;
  }
  if (!data || rate !== 44100 || channels !== 2) throw new Error('Expected 44.1 kHz stereo data');
  const frames = data.length / (channels * 2);
  let sum = 0;
  for (let i = 0; i < data.length; i += 2) sum += (data.readInt16LE(i) / 32768) ** 2;
  // Only attenuate. Target -23 dBFS RMS, not a claim about LUFS or sleep benefits.
  const gain = Math.min(1, 10 ** (-23 / 20) / Math.sqrt(sum / (data.length / 2)));
  for (let frame = 0; frame < frames; frame++) {
    const envelope = Math.min(1, frame / (rate * 2), (frames - 1 - frame) / (rate * 4));
    for (let channel = 0; channel < channels; channel++) {
      const i = (frame * channels + channel) * 2;
      data.writeInt16LE(Math.round(data.readInt16LE(i) * gain * envelope), i);
    }
  }
  const softened = path.join(scratch, `${name}.wav`);
  fs.writeFileSync(softened, wav);
  const encoded = path.join(scratch, `${name}.m4a`);
  execFileSync('/usr/bin/afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '160000', '-q', '127', softened, encoded]);
  const bytes = fs.readFileSync(encoded);
  for (const folder of ['YixiuMeditation/YixiuMeditation/Audio/Meditation', 'yixiu-prototype/public/assets/yixiu/audio/meditation']) {
    fs.copyFileSync(encoded, path.join(folder, `${name}.m4a`));
  }
  console.log(JSON.stringify({ name, seconds: frames / rate, attenuationDb: 20 * Math.log10(gain), bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') }));
}
console.log(`Retained processing files: ${scratch}`);
