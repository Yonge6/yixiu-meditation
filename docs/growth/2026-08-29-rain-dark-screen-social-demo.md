# Rain Dark-Screen Social Demo — 2026-08-29

## Decision

The live Yixiu Sleep Sounds page already exposed a real Window Rain player, 15/30/60-minute timer and a Darken Screen control. Instead of creating another landing page or repeating a static image, this release demonstrates that product behavior in one 20-second vertical video and publishes platform-native variants on the official WonderElian Instagram and Pinterest accounts.

The release uses only Yixiu destinations. It does not touch, mention or route through another product, does not use YouTube or X, and does not add a collaborator, location, product tag, paid promotion or Facebook cross-post.

## Published surfaces

### Instagram Reel

- Public Reel: `https://www.instagram.com/wonderelian/reel/DcmRREOzabO/`
- Account: `WonderElian` / `@wonderelian`
- Account readback after publication: 27 posts
- Published from authenticated desktop Chrome on 2026-08-29 Asia/Shanghai
- Format: native vertical Reel, 1080×1920, 20.03 seconds, H.264 video and AAC audio
- Cover: uploaded separately from the matching Yixiu campaign asset
- AI-content setting: enabled in the authenticated share form before publication
- Public audio attribution: `原创音频` / original audio
- Destination path in copy: the existing clickable Yixiu profile link, then `Sleep Sounds`

### Pinterest video Pin

- Public Pin: `https://www.pinterest.com/pin/1147643917690341502/`
- Account: `WonderElian` (`https://www.pinterest.com/wondereilan/`)
- Board: `Yixiu: Nature Sounds & Sleep`
- Board readback after publication: 42 Pins
- Published from authenticated desktop Chrome on 2026-08-29 Asia/Shanghai
- Format: native vertical video, 1080×1920, 20.03 seconds, H.264 video and AAC audio
- AI-modified disclosure: enabled and visible on the public Pin
- Topics: `Sleep`; `White Noise Machines`
- Similar-product recommendations: disabled
- Comments: enabled
- No collaborator, product tag, paid promotion, cross-post, second board or unrelated product was added.

## Creative evidence

Asset directory:

`/Users/yongyuan/Documents/ChatGPT/运营推广/assets/yixiu-rain-dark-screen-wonderelian-2026-08-29`

Instagram:

- Video: `yixiu-rain-dark-screen-instagram-reel-12.mp4`
- Video size: 6,498,871 bytes
- Video SHA256: `e5eaf597f4a963ba253ee0b50afcb493ab3f7930d52043d43ed78bd01ca80568`
- Cover: `yixiu-rain-dark-screen-instagram-reel-12-cover.jpg`
- Cover size: 281,248 bytes
- Cover SHA256: `82f62841c85873496670a7d33246b160f1f341a586ab8a72f8ff07ace30b20a7`

Pinterest:

- Video: `yixiu-rain-dark-screen-pinterest-video-pin-01.mp4`
- Video size: 6,485,034 bytes
- Video SHA256: `249e6e496d7f2a6985a3d28b7ad3a8164acd467bc6de1041a321aba4c505a729`
- Cover: `yixiu-rain-dark-screen-pinterest-video-pin-01-cover.jpg`
- Cover size: 281,248 bytes
- Cover SHA256: `82f62841c85873496670a7d33246b160f1f341a586ab8a72f8ff07ace30b20a7`

Source media:

- Visual: `yixiu-prototype/public/assets/yixiu/window-rain.png`
- Audio: `yixiu-prototype/public/assets/yixiu/audio/light-rain.m4a`

Representative 2, 5, 9, 13 and 18-second frames were inspected. They show the rain-window hook, the Window Rain play step, the Darken Screen step, the black running-timer state and the platform-specific call to action. The exported files contain Yixiu's real Window Rain audio throughout; no music or voice-over was added.

## Publication copy

Instagram caption:

> Need rain without a bright screen?
>
> Start Yixiu's real Window Rain, choose 15, 30 or 60 minutes, then tap Darken Screen. The open page turns black while the rain and timer keep running.
>
> Tap the Yixiu link in bio, then open Sleep Sounds. For physical iPhone lock-screen playback, continue in the Yixiu app.
>
> No music. No talking. No account. No ads. Visual created with generative tools; audio is Yixiu's real Window Rain recording.
>
> #RainSounds #SleepSounds #DarkScreen #NoAds #Yixiu

Pinterest title:

`Rain Sounds for Sleeping With a Dark Screen — No Ads`

Pinterest description:

`Need rain without a bright screen? Play Yixiu's real Window Rain, choose a 15, 30 or 60-minute timer, then tap Darken Screen. The web page turns black while the rain and timer keep running. No music, no talking, no account and no ads. For physical iPhone lock-screen playback, continue in Yixiu. Visual created with generative tools; audio is Yixiu's real Window Rain recording. #RainSounds #SleepSounds #DarkScreen #Yixiu`

Pinterest destination:

`https://yixiu.wonderelian.com/sleep-sounds/?utm_source=pinterest&utm_medium=organic_video&utm_campaign=sleep_sounds&utm_content=rain_dark_screen_video_pin_01`

Pinterest alt text:

`Vertical Yixiu demo showing a rain-covered window, instructions to play Window Rain and tap Darken Screen, then a black screen while the sleep timer continues.`

## External verification

- Instagram returned HTTP 200 for the permanent Reel URL.
- The authenticated public Reel DOM showed the `wonderelian` author, the exact caption, all five hashtags and `原创音频`; the refreshed profile exposed the new Reel first and increased from 26 to 27 posts.
- Logged-out Instagram HTML exposed the same Reel ID, author and opening caption.
- Pinterest returned HTTP 200 for the permanent Pin URL.
- The authenticated public Pin DOM showed the WonderElian author, 20-second playback, visible `AI modified` disclosure, exact title, full description and exact attributed destination.
- The refreshed Yixiu board exposed the new Pin first and reported 42 Pins.
- Logged-out Pinterest HTML exposed the visible title, WonderElian author, exact `rain_dark_screen_video_pin_01` attribution value and complete alt text.
- Pinterest oEmbed resolved the same Pin URL to the `WonderElian` author and Pinterest provider. Its title field was destination-derived (`A quieter way to fall asleep`) rather than the visible Pin title, so title acceptance is based on the public DOM and logged-out HTML.

## Measurement boundary

The official GA4 Data API snapshot after both publications reported 3 active users, 4 views and 6 sessions for exact hostname `yixiu.wonderelian.com` on 2026-08-29. This is an incomplete Beijing natural day. The source table had no `instagram / organic_reel` row for this new Reel and no `pinterest / organic_video` row for this new Pin, so no visit, click or conversion is attributed to either publication yet.

The latest completed-day evidence remains conflicting: the 2026-08-28 GA4 hostname UI table showed 40 active users, 55 views and 47 sessions, while the refreshed exact-hostname GA4 Data API readback showed 26 active users, 35 views and 33 sessions. Both are below the 100-UV gate, so neither is used to claim completion.

Apple official analytics already proves 10 first-time downloads and 4 redownloads through 2026-08-26. Trial starts, paid conversions, subscriptions, in-app purchases, revenue and a scalar `yixiu_download_click` result remain `null` where authoritative evidence is unavailable. These publications prove two live attributable Yixiu acquisition surfaces only; the overall growth goal remains active.
