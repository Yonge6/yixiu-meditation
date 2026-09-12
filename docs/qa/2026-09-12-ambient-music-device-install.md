# Phone installation — 2026-09-12

- User requested installation after the local music update.
- Source: `df4f63b` on `codex/yixiu-end-bell-20260912`; includes prior end-bell and three-Free changes (`1d9777f`). Fresh origin/main remained `f79b666`.
- Built Debug for generic iOS using `SWIFT_ACTIVE_COMPILATION_CONDITIONS='DEBUG YIXIU_INTERNAL_PLUS'`. Main target compiler invocation contains both flags; public Release/StoreKit code was not changed.
- Build succeeded; `codesign --verify --deep --strict` passed. Bundle `com.health.yixiu`, version 1.12, build 25. Debug binary includes `Internal preview · All 27 sounds unlocked` and the new audio resource IDs.
- Device: paired iPhone 14 Pro Max, 永歌14PM. Existing Yixiu 1.11 (24) was replaced in place; no uninstall was performed.
- `devicectl device install app` succeeded, launch succeeded with no forced entitlement arguments, and installed-app readback confirmed Yixiu 1.12 (25). Launch PID 32730 (ephemeral).
- Installed artifact: `/Volumes/LaCie/Yixiu-end-bell-20260912/DerivedData/Build/Products/Debug-iphoneos/YixiuMeditation.app`.
- Includes all 27 sounds, the three new ambient tracks, the user-selected Free tracks, and optional end bell (default off; enable in Me).
- Internal Plus is a phone-only preview, not an Apple subscription or download/revenue metric. No H5 deployment or App Store submission happened in this installation task. A future App Store upload must use a new build number and real StoreKit entitlement behavior.

Local tool evidence: `/tmp/yixiu-ambient-device-build.log`, `/tmp/yixiu-ambient-device-install.json`, `/tmp/yixiu-ambient-device-launch.json`, `/tmp/yixiu-ambient-device-readback.json`.
