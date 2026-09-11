# H5 parity acceptance — 2026-09-11

## Restored

- Focus shares the Sounds scene and shows 1/3/5/10 minute options; extended durations stay locked for unverified web visitors.
- Bedtime (rain, 15m), Breathe (current scene, 1m), Morning (birds, 5m) are compact three-column actions below the exercise.
- Me shows completed local practices, Monday-based weekly minutes/day markers, three recent records with repeat actions, and a 200-entry validated storage limit.
- Free web timer options match native Free (5/15/30); 60/unlimited lead to the app. No localStorage value grants Plus or legacy Apple access.
- Elapsed-time clocks reconcile delayed browser ticks, exclude paused time and record completions once. Old unavailable duration preferences migrate to 1-minute Focus / 30-minute listening.
- Me uses one 16px gap between sections; Focus uses scrollable normal flow and a wide two-column exercise layout. Existing scene gestures, QR sharing and WeChat download handoff remain.

## Verified locally

- 82/82 Playwright tests passed in the final serial run (`/tmp/yixiu-parity-all-verified.log`). Earlier parallel runs exposed a now-fixed five-option timer-panel wrap, and one protected-runtime keyboard gesture flake; the final unchanged-runtime serial run passed.
- 4/4 pure clock, journal validation/bounding, weekly-summary and entitlement-policy tests passed.
- 45/45 Sites tests, TypeScript/Vite production build and all 28 protected-runtime hashes passed.
- Desktop Chrome at 390×844 and 1024×768 showed the restored journal, matching rain scene, compact shortcuts and no console errors. Browser regressions additionally cover 390×600, 768×1024 and 844×390 scrolling and spacing.
- Native source is unchanged since the scene-sync fix (`e05a151`), already covered by 13 logic tests and iPhone/iPad UI regressions. The new internal Plus device build succeeded and strict signing verification passed (1.11 / 24).

## Release boundaries

The deployment guard now requires the `20260911-native-parity` marker, journal, shortcut-grid and web-membership symbols before publishing. Backups and exact public HTML/JS/CSS readback are required. Device installation must be in-place, not uninstall/reinstall. No App Store submission or public forced entitlement is part of this release.
