# Yixiu video watch-page fix — 2026-08-29

## Authoritative problem

Google Search Console property `https://yixiu.wonderelian.com/` reported three affected videos under `Video is not on a watch page` (`视频不在观看页面上`), last updated 2026-08-27:

- `https://yixiu.wonderelian.com/mountain-stream-sounds-for-focus/` — YouTube `lfDiI0TAq1c`, last crawled 2026-08-26
- `https://yixiu.wonderelian.com/river-sounds-for-studying/` — YouTube `lfDiI0TAq1c`, last crawled 2026-08-25
- `https://yixiu.wonderelian.com/ocean-waves-for-focus/` — YouTube `2nJUyIr9EOY`, last crawled 2026-08-24

Google's Video SEO documentation says a watch page's main purpose is to show one video, with the video prominent and above the fold. Before this change, each affected page placed a separate audio-preview conversion hero and three proof cards before the embedded video.

## Scoped fix

- Moved the single YouTube player into a dedicated, two-column first-screen watch hero on desktop and a first-screen stacked watch hero on mobile.
- Changed the iframe from lazy to eager loading so the primary player does not depend on scrolling.
- Kept exactly one iframe per page.
- Kept the real audio-only preview and attributed App Store CTA directly beneath the primary video.
- Connected each `WebPage.mainEntity` to a stable `VideoObject.@id`.
- Updated the three sitemap `lastmod` values to 2026-08-29.
- Added deploy guards for the watch hero on the three production pages.
- Versioned the shared stylesheet as `/discover.css?v=20260829-video-watch` after public Chrome proved that the unversioned URL could retain the old cached layout.

No other product or external channel was changed. No new video was uploaded.

## Local acceptance

- Site tests: 31/31 passed.
- Full isolated-port Playwright runtime: 45/45 passed.
- Production build: passed.
- Protected mobile runtime integrity: 28/28 files passed.
- 390x844 for all three pages: one eager iframe, video top between 492px and 520px, video bottom between 686px and 713px, and `scrollWidth == innerWidth == 390`.
- 1440x900 Mountain Stream: video rectangle `x=650`, `y=243`, `554x312`, fully visible in the first screen; `scrollWidth == innerWidth == 1440`.

## Evidence boundary

The source and local runtime now satisfy the published watch-page presentation criteria. Video indexing remains unproven until Google recrawls the pages and Search Console no longer reports the issue. Search impressions and video eligibility are not H5 UV.

The latest accepted completed-day GA4 result remains 40 active users on 2026-08-28 for exact hostname `yixiu.wonderelian.com`, below the 100-UV completion gate. Official Apple first-time download evidence remains 10. This release does not change either metric by itself.
