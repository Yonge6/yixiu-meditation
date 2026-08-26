# Forest Sounds for Focus search entry

## Goal

Create one English acquisition page for the existing Yixiu Sunny Valley scene. The page targets the distinct `forest sounds for focus` intent and moves visitors from a truthful free preview to the existing Focus App Store product page.

## Why this page

- Google Search Console currently shows almost no search visibility, so the next change should add a crawlable entry rather than rearrange an already-valid homepage.
- Yixiu already owns a matching 125-second licensed recording, `forest-breeze.m4a`, described in the audio ledger as a windy humming forest with birds.
- Current Yixiu pages cover morning birds, rivers, rain, ocean, waterfalls and mountain wind, but no page maps the forest-wind recording to a search intent.
- Current search results contain forest-focus pages, while some competing pages do not offer an immediate audio preview. Yixiu can offer the preview without inventing medical or performance claims.

## Page contract

- URL: `/forest-sounds-for-focus/`
- Primary keyword: `forest sounds for focus`
- Preview: `/assets/yixiu/audio/forest-breeze.m4a`
- Scene: `valley`
- Hero: `/assets/yixiu/sunny-valley.png`
- Download destination: the existing Focus custom product page for App ID `1461182261`
- Analytics placements: `forest_focus_preview`, `forest_focus_landing`, and `forest_focus_after_preview`

The page uses the existing intent-page layout, shared CSS, analytics, preview behavior and attributed share loop. It includes one H1, a self-canonical URL, aligned social metadata, truthful SoftwareApplication and FAQ structured data, visible FAQ answers, and contextual links to the focus hub, morning birds, mountain stream and all guides.

## Verification

- Static tests validate title and description lengths, one H1, schema-to-visible FAQ parity, exact image and audio assets, Focus App Store path, analytics placements, and internal links.
- The sitemap and Guides ItemList include the new URL.
- The protected mobile runtime check, production build and full site tests pass.
- A 390-pixel browser check proves no horizontal overflow and successful preview playback.
- Production acceptance requires public HTTP 200, matching deployed source hashes, reachable image/audio assets and a successful search-engine submission.
