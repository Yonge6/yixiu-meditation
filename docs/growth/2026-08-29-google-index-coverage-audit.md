# Google Index Coverage Audit — 2026-08-29

## Scope and authority

- Property: `https://yixiu.wonderelian.com/`
- Surface: authenticated Google Search Console in desktop Chrome
- Scope: Yixiu URLs only; no other product, site or referral surface was changed
- Readback time: 2026-08-29 05:44 CST

## URL inspection results

Google Search Console reported `网址已收录到 Google` and `网页已编入索引` for both existing Yixiu pages:

- `https://yixiu.wonderelian.com/underwater-white-noise-for-sleep/`
- `https://yixiu.wonderelian.com/ocean-waves-for-sleeping/`

The HTTPS enhancement row reported `网页采用 HTTPS 协议` for both URLs. Because both pages were already indexed and no new page change was made in this audit, no duplicate indexing request was submitted.

Independent public readback returned HTTP 200 for both exact URLs and found a self-referencing canonical URL on each page.

## Sitemap and coverage state

Search Console reported the submitted `/sitemap.xml` as:

- Submitted: 2026-08-29
- Last read: 2026-08-29
- Status: `成功`
- Discovered pages: 23
- Discovered videos: 0

The public sitemap returned HTTP 200 and contained 23 `<loc>` entries, matching the discovered-page count. Search Console's aggregate page-indexing report still displayed `正在处理数据，请过 1 天左右再来查看`, so no aggregate indexed or excluded page count is claimed.

## Search performance boundary

The three-month Web performance view, last updated eight hours before readback, remained at:

- Clicks: 0
- Impressions: 7
- CTR: 0%
- Average position: 28.1
- Query rows: none
- Available chart dates: 2026-08-23 through 2026-08-26

These figures prove early Google discovery only. They do not prove H5 visits, a ranking result, or a download.

## GA4 and Apple boundary

The fresh exact-hostname GA4 Data API readback for the incomplete 2026-08-29 Beijing day remained at 4 active users, 6 views and 7 sessions. The source rows remained `(not set)`, `chatgpt.com / ai-assistant`, `instagram / organic_reel`, `pinterest / organic_share`, and `youtube / organic_comment`; no Google organic session appeared. Diagnostic HTTP checks are not counted as users.

The latest completed-day evidence remains conflicting and below the gate: the 2026-08-28 GA4 hostname UI table showed 40 active users, 55 views and 47 sessions, while the exact-hostname Data API readback showed 26 active users, 35 views and 33 sessions. Neither reaches 100 active users.

Apple official analytics continues to prove 10 first-time downloads and 4 redownloads through 2026-08-26. Trial starts, paid conversions, subscriptions, in-app purchases, revenue and campaign-specific downloads remain `null` because no authoritative evidence is available.

## Outcome

This audit closes the missing official index-status evidence for the underwater-white-noise and ocean-sleep pages without creating duplicate crawl requests. The long-term growth goal remains active until a completed Beijing natural day reaches at least 100 exact-hostname H5 active users.
