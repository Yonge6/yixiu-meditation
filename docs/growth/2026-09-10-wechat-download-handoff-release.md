# Yixiu WeChat download handoff release — 2026-09-10

## Released behavior

- iPhone WeChat App Store actions navigate in the current window to the first-party `https://yixiu.wonderelian.com/download.html` handoff.
- The handoff retains the clicked Yixiu App Store attribution parameters after validating the exact `apps.apple.com/app/id1461182261` destination.
- In WeChat, the handoff shows bilingual instructions for the top-right **Open in Default Browser** action and a copy fallback.
- Outside WeChat, the same handoff URL immediately replaces itself with the validated region-neutral App Store URL, so no second download tap is required.
- Safari and other non-WeChat browsers continue to open the attributed App Store URL directly from the original H5 action.

The interaction follows the proven first-party handoff pattern reviewed in 三慢问道 while retaining Yixiu's own deep-water visual system and analytics naming.

## Source and immutable package

- Feature PR: https://github.com/Yonge6/yixiu-meditation/pull/227
- Production merge: `6e53b89e253c2bafd9070d5fcaa9d42adf5ef68d`
- Release: https://github.com/Yonge6/yixiu-meditation/releases/tag/yixiu-web-20260910-wechat-download-handoff
- Release asset: `yixiu-web-20260910-wechat-download-handoff.tar.gz`
- Release asset SHA-256: `a27aefb55542d8ad28aff3e5c7e518ca7b0916a61222ec1fa27953d2eb3c473b`

The first locally packaged archive included macOS extended-attribute sidecars. The guarded server validation rejected it before the production copy step because it observed 20 rather than 10 meditation audio files. The Release asset was replaced with a clean archive, its digest was read back from GitHub, and Linux extraction confirmed 10 audio files and zero `._*` sidecars before the successful deployment.

## Deployment

- Result: `DEPLOY_OK_YIXIU_20260910-6e53b89-wechat-download-handoff-0246`
- Rollback backup: `/srv/wonderelian/backups/yixiu-20260910-6e53b89-wechat-download-handoff-0246`
- Server staging directory was removed after the deployment.
- Nginx configuration validation passed before reload and again during the final server readback.
- Temporary transfer archives were removed after hash verification; the rollback backup remains intact.

## Verification

Local release checks passed:

- 70 Playwright product tests.
- 45 site and Worker tests.
- TypeScript compilation, Vite production build, and protected runtime integrity checks for all 28 locked files.
- The deployment script checks the three handoff assets and the automatic App Store continuation both before and after copying to production.

Public production readback:

- `https://yixiu.wonderelian.com/download.html` returned HTTP 200 with `text/html` and `Cache-Control: no-cache`.
- The production root references `assets/index-CDpFMmsq.js` and `assets/index-DOhuN8GT.css`.
- Production and local hashes matched:
  - `download.html`: `571be88e1932773c50a1b984b0c48beada02a48e3e206a1f6faeac84133cb464`
  - `download.css`: `4793667c89edb0f1be2c401fff639affd72303988fd30d7f4d606424138d6d13`
  - `download.js`: `7f307e5154387bbb5b1b77d25e630a292c469b3c2982d482d454879b45ece667`
  - main CSS: `2d79543b10ea24b145ff57b7bb06e9a0700d311a72d9545c8dd71b36067b8278`
  - main JavaScript: `dab661d448fb9e3ac3a9c097fe656923fa2827598f045998400005f12d73f9ee`
- A production iPhone WeChat UA click remained on exact host `yixiu.wonderelian.com`, reached `/download.html`, displayed the default-browser guide, and retained `ct=yixiu_h5_20260827` in the validated App Store target.
- Opening that exact handoff URL with a Safari UA automatically reached `https://apps.apple.com/app/id1461182261` with the same attribution parameters.
- A normal-browser CTA continued directly to the same region-neutral App Store URL.
- At 390×844 there was no horizontal overflow or console error. At 390×600 the page scrolled through the full 138 px overflow range.

The actual WeChat menu label can vary by WeChat version or language and remains a manual user action. These release checks prove the H5 routing and destination only; they do not prove an App Store download, trial, payment, subscription, in-app purchase, or revenue. Any unavailable Apple attribution outcome remains `null`.
