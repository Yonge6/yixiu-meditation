import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const read = path => readFileSync(new URL('../' + path, import.meta.url));
const native = read('YixiuMeditation/YixiuMeditation/Audio/end-bell.wav');
assert.deepEqual(native, read('yixiu-prototype/public/assets/yixiu/audio/end-bell.wav'));
assert.equal(native.readUInt32LE(24), 44100);
assert.equal(native.readUInt32LE(40) / (44100 * 2), 2.8);
let peak = 0;
for (let i = 44; i < native.length; i += 2) peak = Math.max(peak, Math.abs(native.readInt16LE(i)) / 32768);
assert(peak > 0.1 && peak < 0.5);
const state = read('YixiuMeditation/YixiuMeditation/AppState.swift').toString();
const focus = read('YixiuMeditation/YixiuMeditation/FocusView.swift').toString();
assert.match(state, /var endBell = false/);
assert.match(state, /func playCompletionBell\(\)\s*\{\s*guard endBell else/);
assert.match(state, /if remaining == 0 \{\s*pause\(\)\s*recordCompletedSession\(\)\s*sessionCompleted = true\s*playCompletionBell\(\)/);
assert.match(focus, /status = .complete[\s\S]*?restoreOriginalPlayback\(\)\s*appState.playCompletionBell\(\)\s*return/);
assert.equal((focus.match(/appState.playCompletionBell\(\)/g) || []).length, 1);
assert.equal((state.match(/playCompletionBell\(\)/g) || []).length, 2); // Definition and natural listening completion only.
console.log('END_BELL_ASSET_AND_NATIVE_WIRING_PASS', { seconds: 2.8, peak });
