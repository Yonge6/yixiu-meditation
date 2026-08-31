# YouTube sleep-comparison channel-path repair — design

## Context

The scheduled WonderElian Community post for Yixiu's seven-sound comparison became public at its intended `2026-08-31 09:00` GMT+8 slot. Public HTML and the authenticated DOM preserved the intended H5 UTM and Apple campaign URL, but both external URLs rendered as text rather than links. YouTube continued to offer one-time verification for clickable external links. That verification requires identity material the agent must not provide.

Server access-log aggregation did not show a public-post acquisition result. The exact `community_sleep_sound_comparison_05` value appeared ten times during internal schedule checks on 2026-08-29 and once during the 2026-08-31 11:52 production acceptance request. No additional post-publication hit was proven. These logs are directional diagnostics only and do not replace complete-day GA4.

## Options

1. **Edit the existing post with a channel-profile path.** Tell mobile viewers to tap the linked WonderElian author above the post and then tap the existing `yixiu.wonderelian.com` channel link. This preserves the permanent post, daily cadence, H5 and Apple attribution strings, and creates a path composed only of already public clickable YouTube elements.
2. Publish a second image or QR Community post. This would create same-day duplication, impose QR friction on mobile viewers and split measurement.
3. Leave the post unchanged. This preserves the schedule but knowingly leaves the conversion path dependent on copying a long URL.

Option 1 is selected. It is the smallest truthful repair and does not require a new video, a duplicate post, deletion, identity verification, another product or a new account. The exact inserted line is:

> On mobile, tap WonderElian above, then tap Yixiu in the channel links.

## Acceptance

- The permanent post URL remains HTTP 200 and keeps the same WonderElian author, full sleep-comparison copy, H5 UTM, Apple campaign and hashtags.
- Authenticated DOM shows the new sentence and the post as modified.
- Logged-out HTML contains the new sentence and both attribution tokens.
- The linked channel homepage exposes a clickable `yixiu.wonderelian.com` link with the existing official-profile UTM.
- No new video or duplicate post is created, and no sensitive verification is attempted.
- Visits and downloads remain `null` until authoritative attribution appears.

