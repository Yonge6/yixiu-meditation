import fs from 'node:fs'
import assert from 'node:assert/strict'

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8')
const renderer = read('../YixiuMeditation/SceneShareCardRenderer.swift')
const listen = read('../YixiuMeditation/ListenView.swift')
const models = read('../YixiuMeditation/Models.swift')

assert.match(renderer, /CGSize\(width: 1080, height: 1350\)/)
assert.match(renderer, /UIImage\(named: "BrandAppIcon"\)/)
assert.match(renderer, /一休冥想/)
assert.match(renderer, /休息、睡眠与静心/)
assert.match(renderer, /drawQRCode\(qrImage/)
assert.match(listen, /ActivityShareSheet\(items: \[payload\.image\]\)/)
assert.doesNotMatch(listen, /ActivityShareSheet\(items: \[payload\.image, payload\.url\]\)/)
assert.match(models, /URLQueryItem\(name: "utm_source", value: "yixiu_app"\)/)
assert.match(models, /URLQueryItem\(name: "utm_medium", value: "share_poster"\)/)

console.log('SHARE_POSTER_PASS: branded 1080x1350 poster, QR attribution, image-only native sharing')
