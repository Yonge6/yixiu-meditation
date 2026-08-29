# White Noise Black Screen Search Release

## Scope and search decision

- Canonical landing page: `https://yixiu.wonderelian.com/underwater-white-noise-for-sleep/`
- Search intent: `white noise black screen`, `white noise no ads` and `white noise sleep timer`
- Product scope: Yixiu H5 and the Yixiu App Store listing only

Current search results grouped a black screen, uninterrupted playback and a sleep timer into one user intent. The release therefore strengthened the existing Underwater White Noise canonical instead of creating a competing `/white-noise-black-screen/` URL. A new duplicate route was rejected because it would split relevance and risk cannibalization. A multi-sound mixer was also rejected because it added complexity without improving the selected sleep intent. No Maker, OneLaser, Wendao, Style Atlas or other product was modified or used for traffic.

Search-volume estimates were not available from an authoritative first-party source, so this release does not claim a keyword volume, ranking or traffic result.

## Public artifact

- Page title: `White Noise Black Screen for Sleep — Free, No Ads | Yixiu`
- H1: `White noise with a black screen for sleep.`
- Audio: the existing real `underwater-white-noise.m4a` asset
- Controls: Play/Pause, Black Screen and 15/30/60-minute timer
- App Store placements: `underwater_white_noise_landing` and `underwater_white_noise_after_preview`
- App Store attribution: the existing Sleep custom-product-page identifier plus the existing Yixiu campaign parameters

The Black Screen control stays disabled until playback starts. It then opens a full-viewport black overlay while the real preview and countdown continue; clicking the overlay or pressing Escape returns to the page and restores focus. Copy explicitly distinguishes the in-browser black screen from physical iPhone lock-screen playback. The page promises no ads, account, music or talking on this web preview, but makes no treatment, guaranteed-sleep, ranking or download claim. Its visible FAQ and FAQ JSON-LD match exactly.

The shared player runtime now derives its status from each page's actual audio label. Existing Window Rain still announces `Window Rain is playing`, while this page announces `Underwater White Noise is playing`.

## Test and visual acceptance

- Focused static test: failed on the old title, then passed after the implementation.
- Focused Playwright test: failed while the Black Screen control was absent, then passed after the implementation.
- Existing Window Rain dark-screen regression: passed.
- Protected mobile runtime integrity: 28/28 files passed.
- Static-site tests: 33/33 passed.
- Production build: passed.
- Full Playwright suite: 49/49 passed.
- Local mobile acceptance: 390×844, no horizontal overflow; both primary buttons were approximately 343×52; the overlay was exactly 390×844 and black.
- Production desktop acceptance: exact title, H1 and canonical; no horizontal overflow; playback changed to Pause; the 30-minute timer advanced; the post-preview App Store action appeared; the black overlay was exactly 1824×1190 with RGB `0,0,0`; Escape hid it, restored focus and left playback/timer running.

## Code and deployment evidence

- Feature pull request: `https://github.com/Yonge6/yixiu-meditation/pull/119`
- Feature commit: `b675042`
- Feature merge commit: `25e2ed519ed10578f614e6806452a524a15a2b5c`
- Deploy-guard pull request: `https://github.com/Yonge6/yixiu-meditation/pull/120`
- Deploy-guard commit: `346622b`
- Deployed source merge commit: `3e1b83af1db0078b371529f0c01685ad8209a287`
- Release: `20260829-3e1b83a-white-noise-black-screen-1613`
- Archive: `/tmp/yixiu-20260829-3e1b83a-white-noise-black-screen-1613.tar.gz`
- Archive SHA-256: `e0611116d5d37f4b33e3b21a71ecef45a29354f84e97e81a7ac735932e92ad83`
- Server backup: `/srv/wonderelian/backups/yixiu-20260829-3e1b83a-white-noise-black-screen-1613`

The deployment returned `DEPLOY_OK_YIXIU_20260829-3e1b83a-white-noise-black-screen-1613` and `DEPLOY_EXTRA_OK_YIXIU_20260829-3e1b83a-white-noise-black-screen-1613`. Nginx configuration and reload passed. The release archive and deployment metadata are retained in the server backup under `release-artifacts/`.

Verified build/server/public SHA-256 values:

- Underwater page: `70463f5e9a38b1c1a832df972de03d23f5dc245028145e892c409a3ded41a869`
- Shared runtime: `9dd277febd9b84185d979db7b3f874ce680c5dd8c943b25b3f663cefb46bc5d6`
- Guides: `20e249d5e4df3db88b0bffacd05a7687d5bc6875f44bd3a6e768e0ab6460879f`
- `llms.txt`: `6b894f1a40d2e0867d4f884944c78667f99235d98f56b670066e1926d387b9c8`
- Sitemap: `6c693e01d0691f4e0ab02d223c7839a19f3b8390efe6b40a4ca9f0bc1e2a65b2`
- Underwater audio: `4dfa55b7799ba9ab1c9d849154f9c17e687dce71738dc5495f49b9288aaaba80`

The public audio also passed an HTTP byte-range request with status 206 and `audio/mp4`.

## Search discovery receipts

- IndexNow accepted exactly one request for the canonical page, Guides, Sleep Sounds, `llms.txt` and sitemap with HTTP 200.
- Google Search Console showed the canonical as already indexed and served over HTTPS before the request.
- Exactly one Request Indexing action was submitted; Google confirmed that the URL was added to the priority crawl queue.

These are submission and index-state receipts only. They do not prove a new crawl, ranking, impression, click or visitor caused by this release.

## Authoritative measurement boundary

GA4 Data API, filtered to exact hostname `yixiu.wonderelian.com`:

- Latest verified completed Beijing natural day, 2026-08-28: 26 active users, 41 page views and 33 sessions.
- Incomplete 2026-08-29 at the read time: 13 active users, 22 page views and 20 sessions.
- Completed-day gap to the required 100 UV: 74.

The incomplete-day values include diagnostic activity and are not an acquisition result. No Underwater landing-page row was present at the read time, so this release has no attributable traffic result yet.

The latest retained Apple official evidence proves 10 first-time downloads and 4 redownloads through 2026-08-26. A refresh attempt on 2026-08-29 reached App Store Connect in the authorized desktop Chrome session, but the analytics route then returned `authResult=FAILED` and required a new login. Therefore this document does not present those retained values as a newly refreshed snapshot. Trials, paid conversions, subscriptions, in-app purchases, revenue and campaign-specific downloads remain `null`; missing Apple data is not converted to zero.

Apple's download half of the goal is proven by the retained official evidence. The completed-day H5 requirement is not met: 26 is below 100. The overall growth goal remains active.
