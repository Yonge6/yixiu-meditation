# Bing Noise Generator Vocabulary Expansion — 2026-08-31

## Evidence and decision

At `2026-08-31T06:43:20.029Z`, the Google Analytics 4 Data API was queried with property `549913650`, property timezone `Asia/Shanghai` and an exact `hostName == yixiu.wonderelian.com` boundary.

The latest complete Beijing natural day, `2026-08-30`, returned:

- 13 active users;
- 15 sessions;
- 24 page views;
- an 87-user gap to the 100-UV completion gate.

The incomplete `2026-08-31` day returned 21 active users, 23 sessions and 28 page views. It cannot be used for completion. The existing `/free-online-sound-machine/` landing page had six active users and six sessions: four from `bing / organic` and two direct. This was the clearest current acquisition signal that could be strengthened without adding a duplicate route or changing another product.

Three scoped options were compared:

1. Expand the existing sound-machine page with honest adjacent `noise machine` and `noise generator` vocabulary. Selected because it preserves the canonical page while matching the observed Bing intent.
2. Create a second noise-generator route. Rejected because it would duplicate the same listening experience and split authority.
3. Rewrite the existing title and H1 around noise-generator wording. Rejected because the current sound-machine intent is already working and did not need to be displaced.

## Source change

- Design commit: `2bc0859`
- Implementation commit: `3ada127`
- Implementation PR: https://github.com/Yonge6/yixiu-meditation/pull/211
- Merge commit: `d45cd2193fe650aaeeabfab1d1ef5a665a9ba5d2`
- Canonical URL: https://yixiu.wonderelian.com/free-online-sound-machine/

The canonical, title and H1 were retained. The page now:

- describes the experience naturally as a free online noise machine in the first-screen lede;
- exposes `Free Online Noise Machine` and `Free Online Noise Generator` as `WebApplication.alternateName` values;
- adds a visible FAQ explaining that Yixiu plays recorded natural sounds rather than generating an adjustable electronic tone or frequency;
- keeps the visible FAQ and `FAQPage` JSON-LD answer identical.

No new route, account flow, paid promise, App Store metadata or unrelated product was changed.

## Verification before release

- `git diff --check`: passed.
- Protected runtime integrity: 28 files passed.
- Static site tests: 44 of 44 passed.
- Full production build: passed before and after merge.
- Desktop Chrome: correct title, H1, lede and five FAQs; no horizontal overflow.
- Local playback: Window Rain changed to its pause state and revealed the after-play panel.
- Mobile Chrome at 390 by 844: viewport and document width both 390; headline, lede and primary play action remained visible.

## Production release

The first archive preflight stopped before the production copy step because macOS AppleDouble metadata caused the Linux audio-count check to see 20 meditation files instead of 10. Read-only inspection proved the live page remained unchanged. The empty failed-attempt backup directory was retained as an audit trace, and no rollback or unrelated server path was touched.

A clean archive was rebuilt with AppleDouble and extended attributes excluded, then passed the same server-side contract and health checks:

- Release ID: `20260831-d45cd21-bing-noise-1458-clean`
- Release receipt: `DEPLOY_OK_YIXIU_20260831-d45cd21-bing-noise-1458-clean`
- Archive SHA-256: `aadfffdb73e552f249dac46447fee6b235cffc80222bda678eff96a9bba5f526`
- Deploy script SHA-256: `ddfd448cc1069f46eea1b7059456d45586e8ff8129386195fae5dc45242b9706`
- Retained artifacts: `/srv/wonderelian/backups/yixiu-20260831-d45cd21-bing-noise-1458-clean/release-artifacts`

Public acceptance returned HTTP 200. The local built HTML, server HTML and public response all returned the same SHA-256:

`1137b15ecc88956452c431d5527d02b2d2bec80f185ce1c7512add7deb600653`

Public HTML contained one canonical, one H1, the first-screen noise-machine phrase, one structured alternate-name array and matching visible/JSON-LD FAQ copies. A Range request for Window Rain returned HTTP 206.

Desktop Chrome production acceptance proved:

- the public title, H1, first-screen copy and five-FAQ inventory;
- a pressed playback control labelled `Pause Window Rain`;
- the new FAQ expanded to the exact approved answer;
- zero console errors;
- desktop viewport width equalled document width.

At 390 by 844, production Chrome again returned document width 390, exposed the headline, lede and hero playback action, and showed all five FAQ elements. The temporary viewport override was reset and the production URL was retained as the deliverable tab.

## Search submission

Only the changed canonical URL was sent to IndexNow. The captured retry returned HTTP 200 with an empty response body. The same URL was retried once because the first request used a zsh read-only variable name and failed to preserve the HTTP code. HTTP 200 proves receipt only; it is not treated as indexing, ranking, traffic or a conversion.

## Measurement boundary

The latest accepted complete Beijing natural day remains `2026-08-30` at 13 active users, 24 page views and 15 sessions. The 100-UV gate is not met.

The incomplete `2026-08-31` report at `2026-08-31T06:43:20.029Z` was 21 active users, 28 page views and 23 sessions. At that readback, the sound-machine landing page had four Bing-organic users and two direct users. These visits predate the production release and are not attributed to the new copy.

App Store Connect remains authoritative through `2026-08-29` at 11 first-time downloads and four redownloads. The official campaigns view has insufficient data. Campaign-attributed App downloads, trials, paid users, subscriptions, in-app purchases and revenue remain `null`, not zero. A release, browser playback test, IndexNow response or App Store click is not counted as an Apple download.

This is a verified Yixiu-only search acquisition improvement. It does not complete the long-term goal.
