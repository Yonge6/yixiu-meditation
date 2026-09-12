# End bell and three Free meditation tracks

Source: `origin/main` f79b66664282fb7f32ab4a8c6541a7f62bff2fed, isolated branch `codex/yixiu-end-bell-20260912`.

## Changes

- Existing default-off End bell preference now invokes a single gentle cue on natural listening/Focus completion in both native and H5. Pause, reset and early exit do not ring. H5 Focus timer cleanup now explicitly depends on the active tab, fixing an early-exit completion race exposed by the new tests.
- Independent native AVAudioPlayer and H5 Web Audio source avoid the ambience fade-to-zero. App volume and switch-off apply to the cue. The H5 audio context is silently prepared on user gestures, allowing silent Focus and enabling the preference mid-session without an extra tap. A suspended browser is not promised a delayed/background alarm.
- Original generated PCM cue: 2.8 seconds, 44.1 kHz mono, peak 0.3794, no looping. Both bundles SHA-256: `c86aecd582a889376277e92501b5c7a67976b5bbc13fb79064728564c86dd762`.
- User requested exactly three Free meditation tracks: Oasis Rest / 绿洲停歇, Ocean Passage / 海上行旅, First Breath / 初息. Still Water is now Plus in the app/H5 library. Five free nature sounds, legacy nature access and full Plus access remain unchanged. H5 badges derive music access from the same scene metadata as playback gates.
- Chinese/English Free and legacy copy updated. Existing standalone promotional listening pages remain intact; their copy now explicitly distinguishes promotional Still Water playback from Plus library access. No historical release evidence was rewritten.

## Verification

- H5 build and protected-runtime integrity passed.
- All 93 Playwright tests passed, including 7 end-bell cases and 4 new free-track cases. Tests use actual Web Audio decode/source start and non-silent PCM, not a mocked play success.
- 4 practice-core tests and 45 Sites tests passed.
- Swift core: 13 tests in 3 suites passed.
- Actual `AmbientAudioEngine` and `Models` compiled into a simulator harness. On Yixiu Home QA (B9CF1A7C-E3EA-4ACB-AFF9-0F589AFE09C0), real AVAudioPlayer decode/play/one-shot completion/independent volume/stop/mute checks passed (`END_BELL_NATIVE_AUDIO_PASS`). This does not claim a human listening test or locked-phone delivery.
- Native access policy compiled and executed over all 24 scenes: exact three Free music tracks, all legacy nature rights and Plus access passed (`FREE_MUSIC_POLICY_PASS`).
- Final iOS simulator Release build succeeded after both changes. DerivedData: `/Volumes/LaCie/Yixiu-end-bell-20260912/DerivedData`.
- Asset parity and native completion-call wiring guard passed: `node scripts/test-end-bell.mjs`.
- Chrome local preview read back Oasis Rest successfully: `http://127.0.0.1:4199/?music=oasisRest&lang=zh`.

## Delivery boundary

Local implementation and verification only. No H5 production deployment, phone installation, Apple withdrawal/replacement, screenshot upload or review submission was performed. Native version/build metadata is unchanged; a later formal upload must use a new build number. The previously submitted 1.12 (25) does not contain these fixes.

Logs: `/tmp/yixiu-bell-music-final-playwright.log`, `/tmp/yixiu-bell-music-final-build.log`, `/tmp/yixiu-bell-music-final-native.log`, `/tmp/yixiu-bell-music-sites.log`, `/tmp/yixiu-bell-music-practice.log`, `/tmp/yixiu-end-bell-swift-tests.log`.
