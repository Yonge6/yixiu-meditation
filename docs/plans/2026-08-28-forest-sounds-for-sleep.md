# Forest Sounds for Sleep Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Publish and prove a Yixiu-only English acquisition page for forest sounds at bedtime, with a real audio preview, web timer, internal discovery paths and attributed App Store actions.

**Architecture:** Add one static intent page using the existing shared `discover.css`, `discover.js`, analytics hooks and first-party Yixiu assets. Extend the Guides collection, two contextual inbound-link pages, sitemap, tests and production deployment acceptance list without changing another product.

**Tech Stack:** Static HTML, JSON-LD, vanilla JavaScript/CSS, Node test runner, Playwright runtime checks, Nginx production deployment, IndexNow.

---

### Task 1: Add failing coverage for the new route

**Files:**
- Modify: `yixiu-prototype/tests/sites-worker.test.mjs`

Add the route to attribution and public-route enumerations. Add focused assertions for title, description, H1, schema, asset dimensions, audio, scene, timer, Sleep CPP, analytics placements, related links, prohibited claims and sitemap entry.

### Task 2: Build the forest sleep page

**Files:**
- Create: `yixiu-prototype/public/forest-sounds-for-sleep/index.html`

Use `sunny-valley.png`, `forest-breeze.m4a`, `data-scene="valley"`, the Sleep custom product page and the shared Apple campaign. Keep FAQ schema identical to the visible FAQ.

### Task 3: Add internal discovery paths

**Files:**
- Modify: `yixiu-prototype/public/guides/index.html`
- Modify: `yixiu-prototype/public/sleep-sounds/index.html`
- Modify: `yixiu-prototype/public/forest-sounds-for-focus/index.html`
- Modify: `yixiu-prototype/public/sitemap.xml`

Increase the Guides ItemList to 18, add a matching card, add contextual sleep/focus cross-links and list the new canonical URL with a 2026-08-28 lastmod.

### Task 4: Extend deployment acceptance

**Files:**
- Modify: `yixiu-prototype/scripts/deploy-production-nginx.sh`

Require the new page, real forest audio and forest-sleep analytics placement in the release archive and production readback.

### Task 5: Verify locally

Run `npm run check:runtime`, `npm run build`, `npm run test:sites`, and `npm run test:runtime`. At 390px verify no horizontal overflow, one-tap playback, timer state and post-play CTA. Compare generated assets with source hashes.

### Task 6: Merge, deploy and prove production

Commit and push the scoped branch, create and merge a PR, deploy the exact merge commit through the existing Nginx release script, verify production HTML/audio hashes and HTTP status, then submit the new page, Guides and sitemap to IndexNow. Record release, backup and acceptance evidence.

