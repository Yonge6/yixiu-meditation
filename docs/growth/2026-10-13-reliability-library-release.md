# Yixiu reliability and sound library optimization — 2026-10-13

## Mobile library and native parity follow-up

- H5 search input now uses a 16 px font so iOS Safari does not zoom the page on focus. The library sheet and scrolling card grid have no artificial bottom padding. A 390×844 browser check measured scale 1 before/after focus and a zero-pixel bottom gap.
- The H5 fix was published from `0312944`. The first archive had an extra `client/` directory and did not switch production. The corrected archive passed the guarded deployment with marker `DEPLOY_OK_YIXIU_20261013-0312944-mobile-library-160916`. Public HTML references `assets/index-CluCwErs.css` and `assets/index-7_q1lzr3.js`; the CSS returned HTTP 200.
- Native Sound Library now follows the H5 compact header: title, search toggle, All/Free/Favorites/Recent menu, and close icon on one row. Search expands on demand and clears its query when collapsed; categories and count stay above the scrolling cards. The card grid's extra bottom padding was removed. The existing Free/Plus gate and playback code were not changed.
- The iOS 27.1 simulator build and a signed generic-iOS Debug build both succeeded. Strict deep signature verification passed; the main-app compiler invocation includes `-DDEBUG` and `-DYIXIU_INTERNAL_PLUS`.
- The signed 1.19 (33) internal-Plus build was installed in place on the paired iPhone 14 Pro Max (`00008120-000A341C0E0BC01E`), and installed-app readback confirms 1.19 (33). After the phone was unlocked, CoreDevice launched `com.health.yixiu`, process readback showed the running app, and a 1290×2796 real-device screenshot showed the home screen. The focused Sound Library UI test was compiled but could not start because the phone relocked during Xcode's test preflight. iPhone Duo simulator screen capture returned black and is not treated as visual acceptance.

## Scope and source

- Request: implement the accepted H5/App quality-audit improvements, preserving the visual direction, home gestures, licensed catalog and Free/Plus policy.
- Implementation branch: `codex/yixiu-reliability-library-20261013`.
- Baseline: `66a0613` on `origin/codex/yixiu-adaptive-store-20261008`, containing the existing 1.19 (33) App Store submission records. This is a source baseline, not a new verification of Apple review/release status.
- Worktree: `/Users/yongyuan/.codex/worktrees/yixiu-reliability-library/冥想`. The original `f012` and Documents checkouts were not modified.
- No App Store withdrawal, upload, submission, subscription-price change or version bump was performed. The annotated deployment follow-up installed the signed Debug 1.19 (33) internal-Plus build on the paired physical iPhone.

## Delivered changes

### Shared behavior

- Pause retains the current sound position; resuming the same sound continues from that position. A real stop or scene change releases the previous sound.
- Opening Plus or selecting a locked sound does not interrupt an already-playing free sound.
- When background playback is disabled, entering the background pauses listening and any running Focus practice; returning does not silently resume it.
- Focus progress follows actual playback when sound is enabled. Silent Focus remains usable without an audio dependency. Interrupted or failed sessions cannot create completed-practice records.
- Sound library adds All, Free, Favorites and Recent scopes plus name/composer search. Scopes, category and search intersect; recent results retain recency order. Search, scopes and categories remain outside the scrolling card grid.
- Empty results explain the state and offer a reset to the full library.

### H5/Web

- Extracted the tested audio controller, protecting late promises and queued events during rapid pause/resume/scene changes; scene transitions crossfade after the new track actually starts.
- Loading, playback failure and retry are visible on both Sounds and sound-enabled Focus. Loading/buffering time is not counted as listening or Focus time.
- Added a visible Browse all sounds button while retaining ordinary home swipe gestures and Free-first scene order.
- Short landscape uses separate title/control columns; short portrait can scroll its controls. Focus/Me reserve the fixed full-width tab area so retry and bottom content remain reachable.
- Modal focus stays inside Library/Plus/Share, Escape closes, and focus returns to the trigger. Category tabs support arrow/Home/End keyboard navigation.
- Simplified Plus copy, retaining the complete listening/licensing link as a secondary action. H5 membership remains App Store-verified rather than being granted by browser state.
- Download banner is more compact on mobile/short screens, retains session-only dismissal and the first-party WeChat browser-handoff route.
- Generated 34 card thumbnails, with original full-size scene art untouched: 16,868,639 source bytes → 1,448,514 thumbnail bytes (91.4% smaller for these assets, not a whole-page transfer claim). Cards load lazily. Header/banner use 96/192 px WebP icons instead of the 1.27 MB original.
- Follow-up compact-library pass replaces the permanently expanded search and four-way scope strip with a single header row: title, search toggle, native All/Free/Favorites/Recent selector and close icon. Search expands with focus only when requested and clears its hidden query when collapsed. Categories remain fixed above the scrolling results.

