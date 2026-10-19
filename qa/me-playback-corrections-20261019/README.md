# Me / playback corrections — 2026-10-19

## Scope

- Favorites has an always-available header action that opens the Favorites library scope. An empty Favorites card also offers browse-all. No nested-card buttons or fake empty-state playback.
- The complete life philosophy is static in About, not a `details`/DisclosureGroup. Lifestyle's five existing works appear directly on Me home. Optional rest-history behavior is unchanged.
- Native starts playback during initial StoreKit verification instead of showing a purchase-check blocker. A 30-second startup watchdog finalizes the last verified legacy / Free policy if verification does not return; any later verified result still applies. Product loading and analytics configuration cannot postpone readiness. Existing verified Free/legacy/Plus restrictions still apply after resolution. No real purchase was made to test this.
- All ten AI originals use per-track constant gain toward -18 LUFS. Measured gains are +3.53 to +5.89 dB; final integrated loudness -18.03 to -18.01 LUFS; highest measured true peak -4.49 dBTP. Dynamics vary by no more than 0.1 LU. No compression/limiting, tempo, pitch, fade or catalog/free-split change.

## Audio identity and recovery

`docs/audio/ai-originals-20261014.json` remains the original delivery ledger. The original playback bytes remain recoverable from Git revision `c371a01` and the task-owned staging folder recorded in `docs/audio/ai-original-playback-levels-20261019.json`. New calibrated SHA-256 values are recorded separately. H5 and native copies are byte-identical; the importer checks rather than overwrites calibrated copies. The preparation script is idempotent and rejects an unexpected source identity. Public playback URLs use `?v=ai-level-20261019` to avoid immutable-cache reuse of quiet audio.

## H5 production

- Release: `yixiu-corrections-20261019-r3`.
- URL: https://yixiu.wonderelian.com/?scene=window&lang=zh
- Package SHA-256: `9dccb167f0b7a5d7293a0390419dbddc352f1126bb0a31ed858f392d8b602a46`.
- Public HTML SHA-256: `4c1843b2fa55ded6e83df09373dd23fb630c066daf130152b678089bdb1aa49f`, equals local `dist/client/index.html`.
- Receipt: `DEPLOY_OK_YIXIU_yixiu-corrections-20261019-r3` in `deploy.log`.
- Full backed-up rsync publication; recoverable backup `/srv/wonderelian/backups/yixiu-yixiu-corrections-20261019-r3`. No unrelated project changed.
- `public-readback.json` independently verifies all ten versioned public audio downloads are HTTP 200 and match calibrated SHA-256.

The first package carried macOS metadata that Linux extraction materialized as extra audio sidecars, so preflight rejected it before production mutation. A diagnostic confirmed 88 files versus 44 expected. The final package disables xattrs/macOS metadata and passes the unchanged file-count guard. Earlier production was preserved during this failed attempt; no guard was relaxed.

## Verification

- Runtime integrity: 28 protected files unchanged.
- TypeScript and production build pass; pre-existing bundle-size warning remains.
- 85 Node unit/static tests pass, plus 45 Sites packaging checks.
- 22 bilingual interaction/responsive tests pass locally; 390, 320, 1280 and short-landscape 844 px cases preserve overflow, scroll, tabs and 16 px search behavior.
- Native AppState harness passes immediate pending playback, no audio restart on confirmed Plus, and correct revocation/duration fallback on confirmed Free, alongside existing interruption/countdown tests.
- Eight native source-regression suites pass.
- Final native unsigned device Release rebuild 1.21 (37), including the item-based sheet correction, passes (`/tmp/yixiu-corrections-final-release-20261019.log`). App and widget both report 1.21 / 37; all ten bundled calibrated AI resources match the separate playback manifest. This build is not a signed install or upload.

The same 22 tests also pass against the public production URL. Native Duo UI verification passed after correcting the initial sheet-scope presentation to use one item payload: Favorites opens the selected Favorites scope on first presentation, lunch/night stay in Focus, Lifestyle works are inline, and About's philosophy is visible without expanding anything; Back still returns to Me. The result is `/Volumes/LaCie/XcodePlatforms/YixiuCorrections-20261019-r2.xcresult` and accepted attachments are stored alongside this file. Earlier QA snapshot directories are preserved; this request uses its own evidence folder.

## Release boundary

No phone installation, signed upload or App Store submission is performed by this correction. The earlier draft selects 1.21 (36), which does not contain these newer changes. A future submission must upload/select the current verified build and refresh metadata. The previously confirmed Apple Developer Program agreement blocker is not accepted or bypassed here.

The available native runtime only supports Duo; simulator UI evidence does not certify ordinary iPhone layout, real StoreKit purchasing, WeChat-on-phone or VoiceOver compliance. Pre-existing dirty native tab-localization, project and unrelated UI-test changes remain preserved.
