# Ocean Waves for Sleeping Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a durable English acquisition page for ocean waves at bedtime that uses Yixiu's real audio and routes qualified visitors to the Sleep App Store custom product page.

**Architecture:** Build a static intent page from the existing Yixiu discovery-page system. Reuse shared `discover.css`, `discover.js`, analytics attributes, first-party media and the established App Store campaign URL; update the guides collection, sleep hub, ocean-focus page and sitemap as discovery surfaces.

**Tech Stack:** Static HTML, JSON-LD, shared CSS/JavaScript, Node site tests, Vite, Playwright.

---

### Task 1: Add failing route coverage

**Files:**
- Modify: `yixiu-prototype/tests/sites-worker.test.mjs`

**Step 1:** Add assertions for `/ocean-waves-for-sleeping/`, its canonical URL, ocean audio path, Sleep ppid, image and sitemap entry.

**Step 2:** Run the focused site tests with the bundled Node runtime.

Expected: FAIL because the route does not exist yet.

### Task 2: Build the intent page

**Files:**
- Create: `yixiu-prototype/public/ocean-waves-for-sleeping/index.html`

**Step 1:** Add the optimized title, description, canonical, social metadata, WebPage/ImageObject/FAQ/SoftwareApplication schema, visible intent copy, real audio preview, related paths and Sleep App Store CTA.

**Step 2:** Keep claims practical and non-medical; include low-volume, timer and sound-comparison guidance.

**Step 3:** Run the focused site tests.

Expected: the new route assertions pass.

### Task 3: Add internal discovery and deployment guards

**Files:**
- Modify: `yixiu-prototype/public/guides/index.html`
- Modify: `yixiu-prototype/public/sleep-sounds/index.html`
- Modify: `yixiu-prototype/public/ocean-waves-for-focus/index.html`
- Modify: `yixiu-prototype/public/sitemap.xml`
- Modify: `yixiu-prototype/scripts/deploy-production-nginx.sh`

**Step 1:** Add the page to the guides ItemList and visible guide grid.

**Step 2:** Add contextual links from the sleep hub and ocean-focus page.

**Step 3:** Add the route to the sitemap with the current last-modified date.

**Step 4:** Extend production preflight and live verification guards for the page and ocean audio.

**Step 5:** Run site tests.

Expected: all site tests pass and the page is neither orphaned nor omitted from production checks.

### Task 4: Full local verification

**Files:**
- Verify only

**Step 1:** Run `npm run check:runtime`.

**Step 2:** Run `npm run test:sites`.

**Step 3:** Run `npm run build`.

**Step 4:** Run the Playwright discovery-funnel tests.

Expected: every command exits 0.

**Step 5:** Serve the built site and inspect the page at 390 px. Confirm no horizontal overflow, the real audio starts, and the post-preview download and share CTAs become visible.

### Task 5: Review and release

**Files:**
- Verify the complete diff

**Step 1:** Confirm only Yixiu files changed and the worktree is clean after commit.

**Step 2:** Push the branch and open a ready pull request.

**Step 3:** Merge only after the source tree, tests and PR diff agree.

**Step 4:** Deploy the merged tree with the existing atomic Nginx script, retain the rollback backup and verify production page/audio/sitemap hashes.

**Step 5:** Submit the new page, guides and sitemap to IndexNow, then inspect Google Search Console discovery state.