### Native App

- Retains the real `AVAudioPlayer` and its position on pause/resume.
- Saved Plus scenes are not overwritten before membership verification finishes; free playback remains available while verification is pending.
- Centralized Focus state/timing in AppState so app background transitions and audio interruptions apply consistently across tabs and Now Playing.
- Downgrading from Plus resets a paused/running long Focus session even after leaving the Focus tab; it cannot resume a three-minute clock through the one-minute Free gate.
- Plus prices show Apple loading/unavailable states and a retry, and purchase is enabled only with a real loaded StoreKit product.
- The logo-lockup subtitle is shifted upward by 2 points without changing the icon, title sizing or adaptive header geometry.

## Verification

### H5

- TypeScript/Vite production build passed; protected mobile-runtime validation passed (28 files), journal generation passed (32 pages / 15 articles), and Sites packaging passed.
- 73 Node tests passed: audio 11, library 4, practice 4, product analytics 3, banner 2, analytics consent 3, Sites 45, related works 1.
- Real browser checks at 390×844, 360×740 English, 844×390 and desktop: no horizontal overflow or broken card images; library scopes/search/reset/favorites and fixed category controls worked.
- Instrumented real HTML audio: the same element and paused position were retained, then time increased after explicit resume. Plus opened/closed without stopping the current rain sound.
- Blocked-audio check: error/retry shown, countdown stayed paused; after unblocking, Focus retry resumed the practice. This caught and fixed a retry button initially obscured by the fixed tabs.
- Keyboard: repeated Tab traversal stayed in Plus; Escape returned focus to the home library trigger.
- WeChat UA check preserved the first-party download handoff and attributed region-neutral App Store destination. This is browser emulation, not a real WeChat phone acceptance test.
- Compact-library follow-up passed a fresh production build plus the 4 library filter tests. Browser checks at 390×844, 320×740 English, 844×390 and 1095×1173 confirmed no horizontal overflow; Free returned 22 items, Free + `德彪西` returned only `月光`, collapsing search cleared the query, and the icon close action dismissed the dialog.

### App

- Simulator Debug build passed, including the final membership-downgrade fix.
- Core: 16 tests passed. AppState reliability smoke and sound-library/price-state harness passed.
- Real audio smoke passed on the QA simulator with the production engine and real `AVAudioPlayer`: position froze on pause, explicit resume reused the same player and advanced from the retained position, switching created a new player with correct volume, and stop released it. The test observer was isolated from analytics.
- Native static guards passed: home interactions, analytics Release gating, share poster, introductory offer, bilingual brand lockup.
- First targeted UI run: three Focus tests passed; the library test found a real accessibility-identifier inheritance issue in the fixed controls. The result is not treated as a full pass; correction and recheck are tracked below.
- Corrected the parent accessibility identifier that overwrote search/scope identifiers and added a rectangular content shape covering the full 44 pt scope target; individual identifiers now remain independent.
- The library UI recheck passed (39.344 s): Free/search controls had independent identifiers; the Free scope remained fixed after card scrolling; Free + Classical + Debussy returned Clair de lune; unmatched search reset to Ocean. All four selected scenarios passed across the initial run and the corrected library-only recheck; the initial failed result was retained.
- Generic iOS Release build passed with `CODE_SIGNING_ALLOWED=NO`. This is a compile verification, not an archive, signed distribution build, or Apple upload.
- Simulator screenshot records the outer-display 1398×2034 layout. It is not proof of inner-display/unfolded or real-phone acceptance.
- Compact logo follow-up compiled successfully in the iOS 27.1 simulator Debug build and was installed/launched on the outer-display simulator for a visual collision check.
- Physical-device follow-up rebuilt Debug for generic iOS with inherited Swift package flags plus `DEBUG YIXIU_INTERNAL_PLUS`. The compiler invocation contained `-DYIXIU_INTERNAL_PLUS`; installation and launch succeeded on the paired iPhone 14 Pro Max (`00008120-000A341C0E0BC01E`). Installed-app readback reports Yixiu 1.19 (33). This internal QA entitlement does not change the App Store binary or subscription state.

## H5 production deployment

