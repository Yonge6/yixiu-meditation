# Access and header refresh — H5 production acceptance

## Released

User's five changes are live: Classical library note removed; ten classics split five Free/five Plus; nature catalog split ten Free/four Plus (71.4%, nearest whole-track count to 70%); player-header journal icon removed while Me journal remains; header moved 16 px upward with safe areas preserved. Existing Oasis Rest and First Breath stay Free. Native source policy/copy is synchronized, but no device installation or Apple submission occurred.

- Source `05decbe9da14c0c1fa7526a1cc1a75764f14f68d`, PR https://github.com/Yonge6/yixiu-meditation/pull/244 (merged).
- Main merge `39224643dd0721dba0625905fc7ceafc35834ae6`.
- Release https://github.com/Yonge6/yixiu-meditation/releases/tag/yixiu-web-20260915-access-refresh .
- Bundle `yixiu-web-20260915-access-refresh.tar.gz`, 302274404 bytes, SHA-256 `9f4a320294f9d6ff619a1f1b84559780ac9661c44b4a9a26aa85e5e1241b4e61`. Local/server/GitHub uploaded asset digest matched. Bundle transferred over existing scoped SSH and processed by the unchanged deployment script.
- Deployment `DEPLOY_OK_YIXIU_20260915-05decbe-access-header-1723`.
- Backup `/srv/wonderelian/backups/yixiu-20260915-05decbe-access-header-1723`.
- Actual public JS `/assets/index-X-wQuBkg.js`, CSS `/assets/index-CRN9_8-2.css`.

## Live checks

55 desktop Chrome tests passed against https://yixiu.wonderelian.com (58.9 seconds), covering every nature/classical access decision, 390/572/768/1248 px header and library layouts, removal of both specified entries, existing Free music, retired track denial and journal navigation/focus restoration. Production screenshots inspected. Public asset verifier fully fetched and hashed all ten classical recordings and ten images: `CLASSICAL_PRODUCTION_PASS 10/10`. Local build/runtime checks, 45 Sites tests and the native policy harness also passed.

Logs on operator machine: `/tmp/yixiu-access-live-tests.log`, `/tmp/yixiu-access-live-assets.log`, `/tmp/yixiu-access-deploy.log`.

## Small companion editorial correction

The remaining `/best-sleep-sounds/` article still described five Free nature sounds. Its single sentence was corrected to ten after the main bundle deployment, with an atomic replacement protected by the same existing backup. Exact public HTML hash verified: `96b89e7fc199fbdf28547d4185dd4eca9896b4bfff0636bbaf93a5c91cd40beb`. Corrected file is tracked in this evidence change and uploaded as `index.html` alongside the main release artifact; when reproducing this release from its tarball, apply that companion file to `best-sleep-sounds/index.html`. The main bundle itself was not silently replaced.

No Apple review, subscription, download, revenue or growth completion is inferred.
