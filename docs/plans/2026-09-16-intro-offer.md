# Yixiu Introductory Offer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Submit a formal build that accurately displays Apple introductory offers, then activate the approved one-month approximately 80%-off campaign after release approval. User approved postponing the original dates.

**Architecture:** Apple remains the authority for localized prices, offer periods and account eligibility. Monthly and annual introductory pricing must not change standard renewal prices or entitlements. Unknown eligibility fails closed to regular pricing.

**Tech Stack:** SwiftUI, StoreKit 2, App Store Connect, Xcode.

## Task 1: Verify and configure Apple state
- Read current review receipt; cancel only Yixiu 1.14 (27), then verify cancellation.
- Read monthly product 6802895228 and annual product 6802897270 prices and existing introductory offers.
- Configure approximately 20% of each regular price for first month / first year, available 2026-09-16 through 2026-10-16, preserving regular prices. Record actual permitted price points and storefront scope.
- Do not change unrelated products or lifetime purchases.

## Task 2: Correct offer presentation
- Modify `YixiuMeditation/YixiuMeditation/SubscriptionStore.swift`: resolve eligibility per plan, require a real introductory offer, clear eligibility when reloading or on failure.
- Modify `YixiuMeditation/YixiuMeditation/PlusPaywallView.swift`: remove hardcoded seven-day trial, derive localized price, payment mode, period and renewal disclosure from StoreKit. Refresh on opening; provide reload prices.
- Add tests covering eligible, ineligible, unavailable, free-trial and paid introductory cases. Confirm no hardcoded trial claims remain.
- Run the repository's native smoke tests and a Release simulator build; inspect the changed paywall.

## Task 3: Formal submission
- Increment build number; retain version 1.14 if Apple's current state permits replacement.
- Archive Release with no DEBUG or YIXIU_INTERNAL_PLUS conditions; verify signature and upload.
- Select the processed build; preserve accepted screenshots and release settings; update review notes with offer behavior.
- Submit and read back exact official status and receipt. Record failures honestly; never infer submission from upload.
- Commit and push scoped changes and evidence to GitHub.

## Current observations
- Latest origin/main: ceec010fb46d6a7cddf8626b11ee3abe9980231e.
- Original submission c21df13f-478d-4c51-bd9f-c434956992b9 showed Waiting for Review. Cancellation confirmed in UI; last readback showed Processing, not yet terminal cancellation.
- Monthly product approved; 175 territories, no existing introductory offers.
- Current native UI incorrectly assumes all eligible yearly offers are seven-day free trials; must fix before replacing the offer.
- Final official receipt now reads Removed for submission c21df13f-478d-4c51-bd9f-c434956992b9. Withdrawal is complete.
- China mainland monthly regular price read from Apple: CNY 29.90. No price changes saved. Offer wizard canceled before saving.
- Release sequencing decision needed: an immediately active paid annual offer could conflict with the existing hardcoded free-trial UI before the corrected build is approved. Recommend activating the one-month campaign after the corrected version is approved, rather than silently changing the confirmed campaign dates.
- User approved postponement and prioritized the 20%-price offer over trial stacking. Apple permits only one introductory offer per subscription group; offer-code stacking would add a redemption flow, so direct paid introductory pricing is selected.
- Build 28 replaces hardcoded trial claims with StoreKit offer period, payment mode, localized price and account eligibility. Reload clears stale eligibility and failure clears products. Purchase is disabled during reload.
- Release simulator build, source regression checks and FreeMusicPolicyHarness passed. Device Release archive completed; strict codesign verification passed. Upload is in progress, not yet submission evidence.
- 2026-09-16 11:37:11 CST: Xcode reported Upload succeeded for 1.14 (28); package processing. This is not a review submission. Existing version editor still selects build 27 until 28 is processed and selected. Review notes for build 28 saved, prior screenshots retained.
- PR247 merged to main e99dcd8827a74b9fa5a96193992eaa2dd7451da3. No internal preview/forced-access markers found in archived executable.
- Existing thread heartbeat automation-4 updated to follow build processing, complete submission, and after release configure and verify the one-month introductory-price campaign. Do not repeat upload or submit build 27. No actual offer pricing has yet been saved.
