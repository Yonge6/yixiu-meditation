# Instagram Ocean Reel Link-Path Optimization — 2026-08-29

## Decision

- Source: logged-in Instagram website in desktop Chrome.
- Account: WonderElian (`@wonderelian`).
- Existing public Reel: `https://www.instagram.com/wonderelian/reel/DcbDOZ2Au_T/`.
- The account's public Reels grid showed `199` views for this four-day-old Ocean Focus Reel. The newer Ocean Focus Reel showed `9` views in the same current readback.
- The older Reel's original caption exposed only a plain-text Yixiu destination and an App Store search instruction. It did not tell viewers to use the now-clickable profile link.
- The existing Reel was therefore improved instead of publishing another duplicate Ocean post.

## Published change

The caption now includes:

> Tap the Yixiu link in bio, then open Ocean Waves for Focus. Or start the free session:

The existing attribution values remain unchanged:

`https://yixiu.wonderelian.com/ocean-waves-for-focus/?utm_source=instagram&utm_medium=organic_reel&utm_campaign=focus_sounds&utm_content=ocean_focus_reel_01`

The original product claims, App Store search instruction, Mixkit audio-license disclosure, hashtags and AI-content disclosure were retained. No media, audio, location, collaborator, paid promotion, cross-post, legal agreement, account setting or non-Yixiu destination was added or changed.

## Public verification

- After saving, waiting for Instagram's update and reloading, the current Reel section exposed `已编辑` and the exact new link-in-bio sentence.
- The same section retained `AI 内容`, the `Ocean Minds • Sea Waves and Ocean Horizon Ambience, Pt.4` audio attribution, and the original `ocean_focus_reel_01` UTM content identifier.
- The authenticated profile exposed a clickable `yixiu.wonderelian.com` link with `utm_source=ig`, `utm_medium=social` and `utm_content=link_in_bio`; Instagram appended a transient `fbclid`.
- The public Reels grid still showed `199` views for this Reel, and the account remained at `25` posts. No new post was created.

## Measurement boundary

This change proves that an existing high-reach Yixiu Reel now provides an explicit path to the live Yixiu profile link. It does not prove profile-link clicks, H5 visits or App downloads.

The latest official completed-day GA4 readback for exact hostname `yixiu.wonderelian.com` remains `40` active users, `55` views and `47` sessions for `2026-08-28`, below the `100`-UV gate. Apple official data already proves `10` first-time downloads and `4` redownloads. Trial starts, paid conversions, subscriptions, in-app purchases, revenue, and a scalar `yixiu_download_click` result remain `null` where authoritative data is unavailable.
