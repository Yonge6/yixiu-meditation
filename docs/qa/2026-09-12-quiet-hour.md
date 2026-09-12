# Quiet Hour — acceptance and device handoff

## Implemented

- Added 午后留白 / Quiet Hour, explicitly labeled 60 分钟延长版 / 60 min extended, to native and H5 Meditation/Sleep/Relax. Same scene ID, MorningLake artwork and byte-identical full AAC on both platforms. Library is now 14 nature + 14 music, 28 total; no original scene replaced.
- Original: HoliznaCC0, Too Brief A Time To Be Anything, CC0 1.0, verified on its individual FMA source page. Exact download hash, editing recipe and final hash are in `yixiu-prototype/AUDIO_SOURCES.md`. `scripts/prepare-quiet-hour.mjs` validates source completeness, produces a 20-second crossfade into a repeated middle section, attenuates and adds 8s/12s endpoint fades. No changes to pitch/tempo, no imported WeChat recording.
- Native/H5 Sources and `music-credits.html#quiet-hour` preserve creator, title, CC0, editing notice and no-endorsement notice. Local credits offer ungated download/playback. Subjective listening preference and similarity to the inaccessible WeChat reference are not proven by automated checks.
- Existing Free/legacy/Plus policy is unchanged (5 Free nature + Oasis Rest/Ocean Passage/First Breath). Debug-only internal Plus unlocks all 28; this is not an Apple subscription. Timers remain user-selected; choose 60 minutes or unlimited for a full-hour session.

## Verification

- First new test failed because quiet-hour.m4a did not exist; implementation then passed.
- Production H5 build and protected runtime check passed; 45 Sites tests, 102 Playwright tests and 4 practice tests passed. Adjusted catalog-count assertions for the one new Plus track; exact Free assertions remain unchanged.
- Browser verification covers complete 3600-second metadata, playback, seeking into the crossfade and near the end, no mobile horizontal overflow, category visibility, gated library access and ungated licensed download. Chrome read back the source/credit page; mobile screenshot `/tmp/yixiu-quiet-hour-credits.png` visually inspected.
- Swift core: 13 tests in 3 suites passed. Native policy harness verifies 28 scenes / 14 music, exact Free list, legacy nature rights, Plus access and category/deep-link parity.
- `QuietHourAudioHarness.swift` fully streamed decoded both source asset and actual built app resource via AVAudioFile and prepared/seeks AVAudioPlayer: 3600.0 seconds, 172800000 stereo frames at 48 kHz, peak 0.42219445, RMS 0.07066987, endpoint peak 0.000007207. No clipping; all seek positions passed. Signal analysis, not human full-track listening.
- Debug device build passed with compiler flags `-DDEBUG -DYIXIU_INTERNAL_PLUS`; `codesign --verify --deep --strict` passed. Bundle binary confirms the 28-sound internal preview label, quiet-hour resource and extended label.
- Built audio SHA-256: `fc54aa9323b036c44b6a38871cc422361865fa6fedc9685a5705005a6d7eac74`, matching native/H5 source. Version remains 1.12 (25), same internal version as previous install, new audio/code. A future Store upload needs a new build number and a Release build.

## Device status

- Target: 永歌14PM / iPhone 14 Pro Max, paired CoreDevice ID E572C3AD-652D-5292-A8A7-387EE1F9F1E8, UDID 00008120-000A341C0E0BC01E.
- Initial installation failed with CoreDevice error 1011 while disconnected. After the user confirmed reconnection, fresh device readback showed available/paired. On 2026-09-12 at 13:37 Beijing time, installation **succeeded in place**, without uninstall or data reset.
- Installed artifact from source commit `4ee40c0`: `/Volumes/LaCie/Yixiu-end-bell-20260912/DerivedData/Build/Products/Debug-iphoneos/YixiuMeditation.app`. Signature and quiet-hour SHA-256 were reverified before installation; Debug binary confirms all 28 sounds unlocked, quiet-hour and 60 min extended.
- Launch succeeded without entitlement override arguments; device app readback confirmed `com.health.yixiu` 1.12 (25). Running-process readback confirmed PID 33101 (ephemeral), with executable in the newly installed bundle 447ED349-98DD-4D1A-BB55-096411CEFD15. This is device-only internal Plus, not Apple subscription or Store submission evidence.
- No H5 production deployment, GitHub push or App Store submission/withdrawal in this task. Local H5 preview remains port 4199.

## Tool evidence

`/tmp/yixiu-hour-web-build.log`, `/tmp/yixiu-hour-sites.log`, `/tmp/yixiu-hour-playwright.log`, `/tmp/yixiu-hour-practice.log`, `/tmp/yixiu-hour-swift-tests.log`, `/tmp/yixiu-hour-device-build.log`, `/tmp/yixiu-hour-bundle-audio.log`, `/tmp/yixiu-hour-device-install.json`.

Successful retry: `/tmp/yixiu-hour-device-install-retry.json`, `/tmp/yixiu-hour-device-launch.json`, `/tmp/yixiu-hour-device-readback.json`, `/tmp/yixiu-hour-device-processes.json`.
