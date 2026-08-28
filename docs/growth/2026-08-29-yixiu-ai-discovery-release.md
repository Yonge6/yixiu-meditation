# Yixiu AI Discovery Release — 2026-08-29

## Signal and scope

This release changes only Yixiu. It does not modify, publish through, or add referrals to Maker, OneLaser, Wendao, Style Atlas, or any other product.

The action was selected from current acquisition evidence rather than a speculative keyword:

- The logged-in Google Search Console property `https://yixiu.wonderelian.com/` still showed 0 clicks, 7 impressions, 0% CTR, average position 28.1, and no query rows. There is no new query evidence for another search landing page.
- The official GA4 Data API report for exact hostname `yixiu.wonderelian.com` on 2026-08-28 showed `chatgpt.com / ai-assistant` with 5 active users and 5 sessions, the strongest identifiable external source in that API table.
- The same API run returned 26 active users, 35 views and 33 sessions for 2026-08-28. A prior fresh GA4 hostname-table readback recorded 40 active users, 55 views and 47 sessions. Because the current sources disagree, neither value is used to claim the 100-UV gate; both are below it.

The selected change adds a machine-readable guide for the complete existing Yixiu collection. The format follows the public [llms.txt proposal](https://llmstxt.org/). The existing permissive `robots.txt` was left unchanged; this release does not create a new training-crawler consent policy. OpenAI documents its search and user agents separately in its [crawler overview](https://platform.openai.com/docs/bots).

## Live artifact

- Public URL: `https://yixiu.wonderelian.com/llms.txt`
- Response: HTTP 200
- Content type: `text/plain; charset=utf-8`
- Content length: 3,858 bytes
- SHA-256: `62c58e501de737ca6e22c6565c6502fd2391d3e504a8196aff7b9347daef324c`

The file contains one H1, a truthful one-paragraph product summary, the official App Store listing, and 24 Yixiu discovery/trust links grouped under Sleep, Focus and Study, Meditation and Reset, and Optional. It includes no private analytics, credentials, internal release identifiers, unrelated-product domains, medical promises, ratings, or fabricated reviews.

All 25 linked destinations, including the App Store URL, returned HTTP 200 before release. Site tests additionally require every link to remain within `yixiu.wonderelian.com` or `apps.apple.com`, require unique URLs, and reject Maker, OneLaser, Wendao, Style Atlas, medical/outcome claims, and rating/review markup.

## Verification

- Protected mobile runtime integrity: 28 files passed.
- Site tests: 33/33 passed.
- Playwright runtime and funnel tests on isolated port 4279: 47/47 passed.
- Production build: passed.
- Built `dist/client/llms.txt` matched the committed source byte-for-byte.
- Nginx configuration validation: passed.
- Deployment guard required the file in the archive, checked its Yixiu/App Store identity, checked the deployed tree, and read it through the HTTPS loopback origin.
- Local, server, and public SHA-256 matched exactly.

Desktop Chrome remained the only browser surface used. The current Chrome Google identity had no access to GA4 property `549913650`, so no access request or account change was submitted; the existing read-only service account was used for the official Data API report. Search Console access remained available. Chrome's extension blocked direct navigation to the raw `.txt` URL with a client-side block, so production acceptance uses the successful public HTTPS response and matching hash rather than claiming a Chrome render.

## Git and deployment

- Implementation PR: `https://github.com/Yonge6/yixiu-meditation/pull/95`
- Merge commit: `aea0e7876016ffb2bde914e52a9180dc4e1a3040`
- Release ID: `20260829-aea0e78-ai-discovery-0307`
- Deploy result: `DEPLOY_OK_YIXIU_20260829-aea0e78-ai-discovery-0307`
- Local archive: `/tmp/yixiu-20260829-aea0e78-ai-discovery-0307.tar.gz`
- Archive SHA-256: `e8b994c7ac97c3f572e2dca76c20935595c51131343d918e05ec3f316633096c`
- Server backup: `/srv/wonderelian/backups/yixiu-20260829-aea0e78-ai-discovery-0307`
- Server release artifacts: `/srv/wonderelian/backups/yixiu-20260829-aea0e78-ai-discovery-0307/release-artifacts/`

The remote transfer archive and deploy script were moved into the release backup rather than deleted. The independent local archive remains available.

## Discovery and completion boundary

IndexNow accepted `https://yixiu.wonderelian.com/llms.txt` with HTTP 200. This proves submission receipt only; it does not prove crawling, model ingestion, assistant citations, referrals, H5 users, or App downloads.

The overall growth goal is not complete. No authoritative completed Beijing natural day proves at least 100 exact-hostname H5 active users. Apple official analytics already proves 10 first-time downloads and 4 redownloads through 2026-08-26. Trial starts, paid conversions, subscriptions, in-app purchases, revenue, and a scalar `yixiu_download_click` result remain `null` where authoritative evidence is unavailable.
