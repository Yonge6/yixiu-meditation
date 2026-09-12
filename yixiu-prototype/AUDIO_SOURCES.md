# Yixiu audio source ledger

## Quiet Hour — 2026-09-12

- Scene: 午后留白 / Quiet Hour (`quietHour`), **60 分钟延长版 / 60 min extended**. New Plus library item on native/H5; the existing three Free tracks are unchanged. Public credits provide ungated playback/download and do not restrict CC0 rights.
- Original: **Too Brief A Time To Be Anything**, **HoliznaCC0**, *Space - Sleep - Meditation*, FMA track 201977. [Single-track source](https://freemusicarchive.org/music/holiznacc0/space-sleep-meditation/too-brief-a-time-to-be-anything/) explicitly links [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/); verified 2026-09-12. Not the inaccessible WeChat reference; no artist endorsement implied.
- [Original MP3](https://files.freemusicarchive.org/storage-freemusicarchive-org/tracks/rQmaRN5y4omWKU3cn2kT3i8kSqyup26HFthRK9Fd.mp3): SHA-256 `161daca3df08017953dbe013bcdf5e59025900a055591b6d1e0a49c71703cd4f`; 48 kHz stereo, approximately 2,700 seconds. Initial partial HTTP transfer was completed with a successful range resume before decode/hash verification.
- Reproducible edit: `node scripts/prepare-quiet-hour.mjs <original.mp3>`. Original 0–2680 seconds, crossfade output 2660–2680 into original 1200–1220, then continue original 1220–2140. Thus 2680 + 940 − 20 = 3600 seconds. Raised-cosine constant-sum 20-second crossfade; 8-second start / 12-second end fade; no tempo/pitch changes. No added voice or sound effects. Original artwork is not used; existing licensed MorningLake scene reused.
- Downward-only gain: −7.530177 dB to target −23 dBFS RMS before endpoint fades (not a LUFS claim). PCM splice jumps 0.004608 / 0.005554; minimum internal 1-second RMS 0.027570; no internal digital silence detected. Signal checks cannot establish subjective musical preference.
- Final AAC: 48 kHz stereo, 160 kbps target, **3600 seconds**, 73,616,309 bytes. Native/H5 byte-identical `quiet-hour.m4a`, SHA-256 `fc54aa9323b036c44b6a38871cc422361865fa6fedc9685a5705005a6d7eac74`.

## Ambient additions — 2026-09-12

Original music: **Cylinder Seven, Cylinder Eight, Cylinder Nine**, from *Cylinders*, written, produced and performed by **Chris Zabriskie**. © 2014 Chris Zabriskie; published by **You've Been a Wonderful Laugh Track (ASCAP)**. The [author's album page](https://chriszabriskie.com/cylinders/) explicitly links [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); verified 2026-09-12. [Official Bandcamp album](https://chriszabriskie.bandcamp.com/album/cylinders) provides original titles and individual name-your-price downloads.

Changes: Yixiu bilingual scene names, AAC 160 kbps target / 44.1 kHz stereo encoding, downward-only gain to -23 dBFS RMS before a 2-second fade-in and 4-second fade-out. No tempo change, no added speech or synthetic ambience. This is not a LUFS measurement. Original album artwork is not used; existing Yixiu MorningLake, SunnyValley and NightTide artwork is reused on both platforms. No artist endorsement implied.

| Yixiu scene / file | Original title | Duration | Gain change | Final SHA-256 |
| --- | --- | ---: | ---: | --- |
| 云间漂浮 / Cloud Drift / `meditation/cloud-drift.m4a` | Cylinder Seven | 532.173 s | -6.948 dB | `ff0c1a3741068ea6c2811ba8fe09a00a03d4ab9d34d10aa8c759510b58059ac0` |
| 柔光午憩 / Soft Light Rest / `meditation/soft-light-rest.m4a` | Cylinder Eight | 338.880 s | -8.055 dB | `11780f8702c10706364a6f3b34b30546277622046df230d98bd53e44ffdc8dc0` |
| 深水安歇 / Deep Water Rest / `meditation/deep-water-rest.m4a` | Cylinder Nine | 322.827 s | -3.032 dB | `d1a35f8dac51ba4a6b994c6ef8d4c42736e629295200f9a91886d568c27f9a4f` |

| Original download | Original SHA-256 |
| --- | --- |
| [Cylinder Seven MP3](https://files.freemusicarchive.org/storage-freemusicarchive-org/music/Music_for_Video/Chris_Zabriskie/Cylinders/Chris_Zabriskie_-_07_-_Cylinder_Seven.mp3) | `b065596eeca06a82aabc6a46cd7446e56d62ff5fa761abf92d8147a3c3adde96` |
| [Cylinder Eight MP3](https://files.freemusicarchive.org/storage-freemusicarchive-org/music/Music_for_Video/Chris_Zabriskie/Cylinders/Chris_Zabriskie_-_08_-_Cylinder_Eight.mp3) | `4f980cf97608dd9f0c7dbed8a9742d0083584767b2e8338ac50514ca0700129a` |
| [Cylinder Nine MP3](https://files.freemusicarchive.org/storage-freemusicarchive-org/music/Music_for_Video/Chris_Zabriskie/Cylinders/Chris_Zabriskie_-_09_-_Cylinder_Nine.mp3) | `108c6a8babb1d088787d59442412a5bb50506c787892e5f8099a2b714dc659b7` |

Reproduce from complete originals with `node scripts/prepare-ambient-music.mjs <download-directory>` at the repository root (macOS afconvert required). Native and H5 contain byte-identical outputs. Complete provenance and ungated listening/download links are included in `public/music-credits.html` and linked in native/H5 Sources. Membership gates the curated app experience, not recipients' Creative Commons rights. Free music remains Oasis Rest, Ocean Passage and First Breath; these three additions are Plus in the library.

## Nature recordings

All files below are converted from Mixkit preview MP3s to AAC/M4A for reliable Safari and iOS playback. They are used under the [Mixkit Sound Effects Free License](https://mixkit.co/license/).

| Local file | Mixkit item | Source ID | Duration |
| --- | --- | ---: | ---: |
| `ocean-waves.m4a` | Sea waves loop | 1196 | 48.25 s |
| `light-rain.m4a` | Light rain looping | 1249 | 96.00 s |
| `sunrise-river.m4a` | Atmosphere of a river at sunrise | 2458 | 60.17 s |
| `morning-birds.m4a` | Morning birds | 2472 | 209.72 s |
| `river-flow.m4a` | River water flowing | 2454 | 180.15 s |
| `forest-breeze.m4a` | Windy humming forest with birds | 1238 | 125.35 s |
| `forest-waterfall.m4a` | Waterfall in the woods | 2517 | 82.76 s |
| `distant-thunder.m4a` | Thunder rumble and light rain | 2401 | 25.75 s |
| `underwater-white-noise.m4a` | Underwater white noise | 1209 | 4.98 s |
| `mountain-wind.m4a` | Wind in the top of the mountain | 1267 | 31.80 s |

Original preview URL pattern: `https://assets.mixkit.co/active_storage/sfx/{ID}/{ID}-preview.mp3`.

## Meditation music

The five long tracks come from [HoliznaCC0's Space - Sleep - Meditation](https://freemusicarchive.org/music/holiznacc0/space-sleep-meditation) and are published under CC0 1.0. The five short, loopable tracks come from [Yanni Ziangos (YannZ)'s Indie Meditations FREE Music Pack](https://opengameart.org/content/indie-meditations-free-music-pack) under CC BY 4.0. Attribution for the short set: **Music by Yanni Ziangos a.k.a. YannZ, licensed CC BY 4.0.**

| Local file | Source title | Creator | License | Duration | Final SHA-256 |
| --- | --- | --- | --- | ---: | --- |
| `meditation/still-water.m4a` | 20 Minute Meditation 1 | HoliznaCC0 | CC0 1.0 | 1279.968 s | `f110fa05921341f0bde14d95c5987f5091cfc11d6fe838c67f433df3d52fcc4a` |
| `meditation/deep-current.m4a` | 20 Minute Meditation 3 | HoliznaCC0 | CC0 1.0 | 1199.976 s | `db1c7d9d1b04a5cd0a35a27492e02ff0f9f3c199ec711ff00430b11cb9ca9252` |
| `meditation/moonlit-drift.m4a` | 20 Minute Meditation 8 | HoliznaCC0 | CC0 1.0 | 1211.976 s | `0df06e993d705a52ebfaf34fbbaf559c9b0454df018799d06e8026ba2510f6d5` |
| `meditation/quiet-orbit.m4a` | 20 Minute Meditation 10 | HoliznaCC0 | CC0 1.0 | 1259.976 s | `58fdd533f976d4983863b2dbd879c585de18e47b4b42c6dd64f5ef881c5d8f22` |
| `meditation/dreamscape.m4a` | DreamScape | HoliznaCC0 | CC0 1.0 | 1319.976 s | `a04017e18f008ef6beeba9e2e10d4cde59fd8e06546535d1186f24674d3d5895` |
| `meditation/first-breath.m4a` | lvl 0 - the tutorial | YannZ | CC BY 4.0 | 88.000 s | `79402e8dc3092983115c0a1a578150b97617659afa2c617368f546d19f9c6f50` |
| `meditation/open-meadow.m4a` | lvl 3 - the grassland | YannZ | CC BY 4.0 | 88.000 s | `41271145838f59ffe1fec370d7dabc51bbeea50ae559f8f633789b9605569a61` |
| `meditation/oasis-rest.m4a` | lvl 5 - the oasis or resting place | YannZ | CC BY 4.0 | 88.000 s | `eb9c6b78a2462325542ec27665b3eff58fa6bb95a8340e2d65a2b8c20c60e045` |
| `meditation/sunlit-shore.m4a` | lvl 6 - the beach | YannZ | CC BY 4.0 | 88.033 s | `4afff8f61402d0ee83c58228090bef70c950e7451142b3e2bf427cd65585ca40` |
| `meditation/ocean-passage.m4a` | lvl 7 - the raft on the ocean | YannZ | CC BY 4.0 | 88.033 s | `61defa224a05eaa127a57b15779dd4350013e5a1bff85d5bda83067f7c3baebc` |

Original-download SHA-256 evidence:

| Yixiu ID | Original source URL | Original SHA-256 |
| --- | --- | --- |
| still-water | [FMA MP3](https://files.freemusicarchive.org/storage-freemusicarchive-org/tracks/l2voOrqtnup186CFblGiKMvKziL9LmSR26D3INpG.mp3) | `f0dcdd8058815cf31dee84996d666e81e595841ed874539fbf920f91e77ff50f` |
| deep-current | [FMA MP3](https://files.freemusicarchive.org/storage-freemusicarchive-org/tracks/bYGgsjn5FblDqqxs7XcIw8EyWsjRv9fs10gksYHr.mp3) | `0551c1677efcf8f87dce70d0188fad18b10d4a274bbff1c899ee52f11ac7fa93` |
| moonlit-drift | [FMA MP3](https://files.freemusicarchive.org/storage-freemusicarchive-org/tracks/hLz57BLR7CKPvZ3c11i88MJB2UB0uYJIkbZsot15.mp3) | `928ff8b6aaf90e77563e4022e746aa60f1014d6b9cd59382f848c296aaee6ed4` |
| quiet-orbit | [FMA MP3](https://files.freemusicarchive.org/storage-freemusicarchive-org/tracks/tImlPripYkdvWCdgK96RXhqxg5ObbdtsAeTNCEou.mp3) | `f67f96ab040bae13f2a1f088f4171a29ae8c5d485fae13dcedf788e2226bf032` |
| dreamscape | [FMA MP3](https://files.freemusicarchive.org/storage-freemusicarchive-org/tracks/F8rsaDXQBxNNiQQSNmpO2RBULw8LxtHpjQPY8Gpi.mp3) | `77d7ef473cbed4164af43d1a7c8db871be83dfaa819e345517e9a61decb871dc` |
| first-breath | [OpenGameArt MP3](https://opengameart.org/sites/default/files/lvl_0_the_tutorial.mp3) | `6f34b0bd1da90c7af030da3b7dc24fb2c945a5fe6b4bab0843d9f75faab93f11` |
| open-meadow | [OpenGameArt MP3](https://opengameart.org/sites/default/files/lvl_3_the_grassland_0.mp3) | `d62d69cf45223b15aa07bc7a8cab999b7b1e95d6a10dc3a96f0e755de9daad41` |
| oasis-rest | [OpenGameArt MP3](https://opengameart.org/sites/default/files/lvl_5_the_oasis_or_resting_place.mp3) | `1dcec4f2017b1c0169eff60828db4588251405df3060efbd866b0daa77467baa` |
| sunlit-shore | [OpenGameArt MP3](https://opengameart.org/sites/default/files/lvl_6_the_beach.mp3) | `73a0bd5547666af4ea77461197b006ce35256a38152fd8c7017d6de1732b6ab8` |
| ocean-passage | [OpenGameArt MP3](https://opengameart.org/sites/default/files/lvl_7_the_raft_on_the_ocean.mp3) | `c7c744ea54570ad7f817ef9c0f16b969f83de98138fcf4828c6bdd8c994d67e7` |
