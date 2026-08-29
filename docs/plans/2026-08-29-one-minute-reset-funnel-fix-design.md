# One-Minute Reset funnel fix design

## Evidence and objective

The production desktop-Chrome audit captured the Reset landing before and after audio playback. Entry hierarchy, the primary preview action and the App Store CTA were clear. After playback, however, the dynamically inserted download and share controls rendered as compressed inline text even though the current shared stylesheet contains complete button styles. The page loads `/discover.css` without a version, so a cached pre-share stylesheet can remain active while the newer JavaScript injects new classes.

The same audit found a product-truth mismatch: the H5 says a visible expanding rhythm guides breathing, but the browser action only starts Morning Water audio. The guided rhythm belongs in the iPhone app.

## Options

1. **Recommended: cache-bust and clarify.** Give the Reset page a scoped stylesheet version, keep the existing shared components, and distinguish the free browser sound preview from the guided iPhone rhythm. This directly repairs the observed regression without introducing a new interaction.
2. Add a full 60-second animated breathing guide to the H5. This would satisfy the old copy but adds motion, timing, reduced-motion, pause/resume and accessibility requirements before the scheduled campaign arrives.
3. Remove the post-play share prompt. This hides the visual regression but discards a measured referral surface and leaves the capability mismatch.

## Chosen design and acceptance

Use option 1. Preserve layout, imagery, typography, audio and all existing attribution. Update only the Reset stylesheet URL and the misleading visible and social-description copy. Acceptance requires the Reset-specific site test, protected runtime checks, the production build and a real playback check in the user-selected desktop Chrome; after deployment, a fresh Chrome session must show styled post-play controls and truthful browser-versus-app copy. Source, server and public hashes must match.
