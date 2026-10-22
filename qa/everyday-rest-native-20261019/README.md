# Native everyday-rest verification — 2026-10-19

## Source and binary

Feature commit: `1d809d4`. The signed Release archive uses the frozen working tree, including the preserved prior native-tab localization changes; this is not a clean-checkout claim. Host and widget are both 1.21 (36). The binary evidence is in `../app-store/1.21/archive-verification.json`.

## Passed checks

- Sixteen Swift core tests, the state/filter harnesses, seven native source-regression scripts, and the final unsigned Release build passed.
- Chinese and English simulator flows verified free lunch and night-waking listening remain in Focus, with a 15-minute countdown and working pause/resume.
- Work-break breathing preserves the saved scene-sound preference; mode and intent switches reset the scroll position.
- Sound Library purpose/type/scope/search combinations and pinned controls passed.
- Me continuation-first layout and Lifestyle secondary-page Back passed.
- The immersive Sounds/home has no new rest-preset strip.
- Catalog and access remain 54 scenes / 27 Free; no subscription-price change.

The PNGs are actual simulator attachments, not composed store artwork. `focus-ui-attachments.json` records the attachment origins. Core test and build logs remain under `/tmp/yixiu-rest-native-*20261019.log` and the external Xcode test-result bundles used during execution.

## Verification boundary

The installed iOS 27.1 runtime supports iPhone Duo only. Creating ordinary iPhone 14 Pro Max or 17 Pro Max simulators fails with CoreSimulator 403, incompatible device. The screenshots therefore do not prove ordinary-phone layout or lack of tab overlap. No system runtime/device profile was modified, and no physical phone was installed or tested in this change.

The Release archive and Apple upload succeeded; App Review submission and public availability are separate states, recorded under `../app-store/1.21/`.
