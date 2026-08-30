# Guides Duration-Choice Referral Loop — 2026-08-30

## Scope

This release changes only Yixiu. It does not modify, mention, publish through or add referrals to Maker, OneLaser, Wendao, Style Atlas, Xiazi or another product.

Pinterest was the strongest named directly extensible source in the latest completed-day Yixiu acquisition readback. The existing “1 minute or 20?” Image2 infographic now supports a measurable referral loop on the live Guides duration-choice module instead of remaining only an externally published Pin asset.

## Live referral surfaces

- Public page: https://yixiu.wonderelian.com/guides/
- General share label: `Share this choice`
- Pinterest label: `Save this choice to Pinterest`
- General placement: `guides_duration_share`
- Pinterest placement: `guides_duration_pinterest`
- Campaign: `meditation_music`
- General destination: `https://yixiu.wonderelian.com/guides/?utm_source=share&utm_medium=referral&utm_campaign=meditation_music&utm_content=guides_duration_share`
- Pinterest destination: `https://yixiu.wonderelian.com/guides/?utm_source=pinterest&utm_medium=organic_share&utm_campaign=meditation_music&utm_content=guides_duration_pinterest`
- Pinterest media: `https://yixiu.wonderelian.com/assets/yixiu/meditation-duration-choice-pinterest.jpg`

Native share is preferred. When it is unavailable, the general control copies the attributed URL. Successful native shares, successful copies and Pinterest-intent clicks emit `yixiu_share`; cancelling a native share emits no share event. The existing post-play sharing flow remains unchanged.

The Guides Open Graph and Twitter image now use the same compressed 1000×1500 Image2 composition. The App Store CTA remains separately attributed with `yixiu_download_click`, placement `guides_duration_choice` and the shared Apple campaign token `yixiu_h5_20260827`.

## Verification and deployment

- Implementation PR: https://github.com/Yonge6/yixiu-meditation/pull/181
- Production merge commit: `2ae4f115728f0d73192c24e8589783bec3c17d5a`
- Site tests: 42/42 passed.
- Runtime and funnel tests: 58/58 passed, including native success, clipboard fallback, cancellation and Pinterest intent.
- Protected runtime integrity: 28/28 passed during the production build.
- Production build: passed.
- JavaScript and deployment-script syntax: passed.
- Local and production 390-pixel checks: zero horizontal overflow; both controls were visible at 48 pixels high.
- Release ID: `20260830-2ae4f11-duration-share-0947`
- Deployment receipt: `DEPLOY_OK_YIXIU_20260830-2ae4f11-duration-share-0947`
- Local archive: `/tmp/yixiu-20260830-2ae4f11-duration-share-0947.tar.gz`
- Archive SHA256: `67f0528fe37a44f55f78c9fe59a7fdcb9927af53c49f7dd9785a932113519753`
- Rollback backup: `/srv/wonderelian/backups/yixiu-20260830-2ae4f11-duration-share-0947`
- Retained server artifacts: `/srv/wonderelian/backups/yixiu-20260830-2ae4f11-duration-share-0947/release-artifacts/`

Local build, server and public HTTPS SHA256 values matched exactly:

- Guides HTML: `f5c5ef8f59d18566240a227eb905166a26afc9b799e267f9a9e2dc19f1572ed6`
- `discover.css`: `487d4cf3b1274bb44122df7becb01f3820a99b28d13762816d565cebdb5b2db4`
- `discover.js`: `7ea5fa38c5a721d0a387a47a68f58f10defc9467934f64a2d960a1a1e4adcabe`
- duration image: `2bfab379167511beaaa0f5cfb11b1f651025a8de78be3b8cfa42baf009c62cd1`

Guides and the social image both returned HTTP 200; the image returned `image/jpeg`. The guarded deployment checked the staged asset and placements, deployed copies and the server's own HTTPS origin before returning success.

IndexNow accepted Guides and the sitemap with HTTP 200. This is a discovery receipt, not evidence of crawling, indexing, ranking, traffic or conversion.

## Authoritative outcome boundary

The official GA4 Data API remains complete through 2026-08-29. For that completed Beijing natural day, filtered to the exact hostname `yixiu.wonderelian.com`, the accepted result is 21 H5 UV, 43 page views and 32 sessions, 79 UV short of the daily target.

Retained Apple official evidence proves 10 first-time downloads and 4 redownloads through 2026-08-28. No newer Apple report was obtained in this release. Campaign-specific downloads, product-page views, trial starts, paid conversions, subscriptions, in-app purchases and revenue remain `null` where current official evidence is unavailable.

This release proves that the referral controls and attribution are live. It does not prove that a visitor used them, that a new H5 session arrived through them, that a new App download occurred or that the overall goal is complete.
