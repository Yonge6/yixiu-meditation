# Yixiu Plus Subscription Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a calm, transparent subscription layer that funds continuing sounds and breathing practices without taking the current library away from existing users.

**Architecture:** A StoreKit 2 `SubscriptionStore` owns product loading, verified transactions, restore, and legacy-user resolution. A pure `SubscriptionAccessPolicy` decides access so views never duplicate commercial rules. SwiftUI receives the store as an environment object and presents one shared Yixiu Plus paywall from Sounds, Focus, and My.

**Tech Stack:** SwiftUI, StoreKit 2, AppTransaction, UserDefaults, Xcode StoreKit configuration, xcodebuild.

---

### Task 1: Define access policy and migration

**Files:**
- Create: `YixiuMeditation/YixiuMeditation/SubscriptionAccessPolicy.swift`
- Modify: `YixiuMeditation/YixiuMeditation/Models.swift`

1. Define the five free scenes for new users.
2. Preserve the current 14-scene library and existing timer/focus options for users whose original app version is 1.2 or earlier.
3. Reserve newly added sounds, 5/10-minute breathing, and future routines for active Plus subscribers.

### Task 2: Build StoreKit 2 entitlement management

**Files:**
- Create: `YixiuMeditation/YixiuMeditation/SubscriptionStore.swift`
- Modify: `YixiuMeditation/YixiuMeditation/YixiuMeditationApp.swift`

1. Load monthly and annual products.
2. Verify purchases and current entitlements.
3. Listen for transaction updates.
4. Restore purchases and resolve grandfathered access from the verified App Transaction.
5. Cache only verified legacy state so temporary network failures do not remove access.

### Task 3: Add the shared Yixiu Plus paywall

**Files:**
- Create: `YixiuMeditation/YixiuMeditation/PlusPaywallView.swift`
- Modify: `YixiuMeditation/YixiuMeditation/MeView.swift`

1. Explain what remains free and what Plus funds.
2. Present localized monthly/yearly prices with annual highlighted.
3. Support purchase, restore, retry, terms, privacy, and subscription management.
4. Add a compact membership card to My showing Free, Legacy, or Plus status.

### Task 4: Gate premium choices without interrupting listening

**Files:**
- Modify: `YixiuMeditation/YixiuMeditation/ListenView.swift`
- Modify: `YixiuMeditation/YixiuMeditation/FocusView.swift`
- Modify: `YixiuMeditation/YixiuMeditation/MeView.swift`

1. Mark locked scenes and open the shared paywall with one tap.
2. Keep 15/30-minute timers free; preserve 60/unlimited for legacy users and Plus.
3. Keep 1-minute breathing free, preserve 3 minutes for legacy users, and add 5/10 minutes for Plus.
4. Never stop current audio merely because a paywall or another tab is opened.

### Task 5: Configure and verify purchases locally

**Files:**
- Create: `YixiuMeditation/YixiuMeditation/YixiuPlus.storekit`
- Modify: `YixiuMeditation/YixiuMeditation.xcodeproj/project.pbxproj`
- Modify: `YixiuMeditation/YixiuMeditation.xcodeproj/xcshareddata/xcschemes/YixiuMeditation.xcscheme`

1. Add monthly and annual auto-renewing products to one subscription group.
2. Add the new Swift files to the app target and StoreKit configuration to the shared run scheme.
3. Build for an iPhone simulator and a connected iPhone target when available.
4. Exercise free, legacy, monthly, annual, restore, cancel, pending, and unavailable-product states.

### Task 6: Prepare App Store Connect configuration

1. Create the subscription group and both products with matching product IDs.
2. Add Simplified Chinese and English names/descriptions.
3. Configure the annual introductory trial and regional prices.
4. Add subscription review screenshots and submit the first subscription with the next app version.
