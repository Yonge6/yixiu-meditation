# User-approved access and header refresh

- Remove only the Classical library top listening/source note; keep recording attribution, independent listening/download page and paywall source link.
- Classical: 5 Free (clairDeLune, gymnopedie, canon, moonlightSonata, preludeC), 5 Plus.
- Nature: nearest whole-track approximation of requested 70% is 10/14 (71.4%) Free: ocean, rain, spring, birds, stream, lake, valley, bamboo, window, tide. Falls, thunder, underwater and snow stay Plus.
- Oasis Rest and First Breath remain Free. Total Free catalog: 17/34 (10 nature, 7 music). Verified legacy owners retain all 14 nature sounds; public Plus remains Apple-verified.
- Remove the player-header Quiet Journal icon, retain Me entry/articles and focus restoration. Move header up 16 px at all breakpoints with safe-area-aware positions and unchanged touch sizes.
- Synchronize policy and supporting copy in native source and H5. No phone installation or App Store submission is requested for this update.

Acceptance: production H5 build/runtime check, 45 Sites tests, native Swift policy harness and 55 desktop Chrome regression tests passed. Screenshots inspected at 572 px (header) and 390 px (Classical grid). Initial regression run exposed test expectations for old Free counts, old paywall copy and incorrectly treating the download anchor as a button; these assertions were updated to the requested policy and actual semantic controls before the complete passing run. No failed run was counted as acceptance.
