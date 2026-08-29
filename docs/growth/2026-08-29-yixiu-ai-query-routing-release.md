# Yixiu AI Query Routing Release — 2026-08-29

## Scope and decision

This release changes only Yixiu. It does not modify, publish through, or add referrals to Maker, OneLaser, Wendao, Style Atlas, or any other product.

The pre-release audit found 22 public HTML pages, 24 sitemap URLs, no duplicate titles, no missing title/canonical/viewport metadata, no `noindex`, and HTTP 200 for every sitemap URL. Search Console still exposed only 7 impressions and no clicks or query rows, while the exact-hostname GA4 source table identified `chatgpt.com / ai-assistant` as the strongest named external source. The selected action therefore improves machine-readable routing to existing intent pages instead of creating another near-duplicate page or adding more same-day social posts.

The public `llms.txt` proposal describes a concise Markdown overview with links and treats page-level Markdown mirrors as optional. Yixiu already served `llms.txt` as `text/plain`, while the production Nginx MIME map did not provide a Markdown content type. The implementation therefore enriches the existing file without changing shared server MIME configuration.

## Live result

- Public artifact: `https://yixiu.wonderelian.com/llms.txt`
- Response: HTTP 200
- Content type: `text/plain; charset=utf-8`
- Content length: 5,597 bytes
- SHA-256: `a26d403a5834d7b0484218b5506f941817b8b189fe590f114eb5c110c5d5f510`
- Implementation PR: `https://github.com/Yonge6/yixiu-meditation/pull/140`
- Merge commit: `ea89b72a6d5b378c753171f42c92f754836e9cf1`

The file now gives assistants eight explicit routes for rain, physical iPhone lock-screen playback, white-noise black screen, sleep comparison, focus, study comparison, meditation, and a one-minute reset. It also distinguishes browser black-screen playback from physical iPhone locking and prohibits unsupported download, review, rating, price, subscription, medical, and promised-outcome claims.

All 26 linked destinations returned HTTP 200 before merge. Tests restrict links to Yixiu or the official Apple listing and reject unrelated-product domains and unsupported outcome claims.

## Verification and deployment

- Site tests: 34/34 passed locally and again from the exact merge commit on the server.
- Playwright runtime tests: 52/52 passed.
- Protected mobile runtime tests: 28/28 passed.
- Production build: passed.
- Built `dist/client/llms.txt` matched the committed source byte-for-byte.
- Deployment-script syntax, Nginx configuration, staged content, deployed content, and loopback HTTPS guards passed.
- Source, server, and public `llms.txt` SHA-256 values matched.

Release evidence:

- Release ID: `20260829-ea89b72-ai-query-routing-1954`
- Deploy result: `DEPLOY_OK_YIXIU_20260829-ea89b72-ai-query-routing-1954`
- Archive SHA-256: `3a184e55444cf2b7295efc7dda1ed8023e998a0927e36db735fff2c6595728c5`
- Server backup: `/srv/wonderelian/backups/yixiu-20260829-ea89b72-ai-query-routing-1954`
- Retained artifacts: `/srv/wonderelian/backups/yixiu-20260829-ea89b72-ai-query-routing-1954/release-artifacts`

The temporary server clone, transfer archive, deploy-script copy, and HTTP-server log were removed only after the backup received the archive, deploy script, and release manifest.

IndexNow returned HTTP 200 for `https://yixiu.wonderelian.com/llms.txt`. This proves submission receipt only; it does not prove crawling, model ingestion, citations, referrals, H5 users, or App downloads.

## Authoritative result boundary

The post-release GA4 Data API refresh used exact hostname `yixiu.wonderelian.com`:

- Completed Beijing natural day 2026-08-28: 26 active users, 41 page views, and 33 sessions.
- Incomplete Beijing day 2026-08-29: 16 active users, 28 page views, and 25 sessions.

These values are unchanged from the immediately preceding snapshot and are not attributed to this release. The completed-day H5 result remains below 100 UV.

Retained Apple official evidence proves 10 first-time downloads and 4 redownloads through 2026-08-26. Campaign-specific downloads, trials, paid conversions, subscriptions, in-app purchases, and revenue remain `null` where official evidence is unavailable. The overall growth goal remains active.
