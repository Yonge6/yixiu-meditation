# Yixiu Sharing, Daily Reminder, Widgets, and iPad Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deliver QR-backed scene sharing, an opt-in 21:30 daily reminder, standard widgets, the complete Smart App Banner contract, and universal iPad support.

**Architecture:** Keep all features local and account-free. Share-card renderers consume the existing scene URL model; the notification manager owns authorization and one repeating request; the existing widget extension adds a timeline widget and reuses the quiet-minute Live Activity manager.

**Tech Stack:** SwiftUI, UIKit, Core Image, UserNotifications, WidgetKit, AppIntents, React, TypeScript, Canvas, Web Share API, Playwright.

---

### Task 1: Establish focused contract tests

**Files:**
- Modify: `yixiu-prototype/tests/v1-product.spec.ts`
- Modify: `yixiu-prototype/tests/sites-worker.test.mjs`
- Create: `YixiuMeditation/Tests/YixiuActivityCoreTests/DailyReminderScheduleTests.swift`
- Create: `YixiuMeditation/Shared/DailyReminderSchedule.swift`

**Steps:**

1. Add a failing H5 test that mocks file-capable `navigator.share` and expects one PNG plus the attributed scene URL.
2. Add a failing H5 fallback test that removes file-share support and expects a share-card dialog with save and copy-link actions.
3. Add a failing HTML test requiring `app-argument=https://apps.apple.com/app/id1461182261` in the Smart App Banner tag.
4. Add schedule tests for the default 21:30 time, calendar components, identifier, and message rotation.
5. Run the focused tests and confirm they fail for the missing contracts.

### Task 2: Implement the H5 share card and Smart App Banner

**Files:**
- Modify: `yixiu-prototype/package.json`
- Modify: `yixiu-prototype/package-lock.json`
- Modify: `yixiu-prototype/index.html`
- Modify: `yixiu-prototype/src/Prototype.tsx`
- Modify: `yixiu-prototype/src/prototype.css`

**Steps:**

1. Add the QR encoder dependency.
2. Build a 1080×1350 canvas card from the current scene image, overlays, localized copy, and lower-right QR code.
3. Share the resulting PNG file when `navigator.canShare({files})` succeeds.
4. Present a modal preview with download, copy, close, and WeChat guidance when file sharing is unavailable.
5. Preserve existing growth-event names and include a specific share method.
6. Add the region-neutral `app-argument` to the Smart App Banner metadata.
7. Run the focused Playwright and Sites tests until green.

### Task 3: Implement native visual sharing

**Files:**
- Create: `YixiuMeditation/YixiuMeditation/SceneShareCardRenderer.swift`
- Create: `YixiuMeditation/YixiuMeditation/ActivityShareSheet.swift`
- Modify: `YixiuMeditation/YixiuMeditation/ListenView.swift`
- Modify: `YixiuMeditation/YixiuMeditation.xcodeproj/project.pbxproj`

**Steps:**

1. Generate a high-resolution scene card with the existing asset, localized typography, and a Core Image QR code in the lower-right.
2. Wrap `UIActivityViewController` for SwiftUI sheet presentation.
3. Replace `ShareLink` with a button that renders the card and presents `[PNG image, URL]`.
4. Show localized, non-blocking failure feedback if rendering fails.
5. Build the app for an iPhone simulator.

### Task 4: Implement the 21:30 local daily reminder

**Files:**
- Modify: `YixiuMeditation/Shared/DailyReminderSchedule.swift`
- Create: `YixiuMeditation/YixiuMeditation/DailyReminderManager.swift`
- Modify: `YixiuMeditation/YixiuMeditation/YixiuMeditationApp.swift`
- Modify: `YixiuMeditation/YixiuMeditation/MeView.swift`
- Modify: `YixiuMeditation/YixiuMeditation.xcodeproj/project.pbxproj`

**Steps:**

1. Implement schedule value semantics and localized rotating reminder copy.
2. Implement permission readback, opt-in request, schedule replacement, disable cleanup, and Settings deep link.
3. Inject the manager at the app root.
4. Add a Daily quiet reminder section to My Yixiu with a switch, time picker, and permission status.
5. Run Swift package tests and an iPhone simulator build.

### Task 5: Add standard home and lock-screen widgets

**Files:**
- Create: `YixiuMeditation/YixiuQuietWidget/QuietMinuteWidget.swift`
- Modify: `YixiuMeditation/YixiuQuietWidget/QuietMinuteIntents.swift`
- Modify: `YixiuMeditation/YixiuQuietWidget/YixiuQuietWidgetBundle.swift`
- Modify: `YixiuMeditation/YixiuQuietWidget/Localizable.xcstrings`
- Modify: `YixiuMeditation/YixiuMeditation.xcodeproj/project.pbxproj`

**Steps:**

1. Add a start intent that calls the existing activity manager and reloads controls/timelines.
2. Add small, medium, accessory circular, and accessory rectangular layouts.
3. Add the widget to the extension bundle and localize visible copy.
4. Build the widget extension through the app scheme.

### Task 6: Enable and polish iPad support

**Files:**
- Modify: `YixiuMeditation/YixiuMeditation/Info.plist`
- Modify: `YixiuMeditation/YixiuMeditation/ListenView.swift`
- Modify: `YixiuMeditation/YixiuMeditation/FocusView.swift`
- Modify: `YixiuMeditation/YixiuMeditation/MeView.swift`
- Modify: `YixiuMeditation/YixiuMeditation.xcodeproj/project.pbxproj`

**Steps:**

1. Set both targets to device families `1,2`.
2. Keep iPhone portrait and add all standard iPad orientations.
3. Center foreground content with readable maximum widths while retaining full-bleed imagery.
4. Verify share-sheet presentation on iPad does not require an unconfigured popover anchor.
5. Build for iPad Pro simulator destinations in Debug and Release.

### Task 7: Full verification and handoff

**Files:**
- Modify: `docs/plans/2026-09-04-sharing-notifications-widgets-ipad-design.md` only if implementation facts differ.

**Steps:**

1. Run `swift test` in `YixiuMeditation`.
2. Run `npm run check:runtime`, the full Playwright suite, `npm run build`, and `npm run test:sites` in `yixiu-prototype`.
3. Build the Xcode scheme for iPhone and iPad simulators in Debug and Release without signing.
4. Capture and inspect H5 share-card and iPad simulator screenshots; confirm no clipping or horizontal overflow.
5. Review `git diff --check`, changed-file scope, and all test/build logs.
6. Commit the implementation locally. Do not push, deploy, or submit for review without a separate explicit instruction.
