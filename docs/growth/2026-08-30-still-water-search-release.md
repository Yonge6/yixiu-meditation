# Still Water search landing release — 2026-08-30

## Released result

- Public page: https://yixiu.wonderelian.com/20-minute-meditation-music/
- Primary intent: `20 minute meditation music`
- Full browser track: Still Water, 1,279.968 seconds (displayed as 21:20)
- Source: `20 Minute Meditation 1` by HoliznaCC0
- License: CC0 1.0
- Dedicated Apple campaign: `yixiu_h5_still_water_20260830`
- Implementation PR: https://github.com/Yonge6/yixiu-meditation/pull/167
- Merge commit: `328e1927b70328335c5738ea901967afab29bd00`

The page answers the listening intent in the first screen, plays the complete file instead of a short sample, and exposes visible creator and license details. It makes no medical or promised-outcome claim. The guide hub, nature-sounds meditation page, sitemap and `llms.txt` now link to the canonical route.

## Verification

- Site tests: 41/41 passed.
- Mobile runtime integrity: 28 protected files passed.
- Browser runtime: 55/55 passed.
- Production build: passed.
- 390 x 844 acceptance: `innerWidth`, `clientWidth` and `scrollWidth` were all 390 pixels.
- Playback acceptance: the full-track button changed to `Pause Still Water`, `aria-pressed` changed to `true`, and the post-play App Store action became visible.
- Production response: HTTP 200, `text/html; charset=utf-8`.
- Audio byte-range response: HTTP 206, `audio/mp4`, `Content-Range: bytes 0-1023/15904394`.

The local build, deployed server and public URL returned matching SHA-256 values:

- Landing page: `4f8b4f6cecac68d6c43ca024d9f6d08b0fcc2eee919271c58d08bdf36fb86d5a`
- Guides page: `a5e445c29d9e402d5e8eb94e5c37d536382f408c1f8acf4483d830f03eae61a8`
- Nature-sounds meditation page: `ff1a566d87d466d6fa7eef85016c8c08bf310c9424c78ed30e4dc1fbc0c820b3`
- Sitemap: `33bb7a05302c403fc625ccf49c461c46761e358df445a06a1d8279bd062b56b3`
- `llms.txt`: `82f5975071b19095916050ea6aee96c1d7604b310186604881eb16153c638f4f`
- Still Water audio: `f110fa05921341f0bde14d95c5987f5091cfc11d6fe838c67f433df3d52fcc4a`
- Still Water cover: `1d7457b2be0ed287bb8b6ee4ab766df7a5987b06354754fee1379bd923c03842`

## Deployment and rollback

- Release ID: `20260830-328e192-still-water-seo-0247`
- Deployment receipt: `DEPLOY_OK_YIXIU_20260830-328e192-still-water-seo-0247`
- Archive: `/tmp/yixiu-20260830-328e192-still-water-seo-0247.tar.gz`
- Archive SHA-256: `68f920aeed9dda7ca9012f561fd431540ccfeb3a8b53e8847a07308affe793dc`
- Rollback backup: `/srv/wonderelian/backups/yixiu-20260830-328e192-still-water-seo-0247`
- Retained server artifacts: `/srv/wonderelian/backups/yixiu-20260830-328e192-still-water-seo-0247/release-artifacts/`

Two earlier package preflights stopped before the production copy step. The successful release used the exact built `dist/client` tree, and all staged, deployed and loopback HTTPS guards passed.

## Discovery submission

IndexNow accepted the new landing page, Guides, Nature Sounds for Meditation, `llms.txt` and sitemap in one request with HTTP 200.

Google Search Console initially reported that the exact new URL was not indexed because Google did not yet know it. The authenticated URL Inspection flow then confirmed `已请求编入索引` and stated that the URL had been added to the priority crawl queue.

These receipts prove submission only. They do not prove recrawling, indexing, ranking, clicks, H5 users or App downloads.

## Growth boundary

The latest completed-day GA4 Data API readback remains `2026-08-29`, filtered to exact hostname `yixiu.wonderelian.com`: 20 active users, 40 page views and 32 sessions. This is below the 100-UV gate.

Apple official Analytics showed 10 first-time downloads and 4 redownloads over the selected 90-day range through 2026-08-28. No recent download is attributed to this page or its Pinterest Pin. Trials, paid users, subscriptions, in-app purchases, revenue and page-attributed downloads remain `null` where no official value is available. The overall growth goal remains active.
