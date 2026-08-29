# Best Sleep Sounds Comparison Design — 2026-08-29

## Context and decision

The refreshed exact-hostname GA4 report still shows 13 active users for the incomplete 2026-08-29 Beijing day. ChatGPT is the strongest identifiable external source at four active users, while `/sleep-sounds` is the strongest named landing at six active users. Existing rain Pinterest, YouTube description and Community paths are already public, and several new social assets were published today. Repeating the same rain message again would increase publishing density without opening a new discovery intent.

Three options were considered. Another social post offers the fastest publication but is too close to existing rain and white-noise releases. Another conversion-only change would improve a page that has just been optimized but would not expand acquisition. A dedicated sleep-sound comparison page creates a broader search and AI-discovery entry while reusing verified Yixiu recordings and dedicated intent pages. The comparison page is selected because it adds a distinct choice-oriented intent without changing another product, inventing a new recording or claiming that one sound works for everyone.

## Page design

Create `/best-sleep-sounds/` as a product-led listening comparison. The first screen states that there is no universal best sleep sound and invites the listener to compare at a low volume. Seven existing recordings are available in one grid: Window Rain, Ocean Waves, Forest Breeze, Distant Thunder, Mountain Wind, Underwater White Noise and Forest Waterfall. Every preview links to its existing dedicated Yixiu page so the comparison consolidates, rather than competes with, the narrower pages.

The page uses the existing intent-page components, Window Rain backdrop and shared player. It adds no CSS or JavaScript behavior. A shared 15/30/60-minute timer applies to whichever preview is active. Successful playback reveals one status CTA next to the comparison: `Found a sound you want to keep after locking your iPhone? Continue in Yixiu.` The CTA preserves the Sleep custom product page, Partner Token, campaign token and `yixiu_download_click` event with new placement `best_sleep_sounds_after_preview`.

Copy describes audible texture only: even rain, periodic waves, open forest air, intermittent thunder, moving wind, low steady underwater noise and dense waterfall. It avoids medical claims, sleep guarantees, rankings, fabricated reviews and unsupported popularity statements.

## Discovery, data and safety

The page exposes truthful `CollectionPage`, `ItemList`, `SoftwareApplication` and `FAQPage` structured data. Guides gains one comparison card and a 21st list item. Sitemap and `llms.txt` gain the canonical page, providing Google, IndexNow and AI-discovery inventory without creating external referrals or changing crawler policy.

Analytics reuse the existing `yixiu_landing_view`, `yixiu_playback_start`, share and download events. Preview placements are unique per texture under `best_sleep_sounds_*`. Publication proves only a live Yixiu discovery surface. Search submission is a crawl receipt, not evidence of ranking or traffic. Diagnostic visits are not counted as organic users. Apple campaign downloads, trials, subscriptions, purchases and revenue remain `null` unless official evidence appears.

Acceptance requires static semantic checks for all seven real audio assets and dedicated links; schema, sitemap, Guides, `llms.txt` and deployment guards; mobile playback of the first and last options; timer movement; App attribution; no horizontal overflow; production build; guarded deployment; public source/server/hash equality; live desktop Chrome interaction; and an exact-hostname GA4 refresh. The long-term goal remains active until a completed Beijing natural day reaches 100 active users.
