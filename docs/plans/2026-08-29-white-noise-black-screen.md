# White Noise Black-Screen Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a real browser black-screen mode to Yixiu's existing underwater white-noise sleep page and align the indexed canonical page with the matching search intent.

**Architecture:** Reuse the optional dark-screen hooks in `discover.js` and make their status label derive from the active preview button rather than Window Rain. Opt the existing underwater page into that runtime, then align its metadata, visible content, structured data and internal discovery surfaces without creating a new URL.

**Tech Stack:** Static HTML, CSS and JavaScript; Node test runner; Playwright; Vite production build.

---

### Task 1: Lock the existing-page contract with failing tests

**Files:**
- Modify: `yixiu-prototype/tests/sites-worker.test.mjs`
- Modify: `yixiu-prototype/tests/discover-funnel.spec.ts`

**Step 1: Write the failing static test**

Require the existing underwater canonical page to expose the `White Noise Black Screen` title/H1 language, real underwater audio, black-screen toggle and overlay, timer, identical visible/schema FAQ, attributed App Store actions and updated Guides/`llms.txt` discovery copy.

**Step 2: Write the failing runtime test**

Require the black-screen button to begin disabled, become enabled only after playback, cover the 390 x 844 viewport in black, announce `Underwater White Noise is playing`, keep the timer advancing and restore focus after click or Escape.

**Step 3: Run focused tests and verify failure**

Run:

```bash
npm run test:sites -- --test-name-pattern="underwater white noise"
npx playwright test tests/discover-funnel.spec.ts --grep "underwater white noise black screen"
```

Expected: both tests fail because the current page has no black-screen markup or aligned search copy.

### Task 2: Generalize the optional dark-screen runtime

**Files:**
- Modify: `yixiu-prototype/public/discover.js`

**Step 1: Derive the active scene label**

Add a small helper that uses the active preview button's `data-play-label`, removes the leading `Play ` text and falls back to `Sound`.

**Step 2: Use the scene label for status text**

Set the open-overlay status to `<scene> is playing` and the pause status to `<scene> is paused`. Preserve current timer-complete, focus, Escape and analytics behavior.

**Step 3: Run the existing Window Rain test**

Run:

```bash
npx playwright test tests/discover-funnel.spec.ts --grep "rain sleep dark screen"
```

Expected: pass with the existing `Window Rain is playing` behavior unchanged.

### Task 3: Opt in and align the existing canonical page

**Files:**
- Modify: `yixiu-prototype/public/underwater-white-noise-for-sleep/index.html`
- Modify: `yixiu-prototype/public/guides/index.html`
- Modify: `yixiu-prototype/public/sleep-sounds/index.html`
- Modify: `yixiu-prototype/public/llms.txt`
- Modify: `yixiu-prototype/public/sitemap.xml`

**Step 1: Add the real control and overlay**

Place a disabled `Black Screen` button beside Play and App Store, add a concise browser-vs-iPhone explanation and append the full-viewport overlay markup.

**Step 2: Align search-facing copy**

Update title, meta description, Open Graph, Twitter, WebPage and SoftwareApplication descriptions, H1, lede, proof card and first FAQ. Keep copy factual: real underwater texture, no music/talking/account/ads, 15/30/60 timer and browser black screen.

**Step 3: Keep structured data visible and identical**

Make the first visible FAQ question and answer exactly match FAQ JSON-LD. Do not add ratings, reviews or unsupported medical claims.

**Step 4: Strengthen internal discovery**

Update the Guides card, `llms.txt`, sitemap `lastmod` and the existing sleep-page contextual anchor to the same canonical URL.

### Task 4: Verify locally

**Files:**
- No additional production files expected.

**Step 1: Run focused tests**

Run the static and Playwright tests from Task 1. Expected: pass.

**Step 2: Run protected and full suites**

Run:

```bash
npm run check:runtime
npm run test:sites
npm run build
npx playwright test
```

Expected: every command passes.

**Step 3: Inspect mobile runtime**

Render at 390 x 844, start the underwater scene, enter black-screen mode and capture both the page and overlay. Verify both principal buttons are at least 48 px high, the overlay is exactly the viewport and `scrollWidth <= innerWidth`.

**Step 4: Check the diff**

Run `git diff --check` and inspect the complete diff. Expected: no whitespace errors or unrelated-product changes.

### Task 5: Release and prove external state

**Files:**
- Create after release: `docs/growth/2026-08-29-white-noise-black-screen-release.md`

**Step 1: Commit and open a ready PR**

Commit the implementation, push the `codex/yixiu-white-noise-black-screen-20260829` branch and create a ready PR against `main`. Merge only if GitHub reports `CLEAN` and `MERGEABLE` and configured checks pass.

**Step 2: Deploy the exact merge commit**

Build from a server clone whose HEAD equals the merge commit, create a release archive and backup, verify hashes, run Nginx validation and execute every existing production acceptance check.

**Step 3: Verify production interaction**

In authenticated desktop Chrome where needed, read back title, H1, canonical, FAQ, real playback, scene-aware black-screen status, full-viewport overlay, timer continuity, App Store placements and absence of horizontal overflow.

**Step 4: Submit discovery once**

Request one Search Console recrawl for the changed canonical URL and submit the changed canonical, Guides, `llms.txt` and sitemap to IndexNow. Treat both as submission receipts only.

**Step 5: Refresh authoritative measurement**

Read exact-hostname GA4 for the latest completed Beijing natural day and the current incomplete day. Retain Apple official download proof and keep unavailable trials, payments, subscriptions, IAP, revenue and campaign-specific downloads as `null`.

**Step 6: Record and merge evidence**

Write the evidence document with implementation, test, deployment, indexing and measurement boundaries, then merge it through a separate documentation-only PR.