- HTTPS site: https://yixiu.wonderelian.com/?scene=rain&lang=zh
- Exact deployment root: `/srv/wonderelian/yixiu.wonderelian.com` on the existing production host.
- Deployment marker: `DEPLOY_OK_YIXIU_20261013-cb256ed-compact-library-1552`.
- Backup: `/srv/wonderelian/backups/yixiu-20261013-cb256ed-compact-library-1552` (complete previous production tree retained; no changes to other products).
- Guarded deployment validated the SHA-256 archive, all required pages/assets and the live origin, then switched the complete site and passed `nginx -t`; configuration was not changed. The deploy guard's expected meditation-audio count was updated from the obsolete 24-track catalog to the current verified 34-file archive count.
- Public readback hashes matched the local production files:

| File | SHA-256 |
| --- | --- |
| `index.html` | `df00c47801abdb065d1c14b662bce0a5b5b454081d7b170ca9c53b9ab7f13c21` |
| `assets/index-BKwXxLvx.js` | `cca58b9205d5b1321ba036e61c096210252aa5c1dfd3c6efa25058e33a98ba19` |
| `assets/index-L0Am_b_V.css` | `e85b43f448c6b3475eca4541112b9268c018a9f1da59810b8e314f8ee6c1371d` |

- Public fresh-browser readback confirmed the new JavaScript bundle and the compact library header: title, search icon, All/Free/Favorites/Recent selector and close icon share the top row; the category tabs and all 44 cards remain available below it.

## Evidence and limits

- Screenshots: `qa/optimization-20261013/` (production mobile/library/landscape, English narrow home, Plus, Focus retry, native home).
- Simulator build logs: `/tmp/yixiu-reliability-simulator-build-20261013.log` and `/tmp/yixiu-reliability-simulator-incremental-20261013.log`.
- First UI log: `/tmp/yixiu-reliability-focused-ui-20261013.log`; result bundle: `/Volumes/LaCie/XcodePlatforms/YixiuReliabilityFocusedUI-20261013.xcresult`.
- Library-only recheck: `/tmp/yixiu-reliability-library-ui-retry-20261013.log`; result bundle: `/Volumes/LaCie/XcodePlatforms/YixiuReliabilityLibraryRetry-20261013.xcresult`.
- Release build log: `/tmp/yixiu-reliability-release-build-20261013.log`; product: `/Volumes/LaCie/XcodePlatforms/YixiuReliabilityDerivedData-20261013/Build/Products/Release-iphoneos/YixiuMeditation.app`.
- Real StoreKit purchase/restoration, phone call/headphone interruptions, physical-phone background audio and real WeChat behavior still require physical-device acceptance. No analytics consent was granted or purchase executed for QA.
- App code/build readiness is separate from TestFlight/App Store availability. This task does not replace the currently distributed binary.

## Reproduction

Run web commands from `yixiu-prototype` with the configured Node runtime on PATH:

```sh
npm run build
node --experimental-strip-types --test tests/ambient-audio.test.ts tests/library.test.ts tests/practice-core.test.ts tests/product-analytics.test.ts tests/app-banner.test.mjs tests/analytics-consent.test.mjs tests/sites-worker.test.mjs tests/related-works.test.mjs
```

Run native commands from the repository root with `DEVELOPER_DIR=/Volumes/LaCie/XcodePlatforms/Xcode.app/Contents/Developer` for each command, without changing the machine-wide selector:

```sh
xcrun swiftc -module-cache-path /tmp/yixiu-reliability-swift-cache YixiuMeditation/YixiuMeditation/Models.swift YixiuMeditation/YixiuMeditation/SubscriptionAccessPolicy.swift YixiuMeditation/Shared/PracticeJournal.swift YixiuMeditation/YixiuMeditation/AppState.swift YixiuMeditation/Tests/AppStatePracticeSmoke.swift -o /tmp/yixiu-app-state-reliability-smoke
/tmp/yixiu-app-state-reliability-smoke
xcrun swift test --package-path YixiuMeditation --scratch-path /tmp/yixiu-reliability-core-build --cache-path /tmp/yixiu-reliability-core-cache
xcodebuild -project YixiuMeditation/YixiuMeditation.xcodeproj -scheme YixiuMeditation -derivedDataPath /Volumes/LaCie/XcodePlatforms/YixiuReliabilityDerivedData-20261013 -clonedSourcePackagesDirPath /Volumes/LaCie/XcodePlatforms/YixiuSourcePackages -disableAutomaticPackageResolution -onlyUsePackageVersionsFromResolvedFile -skipPackageUpdates CODE_SIGNING_ALLOWED=NO -configuration Release -destination 'generic/platform=iOS' build
```

For Debug replace the configuration/destination with `Debug` / `platform=iOS Simulator,id=3BB7CA6E-B597-493F-911F-E1BC0DBC626B`. The focused UI scheme is `YixiuHomeRegression` with parallel testing disabled and `-only-testing:HomeInteractionUITests/HomeInteractionUITests/<testName>` for the four scenarios recorded above.
