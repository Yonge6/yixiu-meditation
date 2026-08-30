# Yixiu Quiet Pass release — 2026-08-30

## Scope

This release adds the lightweight **“Send someone a quiet moment / 送朋友一段安静”** loop to Yixiu only.

- First Breath offers a Quiet Pass after 60 seconds of listening.
- Still Water offers a Quiet Pass after 180 seconds of listening.
- Recipients can play the complete existing track without an account.
- After 60 seconds, recipients can pass a fresh anonymous link onward.
- No membership, subscription, trial, registration, or reward entitlement is created or implied.

## Public routes

- `/gift/first-breath/`
- `/gift/still-water/`

Each link carries an anonymous client-generated gift ID plus:

- `utm_source=share`
- `utm_medium=referral`
- `utm_campaign=quiet_pass`
- scene-specific `utm_content`

The raw gift ID is never included in analytics events. App Store actions use `ct=yixiu_quiet_pass_20260830`.

## Local acceptance

Completed on 2026-08-30 before release:

- `npm run test:sites`: 43/43 passed.
- `npm run test:runtime`: 63/63 passed.
- `npm run check:runtime`: 28 protected files passed.
- `npm run build`: passed.
- `node --check public/quiet-pass.js`: passed.
- `bash -n scripts/deploy-production-nginx.sh`: passed.
- Desktop Chrome visual QA passed at 390×844 and 1440×900 for English and Chinese initial, playing, and qualified states.
- Chrome QA found a stale English playback status after switching to Chinese; the state synchronization was fixed and covered by an automated regression assertion before release.

## Production acceptance

Pending deployment. A published link or page view is not evidence of a visit, download, trial, purchase, or subscription.

## Goal boundary

This release does not change the accepted growth outcome boundary. Until a complete Beijing-time natural day reaches 100 UV on exact hostname `yixiu.wonderelian.com`, the overall growth goal remains incomplete. Any unavailable campaign-attributed Apple outcomes remain `null`.
