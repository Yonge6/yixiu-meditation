# Rain Dark-Screen Player Release — 2026-08-29

## Decision

The existing canonical `/sleep-sounds/` page already had early Google Search Console impressions and was indexed. This release improves that page for the specific intent `rain sounds for sleeping with a dark screen` instead of creating a near-duplicate page that could split its search signal. The work is limited to Yixiu and does not change or route through any other product.

## Production change

- Public page: `https://yixiu.wonderelian.com/sleep-sounds/`
- SEO title: `Rain Sounds for Sleeping — Dark Screen, No Ads | Yixiu`
- H1: `Rain sounds for sleeping with a dark screen.`
- The dark-screen control remains disabled until the real Window Rain preview successfully starts.
- The full-viewport black screen leaves the rain and 15, 30 or 60 minute timer running; click or Escape returns without stopping playback.
- Visible copy and FAQ distinguish the open-web-page dark screen from physical iPhone lock-screen background playback.
- Analytics events: `yixiu_dark_screen_start` and `yixiu_dark_screen_end`, placement `sleep_landing_dark_screen`.
- No new landing page, cross-product referral, ad claim, account conversion or unsupported lock-screen claim was introduced.

## Git and verification

- PR #102: `https://github.com/Yonge6/yixiu-meditation/pull/102`
- Feature merge: `6057617115dcae96539669c630b825b95b4a1fa7`
- PR #103: `https://github.com/Yonge6/yixiu-meditation/pull/103`
- Release-guard merge and deployed source: `db87ee4d47e79c577208c163192350cfdc6d2ffc`
- The tested feature tree matched PR #102's merge tree, and the final release-guard tree matched `origin/main` before build.
- Protected runtime validation: 28 files passed.
- Production build: passed.
- Static site tests: 33/33 passed.
- Isolated full Playwright suite: 48/48 passed.
- A focused keyboard/timing case passed 3/3 serial reruns after one parallel timing flake.
- Mobile assertion at 390×844: exact full-screen overlay, no horizontal overflow, timer continuity, click/Escape return, focus restoration and exact analytics events passed.

## Deployment proof

- Release ID: `20260829-db87ee4-rain-dark-screen-0435`
- Deployment result: `DEPLOY_OK_YIXIU_20260829-db87ee4-rain-dark-screen-0435`
- Local archive: `/tmp/yixiu-20260829-db87ee4-rain-dark-screen-0435.tar.gz`
- Archive SHA256: `3def86164a6cf0fa830c600933b1198db9c6981a50c03ce361b439994c1d437d`
- Server backup: `/srv/wonderelian/backups/yixiu-20260829-db87ee4-rain-dark-screen-0435`
- Release artifacts were moved into the backup's `release-artifacts/` directory; the independent local archive remains available.
- Nginx configuration validation and reload passed.
- Public page returned HTTP 200.
- The real `light-rain.m4a` preview returned HTTP 206 with `audio/mp4` for a byte-range request.

Local build, server and public SHA256 values matched exactly:

- Sleep page: `0c380303220657731947ab4e6ca152fc83900f3add9b01a61243a8148889fff0`
- `discover.js`: `48b5665663a0ece12777b105e5bc7779ba71175f8f01f2058fc79dc9cc4ee5fb`
- `discover.css`: `c75ca79ff5b61a1002b0562f01bba27750cbb2477572239db5d3e9464d8f2e45`
- Window Rain audio: `83ecb47191fe8901a83a31ecec65c17bef9f3ea8f35727e6869c29900099e46d`

## Desktop Chrome acceptance

Authenticated desktop Chrome loaded the production page at 1824×1190 with no horizontal overflow. The title and H1 matched the release, and `Darken Screen` was disabled before playback. After `Play Window Rain`:

- the control changed to `Pause Window Rain` with `aria-pressed=true`;
- the dark-screen control became enabled;
- the timer changed from `29:59 remaining` to `29:57 remaining` behind the black screen;
- the overlay exposed `Window Rain is playing`, `Dark screen`, and its return instruction;
- Escape closed the overlay, restored focus to `Darken Screen`, preserved playback, and the timer continued to `29:50 remaining`;
- playback was paused after acceptance.

## Search submission

- IndexNow returned HTTP 200 for the Sleep page, Guides and sitemap. This proves receipt only, not crawling or ranking.
- Google Search Console reported `https://yixiu.wonderelian.com/sleep-sounds/` as indexed and HTTPS-valid.
- After the release, Search Console confirmed that the URL was added to the priority crawl queue. This proves a recrawl request only.
- The sitemap remained successful with 23 discovered pages and a 2026-08-29 read date.
- Search performance at the latest official readback remained 0 clicks and 7 impressions through 2026-08-26; no query row was available.

## Measurement boundary

The fresh exact-hostname GA4 Data API readback after deployment still reported 2 active users, 3 views and 4 sessions for 2026-08-29. This is an incomplete Beijing natural day and does not prove a result from this release.

The latest completed-day evidence remains conflicting: the 2026-08-28 GA4 hostname UI table showed 40 active users, 55 views and 47 sessions, while a later exact-hostname GA4 Data API readback showed 26 active users, 35 views and 33 sessions. Both are below the 100-UV gate, so the growth goal remains active.

Apple official analytics already proves 10 first-time downloads and 4 redownloads through 2026-08-26. Trial starts, paid conversions, subscriptions, in-app purchases, revenue and a scalar `yixiu_download_click` result remain `null` where authoritative evidence is unavailable.
