# Instagram Mountain Wind Reel Link-Path Optimization — 2026-08-29

## Scope decision

- Source: logged-in Instagram website in desktop Chrome.
- Account: WonderElian (`@wonderelian`).
- The account's public Reels grid showed `207` views for `https://www.instagram.com/wonderelian/reel/DcAYpTdRNAX/`, but inspection proved that Reel promotes Style Atlas rather than Yixiu. It was closed without any edit, referral or other interaction.
- The next candidate was the Yixiu Mountain Wind Reel at `https://www.instagram.com/wonderelian/reel/DciPH83p_KW/`, with `180` displayed views.
- Its original caption exposed a plain-text attributed Yixiu URL but did not direct viewers to the now-clickable profile link.

## Published change

The Yixiu Mountain Wind caption now includes:

> Tap the Yixiu link in bio, then open Wind Sounds for Sleeping. Or listen free:

The existing attributed destination remains unchanged:

`https://yixiu.wonderelian.com/wind-sounds-for-sleeping/?utm_source=instagram&utm_medium=organic_reel&utm_campaign=sleep_sounds&utm_content=mountain_wind_sleep_reel_04`

The original real-mountain-wind description, App Store search instruction, hashtags and generative-visual disclosure were retained. No media, audio, location, collaborator, paid promotion, cross-post, legal agreement, account setting or non-Yixiu destination was added or changed.

## Public verification

- After saving and reloading, the current Reel section exposed `已编辑` and the exact new link-in-bio sentence.
- The same section retained `AI 内容`, `原创音频`, the mountain-wind source statement and the original `mountain_wind_sleep_reel_04` UTM content identifier.
- The authenticated profile exposed a clickable `yixiu.wonderelian.com` link with `utm_source=ig`, `utm_medium=social` and `utm_content=link_in_bio`; Instagram appended a transient `fbclid`.
- The profile remained at `25` posts. No new post was created.

## Measurement boundary

This change proves that the existing 180-view Yixiu Mountain Wind Reel now provides an explicit path to the live Yixiu profile link. It does not prove profile-link clicks, H5 visits or App downloads.

The latest official completed-day GA4 readback for exact hostname `yixiu.wonderelian.com` remains `40` active users, `55` views and `47` sessions for `2026-08-28`, below the `100`-UV gate. Apple official data already proves `10` first-time downloads and `4` redownloads. Trial starts, paid conversions, subscriptions, in-app purchases, revenue, and a scalar `yixiu_download_click` result remain `null` where authoritative data is unavailable.
