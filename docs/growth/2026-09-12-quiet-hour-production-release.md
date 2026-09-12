# Quiet Hour production release — 2026-09-12

## Verified outcome

- Production: https://yixiu.wonderelian.com/
- Music credits: https://yixiu.wonderelian.com/music-credits.html#quiet-hour
- Source PR: https://github.com/Yonge6/yixiu-meditation/pull/233 (merged).
- Source commit: `d16f834da9baefa023a072feb1b299c9255dd658`.
- Main merge: `0113b90e065b2858e4ce66952800f8fdc97a8309`.
- Release: https://github.com/Yonge6/yixiu-meditation/releases/tag/yixiu-web-20260912-quiet-hour
- GitHub asset state `uploaded`; size 236,116,197 bytes; digest matches local SHA-256 `30116de77a5a1a9662918f06003f0c0aa65a1844396f812233af7bb6fddb79dc`.
- GitHub deployment workflow succeeded: https://github.com/Yonge6/yixiu-meditation/actions/runs/34676497287 . The checks below separately verify the production Nginx site.

## Content

Quiet Hour / 午后留白 is a clearly labeled 60-minute extended edit of HoliznaCC0's original. Cloud Drift, Soft Light Rest and Deep Water Rest are licensed Chris Zabriskie recordings. The credits page includes original titles, author links, licenses, editing notices and ungated playback/downloads.

The library contains 14 nature sounds and 14 music tracks. Free music is Oasis Rest / 绿洲停歇, Ocean Passage / 海上行旅 and First Breath / 初息. H5 does not read Apple purchase status. The optional completion cue remains off by default.

## Deployment and rollback

- Guarded script: `yixiu-prototype/scripts/deploy-production-nginx.sh`.
- Deploy marker: `DEPLOY_OK_YIXIU_20260912-d16f834-quiet-hour-1348`.
- Target: `/srv/wonderelian/yixiu.wonderelian.com`.
- Rollback backup: `/srv/wonderelian/backups/yixiu-20260912-d16f834-quiet-hour-1348`.
- Package: `yixiu-web-20260912-quiet-hour.tar.gz`.
- Script validates 14 meditation files, credits, completion cue and Quiet Hour hash before and after copying. Nginx configuration test passed. No unrelated product was deployed.

## Acceptance

- Production HTML points to `assets/index-CW4b3BQj.js` and `assets/index-CZ4H_jws.css`.
- Desktop Chrome production route `/?music=quietHour&lang=zh` displays 午后留白 / QUIET HOUR.
- Play opens the Plus explanation, which correctly names the three Free tracks and the 14 + 14 library. It explicitly says H5 does not read Apple purchase state.
- Production credits page loads the complete extended-edit notice and all four new audio entries. Quiet Hour's media control transitions from Play to Pause after playback begins, then was paused after the smoke test.
- Public Quiet Hour range request returns HTTP 206, `Content-Type: audio/mp4`, `Content-Range: bytes 0-1023/73616309`.
- Deployed Quiet Hour SHA-256: `fc54aa9323b036c44b6a38871cc422361865fa6fedc9685a5705005a6d7eac74` (matches the tested source and App bundle).
- Release build and 45 Sites tests passed. Implementation-stage playback and regression evidence is recorded in `docs/qa/2026-09-12-quiet-hour.md`.

This release is not evidence of a download, subscription or growth target. Unknown official attribution metrics remain null.
