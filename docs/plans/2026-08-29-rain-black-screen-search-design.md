# Rain Black-Screen Search Design

## Outcome

Make the already indexed `/sleep-sounds/` page answer the current `rain sounds black screen` search intent more precisely, without adding a duplicate page or changing the canonical URL. The page must keep its real Window Rain recording, 15/30/60-minute timer, black-screen interaction, App Store path, and existing analytics placements.

## Evidence and constraints

- Google Search Console has indexed `https://yixiu.wonderelian.com/sleep-sounds/`, but public search readback still shows the previous copy.
- The Google suggestion endpoint returned `rain sounds black screen` together with `no ads`, `sleep`, and `free` variants on 2026-08-29. Suggestions are a current query-language signal, not search-volume or ranking proof.
- Yixiu already fulfills that intent with a real rain recording, a black browser surface, a timer, no account, and no ads.
- The change must remain entirely inside Yixiu. No other product, site, navigation, or referral surface may be modified.
- The canonical URL, App Store campaign parameters, and existing analytics placement names stay stable.

## Approaches considered

1. **Optimize the existing indexed page — selected.** Put `rain sounds black screen` into the title, H1, first answer, visible FAQ, matching JSON-LD, and the Guides/llms entry. This reuses the indexed URL and the page's working player.
2. **Create `/rain-sounds-black-screen/`.** Rejected because the current `/sleep-sounds/` page already serves the same intent, so a second page would split signals and risk near-duplicate content.
3. **Move `/sleep-sounds/` to a new slug.** Rejected because a URL migration adds redirect and recrawl risk without evidence that the slug is the current blocker.

## Content and interaction design

The search result title becomes `Rain Sounds Black Screen for Sleep — Free, No Ads | Yixiu`. The H1 and first paragraph answer the exact request immediately while distinguishing the browser black screen from physical iPhone lock-screen playback. `Black Screen` becomes the visible control label and overlay label, but the underlying behavior is unchanged: playback must begin before the control is enabled, the timer must keep advancing, and tapping or pressing Escape must return to the page.

The first visible FAQ asks whether the black-screen rain sound is free and repeats only claims already supported by the live product. The FAQ JSON-LD must match that visible question and answer. The Guides card and `llms.txt` entry use the same intent without stuffing unrelated pages with exact-match anchors.

## Verification

- Static tests assert exact title, H1, first answer, visible FAQ/JSON-LD agreement, stable canonical, and existing App Store attribution.
- Playwright asserts the renamed `Black Screen` control still requires playback, opens the overlay, leaves audio playing, advances the timer, and exits by tap or Escape.
- Full runtime integrity, site tests, build, and Playwright suites must pass.
- Mobile QA at 390×844 must show the player and black-screen control without horizontal overflow.
- Production acceptance requires HTTP 200, exact public copy and hashes, one Google recrawl request, and no claim of traffic until authoritative GA4 reports it.
