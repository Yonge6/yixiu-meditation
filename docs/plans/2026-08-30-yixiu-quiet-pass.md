# Yixiu Quiet Pass Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship an anonymous, account-free Quiet Pass loop for the existing First Breath and Still Water web tracks.

**Architecture:** Add two static gift routes backed by one shared `quiet-pass.js` controller and `quiet-pass.css` visual layer. Extend the existing discovery player with a progress event so the two source pages can reveal a delayed share invitation; retain all playback when analytics, share, or attribution is unavailable.

**Tech Stack:** Static HTML/CSS/JavaScript, Vite public assets, Playwright, Node test runner, GA4 event bridge, existing atomic Nginx deployment script.

---

### Task 1: Lock the static contract with failing tests

**Files:**
- Create: `yixiu-prototype/tests/quiet-pass.spec.ts`
- Modify: `yixiu-prototype/tests/sites-worker.test.mjs`

**Step 1:** Add static assertions for two gift routes, unique canonicals and Open Graph metadata, no-index directives, bilingual controls, exact audio sources, attributed App Store links, source-page Quiet Pass markers, and deployable shared assets.

**Step 2:** Add browser tests for threshold reveal, valid and invalid gift IDs, play start, 60-second qualification, one-time event suppression, onward share, share cancellation, audio failure recovery, keyboard focus, mobile layout, and reduced motion.

**Step 3:** Run `npm run test:sites` and `npx playwright test tests/quiet-pass.spec.ts`; expect failures because the routes and assets do not yet exist.

### Task 2: Add the shared Quiet Pass behavior

**Files:**
- Create: `yixiu-prototype/public/quiet-pass.js`
- Modify: `yixiu-prototype/public/discover.js`

**Step 1:** Emit `yixiu:playback-progress` from the existing audio controller without changing playback semantics.

**Step 2:** Implement anonymous gift-ID creation and validation, source threshold reveal, native-share/clipboard fallback, recipient playback, bilingual copy, local one-time event suppression, 60-second qualification, onward sharing, and audio error recovery.

**Step 3:** Run the focused browser tests and confirm the behavior layer passes independently of final styling.

### Task 3: Build the two immersive gift pages

**Files:**
- Create: `yixiu-prototype/public/gift/first-breath/index.html`
- Create: `yixiu-prototype/public/gift/still-water/index.html`
- Create: `yixiu-prototype/public/quiet-pass.css`
- Modify: `yixiu-prototype/public/1-minute-meditation-music/index.html`
- Modify: `yixiu-prototype/public/20-minute-meditation-music/index.html`

**Step 1:** Add the delayed Quiet Pass cards and versioned shared script to both source pages.

**Step 2:** Add scene-specific semantic HTML, metadata, audio, fallback path, and App Store campaign URL to both recipient pages.

**Step 3:** Implement the full-bleed deep-water composition, visible language toggle, accessible player controls, completion reveal, phone-safe spacing, focus states, and reduced-motion fallback.

**Step 4:** Run focused static and browser tests until green.

### Task 4: Extend build and atomic deployment gates

**Files:**
- Modify: `yixiu-prototype/scripts/deploy-production-nginx.sh`

**Step 1:** Require both gift pages, the shared script and stylesheet, exact metadata, source hooks, audio sources, campaign URL, and updated public-HTML counts in the staged archive.

**Step 2:** Add the same checks after deployment plus HTTPS loopback reads for both gift routes and ranged audio fetches.

**Step 3:** Run `npm run check:runtime`, `npm run test:sites`, the full Playwright suite, and `npm run build`.

### Task 5: Visual and accessibility verification

**Files:**
- Create: `docs/growth/2026-08-30-yixiu-quiet-pass-release.md`

**Step 1:** Capture First Breath and Still Water at 390×844 and desktop width, inspect the initial gift, active playback, qualified completion, and error state.

**Step 2:** Verify no horizontal overflow, keyboard navigation, readable contrast, reduced motion, language switching, and uninterrupted behavior when analytics and Web Share are unavailable.

**Step 3:** Record local test output, visual evidence, exact scope, metric boundary, and production acceptance requirements.

### Task 6: Release and production proof

**Files:**
- Modify: `docs/growth/2026-08-30-yixiu-quiet-pass-release.md`

**Step 1:** Commit only the Quiet Pass code, tests, deployment gates, and documentation; push `codex/yixiu-quiet-pass-20260830`.

**Step 2:** Open and merge a focused PR after CI passes.

**Step 3:** Build a deterministic archive from merged `main`, publish it through the existing rollback-safe Nginx script, and require deployment success.

**Step 4:** Read back both public routes, metadata, script/style hashes, audio byte ranges, source-page hooks, and responsive DOM through the public hostname.

**Step 5:** Refresh only available official GA4/Apple evidence. Do not classify operator QA as acquisition or replace unavailable outcomes with zero.
