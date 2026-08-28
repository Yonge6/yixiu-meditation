# Rain Sounds for Studying Search Release

## Public artifact

- Landing page: `https://yixiu.wonderelian.com/rain-sounds-for-studying/`
- Search intent: `rain sounds for studying`
- Audio: real Yixiu Light Rain recording, AAC stereo, 96 seconds
- Preview analytics placement: `rain_studying_preview`
- App Store placements: `rain_studying_landing` and `rain_studying_after_preview`
- App Store attribution: focus custom-product-page identifier plus `pt=120014121`, `ct=yixiu_h5_20260827` and `mt=8`

The page answers the query before the first action, plays the existing licensed Light Rain recording in one tap, avoids music, narration and performance guarantees, and links only to Yixiu listening paths. No other product or site was modified.

## Search discovery

- Guides now exposes a dedicated Rain Sounds for Studying card and a 16-item aligned `ItemList`.
- Contextual links were added from Rain Sounds for Reading, River Sounds for Studying and Best Nature Sounds for Studying.
- The sitemap includes the new canonical URL with `lastmod` `2026-08-28`.
- IndexNow accepted the new page, Guides, the three updated adjacent pages and sitemap with HTTP 200.

## Release evidence

- Pull request: `https://github.com/Yonge6/yixiu-meditation/pull/49`
- Merge commit: `dd4edbfad00d993cba3aa779a54803e5726f9def`
- Release: `20260828-dd4edbf-rain-study-1336`
- Archive: `/tmp/yixiu-20260828-dd4edbf-rain-study-1336.tar.gz`
- Archive SHA-256: `8f7504d8d299c285e8c9922172ea5063b1f65e2cf28075f3ab4a8a5dd4830dad`
- Server backup: `/srv/wonderelian/backups/yixiu-20260828-dd4edbf-rain-study-1336`
- Landing-page SHA-256: `62961b03e796daa2b8630609abf32f3532a030593802e3a8306a62d630a1580e`
- Guides SHA-256: `a8a36ceb47654601d037d55395878f0afa8c63c4ccc74092ed19f72be517b397`
- Sitemap SHA-256: `3207cc327cf9dde658731e58dfde0f677780e4fc317766f500ff9f6da4a43759`
- Light Rain SHA-256: `83ecb47191fe8901a83a31ecec65c17bef9f3ea8f35727e6869c29900099e46d`

Local, server and public hashes matched for the landing page, Guides, sitemap and audio. Nginx validation passed, the deploy returned `DEPLOY_OK_YIXIU_20260828-dd4edbf-rain-study-1336`, and the public page returned HTTP 200.

## Acceptance and measurement boundary

- Protected mobile runtime: 28 files passed.
- Build: passed.
- Static-site tests: 28/28 passed.
- Playwright: 41/41 passed.
- Production browser: the preview button switched to its playing state, the post-preview CTA appeared, the real audio request returned HTTP 206 `audio/mp4`, and 390px had no horizontal overflow.
- PageSpeed Insights: official API quota was exhausted, so no current performance score is claimed.

The latest verified completed Beijing natural day remains 2026-08-27 with 14 GA4 active users, 20 page views and 15 sessions. This is below the 100-UV gate. Apple official data already proves 10 first-time downloads through 2026-08-26; trials, paid conversions, subscriptions, in-app purchases and revenue remain `null` where Apple showed insufficient data. The overall growth goal is therefore still active.
