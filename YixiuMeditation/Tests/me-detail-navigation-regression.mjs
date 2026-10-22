import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(resolve(here, '../YixiuMeditation/MeView.swift'), 'utf8');

const detailStart = source.indexOf('private func detail(geometry: GeometryProxy)');
const gestureStart = source.indexOf('private var detailBackGesture', detailStart);
assert.ok(detailStart >= 0 && gestureStart > detailStart, 'Me detail container must exist');

const detail = source.slice(detailStart, gestureStart);
assert.match(detail, /Image\(systemName: "chevron\.left"\)/, 'Me detail pages must expose a visible back icon');
assert.match(detail, /page = \.home/, 'Me detail back control must return to the Me root');
assert.match(detail, /accessibilityIdentifier\("me\.detail\.back"\)/, 'Me detail back control must remain UI-testable');
assert.doesNotMatch(detail, /ignoresSafeArea\(edges: \.top\)/, 'Me detail header must not be hidden under the status bar or Dynamic Island');

console.log('Me detail navigation regression checks passed.');
