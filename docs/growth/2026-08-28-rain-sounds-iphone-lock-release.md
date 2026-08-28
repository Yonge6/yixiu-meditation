# Rain Sounds When iPhone Locks Search Release

## Public artifact

- Landing page: `https://yixiu.wonderelian.com/rain-sounds-when-iphone-locked/`
- Search intent: `rain sounds when iPhone locks`
- Primary source: Apple's current Background Sounds guide at `https://support.apple.com/en-sg/guide/iphone/iphb2cfa052c/ios`
- Audio: Yixiu Window Rain, AAC, first-party recording used by the existing Window scene
- Preview analytics placement: `rain_lock_screen_preview`
- App Store placements: `rain_lock_screen_landing` and `rain_lock_screen_after_preview`
- App Store attribution: Sleep custom-product-page identifier plus `pt=120014121`, `ct=yixiu_h5_20260827` and `mt=8`

The page answers the lock-screen setting question before presenting Yixiu. It states that Apple's built-in Background Sounds is the quickest no-download option when one of its sounds fits, then explains Yixiu's background playback, 14 nature soundscapes and 15/30/60-minute timer. It makes no medical, sleep-performance, rating or download-outcome claim. Every project change stays inside Yixiu.

## Search discovery

- Guides exposes a dedicated lock-screen card and a 19-item aligned `ItemList`.
- Rain Sounds for Sleeping links to the new troubleshooting guide.
- The sitemap includes the canonical URL with `lastmod` `2026-08-28`.
- IndexNow accepted the new page, Guides, Rain Sounds for Sleeping and sitemap with HTTP 200.

## Release evidence

- Pull request: `https://github.com/Yonge6/yixiu-meditation/pull/60`
- Merge commit: `53f936b45eb1449a362492dcf10b8231ccbe614e`
- Release: `20260828-53f936b-rain-lock-1526`
- Archive: `/tmp/yixiu-20260828-53f936b-rain-lock-1526.tar.gz`
- Archive SHA-256: `5dd4aa24a839b11af9dc06cddfd6fc3c82fcea042794ce26a6fb46d85ca76de7`
- Server backup: `/srv/wonderelian/backups/yixiu-20260828-53f936b-rain-lock-1526`
- Landing-page SHA-256: `43d2655077d928e8380796e0f51282ba5e9fb1bc6d3715083d88593cb6ec56bc`
- Guides SHA-256: `8ff913d83dd402abbb1cbbab1fd912306c58b392cfb82e050ec9bf30f67bbdb9`
- Rain Sounds for Sleeping SHA-256: `d6d7d61ad852ad42ded46e273fce5243d505085e808153523137508ef2174f7e`
- Sitemap SHA-256: `e679674fb9fd5cab96da845d9905879d25fa46e2723f43aeb37fd09f439dc2e3`
- Window Rain WebP SHA-256: `00768b092e04fd9b5615e94ab4dffd3d11ef584531d3e97c382a5f0ef4c2ad6a`
- Window Rain audio SHA-256: `83ecb47191fe8901a83a31ecec65c17bef9f3ea8f35727e6869c29900099e46d`

Local, server and public hashes matched for all six artifacts. Nginx validation passed, the deploy returned `DEPLOY_OK_YIXIU_20260828-53f936b-rain-lock-1526`, the public page returned HTTP 200, and the audio returned HTTP 206 with `audio/mp4` for a byte-range request.

## Acceptance and measurement boundary

- Protected mobile runtime: 28 files passed.
- Build: passed.
- Static-site tests: 31/31 passed.
- Playwright: 44/44 passed.
- Mobile acceptance: 390 px with no horizontal overflow; the real Window Rain preview entered playing state, the selected timer advanced, and the post-preview Sleep download action appeared.
- Production browser: the preview changed to `Pause Rain for Lock Screen`, the 15-minute timer advanced to `14:58 remaining`, the post-preview download action appeared and the canonical remained exact.

The latest verified completed Beijing natural day remains 2026-08-27 with 14 GA4 active users, 20 page views and 15 sessions. The partial 2026-08-28 readback reached 15 active users, 20 page views and 17 sessions but cannot satisfy a completed-day gate. H5 remains below 100 UV. Apple official data proves 10 first-time downloads through 2026-08-26; trials, paid conversions, subscriptions, in-app purchases and revenue remain `null` where Apple showed insufficient data. The overall growth goal remains active.
