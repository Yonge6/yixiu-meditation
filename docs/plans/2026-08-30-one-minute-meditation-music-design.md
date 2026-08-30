# One-minute meditation music landing design — 2026-08-30

## Problem and evidence

Yixiu's free `First Breath` meditation track currently opens through a parameterized home-player URL. That is playable, but it does not answer the search and social promise before the user interacts. Current Google Search Console exposure is still very small, while Pinterest and Instagram are identifiable acquisition surfaces. A stable intent page can serve both discovery and conversion without changing the protected H5 player or the iOS app.

Current search results for `1 minute meditation music` are dominated by music stores, stock-audio pages, video results and account-based meditation platforms. Yixiu's useful difference is concrete: the complete 88-second track plays in the browser, without an account or an ad break, and the creator and CC BY 4.0 license are visible.

## Options considered

1. Keep the parameterized player only. This is the smallest change, but the page title, metadata and visible copy remain generic.
2. Add a thin campaign redirect. This creates a stable URL but does not add indexable value or explain the track and license.
3. Add a dedicated, full-track intent page. This reuses the established Yixiu guide layout, gives search and social visitors an immediate answer, and provides a measurable App Store continuation. This is the selected approach.

## Selected page

- Route: `/1-minute-meditation-music/`
- Primary intent: `1 minute meditation music`
- Track: `First Breath`, complete 88-second audio
- Promise: full track, free online, no account, no ads, no spoken guidance
- Primary action: play the complete track
- Secondary action: attributed App Store continuation
- Trust: visible creator, original track name, CC BY 4.0 link and source page
- Supporting content: a three-step one-minute practice, track details, four visible FAQs and related Yixiu paths
- Structured data: `WebPage`, `ImageObject`, `AudioObject`, `SoftwareApplication`, `FAQPage` and breadcrumbs matching visible content

## Discovery and measurement

The page will be linked from `/guides/`, `/nature-sounds-for-meditation/`, the 20-minute meditation page and `llms.txt`; it will be added to the sitemap. The existing First Breath Pinterest Pin can then be edited to the dedicated page while keeping its UTM values. The App Store links will use a dedicated `yixiu_h5_first_breath_20260830` campaign token and distinct landing/post-play analytics placements.

## Acceptance

- source tests cover metadata, canonical, schema, full audio, license, App Store campaign and internal discovery;
- protected runtime check, build and site tests pass;
- the page has one H1, a self-canonical, visible FAQ matching JSON-LD and no unsupported health claims;
- 390 px browser rendering has no horizontal overflow;
- the full audio starts on one click and exposes the post-play App CTA;
- production HTML and media hashes match the release source;
- public URL, sitemap, guides and destinations return HTTP `200`;
- IndexNow and Google Search Console submission are recorded as requests, not indexing proof.
