# Underwater White Noise for Sleep — Design

## Decision

Create one dedicated English search-intent page at `/underwater-white-noise-for-sleep/`.

Three approaches were considered:

1. **Dedicated intent page (selected).** It can match the exact query, expose a playable first-party sound immediately, and send visitors to the matching Sleep custom product page.
2. **Expand `/sleep-sounds/`.** This would be faster, but the page already targets rain sounds and would dilute its primary keyword.
3. **Social-only distribution.** This is useful for discovery but does not create a durable search entry and would depend on repeated posting.

## Experience

The page answers the query in the first paragraph and offers the real Yixiu `underwater-white-noise.m4a` preview above the fold. It uses the existing `underwater-echo.png` artwork, shared intent-page CSS and JavaScript, the established preview-to-download CTA, and the Sleep custom product page (`ppid=67cb8784-2b16-4849-b940-90fdf4d99752`).

The copy avoids medical or guaranteed sleep claims. It explains that listeners can use the sound as a steady background, compare it with rain and distant thunder, keep the volume low, and use a timer. A short safety note links to Harvard Health's discussion of mixed evidence and moderate-volume guidance.

## SEO and discovery

- Primary phrase: `underwater white noise for sleep`
- Secondary phrases: `deep ocean white noise`, `white noise no music`, `sleep sounds with timer`
- Self-referencing canonical, Open Graph/Twitter metadata, FAQ schema, and SoftwareApplication schema
- Internal links from `/guides/`, `/sleep-sounds/`, and related intent pages
- Add the route to `sitemap.xml` and guides ItemList without changing unrelated products or domains

## Verification

- Extend site tests for the route, canonical, audio asset, App Store ppid, and sitemap entry
- Run protected runtime checks, site tests, production build, and Playwright funnel tests
- Inspect the page at 390 px for overflow and verify preview playback reveals the download CTA
- Do not publish until local checks are green and the release path is explicitly authorized
