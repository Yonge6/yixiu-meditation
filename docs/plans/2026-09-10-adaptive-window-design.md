# Yixiu adaptive-window release

## Scope and baseline

Start from origin/main 135d9db. Recover only native 1.10 (23) sources from
codex/yixiu-daily-ritual-20260905; main had not incorporated the shipped native
release. Preserve main's current H5 download handoff unchanged.

## Design

Use available window geometry, not a device-name or folding-state lookup.
The alternatives were stretching the existing absolute layout or building
separate device-specific screens. A stable AnyLayout subtree gives a compact
vertical layout and a wider two-column layout without replacing player or
practice state. Large accessibility text falls back to vertical scrolling.

- Sounds: scene identity and playback controls sit side by side in a wide
  window, stacked in a narrow one. Timer options use a system sheet.
- Focus: preferences and breathing controls sit side by side when they fit.
  The three compact shortcuts remain below the main practice.
- Me and membership: bounded readable content, scrolling, system safe areas.
- Enable iPhone landscape. Preserve StoreKit access checks, all 1.10 practice
  and journal behavior, and DEBUG-only internal preview isolation.

## Verification and external gate

Build Release and run journal, countdown, reminder and entitlement tests.
Inspect real simulator screenshots on current iPhone/iPad in portrait and
landscape; check active playback/practice survives resizing where testable.
No Duo simulator is installed in Xcode 26.6: do not claim Duo hardware or iOS
27 validation. Apple announced Duo on September 9, with availability October
23 and upcoming Xcode Device Hub support.

Prepare localized metadata, screenshots and signed distribution artifacts.
Withdraw an existing review or submit this release only after current adaptive
releases for Sanman Wendao, Art Style Atlas and Xiazishuo each have an official
submission receipt/status. Read those threads without changing their products.
Unknown release and conversion results remain unknown until official readback.
