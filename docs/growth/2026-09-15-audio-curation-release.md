# Audio catalog curation release — 2026-09-15

- Source: `f12bf35ef20c3f9a8b62bb86f36075abc04665e7`; PR https://github.com/Yonge6/yixiu-meditation/pull/240 merged as `70803728509c436050842c0a0f9db40a288ff1f0`.
- Release: https://github.com/Yonge6/yixiu-meditation/releases/tag/yixiu-web-20260915-audio-curation
- Package SHA-256: `de8ee30df7366eb877b65e5f1e30a526d38805bf0535ec368e103b854d0c4dd3`.
- Deployment result: `DEPLOY_OK_YIXIU_20260915-f12bf35-audio-curation-1530`.
- Recoverable production backup: `/srv/wonderelian/backups/yixiu-20260915-f12bf35-audio-curation-1530`.
- Public root readback: `index-DOyangPU.js`, `index-CZ4H_jws.css`.

## Acceptance

- H5 build and protected runtime validation passed.
- Sites: 45 passed; bilingual journal: 11 passed (15 articles retained).
- Built-H5 audio/retirement suite: 13 passed. Initial dev-server run also passed but had symlink-related font-serving warnings; final built-site run used actual bundled fonts and had no such limitation.
- The same 13-test suite passed against `https://yixiu.wonderelian.com`: 24 available sounds, 10 music tracks, two Free music cards; retired links fall back to Ocean; saved favorites/recents are filtered; remaining Free tracks play; remaining ambient Plus gates and CC downloads remain correct.
- Native access-policy harness passed, including denial of retired IDs for Free, legacy and Plus and continued historical raw-ID decoding.
- Native Release build for generic iOS succeeded with signing disabled. This is a build check, not App Store upload, review submission, phone installation or a new live native release.

The four recordings are retired from the active library, not irreversibly erased from backups or historical attribution. Completed practice records retain their historical labels; retired-record replay controls are disabled. Free music is now Oasis Rest and First Breath. No ASMR candidate was downloaded or added; see `2026-09-15-asmr-candidates.md` for source/licensing research and audition limitations.
