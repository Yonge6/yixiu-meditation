# Quiet Journal — 15 articles published and verified

Date: 2026-09-15, Asia/Shanghai. User requested expansion of the live reading drawer to fifteen articles.

## Outcome

- Expanded four existing articles with eleven original bilingual editorial notes. Total: 15 topics, 30 full article pages and two indexes.
- Categories: sleep/rest 4, focus 4, small pauses 4, guides 3.
- Chinese index: https://yixiu.wonderelian.com/journal/zh/
- English index: https://yixiu.wonderelian.com/journal/
- New articles retain four substantial sections per language, real publication date, stable slug, existing licensed artwork and verified Free scene or Focus targets. New `sourceContentIds` are empty: these are original column pieces, not claimed social publications.
- Existing four slugs, dates and bodies remain; generated related links now include the new notes.
- No layout, runtime, App, price or entitlement changes. No social publishing, App submission or new automation.

## Source and release

- PR: https://github.com/Yonge6/yixiu-meditation/pull/238
- Source: `d5e19d7bfd3c0bd17a803a5e54d23e7b274f69b3`.
- Merge: `7ff15d4d5c28c234a21047d3173aab4afdbe6b2a`.
- Origin main was fetched before implementation and again before deployment. Its H5 tree matched the release source; unrelated worktrees were not changed.
- Release: https://github.com/Yonge6/yixiu-meditation/releases/tag/yixiu-web-20260915-journal15
- Archive: `yixiu-web-20260915-journal15.tar.gz`, 236174856 bytes.
- SHA-256 verified locally, on server and in GitHub's uploaded asset digest: `20eacbfc724bfe0031b4b331cb6b63c1859d5f430b77541fae6a4e0642fb7e2c`.
- Deployment marker: `DEPLOY_OK_YIXIU_20260915-d5e19d7-journal15-1142`.
- Production: `/srv/wonderelian/yixiu.wonderelian.com`.
- Backup: `/srv/wonderelian/backups/yixiu-20260915-d5e19d7-journal15-1142`.
- Preserved guarded staging, complete pre-copy backup and Nginx validation through the existing deployment script.

## Validation

- Baseline count regression correctly failed with expected 15, received 4; final build passed.
- Runtime integrity, 45 Sites tests and all 11 journal tests passed.
- Tests cover all article metadata and practice targets, category counts, complete bilingual sections, playback continuity and layouts at 320/390/768/1440 px.
- Actual image dimensions were checked using sips. No image generation or licensing changes were required.
- Local browser confirmed the new Oasis Rest article CTA selects `oasisRest`, starts playback and leaves the drawer; playback was paused after testing.
- Public indexes each return 15 cards. All 30 article routes returned 200 with expected full body, title, canonical, both language alternates and language/scene CTA; all unique article images returned 200.
- Public H5 assets: `index-CM3J2T2L.js`, `index-CZ4H_jws.css`.
- Public browser drawer displayed all 15 expected titles. Category clicks returned 4/4/4/3/15; real wheel scrolling at 390×844 reached the final article and independent-column link. Existing compact landscape images and legible body geometry remain intact.
- Temporary evidence: `/tmp/yixiu-journal-15-build.log`, `/tmp/yixiu-journal-15-sites.log`, `/tmp/yixiu-journal-15-tests.log`, `/tmp/yixiu-journal-15-deploy.log`, `/tmp/yixiu-journal-15-mobile.png`, `/tmp/yixiu-journal-15-live-bottom.png`.

Status: `published_verified`. No growth outcome inferred; attributable UV, downloads, trials, payments and revenue are null unless separately verified from official data. The named historical `yixiu-growth-ops-log.md` was not found in this checkout or its main repository, so this release record preserves the evidence without creating a conflicting replacement log.
