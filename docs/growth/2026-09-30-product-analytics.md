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
- 55 Node tests passed, including default denial, opt-in once, withdrawal, preview exclusion, URL/parameter filtering, media progress, rate, loop boundaries and cancellation without a false playback error.
- Browser mobile 390×844: consent and Me withdrawal work; no horizontal overflow.
- Local browser audio produced a confirmed start, 34.85 + 3.18 incremental seconds and a 38-second playback end. Test URL used `analytics=off`; these are test observations, not production users.
- Native Release unsigned device build passed; Swift core: 15 tests passed.
- No App Store submission, release, device installation or actual Firebase production data claimed by this work.

## Required activation / remaining work

1. Completed: switched to the already-signed-in GA4 account administrator after confirming the previous account had only lower-level access. No user roles were expanded. Event-scoped `scene_id` was created and read back.
2. Completed after the user personally accepted Firebase terms: created `yixiu-meditation` on the free Spark plan, linked the existing WonderElian GA4 property, and registered `com.health.yixiu` / App Store ID `1461182261`. GA4 lists the dedicated Yixiu iOS stream separately from the existing web stream.
3. The real `GoogleService-Info.plist` returned by Firebase's configuration-download request is included only in the main App resources, not the Widget. It is Firebase client configuration, not a service-account credential. Ops reads the verified iOS stream mapping from ignored machine-local configuration (or `YIXIU_IOS_STREAM_ID`); reports also restrict platform to iOS. No private mapping or credentials enter public snapshots. The first successful read returned no schema-2 events, as expected before native distribution.
4. Before native distribution, update App Store privacy declarations to match the SDK and data use, validate opt-in/withdrawal on device, and run a separately authorized release.
5. Cohort retention reporting and Apple renewal/refund/revenue reconciliation are not connected in this first phase; those cards remain null and explicitly pending, not zero. GA4 processing delay and opt-in coverage affect reports.

References: [Firebase data collection](https://firebase.google.com/docs/analytics/configure-data-collection?platform=ios), [FirebaseAnalyticsCore](https://github.com/firebase/firebase-ios-sdk/blob/12.19.2/FirebaseAnalytics/README.md), [Apple AppTransaction environment](https://developer.apple.com/documentation/storekit/apptransaction/environment).
