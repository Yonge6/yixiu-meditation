# Instagram Profile Guide Release — 2026-08-29

## Released acquisition path

The official WonderElian Instagram profile (`@wonderelian`) now tells Reel visitors exactly how to reach the current rain campaign while retaining Yixiu's broader focus and reset paths:

> Rain + dark screen → tap the Yixiu link, then Sleep Sounds. Focus sounds + 1-minute reset. No account. No ads.

The desktop Instagram edit form saved the 110-character bio and the public profile DOM returned the exact text. The public account remained at 27 posts, 4 followers and 2 following. The existing clickable profile link remains:

`https://yixiu.wonderelian.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio`

Instagram disables website editing on desktop and states that links can only be edited in the mobile app. The user required desktop Chrome rather than the phone, so the website field was not changed. No post, Reel, media, AI label, account category, recommendation setting, collaborator, promotion or non-Yixiu destination was added or changed.

For that exact existing campaign only, the released Yixiu homepage now shows a dismissible bilingual `Find the sound you saw` guide. Ordinary homepage traffic remains unchanged. The guide exposes four existing Yixiu-only destinations:

- Rain + dark screen: `/sleep-sounds/` with `instagram_bio_rain_dark_screen`
- Forest sleep: `/forest-sounds-for-sleep/` with `instagram_bio_forest_sleep`
- Ocean focus: `/ocean-waves-for-focus/` with `instagram_bio_ocean_focus`
- 1-minute reset: `/one-minute-reset/` with `instagram_bio_one_minute_reset`

Every destination uses `utm_source=instagram`, `utm_medium=profile`, `utm_campaign=yixiu_profile` and its destination-specific `utm_content`. Every guide link also exposes `data-analytics-event="yixiu_profile_path_click"` with a destination-specific placement.

## Verification

- Protected mobile runtime integrity: 28 files passed.
- Static site tests: 33/33 passed.
- Production build: passed locally and again from the exact merge commit on the production server.
- Full Playwright runtime and funnel suite: 49/49 passed.
- The focused test proves the guide appears only for the exact Instagram profile campaign, verifies all four attributed `href` values, verifies dismissal, and confirms ordinary traffic has no guide.
- Mobile visual QA at 390 x 844 showed all four paths simultaneously in a 2 x 2 grid. The guide occupied `left=20`, `right=370`, `top=118`, `bottom=294`; `scrollWidth=390`, `innerWidth=390`, with no horizontal overflow.
- The guide ended 100px above the current scene heading and did not cover playback, timer, volume or bottom navigation controls.

The production Chrome readback added `surface=ios`, which disables the H5 analytics loader, so the acceptance visit is not presented as an acquired Instagram user.

## Git and production release

- Implementation commit: `af515651c674fd3bfd99e8b365a170e9ae36f585`
- Pull request: `https://github.com/Yonge6/yixiu-meditation/pull/115`
- Merge commit: `76788328c2979828e587f3abe0daa1f8f5fe9045`
- Release ID: `20260829-7678832-instagram-profile-guide-1528`
- Deployment result: `DEPLOY_OK_YIXIU_20260829-7678832-instagram-profile-guide-1528`
- Server build directory retained at: `/tmp/yixiu-instagram-guide.jStS4D`
- Server backup: `/srv/wonderelian/backups/yixiu-20260829-7678832-instagram-profile-guide-1528`
- Server release artifacts: `/srv/wonderelian/backups/yixiu-20260829-7678832-instagram-profile-guide-1528/release-artifacts/`
- Production archive SHA-256: `dfd2122869ecfc1b5015904368d7e77fc32ad713c6e165c3d35ff34d3ae92843`
- Independent local archive: `/tmp/yixiu-20260829-7678832-instagram-profile-guide-1528.tar.gz`
- Independent local archive SHA-256: `71d7776944c233cb2ad205ad0054f90437055a0a51a68564521a4a3004073511`

The server built from a shallow clone whose `HEAD` was required to equal the merge commit before dependencies, build, archive or deploy could continue. The guarded deploy downloaded the archive from a server-local HTTP origin, verified its SHA-256, created the backup, validated Nginx and completed every existing Yixiu acceptance check.

Server and public hashes matched exactly:

- `index.html`: `463d56b13056e307249d3d2e58ae564cd0e7929eae9271da57dc1d4d3dce1436`
- `assets/index-CmbhpOEM.js`: `fbbfcb7c9865aa6b45a26c0077f909eef5af1f9337b5eaf37fe96b165ecd4de6`
- `assets/index-CgDqFZ_y.css`: `b2db5eb1b7755333e07d80b10b4f250dcc019100aa3ce81f6e16f53e329ad7aa`

The public campaign URL rendered the exact guide, all four visible labels, all four attributed paths and all four analytics placements. The campaign URL and all four destinations returned HTTP 200.

## Measurement boundary

The official GA4 Data API snapshot after release reported 12 active users, 20 views and 19 sessions for exact hostname `yixiu.wonderelian.com` on the incomplete 2026-08-29 Beijing day. It did not return a `yixiu_profile_path_click` row, so no visitor or click is attributed to the new guide yet.

The latest completed-day Data API readback for 2026-08-28 is 26 active users, 38 views and 33 sessions, below the 100-UV gate. Apple official analytics already proves 10 first-time downloads and 4 redownloads through 2026-08-26. Trial starts, paid conversions, subscriptions, in-app purchases, revenue and campaign-specific App downloads remain `null` where authoritative evidence is unavailable. This release proves a live Yixiu acquisition path only; the overall growth goal remains active.
