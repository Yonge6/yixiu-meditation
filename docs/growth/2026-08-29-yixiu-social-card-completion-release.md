# Yixiu social-card completion release — 2026-08-29

## Scope

This release is confined to Yixiu. It does not modify or add referrals to Maker, OneLaser, Wendao, Style Atlas or any other product.

The sitemap and public HTML audit found four shareable Yixiu pages without complete large-image social metadata: the root page, Focus Sounds, Ocean Waves for Focus and One-Minute Reset. All 23 shareable sitemap pages now require and expose `summary_large_image`, matching Open Graph/Twitter images, image dimensions and non-empty image alt text. Privacy remains intentionally excluded from the share-card requirement.

The SEO workflow drove the collection-wide metadata and sitemap audit before editing. The Code workflow turned that audit into a site-wide regression test so a later page cannot silently omit the same fields.

## Git and test evidence

- Feature commit: `1f1d58d` (`feat: complete Yixiu social cards`)
- Pull request: <https://github.com/Yonge6/yixiu-meditation/pull/155>
- Merge commit: `879ffffab7587444fe52fad2affcf996a2945e8c`
- Protected mobile runtime: 28 files passed
- Site tests: 39/39 passed
- Playwright browser suite: 52/52 passed
- Production build: passed

## Production release evidence

- Release ID: `20260829-879ffff-social-cards-2217`
- Exact deployed commit: `879ffffab7587444fe52fad2affcf996a2945e8c`
- Deployment time: `2026-08-29T14:19:03Z`
- Archive SHA-256: `3c0c2c8fa3ca376a6609d8ebfba3290fd7cbafb89271846f1f3fd403927e9563`
- Rollback backup: `/srv/wonderelian/backups/yixiu-20260829-879ffff-social-cards-2217`
- Retained artifacts: `/srv/wonderelian/backups/yixiu-20260829-879ffff-social-cards-2217/release-artifacts/`
- Nginx configuration validation and reload: passed

Source, deployed-server and public HTTPS response hashes matched:

| File | SHA-256 |
| --- | --- |
| `index.html` | `17a7cf66e4233a22cee5f5b5592d83b7298306b2108674a1e90b86052f2cfbf7` |
| `focus-sounds/index.html` | `3107d65e65742d8d14fbe6a911301caaf9665c832d08958e618d52bdb2d070af` |
| `ocean-waves-for-focus/index.html` | `05e54ad5a13206d66f9df3d866841413ee8af347925fa43a7415088edad15ba9` |
| `one-minute-reset/index.html` | `91aca11a5944d11574ba297a82f63c388bc0d3643ece31e7a4f9705e8e351bbc` |
| `sitemap.xml` | `c18653d9cf82e2f9c0ad52432501a906969f615073a4ae15de7bcbbb1ecc5690` |

All four changed public pages, all four public share images and the sitemap returned HTTP 200. A separate acceptance pass confirmed all 24 sitemap URLs returned HTTP 200 and all four changed pages exposed the required public social metadata.

IndexNow accepted one request containing the four changed pages and `sitemap.xml` with HTTP 200. This is a submission receipt only; it does not prove crawling, ranking, referrals or visitors.

## Goal boundary after release

The latest exact-hostname GA4 readback remains:

- Completed 2026-08-28 Beijing day: 26 active users, 41 page views and 33 sessions.
- Incomplete 2026-08-29 Beijing day at the readback: 17 active users, 34 page views and 28 sessions.
- No `yixiu_download_click` event was present in the 2026-08-29 event rows.

Apple official App Analytics already proves 10 first-time downloads and 4 redownloads in the 90-day period through 2026-08-28. The daily 2026-08-24 through 2026-08-28 rows display a dash, not a confirmed zero. Campaign downloads, trials, paid conversions, subscriptions, in-app purchases and revenue remain `null` because no official evidence for them has been obtained.

The completed-day H5 requirement is still below 100 active users, so the long-running growth goal remains active and is not declared complete.
