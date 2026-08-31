# Free online sound machine growth release — 2026-08-31

## Purpose

Add one useful, crawlable English entry point for people looking for a free online sound machine rather than a single named sound. The page uses existing Yixiu recordings and the existing browser timer; it does not promise sleep, focus, meditation, productivity or medical outcomes.

## Release surface

- Canonical URL: `https://yixiu.wonderelian.com/free-online-sound-machine/`
- Search intent: `free online sound machine`, with supporting terms for nature sounds, white noise and a timer.
- Direct utility: 10 real browser-playable recordings and 15-, 30- and 60-minute timer controls.
- App Store attribution: shared H5 partner/campaign parameters `pt=120014121`, `ct=yixiu_h5_20260827`, `mt=8`.
- Discovery: linked from `/guides/`, listed in `/sitemap.xml` and described in `/llms.txt`.
- Public App Store structured-data version corrected from stale `1.4` to the currently released `1.5`. Version `1.6` is not represented as public while it remains in review.

## Starting measurement boundary

The latest accepted complete Beijing natural day is `2026-08-30`.

- Exact hostname `yixiu.wonderelian.com`: `13` users, `24` views, `15` sessions and `2` CTA events.
- The 100-UV gate is not met; the gap is `87` UV.
- Apple official Analytics through `2026-08-29`: `11` first-time downloads and `4` redownloads.
- Apple campaign acquisition reporting states that there is insufficient data to display campaigns.
- Campaign-attributed downloads, trials, paid conversions, subscriptions, IAP and revenue: `null`.

Publication and page availability are not evidence of new visits or downloads. The next outcome check must use a later complete Beijing natural day and official Apple reporting.

## Official YouTube Community readback

The already scheduled WonderElian Community post became public on `2026-08-31`:

- Public URL: `https://www.youtube.com/post/Ugkxt0JQave_emwDpEuQx1cshRQYxXIrgn_v`
- Anonymous response: HTTP `200`.
- Public HTML includes the WonderElian identity, sleep-sound comparison copy, the H5 attribution values `youtube / organic_social / sleep_sounds / community_sleep_sound_comparison_05`, and Apple campaign `yixiu_youtube_sleep_compare_20260831`.

This public readback proves publication only. H5 sessions and campaign-attributed Apple outcomes from this post remain `null` until authoritative data is available.

## Verification gates

- Production build succeeds.
- Site acceptance suite succeeds, including the 10 unique audio files, timer controls, metadata length, schema, crawl links and App Store attribution.
- Desktop Chrome mobile-width visual and interaction check succeeds.
- Production URL returns HTTP `200` and the expected canonical, H1, 10 playable recordings and analytics placement after deployment.
- IndexNow submission is attempted only after the production URL is live; its platform response is recorded separately from ranking or traffic outcomes.
