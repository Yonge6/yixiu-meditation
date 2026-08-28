# Rain Sounds When iPhone Locks Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Publish a truthful, indexable Yixiu guide that answers how to keep rain sounds playing after an iPhone locks and provides a measurable preview-to-App-Store path.

**Architecture:** Add one static intent page using the existing Discover CSS, audio player and timer. Register it in the Guides hub, sitemap, site tests, Playwright funnel tests and the atomic Nginx deployment verifier. Keep the protected app runtime unchanged.

**Tech Stack:** Static HTML, JSON-LD, shared vanilla JavaScript, Node test runner, Playwright, Vite build, Bash deployment checks.

---

### Task 1: Lock the contract with failing tests

**Files:**
- Modify: `yixiu-prototype/tests/sites-worker.test.mjs`
- Modify: `yixiu-prototype/tests/discover-funnel.spec.ts`

Add the new route to the static-asset and English-guide lists. Assert metadata length, canonical, one H1, Apple source link, aligned HowTo/FAQ/TechArticle schema, real rain audio, timer, Sleep CPP URL, placements and no unsupported claims. Add a mobile funnel test for playback, timer and post-preview CTA. Run the focused tests and confirm they fail because the route does not exist.

### Task 2: Build the guide and discovery links

**Files:**
- Create: `yixiu-prototype/public/rain-sounds-when-iphone-locked/index.html`
- Modify: `yixiu-prototype/public/sleep-sounds/index.html`
- Modify: `yixiu-prototype/public/guides/index.html`
- Modify: `yixiu-prototype/public/sitemap.xml`

Use the Window Rain WebP/PNG and `light-rain.m4a`. Answer the Apple setting path in the first paragraph, link the official Apple guide, render matching ordered steps and FAQs, and use attributable Sleep CPP links. Add contextual links from the sleep page and Guides hub, update the Guides ItemList to 19, and add the sitemap entry dated 2026-08-28.

### Task 3: Extend deployment proof

**Files:**
- Modify: `yixiu-prototype/scripts/deploy-production-nginx.sh`

Require the new file in the extracted archive, verify its audio, timer, official Apple URL, analytics placement, Sleep CPP and sitemap entry, then verify the deployed file and loopback public response before declaring success.

### Task 4: Verify locally

Run:

1. `npm run check:runtime`
2. `npm run build`
3. `npm run test:sites`
4. Relevant Playwright funnel tests, then the full runtime suite if focused checks pass.

Start the local preview, inspect desktop and 390 px layouts, click the preview and timer, validate the post-play CTA, and confirm no horizontal overflow.

### Task 5: Release and prove production

Commit the implementation, push the branch and merge a reviewed PR. Build a release archive from the merge commit, record SHA-256, deploy with the guarded Nginx script and retain the generated backup. Verify HTTP 200, canonical/HTML markers, local-server-public hashes, audio byte-range playback and submit the page, Guides hub and sitemap to IndexNow.

### Task 6: Preserve the actual completion boundary

Record the release and evidence without claiming the growth goal complete. Recheck GA4 only after a completed Beijing natural day; the H5 gate remains unmet until official data shows at least 100 active users/UV for that day.
