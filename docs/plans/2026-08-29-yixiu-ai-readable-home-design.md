# Yixiu AI-Readable Home Design

Date: 2026-08-29

## Objective

Make the existing Yixiu homepage and intent inventory understandable to non-JavaScript crawlers and easier for AI agents to connect to the curated `/llms.txt` routing file. Do not create another keyword page, change another product, or claim that crawler access guarantees citations or visitors.

## Evidence

The exact-hostname GA4 Data API reports `chatgpt.com / ai-assistant` as the strongest identifiable external source on the incomplete 2026-08-29 Beijing day, with four active users and five sessions. The current public root HTML returns HTTP 200 but its `#root` contains only one App Store fallback link; the sound-library content appears only after the JavaScript bundle runs. The 22 intent pages, Guides and Privacy already provide static HTML, unique canonicals and crawlable text.

The public `robots.txt` allows all paths, and OAI-SearchBot is not blocked. OpenAI's publisher guidance says OAI-SearchBot must be allowed for content to be included in ChatGPT summaries and snippets. The current llms.txt v2 proposal recommends linking pages to the covering `llms.txt` with `rel="describedby"`, while keeping the curated `/llms.txt` small enough for agents to route to detailed pages.

## Options considered

1. Add another intent page. Rejected because Search Console has no query rows and the site already has a broad set of intent pages; another page would risk duplication without demand evidence.
2. Add page-level Markdown mirrors. Deferred because the current Yixiu Nginx MIME configuration does not map `.md` to a text media type, and changing shared MIME configuration would expand operational scope.
3. Add a static semantic fallback to the existing homepage and declare `/llms.txt` from every sitemap HTML page. Selected because it repairs the proven no-JavaScript thin-home gap, uses existing canonical pages, and requires no new crawler-consent policy.

## Implementation

### Homepage fallback

Replace the single fallback App Store link inside `#root` with a compact semantic `<main>` containing:

- one truthful H1 describing free nature sounds for sleep and focus;
- a short product summary with the existing no-music, no-talking, no-account and no-ads boundaries;
- direct links to Sleep Sounds, Focus Sounds, Best Sleep Sounds, Study Comparison, Meditation, Guides and the App Store;
- no medical, guaranteed-outcome, ratings, review or download-count claims.

React continues to replace this fallback after JavaScript loads, so the visible application and protected mobile runtime remain unchanged.

### Discovery declaration

Add `<link rel="describedby" href="/llms.txt" type="text/plain" />` to the root and every human-facing HTML URL in the sitemap. Do not modify the Google verification file or robots policy.

## Verification

- Add static tests requiring the semantic root fallback, exact Yixiu-only links and no prohibited claims.
- Parse the sitemap and require every HTML URL to expose one `/llms.txt` described-by relation.
- Run `npm run check:runtime`, `npm run build`, `npm run test:sites`, and the protected Playwright suite.
- Verify built HTML preserves the fallback and described-by relation.
- Deploy only after PR merge using the existing guarded Nginx release script.
- Require source, server and public hashes for the root HTML and one representative intent page; public root must expose the semantic fallback before client JavaScript.
- Test the root and representative intent pages with OAI-SearchBot user-agent and require HTTP 200 without a challenge.
- Submit the root, `/llms.txt` and sitemap through the existing IndexNow path and treat HTTP 200 as a receipt only.
- Refresh exact-hostname GA4. A missing or unchanged AI referral row remains a non-result, not evidence of zero demand.

## Success boundary

This release is complete only when production proves the server-readable fallback and discovery declarations. The long-term goal remains active until one completed Beijing natural day reaches at least 100 exact-hostname GA4 active users. Apple official evidence remains 10 first-time downloads and 4 redownloads through 2026-08-26; campaign downloads, trials, paid conversions, subscriptions, in-app purchases and revenue remain `null` where official evidence is unavailable.
