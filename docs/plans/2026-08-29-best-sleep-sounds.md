# Best Sleep Sounds Comparison Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Publish a truthful, playable Yixiu comparison page that opens a broad sleep-sound discovery intent and routes listeners to the existing iPhone Sleep path.

**Architecture:** Add one static intent page using the existing shared `discover.css`, `discover.js`, audio assets, timer and analytics contract. Register it in Guides, sitemap, `llms.txt`, tests and the guarded Nginx deployment path without adding a new runtime component.

**Tech Stack:** Static HTML, JSON-LD, existing vanilla JavaScript audio runtime, Node test runner, Playwright, Vite, Bash deployment guards.

---

### Task 1: Define the failing site contract

**Files:**
- Modify: `yixiu-prototype/tests/sites-worker.test.mjs`

**Step 1: Write a test for `/best-sleep-sounds/index.html` that requires the canonical, honest comparison language, seven real audio assets, seven dedicated page links, Sleep App Store attribution, timer, after-play placement, structured data and FAQ.**

**Step 2: Extend sitemap, Guides, `llms.txt` and deployment-script assertions for the new canonical.**

**Step 3: Run `npm run test:sites`.**

Expected: FAIL because the page and inventory references do not exist.

### Task 2: Implement the static comparison page

**Files:**
- Create: `yixiu-prototype/public/best-sleep-sounds/index.html`

**Step 1: Add the complete metadata and JSON-LD graph.**

**Step 2: Add the hero, one attributed App Store action, seven preview cards, shared timer, after-play CTA, selection guidance, FAQ, related Yixiu pages and Guides footer.**

**Step 3: Run the focused site test.**

Expected: the page contract passes while inventory assertions still fail.

### Task 3: Register discovery and deployment inventory

**Files:**
- Modify: `yixiu-prototype/public/guides/index.html`
- Modify: `yixiu-prototype/public/sitemap.xml`
- Modify: `yixiu-prototype/public/llms.txt`
- Modify: `yixiu-prototype/scripts/deploy-production-nginx.sh`

**Step 1: Add the 21st Guides list item and a visible sleep-comparison card.**

**Step 2: Add the canonical to sitemap and the Sleep section of `llms.txt`.**

**Step 3: Require the page, all seven audio markers, App placement and live HTTPS route in staged, deployed and loopback deployment checks.**

**Step 4: Run `npm run test:sites` and `bash -n scripts/deploy-production-nginx.sh`.**

Expected: 33 existing tests plus the new page test all pass.

### Task 4: Add mobile interaction coverage

**Files:**
- Modify: `yixiu-prototype/tests/discover-funnel.spec.ts`

**Step 1: Add a test at 390 x 844 that plays Window Rain, confirms the timer and after-play CTA, then switches to Forest Waterfall.**

**Step 2: Verify the Sleep App Store URL and `best_sleep_sounds_after_preview` placement without clicking the external link.**

**Step 3: Verify `scrollWidth <= innerWidth`.**

**Step 4: Run the focused Playwright test, full static tests, full Playwright suite, protected runtime check and production build.**

Expected: all checks pass with no visual or runtime regression.

### Task 5: Review, release and measure

**Files:**
- Create after production proof: `docs/growth/2026-08-29-best-sleep-sounds-release.md`

**Step 1: Commit, push and merge the implementation PR.**

**Step 2: Build the exact merge commit on the production server, archive it, deploy with the guarded script and retain rollback artifacts.**

**Step 3: Match source, server and public hashes for the page, Guides, sitemap and `llms.txt`.**

**Step 4: Use desktop Chrome to play two live sounds and verify the CTA without opening the App Store. Run supplementary 390 x 844 public visual QA.**

**Step 5: Submit the new canonical and sitemap to IndexNow. Request Google indexing only if Search Console exposes the authenticated action.**

**Step 6: Refresh exact-hostname GA4 and record absent rows as absent, never as zero. Commit and merge the release evidence.**
