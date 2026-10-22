# H5 amber gem and analytics preference release

- Source: `b8493a4` plus the scoped analytics card style correction.
- Release: `yixiu-gem-consent-20261020-r1`.
- Public URL: https://yixiu.wonderelian.com/?lang=zh&music=moonlightSonata
- Package SHA-256: `f1d4187b4c6f1aa84de6af6f39491f07bc64f254442599899887c949dc65638e`.
- Public HTML SHA-256: `31309765407ec6b2cead9ccd1ef601db163dc4da8b96ec0aad98d8bc08304185`, byte-identical to the build.
- Public JS `/assets/index-U9hGN7gY.js`: SHA-256 `bcd955316bf15b56543702b7c21774cf4b20c27aec2ab93f8e088676cc4a115e`.
- Public CSS `/assets/index-CY5pA_p0.css`: SHA-256 `d70900a5f18ba61b33a6327703fa8fbb738ff3ce04ebd831e2ace69b60d37941`.
- Existing backed-up publisher passed, receipt `DEPLOY_OK_YIXIU_yixiu-gem-consent-20261020-r1`. Backup: `/srv/wonderelian/backups/yixiu-yixiu-gem-consent-20261020-r1`.
- Private SSH reverse tunnel supplied the archive directly from a task-owned localhost server, avoiding a redundant server-side upload copy. No server cleanup or unrelated site change was performed.
- Focused icon/control regressions 3/3, consent/privacy/actual-progress regressions 14/14, Sites checks 45/45, protected runtime 28 unchanged, TypeScript/production build pass. Existing bundle-size warning remains.
- Production browser 390px: no horizontal overflow, switch defaults off in observed state, accessible name/description retained, 44px hit target, keyboard focus reachable, privacy link RGB(185,245,247) with no underline and correct `/privacy.html` destination. Actual consent was not enabled during the production visual check.
- This is an H5 release, not App installation, review submission or public App Store release.
- English production at 320px also has no horizontal overflow, off-state consent and a soft aqua link. Restored the task page to explicit Chinese afterward. No consent opt-in was performed.
