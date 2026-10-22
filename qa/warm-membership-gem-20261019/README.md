# Warm membership gemstone verification

- Shared six-facet 24 × 22 geometry and yellow-orange palette implemented in H5 SVG and native Canvas.
- Native library badge, Me membership entry and Plus paywall reuse `PremiumGemIcon`; no accessibility-label, entitlement, price or FREE-pill changes.
- H5 palette/geometry and badge-semantics regression: 2/2 pass.
- Mobile runtime integrity: 28 protected files unchanged. TypeScript and production build pass; existing bundle-size warning remains.
- Native `YixiuTheme.swift` iOS type-check and unsigned device Release build 1.21 (37) pass. Log: `/tmp/yixiu-warm-gem-native-20261019.log` (`BUILD SUCCEEDED`). No native device screenshot/installation is claimed.
- Ego local browser verification: Me at 390px, library at 320px and desktop screenshots attached. Actual 320px viewport has no horizontal document overflow; computed six SVG facet colors match the palette. Library remains 27 FREE / 27 Plus, 54 total.
- Browser screenshot receipts initially named `library-390` captured the restored desktop viewport; that image is correctly archived as `library-desktop.png`. The 320px capture and its viewport measurement were performed in the same browser invocation.
- Source-only change: not deployed, not installed on the phone and not uploaded to App Store Connect. Earlier production release remains unchanged.
- Existing native project, ContentView and unrelated HomeInteractionUITests edits preserved outside this change.
