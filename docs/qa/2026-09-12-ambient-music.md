# Ambient music expansion — local acceptance

## Scope

- Added Cloud Drift / 云间漂浮 (8:52), Soft Light Rest / 柔光午憩 (5:39), Deep Water Rest / 深水安歇 (5:23), based on Chris Zabriskie's Cylinder Seven, Eight and Nine under CC BY 4.0.
- Native and H5 now expose 14 nature sounds + 13 meditation tracks. All three additions belong to Meditation, Sleep and Relax and use the same bilingual names, audio and existing artwork.
- The three Free music tracks remain Oasis Rest, Ocean Passage and First Breath. New library tracks require Plus; legacy nature rights are unchanged. H5 cannot infer Apple membership from localStorage or a share URL.
- Both Sources views attribute original titles, author, copyright, publisher, source and license, and disclose AAC conversion, attenuation and fades. The standalone `music-credits.html` offers ungated listening/downloads to preserve CC rights. No artist endorsement or therapeutic benefit is claimed.
- The WeChat reference could not be inspected. Selection is based on documented instrumental/ambient source metadata, not a claim of listening to or matching that clip. Human listening preference still needs user confirmation.

## Audio acceptance

- Complete source MP3s hash-verified in `AUDIO_SOURCES.md`; partial download detected for Cylinder Eight and replaced with a complete successful download before encoding.
- `scripts/prepare-ambient-music.mjs` validates all original hashes, converts through PCM16 at 44.1 kHz stereo, attenuates only to -23 dBFS RMS before 2s/4s fades, then encodes AAC at a 160 kbps target. No pitch/tempo modification.
- Native source, H5 source and the actual built Release simulator app have identical SHA-256 values.
- Browser Web Audio fully decoded each track: correct duration, stereo, non-silent, peak below 0.8 and boundary samples below 0.01.
- `AmbientMusicAudioHarness.swift` fully reads the built app's files with AVAudioFile and prepares AVAudioPlayer. Observed peaks: 0.447649 / 0.392139 / 0.660616; boundary peaks < 0.000038. This harness ran on macOS against the simulator bundle, not on the user's phone.

## Verification

- H5 TypeScript/Vite production build passed; all 28 protected runtime files unchanged.
- 99 Playwright tests passed (45.8s), including six new music tests and existing Free music, end-bell, Focus, scrolling, sharing and runtime coverage. Updated the pre-existing Sleep-filter count from 6 to 9 to account for the intentional additions.
- 45 Sites tests and 4 practice-core tests passed.
- Native Release iOS Simulator build passed. Native policy harness verifies 27 scenes / 13 music, exact 3 Free music, Plus, legacy, matching categories and music deep links.
- 13 Swift core tests in 3 suites passed.
- Chrome 390×844 readback verified the 14+13 count, Free/Plus copy, library and gate. No browser console errors observed.
- `git diff --check` passed.

## Delivery boundary

- Local preview: `http://127.0.0.1:4199/`; direct three-track audition: `http://127.0.0.1:4199/music-credits.html`.
- This task does not deploy production, submit/withdraw Apple review, change the public StoreKit entitlement logic, or install on the phone. Native version/build remains 1.12 (25); a future review upload needs a new build number and fresh App Store Connect readback.
- The branch also contains the prior local end-bell and three-Free changes in commit `1d9777f`, still not claimed as released.
