# Focus to Mountain Stream conversion path release — 2026-08-29

## Decision evidence

The GA4 Data API was queried with an exact `hostName == yixiu.wonderelian.com` filter for 2026-08-22 through 2026-08-29:

- `/focus-sounds`: 10 active users, 10 sessions, 9 landing-view users, and no playback or download event row.
- `/mountain-stream-sounds-for-focus`: 11 active users, 12 sessions, 2 playback users with 7 playback events, and 3 users with 9 App Store click events.

The change promotes the existing 15-minute Mountain Stream watch page directly below the Focus hero. Its canonical internal link has no UTM parameters and records `yixiu_focus_path_click` with placement `focus_landing_mountain_stream_path`.

## Code and tests

- Feature PR: https://github.com/Yonge6/yixiu-meditation/pull/134
- Feature merge: `17835aab5de91fa7e17566e266bcd88ec6f6e3e3`
- Deployment-guard PR: https://github.com/Yonge6/yixiu-meditation/pull/135
- Production merge: `e35a69b7f6dcb77b07c0f722ff7126bc1be9ef2c`
- Protected runtime integrity: 28 files passed.
- Static site suite: 34/34 passed locally and again on the production server.
- Playwright suite: 51/51 passed, including the new 390 px attributed-path and overflow test.
- Production build: passed.
- Deployment script syntax: passed.

The deployment guard requires the new placement in the staged archive, deployed directory, and HTTPS loopback response.

## Production release

- Public Focus page: https://yixiu.wonderelian.com/focus-sounds/
- Destination watch page: https://yixiu.wonderelian.com/mountain-stream-sounds-for-focus/
- Release ID: `20260829-e35a69b-focus-stream-path-1848`
- Archive: `/tmp/yixiu-20260829-e35a69b-focus-stream-path-1848.tar.gz`
- Archive SHA-256: `dabf6fc26a874d25d0cbfb68cdfe18cd94233fc468f98d93f9d92b1055b1dab6`
- Rollback backup: `/srv/wonderelian/backups/yixiu-20260829-e35a69b-focus-stream-path-1848`
- Retained release artifacts: `/srv/wonderelian/backups/yixiu-20260829-e35a69b-focus-stream-path-1848/release-artifacts/`

The first server run stopped before packaging or production changes because the clean clone had no prebuilt `dist/client` for the site test. The successful run used the required order: build, site tests, archive, guarded deployment. Nginx configuration passed and the release returned `DEPLOY_OK_YIXIU_20260829-e35a69b-focus-stream-path-1848`.

Source build, deployed server and public HTTPS content matched:

| Artifact | SHA-256 |
| --- | --- |
| `focus-sounds/index.html` | `a522efc2bb2ce543d15ff98484c91f72550f97bbdcfcf510e60595641921e419` |
| `sitemap.xml` | `b8d03df1a701fd6001a5fd2be09a86f22e4e72c014f16774fde66a3cfaa03f5a` |

Desktop Chrome live acceptance confirmed the public title, new image and CTA, canonical destination, analytics event and placement, real one-tap audio playback, visible post-play iPhone CTA, no horizontal overflow at the observed desktop viewport, and no console errors. The destination watch page also loaded with its expected heading and no console errors. The QA URLs used `surface=ios` so this acceptance visit did not initialize H5 analytics.

## Search discovery

- IndexNow accepted the Focus page, Mountain Stream page and sitemap request with HTTP 200. This is a receipt, not proof of crawling or ranking.
- Google Search Console reported that the Focus URL is indexed and can appear in Google Search.
- A fresh indexing request succeeded, and Search Console confirmed that the URL was added to the priority crawl queue. Repeated submission does not increase priority.

## Result boundary

The exact-hostname GA4 refresh after deployment reports:

- Completed Beijing day 2026-08-28: 26 active users, 41 page views, 33 sessions.
- Incomplete Beijing day 2026-08-29: 15 active users, 23 page views, 22 sessions.
- `yixiu_focus_path_click` for 2026-08-29: `null` because no authoritative event row is available yet.

The completed-day 100-UV gate has not been reached. Retained official Apple evidence remains 10 first-time downloads and 4 redownloads through 2026-08-26. Campaign-attributed downloads, trials, payments, subscriptions, in-app purchases and revenue remain `null` without official evidence.

No other product repository, deployment or marketing surface was changed.
