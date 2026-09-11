# Native home interaction fixes — 2026-09-11

Scope: native Yixiu only. Based on freshly fetched `origin/main` at
`23ef6a62c5a18d7c9770d875d6a99ef08ae04137`, isolated branch
`codex/yixiu-home-gestures-rating-20260911`.

## Changes

- A fitting, non-scrolling home page now handles ordinary portrait windows.
  Flexible space is above the player, with a fixed bottom gap, so controls stay low.
- The scene canvas and title retain left/right scene gestures and upward library
  gestures. Short windows / accessibility text retain a scrolling fallback.
- In the scrolling fallback, upward movement scrolls the page and the library
  button remains reachable. A direction-filtered UIKit pan over artwork/title
  retains horizontal scene changes without capturing vertical scrolling or sliders.
- Wide layouts retain the existing two-column `AnyLayout` arrangement.
- Scene changes still pass through `SubscriptionStore.canAccess`; no entitlement,
  pricing, StoreKit transaction, audio or persistence implementation was changed.
- The explicit rating button opens
  `https://apps.apple.com/app/id1461182261?action=write-review`, with a localized
  open-failure alert and product-page fallback. Contextual review requests in
  `ContentView` remain unchanged.

Apple recommends an App Store write-review link for an explicit button, because
the system decides whether to present `requestReview`:
[Requesting App Store reviews](https://developer.apple.com/documentation/StoreKit/requesting-app-store-reviews).

## Verification

- Simulator Debug build: passed.
- Swift package: 13 tests passed, including practice journal, countdown and reminders.
- `node YixiuMeditation/Tests/home-interaction-regression.mjs`: passed structural
  guardrails. This is not a substitute for gesture tests.
- `YixiuHomeRegression` on iPhone 17 Pro Max / iOS 26.5: all 6 native UI tests passed:
  - portrait play control below 62% of screen height;
  - left/right gestures change Ocean Waves ↔ Rain on Eaves; upward gesture opens library;
  - volume changes and timer interaction do not change scene;
  - swipe from free Mountain Stream into premium Morning Lake opens the paywall;
  - landscape controls remain reachable;
  - landscape left/right swipes switch Ocean Waves ↔ Rain on Eaves;
  - explicit rating button opens an external store/browser destination.
- iPad Pro 13-inch / iOS 26.5: portrait screenshot inspected; landscape UI test passed.
- Largest accessibility text / iPhone landscape: passed on the final source;
  two content-area upward drags brought the library button from y=970 to y=258.7,
  and tapping it opened the library.

The rating test opens the URL but never writes or submits a review. The simulator
does not provide the production App Store review service; actual account eligibility
and successful review submission must be checked by the user on their device.
The open-failure alert is source-checked, not an injected failure-path UI test.
Initial test fixtures were corrected for XCTest's uncapitalized accessibility labels,
background-suspended state, and drags accidentally starting over the tab bar.
The accessibility scrolling fix was verified after reinstalling only the disposable
simulator app and UI runner: earlier runs had executed cached test code despite updated
binaries on disk. No user phone data was removed. All final runs are green.

## Reproduce

```sh
swift test --package-path YixiuMeditation
node YixiuMeditation/Tests/home-interaction-regression.mjs
xcodebuild -project YixiuMeditation/YixiuMeditation.xcodeproj \
  -scheme YixiuHomeRegression \
  -destination 'platform=iOS Simulator,id=<SIMULATOR_ID>' \
  -parallel-testing-enabled NO CODE_SIGNING_ALLOWED=NO test
```

Native result bundles and original screenshots are retained at
`/Volumes/LaCie/Yixiu-home-fixes-20260911/`:

- `HomeRegression-verified.xcresult` — final 6-test iPhone run.
- `HomeRegression-ipad-verified.xcresult` — iPad landscape run.
- `HomeRegression-large-text-verified.xcresult` — largest text landscape run.
- `attachments-final/manifest.json` — exported named screenshot evidence.
- `portrait.png`, `landscape.png`, `ipad-portrait.png` — visual checks.

## Release boundary

No H5 deployment, remote push, App Store withdrawal/submission, version-number change
or phone installation was performed. This is a local source fix; the installed phone
build and current Apple review status must not be inferred from these tests.
