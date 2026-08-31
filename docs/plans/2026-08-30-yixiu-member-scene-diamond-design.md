# Yixiu member-scene diamond badge design

## Goal

Make free and member-only sound scenes distinguishable at a glance without adding more text or implying that an internal preview is an App Store subscription.

## Decision

- Keep the existing aqua `FREE` capsule on the seven free scenes.
- Mark every non-free scene with the SF Symbol `diamond.fill` inside a compact aqua circle.
- Show the diamond whether the current user can access the member scene or not, so the scene's product class remains stable after upgrading or in the internal Plus build.
- Keep lock and membership meaning in the existing card interaction and accessibility label. The decorative diamond itself is hidden from VoiceOver to avoid duplicate announcements.

## Visual treatment

The 26-point circular badge uses the existing Yixiu aqua and deep-water tokens, a fine moon-colored edge, and a restrained glow. It occupies the same top-leading slot as `FREE` but has a clearly different silhouette.

## Acceptance

- Free scenes retain the word `FREE`.
- All other scenes show one filled diamond and no `PLUS` or lock label in the badge.
- The normal free build still opens the paywall for inaccessible member scenes.
- The internal Plus build keeps all 24 scenes accessible while showing the diamond on member scenes.
- Debug, internal Plus Debug, and Release device builds compile successfully.
