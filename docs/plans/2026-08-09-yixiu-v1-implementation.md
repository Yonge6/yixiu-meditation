# Yixiu V1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deliver the approved Yixiu V1 as a complete, bilingual H5 product flow and synchronize the same core experience into the existing SwiftUI iOS app.

**Architecture:** Keep the H5 as a single React product shell with three persistent tabs and app-owned overlay panels. Store scene, favorites, language, timer, and simple settings locally. Keep iOS offline-first with SwiftUI, `AppStorage`/`UserDefaults`, `AVFoundation`, and no backend or account layer.

**Tech Stack:** React 19, TypeScript, Vite, Radix Icons, Web Audio API, Playwright, SwiftUI, AVFoundation, XCTest/xcodebuild.

---

### Task 1: Define shared V1 product states

**Files:**
- Modify: `yixiu-prototype/src/Prototype.tsx`
- Modify: `YixiuMeditation/YixiuMeditation/Models.swift`
- Modify: `YixiuMeditation/YixiuMeditation/AppState.swift`

**Step 1: Add the six-scene model**

Define `ocean`, `rain`, `stream`, `lake`, `falls`, and `tide`, including Chinese name, English name, visual asset, audio profile, and use case.

**Step 2: Add persistent V1 preferences**

Persist language, active scene, favorite scene IDs, default duration, end-bell preference, and background-playback preference. Do not persist active playback across a terminated session.

**Step 3: Add timer state**

Represent 15, 30, 60, and unlimited duration. When playing a timed session, decrement remaining time, fade out near completion, stop at zero, and present a completion wisdom card.

**Step 4: Verify the state contract**

Run: `npm run build`
Expected: TypeScript compilation succeeds.

### Task 2: Complete the H5 sound experience

**Files:**
- Modify: `yixiu-prototype/src/Prototype.tsx`
- Modify: `yixiu-prototype/src/prototype.css`
- Create: `yixiu-prototype/public/assets/yixiu/morning-lake.png`
- Create: `yixiu-prototype/public/assets/yixiu/forest-falls.png`
- Create: `yixiu-prototype/public/assets/yixiu/night-tide.png`

**Step 1: Preserve the approved player**

Keep the selected deep-water home as the default state. Preserve the exact full-bleed hierarchy, transport row, volume, duration, and bottom navigation.

**Step 2: Add a six-scene library sheet**

Open the library from the active Sounds tab. Each scene tile must show the real scene visual, localized title, use case, favorite state, and current playback state.

**Step 3: Extend the audio profiles**

Create distinct Web Audio filters and modulation for all six scenes. Crossfade or restart safely when the user changes scene. Keep this as prototype audio only; real recorded assets remain required for the App Store build.

**Step 4: Add completion wisdom**

At timer completion, stop playback and show a dismissible localized water-wisdom panel. Do not add streaks, points, or failure language.

**Step 5: Verify core controls manually**

Check play/pause, previous/next, favorites, volume, timer, language, library selection, and completion state in the local browser.

### Task 3: Build the H5 Focus tab

**Files:**
- Modify: `yixiu-prototype/src/Prototype.tsx`
- Modify: `yixiu-prototype/src/prototype.css`

**Step 1: Add the 60-second breathing state machine**

Use 4 seconds inhale, 2 seconds hold, and 6 seconds exhale for five cycles. Track idle, running, paused, and completed states.

**Step 2: Add the water-ripple presentation**

Use the existing deep-water photo language and slow scale/ripple motion. Respect `prefers-reduced-motion` by replacing scale animation with a static ring and text-only phase changes.

**Step 3: Add controls and safety copy**

Provide start, pause, continue, and restart. Show localized phase, remaining seconds, and the non-medical note to pause if uncomfortable.

**Step 4: Verify tab switching**

Switching tabs must not accidentally start audio or breathing. Returning to Focus should preserve a paused session but must not continue in the background.

### Task 4: Build the H5 Me tab and settings

**Files:**
- Modify: `yixiu-prototype/src/Prototype.tsx`
- Modify: `yixiu-prototype/src/prototype.css`

**Step 1: Add favorites**

Show favorite scene chips or cards with an empty state. Selecting one returns to Sounds with that scene active.

**Step 2: Add local preferences**

Add default duration, language, end-bell, and background-playback explanation. Use controls that visibly update state and persist after reload.

**Step 3: Add trust links**

Provide privacy, support, and product philosophy sections as lightweight in-app panels. Do not add account or profile inputs.

**Step 4: Verify persistence**

