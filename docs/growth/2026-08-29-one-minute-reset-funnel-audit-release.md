# One-Minute Reset funnel audit and repair

## Scope

This audit used desktop Chrome against the live One-Minute Reset page and stayed entirely within Yixiu. It followed the public campaign path, started the real Morning Water preview and inspected the attributed App Store links without clicking them, so the audit did not create a campaign download click.

## Production findings

1. The entry state was healthy: one clear H1, a playable sound preview, an above-fold App Store CTA and three compact proof cards.
2. Playback revealed a high-impact presentation regression. Newer JavaScript inserted the referral controls while the page could retain an older unversioned stylesheet, compressing the post-play download and share actions into a hard-to-scan inline block.
3. The page promised a visible guided breathing rhythm, but the browser experience only played a water recording. The existing product distinction was unclear: the guided rhythm is in the iPhone app.
4. The core controls use semantic buttons and links, the preview exposes `aria-pressed`, and the page keeps a single H1. Screenshot evidence alone does not establish complete keyboard, screen-reader or WCAG conformance.

## Repair

- Versioned the Reset page stylesheet URL to invalidate stale browser caches.
- Kept the existing visual system, image, audio, controls and Apple attribution.
- Replaced the unsupported browser-rhythm claim in visible and social-description copy with a precise promise: the H5 offers a free sound preview; the iPhone app provides the guided rhythm.
- Added regression assertions for the stylesheet version, truthful product distinction and removal of the old claim.

## Verification before merge

- Protected mobile runtime integrity: 28/28 files passed.
- Static-site tests: 39/39 passed.
- Production build: passed and prepared the Sites output.
- Desktop Chrome: the Morning Water preview changed to the pressed Pause state and revealed two clearly separated, styled referral actions.
- App Store destination remained the exact Reset custom product page with the existing provider and campaign tokens.

## Evidence

- `evidence/2026-08-29-one-minute-reset-audit/01-production-entry-before.jpg`
- `evidence/2026-08-29-one-minute-reset-audit/02-production-post-play-before.jpg`
- `evidence/2026-08-29-one-minute-reset-audit/03-local-post-play-fixed.jpg`
- `evidence/2026-08-29-one-minute-reset-audit/04-before-after-comparison.jpg`

Production acceptance still requires the merged revision to be deployed, then rechecked in a fresh desktop-Chrome state with source, server and public hashes equal. This repair improves the funnel but is not evidence of H5 users or App downloads.
