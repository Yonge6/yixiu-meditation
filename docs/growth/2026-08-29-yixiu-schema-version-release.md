# Yixiu App Version Schema Release — 2026-08-29

## Scope and decision

This release changes only Yixiu. It does not modify, publish through, or add referrals to Maker, OneLaser, Wendao, Style Atlas, or any other product.

A production SEO audit checked all 24 sitemap URLs and 22 content landing pages. Every sitemap URL returned HTTP 200. Every content landing page had a unique title, exactly one H1, a canonical URL, JSON-LD, and no `noindex`. The audit found 263 internal links and no broken local targets. Because an existing sleep-intent page was already public, the selected action fixed a factual structured-data defect instead of creating a duplicate page.

Apple's official Lookup API returned App ID `1461182261`, name `Yixiu: White Noise & Sleep`, version `1.4`, and current-version release date `2026-08-26T21:12:30Z`. Fourteen public pages still declared `SoftwareApplication.softwareVersion` as `1.3`. The release updates those pages and adds the field to the two public application pages that did not previously expose a version, so all 23 public application pages now declare `1.4`.

## Implementation and regression protection

- Implementation PR: `https://github.com/Yonge6/yixiu-meditation/pull/162`
- Merge commit: `d07bf7ff3e58ab986e44e4a613f77e53b0a82644`
- Site regression test walks all 23 public application pages and requires version `1.4`.
- Production deployment guard requires exactly 23 built and deployed HTML files with version `1.4`.
- Sitemap `lastmod` values were refreshed only for pages changed by this release.

Local verification:

- Protected mobile runtime checks: 28/28 passed.
- Production build: passed.
- Site tests: 40/40 passed.
- Serialized Playwright runtime suite: 52/52 passed.
- Deployment-script syntax check: passed.
- `git diff --check`: passed.

The first parallel runtime run passed 51/52 because the unrelated protected keyboard-drag timing test was flaky. Its isolated repeat passed 2/3, and the complete serialized suite passed 52/52. The protected runtime was not modified.

## Production result

- Release ID: `20260829-d07bf7f-schema-version-2335`
- Deploy result: `DEPLOY_OK_YIXIU_20260829-d07bf7f-schema-version-2335`
- Local archive: `/tmp/yixiu-20260829-d07bf7f-schema-version-2335.tar.gz`
- Archive SHA-256: `c928b81ea4ba2b89f341bcddf157c529db479997e2eaa9688b8df5b9892a73d5`
- Deploy-script SHA-256: `2c8b6182049eadce3884d027b3df4e4e62322a0f825635c13d659371299ab652`
- Server backup: `/srv/wonderelian/backups/yixiu-20260829-d07bf7f-schema-version-2335`
- Retained artifacts: `/srv/wonderelian/backups/yixiu-20260829-d07bf7f-schema-version-2335/release-artifacts/`

The guarded deployment verified archive and script hashes, created a complete backup, passed staged and deployed content checks, passed `nginx -t`, reloaded Nginx, and passed loopback HTTPS verification.

Independent public acceptance fetched all 23 application pages after deployment:

- 23/23 returned HTTP 200.
- 23/23 declared `SoftwareApplication.softwareVersion` as `1.4`.
- 23/23 public response bodies were byte-identical to the merge-commit build.
- The production filesystem contained exactly 23 matching schema declarations.

IndexNow returned HTTP 200 for the 16 changed public URLs plus the sitemap, 17 URLs total. This proves submission receipt only; it does not prove crawling, indexing, ranking, H5 users, or App downloads.

## Authoritative growth boundary

The post-release GA4 Data API refresh used exact hostname `yixiu.wonderelian.com` and was imported at `2026-08-29T15:40:18.791Z`:

- Completed Beijing natural day 2026-08-28: 26 active users, 41 page views, and 33 sessions.
- Incomplete Beijing day 2026-08-29: 18 active users, 35 page views, and 30 sessions.

The incomplete day is recorded for context only and cannot satisfy the daily target. The provider returned no download-event observation in this refresh, so it does not establish download CTA activity or campaign attribution. The completed-day H5 result remains below 100 UV.

Retained Apple official evidence proves 10 first-time downloads and 4 redownloads through 2026-08-26. Campaign-specific downloads, trials, paid conversions, subscriptions, in-app purchases, and revenue remain `null` where official evidence is unavailable. This incremental release is complete, but the overall growth goal is not complete.
