import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const base = path.dirname(fileURLToPath(import.meta.url));
export async function updateMetadata(page) {
  const meta = JSON.parse(await fs.readFile(path.join(base, 'aso-metadata.json'), 'utf8'));
  const current = await page.fetch(`/iris/v1/appStoreVersions/${meta.versionId}`);
  if (!current.ok) throw Error(`Read draft: ${current.status}`);
  const version = JSON.parse(current.body).data;
  if (version.attributes.versionString !== meta.version || version.attributes.appStoreState !== 'PREPARE_FOR_SUBMISSION') throw Error('Draft state changed; stop');
  const receipts = [];
  for (const locale of ['zh-Hans', 'en-US']) {
    const item = meta[locale];
    const url = `/iris/v1/appStoreVersionLocalizations/${item.localizationId}`;
    const before = await page.fetch(url);
    if (!before.ok || JSON.parse(before.body).data.attributes.locale !== locale) throw Error(`Locale identity mismatch: ${locale}`);
    try { await fs.writeFile(path.join(base, `${locale}-metadata-before.json`), before.body, { flag: 'wx' }); }
    catch (error) { if (error.code !== 'EEXIST') throw error; }
    const attributes = Object.fromEntries(['description', 'keywords', 'promotionalText', 'whatsNew'].map(key => [key, item[key]]));
    const saved = await page.fetch(url, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ data: { type: 'appStoreVersionLocalizations', id: item.localizationId, attributes } }) });
    if (!saved.ok) throw Error(`Save ${locale}: ${saved.status} ${saved.body}`);
    const read = await page.fetch(url);
    if (!read.ok) throw Error(`Read back ${locale}: ${read.status}`);
    const result = JSON.parse(read.body).data;
    for (const [key, value] of Object.entries(attributes)) if (result.attributes[key] !== value) throw Error(`Readback mismatch: ${locale} ${key}`);
    receipts.push({ locale, id: result.id, saved: true, attributes });
    await fs.writeFile(path.join(base, 'metadata-readback.json'), JSON.stringify(receipts, null, 2));
  }
  const detailRead = await page.fetch(`/iris/v1/appStoreVersions/${meta.versionId}/appStoreReviewDetail`);
  if (!detailRead.ok) throw Error(`Read review detail: ${detailRead.status}`);
  const detailId = JSON.parse(detailRead.body).data.id;
  const review = await page.fetch(`/iris/v1/appStoreReviewDetails/${detailId}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ data: { type: 'appStoreReviewDetails', id: detailId, attributes: { notes: meta.reviewNotes } } }) });
  if (!review.ok) throw Error(`Review notes: ${review.status} ${review.body}`);
  const read = await page.fetch(`/iris/v1/appStoreReviewDetails/${detailId}`);
  if (!read.ok || JSON.parse(read.body).data.attributes.notes !== meta.reviewNotes) throw Error('Review notes mismatch');
  await fs.writeFile(path.join(base, 'review-notes-readback.json'), JSON.stringify({ id: detailId, notes: meta.reviewNotes, saved: true }, null, 2));
  return receipts.map(item => ({ locale: item.locale, id: item.id, saved: item.saved }));
}
