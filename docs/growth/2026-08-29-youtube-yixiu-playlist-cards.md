# YouTube Yixiu Playlist Cards — 2026-08-29

## Data-led selection and scope

YouTube remains Yixiu's strongest attributable authorized social surface. The three public long-form Yixiu videos already had matched playlist end screens in their final 20 seconds, but YouTube Studio initially exposed no mid-video card on any of them. A viewer who did not reach the ending therefore had no in-player playlist continuation prompt.

This action adds one matched Yixiu playlist card earlier in each long video. No video, image or audio was uploaded. No title, description, thumbnail, visibility, audience setting, Short, community post or non-Yixiu video was changed. The interrupted non-public 30-minute Rain upload was not edited or deleted. Maker, OneLaser, Wendao, Style Atlas and all other products remained outside scope.

## Published playlist cards

### Rain Sounds for Sleep

- Video: `https://www.youtube.com/watch?v=8LJoPKN3CO4`
- Card time: `05:00`
- Playlist: `Yixiu Sleep Sounds — Rain, Wind & White Noise`
- Playlist ID: `PLTKVdsllNT_o`
- Playlist URL: `https://www.youtube.com/playlist?list=PLTKVdsllNT_o`

Studio initially showed no card and a disabled save action. After saving, reopening the Cards editor exposed one playlist card with the exact Sleep playlist and `05:00:00` start time; the save action was disabled, proving there was no unsaved draft. The optional custom-message and teaser fields were blank on the reopened editor, so no custom-copy persistence claim is made.

### Mountain Stream Sounds for Focus

- Video: `https://www.youtube.com/watch?v=lfDiI0TAq1c`
- Card time: `05:00`
- Playlist: `Yixiu Focus Sounds — Ocean Waves & Mountain Stream`
- Playlist ID: `PLWaumipIoeCM`
- Playlist URL: `https://www.youtube.com/playlist?list=PLWaumipIoeCM`

Studio initially showed no card and a disabled save action. The external-link card type was unavailable, while video, playlist and channel cards were available. After saving, reopening the editor exposed one exact Focus playlist card at `05:00:00` and a disabled save action.

### Ocean Waves for Deep Focus

- Video: `https://www.youtube.com/watch?v=2nJUyIr9EOY`
- Card time: `03:20`
- Playlist: `Yixiu Focus Sounds — Ocean Waves & Mountain Stream`
- Playlist ID: `PLWaumipIoeCM`
- Playlist URL: `https://www.youtube.com/playlist?list=PLWaumipIoeCM`

Studio initially showed no card, the external-link card type disabled and the save action disabled. After saving, reopening the editor exposed one exact Focus playlist card at `03:20:00` and a disabled save action.

## External verification

- All three permanent watch URLs returned HTTP 200.
- Both permanent Yixiu playlist URLs returned HTTP 200.
- YouTube oEmbed returned each exact public title, author `WonderElian` and author URL `https://www.youtube.com/@WonderElian1`.
- Every public watch page exposed an information-card-capable player section and the expected matched playlist ID. Because the same playlist is also used by each video's end screen, playlist-card type, selection and timing are accepted from the authoritative saved-and-reopened Studio editor rather than inferred from a duplicate public playlist reference.
- The Sleep and Focus playlists contain only Yixiu sound videos.

## Measurement boundary

The post-publication Google Analytics Data API readback used exact hostname `yixiu.wonderelian.com`:

- Completed Beijing natural day 2026-08-28: 26 active users, 41 page views and 33 sessions.
- Incomplete Beijing day 2026-08-29: 17 active users, 33 page views and 27 sessions.
- Existing YouTube rows remained the Mountain Wind owner comment, Rain description, Focus Community post and Rain Community post, each at one active user and one session.
- Neither `yixiu_sleep_playlist_01` nor `yixiu_focus_playlist_01` appeared in the current session-content table.
- No `yixiu_download_click` row appeared in the current event table.

The absent playlist-attributed sessions and download-click row remain `null`, not zero. A saved YouTube card, YouTube view or public playlist reference is not substituted for an H5 user or App download.

Apple's latest official 90-day readback through 2026-08-28 proves 10 first-time downloads and 4 redownloads. The 2026-08-24 through 2026-08-28 daily rows displayed `-`; they are not converted to zero. Campaign-specific downloads, trials, paid conversions, subscriptions, in-app purchases and revenue remain `null` where Apple did not expose evidence.

The App-download evidence half remains satisfied. The completed-natural-day 100-UV H5 half remains below its gate, so the overall growth goal stays active.
