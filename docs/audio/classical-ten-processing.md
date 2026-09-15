# Classical Ten processing and acceptance

## Scope

Ten approved classical works are added, not replacements for the remaining meditation catalog. The four previously retired tracks stay retired. Two existing Free music entitlements are unchanged. H5 full listening/download for all ten recordings is available at `music-credits.html#classical`, outside membership gates. Native catalog/assets are synchronized in source only; no App Store submission or installation is part of this release.

## Sources

See `classical-ten-sources.json` for recording-specific URLs, performers, licenses, measured duration and hashes. Composition public-domain status alone was not used as permission for a recording. Gymnopédie uses the user-approved Robin Alciatore alternative. Prelude Op. 28 No. 17 is the CC0 Musopen collection recording mirrored on Commons; neither the recording page nor MP3 identifies its performer, so no performer name is invented. The Musopen archive item itself also marks the collection CC0: https://archive.org/details/musopen-chopin . Kimiko Ishizaka's BWV 846 CC0 release is independently documented at https://kimikoishizaka.bandcamp.com/track/prelude-no-1-in-c-major-bwv-846 .

## Audio processing

Originals downloaded from the manifest URLs. Each original and AAC output was decoded completely using FFmpeg 7.1, with no decode errors. Conversion: `ffmpeg -hide_banner -nostdin -y -i SOURCE -vn -c:a aac -b:a 192k -ar 44100 -ac 2 -movflags +faststart OUTPUT.m4a`. No tempo changes, pitch changes, cuts or extension edits; original dynamics preserved. Source quality varies; AAC conversion does not restore lost quality, and these are not advertised as lossless recordings. Original downloads remain in `/tmp/yixiu-classical-originals-20260915/`; production AAC copies are in the repository. Native and web copies are byte-identical. No claim of a full human listening audition is made.

## Artwork

Ten original AI-assisted paintings, mechanically compressed to 1000 px wide JPEG. See `design/classical-ten/README.md` for prompts and original paths. Web images total about 2.2 MB; artwork does not block the initial music download. Original PNGs are retained in the design directory.

## Local acceptance

- H5 production build and protected runtime checks passed; 45 Sites tests passed.
- Native Free/legacy/Plus policy harness passed: 34 active scenes, 20 music tracks, ten classical works, two Free music tracks; retired IDs remain denied.
- Native generic iOS Release build succeeded with signing disabled.
- Browser regression uses desktop Chrome, built static output, 390 px and 768 px screenshots, source-page playback of all ten files, share-link Plus gates and the existing bilingual journal/retirement suites.
- An initial Python static-server test stalled with several paused media downloads still holding connections. The final test uses Vite's production preview and releases each fixture audio source after playback inspection. This was not accepted as a passing run.

Production URL, release hash and live acceptance are recorded separately after deployment.
