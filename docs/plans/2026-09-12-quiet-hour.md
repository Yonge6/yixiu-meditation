# Quiet Hour Implementation Plan

**Goal:** Add one licensed, explicitly labeled 60-minute extended ambient track to native/H5 and install the latest phone-only internal Plus build.

**Architecture:** Continue the clean dedicated worktree containing today's approved music and end-bell updates; freshly fetched origin/main is still its ancestor f79b666. Reuse existing scene models, audio playback and MorningLake artwork. Do not change timers, StoreKit, the three Free tracks, production hosting or Apple review.

**Tech Stack:** Swift/AVFoundation, React/TypeScript, macOS afconvert, Node PCM processing, Playwright.

## Accepted design

User approved the proposed 45-minute source extended smoothly to 60 minutes. Source: HoliznaCC0, Too Brief A Time To Be Anything, FMA track 201977, CC0 1.0. Use the name 午后留白 / Quiet Hour and subtitle 60 分钟延长版 / 60 min extended. Keep original title/author/license and disclose the repeated segment, crossfade, fades and encoding. No claim of matching the inaccessible WeChat recording or guaranteed sleep benefit. Preview listening remains a user preference check, not something automated signal tests can prove.

## Tasks

1. Verify source-page CC0 and complete MP3 download, decode and inspect duration/levels. Add reproducible script `scripts/prepare-quiet-hour.mjs`, validating original hash and PCM geometry. Generate exactly 3,600 seconds with a 20-second crossfade into a repeated middle segment, downward-only gain and gentle endpoints. Verify non-silence, no clipping and continuity at both splice boundaries.
2. Add failing `yixiu-prototype/tests/quiet-hour.spec.ts` for native/H5 byte parity, duration, metadata playback/seeking, source credit and Plus gate. Update `YixiuMeditation/Tests/FreeMusicPolicyHarness.swift` expectations to 28 sounds / 14 music plus the new scene; run to establish failure.
3. Add quietHour to `Models.swift` and `Prototype.tsx`, Sleep/Meditation/Relax categories, matching names, artwork and AAC. Update current count copy in Me/paywall and existing tests; preserve every existing scene ID and Free/legacy policy. Add licensing and extension notices in native/H5 Sources, public music-credits.html and AUDIO_SOURCES.md.
4. Run H5 runtime/build, Sites and Playwright tests; native policy/core and full-stream audio harness. Verify actual bundled file hash. Build Debug with `DEBUG YIXIU_INTERNAL_PLUS` using existing device signing, verify signature, install in place on 永歌14PM, launch and read back installed app/process.
5. Record evidence and commit scoped files. Report installation only after device confirmation, explicitly distinguishing internal Plus from Apple membership and local H5 code from production deployment.

User already authorized implementation and installation; execute in this session without additional delegation or approval questions.
