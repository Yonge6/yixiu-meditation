# Design QA — 一休冥想 V1「深水沉浸播放器」

Date: 2026-08-09

## Evidence

- Selected design: `../design/ideation-2026-08-09/yixiu-selected-deep-water-player.png` at 853 × 1844.
- H5 Sounds: `qa-v1-sounds.png` at 390 × 844.
- H5 Focus: `qa-v1-focus.png` at 390 × 844.
- H5 Me: `qa-v1-me.png` at 390 × 844.
- H5 sound library: 14 equal-size cards in a stable two-column scrolling grid.
- H5 Wendao-style drawer: `qa-v1-drawer.png`.
- H5 state after completed swipe: `qa-v1-swipe-final.png`.
- Native iOS Sounds: `../YixiuMeditation/yixiu-native-v1-sounds-fixed.png`.

## Visual comparison

- Fonts: PASS. Chinese uses a restrained Song-style serif stack; English uses spaced classical serif labels.
- Spacing and geometry: PASS. Brand, menu, title, transport, volume, duration, and bottom navigation preserve the approved vertical rhythm without a phone shell.
- Colors: PASS. Deep navy, moonlit cyan, mist white, and subdued inactive controls replace the rejected ivory/gold direction.
- Imagery: PASS. All six scenes use full-bleed water imagery without embedded text, logos, borders, or device frames.
- Copy: PASS. Product, scene, navigation, settings, breathing instructions, and philosophy labels respond to the selected Chinese/English language.
- Iconography: PASS. The player, timer, favorite, volume, water-wave navigation, breathing, profile, and menu controls share one thin-line grammar.
- Native safe area: PASS. Light status bar and top controls remain clear of Dynamic Island and status content.

## Product-flow verification

- PASS: Play/pause, previous/next, favorite, volume, timer, and scene selection work.
- PASS: Horizontal swipe follows the pointer with restrained parallax, scale, and crossfade, then changes the sound and full-screen scene together; the first and last scenes are bounded and provide only a small resisted spring-back response.
- PASS: The compact `EN / 中文` header action and full-height right drawer follow the established 三慢问道 interaction hierarchy, adapted to Yixiu's colors. Sound player, library, breathing, favorites/settings, timer, philosophy, privacy, audio sources, and support are all reached through a fixed two-level drawer; every secondary view keeps Back and Close available, and the former bottom tab bar is removed.
- PASS: The H5 library contains 14 night and daytime nature sounds, including three bright Image2-generated morning/sunlight scenes.
- PASS: The active duration sits above the central play button without a chevron; both its label and the clock icon open the same picker.
- PASS: 15 / 30 / 60 minutes and unlimited duration update the current session.
- PASS: Chinese/English, scene, favorites, duration, end-bell preference, and background-play preference persist locally.
- PASS: The full fourteen-scene sound library opens inside the drawer, keeps equal two-column cards, and selects the matching scene and recording.
- PASS: The 60-second breathing flow supports start, pause, reset, and phase progression.
- PASS: Me contains favorites, defaults, language, playback preferences, trust links, version, and product philosophy.
- PASS: A completed timer fades down and presents a water-wisdom completion panel.
- PASS: H5 runtime integrity, production build, Sites checks, and all 18 Playwright tests pass.
- PASS: Native iOS Simulator Debug build succeeds and the app launches in the simulator.

## Release boundary

- The H5 and iOS V1 interaction structure is complete.
- H5 and native iOS now use the same ten licensed Mixkit nature recordings across all fourteen scenes. The next audio-production gate is loudness normalization, seamless-loop editing, and device/headphone listening—not replacement of generated noise.
- Real licensed recordings, lock-screen remote commands and metadata, signing, real-device interruption/Bluetooth/background QA, final icon, privacy/support URLs, and store materials remain release work.

final result: passed
