# Best Sleep Sounds Comparison Release — 2026-08-29

## Acquisition decision and scope

The release adds one Yixiu-only comparison page at `https://yixiu.wonderelian.com/best-sleep-sounds/`. It lets a visitor compare seven existing real recordings—Window Rain, Ocean Waves, Forest Breeze, Distant Thunder, Mountain Wind, Underwater White Noise and Forest Waterfall—at the same volume before choosing a bedtime sound. There are no rankings, medical claims, fabricated reviews or guaranteed outcomes. Maker, OneLaser, Wendao, Style Atlas and every other product were left unchanged and were not used for distribution.

The page uses the existing Yixiu timer and shared player. Every App Store action keeps the Sleep custom-product-page identifier, Partner Token and campaign token. Playing any recording reveals an in-view `best_sleep_sounds_after_preview` action for continuing background playback on iPhone.

## Source, tests and review

- Design and implementation plan commit: `46157d8`
- Feature commit: `cb67d24`
- Feature pull request: `https://github.com/Yonge6/yixiu-meditation/pull/132`
- Production merge commit: `8b2b1d415532e7fab250aaee3601d34f7686f9ac`
- Static-site tests: 34/34 passed.
- Full Playwright suite: 50/50 passed.
- Protected mobile runtime integrity: 28 protected files passed during the production build.
- TypeScript and Vite production build: passed.
- Deployment script shell syntax: passed.

The Playwright acceptance used a 390 x 844 viewport. It verified all seven audio paths in the intended order, switching from Rain to Waterfall, timer progression, the matched attributed iPhone action, an in-view post-play panel and no horizontal overflow.

## Production release evidence

- Release ID: `20260829-8b2b1d4-best-sleep-sounds-1824`
- Deployed at: `2026-08-29T18:22:22+08:00`
- Release archive: `/tmp/yixiu-20260829-8b2b1d4-best-sleep-sounds-1824.tar.gz`
- Archive SHA-256: `99f65541449329e3f23f092050a648fbe7360eaf08c62da5528ccdb23d5aae53`
- Rollback backup: `/srv/wonderelian/backups/yixiu-20260829-8b2b1d4-best-sleep-sounds-1824`
- Release artifacts: `/srv/wonderelian/backups/yixiu-20260829-8b2b1d4-best-sleep-sounds-1824/release-artifacts/`

The release builder required its shallow-clone HEAD to equal the merge commit before installing dependencies or building. The guarded deployment verified the archive, created the rollback backup, passed staged and deployed checks, validated Nginx and returned `DEPLOY_OK_YIXIU_20260829-8b2b1d4-best-sleep-sounds-1824`.

Source build, deployed server and public HTTPS content produced the same SHA-256 for each changed public artifact:

- `best-sleep-sounds/index.html`: `8a11d81fd7af1ce86185f54be28de6a38d2d7402cacddd7a10650b5fd560b041`
- `guides/index.html`: `fff523c0e974a96da2af71e453d2cf9860e5112df571dfaf1bcc914799cf45af`
- `sitemap.xml`: `4b1c6d60b03161f54cfdf2032270023e1427e3fca7ce8e47c4f051a0a9c19b64`
- `llms.txt`: `f09795df3db4a1e5ed49abdccd504cb3c202c4f938c8ecc9a03945bf2ceb67a5`

## Live browser and discovery acceptance

Desktop Chrome opened the public page with an explicit `codex_qa / quality_assurance` campaign marker. The live DOM exposed one H1, all seven preview controls, the 30-minute timer, the Sleep App Store path and every dedicated sound guide. Clicking Window Rain changed the control to `Pause Window Rain`, advanced the timer, revealed the post-play action and produced no browser console error. The page had no horizontal overflow. The external App Store link was not clicked, and this diagnostic visit is not reclassified as organic traffic.

IndexNow accepted one request containing the new canonical, Guides, sitemap and `llms.txt` with HTTP 200. Google Search Console initially reported that the new URL was not indexed and was unknown to Google. One `请求编入索引` action completed with `已请求编入索引`, adding the exact URL to the priority crawl queue. These are discovery receipts only; they do not prove a crawl, index update, ranking, impression, click or visitor.

## Authoritative measurement boundary

The refreshed GA4 Data API report filtered to exact hostname `yixiu.wonderelian.com` returned:

- Completed Beijing natural day 2026-08-28: 26 active users, 41 page views and 33 sessions.
- Incomplete Beijing day 2026-08-29: 14 active users, 23 page views and 21 sessions.
- The previously published Instagram white-noise Reel now has one authoritative `instagram / organic_reel / sleep_sounds / underwater_white_noise_black_screen_reel_13` active user and one session.
- The new `/best-sleep-sounds` landing row is absent at this read time, so this release has no attributable visitor result yet.
- Present event rows are 24 `yixiu_landing_view` events from 11 users, 10 `yixiu_playback_start` events from five users and two `yixiu_share` events from one user. No `yixiu_download_click` or `yixiu_profile_path_click` row was returned; absence is not converted to zero.

An earlier GA4 hostname UI table reported 40 active users, 55 views and 47 sessions for 2026-08-28. The current Data API and earlier UI values conflict, but both are below 100 active users, so neither proves the H5 completion gate. The incomplete 2026-08-29 day may include diagnostic activity and is not a completed growth result.

Apple official analytics already proves 10 first-time downloads and four redownloads through 2026-08-26. Campaign-specific downloads, trial starts, paid conversions, subscriptions, in-app purchases and revenue remain `null` because no official result is available. The App-download half is proven, but the completed-day 100-UV half remains unmet; the overall growth goal stays active.
