# Deep White Noise Search and Pinterest Release

## Public artifacts

- Landing page: `https://yixiu.wonderelian.com/underwater-white-noise-for-sleep/`
- Pinterest Pin: `https://www.pinterest.com/pin/1147643917690288082/`
- Pinterest account: `WonderElian` (`/wondereilan/`)
- Pinterest board: `Yixiu: Nature Sounds & Sleep`
- Pin destination: `https://yixiu.wonderelian.com/underwater-white-noise-for-sleep/?utm_source=pinterest&utm_medium=organic_share&utm_campaign=scene_share&utm_content=underwater_white_noise_pinterest`

The public Pin returned HTTP 200 and its visible `Visit site` action resolved to the attributed Yixiu URL above. No other product board or site was modified.

## Release evidence

- PR: `https://github.com/Yonge6/yixiu-meditation/pull/44`
- Merge commit: `7188cdedbae6385ae06db8876d413fa5aee77da2`
- Release: `20260828-7188cde-deep-white-noise-1232`
- Archive: `/tmp/yixiu-20260828-7188cde-deep-white-noise-1232.tar.gz`
- Archive SHA-256: `ba02ce8bae7a5422728c365010b0e5829cd87f08e506a03a025a89d8dc8b8310`
- Server backup: `/srv/wonderelian/backups/yixiu-20260828-7188cde-deep-white-noise-1232`
- Landing-page SHA-256: `70514d7e4ddeeaf1e01226383c22ce3dd91cc7fb2f1fab8b5d9936fcb5e2e8cb`
- Sitemap SHA-256: `1b2ca83530ebabb5e55afe79ec0875fb2f4559687b240e022819360f31eef089`
- WebP SHA-256: `b86e2674371ba048eef4e01b09c24ab907b0a639bb0fda1e64af668f16a613ac`

Local, server and public hashes matched for the landing page, sitemap and WebP. Nginx configuration validation passed. The page and sitemap were submitted to IndexNow and returned HTTP 200.

## Acceptance and measurement boundary

- Protected mobile runtime: 28 files passed.
- Build: passed.
- Static-site tests: 27/27 passed.
- Playwright: 40/40 passed.
- Mobile visual QA: 390px wide, no horizontal overflow.
- Production behavior: selecting 15 minutes showed 15:00; playback changed to `Pause Underwater White Noise`; the timer reached 14:59; the post-preview download action retained `ppid`, `pt`, `ct` and `mt`.

The latest completed Beijing natural day remains 2026-08-27 with 14 GA4 active users, 20 page views and 15 sessions. The 100-UV completion gate is not met. The 2026-08-28 figures are partial-day data and cannot prove completion.
