# Classical expansion — 2026-09-21

## Scope

Add ten classical recordings to both App and H5, five Free and five Plus. Pin sound-library filters above the scrolling cards. Stable-partition homepage next/previous/swipe order into Free followed by Plus, preserving relative order, deep-link targets, and access checks.

| New Free | New Plus |
| --- | --- |
| Schumann — Träumerei, Op. 15 No. 7 | Liszt — Liebestraum No. 3 |
| Chopin — Raindrop Prelude, Op. 28 No. 15 | Schubert — Impromptu, D. 935 No. 2 |
| Chopin — Waltz in A minor, B. 150 | Chopin — Nocturne, Op. 27 No. 2 |
| Satie — Gnossienne No. 1 | Chopin — Farewell Waltz, Op. 69 No. 1 |
| Mozart — Andante cantabile, K. 333 II | Chopin — Prelude, Op. 28 No. 6 |

New total: 44 active scenes (14 nature + 30 music), with 22 Free scenes (10 nature + 12 music). Classical subset: 20 recordings, 10 Free / 10 Plus. Retired identifiers remain decodable only for history. Legacy entitlements and StoreKit verification are preserved.

## Sources and processing

See `classical-expansion-sources.json` for original URLs, recording licenses, attribution, source and output SHA-256 hashes, measured durations, and byte counts. Selected from Wikimedia Commons and the Musopen Chopin archive; unknown performers are explicitly identified as unknown rather than attributed speculatively.

Satie's recording is CC BY-SA 3.0 (separate from the composition's public-domain status); Liszt is CC BY-SA 2.0 and Schubert CC BY-SA 2.5. Preserve these licenses for AAC conversions. All recordings have publicly accessible full listening, download, source, license and format-conversion notices in `music-credits.html`, including those categorized Plus in the player.

Audio conversion: AAC 192 kbps, 44.1 kHz stereo, format conversion only. No looping, cutting, pitch or tempo changes. FFmpeg decoded every generated file without audio decoding errors; web and native files are byte-identical. Existing approved classical landscape artworks are reused; no new artwork was commissioned.

## Verification

- H5 production build and protected-runtime integrity check passed.
- Sites tests: 45 passed.
- Native FreeMusicPolicyHarness and SubscriptionAccessPolicySmoke passed.
- Xcode Release simulator build succeeded, signing disabled and without internal Plus. All ten new recordings verified present in the built App bundle.
- Browser tests: 81 passed. Coverage includes audio playback/durations/hashes, all classical deep links/access gates, Free-first previous/next and gestures, retired-track handling, open credits/downloads, and pinned filters at 390/768/1248 px.

This is a source/build change, not evidence of production deployment, phone installation or App Store submission.
