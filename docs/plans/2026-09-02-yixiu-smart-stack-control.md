# Yixiu Smart Stack and One-Minute Control Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship a one-tap Yixiu quiet-minute control whose Live Activity appears in the iPhone system surfaces and Apple Watch Smart Stack without adding a standalone watchOS app.

**Architecture:** A Foundation-only timing core is shared by tests and the Widget Extension. A `LiveActivityIntent` starts one 60-second ActivityKit activity after clearing prior Yixiu activities. WidgetKit supplies the Controls-gallery button plus Lock Screen, Dynamic Island, and Apple Watch presentations. The host app enables Live Activities through its Info.plist.

**Tech Stack:** Swift 5, Swift Package Manager tests, SwiftUI, WidgetKit, ActivityKit, AppIntents, Xcode 26.6, iOS/watchOS 26.5 simulators.

---

### Task 1: Add the tested timing core

**Files:**
- Create: `YixiuMeditation/Package.swift`
- Create: `YixiuMeditation/Shared/QuietMinuteSchedule.swift`
- Create: `YixiuMeditation/Tests/YixiuActivityCoreTests/QuietMinuteScheduleTests.swift`

1. Write failing tests for the 60-second interval, 4-2-6 breathing phases, boundary clamping, and completion state.
2. Run `swift test` and confirm failure because the implementation is absent.
3. Implement the minimum `QuietMinuteSchedule` model.
4. Run `swift test` and confirm all tests pass.

### Task 2: Add the Widget Extension

**Files:**
- Create: `YixiuMeditation/YixiuQuietWidget/Info.plist`
- Create: `YixiuMeditation/YixiuQuietWidget/QuietMinuteActivityAttributes.swift`
- Create: `YixiuMeditation/YixiuQuietWidget/QuietMinuteIntents.swift`
- Create: `YixiuMeditation/YixiuQuietWidget/OneMinuteControl.swift`
- Create: `YixiuMeditation/YixiuQuietWidget/QuietMinuteLiveActivity.swift`
- Create: `YixiuMeditation/YixiuQuietWidget/YixiuQuietWidgetBundle.swift`
- Create: `YixiuMeditation/YixiuQuietWidget/Localizable.xcstrings`
- Modify: `YixiuMeditation/YixiuMeditation/Info.plist`
- Modify: `YixiuMeditation/YixiuMeditation.xcodeproj/project.pbxproj`

1. Add Activity attributes containing immutable start/end dates and a lightweight content state.
2. Add start and end intents. Starting removes previous Yixiu quiet-minute activities before requesting a new one.
3. Add the static Control Widget using a calm ripple SF Symbol and English-default localized copy.
4. Add the Live Activity UI for Lock Screen, Dynamic Island, and Smart Stack, including a Done action.
5. Add the extension target, embed phase, build settings, app dependency, and host Info.plist flag.
6. Build both Debug and Release configurations with signing disabled; resolve all errors and warnings introduced by this change.

### Task 3: Simulator acceptance

**Files:**
- Create: `docs/app-store/evidence/2026-09-02-watch-surface/README.md`

1. Create or reuse an iPhone 17 Pro-class iOS 26.5 simulator.
2. Create an Apple Watch Series 11 46 mm watchOS 26.5 simulator and pair it to the iPhone simulator.
3. Install and launch the containing app.
4. Invoke the start intent through an App Intents test route or the Controls gallery and confirm an ActivityKit activity is created.
5. Capture iPhone Lock Screen/Dynamic Island evidence and Apple Watch Smart Stack evidence.
6. Confirm the countdown, 4-2-6 phase boundaries, completed state, Done action, and duplicate cleanup.
7. Record simulator coverage and physical-device exclusions in the evidence README.

### Task 4: Release preparation

**Files:**
- Modify: `YixiuMeditation/YixiuMeditation.xcodeproj/project.pbxproj`
- Create or modify App Store metadata under the repository's existing release-evidence convention.

1. Read App Store Connect for the current editable version and highest uploaded build number; do not infer either from the stale project file.
2. Choose the next valid marketing version and build number.
3. Update English and Simplified Chinese What's New copy to describe the control and Smart Stack availability accurately.
4. Run tests, Release build, archive, export validation, and automated App Store validation.

### Task 5: Upload and submit

1. Upload the validated archive using the repository's existing authenticated release path without printing credentials.
2. Wait for App Store Connect processing.
3. Attach the processed build to the new version and complete required metadata.
4. Submit for review only if no new agreement, identity, OTP, export-compliance, or other user-only gate appears.
5. Read back the exact version, build, and review status from App Store Connect.
6. Commit release evidence, open a pull request, merge it, and confirm `origin/main` contains the submitted source and evidence.

