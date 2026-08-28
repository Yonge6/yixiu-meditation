# Instagram Thunder Reel Link-Path Optimization — 2026-08-29

## Decision

- Source: logged-in Instagram website in desktop Chrome.
- Account: WonderElian (`@wonderelian`).
- Existing public Reel: `https://www.instagram.com/wonderelian/reel/Dcgo1SNO-QF/`.
- The Reel had `199` displayed views in the latest cross-Reel readback, tying the best-performing recent Yixiu Reel and exceeding the two newly published Reels.
- Its original caption predated the clickable Yixiu profile link and exposed only a plain-text destination plus an App Store search instruction.
- Rather than publish another same-night post, the existing caption was updated to send its accumulated audience to the now-clickable Yixiu link in bio.

## Published change

The caption now includes:

> Tap the Yixiu link in bio, then open Thunderstorm Sounds for Sleep. Or listen free:

The existing attributable destination remains unchanged:

`https://yixiu.wonderelian.com/thunderstorm-sounds-for-sleep/?utm_source=instagram&utm_medium=organic_reel&utm_campaign=sleep_sounds&utm_content=distant_thunder_reel_01`

No media, audio, hashtags, location, collaborator, paid promotion, cross-post, AI disclosure, account setting, legal agreement or non-Yixiu destination was added or changed.

## Public verification

- After saving and reloading, the logged-in public Reel DOM exposed `已编辑` and the exact new link-in-bio sentence.
- The public Reel remained under `wonderelian`, retained the `AI 内容` label and `原创音频`, and kept the original Yixiu UTM destination.
- The authenticated `@wonderelian` profile exposed a clickable `yixiu.wonderelian.com` link routed to `http://yixiu.wonderelian.com/` with `utm_source=ig`, `utm_medium=social` and `utm_content=link_in_bio`; Instagram appended a transient `fbclid`.
- The profile had `25` posts, so this optimization did not add a new post or increase publishing cadence.

## Measurement boundary

This change proves that the strongest recent Thunder Reel now has an explicit path to a live Yixiu profile link. It does not prove that viewers clicked the profile link, reached the H5, or downloaded the App.

The latest official completed-day GA4 readback for the exact hostname `yixiu.wonderelian.com` remains `40` active users, `55` views and `47` sessions for `2026-08-28`, below the `100`-UV gate. Apple official data already proves `10` first-time downloads and `4` redownloads. Trial starts, paid conversions, subscriptions, in-app purchases, revenue, and a scalar `yixiu_download_click` result remain `null` where authoritative data is unavailable.
