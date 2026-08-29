# Best Sleep Sounds Pinterest URL Pin Design

Date: 2026-08-29

## Objective

Open one new, measurable discovery path to Yixiu's existing sleep-sound comparison page without changing another product, creating a new social account, uploading a new video, or making a sleep-outcome promise.

## Current evidence

The latest exact-hostname GA4 Data API readback reports 26 active users for the completed 2026-08-28 Beijing day and 16 active users for the incomplete 2026-08-29 day. The 100-UV gate is therefore unmet. On the incomplete day, the existing Pinterest forest Pin has produced one active user, while Threads, LinkedIn and Facebook do not expose a directly usable logged-in WonderElian publishing identity. Instagram is already dense at 28 posts and has four followers.

The public `/best-sleep-sounds/` page compares seven real recordings and already exposes a 941 by 1672 portrait Window Rain image through Open Graph metadata. It has not received a dedicated Pinterest distribution record.

## Options considered

1. Save the existing comparison page as a Pinterest URL Pin. Selected because Pinterest is authenticated as the official WonderElian account, the destination and portrait image already exist, and Pinterest is a search-oriented surface with a direct outbound link.
2. Publish another Instagram post. Rejected because the official account already has dense same-day Yixiu publishing and only four followers.
3. Join Threads or log in to LinkedIn/Facebook. Rejected because Threads presents account creation, LinkedIn is logged out with non-WonderElian Google identities, and Facebook only offers a personal profile continuation.

## Publication design

- Account: WonderElian (`https://www.pinterest.com/wondereilan/`).
- Board: `Yixiu: Nature Sounds & Sleep`.
- Source page: `https://yixiu.wonderelian.com/best-sleep-sounds/`.
- Destination:

  `https://yixiu.wonderelian.com/best-sleep-sounds/?utm_source=pinterest&utm_medium=organic_url_pin&utm_campaign=sleep_sounds&utm_content=best_sleep_sounds_comparison_pin_01`

- Title: `Best Sleep Sounds: Rain, Ocean, Forest or White Noise?`
- Description:

  `Compare seven real sleep sounds at the same quiet volume: window rain, ocean waves, forest breeze, distant thunder, mountain wind, underwater white noise and waterfall. Free browser previews with no music, no talking, no account and no ads. Choose the texture that is easiest to leave alone.`

- Alt text: `Rain tracing a quiet window at night, used for Yixiu's comparison of seven real sleep sounds.`

## Verification

Require a permanent public Pin URL, the correct WonderElian author, the exact title and destination, and a public page or oEmbed readback. The destination must return HTTP 200. The publication check is not counted as a visitor. A fresh exact-hostname GA4 readback will look for the exact `pinterest / organic_url_pin / sleep_sounds / best_sleep_sounds_comparison_pin_01` row; absence remains `null`, not zero.

## Success boundary

The Pin is complete only when public evidence verifies the account, content and destination. The growth goal remains active until one completed Beijing natural day reaches at least 100 exact-hostname GA4 active users. Apple official evidence remains 10 first-time downloads and 4 redownloads through 2026-08-26; trials, paid conversions, subscriptions, in-app purchases and revenue remain `null` where official evidence is unavailable.
