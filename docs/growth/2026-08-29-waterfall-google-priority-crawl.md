# Waterfall Google Priority Crawl — 2026-08-29

## Selection and scope

Google Search Console's current performance sample gave Yixiu's Waterfall page four impressions, the strongest page row in the seven-impression sample. The page had also been updated on 2026-08-29 with a matching real-waterfall player, timer, search-intent copy and App Store path. The selected action was therefore to submit this exact changed URL for a fresh Google crawl instead of rewriting it again or publishing another same-day social post.

Only Yixiu's verified Search Console property, production H5 and read-only analytics were used. No video or image was uploaded. No Maker, OneLaser, Wendao, Style Atlas or other product content, repository, deployment or referral was opened or changed.

## Search Console evidence

- Property: `https://yixiu.wonderelian.com/`
- URL: `https://yixiu.wonderelian.com/waterfall-sounds-for-noise-masking/`
- Inspection status before the request: `网址已收录到 Google`
- Page indexing: indexed
- Discovery source: `https://yixiu.wonderelian.com/sitemap.xml`
- Last recorded crawl: `2026-08-29 02:11:19`
- User agent: Googlebot Smartphone
- Crawl allowed: yes
- Fetch: successful
- Indexing allowed: yes
- User-declared canonical: the inspected Waterfall URL
- Google-selected canonical: the inspected URL
- HTTPS: valid

Desktop Chrome submitted one indexing request. Search Console returned `已请求编入索引` and stated that the URL had been added to the priority crawl queue. The same dialog warns that repeated submissions do not change queue position or priority, so no duplicate request was made.

This receipt proves submission to Google's crawl queue. It does not prove a new ranking, impression, click or visit.

## Public-page readback

At `2026-08-29 21:25:51 CST`:

- A Googlebot-mobile user agent received HTTP 200 from the exact URL.
- The live title remained `Waterfall Sounds for Sleep & Noise Masking | Yixiu`.
- The canonical remained the inspected URL.
- The live page exposed the real `/assets/yixiu/audio/forest-waterfall.m4a` preview and both attributed App Store actions.
- The live sitemap exposed the same URL with `lastmod=2026-08-29`.
- Live and `origin/main` source HTML had the same SHA-256: `9514e8adc8810d15e07e9b3b5df7cff34a73f5ede6270bd32d11ee4d49526a89`.

## GA4 result boundary

The post-request Google Analytics Data API readback used exact hostname `yixiu.wonderelian.com`:

- Completed Beijing natural day 2026-08-28: 26 active users, 41 page views and 33 sessions.
- Incomplete Beijing day 2026-08-29: 17 active users, 33 page views and 27 sessions.
- No `google / organic` source row was returned for 2026-08-29.
- No Waterfall landing-page event row was returned for 2026-08-29.
- No `yixiu_download_click` row was returned for 2026-08-29.

The absent rows remain `null`, not zero. The incomplete-day report also contains one `codex_qa / quality_assurance` user and is not reclassified as acquisition traffic. A prior GA4 hostname UI table exposed a conflicting 40-active-user result for 2026-08-28; both that UI result and the exact-hostname Data API result are below 100, so neither proves the H5 gate.

## Goal boundary

Apple's latest official 90-day readback through 2026-08-28 proves 10 first-time downloads and 4 redownloads. The August 24–28 daily Apple rows displayed `-`; they are not converted to zero. Campaign-specific downloads, trials, paid conversions, subscriptions, in-app purchases and revenue remain `null` where Apple did not expose evidence.

The App-download evidence half is satisfied. The completed-natural-day 100-UV H5 half is still not satisfied, so the overall growth goal remains active.
