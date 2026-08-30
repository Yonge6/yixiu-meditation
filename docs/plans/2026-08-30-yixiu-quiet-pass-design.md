# Yixiu Quiet Pass Design

## Goal and boundary

Quiet Pass turns an already-completed Yixiu listening moment into an anonymous gift a listener can pass to one person. The first release is limited to the complete First Breath and Still Water tracks already available free on the web. It adds no account, contact access, social graph, membership entitlement, App Store submission, or cross-product referral.

The sender earns no locked feature for sharing. The recipient receives the same complete public track in a more personal, immersive presentation. This keeps the loop useful on its own and avoids treating marketing activity as a condition for unlocking app functionality.

## Sender experience

The existing First Breath and Still Water pages keep their primary players. A restrained Quiet Pass card remains hidden until the listener has received meaningful value: 60 seconds for First Breath and 180 seconds for Still Water. The shared audio controller emits a playback-progress event; the Quiet Pass script reveals the card only after the configured threshold.

The card says that the moment may suit someone else and offers one action: send the current track. A successful native share or clipboard copy creates a new anonymous gift identifier and records `gift_created`. Canceling the share does not report success.

## Recipient experience

Two static routes provide deterministic social metadata:

- `/gift/first-breath/`
- `/gift/still-water/`

Each route has its own canonical, title, description, Open Graph image, Twitter card, audio source, and scene copy. The query string carries only a random gift ID plus campaign parameters. The page opens on a full-screen moonlit-water composition with the message “Someone sent you a quiet moment,” a visible `中 / EN` control, and one primary `Receive & Listen` button. Playback begins only after a user gesture.

After 60 accumulated seconds, the page records `gift_qualified_60s` once and reveals a quiet completion panel. Its primary action passes the same track onward with a fresh gift ID; its secondary action opens the attributed Yixiu App Store URL. No download, trial, payment, or subscription outcome is inferred from either action.

## Architecture and privacy

The release is static HTML, CSS, and JavaScript. It needs no user database or server API because no economic entitlement is awarded. Gift IDs are generated with `crypto.getRandomValues`, contain no identity, and are validated before analytics use. Local storage suppresses repeat `gift_opened` and `gift_qualified_60s` events in the same browser without fingerprinting.

The event path is `gift_share_initiated` → `gift_created` → `gift_opened` → `gift_play_started` → `gift_qualified_60s` → `gift_reshared` or `yixiu_download_click`. Unique high-cardinality gift IDs are used only as anonymous event parameters and are not presented as people or authoritative cross-device attribution.

If analytics is blocked, the experience continues. If the gift ID is missing or invalid, the track still plays and the session is marked unattributed. If the scene configuration is invalid, the page falls back to First Breath. If audio fails, the page offers retry and a link to the original full-track page.

## Visual direction

The page follows Yixiu's selected deep-water language: full-bleed photography, navy and deep teal, reflected light, one restrained ripple, Noto Serif SC for reflective headlines, and Noto Sans SC for controls. It is intentionally closer to receiving a quiet letter than opening a utility player. Motion is limited to the initial reveal, a breathing play halo, playback progress, and the completion-panel transition, with `prefers-reduced-motion` support.

## Acceptance

Tests must prove both social metadata routes, sender threshold behavior, anonymous ID generation, share cancellation behavior, invalid-ID fallback, bilingual copy, 60-second qualification, one-time event suppression, onward sharing, attributed App Store links, audio error recovery, responsive layout, keyboard focus, and reduced-motion behavior. Production acceptance requires HTTP 200, exact public DOM and metadata, audio range requests, desktop and phone visual inspection, and source/deployed hash agreement for the Quiet Pass script and stylesheet.

The long-term growth goal remains incomplete until one completed Beijing natural day reaches at least 100 active users for exact hostname `yixiu.wonderelian.com`; Apple outcomes remain official-data-only and unavailable values remain `null`.
