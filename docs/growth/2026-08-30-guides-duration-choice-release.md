# Guides Meditation Duration Choice Release — 2026-08-30

## Scope

This release changes and promotes only Yixiu. Maker, OneLaser, Wendao, Style Atlas, Xiazi and every other product were not modified or used for distribution.

The existing Pinterest decision Pin promises a direct choice between one-minute and 20-minute meditation music. The Guides landing page now delivers that choice immediately after its general hero without replacing the hub's sleep, focus and study intent or adding a duplicate comparison page.

## Live experience

- Public page: https://yixiu.wonderelian.com/guides/
- Page title: `Choose Nature Sounds & Meditation Music Guides | Yixiu`
- Decision heading: `One minute or twenty?`
- First Breath: complete 88-second web track
- Still Water: complete 21-minute web track
- Both web-track links emit `yixiu_duration_choice` with separate placements.
- The iPhone link emits `yixiu_download_click` with placement `guides_duration_choice` and preserves the shared Apple campaign `yixiu_h5_20260827`.
- The visible FAQ and `FAQPage` JSON-LD contain the same duration-choice answer.

The web-free statement applies only to the two complete tracks shown. The App Store CTA says `Explore Yixiu for iPhone` and does not claim that every app track is free.

## Verification and deployment

- Implementation PR: https://github.com/Yonge6/yixiu-meditation/pull/178
- Deployment-guard PR: https://github.com/Yonge6/yixiu-meditation/pull/179
- Production merge commit: `62ca9f570cc788a716b043cd80897e5d9eb1b62a`
- Site tests: 42/42 passed.
- Runtime and funnel tests: 55/55 passed.
- Protected runtime integrity: 28/28 passed as part of the production build.
- Production build: passed.
- Deployment script syntax: passed.
- Local and production 390-pixel checks: no horizontal overflow; one H1; both track destinations, all three analytics placements, shared Apple attribution, versioned CSS and visible FAQ were present.
- Release ID: `20260830-62ca9f5-guides-duration-0934`
- Deployment receipt: `DEPLOY_OK_YIXIU_20260830-62ca9f5-guides-duration-0934`
- Local archive: `/tmp/yixiu-20260830-62ca9f5-guides-duration-0934.tar.gz`
- Archive SHA256: `3868daac5d22a51d0a631a42125b1f1505ef1632b684e341289dbfc3e118961a`
- Rollback backup: `/srv/wonderelian/backups/yixiu-20260830-62ca9f5-guides-duration-0934`
- Retained server artifacts: `/srv/wonderelian/backups/yixiu-20260830-62ca9f5-guides-duration-0934/release-artifacts/`

Local build, server and public HTTPS SHA256 values matched exactly:

- Guides HTML: `43f408761d9d0ab43f40a71a24051e93c99927096ec295d543b3c13b72500306`
- `discover.css`: `fd289037a71642db9c1e7e78ba72edd691e3566ca5eff7cbfbbf37233bfbe1dc`
- sitemap: `d6fac695316111eeb4c1be970a2bf9ba70af4b9b403a20c7f02c8a9f640c9cbd`

Guides, First Breath and Still Water each returned HTTP 200. The guarded deployment checked the staged module, the deployed files and the server's own HTTPS origin before returning success.

## Discovery receipt

IndexNow accepted Guides and the sitemap with HTTP 200. This is a discovery receipt only; it does not prove crawling, indexing, ranking, impressions, clicks or H5 users.

## Authoritative outcome boundary

The official GA4 Data API refresh completed with `data_through=2026-08-29`. For the completed Beijing natural day 2026-08-29, filtered to the exact hostname `yixiu.wonderelian.com`, it reports:

- H5 active users / UV: 21
- page views: 43
- sessions: 32
- shortfall to the 100-UV gate: 79

Retained Apple official evidence proves 10 first-time downloads and 4 redownloads through 2026-08-28. No newer Apple report was obtained in this release. Campaign-specific downloads, product-page views, trial starts, paid conversions, subscriptions, in-app purchases and revenue remain `null` where current official evidence is unavailable.

This release proves a live, attributable duration-choice path. It does not prove a visit caused by the new module, a new App download or completion of the overall growth goal.
