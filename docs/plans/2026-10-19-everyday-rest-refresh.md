# Everyday Rest Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Execute in this session under the user's explicit implementation-and-release authorization.

**Goal:** Align H5 and native Yixiu with everyday rest while keeping the home an uncluttered immersive player; lunch, night waking and work-break presets belong only in Focus.

**Architecture:** Reuse existing sound selection, timer, breathing, local journal and consent-gated analytics. Keep stable scene IDs, 27 Free / 54 total catalog, native system tabs, web full-width tabs, opt-in privacy and existing download handoff. H5 gets intent-aware deep links with explicit user-gesture playback, not autoplay. Native source/build delivery is separate from an approved App Store release.

**Tech Stack:** React/TypeScript, app-owned CSS, SwiftUI/StoreKit, Firebase/GA4 consent gates, existing Node/Swift regression harnesses, production Nginx atomic publisher.

---

## Approved decisions

- Do not add scenario buttons to Sounds/home. Keep its existing player and controls.
- Focus presets: lunch 15 minutes (free lake), night waking 15 minutes (free window rain), work break 1 minute (free breathing). All complete without Plus.
- Focus offers guided breathing and sound-only listening without overriding a user's silence preference during normal tab switching.
- Put continue/recent/favorites before settings and optional records. Related works become a compact secondary entry with Back.
- Main brand: 随时，给自己一休。 / Make room for quiet. Preserve App name/icon, real photography and nighttime palette.
- Remove future capabilities from current Plus benefits. Explain current benefits before subscription options; do not change prices or verified entitlements.
- Do not invent completed time in share copy, guarantee sleep, add pressure/streaks, or claim Web background reliability equivalent to App.
- Existing media-progress qualification remains; add rest intent/entry point and a once-per-rest meaningful-rest event. Never upload journal text or new identifiers. Debug/internal Plus remains excluded from native production analytics.

### Task 1: Native source implementation

**Files:** `YixiuMeditation/YixiuMeditation/{FocusView,ListenView,MeView,Models,AppState,PlusPaywallView,ProductAnalytics}.swift` and focused native harnesses.

1. Inspect actual view composition and access policy. Preserve pre-existing changes to `ContentView.swift`, project settings and UI tests.
2. Add/revise free Focus presets and sound-only affordance; reuse `startQuickListening` / `prepareFocus`.
3. Reorder Me, consolidate related works, shorten About lead and preserve optional philosophy.
4. Update brand/share copy and current-only Plus benefits; place benefits before plans.
5. Add consent-safe rest context and shared qualification; extend regression tests.
6. Verify Swift parsing/harnesses, then simulator build using the installed SDK. Never imply a source build is App Store publication.

### Task 2: H5 behavior and UI

**Files:** `yixiu-prototype/src/{Prototype.tsx,prototype.css,library.ts}` as needed; focused `tests/`.

1. Add tests for intent links/default presets and category groups before changes.
2. Keep home controls/layout; change only its short promise and share copy.
3. Add Focus mode and three free presets with explicit-tap start. Parse intent links before saved defaults and preserve ordinary scene links.
4. Separate library purpose and sound-type filtering without introducing more chip rows or narrowing keyboard access; preserve independent scope/search.
5. Reorder Me, add compact related-works detail, move records below settings, shorten About lead.
6. Improve secondary type contrast/size and verify 320/390/desktop/short landscape in both languages. Keep 16px search input, reduced motion and banner safe-area behavior.

### Task 3: Analytics and privacy

**Files:** `yixiu-prototype/src/product-analytics.ts`, `public/analytics.js`, `public/privacy.html`, analytics tests; matching native files in Task 1.

1. Add allowlisted `rest_intent` / `entry_point`; snapshot context on actual playback.
2. Qualify after 60 seconds of real media or completed breathing once for a shared rest attempt.
3. Extend tests for no consent, stalls, seek, duplicate qualification, and intent isolation.
4. Reconcile optional telemetry with local-only practice-history wording. Do not change consent defaults or platform privacy declarations without checking evidence.

### Task 4: Verification and public release

1. Run runtime lock, TypeScript/build, Node unit/source regressions, audio/practice/library/privacy tests.
2. Run native focused tests and simulator build; capture actual UI when the simulator is available.
3. Start the existing Vite preview. Use the browser to inspect fresh Chinese/English screenshots and primary flows; fix layout or functional regressions before deployment.
4. Stage only this request's changes, excluding unrelated pre-existing native edits. Use the established release path with recoverable backup; do not modify other projects.
5. Deploy H5, read back the public bundle and browser flows, verify no home presets and all Focus presets work for Free.
6. Report verified H5 URL, native build status, tests and any unverified device/App Store state distinctly.

## Acceptance

- Home has no lunch/night/work preset strip.
- Focus has three free presets and guided/sound-only modes in Chinese and English.
- Normal tab switching preserves audio and scene selection.
- Me starts with continuation/recent/favorites; records are optional/lower; secondary pages have Back.
- No future benefit is presented as purchased/current; catalog, prices and licenses unchanged.
- H5 intent links prepare a matching free experience but never autoplay on load.
- New telemetry respects consent and does not count buffering, seeking or duplicate audio/breath qualification.
- H5 is only called live after public readback; native source/build is not called App Store live without separate proof.