Change each setting, reload, and confirm it is restored. Reset the test state afterward.

### Task 5: Add H5 product-flow tests

**Files:**
- Create: `yixiu-prototype/tests/v1-product.spec.ts`

**Step 1: Write the initial failing tests**

Cover default ocean state, play toggle, scene change, timer selection, favorite persistence, language switching, breathing state, and Me settings.

**Step 2: Run the tests to verify expected failures**

Run: `npm run test:runtime -- tests/v1-product.spec.ts`
Expected: new behavior tests fail before implementation.

**Step 3: Implement until the tests pass**

Use accessible labels and stable visible copy rather than implementation-only selectors.

**Step 4: Run the complete H5 validation**

Run:

```bash
npm run check:runtime
npm run build
npm run test:sites
npm run test:runtime
```

Expected: runtime integrity, build, Sites tests, legacy mobile runtime tests, and V1 flow tests all pass.

### Task 6: Perform visual QA on all three tabs

**Files:**
- Modify: `yixiu-prototype/design-qa.md`
- Create: `yixiu-prototype/qa-v1-sounds.png`
- Create: `yixiu-prototype/qa-v1-focus.png`
- Create: `yixiu-prototype/qa-v1-me.png`

**Step 1: Capture the same mobile viewport for each tab**

Use 390 × 844 for Sounds, Focus, and Me.

**Step 2: Compare Sounds against the selected source**

Place the source and rendered player in one comparison input. Fix P0, P1, and P2 mismatches before proceeding.

**Step 3: Review Focus and Me against the approved deep-water system**

Check typography, low-light contrast, spacing, safe areas, bilingual copy, tap targets, controls, and empty states.

**Step 4: Record the QA result**

The QA document must explicitly cover fonts, spacing, colors, image quality, copy, and interactions, and end with `final result: passed`.

### Task 7: Synchronize V1 into SwiftUI

**Files:**
- Modify: `YixiuMeditation/YixiuMeditation/YixiuTheme.swift`
- Modify: `YixiuMeditation/YixiuMeditation/Models.swift`
- Modify: `YixiuMeditation/YixiuMeditation/AppState.swift`
- Modify: `YixiuMeditation/YixiuMeditation/AmbientAudioEngine.swift`
- Modify: `YixiuMeditation/YixiuMeditation/ContentView.swift`
- Modify: `YixiuMeditation/YixiuMeditation/ListenView.swift`
- Modify: `YixiuMeditation/YixiuMeditation/FocusView.swift`
- Modify: `YixiuMeditation/YixiuMeditation/MeView.swift`
- Create: three additional image sets under `YixiuMeditation/YixiuMeditation/Assets.xcassets/`

**Step 1: Replace the rejected ivory theme**

Introduce deep-water, moon, mist, and aqua tokens. Keep Songti and Baskerville families and ensure system fallbacks remain readable.

**Step 2: Rebuild Listen around the approved player**

Use full-bleed scene imagery, five-control transport, volume, timer, scene selection, and minimal bottom navigation.

**Step 3: Extend native audio behavior**

Add six profiles, output volume control, fade-out, interruption handling, route-change pause, and lock-screen metadata/control where practical in V1.

**Step 4: Implement native Focus and Me parity**

Match the H5 states and copy. Keep all data on device and avoid account or network dependencies.

**Step 5: Verify native persistence**

Restart the app and confirm scene, favorites, language, duration, and settings restore correctly while playback remains stopped.

### Task 8: Build and release-readiness audit

**Files:**
- Modify: `YixiuMeditation/README.md`
- Create: `docs/plans/2026-08-09-yixiu-v1-release-checklist.md`

**Step 1: Build for the simulator**

Run:

```bash
xcodebuild \
  -project YixiuMeditation/YixiuMeditation.xcodeproj \
  -scheme YixiuMeditation \
  -configuration Debug \
  -destination 'generic/platform=iOS Simulator' \
  CODE_SIGNING_ALLOWED=NO \
  build
```

Expected: `** BUILD SUCCEEDED **`.

**Step 2: Audit App Store gaps**

Record real-audio licensing, final 1024 icon, privacy policy, support URL, screenshots, signing, TestFlight device testing, background playback, lock-screen, Bluetooth, interruption, and review metadata status.

**Step 3: Run final repository checks**

Run: `git diff --check`
Expected: no whitespace errors.

**Step 4: Prepare a scoped handoff**

Report H5 URL, H5 checks, native build result, remaining external blockers, and the exact files changed. Do not deploy or submit without an explicit user request.
