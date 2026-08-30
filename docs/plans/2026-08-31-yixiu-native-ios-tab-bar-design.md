# Yixiu Native iOS Tab Bar

## Goal

Replace Yixiu's hand-built bottom navigation overlay with the system SwiftUI tab container so the app follows the current iOS navigation design automatically.

## Direction

- Use `TabView(selection:)` for the three persistent top-level destinations: Sounds, Focus, and Me.
- Use native `tabItem` labels with the existing SF Symbols. English mode shows `Sounds`, `Focus`, and `Me`; Chinese mode shows `声音`, `静心`, and `我的`.
- Keep `AppState.activeTab` as the source of truth so existing programmatic navigation, including returning from Me to Sounds, continues to work.
- Tint the selected item with Yixiu aqua while allowing iOS to own material, contrast, spacing, hit targets, safe-area handling, and selection feedback.
- Do not draw a custom background, divider, or glass effect. When built with the iOS 26 SDK, the system tab bar receives the floating Liquid Glass appearance automatically; older supported iOS versions retain their native tab bar appearance.

## Rationale

Apple defines tab bars as persistent navigation between top-level sections. Standard SwiftUI tab containers gain the current system appearance and accessibility behavior without duplicating platform chrome. This also removes the fixed-height custom bar, bilingual two-line labels, and manual bottom inset calculations that fight the newer compact floating treatment.

## Verification

- Build with the iOS 26 SDK for simulator and unsigned Release.
- Confirm all three tabs switch correctly and retain localized labels.
- Confirm the tab bar floats above full-bleed scene artwork without clipping the Home indicator.
- Confirm selected and unselected states remain legible on both bright and dark scenes.
- Rebuild the internal Plus Debug package and install it on the paired iPhone.
