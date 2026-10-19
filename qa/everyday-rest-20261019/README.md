# Everyday rest refresh — verification, 2026-10-19

## Approved scope

The user explicitly kept the immersive Sounds/home free of new scenario controls. Lunch, night waking and work-break presets appear only in Focus. Existing catalog54/Free27, subscription pricing, licensed media, native tabs and web tab conventions are preserved.

## H5 production

- URL: https://yixiu.wonderelian.com/?scene=rain&lang=zh&tab=focus
- Release: `yixiu-rest-20261019-r1`
- Archive SHA-256: `f66fbfb45760f0eb72d2bd99519fc1f3d16a3c6b465df72a5374adcbfe3af9d2`
- Publisher receipt: `DEPLOY_OK_YIXIU_yixiu-rest-20261019-r1` in `deploy.log`.
- Existing publisher retains a full backup at `/srv/wonderelian/backups/yixiu-yixiu-rest-20261019-r1`; it uses backed-up rsync, not atomic symlink replacement. No unrelated site was changed.
- Public index SHA-256 equals local build: `657ba972736a7a264c78fc5672ad93b9531da1f9eecd736993bbc68703e16d66`.
- Public JS: `/assets/index-BeDdX-50.js`; CSS: `/assets/index-k1SQ_kKM.css`.
- Collector version is cache-busted via `/analytics.js?v=20261019-rest-context`.

## Verification

- `npm run check:runtime`:28 protected runtime files intact.
- `npm run build`: passed, existing bundle-size warning only.
- `node --experimental-strip-types --test tests/*.test.ts tests/*.test.mjs`:85 passed.
- Focused browser suite `tests/everyday-rest.spec.ts` + `tests/ui-refinement.spec.ts`:20 passed locally and20 passed against the public production URL.
- Chinese/English,390×844 /320×740 /1280×900 /844×390: no horizontal overflow, web full-width single-language tabs, reachable controls,16px search, pinned filters.
- Actual audio advances, pause/resume works, normal tab changes do not restart sound. Plus discovery preserves playing Free audio.
- All/Free scope counts54/27 preserved; purpose/type/scope/search intersect; clearing restores the catalog.
- Campaign links prepare matching Free presets and never autoplay. Existing ordinary scene links remain supported.
- Me continuation/recent/favorites precede membership/settings; records default collapsed; Lifestyle detail has Back.
- No consent means no product events. New rest context uses enums only;60 actual media seconds and completed breathing deduplicate to one meaningful rest.

## Native verification and release boundary

Native implementation and simulator evidence are in `../everyday-rest-native-20261019/`. Core16 tests, state/filter harnesses and native source guardrails passed. The actual27.1 simulator verified Free lunch/night stay in Focus, pause/resume freezes/advances real countdown, work-break silence preference, scroll reset and Lifestyle Back in both languages.

Native Store publication is a separate release. The new draft is1.21; a successful local build is not a live App Store release. Archive/upload/review receipt will be recorded separately under `../app-store/1.21/`.

Pre-existing uncommitted `ContentView.swift`, project settings and unrelated UI-test additions were preserved. Version1.21/build36 is supplied as a build override, not by overwriting those project edits. The release uses the retained working-tree native tab-localization fix in addition to this change.

## Limits

No physical-phone install was requested or performed in this change. The installed iOS27.1 runtime only supports iPhone Duo; attempts to create ordinary iPhone14 Pro Max and17 Pro Max simulators returned CoreSimulator403 (incompatible device). The simulator evidence therefore proves Duo flows, not ordinary-phone layout or absence of overlap. No runtime or system device profile was altered.

WeChat handoff and privacy exclusions have regression coverage; this is not a fresh WeChat-on-phone or VoiceOver compliance certification. Store privacy labels are independently checked during submission, not inferred from screenshots.
