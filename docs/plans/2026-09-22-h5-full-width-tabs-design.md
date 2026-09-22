# Yixiu H5 full-width tab navigation

## Decision

The public H5 uses a conventional web bottom tab bar on phone, tablet, and desktop. The native SwiftUI app is outside this change and keeps its existing navigation.

## Visual treatment

- Pin the navigation to the viewport's left, right, and bottom edges.
- Keep Sounds, Focus, and Me in three equal-width columns.
- Remove the floating outer capsule, rounded outer border, desktop 520px width cap, and rounded active capsule.
- Preserve Yixiu's translucent deep-water surface, with a quiet top divider and a short aqua top indicator on the active tab.
- Reserve only the browser's real bottom safe area; do not simulate an iOS Home Indicator.

## Behavior and verification

Tab selection, analytics, audio continuity, labels, icons, and accessibility names remain unchanged. Automated coverage verifies equal tab geometry, edge-to-edge placement at phone and desktop widths, bottom attachment, a square outer bar, and a visible active state. Visual QA covers 390x844 and 1280x900 without horizontal overflow or content obstruction.
