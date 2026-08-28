# YouTube Yixiu Intent Playlists — 2026-08-29

## Data-led decision

The exact-hostname GA4 Data API report for 2026-08-22 through 2026-08-28 showed `youtube / organic_video` with 16 active users and `youtube / organic_comment` with 6 active users. These were the strongest currently authorized attributable sources after direct traffic. The eight public Yixiu videos already had matching description and owner-comment paths, but YouTube Studio showed no playlist on the WonderElian channel.

Two intent-specific lists were chosen over one mixed list or another channel post. Separate lists keep the search title, video set, H5 destination and App Store custom product page aligned with either Sleep or Focus. The channel has one subscriber, so a transient post was treated as lower leverage than an evergreen playlist surface.

## Sleep playlist

- Public URL: `https://www.youtube.com/playlist?list=PLTKVdsllNT_o`
- Title: `Yixiu Sleep Sounds — Rain, Wind & White Noise`
- Creator: `WonderElian`
- Visibility: public
- Count: 4 videos
- Order: `iMG8YanRAnA`, `qhiCegeDFUQ`, `8LJoPKN3CO4`, `w6ofxBlm1MU`
- Ordering mode: published date, newest first

Description:

> Real rain, mountain wind, and quiet nature sounds from Yixiu for winding down—no music, no talking.
>
> Listen free on the web:
> https://yixiu.wonderelian.com/sleep-sounds/?utm_source=youtube&utm_medium=organic_playlist&utm_campaign=sleep_sounds&utm_content=yixiu_sleep_playlist_01
>
> Continue on iPhone with a gentle timer and background playback:
> https://apps.apple.com/us/app/yixiu-white-noise-sleep/id1461182261?ppid=67cb8784-2b16-4849-b940-90fdf4d99752
>
> No account. No ads.

## Focus playlist

- Public URL: `https://www.youtube.com/playlist?list=PLWaumipIoeCM`
- Title: `Yixiu Focus Sounds — Ocean Waves & Mountain Stream`
- Creator: `WonderElian`
- Visibility: public
- Count: 4 videos
- Order: `oZFW__xNWJI`, `lfDiI0TAq1c`, `GHAYLQENv18`, `2nJUyIr9EOY`
- Ordering mode: published date, newest first

Description:

> Real ocean waves and mountain stream sounds from Yixiu for reading, writing, study, and one focused work block—no music, no talking.
>
> Listen free on the web:
> https://yixiu.wonderelian.com/focus-sounds/?utm_source=youtube&utm_medium=organic_playlist&utm_campaign=focus_sounds&utm_content=yixiu_focus_playlist_01
>
> Continue on iPhone with a gentle timer and background playback:
> https://apps.apple.com/us/app/yixiu-white-noise-sleep/id1461182261?ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759
>
> No account. No ads.

## External verification

- Authenticated public DOM readback showed the exact title, creator `WonderElian`, public visibility, four-item count, complete description and expected order for both playlists.
- The Sleep playlist contains only the four named Yixiu sleep videos; the Focus playlist contains only the four named Yixiu focus videos.
- No Style Atlas or other non-Yixiu video appears in either list.
- Both public playlist pages returned HTTP 200.
- Both exact attributed Yixiu landing URLs returned HTTP 200.
- Logged-out playlist HTML exposed the correct title, WonderElian author, all four expected video IDs and the matching `organic_playlist` / `utm_content` values for each list.
- YouTube oEmbed returned HTTP 200 for both playlists with the exact title, author `WonderElian` and matching `videoseries` playlist ID.
- Both lists remained ordinary playlists; no podcast conversion was accepted.
- No video was uploaded, edited, deleted, made private or otherwise changed.

## Measurement boundary

The post-publication exact-hostname GA4 Data API snapshot for the incomplete 2026-08-29 Beijing day remained at 2 active users, 3 views and 4 sessions. Neither `yixiu_sleep_playlist_01` nor `yixiu_focus_playlist_01` appeared in the current source/campaign/content table, so the new playlists have no attributed H5 visit or conversion yet.

The completed 2026-08-28 evidence remains conflicting and below the gate: the fresh exact-hostname Data API series shows 26 active users, 35 views and 33 sessions, while an earlier GA4 hostname UI table showed 40 active users, 55 views and 47 sessions. Neither proves the required 100 UV.

Apple official analytics already proves 10 first-time downloads and 4 redownloads through 2026-08-26. Trial starts, paid conversions, subscriptions, in-app purchases, revenue and a scalar `yixiu_download_click` result remain `null` where authoritative evidence is unavailable. The long-term growth goal remains active.
