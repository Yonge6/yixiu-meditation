# Yixiu Rain Dark-Screen Player Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Turn the existing Yixiu Sleep search landing into a real, measurable dark-screen rain player without creating a duplicate page or touching another product.

**Architecture:** Add opt-in dark-screen markup to `/sleep-sounds/`, then let the shared Discover script activate the behavior only when those data attributes exist. A fixed black overlay stays within normal DOM/CSS, preserves the existing looping real-rain audio and timer, and emits start/end events through the existing analytics bridge.

**Tech Stack:** Static HTML, vanilla JavaScript, CSS, Node test runner, Playwright, GA4 event bridge, Nginx production deployment, IndexNow and Google Search Console.

---

### Task 1: Add failing page-contract tests

**Files:**
- Modify: `yixiu-prototype/tests/sites-worker.test.mjs`
- Modify: `yixiu-prototype/tests/discover-funnel.spec.ts`

**Step 1: Extend the static Sleep-page test**

Require the 54-character `Rain Sounds for Sleeping — Dark Screen, No Ads | Yixiu` title, a 150–160 character description containing `dark screen`, one H1 containing the same intent, a disabled `[data-dark-screen-toggle]`, `[data-dark-screen-overlay]`, visible web-versus-iPhone explanation, five visible FAQ questions, and matching five-question FAQ JSON-LD.

**Step 2: Add the browser interaction test**

At 390×844, prove the dark-screen button begins disabled, becomes enabled only after Window Rain starts, opens a full-viewport overlay, leaves playback and timer running, closes by click and Escape, restores focus to the toggle, records start/end custom analytics events, and creates no horizontal overflow.

**Step 3: Run the tests to verify failure**

Run:

```bash
PATH=/Users/yongyuan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH npm run test:sites
PATH=/Users/yongyuan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH MOBILE_RUNTIME_TEST_PORT=4187 npx playwright test tests/discover-funnel.spec.ts --grep "dark screen" --workers=1
```

Expected: both new assertions fail because the page does not yet expose the dark-screen contract.

### Task 2: Implement the minimal page and runtime behavior

**Files:**
- Modify: `yixiu-prototype/public/sleep-sounds/index.html`
- Modify: `yixiu-prototype/public/discover.js`
- Modify: `yixiu-prototype/public/discover.css`

**Step 1: Update the search promise**

Update title, description, Open Graph/Twitter copy, H1, first paragraph, proof copy and FAQ. Keep the canonical, real `light-rain.m4a`, YouTube VideoObject and attributed Sleep App Store URLs unchanged. Add the fifth visible FAQ and identical JSON-LD answer explaining that web dark-screen mode dims the page, while physical iPhone locking requires app background playback.

**Step 2: Add opt-in controls**

Add a disabled `Darken Screen` button with `data-dark-screen-toggle` and placement `sleep_landing_dark_screen`. Add one hidden, focusable full-viewport button with `data-dark-screen-overlay` and concise exit instructions.

**Step 3: Add behavior**

In `discover.js`, query the optional controls. Enable the toggle when preview playback succeeds and disable it when playback stops. Opening the overlay adds `is-dark-screen`, focuses the overlay and reports `yixiu_dark_screen_start`; click or Escape closes it, restores focus, and reports `yixiu_dark_screen_end`. Do not stop audio or reset the timer when closing.

**Step 4: Add presentation**

In `discover.css`, style the secondary disabled action, fixed black overlay, low-contrast instructions, scroll lock and mobile viewport behavior. Respect `[hidden]` and `prefers-reduced-motion`; no animation is required.

### Task 3: Make targeted tests pass and visually inspect

**Files:**
- Modify only the files from Tasks 1–2 if tests expose a defect.

**Step 1: Run static and focused browser tests**

Use the Task 1 commands. Expected: PASS.

**Step 2: Start a dedicated local server**

Run Vite on an unused port and inspect `/sleep-sounds/` at 390×844 and desktop width. Capture the normal player, active dark-screen overlay and restored page. Confirm the overlay is black, the exit instruction is legible but subdued, the timer continues, and there is no overflow.

**Step 3: Commit implementation**

```bash
git add yixiu-prototype/public/sleep-sounds/index.html yixiu-prototype/public/discover.js yixiu-prototype/public/discover.css yixiu-prototype/tests/sites-worker.test.mjs yixiu-prototype/tests/discover-funnel.spec.ts
git commit -m "feat: add Yixiu rain dark-screen player"
```

### Task 4: Run complete local acceptance

**Files:**
- No source changes unless a failure identifies a real defect.

**Step 1: Verify protected runtime and build**

```bash
PATH=/Users/yongyuan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH npm run check:runtime
PATH=/Users/yongyuan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH npm run build
PATH=/Users/yongyuan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH npm run test:sites
```

Expected: runtime 28 protected files pass, build succeeds, all site tests pass.

**Step 2: Run the complete browser suite on a dedicated port**

```bash
PATH=/Users/yongyuan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH MOBILE_RUNTIME_TEST_PORT=4188 npm run test:runtime -- --reporter=line
```

Expected: all tests pass. If the known keyboard transition test flakes under concurrency, rerun it three times with one worker and record both results rather than weakening the test.

### Task 5: Merge, deploy and prove the external result

**Files:**
- Create: `docs/growth/2026-08-29-rain-dark-screen-player-release.md`

**Step 1: Push and merge a scoped PR**

Fetch `origin/main`, prove the branch is based on the current main, push, create a ready PR, verify mergeability, merge, and compare the branch tree with the merged main tree.

**Step 2: Deploy the exact merge commit**

Build a release archive, record SHA-256, run the guarded Yixiu Nginx deployment script, retain the server backup, and require `nginx -t` success.

**Step 3: Verify production**

Require HTTP 200 for the Sleep page, real rain audio, shared CSS and shared JavaScript. Compare source, server and public hashes. In desktop Chrome, prove the new public title/copy, play real rain, open/close the full-viewport dark screen, confirm timer progress and verify no mobile overflow.

**Step 4: Submit discovery signals**

Submit `/sleep-sounds/`, `/guides/` and `/sitemap.xml` to IndexNow and require HTTP 200. Request recrawl for the existing Sleep canonical in Google Search Console without claiming indexing, ranking or clicks.

**Step 5: Record the measurement boundary**

Record the fresh exact-hostname GA4 snapshot, GSC state, Apple official 10 first-time downloads and 4 redownloads, and keep unavailable trial/payment/subscription/revenue metrics `null`. Do not claim 100 UV unless a completed Beijing day proves it.
