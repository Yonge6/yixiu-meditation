# Underwater White Noise for Sleep Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a durable English acquisition page for underwater white noise that uses Yixiu's real audio and routes qualified visitors to the Sleep App Store custom product page.

**Architecture:** Build a static intent page from the existing Yixiu discovery-page system. Reuse shared `discover.css`, `discover.js`, analytics attributes, first-party media, and the established App Store campaign URL; update the guides collection and sitemap as the discovery surfaces.

**Tech Stack:** Static HTML, JSON-LD, shared CSS/JavaScript, Node site tests, Vite, Playwright.

---

### Task 1: Add failing route coverage

**Files:**
- Modify: `yixiu-prototype/tests/sites-worker.test.mjs`

**Step 1:** Add assertions for `/underwater-white-noise-for-sleep/`, its canonical URL, the underwater audio path, Sleep ppid, and sitemap entry.

**Step 2:** Run `npm run test:sites` with the bundled Node runtime.

Expected: FAIL because the route does not exist yet.

### Task 2: Build the intent page

**Files:**
- Create: `yixiu-prototype/public/underwater-white-noise-for-sleep/index.html`

**Step 1:** Add the optimized title, description, canonical, social metadata, FAQ/SoftwareApplication schema, visible intent copy, audio preview, related guides, and App Store CTA.

**Step 2:** Keep claims practical and non-medical; include moderate-volume and timer guidance.

**Step 3:** Run the focused site tests.

Expected: the new route assertions pass.

### Task 3: Add internal discovery

**Files:**
- Modify: `yixiu-prototype/public/guides/index.html`
- Modify: `yixiu-prototype/public/sleep-sounds/index.html`
- Modify: `yixiu-prototype/public/sitemap.xml`

**Step 1:** Add the page to the guides ItemList and visible sound grid.

**Step 2:** Add a contextual link from the sleep hub.

**Step 3:** Add the route to the sitemap with the current last-modified date.

**Step 4:** Run the site tests.

Expected: all site tests pass and the new page is not orphaned.

### Task 4: Full local verification

**Files:**
- Verify only

**Step 1:** Run `npm run check:runtime`.

**Step 2:** Run `npm run test:sites`.

**Step 3:** Run `npm run build`.

**Step 4:** Run the relevant Playwright discovery-funnel tests.

Expected: every command exits 0.

**Step 5:** Serve the built site and inspect the page at 390 px. Confirm no horizontal overflow, the real audio starts, and the post-preview download CTA becomes visible.
