# Yixiu AI discovery refresh — 2026-08-31

## Completed-day evidence

At `2026-08-31T04:58:04Z`, the Google Analytics Data API was refreshed with the standard read-only credential. The report used property `549913650`, exact hostname `yixiu.wonderelian.com` and the property timezone `Asia/Shanghai`.

For the complete Beijing natural day 2026-08-30, GA4 returned:

- 13 active users
- 24 page views
- 15 sessions
- 2 `yixiu_download_click` events from one active user

The strongest identifiable external source was `chatgpt.com / ai-assistant`, with six active users and six sessions. Its exact landing-page rows were five users and five sessions on `/sleep-sounds/`, plus one user and one session on `/ocean-waves-for-sleeping/`.

The same exact source had already sent four active users to `/sleep-sounds/` on 2026-08-28 and three active users there on 2026-08-29. This repeated completed-day result supported strengthening Yixiu's crawlable assistant/discovery surface rather than another immediate low-yield social post.

## Option comparison

Three scoped options were compared:

1. Refresh the Yixiu GitHub README and publish an exact-commit GitHub Release. Selected because it reinforces a crawlable Yixiu-owned source around the only external channel currently producing several users, with independently attributable H5 and App Store exits.
2. Publish another YouTube Community post. Recent Community rows produced one user each, posts were already closely spaced and inline Community URLs are not clickable.
3. Add another search landing page. Search Console exposed only 13 impressions and no query rows, while the current inventory already covers the relevant intents.

The previous GitHub Release already contained a Sleep URL, but it predated the free online sound machine, complete First Breath and Still Water tracks and current assistant accuracy boundaries. No `github / organic_release` row appeared in the 2026-08-30 source table; absence remains an unproven outcome rather than zero.

## Source and public release

- Implementation PR: https://github.com/Yonge6/yixiu-meditation/pull/200
- Merged source commit: `fef8720948cdc173a09500d026c5f41a2e12ad9b`
- Public release: https://github.com/Yonge6/yixiu-meditation/releases/tag/yixiu-web-20260831-ai-discovery
- Tag: `yixiu-web-20260831-ai-discovery`
- Title: `Yixiu Web 2026-08-31 · Free Rain & Sound Machine`
- Published: `2026-08-31T05:05:05Z`
- Tag target: exact commit `fef8720948cdc173a09500d026c5f41a2e12ad9b`

The refreshed README now leads with free browser listening and adds seven independently attributable `github / organic_referral / ai_discovery` paths for:

- Rain Sounds Black Screen
- the free 10-sound machine
- the seven-sound sleep comparison
- underwater white noise with a black screen
- ocean waves for sleeping
- the complete 88-second First Breath track
- the complete 21-minute Still Water track

It also links the public `llms.txt` and states the browser-black-screen versus physical iPhone-lock distinction. Both README App Store links use Sleep custom product page `67cb8784-2b16-4849-b940-90fdf4d99752`, provider token `120014121` and Apple campaign `yixiu_github_ai_discovery_20260831`.

The public Release exposes five separately attributed `github / organic_release / ai_discovery` H5 destinations and the same Apple campaign. No image, video, App Store metadata, production H5 behavior or unrelated product was changed.

## Public acceptance

Authenticated GitHub readback proved the Release is public, not a draft or prerelease, and targets the exact merge commit. The public tag ref resolves directly to the same commit.

Anonymous HTTP acceptance returned:

- Release URL: HTTP 200
- exact-commit raw README: HTTP 200
- all five unique Release H5 destinations: HTTP 200, full UTM retained, final hostname `yixiu.wonderelian.com`
- App Store campaign URL: HTTP 200

Anonymous GitHub HTML contained the exact release title, all five unique H5 content tokens and the Apple campaign token. The exact-commit README contained seven `ai_discovery` campaign links, two Apple campaign links and the public `llms.txt` URL. The pre-publication README audit also checked 22 unique Yixiu H5 URLs; all returned HTTP 200 and stayed on the exact Yixiu hostname.

## Measurement boundary

The latest accepted complete Beijing natural day remains 2026-08-30 at 13 UV, 24 page views and 15 sessions. The 100-UV gate is not met; the gap is 87 UV.

Apple official Analytics remains verified through 2026-08-29 at 11 first-time downloads and 4 redownloads. The public Apple Lookup on 2026-08-31 returned released version 1.5 for bundle `com.health.yixiu`; App Store Connect showed submitted iOS 1.6 waiting for review.

Release-attributed H5 users, sessions, App downloads, trials, payments, subscriptions, IAP and revenue remain `null` until later authoritative reporting. The publication, anonymous page checks and tag proof are not counted as visits or downloads.

Only the Yixiu repository, its public GitHub Release, Yixiu H5 destinations and the Yixiu App Store listing were used.
