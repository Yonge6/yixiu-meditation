# Yixiu YouTube Wind Short comment download path — 2026-08-31

## Public asset

- Short: `https://www.youtube.com/shorts/iMG8YanRAnA`
- Regular watch URL: `https://www.youtube.com/watch?v=iMG8YanRAnA`
- Title: `Wind Sounds for Sleeping — Mountain Air, No Music`
- Public readback at the time of optimization: 160 views, 1 like and 1 comment
- Comment ID: `UgwkMb1EOqwVwqA1zhh4AaABAg`
- Permanent comment URL: `https://www.youtube.com/watch?v=iMG8YanRAnA&lc=UgwkMb1EOqwVwqA1zhh4AaABAg`

The existing WonderElian comment already linked to the full Yixiu Mountain Wind session. The H5 link rendered as an anchor and used:

`youtube / organic_comment / sleep_sounds / mountain_wind_short_comment_01`

The iPhone instruction previously required a manual App Store search.

## Change and readback

At approximately 2026-08-31 12:09 GMT+8, the same comment was edited in place to read:

```text
Want the longer version? Play the free Mountain Wind session in Yixiu:
https://yixiu.wonderelian.com/wind-sounds-for-sleeping/?utm_source=youtube&utm_medium=organic_comment&utm_campaign=sleep_sounds&utm_content=mountain_wind_short_comment_01

Continue on iPhone:
https://apps.apple.com/us/app/yixiu-white-noise-sleep/id1461182261?ppid=67cb8784-2b16-4849-b940-90fdf4d99752&pt=120014121&ct=yixiu_yt_wind_comment_20260831&mt=8

No account. No ads.
```

YouTube's authenticated DOM then proved all of the following:

- the comment kept its original comment ID and became `2天前（修改过）`;
- the H5 URL rendered as a YouTube redirect anchor with the complete UTM in its `q` destination;
- the App Store URL rendered as a YouTube redirect anchor with `ppid=67cb8784-2b16-4849-b940-90fdf4d99752`, provider token `120014121` and campaign `yixiu_yt_wind_comment_20260831`;
- after the edit, the WonderElian creator heart was restored and the control changed to `移除红心`.

A logged-out request to the permanent comment URL returned HTTP 200 and contained the Short title, the revised opening line, `mountain_wind_short_comment_01` and `yixiu_yt_wind_comment_20260831`.

Following the H5 anchor's actual YouTube redirect opened the exact attributed production URL, kept its query, returned the title `Wind Sounds for Sleeping — Mountain Air, No Music | Yixiu`, and rendered the H1 `Wind sounds for sleeping, with the whole mountain left outside.`

The App Store anchor is the official US custom-product-page URL. From the current China network/storefront, following it localized to Apple China's Today page instead of the app detail page. This is not generalized into a global failure or success claim. Apple's official US Lookup API independently returned one matching app, `Yixiu: White Noise & Sleep`, bundle `com.health.yixiu`, version `1.5`; the China Lookup API also returned one result. The campaign link remains targeted at the English/US acquisition audience, and campaign downloads remain unclaimed until Apple reports them.

## Verification boundary

Adding a related video and pinning the comment were both blocked by YouTube's one-time advanced-feature verification dialog. Both dialogs were cancelled. No verification was attempted and no related video or pin state was saved.

The latest accepted authoritative growth boundary remains unchanged:

- complete Beijing natural day: 2026-08-30;
- exact hostname `yixiu.wonderelian.com`: 13 UV, 24 views, 15 sessions and 2 CTA events;
- gap to the 100-UV gate: 87;
- Apple official data through 2026-08-29: 11 first-time downloads and 4 redownloads;
- comment-attributed H5 users, sessions, downloads, trials, payments, subscriptions, IAP and revenue: `null`.

This release proves a shorter clickable conversion path, not a visit or download. The overall goal remains active. Only the Yixiu Short/comment, Yixiu destinations and Yixiu evidence files were touched.
