# Yixiu reliability and sound library implementation plan

> **For Codex:** Execute the accepted audit fixes in parallel by file ownership, review integration, then verify both products before handoff.

**Goal:** Make pause/resume reliable, preserve listening through Plus discovery, honor background settings, restore member scenes correctly, and make the existing sound catalog easy to find.

**Architecture:** Keep the existing visual system, licensed catalog and subscription policies. Separate paused audio from stopped audio; synchronize visible listening state with actual audio events. Add independent library scope/search controls outside scrolling cards, keeping category selection and Free-first home gestures.

**Tech Stack:** React/TypeScript/Vite, SwiftUI/AVAudioPlayer/StoreKit, Node tests, Swift core tests and existing UI regression harness.

## Task 1: App playback and entitlement restoration

- Modify `AppState.swift`, `AmbientAudioEngine.swift`, `YixiuMeditationApp.swift`.
- Pause must retain the current audio position; stop/change scene must clear it.
- Background setting off pauses when entering background; setting on retains supported playback.
- Do not force saved Plus scenes to ocean before StoreKit readiness; gate playback while entitlement verification is pending.
- Reconcile Focus/system interruptions so an interrupted audio session cannot silently count as an uninterrupted finished practice.
- Verify with build, relevant tests, simulator pause/resume and startup checks. Explicitly leave real StoreKit/phone interruption limits documented.

## Task 2: App library and price loading

- Modify `ListenView.swift`, `PlusPaywallView.swift`; share filtering logic if beneficial for regression tests.
- Add All/Free/Favorites/Recent scopes and name/composer search; preserve category tabs outside ScrollView and card selection behavior.
- Use stored recency order and explain empty results with a useful reset action.
- Price retrieval needs an explicit loading state and one retry action on failure.

## Task 3: H5 audio state

- Extract/test an audio controller or update the existing hook; limit changes to audio/state wiring, background behavior and Plus gating branches.
- Pause/resume retains Audio/currentTime, generation-protect scene transitions and cleanup, recover playing/error state from actual media events.
- A failed play cannot continue the practice clock or create a completed listening record; show a retry message.
- Plus discovery leaves the current free sound playing. Background off pauses when the page becomes hidden.
- Verify controller with mocked Audio: pause/resume, scene switch, failure, late promises, cleanup, actual elapsed time.

## Task 4: H5 library and responsive polish

- Modify `Prototype.tsx` UI sections, `prototype.css`, `public/app-banner.css`.
- Add a visible home library button, library search and scopes. Keep the three-column quick practices, scene gestures, banner session dismissal, WeChat handoff and full-width web tabs.
- Short landscape uses a collision-free compact layout. At smaller portrait heights, preserve reachable controls through scrolling if necessary.
- Compact Plus copy; retain licensing/complete listening link as a secondary action; remove obsolete upcoming-App-collection message.
- Use shared modal focus containment, Escape and focus return; category arrows use roving focus.
- Optimize displayed icon and card thumbnails; lazy-load offscreen cards without altering full-size scene art.

## Task 5: Integration verification and handoff

- Build H5 and run existing applicable runtime/practice/analytics tests plus new regression tests.
- Inspect screenshots and flows at 390×844, 360×740, 844×390 and desktop; verify H5 scopes/search, sticky controls, Plus continuity, pause/resume, errors and keyboard modal behavior.
- Build App simulator and Release as available; run existing core/unit tests and focused relevant UI tests.
- Record evidence, exact source revision and any remaining real-device verification gaps. Do not submit or replace App Store builds as part of this implementation request.

## Completion

Implemented all five tasks. H5 passed the production build and 73 Node tests, was exercised locally and on the public HTTPS site, and was deployed with a recoverable production backup. App passed simulator Debug and generic iOS Release compilation, 16 core tests, the AppState / real audio / library harnesses, and four focused UI scenarios (three first-run passes plus one library recheck after fixing an accessibility identifier inheritance bug). The original failed result was retained.

Evidence, deployment hashes, screenshots and physical-device limits are recorded in `docs/growth/2026-10-13-reliability-library-release.md`. No Apple review action or phone installation was performed.
