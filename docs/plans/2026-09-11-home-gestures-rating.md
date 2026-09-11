# Home Gestures and Rating Implementation Plan

**Goal:** Restore horizontal scene swipes, swipe-up library access and low portrait controls; repair the user-initiated rating action.

**Architecture:** Keep scene selection, playback and membership checks in AppState/SubscriptionStore. Replace the always-on foreground ScrollView with a fitting page and a short-window scrolling fallback. Keep gestures on the scene canvas/identity, away from transport and volume controls. Open the official App Store write-review URL from the explicit rating button; retain contextual system review requests elsewhere.

**Tech Stack:** SwiftUI, StoreKit, XCTest, iOS simulator.

**Verified refinement:** SwiftUI drags in scroll content could still claim vertical
movement. The scrolling fallback therefore uses a direction-filtered UIKit pan only
over artwork/title, retaining horizontal scene changes while vertical gestures scroll.
Ordinary fitting pages retain the original animated drag and swipe-up library behavior.
Final verification: 13 logic tests, 6 iPhone UI tests, plus iPad landscape and maximum
accessibility-text landscape runs passed. See `docs/qa/2026-09-11-native-home-interactions.md`.

## Design decisions

- Restoring absolute positions would reproduce 1.10 but break short windows.
- Adding a global high-priority gesture would steal slider/scroll input.
- Selected: fitting bottom-weighted VStack, scroll fallback, dedicated scene touch surfaces. Preserve the 680-point wide layout.
- Rating uses Apple's documented `https://apps.apple.com/app/id1461182261?action=write-review`; open failures show a localized alert with a product-page fallback. Never submit a review for the user.

## Implementation and acceptance

1. Add regression checks for canvas gesture placement, bottom weighting, and rating URL; confirm failure against the old code.
2. Refactor `YixiuMeditation/YixiuMeditation/ListenView.swift`: reusable page/player, fixed lower margin, flexible upper canvas, ViewThatFits fallback. Keep gesture thresholds, subscription gates, animation and session state unchanged.
3. Change `YixiuMeditation/YixiuMeditation/MeView.swift` explicit rating action, with error feedback; leave ContentView contextual requests unchanged.
4. Run regression checks and Swift package tests. Build simulator app; inspect phone portrait/landscape and iPad. Verify swipes where UI automation is available, and distinguish unit/source checks from physical input tests.
5. Commit scoped code and evidence. No H5 changes, App Store submission/withdrawal, pricing changes or forced public Plus.

Apple reference: https://developer.apple.com/documentation/StoreKit/requesting-app-store-reviews
