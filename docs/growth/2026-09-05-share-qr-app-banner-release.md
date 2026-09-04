# Share QR and App Banner release — 2026-09-05

## Scope

The public Yixiu H5 now includes:

- A visible App Store download banner at the top of the player, linking to the existing attributed, region-neutral Yixiu App Store URL.
- A generated 1080 × 1350 scene-sharing image with a functional QR code in the lower-right corner.
- A WeChat-oriented fallback dialog that lets visitors long-press/save the image or copy the link when native file sharing is unavailable.
- The existing iPhone WeChat default-browser guide and the existing direct App Store navigation in Safari and other browsers.

No download, trial, subscription, purchase, or revenue outcome is inferred from the deployment. Those metrics remain `null` until official Apple data is available.

## Source and release

- Implementation PR: <https://github.com/Yonge6/yixiu-meditation/pull/223>
- Production source merge: `79480eb6ab53f5d198edcd3be28d3d720784f367`
- GitHub Release: <https://github.com/Yonge6/yixiu-meditation/releases/tag/yixiu-web-20260904-share-reminder-widget-ipad>
- Archive: `yixiu-20260904-79480eb-share-reminder-widget-ipad-2347.tar.gz`
- Archive SHA-256: `77384c3eb7d107de564b2e53fdd857f92c5be18efb833b40a611eb2c5545b721`
- Final deployment result: `DEPLOY_OK_YIXIU_20260905-5af2e8e-share-reminder-widget-ipad-final-0015`
- Final rollback backup: `/srv/wonderelian/backups/yixiu-20260905-5af2e8e-share-reminder-widget-ipad-final-0015`

The GitHub-to-production download was abnormally slow, so the exact GitHub Release asset was copied directly to the server and verified against the same SHA-256 before deployment. The original post-deploy script then encountered one stale-file assertion: the production directory intentionally retained the historical `still-water-mobile.jpg` because deployment uses non-destructive `rsync`. The assertion was narrowed to exclude only that known legacy file; all remaining post-deploy gates passed and emitted the deployment result above.

After the first deployment, a later repository merge coincided with the production `index.html` being replaced by the preceding H5 revision. The completed GitHub Pages workflow artifact itself contained the correct new assets, so the exact SHA-verified GitHub Release archive was deployed again only after all repository merges and workflows had completed. The final deployment and rollback IDs above refer to this last reconciliation, and the final public readback below was taken afterward.

## Verification

Before release:

- Protected mobile-runtime integrity: 28 files passed.
- Production H5 build: passed.
- Sites packaging tests: 44 passed.
- Playwright tests: 67 passed.
- Generated share image: 1080 × 1350, QR positioned in the lower-right, and QR decoded to the expected attributed Yixiu URL.

Production readback on 2026-09-05 Asia/Shanghai:

- `https://yixiu.wonderelian.com/` returned HTTP 200.
- Public assets are `assets/index-DpmDdvG1.js` and `assets/index-CYNrSAxH.css`.
- Production `index.html` SHA-256: `d75bf287d772ac384080ece03485001398c35b519967a95d06c101ab07eea0a5`, exactly matching the release build.
- Production JavaScript SHA-256: `9d5f0960a93c23698bf900a47a99479e9706792eab66c00c8318070d5b013389`, exactly matching the release build.
- Production CSS SHA-256: `9cf3a8c0dabf5df82bde52d3e2e87a7e8312d2c473cfc0a80cf8140c511253c6`, exactly matching the release build.
- The HTML contains the Apple Smart App Banner metadata for App ID `1461182261`.
- Desktop Chrome showed the top download action linking to the attributed Yixiu App Store URL.
- Desktop Chrome opened the live share dialog, displayed the scene image with a lower-right QR description, and exposed save-image and copy-link actions.
- Nginx configuration validation and reload passed; the temporary deployment stage was removed and the rollback backup remains present.
