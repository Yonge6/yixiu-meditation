# Sleep Referral Share Release — 2026-08-29

## Evidence-led choice

The exact-hostname GA4 report for 2026-08-22 through 2026-08-29 showed `/sleep-sounds/` with nine playback users but only one share user. Search Console simultaneously exposed only seven impressions, no clicks and no query rows, so another near-duplicate search page was not justified. The selected change improves the existing listener-to-listener path after successful playback.

The post-play panel now asks `Know someone who needs a quieter night?` and labels the existing attributed share control `Send this rain to someone`. The share destination remains the canonical Sleep page with `share / referral / scene_share / sleep_landing_share` attribution. Clipboard and native-share success behavior are unchanged, and the contextual label is restored after temporary feedback.

The logged-in public `@WonderElian` X account was inspected as a possible new authorized distribution surface, but X exposed it as permanently read-only. The composed Yixiu draft was discarded and the empty-dialog state was verified. No post, appeal, setting change, alternate account or workaround was attempted.

## Source and review trail

- Design commit: `c079570`
- Implementation commit: `332acff`
- Pull request: https://github.com/Yonge6/yixiu-meditation/pull/138
- Production merge commit: `20f50e916584e5664556ff0b223687ebd96a9656`

## Verification before release

- Static-site suite: 34/34 passed.
- Playwright runtime suite: 52/52 passed, including contextual label restoration after clipboard feedback.
- Protected mobile runtime integrity: 28 files passed.
- Production build: passed.
- Deployment-script syntax and release guards: passed.
- `git diff --check`: passed.

The release guards require the new cache key, prompt, contextual `data-share-label`, shared-script label logic and shared style marker in both the staged archive and deployed target.

## Production release

- Public page: https://yixiu.wonderelian.com/sleep-sounds/
- Release ID: `20260829-20f50e9-sleep-share-1940`
- Archive: `/tmp/yixiu-20260829-20f50e9-sleep-share-1940.tar.gz`
- Archive SHA-256: `6891c015438e5b4d163c437e639cebf584955bf60031689a20759dffdf91b456`
- Rollback backup: `/srv/wonderelian/backups/yixiu-20260829-20f50e9-sleep-share-1940`
- Retained release artifacts: `/srv/wonderelian/backups/yixiu-20260829-20f50e9-sleep-share-1940/release-artifacts/`

The server shallow clone was required to equal the production merge commit before dependency installation, build, packaging or deployment. The guarded deployment verified the 51.4 MB archive, created the rollback backup, passed Nginx validation and returned `DEPLOY_OK_YIXIU_20260829-20f50e9-sleep-share-1940`.

Build source, deployed server and public HTTPS content matched exactly:

| Artifact | SHA-256 |
| --- | --- |
| `sleep-sounds/index.html` | `ac9de898a79f0f78f1006cadfee43731b11fb3cc66a9a20f909135d71de3e196` |
| `discover.js` | `5b9c5e20c66f156867c5da8e91f4fe927c25d9d962a4b673899681594f421595` |
| `discover.css` | `d4e1620c64aaabcabc2ba95d3cda327bb3da4dccb7c3e20f4328b01fc429a41e` |

## Live desktop Chrome acceptance

Desktop Chrome loaded the public page with the release-specific `20260829-sleep-share` CSS and JavaScript cache keys. At 390 x 844, clicking `Play Window Rain` changed the control to `Pause Window Rain`, advanced the timer to `29:59 remaining`, enabled Black Screen and revealed the full contextual share panel.

The panel bottom was 808.61 px inside the 844 px viewport. `scrollWidth` and `innerWidth` were both 390 px. The visible screenshot showed the prompt, contextual share action and Pinterest action without clipping or horizontal overflow. The after-preview App Store link retained placement `sleep_after_preview` and the official Sleep custom-product-page, partner-token and campaign-token parameters. The QA URL used `surface=ios`; this operator acceptance is not counted as acquisition traffic.

## Search discovery receipt

One IndexNow request containing the Sleep page, Guides and sitemap returned HTTP 200. This proves submission receipt only, not crawling, ranking, impressions, clicks or visitors. A duplicate Google recrawl request was not sent because the canonical had already been requested earlier that day and Search Console states that repeated requests do not increase priority.

## Authoritative result boundary

The refreshed exact-hostname GA4 Data API report returned:

- Completed Beijing natural day 2026-08-28: 26 active users, 41 page views and 33 sessions.
- Incomplete Beijing day 2026-08-29: 16 active users, 28 page views and 25 sessions.
- `share / referral / scene_share / sleep_landing_share`: no row was returned, so attributable users and sessions remain `null`, not zero.

The completed-day H5 result remains below 100 UV. Retained Apple official evidence proves 10 first-time downloads and 4 redownloads through 2026-08-26. Campaign-specific downloads, trials, paid conversions, subscriptions, in-app purchases and revenue remain `null` where official evidence is unavailable. The overall growth goal therefore remains active.

No other product repository, deployment or marketing surface was changed.
