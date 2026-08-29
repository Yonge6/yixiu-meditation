# YouTube Yixiu Playlist End Screens — 2026-08-29

## Data-led selection and scope

The completed-period exact-hostname GA4 report identified YouTube video and comment traffic as Yixiu's strongest attributable social source. The official WonderElian channel already had two public Yixiu-only intent playlists and every public Yixiu video had a relevant description and owner-comment path. Its three public long-form Yixiu videos, however, had no end-screen element, so a viewer reaching the end had no direct in-player route to continue with another Yixiu sound.

This action adds one matched Yixiu playlist element to the final 20 seconds of each public long video. No video, image or audio was uploaded. No title, description, thumbnail, visibility, audience setting, channel Home tab, channel profile, Short, community post or non-Yixiu video was changed. The interrupted non-public 30-minute upload was not edited or deleted.

## Published end screens

### Rain Sounds for Sleep

- Video: `https://www.youtube.com/watch?v=8LJoPKN3CO4`
- Public views at audit: 12
- End-screen time: `14:40–15:00`
- Playlist: `Yixiu Sleep Sounds — Rain, Wind & White Noise`
- Playlist ID: `PLTKVdsllNT_o`
- Playlist URL: `https://www.youtube.com/playlist?list=PLTKVdsllNT_o`

YouTube Studio initially exposed no end-screen element and a disabled save action. After publication, reopening the editor exposed one playlist element, the exact playlist title, four-video count, `14:40:00–15:00:00` timing and a disabled save action, proving there was no unsaved draft.

The public watch-page data exposed the same playlist title, creator `WonderElian`, playlist ID, `startMs=880005` and `endMs=900005`.

### Mountain Stream Sounds for Focus

- Video: `https://www.youtube.com/watch?v=lfDiI0TAq1c`
- Public views at audit: 13
- End-screen time: `14:40–15:00`
- Playlist: `Yixiu Focus Sounds — Ocean Waves & Mountain Stream`
- Playlist ID: `PLWaumipIoeCM`
- Playlist URL: `https://www.youtube.com/playlist?list=PLWaumipIoeCM`

The initial Studio readback exposed no end-screen element. After saving and reopening, the editor exposed one exact Focus playlist element with four videos and `14:40:00–15:00:00` timing. The public watch-page data exposed `startMs=880005`, `endMs=900005`, the matching Focus playlist title, `WonderElian` creator and `PLWaumipIoeCM` ID.

### Ocean Waves for Deep Focus

- Video: `https://www.youtube.com/watch?v=2nJUyIr9EOY`
- Public views at audit: 7
- End-screen time: `09:40–10:00`
- Playlist: `Yixiu Focus Sounds — Ocean Waves & Mountain Stream`
- Playlist ID: `PLWaumipIoeCM`
- Playlist URL: `https://www.youtube.com/playlist?list=PLWaumipIoeCM`

The initial Studio readback exposed no end-screen element. After saving and reopening, the editor exposed one exact Focus playlist element with four videos and `09:40:00–10:00:00` timing. The public watch-page data exposed `startMs=580000`, `endMs=600000`, the matching Focus playlist title, `WonderElian` creator and `PLWaumipIoeCM` ID.

## External verification

- All three permanent watch URLs returned HTTP 200.
- Both permanent playlist URLs returned HTTP 200.
- YouTube oEmbed returned the exact title for each video, author `WonderElian` and author URL `https://www.youtube.com/@WonderElian1`.
- Each public watch page exposed its saved end-screen playlist renderer with the expected playlist ID and timing.
- The Sleep list contains only four Yixiu sleep videos; the Focus list contains only four Yixiu focus videos.

## Measurement boundary

The post-publication Google Analytics Data API readback used exact hostname `yixiu.wonderelian.com`:

- Completed Beijing natural day 2026-08-28: 26 active users, 41 page views and 33 sessions.
- Incomplete Beijing day 2026-08-29: 17 active users, 33 page views and 27 sessions.
- Existing YouTube rows remained the previously measured comment, description and community-post paths.
- Neither `yixiu_sleep_playlist_01` nor `yixiu_focus_playlist_01` appeared in the current session-content table.
- No `yixiu_download_click` row was returned for 2026-08-29.

The missing playlist-attributed H5 sessions and download clicks remain `null`, not zero. YouTube views and an end-screen publication are not substituted for H5 UV or App downloads.

Apple's latest official 90-day readback through 2026-08-28 proves 10 first-time downloads and 4 redownloads. The August 24–28 daily Apple rows displayed `-`; they are not converted to zero. Campaign-specific downloads, trials, paid conversions, subscriptions, in-app purchases and revenue remain `null` where Apple did not expose evidence.

The App-download evidence half remains satisfied. The completed-natural-day 100-UV H5 half remains below its gate, so the overall growth goal stays active.
