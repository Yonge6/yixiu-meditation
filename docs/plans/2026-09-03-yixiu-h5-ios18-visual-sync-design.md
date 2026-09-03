# Yixiu H5 iOS 1.8 Visual Sync Design

Date: 2026-09-03 Asia/Shanghai

## Goal

Bring the public Yixiu H5 player into visual and behavioral alignment with the accepted iOS 1.8 interface without changing playback, sharing, subscription gating, analytics, or acquisition URLs.

## Selected direction

Use the accepted iOS 1.8 implementation as the source of truth while keeping browser-native HTML, CSS, and Web Share behavior. A fresh visit without a language parameter starts in English; explicit `?lang=zh` and `?lang=en` deep links continue to win, and a visitor's later manual choice remains stored locally. The Sounds header keeps the Yixiu brand on the left and places the existing App Store CTA, share control, and language control on the right, with share immediately to the left of language.

The sound library retains the existing `FREE` capsule for free content. Plus content replaces the `PLUS` word capsule with a thirty-pixel cut-corner medallion containing the same outlined faceted gemstone geometry as iOS 1.8. Accessible names continue to identify the content as Yixiu Plus. The persistent mobile bottom navigation becomes an inset, blurred, rounded system-style surface with a distinct active segment, matching the current native iOS tab treatment while remaining CSS-based and usable with browser safe areas.

The five corrected iOS 1.8 scene files—Still Water, Open Meadow, Oasis Rest, Ocean Passage, and Quiet Orbit—replace the older H5 copies byte-for-byte. This makes the scenes brighter and gives Quiet Orbit a visible star-trail composition without introducing new generated assets.

## Safety and acceptance

Only `yixiu-prototype/` UI code, its focused tests, the five H5 scene assets, and documentation may change. Protected mobile runtime files remain untouched. Acceptance requires runtime-lock verification, focused Playwright coverage, a production build, Sites worker tests, responsive visual checks in both languages, GitHub merge, production deployment with rollback backup, and public DOM/image/console readback.
