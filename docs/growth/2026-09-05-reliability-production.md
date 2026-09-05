# Yixiu reliability production readback — 2026-09-05

## Published H5

- Public URL: https://yixiu.wonderelian.com/
- Validated local source commit: `21d38cf`; base `7170000cd6fbc2a806cdf4f07c3a3abe5588c630`.
- Source branch: `codex/yixiu-reliability-20260905`.
- Archive: `/tmp/yixiu-20260905-21d38cf-reliability-clean.tar.gz`.
- Archive size: 140452709 bytes.
- SHA-256: `c4a2c750279fe8e614b1d699aa12d0f57a4f7660e7de173bea23a1ffa5ba31de`.
- Deployment receipt: `DEPLOY_OK_YIXIU_20260905-21d38cf-reliability-clean-1205`.
- Rollback backup: `/srv/wonderelian/backups/yixiu-20260905-21d38cf-reliability-clean-1205`.
- Existing backup index hash: `d75bf287d772ac384080ece03485001398c35b519967a95d06c101ab07eea0a5`.
- The production script passed all preflight, Nginx and post-deployment checks. It removed its own temporary staging directory, not any historical backup or media.

Public HTTPS downloads match the local build exactly:

| Resource | SHA-256 |
| --- | --- |
| index.html | da323b6d7db5f7dfdb61ec5b04b50c7a12c4c21e8cafc5e1c3ead6dbfa600720 |
| assets/index-CwGb24O4.js | 75e94dab1fabac0ebbbcf8655912924859bd67e288218d4fbee16a4af4f65b79 |
| assets/index-CkDUeK1w.css | 10cfd73d38efc04a53c55fb0a60e26ae2fc81e012070adf70f80d6a1fb3a4d15 |

Desktop Chrome production check: Sunny Valley sharing visibly entered its disabled/busy state, then displayed the correct scene card and lower-right QR; Save image, Share image and Copy link were available. Copy link changed to 链接已复制. No message was sent to a third party.

The first archive attempt failed before replacing production; the original HTML hash remained unchanged. A clean archive was regenerated with `COPYFILE_DISABLE=1 tar --no-xattrs` and succeeded with the receipt above. The first empty backup directory remains untouched.

## Remaining blockers

GitHub is **not pushed**: local CLI token is invalid, SSH authentication is unavailable, and the connected GitHub integration returned 403 for creating the tree. No remote branch, PR or GitHub Release was created. User reauthentication is required. After pushing/merging later, recheck the production asset hashes because the existing main workflow will run.

Phone installation is **not completed**: 永歌14PM / `E572C3AD-652D-5292-A8A7-387EE1F9F1E8` remained unavailable. The signed 1.9 (22) app is ready at:

`/tmp/yixiu-dd-reliability-device-20260905/Build/Products/Debug-iphoneos/YixiuMeditation.app`

Device build uses `DEBUG YIXIU_INTERNAL_PLUS`, preserving the user's internal-preview access. Its deep/strict signature verifies, and device families include iPhone and iPad. No Apple subscription or App Store download is implied. Do not upload this build to App Store Connect.

Release simulator build at `/tmp/yixiu-dd-reliability-sim-20260905/Build/Products/Release-iphonesimulator/YixiuMeditation.app` does not contain the internal-preview string; the physical-device Debug binary does. No App Store review was submitted in this task.
