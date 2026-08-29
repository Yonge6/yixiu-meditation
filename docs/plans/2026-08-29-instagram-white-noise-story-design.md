# Instagram White Noise Story Design — 2026-08-29

## Decision

Share the already-public WonderElian white-noise Reel to the same account's Instagram Story and add one direct, clickable Yixiu link. The destination is the existing underwater white-noise landing page, with a Story-specific attribution value:

`https://yixiu.wonderelian.com/underwater-white-noise-for-sleep/?utm_source=instagram&utm_medium=organic_story&utm_campaign=sleep_sounds&utm_content=underwater_white_noise_black_screen_story_01`

The Story should use the existing Reel rather than uploading another video. Its only added message is a concise call to action such as `Try White Noise` on the link sticker. The Story must not mention another WonderElian product, make health claims, imply rankings, or claim visits or downloads.

## Alternatives considered

1. A Threads text post would provide a clickable link, but the desktop session requires joining Threads and accepting platform terms. Account creation is outside the current authorization, so this option is rejected.
2. A second Instagram Feed post could repeat the destination, but it would crowd the profile minutes after the Reel and add little new reach. This option is rejected.
3. Waiting would avoid another surface, but it would leave the Reel dependent on a non-clickable caption and the extra-step profile chooser. A Story link is the smallest useful distribution improvement.

## Acceptance and evidence boundary

Use desktop Chrome only. Publish only if Instagram's web interface exposes the existing Reel share flow, Story destination, and link sticker without requesting a phone. Acceptance requires the Story to be visible from the correct `wonderelian` account and the attributed H5 URL to return HTTP 200. A later GA4 report must expose the exact Story UTM content before any H5 visit is attributed. Story publication is not evidence of UV, App downloads, trials, subscriptions, payments, in-app purchases, or revenue; unavailable values remain `null`.
