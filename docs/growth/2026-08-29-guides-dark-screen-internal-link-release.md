# Guides Dark-Screen Internal-Link Release — 2026-08-29

## Released result

PR #113 merged the Yixiu-only change as `b35ecdf92f4328f027997cac0b4e283435e38360`. The indexed `/guides/` hub now describes its existing `/sleep-sounds/` destination as `Rain sounds with a dark screen`, including the truthful 15-, 30- and 60-minute timer and open-page dark-screen behavior. The visible card, CTA, meta description and first `ItemList` entry are aligned. No new route, playback feature, account change or other-product referral was added.

Public URLs:

- `https://yixiu.wonderelian.com/guides/`
- `https://yixiu.wonderelian.com/sleep-sounds/`

## Verification

- Protected runtime integrity: 28 files passed.
- Static site tests: 33/33 passed.
- Production build: passed.
- Full Playwright runtime and funnel suite: 48/48 passed on isolated port 4278.
- A prior run connected to an unrelated existing Wendao service on the default reused port, and one later isolated run had a transient keyboard-transition failure. No Wendao process or file was changed. The affected test then passed 3/3 targeted retries and passed again in the clean 48/48 suite.
- Mobile QA at 390 x 844: `scrollWidth=390`, `innerWidth=390`; the visible heading, `/sleep-sounds/` href, CTA, behavior copy and structured-data name all matched.

## Production proof

- Release ID: `20260829-024958f-guides-dark-screen-0605`
- Deployment result: `DEPLOY_OK_YIXIU_20260829-024958f-guides-dark-screen-0605`
- Local archive: `/tmp/yixiu-20260829-024958f-guides-dark-screen-0605.tar.gz`
- Archive SHA-256: `9fc6af4c49026411c786b508518328ce8e678a2a5b3be0cba914f66a0076b1b6`
- Server backup: `/srv/wonderelian/backups/yixiu-20260829-024958f-guides-dark-screen-0605`

Local build, server and public hashes matched exactly:

- Guides: `f0e382a12dbe28c832ec851f8e7294700b29ade73bbf0983ab04958a71f28990`
- Sleep Sounds: `0c380303220657731947ab4e6ca152fc83900f3add9b01a61243a8148889fff0`
- Sitemap: `59e64a54713392da409cdf69647b77a8b95befe2650f820f4a78c35d2025a99e`

Both public HTML pages returned HTTP 200. The public Guides source exposed the correct canonical, visible dark-screen card, `/sleep-sounds/` link, CTA, timer copy and matching `ItemList` name.

## Discovery submission

IndexNow accepted Guides, Sleep Sounds and sitemap in one request with HTTP 200. That proves receipt only, not crawling or ranking.

Google Search Console reported that the exact Guides URL is indexed and uses HTTPS. The first reindex request returned a transient submission error; one retry succeeded with `已请求编入索引` and confirmed that the URL was added to the priority crawl queue. This proves the request, not a completed recrawl, impressions, clicks or visits.

## Measurement boundary

The official GA4 Data API snapshot for the incomplete Beijing day 2026-08-29 reported 5 active users, 7 views and 8 sessions for exact hostname `yixiu.wonderelian.com`. It also reported 4 `yixiu_playback_start` events from 3 users, but no `yixiu_share` or `yixiu_download_click` row. Diagnostic activity may be present in the partial-day total, so this snapshot is not used as a growth result or as evidence for the 100-UV gate.

The latest completed-day evidence remains conflicting: the 2026-08-28 GA4 hostname UI showed 40 active users, 55 views and 47 sessions, while the later exact-hostname Data API readback showed 26 active users, 35 views and 33 sessions. Both are below 100.

Apple official analytics already proves 10 first-time downloads and 4 redownloads through 2026-08-26. Trial starts, paid conversions, subscriptions, in-app purchases, revenue and campaign-specific App downloads remain `null` where authoritative evidence is unavailable. This release is complete, while the long-term 100-UV goal is not complete.
