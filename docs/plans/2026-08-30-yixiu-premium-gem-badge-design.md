# Yixiu premium gem badge

## Goal

Replace the generic aqua circle and filled SF Symbol used on Plus scene cards. The new mark should feel designed for Yixiu: quiet, precise, water-like and premium, while remaining immediately distinct from the existing `FREE` text capsule.

## Direction

Use a bespoke faceted gemstone drawn with SwiftUI paths inside a small smoked-glass octagonal medallion. This direction is preferred over a `Y+` monogram, which depends on text, and crown or sparkle symbols, which feel like generic subscription UI.

The 30-point medallion uses a deep-water translucent gradient, an asymmetric silver-to-aqua hairline and one restrained top-edge reflection. The gemstone is an unfilled cut diagram: a five-point outer silhouette, crown line and four internal facets. A soft shadow separates the mark from both bright artwork and dark scenes without creating a neon glow.

## Behavior and accessibility

- `FREE` remains the existing pale-aqua capsule with text.
- Every non-free scene receives the same gem badge regardless of entitlement state, so the content class remains visible after purchase or in internal Plus builds.
- The badge stays decorative and accessibility-hidden; the card already announces either “Switch to …” or “…, Yixiu Plus”.
- No animation, bitmap asset, external dependency or new subscription logic is introduced.

## Acceptance

Verify the badge at actual card size on at least one bright scene and one dark scene. It must retain visible facets, avoid looking like a solid lozenge, remain clearly different from `FREE`, and compile in normal Debug, internal Plus Debug and Release configurations.
