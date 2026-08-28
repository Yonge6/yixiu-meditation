# Deep White Noise Search and Pinterest Release

## Public artifacts

- Landing page: `https://yixiu.wonderelian.com/underwater-white-noise-for-sleep/`
- Pinterest Pin: `https://www.pinterest.com/pin/1147643917690288082/`
- Pinterest account: `WonderElian` (`/wondereilan/`)
- Pinterest board: `Yixiu: Nature Sounds & Sleep`
- Pin destination: `https://yixiu.wonderelian.com/underwater-white-noise-for-sleep/?utm_source=pinterest&utm_medium=organic_share&utm_campaign=scene_share&utm_content=underwater_white_noise_pinterest`

The public Pin returned HTTP 200 and its visible `Visit site` action resolved to the attributed Yixiu URL above. No other product board or site was modified.

## Rain timer Pinterest distribution

- Pinterest Pin: `https://www.pinterest.com/pin/1147643917690288380/`
- Title: `Rain Sounds for Sleeping — Free 15/30/60 Min Timer`
- Pinterest account: `WonderElian` (`/wondereilan/`)
- Pinterest board: `Yixiu: Nature Sounds & Sleep`
- Pin destination: `https://yixiu.wonderelian.com/sleep-sounds/?utm_source=pinterest&utm_medium=organic_share&utm_campaign=scene_share&utm_content=sleep_landing_pinterest`
- Description: `Play real rain sounds for sleeping with no music or talking. Set a free 15, 30 or 60-minute browser timer, listen instantly with no account or ads, then continue in Yixiu for iPhone with background playback.`
- Alt text: `Rain falling beyond a dark window for Yixiu's free online sleep timer.`

The public Pin returned HTTP 200. The public Yixiu board reported 30 Pins and an exact accessible-name lookup for the title above resolved to `/pin/1147643917690288380/`. Only the Yixiu board was used; no other product board or site was modified.

### Rain video Pin

- Pinterest Pin: `https://www.pinterest.com/pin/1147643917690289056/`
- Title: `Rain on Window for Sleep — No Music, No Talking`
- Pin destination: `https://yixiu.wonderelian.com/sleep-sounds/?utm_source=pinterest&utm_medium=organic_video&utm_campaign=sleep_sounds&utm_content=rain_window_sleep_video_pin_07`
- Description: `Press play for 20 seconds of real rain on a dark window—no music and no talking. Listen free online, set a 15, 30 or 60-minute timer, then continue in Yixiu for iPhone with background playback. Visual created with generative AI; audio is Yixiu's real Light Rain recording.`
- Alt text: `A vertical Yixiu video showing rain on a dark window at night, with text reading Rain Sounds for Sleep, No Music, No Talking.`
- Source asset SHA-256: `f15323c8e66ca58a5bfd44828432231e29ccea94f37df78de0ec5877d1fb81ff`

The 20-second video Pin and its attributed destination both returned HTTP 200. Its public page exposed the exact title, destination, `WonderElian` account, `Yixiu: Nature Sounds & Sleep` board and `AI modified` marker. The public board increased from 30 to 31 Pins and an exact accessible-name lookup resolved the title above to `/pin/1147643917690289056/`. A readable `RAIN SOUNDS FOR SLEEP` frame was selected instead of the video's initial black frame. No AI-person marker was used because the video contains no person.

## Rain Instagram Reel

- Public Reel: `https://www.instagram.com/wonderelian/reel/DckkNoIwNmo/`
- Account: `WonderElian` (`@wonderelian`)
- Destination in caption: `https://yixiu.wonderelian.com/sleep-sounds/?utm_source=instagram&utm_medium=organic_reel&utm_campaign=sleep_sounds&utm_content=rain_window_sleep_reel_04`
- Lead: `Let the rain stay outside.`
- Alt text: `Rain falling across a dark window at night with Yixiu text introducing real rain sounds for sleep, no music and no talking.`
- Source asset SHA-256: `f15323c8e66ca58a5bfd44828432231e29ccea94f37df78de0ec5877d1fb81ff`

Instagram displayed `Reels 已分享` before the public profile increased from 19 to 20 posts. The profile exposed the new Reel ID at the first grid position. The public Reel and attributed Yixiu destination both returned HTTP 200; the public Reel page exposed author `wonderelian`, `AI 内容`, `原创音频`, the expected caption and Yixiu-only hashtags. No collaborator, location or other product was added. The desktop profile grid currently uses the video's initial black frame, and no verified post-publication cover control was available, so the published Reel was left intact rather than risking deletion or duplication.

## Release evidence

- PR: `https://github.com/Yonge6/yixiu-meditation/pull/44`
- Merge commit: `7188cdedbae6385ae06db8876d413fa5aee77da2`
- Release: `20260828-7188cde-deep-white-noise-1232`
- Archive: `/tmp/yixiu-20260828-7188cde-deep-white-noise-1232.tar.gz`
- Archive SHA-256: `ba02ce8bae7a5422728c365010b0e5829cd87f08e506a03a025a89d8dc8b8310`
- Server backup: `/srv/wonderelian/backups/yixiu-20260828-7188cde-deep-white-noise-1232`
- Landing-page SHA-256: `70514d7e4ddeeaf1e01226383c22ce3dd91cc7fb2f1fab8b5d9936fcb5e2e8cb`
- Sitemap SHA-256: `1b2ca83530ebabb5e55afe79ec0875fb2f4559687b240e022819360f31eef089`
- WebP SHA-256: `b86e2674371ba048eef4e01b09c24ab907b0a639bb0fda1e64af668f16a613ac`

Local, server and public hashes matched for the landing page, sitemap and WebP. Nginx configuration validation passed. The page and sitemap were submitted to IndexNow and returned HTTP 200.

## Acceptance and measurement boundary

- Protected mobile runtime: 28 files passed.
- Build: passed.
- Static-site tests: 27/27 passed.
- Playwright: 40/40 passed.
- Mobile visual QA: 390px wide, no horizontal overflow.
- Production behavior: selecting 15 minutes showed 15:00; playback changed to `Pause Underwater White Noise`; the timer reached 14:59; the post-preview download action retained `ppid`, `pt`, `ct` and `mt`.

The latest completed Beijing natural day remains 2026-08-27 with 14 GA4 active users, 20 page views and 15 sessions. The 100-UV completion gate is not met. The 2026-08-28 figures are partial-day data and cannot prove completion.
