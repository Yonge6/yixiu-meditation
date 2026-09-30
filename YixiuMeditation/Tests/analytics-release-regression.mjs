import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Source/configuration guardrails, not proof of production network behavior.
const appFile = name => new URL(`../YixiuMeditation/${name}`, import.meta.url);
const source = readFileSync(appFile('ProductAnalytics.swift'), 'utf8');
const plist = name => JSON.parse(execFileSync('plutil', ['-convert', 'json', '-o', '-', fileURLToPath(appFile(name))], { encoding: 'utf8' }));
const info = plist('Info.plist');
for (const key of ['FIREBASE_ANALYTICS_COLLECTION_ENABLED', 'GOOGLE_ANALYTICS_IDFV_COLLECTION_ENABLED', 'GOOGLE_ANALYTICS_DEFAULT_ALLOW_AD_PERSONALIZATION_SIGNALS', 'FirebaseAutomaticScreenReportingEnabled']) {
  assert.equal(info[key], false, key);
}
assert.match(source, /#if DEBUG \|\| YIXIU_INTERNAL_PLUS \|\| targetEnvironment\(simulator\)\s+return/);
assert.match(source, /case \.verified\(let transaction\) = try\? await AppTransaction.shared/);
assert.match(source, /transaction.environment == \.production/);
assert.ok(source.indexOf('UserDefaults.standard.bool(forKey: Self.consentKey) else { return }') < source.indexOf('FirebaseApp.configure(options: options)'));
assert.match(source, /setAnalyticsCollectionEnabled\(enabled\)/);
assert.match(source, /if !enabled \{ Analytics.resetAnalyticsData\(\) \}/);
assert.match(source, /\.adStorage: \.denied, \.adUserData: \.denied, \.adPersonalization: \.denied/);
assert.doesNotMatch(source, /systemUptime|setUserID\(/);
assert.match(source, /Date\(\).timeIntervalSinceReferenceDate/);
const me = readFileSync(appFile('MeView.swift'), 'utf8');
assert.match(me, /@AppStorage\(ProductAnalytics.consentKey\) private var shareUsage = false/);
assert.match(me, /shareUsage = \$0; ProductAnalytics.shared.updateConsent\(\)/);
const config = plist('GoogleService-Info.plist');
assert.equal(config.BUNDLE_ID, 'com.health.yixiu');
assert.equal(config.GOOGLE_APP_ID, '1:319625849765:ios:aaf666e34cb7a6c828564c');
const privacy = plist('PrivacyInfo.xcprivacy');
assert.equal(privacy.NSPrivacyTracking, false);
assert.deepEqual(privacy.NSPrivacyTrackingDomains, []);
assert.equal(privacy.NSPrivacyCollectedDataTypes.length, 5);
for (const entry of privacy.NSPrivacyCollectedDataTypes) {
  assert.equal(entry.NSPrivacyCollectedDataTypeTracking, false);
  assert.equal(entry.NSPrivacyCollectedDataTypeLinked, true);
  assert.deepEqual(entry.NSPrivacyCollectedDataTypePurposes, ['NSPrivacyCollectedDataTypePurposeAnalytics']);
}
console.log('ANALYTICS_RELEASE_SOURCE_GUARDS_PASS: default off, production/consent gates, withdrawal, ads denied, official config and privacy manifest');
