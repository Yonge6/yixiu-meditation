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
- `evidence/2026-08-29-one-minute-reset-audit/05-production-post-play-fixed.jpg`

## Git and production acceptance

- Pull request: `https://github.com/Yonge6/yixiu-meditation/pull/159`
- Merge commit: `18a5b70097ebe8cc58722262bfd7f9887657c17a`
- Release ID: `20260829-18a5b70-reset-funnel-2305`
- Deploy result: `DEPLOY_OK_YIXIU_20260829-18a5b70-reset-funnel-2305`
- Archive SHA-256: `b0a75939c92bdeb1d7a87e07a274a7e3a2bf9459ac708f23c620313f83ebc68f`
- Rollback backup: `/srv/wonderelian/backups/yixiu-20260829-18a5b70-reset-funnel-2305`
- Reset page source/server/public SHA-256: `fb82bc07d7c0e3ae08b8142842497c728d8c4364fc560a2a8625b75076d0f747`

The server cloned and built the exact merge commit, verified the 51.4 MB archive, retained release artifacts inside the rollback backup, passed Nginx validation and completed the guarded deployment. A fresh desktop-Chrome page then loaded `/discover.css?v=20260829-reset-funnel`, played Morning Water and exposed the pressed Pause state plus separate styled share and Pinterest actions. `scrollWidth` equaled `innerWidth` at the audited 1824 px desktop viewport. The production screenshot confirms the truthful browser-versus-app copy and the repaired conversion panel.

The public acceptance URL used an explicit QA marker and is not treated as acquisition. The App Store destination was inspected but not clicked. This repair improves the funnel but is not evidence of H5 users or App downloads, so the overall growth goal remains active.
