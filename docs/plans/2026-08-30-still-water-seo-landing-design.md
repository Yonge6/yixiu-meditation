# Still Water SEO landing page

## Goal

Create one crawlable English landing page for the full Still Water track so search and Pinterest visitors can listen immediately, understand the source, and continue to the iPhone app through a dedicated attribution link.

## Search intent

- Primary query: `20 minute meditation music`
- Secondary queries: `20 minute meditation music for sleep`, `meditation music for deep focus`, `free meditation music`
- Intent: listen now, then decide whether the same track belongs in a sleep, meditation, reading, or focus routine.

## Page and conversion

- Canonical route: `/20-minute-meditation-music/`
- First screen: exact-query H1, full-track play button, duration/source facts, and an App Store CTA.
- App Store attribution: `ct=yixiu_h5_still_water_20260830`, with placements specific to this page.
- No outcome promises. The copy describes music as optional background audio.
- The public app schema remains version 1.4 until Apple publishes a newer version.

## Trust and discovery

- Name the source track and creator, link to the Free Music Archive album, and state CC0 1.0 accurately.
- Expose matching WebPage, ImageObject, AudioObject, SoftwareApplication, FAQPage, and BreadcrumbList schema.
- Add the page to the sitemap, `llms.txt`, the guide hub, and the existing meditation page.
- Extend site tests and production deployment guards so the page, media, metadata, attribution, and live response cannot drift silently.

## Acceptance

- Local site tests and production build pass.
- 390 px browser view has no horizontal overflow.
- The real Still Water file starts from the page and the post-play download CTA appears.
- Production returns the canonical HTML and byte-range audio response.
- Sitemap and AI-readable index list the new canonical URL.

