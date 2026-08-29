# Instagram Profile Guide Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Show visitors arriving through the existing WonderElian Instagram profile link a compact Yixiu-only chooser that takes them directly to the sound path they saw in a Reel.

**Architecture:** Detect only the current `utm_source=ig`, `utm_medium=social`, `utm_content=link_in_bio` campaign on the Yixiu root application. Render a dismissible, bilingual guide above the sound player with four existing Yixiu destinations. Every destination receives a new measurable Instagram-profile campaign, and every click emits an existing GA4-compatible custom event through `data-analytics-*` attributes. Ordinary traffic and non-root landing pages remain unchanged.

**Tech Stack:** React 19, TypeScript, existing Yixiu CSS, Playwright.

---

### Task 1: Add the failing referral-guide tests

**Files:**
- Modify: `yixiu-prototype/tests/v1-product.spec.ts`

**Step 1: Write the failing test**

Add one Playwright test that opens `/?lang=en&utm_source=ig&utm_medium=social&utm_content=link_in_bio`, expects the `Find the sound you saw` region, checks the exact attributed Sleep, Forest, Ocean Focus and Reset destinations, closes the guide, and confirms it disappears. Add a second assertion that the normal `/?lang=en` page has no guide.

**Step 2: Run the focused test and verify it fails**

Run: `npm run test:runtime -- --grep "Instagram profile guide"`

Expected: FAIL because the guide does not exist.

### Task 2: Implement the minimal guide

**Files:**
- Modify: `yixiu-prototype/src/Prototype.tsx`
- Modify: `yixiu-prototype/src/prototype.css`

**Step 1: Add campaign detection and attributed destinations**

Add a pure helper that returns true only when all three existing Instagram profile campaign values match. Add a pure URL helper that builds Yixiu-only destination URLs with:

```text
utm_source=instagram
utm_medium=profile
utm_campaign=yixiu_profile
utm_content=instagram_bio_<destination>
```

**Step 2: Render the bilingual, dismissible guide**

Render only on the sound tab for matching referral traffic. Use a labelled region, a close button, and four anchor links. Give each link `data-analytics-event="yixiu_profile_path_click"` and a destination-specific placement.

**Step 3: Reuse the current visual language**

Style the guide as a compact translucent card below the existing player header. Keep links at least 44px high, permit horizontal wrapping, avoid covering the bottom controls, and provide a reduced-height layout.

### Task 3: Verify the complete Yixiu runtime

**Files:**
- No source changes expected.

**Step 1: Run the focused test**

Run: `npm run test:runtime -- --grep "Instagram profile guide"`

Expected: PASS.

**Step 2: Run protected runtime, site, build and full browser tests**

Run:

```bash
npm run check:runtime
npm run test:sites
npm run build
npm run test:runtime
```

Expected: all commands pass.

**Step 3: Inspect the 390 x 844 referral state**

Confirm the guide, close control and all four destinations are visible, `scrollWidth === innerWidth`, and the normal homepage remains unchanged.

### Task 4: Release and prove production

**Files:**
- Create: `docs/growth/2026-08-29-instagram-profile-guide-release.md`

**Step 1: Commit, push and open a pull request**

Commit the plan, tests, implementation and evidence using the `codex/yixiu-instagram-profile-guide-20260829` branch.

**Step 2: Merge and deploy through the existing guarded Yixiu release flow**

Require a server backup, local archive hash, Nginx validation, source/server/public hash equality, and public HTTPS readback.

**Step 3: Record the measurement boundary**

State that the guide proves a live attributed path only. Do not claim H5 users or App downloads from publication; completed-day GA4 and Apple official data remain the authority.
