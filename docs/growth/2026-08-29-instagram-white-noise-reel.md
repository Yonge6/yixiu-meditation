# Instagram Underwater White Noise Funnel — 2026-08-29

## Data-led decision

The official exact-hostname GA4 Data API report for 2026-08-22 through 2026-08-28 showed `youtube / organic_video` with 16 active users and `youtube / organic_comment` with 6, but all genuine existing-video owner-comment gaps were already filled and no new YouTube video or image upload is authorized. Instagram contributed 7 active users from Reels and 3 from organic social in the same report, making a completed Instagram click path the best available next action.

The existing Underwater White Noise vertical video was selected over a new asset. Its Pinterest-specific final instruction was not reused unchanged. A new Instagram version retains the first-party Yixiu scene and authentic audio, then replaces the final CTA with `WHITE NOISE · BLACK SCREEN`, `LINK IN BIO` and `CHOOSE WHITE NOISE`.

## H5 funnel change

The exact existing Instagram profile campaign now exposes six Yixiu-only choices instead of four. The two additions are:

- `White noise + black screen` → `/underwater-white-noise-for-sleep/` with `instagram_bio_white_noise_black_screen`
- `Mountain wind` → `/wind-sounds-for-sleeping/` with `instagram_bio_mountain_wind_sleep`

Both use the existing `instagram / profile / yixiu_profile` attribution model and emit `yixiu_profile_path_click`. The four existing Rain, Forest, Ocean and Reset paths remain unchanged. Ordinary homepage traffic still receives no Instagram chooser.

## Prepared Reel artifact

- File: `/Users/yongyuan/Documents/ChatGPT/运营推广/assets/yixiu-underwater-white-noise-wonderelian-2026-08-29/yixiu-underwater-white-noise-black-screen-reel-13.mp4`
- Dimensions: 1080×1920
- Duration: 20 seconds
- Video/audio: H.264 and AAC
- Audio bitrate: 77 kbps
- File size: 15,306,467 bytes
- SHA-256: `82c8c019821df2dcf5003dda97ea88809271408a8a3ddbf0d66ec677c6b12aab`

Frames at 0, 5, 10, 12.5, 15 and 19 seconds were inspected. The opening and no-music/no-talking sequence remain intact. The final panel is fully opaque and contains only the Instagram CTA. A failed first export whose CTA text did not render is retained beside the final asset as `yixiu-underwater-white-noise-black-screen-reel-13.failed-missing-cta.mp4`; it must not be published.

## Prepared caption

> Let the room fall away.
>
> Underwater white noise from Yixiu — no music, no talking.
>
> Tap the Yixiu link in bio, then choose White noise + black screen. The web preview is free, with 15, 30 or 60-minute timers. No account. No ads.
>
> Direct page: https://yixiu.wonderelian.com/underwater-white-noise-for-sleep/?utm_source=instagram&utm_medium=organic_reel&utm_campaign=sleep_sounds&utm_content=underwater_white_noise_black_screen_reel_13
>
> #WhiteNoise #BlackScreen #SleepSounds #NoMusic #Yixiu

Prepared alt text:

> Blue underwater scene with sunlight rays and text introducing Yixiu underwater white noise, ending with a link-in-bio call to choose the white-noise black-screen player.

## Local acceptance

- Protected mobile runtime integrity: 28/28 files passed.
- Production build: passed.
- Static-site tests: 33/33 passed.
- Full Playwright suite: 49/49 passed.
- Focused chooser test: failed when the White Noise path was absent, then passed after implementation.
- Mobile visual acceptance: 390×844, six 156×44 controls in a 2×3 grid, chooser bounds `left=20`, `right=370`, `top=118`, `bottom=346`, and no horizontal overflow.

## Current publication and measurement boundary

At this checkpoint the H5 change and Reel are locally prepared but the Reel has **not** been claimed as published. A public Instagram URL, correct `@wonderelian` authorship, caption, AI-content disclosure and destination readback are still required. The H5 change also requires merge and guarded production deployment before publication.

The latest verified completed Beijing natural day from the exact-hostname Data API is 2026-08-28 with 26 active users, 41 page views and 33 sessions. The incomplete 2026-08-29 readback is 13 active users, 22 page views and 20 sessions. Neither reaches the 100-UV gate. Apple official evidence already proves 10 first-time downloads and 4 redownloads through 2026-08-26; trial starts, paid conversions, subscriptions, in-app purchases, revenue and campaign-specific downloads remain `null`.
