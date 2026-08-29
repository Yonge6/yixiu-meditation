# Instagram White Noise Funnel Design

## Goal

Turn an existing Yixiu-only Underwater White Noise vertical video into a measurable Instagram acquisition path for the newly released black-screen player, without uploading to YouTube, changing another product, or weakening the existing Instagram destinations.

## Evidence and options

The exact-hostname GA4 Data API report for 2026-08-22 through 2026-08-28 shows YouTube as the strongest attributable external surface, but all genuine owner-comment gaps are already filled and new YouTube video or image uploads require separate permission. Instagram contributed seven active users from Reels and three from organic social in the same report. The existing clickable Instagram profile link already opens a Yixiu-only chooser, but that chooser has no White Noise destination.

Three options were compared:

1. Add a White Noise path to the existing Instagram chooser, adapt the existing vertical video, and publish one Reel. This is selected because it completes the actual click path and reuses a verified first-party Yixiu asset.
2. Publish the current Pinterest video unchanged. Rejected because its final `Tap Visit Site` instruction does not match an organic Instagram Reel.
3. Create another SEO landing page. Rejected because the canonical White Noise page is already live and a duplicate would split search relevance.

## H5 design

The Instagram-only chooser keeps all four existing destinations and adds two existing Yixiu destinations so the grid remains visually balanced:

- White noise + black screen → `/underwater-white-noise-for-sleep/`
- Mountain wind → `/wind-sounds-for-sleeping/`

Both links use `instagram / profile / yixiu_profile` attribution with distinct `utm_content` values and the existing `yixiu_profile_path_click` event. Mobile uses two columns and three rows; desktop uses three columns and two rows. Ordinary homepage visits remain unchanged because the chooser still appears only for the exact existing `ig / social / link_in_bio` campaign.

## Reel design

Reuse the existing 1080×1920, 20-second, H.264/AAC Underwater White Noise video and its authentic audio. Preserve the opening `UNDERWATER WHITE NOISE` and `NO MUSIC · NO TALKING` frames. From 12 seconds onward, cover the Pinterest-specific CTA with a dark panel and replace it with:

> WHITE NOISE · BLACK SCREEN
>
> LINK IN BIO
>
> CHOOSE WHITE NOISE

The caption directs viewers to the existing clickable Yixiu profile link, uses a unique `instagram / organic_reel / sleep_sounds / underwater_white_noise_black_screen_reel_13` attribution path, and makes only verified claims: a free web preview, black-screen mode, a 15/30/60-minute timer, no music, no talking, no account and no ads. No treatment, ranking, traffic or download claim is allowed.

## Verification and boundaries

Write the chooser test first and prove it fails before implementation. Then require protected-runtime integrity, production build, full Playwright, static-site tests and 390px visual acceptance. Inspect the Reel at five timestamps, confirm H.264/AAC, 1080×1920, 20 seconds and a stable SHA-256. After deployment, verify the exact Instagram campaign in production without loading analytics, then publish from desktop Chrome on `@wonderelian` with the AI-content disclosure enabled and independently verify the public URL, author, caption and destination path.

Publication proves a live acquisition surface only. A visit requires exact GA4 attribution, and the long-term goal still requires at least 100 active users on one completed Beijing natural day plus the already-proven Apple download evidence. Unknown trials, payments, subscriptions, in-app purchases, revenue and campaign-specific downloads remain `null`.
