# Compact Focus and membership parity

**Goal:** Keep breathing primary, move the three presets below the practice, and align H5 free access with native policy.

**Architecture:** Retain React and SwiftUI implementations and native StoreKit verification. H5 has no verified Apple entitlement and therefore exposes free access only; do not invent account synchronization. Use normal scroll flow and nonshrinking tablet sections.

**Tech stack:** React/CSS, SwiftUI, Playwright Chromium/WebKit, Swift smoke tests.

## Approved design

- Heading → duration/sound settings → orbit/readout → controls/safety → one row of three compact presets.
- Presets: 睡前放松 / Bedtime (15 min), 片刻呼吸 / Breathe (1 min), 清晨唤醒 / Morning (5 min). No photography or long secondary title; play icon, equal widths, 12px gaps, minimum 84px height. Hide during running/paused practice.
- Preserve vertical scroll and safe-area clearance; large text may grow cards rather than clip.
- Free H5 and native: seven free sounds, 1-minute breathing, 5/15/30-minute listening. Native verified legacy and Plus remain unchanged. H5 locked choices open membership explanation, never fabricate Apple status or prices.

## Implementation and verification

1. Update `yixiu-prototype/tests/daily-practice.spec.ts` and `tests/focus-scroll.spec.ts` for compact three-column placement, scrolling, locked durations, legacy local settings and journal replay. Run the targeted tests, expecting current UI/policy failures.
2. Update `src/Prototype.tsx`, `src/prototype.css`, and add `src/accessPolicy.ts`. Move shortcuts below safety note; enforce free policy at selection/start/replay and normalize old settings. Add Me membership entry and accurate platform limitation copy.
3. Update native `FocusView.swift` to matching order, labels, compact row. Preserve native gate checks; expand subscription smoke coverage. Correct Plus benefit copy to 3/5/10 minutes.
4. Run `npm run test:runtime -- --workers=2`, `npm run build`, `npm run test:sites`, Swift package/smoke and Release simulator build. Review screenshots from the regression browser run.
5. Commit scoped source, package `dist-gh` without xattrs, deploy only through the existing Yixiu Nginx script after checking current production hash. Read back public asset hashes and document receipt/backup. Do not claim phone installation, App Store review or GitHub push without successful evidence.
