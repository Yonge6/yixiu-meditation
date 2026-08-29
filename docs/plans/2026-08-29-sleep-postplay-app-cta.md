# Sleep Post-Play App CTA Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Put the iPhone lock-screen benefit in the listener's viewport immediately after Window Rain playback starts on `/sleep-sounds/`.

**Architecture:** Reuse the existing App Store action and `data-after-preview` panel. Move the panel beside the play controls, opt the sleep page into a minimal `scrollIntoView` reveal through one data attribute, and keep the shared script unchanged for every non-opted-in intent page.

**Tech Stack:** Static HTML, vanilla JavaScript, CSS, Playwright, Node test runner, Vite production build.

---

### Task 1: Specify the mobile post-play behavior

**Files:**
- Modify: `yixiu-prototype/tests/discover-funnel.spec.ts`

**Step 1: Write the failing test**

Extend the existing `rain sleep preview reveals its matched download` test to assert:

```ts
await expect(page.getByRole("link", { name: "Keep rain playing on iPhone" })).toHaveAttribute(
  "data-analytics-placement",
  "sleep_landing",
);
await preview.click();
const afterPreview = page.getByRole("status");
await expect(afterPreview).toContainText("Want to lock your iPhone without stopping the rain?");
await expect(afterPreview.getByRole("link", { name: "Continue in Yixiu." })).toHaveAttribute(
  "data-analytics-placement",
  "sleep_after_preview",
);
const postPlayBounds = await afterPreview.boundingBox();
expect(postPlayBounds).not.toBeNull();
expect(postPlayBounds.y + postPlayBounds.height).toBeLessThanOrEqual(844);
```

**Step 2: Run the focused test and verify it fails**

Run: `pnpm exec playwright test tests/discover-funnel.spec.ts --grep "rain sleep preview reveals"`

Expected: FAIL because the old generic labels and panel position do not meet the new contract.

### Task 2: Implement the page-only reveal

**Files:**
- Modify: `yixiu-prototype/public/sleep-sounds/index.html`
- Modify: `yixiu-prototype/public/discover.js`
- Modify: `yixiu-prototype/public/discover.css`

**Step 1: Update the sleep page markup**

Change the first App Store label to `Keep rain playing on iPhone`. Move the `data-after-preview` element directly below `.intent-actions`, add `role="status"`, `aria-live="polite"`, and `data-ensure-visible="true"`, then use:

```html
<div class="intent-after-play" data-after-preview data-ensure-visible="true" role="status" aria-live="polite" hidden>
  Want to lock your iPhone without stopping the rain?
  <a ... data-analytics-placement="sleep_after_preview">Continue in Yixiu.</a>
</div>
```

Keep the existing Sleep custom product page, Partner Token, campaign token and analytics event unchanged.

**Step 2: Reveal only opted-in panels**

After removing `hidden`, add:

```js
const revealedPanel = document.querySelector("[data-after-preview]");
revealedPanel?.removeAttribute("hidden");
if (revealedPanel?.dataset.ensureVisible === "true") {
  revealedPanel.scrollIntoView({ block: "nearest" });
}
```

Do not change the behavior of other pages.

Give the opted-in panel a 16px scroll margin so fractional mobile layout does not leave its bottom border clipped:

```css
.intent-after-play[data-ensure-visible="true"] { scroll-margin-block: 16px; }
```

**Step 3: Run the focused test**

Run: `pnpm exec playwright test tests/discover-funnel.spec.ts --grep "rain sleep preview reveals"`

Expected: PASS.

**Step 4: Commit the implementation**

```bash
git add yixiu-prototype/tests/discover-funnel.spec.ts yixiu-prototype/public/sleep-sounds/index.html yixiu-prototype/public/discover.js yixiu-prototype/public/discover.css
git commit -m "feat: surface sleep App CTA after playback"
```

### Task 3: Verify the complete Yixiu site

**Files:**
- Verify only

**Step 1: Run runtime integrity**

Run: `pnpm run check:runtime`

Expected: all locked mobile runtime files pass.

**Step 2: Run static-site tests**

Run: `pnpm run test:sites`

Expected: all tests pass.

**Step 3: Run the full Playwright suite**

Run: `pnpm run test:runtime`

Expected: all tests pass at 390×844 with no horizontal overflow.

**Step 4: Build production output**

Run: `pnpm run build`

Expected: TypeScript, Vite and prepared static output succeed.

### Task 4: Release and prove production

**Files:**
- Create: `docs/growth/2026-08-29-sleep-postplay-app-cta-release.md`

**Step 1: Push and merge a scoped pull request**

Expected: only the Yixiu repository changes; PR is mergeable and merged into `main`.

**Step 2: Deploy the exact merged commit**

Use the existing guarded Yixiu production deployment process. Require a verified archive hash, server backup and matching public asset hashes.

**Step 3: Verify live mobile behavior**

At 390×844, start Window Rain and require the status panel and `Continue in Yixiu.` action to be visible inside the viewport with no horizontal overflow. Verify its App Store URL and analytics attributes without clicking the external App Store link.

**Step 4: Record the measurement boundary**

Refresh exact-hostname GA4. Publication proves only the live funnel change. Keep the 100-UV goal active until a completed Beijing natural day reaches 100 active users; keep campaign downloads, trials, payments, subscriptions, in-app purchases and revenue `null` unless official systems expose them.
