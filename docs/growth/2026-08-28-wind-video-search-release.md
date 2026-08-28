# Mountain Wind Video Search Release

## Public artifact

- Landing page: `https://yixiu.wonderelian.com/wind-sounds-for-sleeping/`
- Embedded Short: `https://www.youtube.com/shorts/iMG8YanRAnA`
- Search intent: `wind sounds for sleeping`
- Channel: WonderElian (`@WonderElian1`)
- Visible video title: `Wind Sounds for Sleeping — Mountain Air, No Music`
- Video duration: 21 seconds

The already-public WonderElian Short is now visible on the existing indexed Yixiu wind-sleep page through a privacy-enhanced YouTube embed. Playback does not start automatically. The page also exposes aligned `VideoObject` structured data with the public video URL, stable thumbnail, upload date and duration. No new YouTube upload was performed, and no other product was changed.

This change follows the strongest current signal inside the authorized Yixiu surfaces: YouTube Studio reported 160 lifetime views for the Mountain Wind Short, with 85.7% of its latest 48-hour traffic from YouTube Search, while Google Search Console had already confirmed the matching H5 page was indexed. The release is an acquisition experiment, not a claim that Google will show a video result or that video views became H5 users.

## Release evidence

- Pull request: `https://github.com/Yonge6/yixiu-meditation/pull/70`
- Merge commit: `5c665f9299c1c02d35763264c0e0a27a82f9ecda`
- Release: `20260828-5c665f9-wind-video-2339`
- Archive: `/tmp/yixiu-20260828-5c665f9-wind-video-2339.tar.gz`
- Archive SHA-256: `0896e240dfb2527bfa6d95f30d7e37f1e98e69af465960b1412d61d830d5fc03`
- Server backup: `/srv/wonderelian/backups/yixiu-20260828-5c665f9-wind-video-2339`
- Landing-page SHA-256: `704891d76066f5327c715add9bb2dc2f1f2af20e7b8c5eaf29a293459e5418f8`
- Discover CSS SHA-256: `2bdc19b53dfca925539d1e93ae83a3e437d0f5b4dcfe45ca7f26833968262055`
- Sitemap SHA-256: `b27f0da7fbfe38e2615fa96875fac6b5f188b23a08a053d4cb17e17d5c2d0d96`

Local, server and public hashes matched for the landing page, shared Discover CSS and sitemap. Nginx validation passed, deployment returned `DEPLOY_OK_YIXIU_20260828-5c665f9-wind-video-2339`, and the public page returned HTTP 200. IndexNow accepted the page and sitemap submission with HTTP 200; that response proves receipt only, not crawling or ranking.

## Acceptance and measurement boundary

- Protected mobile runtime: 28 files passed.
- Static-site tests: 31/31 passed.
- Production build: passed.
- Desktop Chrome: video section and thumbnail rendered; canonical URL, version 1.4 and privacy-enhanced iframe were present; autoplay was absent.
- Responsive acceptance: 390px desktop emulation with no horizontal overflow and a contained 9:16 embed.

This release does not change the overall completion gate. Only a completed Beijing natural day with at least 100 hostname-filtered GA4 active users, together with official Apple download evidence, can complete the goal. YouTube and Instagram views are not substituted for H5 UV.
