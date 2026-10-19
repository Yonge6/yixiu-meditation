import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/Prototype.tsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/prototype.css', import.meta.url), 'utf8');
const native = readFileSync(new URL('../../YixiuMeditation/YixiuMeditation/YixiuTheme.swift', import.meta.url), 'utf8');

test('gem has six yellow-orange facets with shared native palette and geometry', () => {
  const gem = source.slice(source.indexOf('function PremiumGemIcon()'), source.indexOf('function SceneAccessBadge'));
  assert.match(gem, /viewBox="0 0 24 22"/);
  for (const hex of ['ffe9b3', 'ffde91', 'f5b34e', 'f5ac3d', 'ffd375', 'df8129']) {
    assert.match(gem, new RegExp(`fill="#${hex}"`));
    const [r, g, b] = hex.match(/../g).map(value => parseInt(value, 16));
    assert.match(native.replaceAll(' ', ''), new RegExp(`red:${r}/255,green:${g}/255,blue:${b}/255`));
  }
  assert.match(native, /struct PremiumGemIcon: View/);
  assert.match(gem, /aria-hidden="true"/);
  assert.match(css, /\[data-premium-gem\] \.premium-gem-outline/);
  assert.doesNotMatch(css, /web-membership \.premium-gem-outline.*aqua/);
});

test('FREE and Plus labels remain distinct from decorative gemstone', () => {
  assert.match(source, /className="scene-access-badge is-free">FREE/);
  assert.match(source, /className="scene-access-badge is-plus" aria-label="Yixiu Plus"/);
});
