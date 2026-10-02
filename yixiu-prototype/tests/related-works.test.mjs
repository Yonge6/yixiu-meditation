import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('Buer entry uses the current bilingual brand and domain in H5 and native', () => {
  for (const path of ['../src/Prototype.tsx', '../../YixiuMeditation/YixiuMeditation/MeView.swift']) {
    const source = readFileSync(new URL(path, import.meta.url), 'utf8');
    for (const text of ['https://buer.wonderelian.com/', '不二见己', 'Buer Within', '与真实的自己 · 温柔相遇', 'Meet your true self', 'AI 成长伙伴豆豆龙']) {
      assert.ok(source.includes(text), `${path}: missing ${text}`);
    }
    assert.ok(!source.includes('https://human-design.wonderelian.com/'));
    assert.ok(!source.includes('人生使用说明书'));
  }
});
