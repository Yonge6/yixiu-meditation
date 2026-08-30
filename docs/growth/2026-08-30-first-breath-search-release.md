# First Breath Search Landing and Distribution Alignment — 2026-08-30

## Scope and decision

This release changes and promotes only Yixiu. It does not modify, publish through, mention, or add referrals to Maker, OneLaser, Wendao, Style Atlas, Xiazi, or another product.

Current English search results for `1 minute meditation music` are dominated by music stores, stock-audio pages, long videos, and account-based meditation services. Yixiu's distinct useful promise is the complete 88-second First Breath instrumental track, playable free online with no account, no ads, no spoken guidance, a visible creator credit, and a CC BY 4.0 license. The new page targets that short-session intent without replacing or duplicating the separate 20-minute Still Water page.

## Live acquisition surface

- Canonical page: `https://yixiu.wonderelian.com/1-minute-meditation-music/`
- Title: `1-Minute Meditation Music — Free Full Track | Yixiu`
- Track: First Breath, 88 seconds
- Audio: `/assets/yixiu/audio/meditation/first-breath.m4a`
- Creator: Yanni Ziangos, also known as YannZ
- License: CC BY 4.0
- App campaign token: `yixiu_h5_first_breath_20260830`
- Implementation PR: `https://github.com/Yonge6/yixiu-meditation/pull/172`
- Landing merge commit: `329d45104e83a56f01756fbf040fa554b00ef965`

The page publishes one H1 and aligned `WebPage`, `ImageObject`, `AudioObject`, `SoftwareApplication`, `FAQPage`, and `BreadcrumbList` data. Guides, Nature Sounds for Meditation, 20-Minute Meditation Music, the sitemap, and `llms.txt` link or route to the new canonical.

Desktop production Chrome loaded the exact title, canonical, H1 and attributed App Store URL with no horizontal overflow. One click changed the control to `Pause First Breath`, set `aria-pressed=true`, and revealed the iPhone, native-share, and Pinterest actions.

## Verification and deployment

- Protected runtime integrity: 28/28 passed.
- Static site tests: 42/42 passed.
- Playwright runtime and funnel suite: 55/55 passed.
- Production build: passed.
- Git whitespace and deployment-script syntax: passed.
- Deployment-count corrections: PR `#173`, PR `#174`, and PR `#175` aligned all staged/deployed page counts with the 26-page sitemap inventory and 24 post-play share surfaces.
- Final deploy-script merge commit: `3e6e7f631784ecf8a074f2707ad6d5f718621d93`.
- Release ID: `20260830-3e6e7f6-first-breath-seo-0851`.
- Deployment result: `DEPLOY_OK_YIXIU_20260830-3e6e7f6-first-breath-seo-0851`.
- Local archive: `/tmp/yixiu-20260830-3e6e7f6-first-breath-seo-0851.tar.gz`.
- Archive SHA256: `1b50fcafdbcb6b82576af21a3be3bf4ef3d296fde42bffffe130b7d61be7ca93`.
- Rollback backup: `/srv/wonderelian/backups/yixiu-20260830-3e6e7f6-first-breath-seo-0851`.
- Retained server artifacts: `/srv/wonderelian/backups/yixiu-20260830-3e6e7f6-first-breath-seo-0851/release-artifacts/`.

The first three guarded attempts stopped before production writes. The first archive produced macOS companion files on Linux, and the next two exposed stale staged-site counts. The final release used a no-xattrs archive and the corrected count guards. The empty failed backup directories were removed after the successful release; their temporary transfer files were not treated as release artifacts.

Local, server, and public SHA256 values matched:

- page: `d432e52b194bbe15dd24defdcf72e2967f54b52461afc10ed1efbb880b4a9512`
- audio: `79402e8dc3092983115c0a1a578150b97617659afa2c617368f546d19f9c6f50`
- image: `0cf421d83abebfc5191ea34069f1bc1d8967b94f199c6f6c4267dd170b2ad1fc`
- Guides: `37669044d4baa20c97e72026ffdd61b7878ccaf0e5685080439c4df7a829836b`
- sitemap: `37a0212a0ee929d9661188089b5ac6986223c8424f2233ddc00762f637501f59`

The canonical page returned HTTP 200. A byte-range request for the First Breath audio returned HTTP 206 with `audio/mp4`.

## Search discovery

One IndexNow request submitted the new canonical, Guides, Nature Sounds for Meditation, 20-Minute Meditation Music, `llms.txt`, and the sitemap. IndexNow returned HTTP 200.

Google Search Console initially reported `网址尚未收录到 Google` and `Google 无法识别此网址`. One `请求编入索引` action completed with `已请求编入索引` and added the canonical to the priority crawl queue. These are discovery receipts only; they do not prove crawling, indexing, ranking, impressions, clicks, or H5 users.

## Pinterest alignment

- Existing Pin: `https://www.pinterest.com/pin/1147643917690439669/`
- Account: WonderElian
- Board: `Yixiu: Nature Sounds & Sleep`
- Title retained: `First Breath: Free 88-Second Meditation Music`
- AI-modified disclosure retained.
- Destination updated in place to `https://yixiu.wonderelian.com/1-minute-meditation-music/?utm_source=pinterest&utm_medium=organic_pin&utm_campaign=meditation_music&utm_content=first_breath_short_pin_01`.

No duplicate Pin was created. The Pin had zero displayed reactions before the link edit. Pinterest warned that link-associated engagement metrics would be lost; the edit was confirmed because the displayed count was zero. The authenticated permanent Pin DOM, logged-out public HTML, and Pinterest oEmbed expose the new destination, exact title, and author WonderElian.

## Scheduled YouTube result

The pre-existing Reset community post became public at 2026-08-30 09:00 Asia/Shanghai:

- Permanent URL: `https://www.youtube.com/post/Ugkx2c0jlPyDpPdF8X1SgX1ubmGm_4t0yTGD`
- Account markers: WonderElian and `@WonderElian1`
- H5 destination: the attributed One-Minute Reset page with `community_water_breathing_reset_04`
- App destination: the official Yixiu App Store listing with campaign token `yixiu_youtube_reset_20260830`

The public URL changed from HTTP 404 before its scheduled time to HTTP 200 at 09:00. Public HTML exposes the account markers and both exact destinations. No new YouTube video was uploaded.

## Authoritative outcome boundary

The latest completed Beijing natural day remains 2026-08-29. The exact-hostname GA4 Data API record for `yixiu.wonderelian.com`, verified at `2026-08-29T23:48:41.019Z`, reports:

- active users / H5 UV: 21
- page views: 42
- sessions: 32
- gap to the 100-UV gate: 79

Retained Apple official evidence proves 10 first-time downloads and 4 redownloads through 2026-08-28. App Store Connect was logged out during this release, so no newer Apple report is claimed. Campaign-specific downloads, product-page views, trial starts, paid conversions, subscriptions, in-app purchases, and revenue remain `null` where current official evidence is unavailable.

This release proves one live short-meditation search surface and two corrected attributable distribution paths. It does not prove a visit caused by this release, a new App download, or completion of the overall growth goal.
