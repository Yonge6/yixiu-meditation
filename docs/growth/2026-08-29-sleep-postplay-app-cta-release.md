# Sleep Post-Play App CTA Release — 2026-08-29

## Data-led decision

The exact-hostname GA4 Data API funnel for 2026-08-22 through 2026-08-29 showed `/sleep-sounds/` as the highest-volume named landing page: 18 landing users and 9 playback users, but no page-level `yixiu_download_click` user. Other Yixiu pages had already produced App Store click users. The selected change therefore improves the transition after a successful rain preview instead of creating another acquisition page or changing another product.

The first-screen App Store action now says `Keep rain playing on iPhone`. Successful Window Rain playback reveals an in-view status panel: `Want to lock your iPhone without stopping the rain? Continue in Yixiu.` The existing Sleep custom product page, Partner Token, campaign token, `yixiu_download_click` event and `sleep_after_preview` placement remain intact. A page-only `data-ensure-visible` opt-in keeps the panel inside the viewport without changing other Yixiu intent pages.

## Source and review trail

- Feature PR: `https://github.com/Yonge6/yixiu-meditation/pull/127`
- Deployment-guard PR: `https://github.com/Yonge6/yixiu-meditation/pull/128`
- Cache-busting PR: `https://github.com/Yonge6/yixiu-meditation/pull/129`
- Exact guard-marker fix PR: `https://github.com/Yonge6/yixiu-meditation/pull/130`
- Production merge commit: `45dc7fbf60e46b3008003915b55edb0295a39708`

The first deployment attempt stopped before changing production because the guard searched for `data.ensureVisible` while the source correctly used `dataset.ensureVisible`. The test had also used an over-broad substring regular expression. PR #130 changed all staged, deployed and loopback checks to the exact source marker and tightened the test before the release was rebuilt from the new merge commit. No guard was bypassed.

## Verification before release

- Mobile runtime integrity: 28 protected files passed.
- Static-site tests: 33/33 passed.
- Playwright sleep-path tests: 6/6 passed.
- Production build: passed.
- Shell syntax check for the deployment script: passed.
- Local 390 x 844 visual QA: no horizontal overflow; the post-play panel remained fully inside the viewport.

## Production release evidence

- Public page: `https://yixiu.wonderelian.com/sleep-sounds/`
- Release ID: `20260829-45dc7fb-sleep-postplay-1759`
- Archive SHA-256: `7ffa4c1ca36da42578f4dad1936f528e5413c8ab1a13a261378b02147fb1e03c`
- Rollback backup: `/srv/wonderelian/backups/yixiu-20260829-45dc7fb-sleep-postplay-1759`
- Release artifacts and `release.txt`: `/srv/wonderelian/backups/yixiu-20260829-45dc7fb-sleep-postplay-1759/release-artifacts/`
- `sleep-sounds/index.html` SHA-256: `e1b84a1d2a91fc84cb6e298071cf8908ad9d2b42cc5f4665e79531d6cee67ff5`
- `discover.js` SHA-256: `421b5a90923ec10af2035f2c0dce0c746de2c88cb5ef35831afd866147843d18`
- `discover.css` SHA-256: `c0da5938835add2d93a6feb676952620c646a1d28cc6f0edc9eea7f07f1dace7`

The release builder first required its shallow-clone HEAD to equal the production merge commit. The deployment script verified the archive, created a full rollback backup, passed staged-file guards, validated and reloaded Nginx, then returned `DEPLOY_OK`. For all three files above, source-build, server and public HTTPS hashes matched exactly. Public HTML also exposed the release-specific `20260829-sleep-postplay` CSS and JavaScript cache keys.

## Live browser acceptance

Desktop Chrome opened the public page and clicked `Play Window Rain` without clicking the external App Store action. The live button changed to `Pause Window Rain`, the timer moved from 30:00 to 29:59, Black Screen became enabled and the post-play status appeared with the exact attributed App Store URL and `sleep_after_preview` placement.

A supplementary public 390 x 844 run measured the panel bottom at 828.4375px inside the 844px viewport. `scrollWidth` and `innerWidth` were both 390px. The screenshot was visually inspected: the CTA, status copy, Share action and Pinterest action were legible with no clipping or horizontal overflow. These diagnostic visits are not reclassified as organic acquisition.

## Measurement boundary

The refreshed exact-hostname GA4 Data API report returned:

- Completed Beijing natural day 2026-08-28: 26 active users, 41 page views and 33 sessions.
- Incomplete Beijing day 2026-08-29: 13 active users, 22 page views and 20 sessions.
- Present 2026-08-29 event rows: 23 `yixiu_landing_view` events from 11 users and 10 `yixiu_playback_start` events from 5 users.
- No `yixiu_download_click` row was returned for 2026-08-29; this is recorded as absent, not as a zero outcome.

An earlier GA4 hostname UI table reported 40 active users, 55 views and 47 sessions for 2026-08-28. The sources conflict, but both completed-day readings are below 100 UV, so neither proves the H5 gate. The incomplete-day report may contain this release's diagnostic activity and is not a completed growth result.

Apple official analytics already proves 10 first-time downloads and 4 redownloads through 2026-08-26. Campaign-specific downloads, trial starts, paid conversions, subscriptions, in-app purchases and revenue remain `null` where official evidence is unavailable. The App-download half is proven; the completed-day 100-UV half is not, so the overall growth goal remains active.
