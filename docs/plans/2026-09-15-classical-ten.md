# Classical Ten Implementation Plan

**Goal:** Add the ten user-approved classical works with individual original landscape paintings to native iOS and H5, preserving existing catalog and access rights.

**Architecture:** Extend the existing scene model and catalogs without replacing the audio engine or navigation. Keep a source/license/hash manifest for each recording. Add classical filtering using the existing sheet pattern; preserve selected scene parity in Focus and sharing.

**Tech Stack:** SwiftUI, React/TypeScript, existing native audio player/Web Audio, FFmpeg, built-in image generation.

## Scope and design

- Ten works: Clair de lune, Nocturne Op.9 No.2, Gymnopédie No.1, Canon in D, Moonlight Sonata I, Pathétique II, Prelude BWV846, Goldberg Aria, Berceuse Op.57, Prelude Op.28 No.17.
- New tracks follow the existing Plus policy; existing two Free music tracks stay unchanged. Open-license source downloads remain ungated.
- Art: ten text-free portrait landscapes with restrained classical oil-painting texture, distinct scenery, low-contrast lower player region; use the identical selected artwork on native and H5.
- No unrelated removals, new subscription products, Apple submission or phone installation. Do not deploy an incomplete or uncleared catalog.
- Amber Short Gymnopédie source download is unavailable. User explicitly approved keeping the work and changing the performance. Selected replacement: Robin Alciatore, Musopen public-domain dedication, verified on its Wikimedia Commons recording page on 2026-09-15.

## Task 1: Assets and rights

Create `docs/audio/classical-ten-sources.json` and source evidence under `docs/audio/`. Resolve original URLs, artists, licenses and original hashes; reject NC/ND and uncertain rights. Download only identified recordings. Normalize gently without tempo/pitch changes; record measured duration, output hash and exact FFmpeg settings. Save native audio under `YixiuMeditation/YixiuMeditation/Audio/Meditation/` and matching H5 files under `yixiu-prototype/public/assets/yixiu/audio/meditation/`.

## Task 2: Cover artworks

Generate each cover separately with built-in imagegen. Save original workspace images under `design/classical-ten/`; optimized native images in asset catalogs and H5 images under `public/assets/yixiu/classical/`. Record prompts and original/output mapping. Inspect every cover and UI crop.

## Task 3: Catalog integration and regression

Extend `Models.swift`, `Prototype.tsx`, existing credits surfaces, catalog totals and relevant tests. Test ten distinct IDs, audio/image parity, correct licenses, Plus gates, stable share links, old retired IDs staying unavailable, all existing free music, Focus parity and bounded swipe navigation. Keep completed records unchanged.

## Task 4: Verification

Run native policy harness and generic iOS Release build with signing disabled. Run `npm run build`, `npm run test:sites`, targeted Playwright audio/catalog and journal suites against built output. Inspect phone and tablet library/player screenshots. Record actual results and exact remaining blockers; source build is not a published App Store version.
