# H5 visual refinement — production release, 2026-10-18

Source commit: `e6a7884`, `codex/yixiu-reliability-library-20261013`. Public URL: <https://yixiu.wonderelian.com/?scene=rain&lang=zh>.

## Changes

- Preserved full-bleed deep-water photography while refining optical spacing, header branding, typography, timer pill and primary/secondary player controls.
- Kept the conventional full-width, single-language web tabs; refined active states, icon/label proportions and translucent surfaces without adding an iOS capsule.
- Unified library sheet/header/filter treatments, larger readable card titles, quieter image gradients, focus/hover states and bounded desktop width (1040px). Search stays at 16px; only the cards scroll beneath pinned filters.
- Refined Focus and Me surfaces, duration controls and breathing treatment. Replaced the long catalog-count sentence in the Me scene card with a brief listening invitation; catalog and access rules are unchanged.
- No new dependencies, assets, tracking, pricing, membership changes or native App edits in this release. Protected runtime checks remained intact. Existing native/store working-tree work was preserved.

## Verification

- Runtime integrity: 28 protected files passed.
- TypeScript/Vite production build and Sites packaging passed.
- 75 Node tests passed, including assets, policy, privacy, analytics, banner/WeChat handoff and worker/deploy invariants.
- Browser matrix passed locally and again on production: 390×844 Chinese, 320×740 English, 1280×900 Chinese, 844×390 English.
- Verified full-width single-language tabs, no document overflow, visible player controls, 54 library items / 27 Free, title/composer search, stationary header while cards scroll, 16px search input, Me footer content above web tabs.
- Real HTMLAudioElement advanced beyond 0.2 seconds; switching to Focus preserved the same unpaused audio instance. Selecting a Plus original preserved current playback and opened the gate. Deterministic browser-share fallback produced the PNG preview; OS-owned native share was intentionally disabled only inside test contexts.
- Declined analytics through the actual UI in clean QA contexts; production consent defaults were not changed.
- Production browser matrix: 4 passed in 9.9 seconds. Screenshots and logs: `qa/h5-refinement-20261018/`.

## Deployment and independent readback

- Existing guarded script: `yixiu-prototype/scripts/deploy-production-nginx.sh`.
- Target: existing Yixiu nginx directory only, `/srv/wonderelian/yixiu.wonderelian.com`.
- Release marker: `DEPLOY_OK_YIXIU_20261018-e6a7884-h5-refined`.
- Recoverable pre-release backup: `/srv/wonderelian/backups/yixiu-20261018-e6a7884-h5-refined`.
- Archive: `/Volumes/LaCie/Yixiu-Releases/20261018-h5-refinement/site.tar.gz`, created with `COPYFILE_DISABLE=1`; SHA-256 `b68c7241853a558e37c94e697af27abf5977418a56946159cd81fe3266f180a8`.
- Archive transferred over the existing SSH connection; the guarded script consumed its server-local `file:///tmp/` URL. Nothing was uploaded to a new public artifact host.
- Production HTML hash matches build: `fccfaa1a792d2e998607ea57294586cbd99ed70d36da8f24a08e5b942bd7f1f5`.
- Production `assets/index-DJwTczqQ.css` matches build: `dc9a80a29af10c24c14ac5a7c8823a36e67a834db9fc95e0bb8ec76167bdb494`.
- Production `assets/index-B6eP262M.js` matches build: `baa88d5dda7ce9f19972c6e8b0c0f6b626d5a743549b2863fbb027c3c823844f`.
- Public browser screenshots independently inspected after release. This is a deployed/public-read-back release, not only a local preview.

Ego space 15 was closed after repeated screenshot timeouts; no browser upgrade was performed. Visual QA used the project's existing Playwright runner with installed Google Chrome. OS-native iOS/WeChat browser rendering was not recertified on a physical device this turn; WeChat handoff source tests and browser-preview behavior passed.
