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

## Production and discovery evidence

- Watch-page PR: `https://github.com/Yonge6/yixiu-meditation/pull/83`
- Watch-page merge: `3186a1e84f4a4eb1aac210924377026311e71d30`
- Cache hotfix PR: `https://github.com/Yonge6/yixiu-meditation/pull/84`
- Final production merge: `ab31a0d2a83ae1f345d034bf83a2f20f57d72bf4`
- Final release: `20260829-ab31a0d-video-watch-cache-0129`
- Final archive: `/tmp/yixiu-20260829-ab31a0d-video-watch-cache-0129.tar.gz`
- Archive SHA-256: `7afcef018da1daa5b559cac16ad8ed243337ff09f37418cae4e4ff447ee20e60`
- Server backup: `/srv/wonderelian/backups/yixiu-20260829-ab31a0d-video-watch-cache-0129`
- Mountain Stream HTML SHA-256: `d26e073d444e9039ea82cf725aabea974749d37ab7e53bec74a7b06130416edc`
- River Study HTML SHA-256: `b6f1c7999cc2f437e37fed12fc3901cf6b6e2ec8984b2acdab31d72b0a71d863`
- Ocean Focus HTML SHA-256: `92cdb4501740a5e47d2168242c5709e94e760db817eab739c1db447a9b07a414`
- Discover CSS SHA-256: `06f57e853e21cdf53225743c672ba974381b968ef35f356d6fac964ab9c3d982`
- Sitemap SHA-256: `3635662e43a13ac2f4aabaf3b72d9e22fc06eb834e4bd4b37b8d37ebbdcf4c08`

Nginx validation passed and the final deployment returned `DEPLOY_OK_YIXIU_20260829-ab31a0d-video-watch-cache-0129`. Local build, server and public hashes matched for all five listed artifacts. All three landing pages returned HTTP 200.

Public desktop Chrome loaded `https://yixiu.wonderelian.com/discover.css?v=20260829-video-watch`, found one eager iframe and one watch hero, and measured the 554x312 player at `y=247` inside the 1190px first screen. The first public check before the cache hotfix had reproduced the stale unversioned CSS, so that state is not treated as accepted production.

IndexNow accepted the three exact landing URLs plus sitemap with HTTP 200. Google Search Console changed the issue state from `Not started` to `Validation started` (`验证已开始`) with start date 2026-08-29. These responses prove submission and validation start only; video indexing, impressions, clicks and H5 visits remain unproven pending Google recrawl and later reports.
