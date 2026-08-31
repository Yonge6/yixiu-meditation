# Thunderstorm search CTR optimization design — 2026-08-31

## Signal

Google Search Console's latest available page report shows `/thunderstorm-sounds-for-sleep/` with four impressions, zero clicks and an average position of 9.3. Query rows are still hidden, so the page keeps its established primary intent instead of guessing a new keyword.

## Options

1. Publish another thunder Pin. A direct thunder Pin already exists and the personal Pinterest account does not expose Analytics without a business-account conversion.
2. Edit the existing Pin. It already points to this canonical page, so changing it would not repair the zero-CTR Google surface.
3. Improve the existing search result promise and matching first screen. This acts on the only current near-page-one signal without creating duplicate content.

Option 3 is selected.

## Treatment

- Keep the canonical URL and the exact leading query `Thunderstorm Sounds for Sleep`.
- Replace the passive title suffix with `Free Preview`, producing a 52-character title.
- Rewrite the 156-character meta description to lead with `Play free`, state the real distant-thunder/light-rain content, and distinguish the browser preview from iPhone timer/background playback.
- Align Open Graph, Twitter and WebPage schema copy with the same truthful promise.
- Make the H1 and first-screen trust line explicitly state that the browser preview is free.
- Update only this page's sitemap `lastmod` and llms.txt description.

The recording, image, canonical, URL, App Store custom product page, Apple campaign parameters, analytics placements, FAQ and internal destinations remain unchanged.

## Acceptance

- Title is 50–60 characters and begins with the primary phrase.
- Meta description is 150–160 characters and includes the primary phrase plus `Play free`.
- One H1, canonical, indexability, image, real audio, structured data and App Store routing remain valid.
- Static tests, protected-runtime check and production build pass.
- Mobile and desktop rendered QA show the updated first screen without overflow.
- Production returns the new title, description, H1 and trust line; IndexNow and Google URL Inspection are requested only after deployment.

Search discovery receipts and copy changes do not prove impressions, clicks, H5 UV or App downloads. Those outcomes require later authoritative reporting.
