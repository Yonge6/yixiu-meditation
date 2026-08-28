# GitHub Attribution Path — 2026-08-29

## Decision

The public `Yonge6/yixiu-meditation` repository is a legitimate Yixiu-owned discovery surface. Its bilingual README already linked to the H5 and App Store, but the App Store paths did not provide a distinct Apple campaign token and the rain link did not describe the live dark-screen timer.

This action adds a measurable GitHub-to-Yixiu path without creating a misleading software release. No other product, repository or website is used for referral traffic.

## Public surface and metadata

- Repository: `https://github.com/Yonge6/yixiu-meditation`
- Visibility: public
- Homepage retained: `https://yixiu.wonderelian.com/`
- Description: `Yixiu — real rain and nature sounds for sleep and focus on iPhone and web. Dark-screen timer. No account or ads.`
- Topics added: `dark-screen`, `sleep-timer`, `noise-masking`
- All 11 existing relevant topics were retained, for 14 topics total.

The repository metadata was read back through the GitHub API with the exact public URL, description, homepage, visibility and full topic list.

## README paths

The English rain anchor is now `Rain sounds for sleep with a dark-screen timer` and points to:

`https://yixiu.wonderelian.com/sleep-sounds/?utm_source=github&utm_medium=organic_referral&utm_campaign=sleep_sounds&utm_content=repository_readme_dark_screen`

Both the English and Chinese README App Store links point to:

`https://apps.apple.com/us/app/yixiu-white-noise-sleep/id1461182261?ppid=67cb8784-2b16-4849-b940-90fdf4d99752&pt=120014121&ct=yixiu_github_20260829&mt=8`

The dedicated Apple campaign token is `yixiu_github_20260829`. It creates a future attribution path only; no click, product-page view or download is inferred from adding it.

## External verification

- The attributed H5 destination returned HTTP 200 and retained the exact GitHub UTM query.
- GitHub API readback confirmed the repository is public and exposes the selected description, homepage and 14 topics.
- Apple's official US iTunes Lookup API returned one result for app ID `1461182261`: `Yixiu: White Noise & Sleep`, bundle ID `com.health.yixiu`, with the matching official US App Store product URL and current version release date `2026-08-26T21:12:30Z`.
- From the current China network, following the US campaign URL was region-routed to `https://apps.apple.com/cn/iphone/today`. Therefore this evidence confirms the official app identity and URL structure, but does not claim a direct US product-page HTTP acceptance from this environment.

After merge, the GitHub API's public `main` README readback exposed the exact dark-screen H5 UTM and both English and Chinese `yixiu_github_20260829` App Store links. The public repository page and `raw.githubusercontent.com` README both returned HTTP 200. The README change is therefore verified as published.

## Measurement boundary

The official GA4 Data API snapshot after publication still reported 3 active users, 4 views and 6 sessions for exact hostname `yixiu.wonderelian.com` on the incomplete Beijing natural day 2026-08-29. There was no GitHub source row, so no H5 user or session is attributed to this path yet.

The latest completed-day evidence remains conflicting: the 2026-08-28 GA4 hostname UI table showed 40 active users, 55 views and 47 sessions, while the exact-hostname GA4 Data API showed 26 active users, 35 views and 33 sessions. Both remain below the 100-UV gate.

Apple official analytics already proves 10 first-time downloads and 4 redownloads through 2026-08-26. GitHub-campaign downloads, trial starts, paid conversions, subscriptions, in-app purchases, revenue and scalar `yixiu_download_click` remain `null` where authoritative evidence is unavailable. The overall growth goal remains active.
