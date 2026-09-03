# Yixiu H5 iOS 1.8 Visual Sync Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Align the public Yixiu H5 player with the accepted iOS 1.8 language, header, membership, scene-art, and tab-bar design.

**Architecture:** Keep the current React player and all acquisition/playback flows. Make narrowly scoped component and CSS changes, replace five public H5 image assets with the approved iOS versions, and add browser-level regression coverage before using the existing rollback-capable Nginx deployment pipeline.

**Tech Stack:** React 19, TypeScript, Vite, Playwright, Node test runner, Nginx deployment script.

---

### Task 1: Add focused regression coverage

**Files:**
- Modify: `yixiu-prototype/tests/v1-product.spec.ts`

**Steps:**
1. Add a test that clears local storage, visits `/` without `lang`, and expects the English Sounds interface.
2. Assert the Sounds header exposes a share button followed by a visible language button, while `?lang=zh` still renders Chinese.
3. Open the sound library and assert seven `FREE` labels, seventeen accessible Yixiu Plus gemstone markers, and no visible `PLUS` text labels.
4. Assert all three bottom tabs share one baseline and the active tab has the selected-segment style.
5. Run the focused tests and confirm they fail before implementation.

### Task 2: Align H5 behavior and components

**Files:**
- Modify: `yixiu-prototype/src/Prototype.tsx`

**Steps:**
1. Change only the no-parameter/no-stored-value fallback language to English.
2. Keep explicit language query parameters and stored visitor choices intact.
3. Convert the brand lockup to non-interactive branding and add a dedicated right-side language control.
4. Keep the App Store CTA and put share immediately to the left of the language control.
5. Add a reusable faceted gemstone SVG and use it for every gated scene in both library render paths.

### Task 3: Align H5 visual styling and approved artwork

**Files:**
- Modify: `yixiu-prototype/src/prototype.css`
- Replace: `yixiu-prototype/public/assets/yixiu/meditation/still-water.jpg`
- Replace: `yixiu-prototype/public/assets/yixiu/meditation/open-meadow.jpg`
- Replace: `yixiu-prototype/public/assets/yixiu/meditation/oasis-rest.jpg`
- Replace: `yixiu-prototype/public/assets/yixiu/meditation/ocean-passage.jpg`
- Replace: `yixiu-prototype/public/assets/yixiu/meditation/quiet-orbit.jpg`

**Steps:**
1. Style the dedicated language and share controls as matched circular glass buttons.
2. Style the Plus medallion with a cut-corner silhouette, restrained gradient, hairline facets, and clear separation from the aqua `FREE` capsule.
3. Make the mobile bottom navigation an inset blurred pill with a selected segment and safe-area spacing; preserve desktop proportions.
4. Copy the five accepted iOS 1.8 image assets into the H5 public asset paths and verify matching SHA-256 values.

### Task 4: Verify locally

**Files:**
- Verify only: protected runtime files and built output

**Steps:**
1. Run `npm run check:runtime` and expect success.
2. Run the focused Playwright spec and expect all tests to pass.
3. Run `npm run build` and expect TypeScript/Vite/static preparation success.
4. Run `npm run test:sites` and expect the worker suite to pass.
5. Launch the local preview and visually inspect English default, explicit Chinese, header ordering, both badge types, the five scenes, Quiet Orbit star trails, mobile navigation, desktop layout, and browser console.

### Task 5: Publish and prove production

**Files:**
- Create: `docs/growth/2026-09-03-yixiu-h5-ios18-visual-sync-release.md`

**Steps:**
1. Commit the implementation and verification evidence to the feature branch.
2. Push the branch, create a focused pull request, and merge only after checks are green.
3. Build the merged commit, package the exact static output, and deploy using `yixiu-prototype/scripts/deploy-production-nginx.sh` with a unique release ID and SHA-256.
4. Verify the Nginx deployment result, rollback backup, exact deployed asset hashes, public English and Chinese DOM, membership markers, responsive tab geometry, and zero relevant console errors.
5. Record the production release ID, merge commit, backup path, and public evidence in the release document; merge that evidence and leave the H5 page open for the user.
