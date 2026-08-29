# Sleep Referral Share Design — 2026-08-29

## Evidence

The exact-hostname GA4 report for 2026-08-22 through 2026-08-29 shows the Yixiu Sleep page as the highest-volume named landing page: 18 `yixiu_landing_view` users and 9 `yixiu_playback_start` users. Only one user generated a `yixiu_share` event on that page. The current post-play panel appends a generic `Share this sound` control after the iPhone continuation link, but it does not explain who the listener might share with or why.

Search Console still exposes only seven impressions and no query rows. TikTok has repeatedly failed public verification, and the authenticated `@WonderElian` X account is suspended in permanent read-only mode. Improving the existing listener-to-listener referral path is therefore the smallest remaining owned growth loop that can create new H5 visitors without touching another product or adding another same-day social post.

## Options

1. **Contextual post-play invitation — selected.** After successful Window Rain playback, show `Know someone who needs a quieter night?` and label the existing native-share control `Send this rain to someone`. Keep the current attributed canonical URL, native share sheet, clipboard fallback and event semantics.
2. Show the share action before playback. This increases raw visibility but competes with the primary listening action and invites sharing before the visitor has heard the sound.
3. Open a timed referral modal. This may increase clicks but interrupts the quiet bedtime flow and adds state that is disproportionate to the evidence.

## Implementation

The Sleep page adds one visible referral sentence and a `data-share-label` override to its existing `[data-after-preview]` panel. The shared discovery script reads that override for the initial and restored button label while retaining `Share this sound` as the fallback for every other page. The existing `yixiu_share` event remains the authoritative successful-action event; no impression event is needed because the prompt is revealed by the already measured playback action.

CSS gives the referral sentence its own block and spacing while preserving the existing 44-pixel controls. No new page, asset, account, external dependency or analytics destination is introduced.

## Verification and boundary

Add a failing-then-passing Playwright assertion for the Sleep prompt and exact share label. Run the complete browser suite, static-site tests, production build and protected mobile runtime check. Mobile acceptance requires the post-play panel to remain inside a 390 × 844 viewport without horizontal overflow. Production acceptance requires merge, guarded deployment with backup, exact source/server/public hashes, live playback and prompt readback, and unchanged attributed sharing.

This change creates a more explicit referral opportunity only. It does not prove a shared visit, H5 user or App download. Only a later exact-hostname GA4 `share / referral / scene_share / sleep_landing_share` acquisition row can attribute new H5 traffic; absent outcomes remain `null`. The overall goal stays active until a completed Beijing natural day reaches at least 100 active users.
