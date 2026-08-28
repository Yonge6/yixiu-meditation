# Yixiu YouTube Intent Playlists Design

Date: 2026-08-29

## Objective

Create evergreen, search-readable YouTube entry points that group the eight existing public Yixiu videos by user intent and send viewers to the matching Yixiu H5 and App Store surface. Do not upload a new video, include another product, or make unsupported outcome claims.

## Evidence and options

YouTube is the strongest currently authorized attributable source in the 2026-08-22 through 2026-08-28 exact-hostname GA4 report: `youtube / organic_video` produced 16 active users and `youtube / organic_comment` produced 6. All eight existing public Yixiu videos now have owner-comment paths, but YouTube Studio shows no playlist on the channel.

Options considered:

1. Create separate Sleep and Focus playlists. Recommended because each title, order, description, H5 URL and App Store custom product page can match one intent.
2. Create one mixed Yixiu playlist. Simpler, but it dilutes both search intent and the primary call to action.
3. Publish another channel post. Faster, but the channel currently has one subscriber and posts are less durable than playlists.

## Playlist 1: Sleep

Title:

`Yixiu Sleep Sounds — Rain, Wind & White Noise`

Video order:

1. `iMG8YanRAnA` — Wind Sounds for Sleeping — Mountain Air, No Music
2. `8LJoPKN3CO4` — Rain Sounds for Sleep — 15 Minutes, No Talking, No Music
3. `qhiCegeDFUQ` — Rain on Window for Sleep — No Music, No Talking
4. `w6ofxBlm1MU` — Rain on a Window for Sleep — No Talking, Gentle Timer

Description:

`Real rain, mountain wind, and quiet nature sounds from Yixiu for winding down—no music, no talking.`

`Listen free on the web:`

`https://yixiu.wonderelian.com/sleep-sounds/?utm_source=youtube&utm_medium=organic_playlist&utm_campaign=sleep_sounds&utm_content=yixiu_sleep_playlist_01`

`Continue on iPhone with a gentle timer and background playback:`

`https://apps.apple.com/us/app/yixiu-white-noise-sleep/id1461182261?ppid=67cb8784-2b16-4849-b940-90fdf4d99752`

`No account. No ads.`

## Playlist 2: Focus

Title:

`Yixiu Focus Sounds — Ocean Waves & Mountain Stream`

Video order:

1. `lfDiI0TAq1c` — Mountain Stream Sounds for Focus — 15 Minutes, No Music, No Talking
2. `2nJUyIr9EOY` — Ocean Waves for Deep Focus — 10 Minutes, No Talking
3. `oZFW__xNWJI` — Ocean Waves for Focus — No Music, No Talking
4. `GHAYLQENv18` — earlier Ocean Waves for Focus Short

Description:

`Real ocean waves and mountain stream sounds from Yixiu for reading, writing, study, and one focused work block—no music, no talking.`

`Listen free on the web:`

`https://yixiu.wonderelian.com/focus-sounds/?utm_source=youtube&utm_medium=organic_playlist&utm_campaign=focus_sounds&utm_content=yixiu_focus_playlist_01`

`Continue on iPhone with a gentle timer and background playback:`

`https://apps.apple.com/us/app/yixiu-white-noise-sleep/id1461182261?ppid=7890afd3-dd12-4215-a5c5-17f4ebc28759`

`No account. No ads.`

## Safety and verification

- Both playlists must be public and owned by WonderElian.
- Only the eight named Yixiu videos may be added; Style Atlas and all other products are excluded.
- If creation defaults to podcast mode or exposes a podcast conversion, keep the playlists as ordinary playlists.
- Require permanent playlist URLs, exact titles, descriptions, four-item ordering and visibility from authenticated public DOM readback.
- Require public HTTP 200 and oEmbed/list-page evidence where available.
- Verify both UTM destinations return HTTP 200 without counting verification traffic as UV.
- Record a fresh exact-hostname GA4 snapshot. A new playlist row is a result only when the exact `utm_content` appears; otherwise it remains unproven.

## Completion boundary

This publication closes the channel playlist gap only. The long-term goal remains active until a completed Beijing natural day proves at least 100 exact-hostname active users and Apple official analytics proves downloads. Trial, paid, subscription, in-app-purchase and revenue values remain `null` without authoritative evidence.
