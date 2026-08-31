# Bing noise-generator expansion — design

## Evidence

The GA4 Data API was refreshed at `2026-08-31T06:43:20Z` with property `549913650` and an exact `hostName == yixiu.wonderelian.com` filter. The latest complete Beijing natural day, 2026-08-30, remains at 13 active users, 15 sessions and 24 page views. The incomplete 2026-08-31 day had reached 21 active users, 23 sessions and 28 page views.

The strongest new landing-page signal was `/free-online-sound-machine/`: six active users and six sessions, including four active users and four sessions from `bing / organic`. Public Bing related-search suggestions around the current query space included `free online noise generator`, `free background noise generator`, `free noise generator for sleep`, `free online noise machine`, `sound machine for sleeping free` and `sound machine noise online`. Public exact-site searches did not yet expose the Yixiu canonical, so the GA4 source row is used as directional evidence without guessing the visitor's exact query.

The live canonical is HTTP 200, included in the 27-URL sitemap, allowed by `robots.txt`, self-canonical, mobile-responsive and already exposes WebApplication, ItemList, SoftwareApplication and visible-matching FAQPage data. Its title, description, H1, first-play action, timer and ten real recordings should be preserved because the page only launched and began receiving Bing traffic today.

## Options

1. **Expand the existing page with honest alternate terminology.** Add `Free Online Noise Machine` and `Free Online Noise Generator` as WebApplication alternate names, use `free online noise machine` naturally in the first-screen explanation, and add one visible/schema-matched FAQ explaining that Yixiu plays real recordings rather than synthesizing adjustable frequency tones.
2. Create `/free-online-noise-generator/`. This would duplicate the same intent, split authority, increase crawl overhead and risk canonical ambiguity.
3. Rewrite the title and URL around `noise generator`. This would disturb the exact sound-machine promise that already produced Bing traffic, while no authoritative query row proves a stronger replacement term.

Option 1 is selected. It broadens the page's vocabulary without changing the canonical, main title, primary H1, search promise or product behavior.

## Implementation and acceptance

- Add `alternateName` values to the existing WebApplication JSON-LD object.
- Extend the first-screen lede with one natural `free online noise machine` sentence fragment.
- Add a fifth FAQ question and answer in both visible HTML and FAQPage JSON-LD. The answer must distinguish recorded sound textures from a synthetic tone/frequency generator and avoid unsupported sleep or health claims.
- Add focused tests for the alternate names and exact visible/schema FAQ match.
- Preserve one H1, the canonical, title, meta description, ten unique recordings, timer, App Store paths, analytics placements and internal links.
- Pass protected-runtime checks, static-site tests, production build and rendered desktop/mobile QA.
- Deploy with rollback artifacts, verify public hashes/HTTP/audio interaction, and submit only the changed canonical through IndexNow. Do not duplicate today's Google priority-crawl request.
- Treat ranking, impressions, clicks, H5 users and App outcomes as `null` until authoritative reporting appears.
