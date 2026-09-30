# Product analytics schema 2 — 2026-09-30

Scope: Yixiu only. The ops project reserves six project panels; no other product instrumentation was changed.

## Measurement and privacy

- H5 production host is exactly `yixiu.wonderelian.com`; local, preview, `analytics=off`, automated webdriver and native-wrapper sessions are excluded.
- Consent defaults to off. First visit offers equal allow/decline actions; Me can withdraw consent. No Google tag loads before opt-in; withdrawal disables collection and expires GA cookies. URL/referrer and event parameters are restricted.
- `yixiu_v2_playback_request`, `playback_start`, `playback_buffer`, `playback_error`, `listen_time`, `qualified_listen`, `playback_end`: starts require media playback; `listen_time.value` is incremental seconds of media progress, corrected for playback rate and loop boundaries. Stalled media, pauses and seeking are excluded. Long background throttling can undercount multiple loops. Qualified listening means at least 60 seconds in one playback segment, not cumulative daily listening.
- Focus, favorites, filters, tabs, timer selection, paywall views, sharing and download links are independent events. No inferred install, subscription or income. No journal upload, raw user identity, free text or transaction identifiers.
- Historic `yixiu_playback_start` was click-based. It is preserved only as a legacy metric, never converted into actual listening.
- Native uses FirebaseAnalyticsCore 12.19.2 without IDFA capability; IDFV and automatic screen collection are disabled. Initialization requires user consent, a real bundled Firebase configuration and a StoreKit-verified production install. Debug, internal Plus, simulator and sandbox are excluded. Verified purchases deduplicate on-device; Apple transaction IDs are not transmitted.

## Verification

- H5 build and 28-file runtime integrity check passed.
- 54 Node tests passed, including default denial, opt-in once, withdrawal, preview exclusion, URL/parameter filtering, media progress, rate and loop boundaries.
- Browser mobile 390×844: consent and Me withdrawal work; no horizontal overflow.
- Local browser audio produced a confirmed start, 34.85 + 3.18 incremental seconds and a 38-second playback end. Test URL used `analytics=off`; these are test observations, not production users.
- Native Release unsigned device build passed; Swift core: 15 tests passed.
- No App Store submission, release, device installation or actual Firebase production data claimed by this work.

## Required activation / remaining work

1. The current Google login cannot link a Firebase project to the existing WonderElian GA4 property; the GA4 custom definitions page is also read-only (no create control). A GA4 administrator/editor must grant the required rights or complete linking and create event-scoped `scene_id`.
2. Register bundle `com.health.yixiu` in the authorized Yixiu Firebase project, download the real `GoogleService-Info.plist`, include it in App resources, then verify the exact iOS stream. No placeholder configuration is bundled.
3. Set the ops private `YIXIU_IOS_STREAM_ID` to that verified stream. The provider restricts App reports to that stream and iOS; H5 restricts exact hostname. Do not expose credentials or raw identifiers in public snapshots.
4. Before native distribution, update App Store privacy declarations to match the SDK and data use, validate opt-in/withdrawal on device, and run a separately authorized release.
5. Cohort retention reporting and Apple renewal/refund/revenue reconciliation are not connected in this first phase; those cards remain null and explicitly pending, not zero. GA4 processing delay and opt-in coverage affect reports.

References: [Firebase data collection](https://firebase.google.com/docs/analytics/configure-data-collection?platform=ios), [FirebaseAnalyticsCore](https://github.com/firebase/firebase-ios-sdk/blob/12.19.2/FirebaseAnalytics/README.md), [Apple AppTransaction environment](https://developer.apple.com/documentation/storekit/apptransaction/environment).
