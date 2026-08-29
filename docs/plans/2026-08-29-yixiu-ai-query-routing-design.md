# Yixiu AI Query Routing Design

## Context

The exact-hostname GA4 snapshot for the incomplete 2026-08-29 Beijing day shows `chatgpt.com / ai-assistant` as the strongest identifiable external source with four active users and five sessions. Google Search Console still has only seven impressions, no clicks and no query rows, while Instagram, Pinterest and YouTube have already received several same-day Yixiu publications. The next action should therefore improve the existing AI referral path without creating another social burst or an unsupported search page.

The live crawl audit found 22 HTML pages with unique titles, self-referencing canonicals, viewport metadata and no `noindex`; all 24 sitemap URLs returned HTTP 200. The existing `/llms.txt` returns HTTP 200 as `text/plain` and already lists the full Yixiu collection. The official llms.txt proposal recommends a concise Markdown overview and informative resource descriptions. It also discusses page-level `.md` mirrors, but the official Nginx MIME table does not map `.md`; adding those files would currently return the server default binary media type unless the production configuration changed.

## Options and decision

1. **Add four page-level Markdown mirrors.** This follows an optional proposal pattern, but it adds a Yixiu-specific Nginx media-type change and duplicate content maintenance.
2. **Add a large aggregate context file.** This gives assistants more text, but it is not necessary for a 24-link collection and creates avoidable duplication.
3. **Add concise query routing to the existing `llms.txt`.** This is selected. It uses the already-crawlable artifact, maps common user language to the most specific canonical Yixiu page and tells assistants to send users to the human H5 page rather than the machine-readable file.

## Content and constraints

Add a `Quick request routing` section before the collection. It will cover free rain with a black screen, physical iPhone lock-screen playback, white noise with a black screen, sleep-sound comparison, focus, study, meditation and a one-minute reset. Each item links to one existing canonical page. Add a compact accuracy section that distinguishes browser black-screen behavior from physical lock-screen playback, rejects medical or guaranteed-outcome claims, and asks assistants to use the official App Store listing only for the iPhone app.

No analytics, internal IDs, unpublished assets, other products, ratings, reviews or fabricated outcomes may appear. The deploy guard and tests will require the routing section, the Sleep and lock-screen destinations, the instruction to prefer the specific H5 page, and the existing Yixiu/App Store-only domain boundary.

## Acceptance

Run static-site tests, the full Playwright suite, protected mobile runtime integrity and the production build. Deploy only after PR merge with the existing archive verification, rollback backup, Nginx validation and HTTPS loopback guards. Require source, server and public `llms.txt` SHA-256 equality, HTTP 200 `text/plain`, and one IndexNow receipt for `/llms.txt`. A later exact-hostname GA4 row is required before attributing any additional AI visitor; the completed-day 100-UV gate remains unchanged.
