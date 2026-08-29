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

## Git and production release

- Funnel implementation PR: `https://github.com/Yonge6/yixiu-meditation/pull/122`
- Funnel merge commit: `a9a0fc1c0ff20a06bbd65adbbcfc3bbd635d0e28`
- Compiled-marker deploy-guard fix PR: `https://github.com/Yonge6/yixiu-meditation/pull/123`
- Deployed merge commit: `1db325e5902793fdc3858f81841b02dd0f4afccb`
- Release ID: `20260829-1db325e-instagram-white-noise-1654`
- Deployment result: `DEPLOY_OK_YIXIU_20260829-1db325e-instagram-white-noise-1654`
- Server build directory: `/tmp/yixiu-instagram-white-noise.kXoIih`
- Release archive: `/tmp/yixiu-20260829-1db325e-instagram-white-noise-1654.tar.gz`
- Release archive SHA-256: `4c77a1c749e87ce3e8761eec6c2099a7a47d351a97520bddc6dcda175dc934fb`
- Server backup: `/srv/wonderelian/backups/yixiu-20260829-1db325e-instagram-white-noise-1654`
- Release artifacts: `/srv/wonderelian/backups/yixiu-20260829-1db325e-instagram-white-noise-1654/release-artifacts/`

The first guarded attempt stopped after archive verification and before changing the production target. Vite keeps the exact analytics placement literals in the compiled bundle but constructs the UTM content value at runtime, so the original guard incorrectly searched for a full compiled UTM literal that cannot exist. PR #123 changed only those four pre/post-deploy assertions to the two exact compiled analytics placement markers. The corrected guarded release then verified the exact merge commit, archive hash, backup, Nginx configuration and public HTTPS origin before returning success.

Server build, production filesystem and public HTTPS hashes matched exactly:

- `index.html`: `783a3f0ae0f418ae1dacd1a8e3e4b3ce9835b365da88716c6fb8baf558279176`
- `assets/index-CaD9a2Sp.js`: `68541081ada0f785b976702d15dbf56b7ab6ac3071f126f57350a53122399a7f`
- `assets/index-DH1YTaiO.css`: `3b21119ad5b7f4f78b62cfef19113a2c8b28b74c3403c5acb535d541cd50f21f`

Desktop Chrome production acceptance confirmed the exact six path labels and URLs on the Instagram profile campaign. The two new paths carry `instagram_bio_white_noise_black_screen` and `instagram_bio_mountain_wind_sleep`. The ordinary `?lang=en&surface=ios` homepage exposed zero Instagram guide or path elements. The public JS and CSS are the same hashes as the locally accepted 390×844 build.

## Instagram publication proof

- Public Reel: `https://www.instagram.com/wonderelian/reel/DcnlGY2J3b5/`
- Account: `@wonderelian`
- Public media: 720×1280, 20.064 seconds, original audio available
- Crop: explicit 9:16 full-height Reel selection
- Caption: the exact 488-character prepared caption, including `underwater_white_noise_black_screen_reel_13`
- AI disclosure: enabled before sharing and exposed publicly as `AI 内容`
- Alt text: the exact prepared description was present in the form immediately before sharing
- Destination: the exact attributed URL returned HTTP 200 with the expected White Noise Black Screen title, real `underwater-white-noise.m4a` preview and App Store path

The first Instagram share attempt returned the explicit `无法分享帖子` failure and is not counted as a publication. The page-provided retry was used once; it returned `Reels 已分享`, the profile post count changed from 27 to 28, and the new Reel appeared first on the authenticated profile. The public Reel DOM exposed author `wonderelian`, the complete caption, the five hashtags, original audio and the AI-content label. The unauthenticated Reel HTML returned HTTP 200. Instagram's public oEmbed endpoint returned HTTP 200 with `author_name=wonderelian`, provider `Instagram`, the complete caption and matching Reel ID.

## Instagram profile conversion alignment

The public Reel tells viewers to use the link in bio and choose White Noise. The previous profile bio still led with Rain and Focus, so the next single-variable conversion change aligned the bio with the new intent while retaining the other main sound families:

`White noise + black screen → tap Yixiu below, then choose White noise. Rain, wind, forest + focus. No account. No ads.`

The first profile-save attempt returned `保存个人资料时出错` and visibly restored the prior copy; it is not counted as a successful edit. One fresh resubmission succeeded. The authenticated edit form then exposed the new 118-character value with a disabled Submit button and no error, and the public `@wonderelian` profile exposed the exact copy, the unchanged `yixiu.wonderelian.com` link, post count 28 and Reel `DcnlGY2J3b5`. The website field, AI Creator label and account-recommendation setting were not changed.

## Current measurement boundary

The latest verified completed Beijing natural day from the exact-hostname Data API is 2026-08-28 with 26 active users, 41 page views and 33 sessions. The 2026-08-29 incomplete readback at 17:18 Asia/Shanghai remained 13 active users, 22 page views and 20 sessions. It already contained one active user from `instagram / organic_reel / sleep_sounds / forest_sleep_reel_05`, but no row yet for `underwater_white_noise_black_screen_reel_13` or event row for `yixiu_profile_path_click`. This is an absence of attributed evidence immediately after publication and bio alignment, not a zero-outcome claim. Neither day reaches the 100-UV gate.

Apple official evidence already proves 10 first-time downloads and 4 redownloads through 2026-08-26. Trial starts, paid conversions, subscriptions, in-app purchases, revenue and campaign-specific downloads remain `null`.
