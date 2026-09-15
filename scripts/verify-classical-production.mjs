import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const origin = 'https://yixiu.wonderelian.com';
const tracks = JSON.parse(readFileSync(new URL('../docs/audio/classical-ten-sources.json', import.meta.url))).tracks;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function get(path) {
  const response = await fetch(origin + path, { signal: AbortSignal.timeout(90_000) });
  assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}
const credits = (await get('/music-credits.html')).toString();
assert.equal((credits.match(/data-classical-id=/g) || []).length, 10);
for (let i = 0; i < tracks.length; i += 2) {
  await Promise.all(tracks.slice(i, i + 2).map(async track => {
    assert(credits.includes(`data-classical-id="${track.id}"`));
    const audio = await get(`/assets/yixiu/audio/meditation/${track.slug}.m4a`);
    assert.equal(hash(audio), track.sha256, `${track.id} public audio hash`);
    const image = await get(`/assets/yixiu/classical/${track.slug}.jpg`);
    assert.equal(hash(image), track.artSha256, `${track.id} public artwork hash`);
    console.log(`PUBLIC_VERIFIED ${track.id} audio=${audio.length} artwork=${image.length}`);
  }));
}
const root = (await get('/')).toString();
const script = root.match(/src="(\/assets\/index-[^"]+\.js)"/)[1];
const css = root.match(/href="(\/assets\/index-[^"]+\.css)"/)[1];
const js = (await get(script)).toString();
for (const track of tracks) assert(js.includes(track.id), `${track.id} absent in public catalog`);
console.log(`CLASSICAL_PRODUCTION_PASS 10/10 ${script} ${css}`);
