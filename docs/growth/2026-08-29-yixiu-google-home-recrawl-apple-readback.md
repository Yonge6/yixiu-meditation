# Yixiu Google Home Recrawl and Apple Readback — 2026-08-29

## Scope

This action used only Yixiu's verified Google Search Console property, production H5, GA4 property and App Store Connect analytics. It did not modify, publish through, or add referrals to Maker, OneLaser, Wendao, Style Atlas or any other product. No video or image was uploaded.

## Google official result

Desktop Chrome opened the authenticated Search Console property `https://yixiu.wonderelian.com/` and inspected the exact canonical home URL.

Google reported:

- `网址已收录到 Google` / URL is indexed by Google.
- Sitemap discovery: `https://yixiu.wonderelian.com/sitemap.xml`.
- Last crawl: `2026-08-24 13:12:27` in the Search Console display.
- Crawler: Googlebot Smartphone.
- Crawling allowed: yes.
- Page fetch: successful.
- Indexing allowed: yes.
- User-declared canonical: `https://yixiu.wonderelian.com/`.
- Google-selected canonical: the inspected URL.
- HTTPS enhancement: valid.

The last recorded crawl predates the production AI-readable home release. One `请求编入索引` action was therefore submitted for the exact home canonical. Search Console completed its live test and returned `已请求编入索引`, stating that the URL was added to the priority crawl queue. No duplicate request was sent.

This is an official discovery receipt. It does not prove that Google has completed the new crawl, changed the index, improved ranking, generated a click, or produced an H5 visitor.

The Search Console performance report, updated four hours before inspection, covered the currently available 2026-08-23 through 2026-08-26 data and reported:

- Search clicks: 0.
- Search impressions: 7.
- CTR: 0%.
- Average position: 28.1.
- Waterfall Sounds for Noise Masking: 4 impressions.
- Sleep Sounds, Thunderstorm Sounds for Sleep and Focus Sounds: 1 impression each.
- Query rows: unavailable because the report displayed no data.

The waterfall page is already the strongest exposed page in this very small sample. Its title, description, H1, real audio and matched App Store path were left unchanged instead of making a speculative same-day rewrite.

## Apple official result

The exact previously verified App Store Connect metrics path for App `1461182261` was reopened in desktop Chrome. This avoided changing App Store settings or navigating through another product.

For the 90-day period `2026-05-31` through `2026-08-28`, Apple reported:

- First-time downloads: 10.
- Redownloads: 4.
- The most recent displayed first-time download was 1 on 2026-08-23.
- The most recent displayed redownloads were 2 on 2026-08-22.
- The 2026-08-24 through 2026-08-28 rows displayed `-` for both measures.

The dash rows are retained as Apple's display state and are not converted into a campaign-specific zero. Campaign-attributed downloads, trials, paid conversions, subscriptions, in-app purchases and revenue remain `null` where Apple did not provide proof.

## GA4 result boundary

The post-action GA4 Data API readback used exact hostname `yixiu.wonderelian.com`:

- Completed Beijing natural day 2026-08-28: 26 active users, 41 page views and 33 sessions.
- Incomplete Beijing day 2026-08-29: 16 active users, 28 page views and 25 sessions.
- Incomplete-day Sleep Sounds landing: 6 active users and 7 sessions.
- Incomplete-day `chatgpt.com / ai-assistant`: 4 active users and 5 sessions.
- `yixiu_share`: 2 events from 1 user.
- No `yixiu_download_click` or `app_store_download` row was returned in the queried result.

The share event proves that one visitor used the existing Yixiu referral action; it does not prove that another user visited or downloaded the App. The latest completed day remains below 100 active users. The Apple download-evidence half of the goal is satisfied, but the overall growth goal remains active.
