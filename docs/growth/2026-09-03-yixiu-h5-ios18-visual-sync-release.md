# Yixiu H5 iOS visual sync release — 2026-09-03

## Scope

This Yixiu-only release restores the accepted iOS visual language on the public H5 without changing playback, sharing, analytics, subscription gating, App Store attribution, or any other product.

- Fresh unparameterized visits start in English; explicit `?lang=zh|en` links and stored manual choices remain authoritative.
- The Sounds header keeps the brand at left and orders App Store, Share, then the dedicated language control at right.
- FREE scenes retain their aqua text capsule; Plus scenes use the faceted gemstone mark with an accessible `Yixiu Plus` label.
- The mobile and desktop tab bar uses the accepted inset, blurred, rounded iOS-style treatment with a visible selected segment.
- Still Water, Open Meadow, Oasis Rest, Ocean Passage, and Quiet Orbit use the exact accepted iOS 1.8 artwork. Quiet Orbit now visibly contains star trails.

## Source and verification

- Implementation PR: https://github.com/Yonge6/yixiu-meditation/pull/217
- Merge commit: `f3205e1ae627946dc0e8535fe97db1448424e92d`
- GitHub release: https://github.com/Yonge6/yixiu-meditation/releases/tag/yixiu-web-20260903-h5-ios18-visual-sync
- `npm run check:runtime`: 28 protected files passed.
- `npm run test:runtime`: 65 of 65 passed.
- `npm run build`: passed from the exact merge commit.
- `npm run test:sites`: 44 of 44 passed.
- Local acceptance at 390 by 844 and 1440 by 1000 verified English and Chinese states, header ordering, the selected tab treatment, gemstone badges, scene artwork, exact viewport width, and no page console errors.

## Production release

- Public H5: https://yixiu.wonderelian.com/
- Release ID: `20260903-f3205e1-h5-ios18-0945`
- Receipt: `DEPLOY_OK_YIXIU_20260903-f3205e1-h5-ios18-0945`
- Archive SHA-256: `be9d316a92ef524433d1513a2bf84bdd0ec322276a6f8144471461b56e815bc6`
- Deploy-script SHA-256: `ddfd448cc1069f46eea1b7059456d45586e8ff8129386195fae5dc45242b9706`
- Rollback backup: `/srv/wonderelian/backups/yixiu-20260903-f3205e1-h5-ios18-0945`
- Retained evidence: `/srv/wonderelian/backups/yixiu-20260903-f3205e1-h5-ios18-0945/release-artifacts`

The guarded deployment verified the immutable archive, created the complete rollback backup, passed every staged and deployed site assertion, validated and reloaded Nginx, and completed loopback HTTPS checks before returning the receipt.

Public acceptance returned HTTP 200 for both the root and `?scene=valley&lang=zh`. The local merge build, server tree, and public responses matched for the root HTML, compiled JavaScript, compiled CSS, and all five changed images. The public bundle contains `data-premium-gem`, `Yixiu Plus`, and the dedicated language-control copy. Production browser acceptance at 390 by 844 and 1440 by 1000 confirmed English-first fresh state, explicit Chinese state, correct App Store / Share / Language ordering, 28 or 30 pixel tab-bar radii, selected-segment gradient, exact viewport width, eight gemstone badges in the meditation filter, and no page console errors. The only aborted network requests were analytics beacons terminated when the short-lived headless acceptance contexts closed; application resources loaded successfully.

Changed image SHA-256 values:

- Still Water: `da3fdb61d3a139e0b89b0ac329ffc326a6e800b11de8b77f71b1f2af23abf720`
- Open Meadow: `5ee7938885a6532439e67a669de326f437ca1a1677174308dc6cfd2036ad4d9d`
- Oasis Rest: `cd6d49402142c8fe66628b3e8183e02ea13fb6ae81a386b136491c59a0141301`
- Quiet Orbit: `28e6df430453b5ec74acaaf6fb2536570ef583e0c33d6e7a771a0a0c8def8d4e`
- Ocean Passage: `c9fd78ff28e1b9e29c89e18ef16b84d575430a2e5616b9a2396c31729f421d4e`

## Measurement boundary

This UI release is not evidence of a visit, App download, trial, paid user, subscription, in-app purchase, or revenue. It does not change or complete the separate long-term growth goal; unavailable Apple campaign outcomes remain `null`.
