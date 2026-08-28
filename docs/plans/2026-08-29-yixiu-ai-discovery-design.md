# Yixiu AI Discovery Entry Design

## Decision context

The latest completed-day acquisition evidence does not support another near-duplicate search landing page. Google Search Console still exposes only seven impressions and no query rows, while the exact-hostname GA4 report shows `chatgpt.com / ai-assistant` as the strongest identifiable external source on 2026-08-28. The selected change therefore improves machine-readable discovery of the existing Yixiu collection instead of creating new intent inventory.

Three approaches were considered:

1. Add another search landing page. This has a longer crawl and ranking delay, risks keyword cannibalization, and is not supported by a new Search Console query.
2. Publish another social asset. This can create short-lived reach, but the completed-day source table shows only one active user for each Instagram source and no verified Pinterest user.
3. Add an AI-readable site guide. This is the recommendation because it maps the complete existing Yixiu collection, gives assistants stable canonical destinations, and directly follows the strongest currently identifiable external source without changing another product.

## Artifact

Add `/llms.txt` as concise Markdown following the public llms.txt proposal structure:

- one H1 naming Yixiu;
- one blockquote stating the truthful product purpose;
- a short product summary with the App Store URL and the no-account/no-ads boundary;
- grouped canonical links for primary listening paths, sleep, focus/study, meditation/reset, and trust/discovery files;
- short descriptions that distinguish each page without medical, guaranteed-outcome, rating, or fabricated-review claims.

The file will not expose private analytics, internal release identifiers, credentials, unpublished assets, or other WonderElian products. It will not claim that an AI crawler, search engine, assistant, ranking system, or user has consumed the file.

The existing permissive `robots.txt` already allows all user agents. It will remain unchanged so this release does not introduce a new crawler-consent policy. The deployment guard will require the new file, its exact Yixiu/App Store identity, and an HTTPS loopback response. Site tests will verify format, canonical links, truthful product statements, absence of prohibited claims, and exclusion of unrelated product domains.

## Measurement and release proof

Local acceptance requires the protected mobile runtime check, production build, site tests, and direct validation of every URL listed in `llms.txt`. Production acceptance requires an atomic release with backup, Nginx validation, matching local/server/public SHA-256 for `llms.txt`, and an HTTP 200 `text/plain` response from the public origin.

The live file and sitemap will be submitted to IndexNow for discovery. A successful submission proves receipt only. It does not prove crawling, model ingestion, citations, referrals, H5 users, or App downloads. The overall goal remains gated by at least 100 GA4 active users on one completed Beijing natural day plus official Apple download evidence.
