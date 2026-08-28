# Rain Sounds for Studying Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Publish and verify a dedicated English Yixiu landing page for `rain sounds for studying` with immediate real-rain playback and an attributed iPhone download path.

**Architecture:** Reuse the existing static intent-page system, shared `discover.css`, `discover.js`, analytics and licensed Light Rain asset. Add one focused page plus internal links and sitemap discovery; protect the mobile runtime and avoid unrelated product changes.

**Tech Stack:** Static HTML, JSON-LD, shared vanilla JavaScript, Vite, Playwright, Node test runner, Nginx production deployment.

---

### Task 1: Add the failing funnel test

**Files:**
- Modify: `yixiu-prototype/tests/discover-funnel.spec.ts`

**Step 1: Write a test for the new URL**

Assert that the page has the canonical URL, one H1, the accessible `Play Eaves Rain` button, the Light Rain media path, the focus App Store campaign parameters, a hidden-after-load referral action that appears after play and no 390px horizontal overflow.

**Step 2: Run the focused test**

Run: `npm run test:runtime -- --grep "rain study"`

Expected: FAIL because `/rain-sounds-for-studying/` does not exist.

### Task 2: Implement the intent page

**Files:**
- Create: `yixiu-prototype/public/rain-sounds-for-studying/index.html`

**Step 1: Add the page metadata and schema**

Use a unique title, 150-160 character description, canonical and social image metadata. Add `WebPage`, `ImageObject`, `SoftwareApplication` and matching `FAQPage` JSON-LD.

**Step 2: Add the listening funnel**

Use `/assets/yixiu/audio/light-rain.m4a`, `data-scene="rain"`, `data-analytics-placement="rain_studying_preview"` and the existing focus App Store attribution.

**Step 3: Add concise intent-matched guidance**

Cover a three-step study setup, rain versus music, texture comparison and practical FAQs. Avoid health, sleep-treatment and guaranteed-performance claims.

**Step 4: Run the focused test**

Run: `npm run test:runtime -- --grep "rain study"`

Expected: PASS.

### Task 3: Add crawl and internal discovery

**Files:**
- Modify: `yixiu-prototype/public/guides/index.html`
- Modify: `yixiu-prototype/public/rain-sounds-for-reading/index.html`
- Modify: `yixiu-prototype/public/river-sounds-for-studying/index.html`
- Modify: `yixiu-prototype/public/best-nature-sounds-for-studying/index.html`
- Modify: `yixiu-prototype/public/sitemap.xml`

**Step 1: Add contextual internal links**

Link from study and rain contexts with descriptive anchors; do not add the URL to unrelated products or sites.

**Step 2: Add the sitemap entry**

Use `lastmod` `2026-08-28`, monthly change frequency and priority `0.9`.

**Step 3: Run structural checks**

Assert unique title/canonical/H1, valid JSON-LD, no missing image alt and no broken internal links.

### Task 4: Verify and release

**Files:**
- Modify: `docs/growth/2026-08-28-rain-sounds-for-studying-release.md`

**Step 1: Run protected and static checks**

Run: `npm run check:runtime`, `npm run build`, `npm run test:sites`, and `npm run test:runtime`.

Expected: all pass without runtime lock changes.

**Step 2: Verify mobile behavior**

At 390px, play the real rain preview, confirm the post-preview CTA, exact App Store parameters and zero horizontal overflow.

**Step 3: Commit, push and open a pull request**

Use the current `codex/yixiu-rain-study-20260828` branch and preserve unrelated work.

**Step 4: Deploy and prove production**

Create a release archive and server backup, deploy through the existing Nginx script, validate Nginx, compare source/server/public hashes, verify HTTP 200 and live behavior, then submit the new URL, Guides and sitemap to IndexNow.

**Step 5: Record evidence**

Document the public URL, PR/merge, release ID, hashes, backup, tests and the unchanged completion boundary: completed-day GA4 must still reach 100 active users; Apple download evidence is tracked separately.
