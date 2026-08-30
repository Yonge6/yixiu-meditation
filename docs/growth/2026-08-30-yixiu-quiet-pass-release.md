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

Deployed from merge commit `82ed35b20038b6637e07787fa7371203ae7e2930`.

- Release ID: `20260830-82ed35b-quiet-pass-2134`
- Deployment receipt: `DEPLOY_OK_YIXIU_20260830-82ed35b-quiet-pass-2134`
- Archive: `/tmp/yixiu-20260830-82ed35b-quiet-pass-2134.tar.gz`
- Archive SHA-256: `17b559813c14b21ea525c891ed2345ad08c7b8372bd8ce8096521d97d6a7fec4`
- Server backup: `/srv/wonderelian/backups/yixiu-20260830-82ed35b-quiet-pass-2134`
- Retained artifacts: `/srv/wonderelian/backups/yixiu-20260830-82ed35b-quiet-pass-2134/release-artifacts`
- Nginx configuration and reload checks passed.
- Both gift routes returned HTTP 200.
- First Breath returned HTTP 206, `audio/mp4`, and exactly 1,024 bytes for a range request.

Local clean-build and public SHA-256 values matched:

- First Breath gift HTML: `23a7688b376b4944f648fe419f9336edb3f871b7163351bf35b3651fa9e020d3`
- Still Water gift HTML: `12b1b8baa6d0c3f124b7c77ca7ce415f366ffa5c78bf9b4e0eff305a3c302a97`
- `quiet-pass.js`: `21194c59a010c3f460cc2fd0a8b5261b0e32414c4271281b945c65b7b4529ada`
- `quiet-pass.css`: `c70620900d78f1df4446bd283a94afc39ae4e572aa5271466702b760b2dd122e`
- First Breath source page: `ddf4d08d7f9a3d76540a0e61b1b074518b30805301bb522b2bf031bd5eab573a`
- Still Water source page: `fca13b858be0b3400358981fa97f1fcbfc88edd5bf3211ad5db4d4c8f52b6fd6`

Desktop Chrome production readback at 390×844 verified the exact First Breath title, initial English state, real audio playback, Chinese content, and synchronized `正在播放` status with no page console errors.

The first packaging attempt was rejected before any production write because macOS AppleDouble metadata made the server count 20 files for the 10-track meditation set. The final immutable archive disabled AppleDouble creation, passed the exact 10-track guard, and then completed every staged, deployed, Nginx, loopback HTTPS, DOM, and audio acceptance check.

A published link or page view is not evidence of a visit, download, trial, purchase, or subscription.

## Goal boundary

This release does not change the accepted growth outcome boundary. Until a complete Beijing-time natural day reaches 100 UV on exact hostname `yixiu.wonderelian.com`, the overall growth goal remains incomplete. Any unavailable campaign-attributed Apple outcomes remain `null`.
