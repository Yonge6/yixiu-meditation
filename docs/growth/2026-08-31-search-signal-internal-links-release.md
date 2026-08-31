# Yixiu search-signal internal links — 2026-08-31

## Decision evidence

Google Search Console's three-month Web report, with the latest available data dated 2026-08-28, showed 0 clicks, 13 impressions, 0% CTR and an average position of 24.5. Query rows were hidden because there was not enough query data to display, so this release does not guess at query wording or rewrite titles from an unsupported keyword assumption.

The page-level report showed two existing pages with the strongest visible signal:

- `/thunderstorm-sounds-for-sleep/`: 4 impressions, 0 clicks and page-specific average position 9.3.
- `/waterfall-sounds-for-noise-masking/`: 4 impressions, 0 clicks and page-specific average position 44.8.

The scoped response was to add one descriptive contextual link to each page from the existing `/free-online-sound-machine/` hub, beside the matching Distant Thunder and Forest Waterfall previews. The same two canonical URLs were added to the hub's structured `ItemList`. No duplicate landing page, speculative title change, new claim or other-product referral was introduced.

## Source and release

- Implementation PR: https://github.com/Yonge6/yixiu-meditation/pull/192
- Merged source commit: `cc3dd3b23b3e2e5929469f196603aad8934b0df8`
- Release ID: `20260831-cc3dd3b-search-links-1144`
- Deployment receipt: `DEPLOY_OK_YIXIU_20260831-cc3dd3b-search-links-1144`
- Release archive: `/tmp/yixiu-20260831-cc3dd3b-search-links-1144.tar.gz`
- Release archive SHA-256: `ee4f8994d24314629c1072095d145a38f53f25e846554755aa74b7e62d8a25b8`
- Server backup: `/srv/wonderelian/backups/yixiu-20260831-cc3dd3b-search-links-1144`
- Retained server artifacts: `/srv/wonderelian/backups/yixiu-20260831-cc3dd3b-search-links-1144/release-artifacts`
- Guarded deployment validated Nginx before activation and retained the previous production tree in the backup above.

## Verification

Local verification passed before merge and release:

- protected runtime integrity: 28 files
- static site tests: 44/44
- production build
- targeted contract and deploy tests: 2/2
- deploy script shell syntax
- `git diff --check`
- mobile Chrome QA at 390 x 844: no visible clipping or overflow; Distant Thunder changed to the pressed `Pause Distant Thunder` state; both contextual links opened their intended page and H1.

Production acceptance used a cache-busted URL and returned HTTP 200. The page exposed 10 playable previews, both visible guide links exactly once, both structured `ItemList` URLs, and `discover.css?v=20260831-search-links`.

Clean-build, server and public SHA-256 values matched:

| Asset | SHA-256 |
| --- | --- |
| `/free-online-sound-machine/index.html` | `72bd44f766ef8da9f84d266006857898576531372af6b2d04d47a260561c62f7` |
| `/discover.css` | `ed2563b48f4ca473b44265d54875edeb2594bc8d7a8012ee2a4fe66575f0b9f4` |

Desktop Chrome production readback confirmed both links in the rendered DOM. Distant Thunder entered its playing/pressed state, the thunder link opened `/thunderstorm-sounds-for-sleep/` with the expected H1, and the waterfall link opened `/waterfall-sounds-for-noise-masking/` with the expected H1. The production console error log was empty.

After production acceptance, one IndexNow request submitted exactly these three Yixiu URLs and returned HTTP 200 with an empty response body:

- `https://yixiu.wonderelian.com/free-online-sound-machine/`
- `https://yixiu.wonderelian.com/thunderstorm-sounds-for-sleep/`
- `https://yixiu.wonderelian.com/waterfall-sounds-for-noise-masking/`

The existing Google sitemap had already been successfully resubmitted on 2026-08-31, and the new hub URL had already been accepted into Google's priority crawl queue after a successful live indexability test. Neither action was duplicated because Search Console states that repeat requests do not improve queue priority. IndexNow and Search Console receipts prove discovery requests only, not crawling, indexing, ranking, impressions, clicks, visitors or downloads.

## Growth boundary

The latest accepted complete Beijing natural day remains 2026-08-30: exact hostname `yixiu.wonderelian.com` recorded 13 UV, 24 views, 15 sessions and 2 CTA events. The 100-UV gate is still short by 87.

Apple's latest verified official boundary remains through 2026-08-29: 11 first-time downloads and 4 redownloads. Campaign-attributed H5 visits, sessions, downloads, trials, payments, subscriptions, IAP and revenue for this release remain `null` until authoritative data is available. The overall goal is not complete.

Only Yixiu code, Yixiu production and Yixiu discovery endpoints were touched.
