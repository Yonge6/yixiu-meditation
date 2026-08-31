# Yixiu YouTube Short comment download-path batch — 2026-08-31

## Public assets and changes

At approximately 2026-08-31 12:16–12:21 GMT+8, four existing WonderElian comments were edited in place. No new video or comment was created.

| Short | Public views | Comment ID | Preserved H5 content | App Store routing | Apple campaign |
| --- | ---: | --- | --- | --- | --- |
| `qhiCegeDFUQ` — Rain on Window for Sleep — No Music, No Talking | 17 | `UgxauHW9f1GOBXc50lZ4AaABAg` | `rain_window_sleep_short_07_comment` | Sleep CPP `67cb8784-2b16-4849-b940-90fdf4d99752` | `yixiu_yt_rain07_comment_20260831` |
| `w6ofxBlm1MU` — Rain on a Window for Sleep — No Talking, Gentle Timer | 22 | `Ugw5_G0ENHLBVXBNI1t4AaABAg` | `rain_window_gentle_timer_short_comment_01` | Sleep CPP `67cb8784-2b16-4849-b940-90fdf4d99752` | `yixiu_yt_rain_timer_comment_20260831` |
| `oZFW__xNWJI` — Ocean Waves for Focus — No Music, No Talking | 22 | `UgwR1lneTki1YUVydFV4AaABAg` | `ocean_waves_focus_short_06_comment` | Focus CPP `7890afd3-dd12-4215-a5c5-17f4ebc28759` | `yixiu_yt_ocean06_comment_20260831` |
| `GHAYLQENv18` — Ocean Waves for Focus — No Music, No Talking | 26 | `Ugx08j1MbkozxNhyHMF4AaABAg` | `ocean_focus_short_02_comment` | Focus CPP `7890afd3-dd12-4215-a5c5-17f4ebc28759` | `yixiu_yt_ocean02_comment_20260831` |

The four placements represented 87 public views at readback. Together with the previously upgraded 160-view Mountain Wind Short, the existing-comment dual-exit pattern now covers five Yixiu Shorts with 247 public views at the captured boundary.

Every App Store URL now includes `pt=120014121`, its unique `ct` value and `mt=8`. The first three comments already had App Store anchors and received only the missing campaign parameters. The `GHAYLQENv18` comment previously had only an H5 anchor, so it received a `Continue on iPhone` anchor using the Focus custom product page. Its historical H5 medium remains `organic_video`; all other H5 attribution values were likewise preserved exactly.

## Authenticated and public readback

After each save, the authenticated YouTube DOM proved:

- the original permanent comment ID remained in use and the comment showed `（修改过）`;
- the original H5 content token and the new Apple campaign token were present in clickable anchors;
- the WonderElian creator heart was restored, changing its control to `移除红心`.

Logged-out HTTP readback then returned `200` for every permanent comment URL and contained both the expected H5 token and Apple campaign token:

- `https://www.youtube.com/watch?v=qhiCegeDFUQ&lc=UgxauHW9f1GOBXc50lZ4AaABAg`
- `https://www.youtube.com/watch?v=w6ofxBlm1MU&lc=Ugw5_G0ENHLBVXBNI1t4AaABAg`
- `https://www.youtube.com/watch?v=oZFW__xNWJI&lc=UgwR1lneTki1YUVydFV4AaABAg`
- `https://www.youtube.com/watch?v=GHAYLQENv18&lc=Ugx08j1MbkozxNhyHMF4AaABAg`

Representative production checks opened the exact attributed URLs for `rain-sounds-when-iphone-locked` and `ocean-waves-for-focus`. Both stayed on `yixiu.wonderelian.com`, kept their full YouTube UTM query and rendered page-specific rain/ocean content.

## Scope and measurement boundary

Only existing Yixiu comments, Yixiu H5 destinations, the Yixiu App Store listing and these Yixiu evidence files were used. No new comment, upload, pin, related-video change or advanced-feature identity verification was attempted. No other product was touched.

The current China network/storefront can localize a US custom-product-page URL differently, so placement success is not inferred from regional App Store navigation. The campaign links target the English/US acquisition audience; Apple outcomes require official reporting.

The latest accepted authoritative growth boundary remains unchanged:

- complete Beijing natural day: 2026-08-30;
- exact hostname `yixiu.wonderelian.com`: 13 UV, 24 views, 15 sessions and 2 CTA events;
- gap to the 100-UV gate: 87;
- Apple official data through 2026-08-29: 11 first-time downloads and 4 redownloads;
- these comment-attributed H5 users, sessions, downloads, trials, payments, subscriptions, IAP and revenue: `null`.

This batch proves four public clickable dual-exit paths and their independent attribution parameters. It does not prove a visit or download, and the overall growth goal remains active.
