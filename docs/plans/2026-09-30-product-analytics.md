# Yixiu product analytics implementation plan

**Goal:** Measure real product use in H5 and iOS and publish aggregate results in the existing portfolio operations dashboard.

**Architecture:** Retain GA4 for H5; add consent-gated Firebase Analytics without advertising identifiers to iOS. Both surfaces use schema version 2 events. A read-only GA4 provider in AI COO OS retrieves aggregate reports into a separate product-analytics snapshot. Six project entries are reserved; only Yixiu is instrumented in this change. No raw user journeys or identifiers are published.

**Tech stack:** React/TypeScript, Swift/StoreKit, Firebase Analytics, GA4 Data API, Node.js static dashboard.

## 1. Definition and privacy
- Consent defaults off for new detailed analytics; expose a reversible switch in Me and clearly describe collection. Existing records stay local. No IDFA, IDFV, personal content or precise location.
- Exclude debug/internal Plus/TestFlight/sandbox and explicit H5 test traffic.
- Emit playback request separately from confirmed playback. Accumulate elapsed wall time only while the media clock advances; exclude waits, pauses and fades of the old scene. Emit bounded incremental listen time, not the timer setting.
- Focus start/pause/complete and usage of favorites, filters, tabs and paywall are distinct events. Purchase outcomes only after StoreKit verification; no inferred revenue.

## 2. H5 implementation
- Add testable playback accounting in `yixiu-prototype/src/product-analytics.ts` and instrument the audio lifecycle in `src/Prototype.tsx`.
- Harden `public/analytics.js` with consent/test gates and safe parameter allowlisting; update privacy copy and add a settings switch.
- Verify buffering, pause/resume, loop, crossfade, failed play, consent withdrawal and unload accounting. Build and run protected-runtime checks.

## 3. Native implementation
- Register Yixiu Firebase/iOS stream if current account permits; preserve user-only terms/identity boundaries.
- Add analytics wrapper, consent UI, real audio time accounting, practice and verified purchase events. Disable release analytics for sandbox receipt and internal builds.
- Build Release and run Swift unit tests. Record any external registration/review requirements explicitly.

## 4. Portfolio dashboard
- In `wonderelian-ai-coo-os`, add a read-only GA4 usage provider and separate snapshot, with exact host/stream filtering, per-panel availability, interval-deduplicated users, explicit date/timezone and evidence source.
- Add bilingual Product usage view: Yixiu, Wendao, Xiazi, Style Atlas, Maker Business Lab, WonderElian. Preserve existing portfolio data; other entries display pending integration.
- Five sections: playback quality, actual listening, content preference, retention, membership. Unknown values are null; incomplete cohorts and unregistered custom dimensions remain unavailable.
- Run provider/model/privacy tests and desktop/mobile UI verification. Reuse existing daily website sync for usage snapshots without creating a new automation.

## 5. Delivery
- Merge scoped PRs; back up and deploy H5 and ops. Verify public asset hashes and live UI.
- Read back actual aggregate API data. Newly added events may wait for GA4 processing; label this accurately.
- Keep full App Store submission separate from code readiness unless release is explicitly requested in this task. Do not claim native production telemetry before users receive the new app.
