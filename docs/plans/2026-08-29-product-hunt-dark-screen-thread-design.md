# Product Hunt Dark-Screen Thread Design — 2026-08-29

## Context

The Yixiu Product Hunt launch and product forum are public, owned surfaces under the authenticated `WonderElian` maker account. Product Hunt has already produced an exact-hostname referral session, while the attempted TikTok publication recovery again returned a submission receipt without adding a fifth Studio item or public profile URL.

The newly shipped browser dark-screen timer is a concrete product update that has not yet been discussed in the Yixiu Product Hunt forum. A useful maker thread can expose the feature, invite product feedback and create a distinct H5 attribution path without referring through any unrelated product.

## Options

### 1. Publish a focused Yixiu product-feedback thread — selected

Explain the real behavior in four short steps, distinguish browser dark-screen mode from physical iPhone lock-screen playback, link directly to the live Window Rain player and ask one specific end-of-timer question. This adds value to the product forum rather than repeating the launch pitch.

### 2. Reply to the existing reset thread

This would keep the forum count unchanged, but the existing discussion is about sound, timers and breathing generally. Adding a dark-screen product update there would dilute the original question and make the new intent harder to discover.

### 3. Edit the launch description

The launch description accurately describes the iPhone app and its 14 soundscapes. Browser dark-screen behavior is a web update, so inserting it into the launch's App-oriented description could blur platform boundaries.

## Selected thread

Title:

`I added a dark-screen timer for rain sounds — what should happen when it ends?`

Body:

> I shipped a small browser feature in Yixiu because a bright player at bedtime defeats the point.
>
> 1. Start the real Window Rain recording.
> 2. Choose 15, 30, or 60 minutes.
> 3. Tap Darken Screen.
> 4. The open browser page turns black while the sound and timer keep running.
>
> This is browser dark-screen mode, not physical iPhone lock-screen playback; the iPhone app is the path for background playback.
>
> Try the live player: https://yixiu.wonderelian.com/sleep-sounds/?utm_source=producthunt&utm_medium=community_thread&utm_campaign=sleep_sounds&utm_content=dark_screen_timer_thread_01
>
> If you use audio to sleep, what should happen when the timer ends: keep the screen black, return to the player, or something else?

## Acceptance and measurement

- Publish only in the official `p/yixiu` product forum under `WonderElian`.
- Require a permanent public Product Hunt thread URL and exact title/body readback.
- Require the attributed Yixiu H5 destination to return HTTP 200 with its UTM query intact.
- Do not ask for upvotes, claim health outcomes, mention another product or edit the existing launch/thread.
- Product Hunt-attributed traffic remains unobserved until GA4 exposes the exact `producthunt / community_thread / sleep_sounds / dark_screen_timer_thread_01` row.
