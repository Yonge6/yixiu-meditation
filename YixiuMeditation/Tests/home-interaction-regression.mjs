import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Structural guardrails, not a substitute for simulator gesture testing.
const source = name => readFileSync(new URL(`../YixiuMeditation/${name}.swift`, import.meta.url), 'utf8');
const listen = source('ListenView');
const me = source('MeView');
assert.match(listen, /ViewThatFits\(in: \.vertical\)/);
assert.match(listen, /sceneCanvas\(width: size\.width, opensLibrary: !scrolls\)/);
assert.match(listen, /playerPage\(geometry\.size, scrolls: true\)/);
assert.match(listen, /Color\.clear\.frame\(height: 12\)/);
assert.match(listen, /\.accessibilityIdentifier\("listen\.sceneCanvas"\)/);
assert.match(listen, /vertical <= -64/);
assert.match(listen, /subscriptionStore\.canAccess\(target\)/);
assert.doesNotMatch(me, /requestReview\(\)/);
assert.match(me, /https:\/\/apps\.apple\.com\/app\/id1461182261\?action=write-review/);
assert.match(me, /if !accepted \{ reviewOpenFailed = true \}/);
assert.match(source('ContentView'), /requestReview\(\)/);
console.log('PASS: home layout/gesture and explicit review-link guardrails');
