# Instagram Rain Window Reel Link-Path Optimization — 2026-08-29

## Decision

- Source: logged-in Instagram website in desktop Chrome.
- Account: WonderElian (`@wonderelian`).
- Existing public Yixiu Reel: `https://www.instagram.com/wonderelian/reel/DckkNoIwNmo/`.
- The account's public Reels grid showed `110` views for this Rain Window sleep Reel in the latest readback.
- Its original caption exposed a plain-text attributed Yixiu URL and an App Store search instruction, but did not direct viewers to the now-clickable profile link.
- The existing Reel was improved without adding another post.

## Published change

The caption now includes:

> Tap the Yixiu link in bio, then open Sleep Sounds. Or start the free 15, 30 or 60-minute timer:

The existing attributed destination remains unchanged:

`https://yixiu.wonderelian.com/sleep-sounds/?utm_source=instagram&utm_medium=organic_reel&utm_campaign=sleep_sounds&utm_content=rain_window_sleep_reel_04`

The original real-rain description, App Store search instruction, hashtags and generative-visual disclosure were retained. No media, audio, location, collaborator, paid promotion, cross-post, legal agreement, account setting or non-Yixiu destination was added or changed.

## Public verification

- After saving and reloading, the current Reel section exposed `已编辑` and the exact new link-in-bio sentence.
- The same section retained `AI 内容`, `原创音频`, the Light Rain source statement and the original `rain_window_sleep_reel_04` UTM content identifier.
- The authenticated profile exposed a clickable `yixiu.wonderelian.com` link with `utm_source=ig`, `utm_medium=social` and `utm_content=link_in_bio`; Instagram appended a transient `fbclid`.
- The profile remained at `25` posts. No new post was created.

## Measurement boundary

This change proves that an existing 110-view Yixiu Rain Window Reel now provides an explicit path to the live Yixiu profile link. It does not prove profile-link clicks, H5 visits or App downloads.

The latest official completed-day GA4 readback for exact hostname `yixiu.wonderelian.com` remains `40` active users, `55` views and `47` sessions for `2026-08-28`, below the `100`-UV gate. Apple official data already proves `10` first-time downloads and `4` redownloads. Trial starts, paid conversions, subscriptions, in-app purchases, revenue, and a scalar `yixiu_download_click` result remain `null` where authoritative data is unavailable.
