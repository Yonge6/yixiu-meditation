# Yixiu AI-readable Home Release — 2026-08-29

## Scope and decision

This release changes only Yixiu. It does not modify, publish through, or add referrals to Maker, OneLaser, Wendao, Style Atlas, or any other product.

The public audit found that Yixiu already allowed general crawlers, served a complete `/llms.txt`, and exposed 24 sitemap URLs. The remaining discovery gap was the JavaScript-dependent root document: non-JavaScript agents received only a single App Store fallback link. Because `chatgpt.com / ai-assistant` was the strongest identifiable external source in the current GA4 snapshot, the selected action was to make the existing home page and intent collection readable to search and assistant crawlers without creating another near-duplicate landing page.

## Live result

- Production home: `https://yixiu.wonderelian.com/`
- AI routing document: `https://yixiu.wonderelian.com/llms.txt`
- Implementation PR: `https://github.com/Yonge6/yixiu-meditation/pull/148`
- Merge commit: `23caab4718e1b8cf5f507049ddbae87186c59654`

The root source now includes a semantic no-JavaScript Yixiu entry point headed `Free nature sounds for sleep, focus and study`. It truthfully describes the 14 real recordings and links directly to Sleep, Focus, Best Sleep, Study comparison, Meditation, Guides, and the official App Store listing. All 24 sitemap HTML documents include one `rel="describedby"` relationship to `/llms.txt`.

The production root returned HTTP 200 to an `OAI-SearchBot/1.0` user agent and included both the semantic heading and `/llms.txt` relationship. This proves public accessibility only; it does not prove a crawl, model ingestion, citation, referral, H5 visit, or App download.

## Verification and deployment

- Protected mobile runtime integrity: 28/28 passed before merge.
- Site tests: 37/37 passed locally and again from the exact merge commit on the server.
- Playwright runtime suite: 52/52 passed before merge.
- Production build: passed locally and from the exact merge commit on the server.
- Deployment script syntax and Nginx configuration: passed.
- Public sitemap acceptance: 24/24 URLs returned HTTP 200 and exposed the `/llms.txt` relationship.
- Desktop Chrome acceptance: the live English Yixiu player loaded with the `Morning Birds` sound, playback controls, volume control, main navigation, and the official attributed App Store action.

Release evidence:

- Release ID: `20260829-23caab4-ai-readable-home-2056`
- Deploy result: `DEPLOY_OK_YIXIU_20260829-23caab4-ai-readable-home-2056`
- Archive SHA-256: `8492e23704df9ed4a6799d93f485ff27aa8a7d27e5232a366ebf6239683db0c4`
- Root HTML SHA-256: `729cf2e913467b335a56cec4a36778f7d7df3752f075b252826854324d2e6b99`
- Best Sleep page SHA-256: `b34122b2492b10131d6e28aad16109578ffc207bd0fe152f5620ff1b94f41a57`
- Server backup: `/srv/wonderelian/backups/yixiu-20260829-23caab4-ai-readable-home-2056`
- Retained artifacts: `/srv/wonderelian/backups/yixiu-20260829-23caab4-ai-readable-home-2056/release-artifacts/`

The first combined shell command stopped before building or changing production because its background operator separated the variable scope. The already verified shallow clone was retained, and the build and deployment were then executed as two explicit stages. The successful guarded deployment created the rollback backup, passed Nginx and loopback checks, and matched exact merge-build, server, and public hashes. Temporary clone and transfer files were removed only after the backup-contained archive, deploy script, and release manifest were checksum-verified.

IndexNow accepted one request containing the root, `/llms.txt`, and sitemap with HTTP 200. This is a submission receipt only.

## Authoritative result boundary

The post-release GA4 Data API refresh used exact hostname `yixiu.wonderelian.com`:

- Completed Beijing natural day 2026-08-28: 26 active users, 41 page views, and 33 sessions.
- Incomplete Beijing day 2026-08-29: 16 active users, 28 page views, and 25 sessions.
- Incomplete-day `chatgpt.com / ai-assistant`: 4 active users and 5 sessions.
- No `yixiu_download_click` or `app_store_download` event row was present in the queried 2026-08-29 result.

These values are unchanged from the immediately preceding snapshot and are not attributed to this release. The completed-day H5 result remains below 100 UV.

Retained Apple official evidence proves 10 first-time downloads and 4 redownloads through 2026-08-26. No new Apple report was retrieved during this release. Campaign-specific downloads, trials, paid conversions, subscriptions, in-app purchases, and revenue remain `null` where official evidence is unavailable. The overall growth goal remains active.
