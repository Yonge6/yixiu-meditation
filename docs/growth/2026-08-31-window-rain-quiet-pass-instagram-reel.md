# Window Rain Quiet Pass — Instagram Reel publication

## Outcome

- Published from the authenticated WonderElian Instagram account `wonderelian` on 2026-08-31 Beijing time.
- Permanent public URL: <https://www.instagram.com/wonderelian/reel/DcsXzPUhzgd/>
- Publicly verified at `2026-08-31 13:50:50 +0800`.
- The Reel is a Yixiu-only distribution asset. No other product, account, profile link, bio or older post was changed.

## Creative and media proof

The creative uses the existing production Window Rain image and the real Window Rain audio already shipped with Yixiu:

- image: `yixiu-prototype/public/assets/yixiu/window-rain.png`
  - SHA-256: `b72691b6a4f446bc8d96006083a5208c689e42de8a8b0ea529b760b8b6ab40f3`
- audio: `yixiu-prototype/public/assets/yixiu/audio/light-rain.m4a`
  - SHA-256: `83ecb47191fe8901a83a31ecec65c17bef9f3ea8f35727e6869c29900099e46d`
- reproducible renderer: `yixiu-prototype/scripts/render-window-rain-quiet-pass-reel.swift`
- rendered local media: `/Users/yongyuan/Documents/ChatGPT/运营推广/assets/yixiu-window-rain-quiet-pass-reel-2026-08-31/yixiu-window-rain-quiet-pass-reel.mp4`
  - SHA-256: `4f886e5029f77f8382b14f08a04ed0290ccecdaff92fcbc78011b247216dccdb`
  - 1080 by 1920 pixels
  - 15.000 seconds
  - one H.264 video track and one audio track
  - 8,188,656 bytes

Representative frames at 1.5, 5.2, 9.2, 13.0 and 14.4 seconds were visually inspected before publication. They cover all four messages, keep the primary copy inside the Reels safe area, retain contrast against the moving image and show the final call to action without cropping. Instagram's upload preview was explicitly changed from the square default to 9:16 full frame. The generated 1.5-second cover was uploaded as the Reel cover.

## Published copy and accessibility

Caption:

> Someone came to mind while you listened?
>
> Window Rain now lets you send them a complete 96-second quiet moment after one minute of listening.
>
> No account. No notifications. Just rain.
>
> Listen free → link in bio → Sleep Sounds
>
> #SleepSounds #RainSounds #RelaxingSounds #MindfulMoments #Yixiu

The Instagram AI-content label was enabled because the underlying production image is AI-created. The supplied alt text truthfully describes the blue rainy window, warm blurred lights and four text messages. Automatic captions remained off because the Reel contains rain audio and no speech.

## Platform readback

Instagram returned `Reels 已分享` and `你的 Reels 已分享。` after processing.

Authenticated desktop Chrome readback from the permanent URL showed:

- author `wonderelian`;
- the full caption and all five hashtags;
- the `AI 内容` label;
- original audio;
- the newly published relative timestamp;
- the Window Rain cover and 9:16 composition.

A logged-out request to the permanent URL returned HTTP 200, preserved the same final URL and produced 621,497 bytes of HTML. The public HTML contained both `wonderelian` and the immutable Reel identifier `DcsXzPUhzgd`.

## Measurement boundary

GA4 Data API property `549913650` was queried after publication with an exact `hostName == yixiu.wonderelian.com` filter.

- Latest complete Beijing natural day, 2026-08-30: 13 active users, 24 page views, 15 sessions. This is 87 users below the 100-UV gate.
- Partial 2026-08-31 at the post-publication query: 24 `yixiu_landing_view` events from 13 users, 7 `yixiu_playback_start` events from 2 users and 4 `yixiu_download_click` events from 2 users.
- No Instagram source row was exposed in the post-publication report. The shared profile link is the existing generic Yixiu chooser, so no Reel-specific visit is inferred.
- The new Window Rain Pinterest content row and the YouTube sleep-comparison content row were also absent from authoritative attribution at this boundary.

Apple's authenticated official analytics boundary remains current through 2026-08-29: 11 first-time downloads and 4 redownloads. App Store Connect still exposes insufficient campaign, proceeds, paid-user, IAP and subscription data.

Therefore Instagram-attributed H5 users, App downloads, trials, payments, subscriptions, IAP and revenue remain `null`. The growth goal remains active because no complete Beijing natural day has reached 100 exact-host H5 users.
