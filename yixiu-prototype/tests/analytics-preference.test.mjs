import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../src/Prototype.tsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/prototype.css', import.meta.url), 'utf8');
test('analytics preference uses an accessible styled switch without changing consent handling', () => {
  const section = source.slice(source.indexOf('<section className="me-card analytics-preference">'), source.indexOf('<section className="trust-links" aria-label={language === "zh" ? "关于与支持"'));
  assert.match(section, /role="switch"/);
  assert.match(section, /aria-checked=\{usageAnalytics\}/);
  assert.match(section, /chooseAnalytics\(!usageAnalytics\)/);
  assert.match(section, /aria-describedby="analytics-preference-description"/);
  assert.doesNotMatch(section, /type="checkbox"/);
  assert.match(section, /className="analytics-privacy-link" href="\/privacy.html"/);
  assert.match(css, /analytics-switch[^}]*height: 44px/);
  assert.match(css, /analytics-privacy-link[^}]*text-decoration: none/);
});
