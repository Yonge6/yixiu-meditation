# Google Search Console — Rain Lock-Screen Indexing

## Property and URL

- Search Console property: `https://yixiu.wonderelian.com/`
- Inspected URL: `https://yixiu.wonderelian.com/rain-sounds-when-iphone-locked/`
- Inspection date: 2026-08-28 Asia/Shanghai

Only the Yixiu Search Console property and Yixiu URLs were inspected or submitted.

## Official URL Inspection state

Before submission, Google Search Console reported:

- `URL is not on Google` / `网址尚未收录到 Google`.
- Page indexing reason: Google did not recognize the URL.
- No referring sitemap was detected for the URL yet.
- No referring page was detected yet.
- Last crawl, crawl permission and canonical processing were all not applicable because Google had not discovered the URL.

This is authoritative evidence that the newly published page was not indexed at the time of inspection. It must not be described as indexed or ranking.

## Indexing request

The exact canonical URL was submitted through Search Console's `Request indexing` action. After the live-indexability test completed, Search Console confirmed:

> Indexing requested. URL was added to a priority crawl queue. Submitting the same page multiple times does not change its queue position or priority.

The confirmation proves successful queue submission, not eventual indexing.

## Sitemap refresh

Before refresh, Search Console showed `/sitemap.xml` as successful but last submitted and read on 2026-08-26, with 15 discovered pages.

The same production sitemap was resubmitted on 2026-08-28. Search Console then reported:

- Submission date: 2026-08-28.
- Last read: 2026-08-28.
- Status: `Success` / `成功`.
- Discovered pages: 22.
- Discovered videos: 0.

Search Console also displayed `Sitemap submitted successfully` and stated that Google would process the sitemap periodically for changes.

## Measurement boundary

The prior IndexNow submission returned HTTP 200, and this Search Console action adds official Google discovery evidence. Neither proves impressions, clicks, H5 visits or App downloads. The partial 2026-08-28 GA4 readback immediately before this work was 16 active users, 21 page views and 19 sessions. The completed-day 100-UV requirement remains unmet, while Apple official data already proves 10 first-time downloads through 2026-08-26. Unknown trial, paid, subscription, IAP and revenue metrics remain `null`.
