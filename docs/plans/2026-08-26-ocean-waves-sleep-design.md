# Ocean Waves for Sleeping — Design

## Decision

Create one dedicated English search-intent page at `/ocean-waves-for-sleeping/`.

Three approaches were considered:

1. **Dedicated ocean-sleep page (selected).** It fills a real intent gap without inventing a sound, offers Yixiu's matching ocean recording immediately, and can route qualified visitors to the Sleep App Store custom product page.
2. **Add sleep language to `/ocean-waves-for-focus/`.** This would blur the page's existing deep-work intent and make its title, copy and custom-product-page route inconsistent.
3. **Create another rain-sleep page.** Rain already anchors `/sleep-sounds/` and `/rain-sounds-for-reading/`, so another exact-match page would add more overlap than coverage.

## Experience

The page answers `ocean waves for sleeping` in the first paragraph and places the real `ocean-waves.m4a` preview above the fold. It uses the existing `night-tide.png` artwork, shared intent-page CSS and JavaScript, the established preview-to-download CTA, and the Sleep custom product page (`ppid=67cb8784-2b16-4849-b940-90fdf4d99752`).

Copy focuses on a practical bedtime setup: preview the strongest wave, keep the volume low enough to hear important sounds, choose a timer, and compare ocean rhythm with steadier rain or more variable wind. It avoids cure, treatment, insomnia and guaranteed-sleep claims.

## SEO and discovery

- Primary phrase: `ocean waves for sleeping`
- Secondary phrases: `ocean sounds for sleep`, `waves no music`, `sleep sounds with timer`
- Self-referencing canonical, Open Graph/Twitter metadata, WebPage, ImageObject, SoftwareApplication and FAQ schema
- Contextual links from `/guides/`, `/sleep-sounds/` and `/ocean-waves-for-focus/`
- Reciprocal links to the focus-ocean page and other sleep textures
- Add the route to `sitemap.xml` and guides ItemList without changing unrelated products or domains

## Verification

- Extend site tests for the route, canonical, audio asset, Sleep ppid and sitemap entry
- Extend the production deploy guard for the new route and ocean audio
- Run protected runtime checks, site tests, production build and Playwright funnel tests
- Inspect the page at 390 px for overflow and verify real preview playback reveals the App Store CTA
- Publish only after the branch is reviewed, merged and the production tree matches the tested tree
