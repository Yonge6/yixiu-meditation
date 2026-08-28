# YouTube Yixiu Focus Community Post — 2026-08-29

## Data-led decision

The incomplete 2026-08-29 exact-hostname GA4 Data API snapshot showed 2 active users, 3 views and 4 sessions. Existing attributable rows were limited to Pinterest Sleep and a YouTube Sleep comment; no Focus community-post acquisition existed. A text-only Focus post was therefore selected as an isolated, measurable addition on the official WonderElian YouTube channel.

The mixed-product channel Home tab remained disabled because enabling it would automatically change the presentation of all channel videos, Shorts, playlists and posts, including non-Yixiu content. A channel-profile Yixiu link was also rejected because it would apply the referral across the entire mixed-product profile. No existing post or other-product content was edited.

## Public post

- Permanent URL: `https://www.youtube.com/post/Ugkxl__uW_40cWZFcMZqpMEaRaFj5aYKFZL8`
- Author: `WonderElian`
- Visibility: public
- Format: text-only YouTube Community post
- H5 attribution: `youtube / organic_social / focus_sounds / community_focus_playlist_01`
- Focus playlist: `https://www.youtube.com/playlist?list=PLWaumipIoeCM`

Exact published copy:

```text
Choose one sound for the next 15 minutes.

For focused work:
1. Put one task in front of you.
2. Start real ocean waves or a mountain stream.
3. Keep the volume low enough to forget it is there.

Listen free in Yixiu:
https://yixiu.wonderelian.com/focus-sounds/?utm_source=youtube&utm_medium=organic_social&utm_campaign=focus_sounds&utm_content=community_focus_playlist_01

Watch the Focus playlist:
https://www.youtube.com/playlist?list=PLWaumipIoeCM

No music. No talking. No account. No ads.

#FocusSounds #NatureSounds #Yixiu
```

## External verification

- YouTube showed the creation-success toast and the new post at the top of the published Posts feed.
- The permanent post URL returned HTTP 200.
- Authenticated public DOM readback at the permanent URL showed `WonderElian`, the exact H5 UTM value, Focus playlist ID `PLWaumipIoeCM`, and all three hashtags.
- Logged-out post HTML independently exposed `WonderElian`, `community_focus_playlist_01`, `PLWaumipIoeCM` and `FocusSounds`; this proves the post is public rather than an authenticated-only draft.
- The exact attributed Yixiu Focus landing URL returned HTTP 200 without losing its query string.
- The public Focus playlist returned HTTP 200 and rendered as an embedded four-video playlist card in the post.
- YouTube's live composer still required advanced-feature approval for a clickable external site link. The H5 URL is present publicly as exact plain text, while the same-platform Focus playlist is clickable. No unsupported claim of clickable H5 delivery is made.
- No image, poll, quiz or video was attached or uploaded. No video, prior post, channel profile, Home tab or non-Yixiu content was changed.

## Measurement boundary

The immediate post-publication exact-hostname GA4 Data API readback for the incomplete 2026-08-29 Beijing day remained at 2 active users, 3 views and 4 sessions. Its source/campaign/content rows were `(not set)`, `pinterest / organic_share / sleep_sounds / forest_sleep_pin_01`, and `youtube / organic_comment / sleep_sounds / mountain_wind_short_comment_01`. `community_focus_playlist_01` did not appear, so this post has no attributed H5 visit or conversion yet.

The completed 2026-08-28 evidence remains conflicting and below the gate: the fresh exact-hostname Data API series shows 26 active users, 35 views and 33 sessions, while the earlier GA4 hostname UI table showed 40 active users, 55 views and 47 sessions. Neither proves the required 100 UV.

Apple official analytics already proves 10 first-time downloads and 4 redownloads through 2026-08-26. Trial starts, paid conversions, subscriptions, in-app purchases, revenue and a scalar `yixiu_download_click` result remain `null` where authoritative evidence is unavailable. The long-term growth goal remains active.
