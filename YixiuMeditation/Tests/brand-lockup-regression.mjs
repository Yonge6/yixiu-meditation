import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const root = new URL('../YixiuMeditation/', import.meta.url);
const listen = readFileSync(new URL('ListenView.swift', root), 'utf8');
for (const text of ['一休冥想', '休息、睡眠与静心', 'Yixiu Meditation', 'Rest, Sleep & Calm']) {
  assert.ok(listen.includes(text), `Missing brand text: ${text}`);
}
assert.match(listen, /Image\("BrandAppIcon"\)/);
assert.match(listen, /ViewThatFits\(in: \.horizontal\)/);
assert.match(listen, /accessibilityIdentifier\("listen.brandLockup"\)/);
assert.deepEqual(
  readFileSync(new URL('Assets.xcassets/BrandAppIcon.imageset/AppIcon-1024.png', root)),
  readFileSync(new URL('Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png', root)),
);
console.log('PASS: bilingual native brand, adaptive header and exact App icon');
