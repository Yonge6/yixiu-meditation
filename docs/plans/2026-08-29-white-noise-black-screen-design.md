# White Noise Black-Screen Search Design

## Objective and evidence

Strengthen the existing canonical `/underwater-white-noise-for-sleep/` page for the current `white noise black screen`, `no ads` and `sleep timer` intent while keeping every claim directly supported by Yixiu's real underwater audio and browser behavior.

The production audit already found a healthy crawlable foundation and an indexed underwater-white-noise URL. Current search results group a black display, free/ad-free playback and a timer into one listening intent. Yixiu's page already has the real `underwater-white-noise.m4a` scene, a 15/30/60-minute timer, no account, no ads and an attributed iPhone continuation path. The missing product promise is a working browser black-screen control.

Search-result language is intent evidence only. It is not search-volume, ranking, traffic or conversion proof.

## Approaches considered

1. **Strengthen the existing canonical page — selected.** Add a working black-screen control and align title, description, H1, first answer, visible FAQ, schema and internal discovery copy. This preserves the indexed URL and gives the searcher the promised interaction immediately.
2. **Create `/white-noise-black-screen/` — rejected.** It would use the same audio, timer, audience and App Store path as the existing underwater page, creating duplicate content and keyword cannibalization.
3. **Build a multi-sound black-screen mixer — rejected for this release.** It expands scope, increases interaction complexity and is unnecessary to satisfy the observed single-sound search intent.

## Interaction and architecture

The page opts into the existing optional black-screen runtime with the same `data-dark-screen-toggle` and `data-dark-screen-overlay` hooks used by Window Rain. `discover.js` remains the single implementation. Its page-specific hard-coded rain status becomes scene-aware by deriving the label from the active preview button's existing `data-play-label` value. Window Rain therefore retains its current status text, while the underwater page announces `Underwater White Noise is playing` or `... is paused`.

The black-screen button is disabled until audio playback succeeds. Starting audio enables it; tapping it shows a full-viewport black button, keeps the audio and timer running and moves focus into the overlay. Tapping the overlay or pressing Escape returns focus to the visible Black Screen control without pausing. A playback failure leaves the control disabled. Timer completion keeps the overlay available with `Timer complete`, matching the existing rain behavior.

This release does not claim that an open browser page can keep playing after physically locking an iPhone. Visible copy distinguishes browser black-screen mode from Yixiu iPhone background playback.

## Search and conversion alignment

The canonical URL remains unchanged. The primary phrase appears naturally in the title, meta description, H1 and first 100 words. Open Graph, Twitter, WebPage and SoftwareApplication descriptions describe the same real behavior. The visible FAQ and FAQ JSON-LD use identical questions and answers. Guides, `llms.txt`, sitemap `lastmod` and one contextual sleep-page link reinforce the existing canonical rather than creating a second route.

Both App Store actions retain the Sleep custom product page and shared Apple campaign parameters. No Google UTM is invented on internal or App Store links. Existing playback, timer, dark-screen and download events remain the measurement surface.

## Verification gates

- A focused static test must fail against the old page before implementation.
- Static tests verify the unchanged canonical, exact intent copy, one H1, FAQ parity, real audio, timer, dark-screen hooks, App Store attribution and internal discovery links.
- Playwright verifies disabled-before-play, real audio start, full-viewport black overlay at 390 x 844, timer continuity, scene-aware status, click/Escape return behavior, focus restoration and analytics events.
- The existing Window Rain black-screen test remains green as the regression gate.
- Protected runtime integrity, full static tests, production build and complete Playwright suite must pass.
- Mobile visual inspection must show usable controls of at least 48 px and no horizontal overflow.
- Production acceptance must read back the exact metadata and interaction without counting diagnostic traffic as acquired UV.
