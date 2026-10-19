# Playback and Me Corrections Implementation Plan

> **For Claude:** Execute the approved corrections in this session with the Code verification workflow; no subagents or new worktree are needed.

**Goal:** Remove startup purchase-check blocking, balance AI-original loudness, and restore direct Me-page access and content.

**Architecture:** Preserve the existing player and verified StoreKit access policies. Before StoreKit readiness, allow immediate playback only within a bounded initial verification window; successful verification continues without restarting, a Free/expired result reapplies existing restrictions, and a 30-second startup watchdog prevents unlimited unresolved access. H5 remains the existing Free experience. Keep the source audio originals and license ledger recoverable; select a measured playback/media-level correction after loudness analysis.

**Tech Stack:** SwiftUI/StoreKit/AVFoundation, React/TypeScript/CSS, FFmpeg EBU R128 measurement, existing Swift and Playwright regression harnesses.

---

## Tasks and acceptance

1. Add failing regression coverage for pending native playback, verified downgrade, a bounded StoreKit check, clickable empty/populated Favorites, and always-visible philosophy/lifestyle. Preserve pre-existing dirty ContentView/project/UI-test edits.
2. Native: make AppState and the library agree with SubscriptionStore's optimistic pending state; remove checking banners/labels, apply readiness independently of product loading, start StoreKit independently of analytics, and fail closed after 30 seconds. Free content must remain available; no purchased entitlement may be inferred from H5/localStorage.
3. H5 and native Me: use explicit Favorites header/empty-state buttons; open favorites scope and offer browse-all when empty. Show philosophy as static content, and show Lifestyle works directly on Me home, preserving every existing external link and Back on other secondary pages.
4. Measure all ten AI tracks and representative nature/classical/ambient audio for integrated LUFS and true peak. Apply a conservative, peak-safe correction to both platforms without changing timing/pitch/catalog/free split. Document measurements and checksums if media changes.
5. Run runtime lock, TypeScript/build, Node regressions, native state/source tests and native Release compile. Exercise bilingual empty/populated Favorites, About and inline Lifestyle at mobile/desktop sizes; verify real playback and volume behavior.
6. Publish the scoped H5 correction through the existing backed-up publisher and verify the public bundle/flows. Native code/build is not a new App Store release; the existing 1.21(36) draft still needs its Apple agreement blocker resolved and must not be submitted as containing these newer changes.

## User correction supersedes prior design

Philosophy and Lifestyle must not be folded or hidden behind a new secondary entry. Rest history is unchanged by this request. The three rest presets remain exclusively in Focus, not Sounds/home. No price, membership split, source credit, or privacy-default change is authorized here.
