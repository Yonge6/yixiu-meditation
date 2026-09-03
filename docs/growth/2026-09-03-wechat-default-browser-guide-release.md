# iPhone WeChat App Store guide release — 2026-09-03

## Scope

The public Yixiu H5 now treats App Store actions differently only when the user agent identifies iPhone WeChat:

- The visitor stays on `yixiu.wonderelian.com` and sees a bilingual guide pointing to WeChat's top-right `···` menu.
- The guide asks the visitor to choose **Open in Default Browser** and tap download again.
- A secondary action copies the same attributed, region-neutral App Store URL.
- Safari and other browsers retain direct current-window App Store navigation.

The player-header, Me-tab, and Yixiu Plus App Store actions share this behavior. No account, membership, purchase, download, trial, or revenue outcome is inferred from the release.

## Source and release

- Implementation PR: <https://github.com/Yonge6/yixiu-meditation/pull/221>
- Production source merge: `055b2c506103fe1a1e549c5e0a90068d2f4bb245`
- GitHub Release: <https://github.com/Yonge6/yixiu-meditation/releases/tag/yixiu-web-20260903-wechat-browser-guide>
- Archive: `yixiu-20260903-055b2c5-wechat-browser-guide-1042.tar.gz`
- Archive SHA-256: `a55ac9093a12c89d8416fccb73016a7de0f2064f698f95b4e13e2f5daaa32a29`
- Deployment result: `DEPLOY_OK_YIXIU_20260903-055b2c5-wechat-browser-guide-1042`
- Rollback backup: `/srv/wonderelian/backups/yixiu-20260903-055b2c5-wechat-browser-guide-1042`

## Verification

Before release:

- Protected mobile-runtime integrity: 28 files passed.
- Production build: passed.
- Sites packaging tests: 44 passed.
- Playwright runtime and product tests: 67 passed.
- 390 × 844 visual QA: no horizontal overflow and no console errors.

Production readback on 2026-09-03 at approximately 10:45 Beijing time:

- `https://yixiu.wonderelian.com/?lang=zh&verify=055b2c5` returned HTTP 200 with `Cache-Control: no-cache`.
- The public HTML referenced `assets/index-ZTaQFuSh.js` and `assets/index-BNpQ_KQW.css`, matching the exact release build.
- With an iPhone WeChat user agent, the URL remained on the Yixiu hostname after tapping download and the dialog displayed the approved Chinese heading and instructions.
- The copy action returned the attributed region-neutral URL beginning `https://apps.apple.com/app/id1461182261` and showed the success state.
- With an iPhone Safari user agent, the same header action navigated directly to the attributed App Store URL in the current window.
- The production viewport stayed at `390px` wide with a `390px` document width, and the browser console reported no errors.
- Nginx configuration validation and reload passed; the temporary deployment stage was removed and the rollback backup remained present.

Real WeChat menu labels can vary slightly by WeChat version and device language. A final manual check in the user's installed WeChat is still useful, but the production behavior above is verified independently of any App Store download result.
