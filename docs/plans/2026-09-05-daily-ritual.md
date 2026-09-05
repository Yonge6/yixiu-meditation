# Yixiu 1.10 — Daily Ritual Implementation Plan

**Goal:** Deliver reliable native timers, three one-tap practices and a private local practice journal with refined App/H5 UI.

**Architecture:** Preserve all 1.9 reliability work (not yet pushed), the native TabView and protected web shell. Reuse the existing nature recordings and typography. Shared Swift value types own countdown math and journal records; AppState persists bounded local history. H5 uses equivalent deadline accounting and explicitly device-local storage, with defensive decoding. No accounts, backend, Human Design, streak pressure or new tracking of personal practice data.

**Tech Stack:** SwiftUI, UserNotifications, Swift Testing, React/TypeScript, Playwright.

## Design decisions

- Keep Sounds immersive and uncluttered. Refine its readability; no extra dashboard.
- Focus becomes a quiet editorial practice surface: small overline, generous title, three compact photographic rows, and the existing breathing exercise. Rows collapse while breathing is active.
- Presets: Before sleep / Rain / 15 minutes; Work break / Stream / 1-minute breathing; Morning clarity / Birds / 5 minutes. All are free; add 5-minute playback without altering existing Plus restrictions.
- Me begins with a local weekly minutes summary, seven-day activity marks and the last three completed practices with replay. Empty state is honest; only completed sessions count, breathing ambience is not counted twice. Keep at most 200 records.
- Notification taps route to a ready 1-minute Focus screen (no surprise audio). Add explicit app URLs for focus and resume; widget medium size offers resume via URL while retaining its existing Live Activity action and system-language localization.
- Water/navy, clear moon-white text, aqua only for actions, restrained warm morning accent. Preserve current artwork and Chinese/English typefaces. Support small phones, iPad, text enlargement and reduced motion.

## Tasks and validation

1. Add Shared/PracticeJournal.swift with CountdownClock and PracticeEntry; test pause/resume, delayed callbacks, duration reset, capped/deduplicated records, weekly boundaries and serialization using Swift Testing.
2. Integrate deadlines into AppState and FocusView; reconcile on scene activation. Add opt-in notification response routing and explicit URL handling. Test iOS build and simulator paths.
3. Implement Focus shortcuts + Me journal in SwiftUI. Update 5-minute free timer support and version to 1.10 (23). Keep public Release StoreKit and internal Debug Plus separate.
4. Implement matching H5 shortcuts/journal within Prototype.tsx/prototype.css. Add Playwright tests for presets, exact completion recording, persistence, replay and no double counting.
5. Run protected-runtime checks, builds, all web/Swift tests, and App device/simulator builds. Review code and preview responsive UI. Preserve original worktrees.
6. Commit local work and report verifiable status. Do not submit App Store review. GitHub push and physical phone install remain contingent on reauthentication and device availability; do not claim they succeeded without readback.
