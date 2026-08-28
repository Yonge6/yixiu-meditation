# Instagram Reset and Morning Birds Link-Path Optimizations — 2026-08-29

## Scope and decision

- Source: logged-in Instagram website in desktop Chrome.
- Account: WonderElian (`@wonderelian`).
- Existing Yixiu Reels:
  - One-Minute Reset: `https://www.instagram.com/wonderelian/reel/DcbIHxfNSO6/` — `82` displayed views.
  - Morning Birds Focus: `https://www.instagram.com/wonderelian/reel/Dch8MEetcmW/` — `69` displayed views.
- Both captions exposed plain-text attributed Yixiu destinations but did not direct viewers to the now-clickable profile link.
- The two existing Reels were improved without adding another post.

## Published changes

The One-Minute Reset caption now includes:

> Tap the Yixiu link in bio, then open One-Minute Reset. Or use the free reset:

Its existing attributed destination remains unchanged:

`https://yixiu.wonderelian.com/one-minute-reset/?utm_source=instagram&utm_medium=organic_reel&utm_campaign=one_minute_reset&utm_content=water_breathing_reel_01`

The Morning Birds caption now includes:

> Tap the Yixiu link in bio, then open Morning Bird Sounds for Focus. Or play the free session:

Its existing attributed destination remains unchanged:

`https://yixiu.wonderelian.com/morning-bird-sounds-for-focus/?utm_source=instagram&utm_medium=organic_reel&utm_campaign=focus_sounds&utm_content=morning_birds_focus_reel_03`

The original pacing guidance, product statements, App Store search instructions, sound-source statements, hashtags and generative-visual disclosures were retained. No media, audio, location, collaborator, paid promotion, cross-post, legal agreement, account setting or non-Yixiu destination was added or changed.

## Public verification

- After saving and reloading each Reel, its current section exposed `已编辑` and the exact matching link-in-bio sentence.
- Both current sections retained `AI 内容`, `原创音频` and their original UTM content identifiers.
- The authenticated profile exposed a clickable `yixiu.wonderelian.com` link with `utm_source=ig`, `utm_medium=social` and `utm_content=link_in_bio`; Instagram appended a transient `fbclid`.
- The public Reels grid still showed `82` views for One-Minute Reset and `69` for Morning Birds.
- The profile remained at `25` posts. No new post was created.

## Measurement boundary

These changes prove that two existing Yixiu Reels now provide explicit paths to the live Yixiu profile link. They do not prove profile-link clicks, H5 visits or App downloads.

The latest official completed-day GA4 readback for exact hostname `yixiu.wonderelian.com` remains `40` active users, `55` views and `47` sessions for `2026-08-28`, below the `100`-UV gate. Apple official data already proves `10` first-time downloads and `4` redownloads. Trial starts, paid conversions, subscriptions, in-app purchases, revenue, and a scalar `yixiu_download_click` result remain `null` where authoritative data is unavailable.
