# Instagram White Noise Funnel Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a direct White Noise choice to Yixiu's Instagram profile funnel, produce a matching Reel asset, deploy the H5 update, and publish the verified Reel from desktop Chrome.

**Architecture:** Extend only the query-gated Instagram chooser in `Prototype.tsx`, keeping its existing event model and UTM helper. Reflow six destinations as 2×3 on mobile and 3×2 on desktop. Reuse the existing Yixiu vertical video and replace only its Pinterest-specific final CTA with a native AVFoundation overlay.

**Tech Stack:** React 19, TypeScript, Playwright, Vite, CSS Grid, AVFoundation/Core Animation, Instagram web in desktop Chrome.

---

### Task 1: Prove the missing Instagram White Noise path

**Files:**
- Modify: `yixiu-prototype/tests/v1-product.spec.ts`

**Step 1: Write the failing test**

Add assertions for links named `White noise + black screen` and `Mountain wind`, including exact `instagram / profile / yixiu_profile` query strings.

**Step 2: Run the focused test to verify it fails**

Run: `npm run test:runtime -- tests/v1-product.spec.ts --grep "Instagram profile guide"`

Expected: FAIL because the White Noise link is absent.

### Task 2: Add the two Yixiu destinations

**Files:**
- Modify: `yixiu-prototype/src/Prototype.tsx`
- Modify: `yixiu-prototype/src/prototype.css`

**Step 1: Implement the minimal links**

Insert the following destination mappings in the existing chooser:

- `/underwater-white-noise-for-sleep/`, content `white_noise_black_screen`, placement `instagram_profile_guide_white_noise_black_screen`
- `/wind-sounds-for-sleeping/`, content `mountain_wind_sleep`, placement `instagram_profile_guide_mountain_wind_sleep`

Keep all four existing links. Change only the desktop grid to three columns.

**Step 2: Run the focused test**

Run: `npm run test:runtime -- tests/v1-product.spec.ts --grep "Instagram profile guide"`

Expected: PASS.

**Step 3: Verify the site**

Run:

```bash
npm run check:runtime
npm run build
npm run test:sites
npm run test:runtime
```

Expected: protected runtime, build, static-site tests and complete Playwright suite pass.

### Task 3: Produce and inspect the Instagram Reel

**Files:**
- Source: `/Users/yongyuan/Documents/ChatGPT/运营推广/assets/yixiu-underwater-white-noise-wonderelian-2026-08-26/yixiu-underwater-white-noise-pinterest-video-pin-02.mp4`
- Create: `/Users/yongyuan/Documents/ChatGPT/运营推广/assets/yixiu-underwater-white-noise-wonderelian-2026-08-29/yixiu-underwater-white-noise-black-screen-reel-13.mp4`

**Step 1: Export the minimal CTA replacement**

Use AVFoundation and Core Animation to preserve the original video and audio, then overlay the Instagram-specific final panel from 12 to 20 seconds.

**Step 2: Verify the artifact**

Confirm 1080×1920, 20 seconds, H.264/AAC and a non-empty audio track. Extract frames at 0, 5, 10, 15 and 19 seconds and visually inspect each. Record SHA-256.

### Task 4: Commit, deploy and verify production

**Files:**
- Create: `docs/growth/2026-08-29-instagram-white-noise-reel.md`

**Step 1: Commit and open a ready PR**

Commit the design, plan, test and implementation. Push the branch, open a ready PR, confirm mergeability and merge it.

**Step 2: Deploy the exact merge commit**

Use the existing guarded Yixiu deploy path. Require exact merge commit, build success, archive SHA-256, backup, Nginx validation and public hash match.

**Step 3: Verify production**

Open the Instagram profile campaign with `surface=ios`, confirm all six links and exact attribution, and verify 390px layout with no horizontal overflow.

### Task 5: Publish and prove the Reel

**Files:**
- Modify: `docs/growth/2026-08-29-instagram-white-noise-reel.md`

**Step 1: Publish from desktop Chrome**

Verify `@wonderelian`, upload the Reel, use the approved Yixiu-only caption, enable the AI-content disclosure, add descriptive alt text if available and publish once.

**Step 2: Verify the public result**

Require a permanent public URL, authenticated and logged-out readback for author/caption, correct Yixiu profile path and HTTP 200. Do not count verification visits as acquired UV.

**Step 3: Refresh authoritative metrics**

Read exact-hostname GA4 for the incomplete current day and the latest completed day. Attribute nothing unless `underwater_white_noise_black_screen_reel_13` appears. Preserve unavailable Apple metrics as `null`.
