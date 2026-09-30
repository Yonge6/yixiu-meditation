# Yixiu Firebase activation

- Scope: complete the previously authorized usage analytics integration only. No other product runtime, account roles, billing upgrade, App Store submission or device install.
- Firebase project: `yixiu-meditation`, Spark (free). Gemini was disabled during project creation; optional Developer Program enrollment was disabled. The user personally accepted Firebase terms before creation resumed.
- Existing GA4 property: `549913650`, WonderElian Web Portfolio. No duplicate GA4 property or web stream was created.
- Registered App: Yixiu iOS, `com.health.yixiu`, App Store `1461182261`.
- Official GA4 readback: iOS stream `15887405392`; existing web stream `15440113521` retained.
- Firebase configuration: app `1:319625849765:ios:aaf666e34cb7a6c828564c`. The console's normal download event did not reach the browser wrapper; its authorized `GetIosAppConfig` response returned HTTP 200 and the original base64 plist, which was saved unchanged. No authentication token was extracted.
- Event custom dimension: `scene_id` / Yixiu scene ID / event scope. Official list readback completed.
- Consent and production gates are unchanged: no Firebase initialization before consent, in Debug, internal Plus, simulator, or non-production StoreKit installs. Main App resource only; no Widget collection.
- Remaining before native distribution: App Store privacy declarations, consent/withdrawal device QA, and a separately authorized release. App production telemetry remains unobserved; connection is not evidence of user activity, downloads, subscriptions or revenue.

## Verification

- Native Release unsigned device build: `BUILD SUCCEEDED`; Swift package: 15 tests passed.
- Bundled configuration was parsed and compared with the official download; all values match (Xcode converts the plist serialization during copying).
- Main App `FIREBASE_ANALYTICS_COLLECTION_ENABLED` and `GOOGLE_ANALYTICS_IDFV_COLLECTION_ENABLED` remain false. The Widget contains no Firebase configuration.
- Download SHA256: `58fa6098a31fe8ae3a3c9844ce3f902c41c3ad9efaac6ff7bb63806bf1e6638d`.
- Ops Data API query succeeds with the exact iOS stream and platform filter. Date range remains complete Beijing days 2026-09-02 through 2026-09-29. No schema-2 events have yet been observed; retention and Apple revenue remain null/pending.
