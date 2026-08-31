# Yixiu sound-machine first-play release — 2026-08-31

## Decision evidence

The exact-hostname GA4 Data API was refreshed before implementation. For the incomplete `2026-08-31` Beijing day, `/free-online-sound-machine/` returned seven active users, six session starts and six first visits, but only one active user triggered `yixiu_playback_start` on that page. These partial-day counts are directional diagnostics, not a completed-day conversion rate or growth result.

The page's primary hero action was an in-page `Choose a sound` jump. Listening required a scroll and a second choice. Three options were compared: direct hero playback, moving the entire sound grid above the timer, and autoplay. The selected treatment adds one user-initiated Window Rain preview to the hero while retaining a secondary route to all 10 recordings. It removes one step without autoplay, a new recording, an account gate, a membership promise or a medical claim.

Google Search Console was also checked before selection. Waterfall's four impressions were at page-specific average position 44.8 and had already received a contextual internal link earlier the same day. Its title was therefore not rewritten from absent query data, and no duplicate Google indexing request was made.

## Source and behavior

- Implementation PR: https://github.com/Yonge6/yixiu-meditation/pull/208
- Merge commit: `05c6425ffdff20cf951f85ed4c519f0a93ecc09e`
- Canonical: https://yixiu.wonderelian.com/free-online-sound-machine/
- Hero action: `Play Window Rain`
- Real recording: `/assets/yixiu/audio/light-rain.m4a`
- Analytics placement: `sound_machine_hero_rain`
- Choice path: `Browse all 10 sounds` → `#sounds`

The hero preview uses the existing one-player controller, 30-minute default timer, post-play iPhone continuation, native/clipboard sharing and Pinterest action. The page now has 11 preview controls backed by 10 unique recordings because Window Rain appears both as the fast hero default and in the full comparison collection. Starting another card stops the hero instance and switches cleanly.

## Verification

Local and clean-merge verification passed:

- protected mobile runtime integrity: 28 files
- static site acceptance: 44/44
- focused Playwright hero-play/switch test: pass at 390×844
- production build from the exact merge commit: pass
- deploy script shell syntax and `git diff --check`: pass

Desktop Chrome local verification started Window Rain, changed the hero to pressed `Pause Window Rain`, advanced the timer to `29:59`, exposed one share control and showed no horizontal overflow. Production Chrome independently returned the exact title and H1, changed the same control to pressed `Pause Window Rain`, advanced the timer, exposed the share panel and retained the `#sounds` browse path.

## Production release

- Release ID: `20260831-05c6425-sound-first-play-1425`
- Deployment receipt: `DEPLOY_OK_YIXIU_20260831-05c6425-sound-first-play-1425`
- Archive SHA-256: `6c2882aaed4be25072d320b1e9c7e9c62b8a79322ce38edf59e83a56c4cb805e`
- Rollback backup: `/srv/wonderelian/backups/yixiu-20260831-05c6425-sound-first-play-1425`
- Retained artifacts: `/srv/wonderelian/backups/yixiu-20260831-05c6425-sound-first-play-1425/release-artifacts`

The guarded server deployment validated the archive hash and paths, staged content, Nginx syntax, reload, deployed files and loopback HTTPS before returning success. The stage was removed and the previous production tree plus the exact archive and deploy script were retained.

Public acceptance returned HTTP 200 for the page and stylesheet and HTTP 206 for a Window Rain byte-range request. The page exposed the hero placement, browse path, new stylesheet version and exactly 11 preview controls.

Clean-build, server and public SHA-256 values matched:

| Asset | SHA-256 |
| --- | --- |
| `/free-online-sound-machine/index.html` | `b197ead26898ab0aa1247166278c2bd667992205bb394fd749cd4c8c59279a2c` |
| `/discover.css` | `e996331d61696e1e3650393b21b844ccdb0199a42f2bfa277da0e0a8d4e44003` |

After production acceptance, a verified IndexNow request submitted the changed canonical and returned HTTP 200 with an empty body. The first local receipt-capture command used zsh's reserved `status` variable after invoking curl, so one identical retry was required to capture the HTTP code. No additional Google priority-crawl request was made because this canonical had already entered that queue earlier the same day.

## Measurement boundary

The latest accepted complete Beijing natural day remains `2026-08-30`:

- exact hostname `yixiu.wonderelian.com`: 13 active users, 24 page views and 15 sessions
- recorded CTA events: 2
- gap to the 100-UV gate: 87

Apple's latest verified official boundary remains through `2026-08-29`: 11 first-time downloads and 4 redownloads. Campaign-attributed H5 visits, sessions, downloads, trials, paid conversions, subscriptions, IAP and revenue for this release remain `null` until authoritative data appears. The overall growth goal remains active.

Only Yixiu source, Yixiu production, its exact GA4/Search Console property and its discovery endpoint were touched.
