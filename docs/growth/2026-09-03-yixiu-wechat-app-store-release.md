# Yixiu WeChat App Store navigation release — 2026-09-03

## Scope and cause

This Yixiu-only H5 release repairs App Store navigation inside WeChat. It does not change another product, App Store metadata, membership, playback, sharing, or analytics events.

The previous links combined a fixed United States storefront path with `target="_blank"`. From the production network, the full `/us/app/yixiu-white-noise-sleep/id1461182261` URL under an iPhone WeChat user agent was redirected first to `/cn` and then to the China App Store Today page rather than the Yixiu listing. The React H5 also asked the embedded browser to create a new window.

All Yixiu H5 App Store links now use Apple's region-neutral `https://apps.apple.com/app/id1461182261` path. The three React download actions navigate in the current window, preserving the direct user gesture required by embedded browsers. Existing Apple campaign query parameters and `yixiu_download_click` analytics attributes remain in source.

## Source and verification

- Implementation PR: https://github.com/Yonge6/yixiu-meditation/pull/219
- Implementation commit: `fa28b3c60d198e2221f3e69122c53b28ea8a6cb0`
- Merge commit: `df4beea309797e4a605f6c70ae03796dbf194c14`
- GitHub release: https://github.com/Yonge6/yixiu-meditation/releases/tag/yixiu-web-20260903-wechat-appstore
- Protected runtime integrity: 28 files passed.
- Production build: passed from the exact merge commit.
- Sites contract suite: 44 of 44 passed.
- Full Playwright suite: 66 of 66 passed on an isolated port with a 60-second test timeout.
- A dedicated browser test intercepted the Apple destination and proved that clicking the rendered header CTA navigates the current page to the region-neutral App Store URL.

## Production release

- Public H5: https://yixiu.wonderelian.com/
- Release ID: `20260903-df4beea-wechat-appstore-1017`
- Receipt: `DEPLOY_OK_YIXIU_20260903-df4beea-wechat-appstore-1017`
- Archive SHA-256: `2088a14965d1622ce9b799288c3ebfda9076919ae3dfbc4b3d39d980be085241`
- Deploy-script SHA-256: `24189938cfbd187caa5f7ee2d57621a99d9b13c2f3454a74fddd10459ff1a62b`
- Rollback backup: `/srv/wonderelian/backups/yixiu-20260903-df4beea-wechat-appstore-1017`
- Retained evidence: `/srv/wonderelian/backups/yixiu-20260903-df4beea-wechat-appstore-1017/release-artifacts`

The initial server pull from GitHub Release was stopped before deployment because the transfer rate projected more than 30 minutes. Its exact download process was terminated, the deploy script's temporary stage was confirmed removed, and the empty backup directory was retained as `/srv/wonderelian/backups/yixiu-20260903-df4beea-wechat-appstore-1017-failed-github-download`. The same immutable archive was transferred with SCP, verified by SHA-256, served only over a server-local HTTP port, and passed the guarded deployment without changing the release ID or content.

The successful deployment created a complete rollback backup, passed staged and deployed assertions, validated and reloaded Nginx, completed loopback HTTPS checks, and returned the receipt above.

## Public acceptance

- The public root and explicit Chinese scene URL return HTTP 200.
- Local merge-build, server, and public root HTML SHA-256: `1b53de77a9c83ede4cadc29f68c5adde3e0f29eeb977b828e7fee8a191fe0095`.
- Local merge-build, server, and public `llms.txt` SHA-256: `b537f28c2a2e143e3a016fc664e542d3601e0f722e7ce8dd980073110b3d5543`.
- Current compiled JavaScript SHA-256: `41be048f133e017156e45750c187e9ec91877ba2827ffbfbbbd12ca8d28ed6a4` in the build, server tree, and public response.
- All 29 deployed HTML files containing an App Store action use the region-neutral path; none contains the old fixed-US listing path.
- The current root HTML references `/assets/index-C3Cg4DU2.js`; that bundle contains the region-neutral app path and no old fixed-US path. Older unreferenced hash-named bundles were retained by the existing non-deleting deployment process and are not loaded by the current page.
- A production browser context using an iPhone WeChat user agent rendered the header CTA with the exact region-neutral URL, no `target` attribute, same-window navigation after click, and zero console errors.
- Direct Apple readback with the same WeChat user agent returned `itms-appss://apps.apple.com/app/id1461182261?ppid=67cb8784-2b16-4849-b940-90fdf4d99752&mt=8`, which targets the Yixiu app ID instead of a regional storefront home page.

These checks prove the corrected live click path and Apple handoff. They do not prove an App download, trial, subscription, purchase, revenue, visit count, or completion of the separate long-term growth goal.
