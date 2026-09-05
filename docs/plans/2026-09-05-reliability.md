# Yixiu Reliability Implementation Plan

> Execute task-by-task in this isolated worktree using the Code verification workflow. The user has approved implementation, GitHub push, production H5 deployment and installation on their paired iPhone; no additional App Store submission.

**Goal:** Make reminders continuous, sharing recoverable, and H5 timers accurate after delayed callbacks.

**Architecture:** Retain SwiftUI, the existing H5 shell and the existing Nginx deployment. Replace the finite notification queue with one daily repeating request; serialize notification mutations. Keep timer deadlines in refs and derive display state from elapsed wall time. Preserve QR artwork, Chinese/English support, StoreKit release entitlements and the DEBUG-only internal preview.

**Tech Stack:** SwiftUI/UserNotifications, Swift Testing, React/TypeScript, Playwright, Vite.

---

## Decisions

- Prefer a daily repeat over background queue replenishment (not guaranteed) or adding a push server (unnecessary infrastructure). Use the first localized quiet-minute copy consistently.
- Preserve the current share sheet, adding a busy guard, visible failure and an explicit image-share retry in the fallback preview so a fresh tap can authorize system sharing.
- Prefer wall-clock deadlines over callback counting. H5 cannot guarantee execution while the OS suspends the page; reconcile on visibility/pageshow and the next timer callback.

### Task 1: Regression tests

Modify `YixiuMeditation/Tests/YixiuActivityCoreTests/DailyReminderScheduleTests.swift` to verify the repeating identifier, migration identifiers and date components without date/timezone pinning.
Create `yixiu-prototype/tests/reliability.spec.ts` for delayed clock callbacks, pause/resume, duration reset, share generation failure and double-click prevention.
Run `swift test --package-path YixiuMeditation` and `npm run test:runtime -- reliability.spec.ts`; new assertions should fail before implementation.

### Task 2: Native reminder reliability

Modify `Shared/DailyReminderSchedule.swift`, `YixiuMeditation/DailyReminderManager.swift`, `MeView.swift` and `YixiuMeditationApp.swift`.
Use a stable recurring request ID, remove legacy IDs only after successful add, serialize writes, preserve existing schedules on replacement failure, expose busy/error state, refresh authorization when active.
Run Swift tests and build both device Debug/internal Plus and simulator Release. Bump app + widget build to 22, retain marketing version 1.9.

### Task 3: H5 reliability

Modify app-owned `src/Prototype.tsx` and `src/prototype.css` only, preserving all protected runtime files.
Derive playback/focus progress from deadlines, retain fractional time over pause/resume, reset explicitly on duration selection, prevent duplicate completion events.
Add share busy/error feedback, an image-load timeout, retained payload for explicit system-share retry and correct scene snapshot labels.
Run targeted regressions, runtime integrity, production build, 44 Sites tests and full Playwright suite. Visually inspect phone-size Chrome.

### Task 4: Release and installation

Commit validated changes and push/merge the scoped GitHub PR. Wait for main workflows before deploying the exact built static archive using the established backup-enabled Nginx script.
Verify public HTML/JS/CSS against build hashes and live interactions in desktop Chrome.
Install the signed internal preview on 永歌14PM only when connected; read back version/build and launch. Do not erase app data or install on other devices.
Record tests, release receipt, hashes, rollback and device outcome in project documentation. Never infer Apple downloads or subscriptions from deployment/install.
