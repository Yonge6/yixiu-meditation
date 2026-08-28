# Study Sounds Comparison Distribution Design

## Context and decision

The existing `/best-nature-sounds-for-studying/` page is the only Yixiu page that lets a visitor compare three real recordings in one place. Its technical baseline is healthy: one H1, a self-canonical, complete image alt text, a 54-character title, successful build, 33 passing site tests and an intact protected mobile runtime. However, the page has no dedicated Pinterest distribution artifact, its visual offer is still a single river backdrop, and the structured `ItemList` sends the Rain comparison to the broad sleep page even though a distinct Rain Sounds for Studying page now exists.

Three approaches were considered:

1. Publish another single-scene video. This is quick, but it repeats the scene-led inventory already covering rain, river and ocean without giving the comparison page a native reason to be saved.
2. Create another keyword landing page. Search Console still has too little query evidence to justify more near-duplicate inventory, and the existing comparison page already matches the commercial-investigation intent.
3. Upgrade the existing comparison page with a useful three-sound decision graphic, correct the stale Rain link, and distribute the same graphic as a native Pinterest Pin. This is selected because it improves the owned page and creates a distinct, directly attributable acquisition surface without inventing a new sound or touching another product.

The user's standing instruction to autonomously grow Yixiu validates the selected approach. The release remains limited to Yixiu-owned files, the WonderElian Pinterest account and the existing Yixiu board.

## Creative and page change

Create a 1000×1500 vertical graphic from the existing licensed Yixiu Spring Creek, Window Rain and Ocean Waves scene art. The hierarchy is:

- `WHICH NATURE SOUND FITS YOUR STUDY SESSION?`
- `RIVER — Reading & writing / Gentle movement`
- `RAIN — Noisy shared rooms / Even texture`
- `OCEAN — Repetitive practice / Slow rhythm`
- `Try each at low volume. Choose the one you notice least.`
- `COMPARE 3 REAL SOUNDS · YIXIU`

The graphic must remain legible at Pinterest card size, use no health or performance guarantee, and disclose generative modification on Pinterest because the source scene art has generative provenance. Add the graphic as a below-fold `<figure>` on the comparison page with descriptive alt text, intrinsic dimensions and lazy loading. Update the Article `dateModified`, add an `ImageObject` node for the new visual, and change the Rain `ItemList` URL to `/rain-sounds-for-studying/`. Keep the page's current title, canonical, H1 and three real audio previews.

## Distribution and attribution

Publish one static Pin from `WonderElian` to `Yixiu: Nature Sounds & Sleep` with this destination:

`https://yixiu.wonderelian.com/best-nature-sounds-for-studying/?utm_source=pinterest&utm_medium=organic_infographic&utm_campaign=focus_sounds&utm_content=study_sounds_comparison_pin_01`

Suggested title: `Best Nature Sounds for Studying: River, Rain or Ocean?`

The description should explain the three use cases, invite the reader to compare the recordings at low volume, and accurately state Yixiu's no-music, no-talking, no-account and no-ads product constraints. Enable AI-modified disclosure, disable similar-product recommendations, keep comments enabled and add only relevant studying and nature-sound topics. Do not add collaborators, product tags, paid promotion, cross-posting or another product.

## Acceptance

Before publication, require deterministic dimensions, file size and SHA-256 plus visual inspection at full size and card scale. Extend the site test to lock the new image, alt text, corrected Rain URL, schema date and asset presence. Then require runtime integrity, build, site tests, complete Playwright runtime tests, JSON-LD parsing, link checks and 390px visual QA with no horizontal overflow.

Deploy with the existing Nginx release script, preserve a server backup and release archive, and prove source/server/public hashes for the updated page and image. Submit the page, Guides and sitemap through IndexNow. After Pinterest publication, require a permanent public Pin URL, correct WonderElian account and Yixiu board, exact destination and copy, AI disclosure, public HTTP 200, oEmbed resolution and logged-out HTML evidence.

Publication proves a new attributable acquisition surface, not traffic or downloads. Completed-day H5 success still requires authoritative exact-hostname GA4 evidence of at least 100 active users. Apple downloads remain governed by official App Store Connect evidence; unavailable trial, paid, subscription, in-app-purchase, revenue and download-click metrics remain `null`.
