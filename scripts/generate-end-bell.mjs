// Original synthesized UI cue, not a nature recording. Same PCM bytes on both platforms.
import { writeFileSync } from 'node:fs';
const rate = 44100;
const seconds = 2.8;
const count = Math.round(rate * seconds);
const wav = Buffer.alloc(44 + count * 2);
wav.write('RIFF'); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8);
wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 2, 28);
wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
wav.write('data', 36); wav.writeUInt32LE(count * 2, 40);
for (let i = 0; i < count; i++) {
  const t = i / rate;
  const attack = Math.min(1, t / 0.025);
  const tail = Math.min(1, (seconds - t) / 0.3);
  const tone = Math.sin(2 * Math.PI * 528 * t) * Math.exp(-t * 1.8)
    + 0.25 * Math.sin(2 * Math.PI * 1058 * t) * Math.exp(-t * 2.6)
    + 0.10 * Math.sin(2 * Math.PI * 1463 * t) * Math.exp(-t * 3.8);
  wav.writeInt16LE(Math.round(32767 * 0.32 * attack * tail * tone), 44 + i * 2);
}
for (const path of ['../YixiuMeditation/YixiuMeditation/Audio/end-bell.wav',
  '../yixiu-prototype/public/assets/yixiu/audio/end-bell.wav']) {
  writeFileSync(new URL(path, import.meta.url), wav);
}
