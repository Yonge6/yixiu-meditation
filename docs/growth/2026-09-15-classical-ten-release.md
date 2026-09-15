# Classical Ten — verified H5 release

## Published scope

All ten approved classical recordings and ten original AI-assisted landscape artworks are live. The main library has a Classical listening category; the ungated full-recording page is https://yixiu.wonderelian.com/music-credits.html#classical . Existing Free/Plus rules remain unchanged. Four retired tracks remain absent from the active catalog. Native assets/catalog are synchronized in source only; no device installation or App Store submission occurred in this release.

## Source and artifact

- Source commit: `88bfae179749cb6d43e9e5d1c8c1f43258cfde6b`.
- Source PR: https://github.com/Yonge6/yixiu-meditation/pull/242 (merged).
- Main merge: `dd3cef25ca6dc18d61325b26f4e825b37c4f8496`.
- Release: https://github.com/Yonge6/yixiu-meditation/releases/tag/yixiu-web-20260915-classical-ten .
- Artifact: `yixiu-web-20260915-classical-ten.tar.gz`, 302275716 bytes.
- SHA-256: `731c1e9d854bcee72e63be2607e06dabbeb8521e5219bd52b677498865f46ee6` (local, GitHub asset digest and server copy matched).

## Deployment and recovery

The initial GitHub-to-server download was interrupted before production mutation because repeated network timeouts prevented useful progress. Only the exact verified curl process was stopped; its deployment script exited 143 and removed its temporary stage. The same checksummed artifact was transferred directly over existing scoped SSH, then processed by the unchanged deployment script using a local file URL.

- Acceptance: `DEPLOY_OK_YIXIU_20260915-88bfae1-classical-ten-1655`.
- Production: `/srv/wonderelian/yixiu.wonderelian.com`.
- Recoverable pre-release backup: `/srv/wonderelian/backups/yixiu-20260915-88bfae1-classical-ten-1655`.
- Public JS: `/assets/index-Da-3MJbW.js`.
- Public CSS: `/assets/index-COx3slwE.css`.
- Deployment log: `/tmp/yixiu-classical-deploy-direct.log` on the operator machine.

## Independent live acceptance

- `node scripts/verify-classical-production.mjs`: `CLASSICAL_PRODUCTION_PASS 10/10`. Every public audio file and artwork was downloaded completely and SHA-256 compared with `docs/audio/classical-ten-sources.json`; all ten catalog IDs were found in the actual public JS bundle.
- `YIXIU_TEST_URL=https://yixiu.wonderelian.com npx playwright test --config=playwright.classical.config.ts`: **34 passed (31.5s)** using desktop Chrome. Covers all ten source-page audio players starting and advancing, recording durations, credits/download links, main-player Plus gates, 390/768 px classical grids, removed-scene sanitization and bilingual journal regressions.
- Visible desktop Chrome production readback showed all ten named recordings with performers/licenses and the published landscape artwork. The full-listening page is retained as a user-facing tab.
- Logs: `/tmp/yixiu-classical-public-verify.log`, `/tmp/yixiu-classical-live-tests.log`.

Local build, 45 Sites tests, native unsigned Release build, Free/Plus policy harness and media decoding acceptance are documented in `docs/audio/classical-ten-processing.md`. No Apple download, subscription, revenue, review or growth-goal completion is inferred from this web publication.
