# Yixiu Intent-Page Share Loop Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a measurable, non-disruptive referral action to every Yixiu English intent page after a visitor successfully starts a sound preview.

**Architecture:** Extend the shared `discover.js` runtime to create one share button inside the existing post-preview conversion block. Build the share URL from the canonical page URL and stable referral attribution, then use the native Web Share API or a clipboard fallback. Add minimal shared CSS and Playwright coverage without editing individual intent pages.

**Tech Stack:** Vanilla JavaScript, Web Share API, Clipboard API, CSS, Playwright.

---

### Task 1: Add failing referral-flow coverage

**Files:**
- Modify: `yixiu-prototype/tests/discover-funnel.spec.ts`

**Step 1: Write the failing tests**

Cover a native-share success and a clipboard fallback. Each test must start the preview, find `Share this sound`, assert a canonical attributed URL, and confirm a `yixiu_share` custom event only after success.

**Step 2: Run the focused test and verify failure**

Run: `npm run test:runtime -- tests/discover-funnel.spec.ts`

Expected: failure because the share button does not exist.

### Task 2: Implement the minimal share loop

**Files:**
- Modify: `yixiu-prototype/public/discover.js`
- Modify: `yixiu-prototype/public/discover.css`

**Step 1: Build the stable share URL**

Read the canonical URL, set `utm_source=share`, `utm_medium=referral`, `utm_campaign=scene_share`, and derive `utm_content` from `data-analytics-placement`.

**Step 2: Add the post-preview button**

Append one `button.intent-share` to the existing `[data-after-preview]` block and keep it hidden until playback succeeds with the rest of that block.

**Step 3: Implement native and fallback paths**

Use `navigator.share` when available. Otherwise call `navigator.clipboard.writeText`. Emit `yixiu_share` only after a resolved operation. Treat `AbortError` as cancellation and expose a short error message for other failures.

**Step 4: Add restrained styling**

Make the control visually secondary, accessible at 44px touch height, and non-overflowing at 390px.

### Task 3: Verify the full funnel

**Files:**
- Test: `yixiu-prototype/tests/discover-funnel.spec.ts`

**Step 1: Run focused Playwright coverage**

Run: `npm run test:runtime -- tests/discover-funnel.spec.ts`

Expected: all discovery funnel tests pass.

**Step 2: Run protected runtime, static-site, and build gates**

Run: `npm run check:runtime && npm run test:sites && npm run build`

Expected: runtime integrity passes, site tests pass, and the production build completes.

**Step 3: Inspect mobile behavior**

At 390x844, verify preview, share success feedback, App Store action visibility, and zero horizontal overflow.

**Step 4: Commit**

Commit the tested Yixiu-only change with a focused message.
