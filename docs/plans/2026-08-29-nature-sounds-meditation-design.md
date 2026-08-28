# Nature Sounds for Meditation Search Entry — Design

## Purpose

Yixiu currently has dedicated search pages for sleep, focus, study and noise masking, but no canonical page for the product's core meditation use case. Current public search results for `nature sounds for meditation` commonly combine three expectations: immediate playback, a choice among water/forest/rain textures, and a timer or simple practice suggestion. The new page will answer that intent without making clinical claims or adding a new sound.

## Chosen approach

Create `/nature-sounds-for-meditation/` as a product-led listening guide. The first 100 words will state that the page offers real nature sounds, no music or talking, a free browser preview and a 15/30/60-minute timer. Spring Creek will be the first preview because its existing `sunrise-river.m4a` recording is not yet represented by a dedicated search page. Forest wind, light rain and ocean waves remain available as alternative preview buttons on the same canonical page rather than as new overlapping meditation pages.

The page will reuse the existing intent-page layout, playback controller, timer, share flow and attributed App Store campaign. It will add WebPage, AudioObject, SoftwareApplication and visible FAQPage data. Copy will frame sound as an optional attention anchor and preference, not as treatment, guaranteed relaxation or a substitute for care.

## Discovery and measurement

Add the page to the sitemap and Guides collection, plus contextual links from the one-minute reset and forest-focus pages. Every page remains reachable within two clicks from the homepage. Extend the shared timer analytics so a timer root can declare its own placement; existing pages retain their current default.

Acceptance requires one H1, a unique 50-60-character title, a 150-160-character description, exact canonical/OG URLs, four visible FAQ entries matching schema, four real audio preview controls, preserved Apple `pt`/`ct`/`mt` attribution, mobile rendering without overflow, passing runtime/build/site/Playwright tests, production hash agreement, public HTTP 200, and search-engine submission receipts. Publication and indexing receipts will not be counted as UV or downloads.
