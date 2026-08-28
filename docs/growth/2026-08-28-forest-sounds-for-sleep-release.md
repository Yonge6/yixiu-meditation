# Forest Sounds for Sleep Search Release

## Public artifact

- Landing page: `https://yixiu.wonderelian.com/forest-sounds-for-sleep/`
- Search intent: `forest sounds for sleep`
- Audio: Yixiu Forest Breeze, AAC stereo, first-party recording used by the existing Valley scene
- Preview analytics placement: `forest_sleep_preview`
- App Store placements: `forest_sleep_landing` and `forest_sleep_after_preview`
- App Store attribution: Sleep custom-product-page identifier plus `pt=120014121`, `ct=yixiu_h5_20260827` and `mt=8`

The page is distinct from the existing Forest Sounds for Focus route. It answers a bedtime intent with low-volume setup guidance, a 15/30/60-minute browser timer, screen-dark/background-playback context and comparisons with rain, ocean waves and mountain wind. It makes no universal sleep, treatment, rating or performance claim. All links stay inside Yixiu or point to the Yixiu App Store listing; no other product was modified.

## Search discovery

- Guides exposes a dedicated Forest Sounds for Sleep card and an 18-item aligned `ItemList`.
- Contextual links were added from Rain Sounds for Sleeping and Forest Sounds for Focus.
- The sitemap includes the canonical URL with `lastmod` `2026-08-28`.
- IndexNow accepted the new page, Guides, both updated adjacent pages and sitemap with HTTP 200.

## Release evidence

- Pull request: `https://github.com/Yonge6/yixiu-meditation/pull/57`
- Merge commit: `06d4a41bc877e9691cfc7f0eb6a6a5c550ca591b`
- Release: `20260828-06d4a41-forest-sleep-1451`
- Archive: `/tmp/yixiu-20260828-06d4a41-forest-sleep-1451.tar.gz`
- Archive SHA-256: `27bb05e3cd4ba337766b6a4eadd170ec1e99ce1cf573c28f2446db0ac9591c4d`
- Server backup: `/srv/wonderelian/backups/yixiu-20260828-06d4a41-forest-sleep-1451`
- Landing-page SHA-256: `8805dd97d9308fa187d5e7d523c237ad1a00f694c479783b87114a1f68fed13a`
- Guides SHA-256: `838c4b5893614f24800aa40d325704f64861d6a2a5af1c25acf34a41d797e3b6`
- Sitemap SHA-256: `5da0b647b1a99c93c78177d29b9d7a6e70137cfc09fda8d4bffb29fb942ae791`
- WebP SHA-256: `ea6eab7d5f104af99b57b13fe00da3b110614187c88435b7b0ea17d3c4a79aba`
- Forest Breeze audio SHA-256: `ae2f558682dee58fd65a95cc7dba2b976d910a46e5f06ca36ed4417630b71af8`

Local, server and public hashes matched for the landing page, Guides, sitemap, WebP and audio. Nginx validation passed, the deploy returned `DEPLOY_OK_YIXIU_20260828-06d4a41-forest-sleep-1451`, the public page returned HTTP 200, and the audio returned HTTP 206 with `audio/mp4` for a byte-range request.

## Acceptance and measurement boundary

- Protected mobile runtime: 28 files passed.
- Build: passed.
- Static-site tests: 30/30 passed.
- Playwright: 43/43 passed.
- Mobile acceptance: 390px with no horizontal overflow; real Forest Breeze preview changed to playing, the selected 15-minute timer advanced, and the post-preview Sleep download action appeared.
- Production browser: the preview changed to `Pause Forest Sounds`, the timer advanced to `14:59 remaining`, and the post-preview download action appeared.

The latest verified completed Beijing natural day remains 2026-08-27 with 14 GA4 active users, 20 page views and 15 sessions. This is below the 100-UV gate. Apple official data already proves 10 first-time downloads through 2026-08-26; trials, paid conversions, subscriptions, in-app purchases and revenue remain `null` where Apple showed insufficient data. The overall growth goal remains active.
