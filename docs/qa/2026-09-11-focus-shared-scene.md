# Focus shared-scene validation — 2026-09-11

## Change

- App and H5 Focus resolve the background and localized name from the same scene as Sounds; audio continues to use the existing shared player.
- The sound switch names that scene. Explicit silence is preserved. H5 toggling during practice now affects playback, and pause/resume restores/reacquires the original playback state.
- Native Breathe quick practice no longer selects Stream. Switching to another scene resets the previous practice instead of recording the wrong scene.
- No subscription configuration or public entitlement behavior was changed. H5 Focus cannot bypass a premium scene through its sound switch.

## Checks

- Native build and 13 Swift logic tests passed.
- iPhone UI tests passed: selected scene propagation, pre-practice playback restoration, reset after scene change, and Breathe shortcut retaining the home scene (2 tests).
- iPad UI regression passed: selected scene propagation, playback restoration and reset after scene change (1 test).
- H5: production build, all 73 Playwright tests, all 45 Sites tests, and the 28-file protected-runtime integrity check passed.
- H5 tests inspect actual HTML media elements: rain and meditation track URLs, no duplicate player on tab switch, live sound-toggle behavior, and no premium audio playback.
- Desktop Chrome visual checks at 390×844 (Chinese rain scene) and 1024×768 (English Still Water) showed matching scene artwork/title, reachable controls and no console errors.
- Structural checks preserve native home gestures, rating link and shared Focus asset/title sources.

## Local evidence

- iPhone result: `/Volumes/LaCie/Yixiu-home-fixes-20260911/FocusScene-fresh.xcresult`
- iPad result: `/Volumes/LaCie/Yixiu-home-fixes-20260911/FocusScene-ipad-verified.xcresult`
- Native screenshot: `/Volumes/LaCie/Yixiu-home-fixes-20260911/focus-scene-attachments/C9267F10-7E90-44FF-9C80-975C3B242048.png`
- H5 logs: `/tmp/yixiu-focus-h5-all-tests.log`, `/tmp/yixiu-focus-h5-build.log`
- Preview: `http://localhost:4192/?scene=rain&lang=zh` (select Focus).

An initial iPad test queried an iPhone-only TabBar container; the test helper was corrected for iPadOS floating tabs. An earlier iPhone attempt ran zero tests from a stale simulator test runner; only the disposable QA runner/app were removed before the verified two-test run. The user's phone app/data were not removed.

This is local validation only: no H5 deployment, GitHub push, App Store submission or phone installation was performed in this change.
