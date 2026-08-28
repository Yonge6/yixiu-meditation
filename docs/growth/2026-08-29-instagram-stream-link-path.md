# Instagram Mountain Stream Reel Link-Path Optimization — 2026-08-29

## Scope decision

- Source: logged-in Instagram website in desktop Chrome.
- Account: WonderElian (`@wonderelian`).
- Target: the existing Yixiu Mountain Stream Reel at `https://www.instagram.com/wonderelian/reel/Dch6vZTRQR5/`, with `39` displayed views at inspection time.
- Its original caption exposed a plain-text attributed Yixiu URL but did not direct viewers to the clickable profile link.

## Published change

The Yixiu Mountain Stream caption now includes:

> Tap the Yixiu link in bio, then open Mountain Stream Sounds for Focus. Or play the free session:

The existing attributed destination remains unchanged:

`https://yixiu.wonderelian.com/mountain-stream-sounds-for-focus/?utm_source=instagram&utm_medium=organic_reel&utm_campaign=focus_sounds&utm_content=mountain_stream_focus_reel_02`

The original focus-use description, App Store search instruction, hashtags, AI label and audio-source disclosure were retained. No media, audio, location, collaborator, paid promotion, cross-post, legal agreement, account setting or non-Yixiu destination was added or changed.

## Public verification

- After saving and reloading, the current Reel section exposed `已编辑` and the exact new link-in-bio sentence.
- The same section retained `AI 内容`, `原创音频`, the Mountain Stream audio statement and the original `mountain_stream_focus_reel_02` UTM content identifier.
- The authenticated profile exposed a clickable `yixiu.wonderelian.com` link with `utm_source=ig`, `utm_medium=social` and `utm_content=link_in_bio`; Instagram appended a transient `fbclid`.
- The profile remained at `25` posts. No new post was created.

## Measurement boundary

This change proves that the existing 39-view Yixiu Mountain Stream Reel now provides an explicit path to the live Yixiu profile link. Reel views do not prove profile-link clicks, H5 visits or App downloads.

The latest official completed-day GA4 readback for exact hostname `yixiu.wonderelian.com` remains `40` active users, `55` views and `47` sessions for `2026-08-28`, below the `100`-UV gate. Apple official data already proves `10` first-time downloads and `4` redownloads. Trial starts, paid conversions, subscriptions, in-app purchases, revenue, and a scalar `yixiu_download_click` result remain `null` where authoritative data is unavailable.
