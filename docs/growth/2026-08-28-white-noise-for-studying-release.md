# White Noise for Studying Search Release

## Public artifact

- Landing page: `https://yixiu.wonderelian.com/white-noise-for-studying/`
- Search intent: `white noise for studying`
- Audio: Yixiu Underwater Echo, AAC stereo, 4.98 seconds, looped by the existing player
- Preview analytics placement: `white_noise_studying_preview`
- App Store placements: `white_noise_studying_landing` and `white_noise_studying_after_preview`
- App Store attribution: Focus custom-product-page identifier plus `pt=120014121`, `ct=yixiu_h5_20260827` and `mt=8`

The page answers the query before the first action, plays Yixiu's existing licensed underwater white-noise recording, offers a 15/30/60-minute browser timer, and avoids universal focus, memory, ADHD, treatment, rating or performance claims. It links only to other Yixiu listening paths; no other product or site was modified.

## Search discovery

- Guides now exposes a dedicated White Noise for Studying card and a 17-item aligned `ItemList`.
- Contextual links were added from the Focus hub, Underwater White Noise for Sleep, River Sounds for Studying and Best Nature Sounds for Studying.
- The sitemap includes the canonical URL with `lastmod` `2026-08-28` and updates Guides to the same date.
- IndexNow accepted the new page, Guides, four updated adjacent pages and sitemap with HTTP 200.

## Release evidence

- Pull request: `https://github.com/Yonge6/yixiu-meditation/pull/51`
- Merge commit: `72f327010c12f63dc98e8d6e82d1b348788eb0c9`
- Release: `20260828-72f3270-white-noise-study-1356`
- Archive: `/tmp/yixiu-20260828-72f3270-white-noise-study-1356.tar.gz`
- Archive SHA-256: `97acda5bc4af60309a3a7fbcb1cc9ac59f9de14f91133dbeb22d232fb51c8893`
- Server backup: `/srv/wonderelian/backups/yixiu-20260828-72f3270-white-noise-study-1356`
- Landing-page SHA-256: `6636288fa8c8eb29fe953e39a8751e052b4284b8e5fb4120fdd3f8b9373959eb`
- Guides SHA-256: `bb94e3a39eca22e5d33d4a21564601cb486b6237f687e584686f216e92707578`
- Sitemap SHA-256: `daf6d1a6fbb2e6c132d07161d84cdaca18e73223b0c77025ab62a56a38969a48`
- Underwater Echo audio SHA-256: `4dfa55b7799ba9ab1c9d849154f9c17e687dce71738dc5495f49b9288aaaba80`

Local build, server and public hashes matched for the landing page, Guides, sitemap and audio. Nginx validation passed, the deploy returned `DEPLOY_OK_YIXIU_20260828-72f3270-white-noise-study-1356`, and the public page returned HTTP 200.

## Acceptance and measurement boundary

- Protected mobile runtime: 28 files passed.
- Build: passed.
- Static-site tests: 29/29 passed.
- Playwright: 42/42 passed.
- Mobile visual QA: 390px full-page inspection, with no horizontal overflow.
- Production browser: the preview changed to its playing state, the 30-minute timer advanced to `29:58 remaining`, the post-preview download action appeared, and the real audio request returned HTTP 206 with `audio/mp4`.

The latest verified completed Beijing natural day remains 2026-08-27 with 14 GA4 active users, 20 page views and 15 sessions. This is below the 100-UV gate. Apple official data already proves 10 first-time downloads through 2026-08-26; trials, paid conversions, subscriptions, in-app purchases and revenue remain `null` where Apple showed insufficient data. The overall growth goal is therefore still active.

