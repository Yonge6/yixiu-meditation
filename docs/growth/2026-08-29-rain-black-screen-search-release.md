# Rain Black-Screen Search Release — 2026-08-29

## Scope and decision

This release changes Yixiu only. It does not modify, publish through, or add a referral to Maker, OneLaser, Wendao, Style Atlas, or any other product.

The production SEO audit checked the complete 23-URL sitemap and 69 unique same-origin links or assets. Every sitemap URL returned HTTP 200, no checked internal resource was broken, titles were unique, canonical content pages were indexable, images had alt text, and no mixed-content URL was found. Google Search Console reported no Core Web Vitals field data for the low-traffic property, and the public PageSpeed API returned HTTP 429, so this release does not invent a field-performance score. The bilingual privacy page still has two visible H1 headings and no canonical or meta description; that trust-page cleanup remains separate from the current acquisition bottleneck.

The public Google suggestion endpoint returned these current query-language variants on 2026-08-29:

- `rain sounds black screen`
- `rain sounds black screen no ads`
- `rain sounds black screen sleep`
- `rain sounds black screen free`
- `rain sounds dark screen no ads`
- `rain sounds with sleep timer`

Suggestions are evidence of current phrasing, not search-volume, ranking, traffic, or conversion proof. Yixiu's already indexed `/sleep-sounds/` page already fulfilled the intent with real Window Rain, a browser black screen, a 15/30/60-minute timer, no account, and no ads. Creating a second route would duplicate that content, while migrating the indexed URL would add redirect risk. The selected approach therefore strengthens the existing canonical page.

## Released page

- Canonical: `https://yixiu.wonderelian.com/sleep-sounds/`
- Title: `Rain Sounds Black Screen for Sleep — Free, No Ads | Yixiu`
- H1: `Rain sounds with a black screen for sleep.`
- Primary control: `Black Screen`
- First FAQ: `Are these black-screen rain sounds free and ad-free?`

The exact intent is aligned across the title, meta description, first visible answer, H1, visible FAQ, matching FAQ JSON-LD, Open Graph, Twitter metadata, SoftwareApplication description, the Guides card, and `llms.txt`. The canonical URL, real `light-rain.m4a` recording, App Store custom product page, Apple campaign parameters, and existing analytics placements remain unchanged.

The copy explicitly distinguishes the browser black-screen overlay from physical iPhone lock-screen background playback. Playback must start before the black-screen button is enabled; the timer keeps advancing while the full viewport is black; tapping or pressing Escape returns to the page without pausing the rain.

## Verification

- Test-first proof: the focused static test failed on the old title before implementation and passed after the change.
- Protected mobile runtime integrity: 28 files passed.
- Static site tests: 33/33 passed.
- Production build: passed.
- Full Playwright runtime and funnel suite: 49/49 passed.
- Focused black-screen interaction: passed.
- Local mobile QA at 390 x 844:
  - Play button: 343 x 52 px.
  - Black Screen button: 343 x 52 px.
  - `scrollWidth=390`, `innerWidth=390`.
  - The overlay occupied the full viewport while `aria-pressed=true` remained on the real rain player.
- Production Chrome readback returned the exact title, H1, canonical, button, FAQ and two attributed App Store placements with no horizontal overflow.
- Production interaction readback returned `playing=true`, `blackOverlayHidden=false`, `Window Rain is playing`, and body class `is-dark-screen`.
- The production acceptance URL included `surface=ios`, so it is not presented as acquired traffic.

## Git and production release

- Implementation commit: `76283c4ace976cd6c217b0019a0a366c97d4298c`
- Pull request: `https://github.com/Yonge6/yixiu-meditation/pull/117`
- Merge commit: `56c4f73ebc03d3fb14509c3be069301467e1949f`
- Release ID: `20260829-56c4f73-rain-black-screen-search-1550`
- Deployment result: `DEPLOY_OK_YIXIU_20260829-56c4f73-rain-black-screen-search-1550`
- Server build directory: `/tmp/yixiu-rain-black-screen.46yfwJ`
- Server backup: `/srv/wonderelian/backups/yixiu-20260829-56c4f73-rain-black-screen-search-1550`
- Release artifacts: `/srv/wonderelian/backups/yixiu-20260829-56c4f73-rain-black-screen-search-1550/release-artifacts`
- Production archive SHA-256: `a08c0382a541f236f0e426a2c1f49770ea57a7920afd91117f58f8761f18d54f`
- Server/public `sleep-sounds/index.html` SHA-256: `4d1d81582dc8ab4f43f44b765a41d3b627280e665ec47b0862e054a28c0d66de`

The server shallow clone was required to equal the merge commit before installing dependencies or building. The guarded deployment verified the archive, created the backup, validated Nginx, reloaded it, and passed every existing Yixiu production acceptance check. The release archive and deployment script were retained under the backup rather than deleted.

## Discovery receipts

Google Search Console confirmed for the canonical page:

- `网址已收录到 Google`
- `网页已编入索引`
- `网页采用 HTTPS 协议`
- one valid video enhancement detected

Because the visible page and metadata changed, exactly one `请求编入索引` action was submitted. Search Console returned `已请求编入索引` and stated that the URL was added to the priority crawl queue. This is a recrawl receipt only; it does not prove processing, a changed search result, ranking, clicks, H5 users, or App downloads.

IndexNow accepted the changed canonical, Guides, `llms.txt`, and sitemap in one request with HTTP 200. This is also a submission receipt only.

## Authoritative measurement boundary

The fresh GA4 Data API readback filtered to exact hostname `yixiu.wonderelian.com` returned:

- Completed 2026-08-28 Beijing day: 26 active users, 38 views, 33 sessions.
- Incomplete 2026-08-29 Beijing day: 12 active users, 20 views, 19 sessions.

The completed-day result is 74 active users below the 100-UV gate. The incomplete-day report showed `/sleep-sounds/` at 6 active users and 7 sessions, but these sessions predate or overlap the release and are not attributed to this copy change. The partial event report returned 9 playback starts across 5 active users and one black-screen start/end pair; diagnostic and acceptance activity is not reclassified as organic acquisition. It returned no `yixiu_download_click` row.

Apple official analytics continues to prove 10 first-time downloads and 4 redownloads through 2026-08-26. Trial starts, paid conversions, subscriptions, in-app purchases, revenue, and campaign-specific App downloads remain `null` where authoritative evidence is unavailable.

The App download half of the objective remains proven. The completed-day H5 100-UV half remains unproven, so the overall growth goal stays active.
