# Window Rain Quiet Pass Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Let a Window Rain listener send a complete 96-second bilingual rain gift after 60 seconds of real playback, creating a measurable recipient and re-share loop from Yixiu's strongest landing page.

**Architecture:** Reuse the existing anonymous Quiet Pass controller and visual system. Add one static noindex gift page and one hidden origin block to `/sleep-sounds/`; the shared `yixiu:playback-progress` event reveals the block after 60 seconds for scene key `window`. Keep all gift identity client-generated and anonymous, with no registration, entitlement or membership mutation.

**Tech Stack:** Static HTML/CSS/JavaScript, existing `quiet-pass.js`, existing `discover.js` playback bridge, Node test runner, Vite production build, guarded Nginx deployment.

---

### Task 1: Add the failing static contracts

**Files:**
- Modify: `yixiu-prototype/tests/sites-worker.test.mjs`

**Step 1: Extend the Quiet Pass case table**

Add `window-rain` with canonical `/gift/window-rain/`, image `/assets/yixiu/window-rain.png`, audio `/assets/yixiu/audio/light-rain.m4a`, source `/sleep-sounds/` and content `window_rain_gift`.

**Step 2: Add Sleep origin assertions**

Require `/sleep-sounds/` to expose `data-quiet-pass-origin="window-rain"`, scene key `window`, threshold `60`, gift path `/gift/window-rain/`, the Quiet Pass stylesheet and controller.

**Step 3: Run the targeted test and verify failure**

Run: `node --test --test-name-pattern="quiet pass" tests/sites-worker.test.mjs`

Expected: FAIL because the page and Sleep origin do not exist yet.

### Task 2: Build the Window Rain gift

**Files:**
- Create: `yixiu-prototype/public/gift/window-rain/index.html`
- Modify: `yixiu-prototype/public/sleep-sounds/index.html`

**Step 1: Create the recipient page**

Reuse the current Quiet Pass structure with:

- bilingual receive, playback, completion, error and re-share copy;
- the existing 96-second `light-rain.m4a` recording;
- the existing Window Rain image;
- canonical `/gift/window-rain/` and `noindex,follow`;
- `data-quiet-pass-scene="window-rain"`, content `window_rain_gift` and a Sleep App Store continuation;
- no account, signup, unlock, membership or reward language.

**Step 2: Add the qualified origin block**

Load `quiet-pass.css` and `quiet-pass.js` from the Sleep page. Add a hidden `quiet-pass-origin` block that reveals after 60 seconds of scene `window` playback and shares `/gift/window-rain/` with `share / referral / quiet_pass / window_rain_gift` attribution.

**Step 3: Run the targeted test**

Expected: PASS.

### Task 3: Extend deployment acceptance

**Files:**
- Modify: `yixiu-prototype/scripts/deploy-production-nginx.sh`
- Modify: `yixiu-prototype/tests/sites-worker.test.mjs`

**Step 1: Add staged and deployed checks**

Require `gift/window-rain/index.html`, its title, audio, gift content token and Sleep origin. Change the exact count of `discover.js?v=20260830-quiet-pass-progress` pages from two to three only if the Sleep page uses that same version; otherwise require the new version explicitly without weakening the existing two-page contract.

**Step 2: Update the deploy-script contract test**

Assert the new gift and Sleep origin checks are present.

**Step 3: Run static and deploy tests**

Run: `npm run test:sites`

Expected: all tests PASS.

### Task 4: Full verification and release

**Files:**
- Modify: `docs/growth/2026-08-31-window-rain-quiet-pass-release.md` after production proof

**Step 1: Run full local checks**

- `npm run check:runtime`
- `npm run build`
- `npm run test:sites`
- `bash -n scripts/deploy-production-nginx.sh`
- `git diff --check`

**Step 2: Browser interaction acceptance**

At 390 x 844, verify the Sleep page stays responsive, real rain playback starts, the gift block remains hidden before qualification, a test progress event reveals it, and the generated gift URL carries a valid anonymous ID plus exact attribution. On the recipient page, verify English default, language toggle, audio playback and no console errors.

**Step 3: Merge and deploy the exact merge commit**

Build an isolated release archive from the merged source, validate its SHA-256, retain the previous production tree and release artifacts, and require the existing Nginx/HTTPS guards.

**Step 4: Public acceptance**

Require HTTP 200 for Sleep and the gift page, source/server/public hash equality, HTTP 206 for Window Rain audio, exact noindex/canonical, working playback and gift attribution. Submit the changed Sleep URL to IndexNow and one Google recrawl request only after production acceptance.

**Step 5: Record the authority boundary**

Keep the complete-day 13-UV result and 87-UV gap. Gift-created, opened, played, qualified, reshared and App outcomes remain `null` unless later authoritative reports expose them.
