# Rain Black-Screen Search Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Align Yixiu's indexed rain player with the current `rain sounds black screen` intent while preserving its canonical URL, real audio, timer, App Store attribution, and working interaction.

**Architecture:** Update the single canonical static landing page and its two existing discovery entries rather than create another route. Lock the search promise and player behavior with Node assertions and Playwright interaction coverage before release.

**Tech Stack:** Static HTML, JSON-LD, vanilla JavaScript, Node test runner, Playwright, Vite production build.

---

### Task 1: Lock the exact search promise in tests

**Files:**
- Modify: `yixiu-prototype/tests/sites-worker.test.mjs`
- Modify: `yixiu-prototype/tests/discover-funnel.spec.ts`

**Step 1: Write the failing static assertions**

Require the exact title `Rain Sounds Black Screen for Sleep — Free, No Ads | Yixiu`, an exact black-screen H1, a first-paragraph answer, and matching visible/JSON-LD FAQ copy while preserving the canonical and attributed App Store URL.

**Step 2: Run the focused static test to verify it fails**

Run: `node --test --test-name-pattern="rain sleep intent" tests/sites-worker.test.mjs`

Expected: FAIL on the previous `Dark Screen` title or H1.

**Step 3: Rename the Playwright selectors**

Require the control's accessible name to be `Black Screen` and the overlay's accessible name to be `Black screen is on. Tap to return.` while retaining the playback/timer assertions.

### Task 2: Align the indexed page and discovery entries

**Files:**
- Modify: `yixiu-prototype/public/sleep-sounds/index.html`
- Modify: `yixiu-prototype/public/guides/index.html`
- Modify: `yixiu-prototype/public/llms.txt`

**Step 1: Update on-page copy and structured data**

Change title, meta description, social title/description, SoftwareApplication description, H1, opening paragraph, proof label, FAQ, control label, and overlay label to the black-screen intent. Keep the canonical URL and product facts unchanged.

**Step 2: Update only the two primary discovery entries**

Use `Rain sounds black screen` in the Guides card and `llms.txt` entry. Keep their URLs at `/sleep-sounds/`.

**Step 3: Run the focused tests**

Run: `npm run test:sites && npx playwright test tests/discover-funnel.spec.ts --grep "rain sleep dark screen"`

Expected: PASS.

### Task 3: Verify the complete Yixiu build

**Files:**
- Verify only.

**Step 1: Run protected runtime and site coverage**

Run: `npm run check:runtime && npm run test:sites`

Expected: 28 protected runtime files and every site test pass.

**Step 2: Build production output**

Run: `npm run build`

Expected: TypeScript, Vite, and sites preparation complete successfully.

**Step 3: Run the complete Playwright suite**

Run: `npm run test:runtime`

Expected: every runtime and funnel test passes.

**Step 4: Perform mobile visual QA**

Serve the built output and inspect `/sleep-sounds/` at 390×844. Confirm the exact H1, visible player/control, 48px-class touch targets, and `scrollWidth === innerWidth`.

### Task 4: Merge, deploy, and prove production

**Files:**
- Create: `docs/growth/2026-08-29-rain-black-screen-search-release.md`

**Step 1: Commit and open a focused PR**

Commit the tested implementation and plans, push the branch, open a ready PR, verify mergeability/checks, and merge it.

**Step 2: Build and deploy the exact merge commit**

Use the guarded Yixiu deployment workflow. Require the server checkout to equal the merge commit, retain the backup and release artifacts, and validate Nginx before switching production.

**Step 3: Verify public state**

Require HTTP 200, exact public title/H1/FAQ, functioning black-screen interaction, mobile no-overflow, and matching server/public hashes.

**Step 4: Request one Google recrawl**

Use desktop Chrome Search Console URL Inspection for the changed canonical URL and submit one indexing request. Record the response as a crawl-queue receipt only.

**Step 5: Record metrics without overclaiming**

Refresh exact-hostname GA4. A partial day remains partial; the goal is complete only when a completed Beijing natural day reaches 100 active users and Apple download evidence remains official.
