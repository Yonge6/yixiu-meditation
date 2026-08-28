# Waterfall Search Intent Release — 2026-08-29

## Authoritative search baseline

Google Search Console property `https://yixiu.wonderelian.com/` reported the following three-month performance snapshot, updated approximately 6.5 hours before the readback:

- Chart data available from 2026-08-23 through 2026-08-26
- 0 total clicks
- 7 total impressions
- 0% average CTR
- 28.1 average position
- `/waterfall-sounds-for-noise-masking/`: 0 clicks, 4 impressions
- `/sleep-sounds/`: 0 clicks, 1 impression
- `/thunderstorm-sounds-for-sleep/`: 0 clicks, 1 impression
- `/focus-sounds/`: 0 clicks, 1 impression

The query table exposed no rows at this data volume. The waterfall page was prioritized because it held 4 of the 7 observed impressions; no query was inferred from unavailable data.

Public search-result research showed that current waterfall-sound results commonly lead with direct playback and include sleep, focus or masking use cases. Examples reviewed included `https://www.noisetape.app/sounds/waterfall/` and `https://www.ambientnoise.io/waterfall-sounds`. This was used as intent evidence only, not as traffic or product-claim evidence.

## Released change

- Retained the existing canonical URL instead of creating a competing waterfall page.
- Updated the title, description and H1 to cover sleep and noise masking while preserving the focus use case.
- Made the real, free online waterfall recording explicit in the first paragraph and play-button label.
- Added the existing 15-, 30- and 60-minute preview timer to the first screen.
- Added a preference-based sleep FAQ without medical or guaranteed-outcome claims.
- Added a contextual link from Sleep Sounds and updated the Guides card.
- Preserved the real `forest-waterfall.m4a` recording, exact canonical, Focus custom-product-page ID and Apple campaign attribution.
- Versioned the Discover CSS and JavaScript references as `20260829-waterfall-search`.
- Updated the affected sitemap dates to 2026-08-29.

PR #88 merged the page work as `405bbe7ffded6acab810fe48c02c7fb582b4f869`. PR #89 merged staged, deployed and HTTPS loopback release guards as `1daaca93f9ece948f04d695ce6ea66bc00154bdc`.

## Verification and production proof

- Mobile runtime integrity: 28 protected files passed.
- Site tests: 31/31 passed.
- Production build: passed.
- Playwright runtime: 46/46 passed with one worker on an isolated port. An earlier concurrent run had one unrelated keyboard-transition timeout; the isolated retry and full serialized suite passed.
- 390 x 844 visual QA: title, real-audio CTA and timer rendered correctly with no horizontal overflow.
- Deployment returned `DEPLOY_OK_YIXIU_20260829-1daaca9-waterfall-search-0205` after Nginx validation.
- Release archive: `/tmp/yixiu-20260829-1daaca9-waterfall-search-0205.tar.gz`
- Archive SHA-256: `a238d4ef369e94bbc4fb256c5d191f9f41c6a2966fe938d6708cbe3f19a656c5`
- Server backup: `/srv/wonderelian/backups/yixiu-20260829-1daaca9-waterfall-search-0205`
- Public waterfall page returned HTTP 200.

Local build, server and public hashes matched exactly:

- Waterfall page: `4386bff50c2cb56cf756bf3a824551d5e3bb5fed521b8d442bc684a7584cd1e3`
- Sleep Sounds page: `5dd55fd5b3bb5ff4b4d8e561f26acac18d966a07af2b1d61774e910a086be3a7`
- Guides page: `3ae98b4f4bc529976708b7838549301c04f18837714ebac03615f0d35b790d7a`
- Sitemap: `18ff6b4e465095a4a157df179a2fed6c923505033082a87281629bc97c8907d5`

## Discovery submission

Google Search Console URL Inspection reported `网址已收录到 Google` for the exact waterfall URL. After the release, the reindex action completed with `已请求编入索引` and confirmed that the URL was added to the priority crawl queue.

IndexNow accepted the waterfall page, Sleep Sounds, Guides and sitemap in one submission with HTTP 200.

These states prove current Google inclusion and submission receipt only. They do not prove that Google has recrawled the new copy, retained rankings, generated clicks, or produced H5 visits.

## Completion boundary

The latest accepted completed Beijing natural day remains 40 active users for exact hostname `yixiu.wonderelian.com`, below the 100-UV gate. Official Apple data already proves 10 first-time downloads and 4 redownloads. Trial starts, paid conversions, subscriptions, in-app purchases, revenue and a scalar `yixiu_download_click` result remain `null` where authoritative data is unavailable.
