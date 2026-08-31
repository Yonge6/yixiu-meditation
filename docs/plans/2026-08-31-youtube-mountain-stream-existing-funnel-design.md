# YouTube Mountain Stream existing-video funnel — design

## Decision evidence

The exact-hostname GA4 report for 2026-08-01 through 2026-08-30 ranks authorized attributable channels as YouTube first and Instagram second. YouTube contributed 16 active users from `organic_video`, 8 from `organic_comment`, 7 from `organic_social`, one from `organic_description` and one from `organic_profile`. Pinterest contributed two active users across its two source rows.

YouTube Studio's current 48-hour report shows 24 channel views. The public Yixiu video `lfDiI0TAq1c`, **Mountain Stream Sounds for Focus — 15 Minutes, No Music, No Talking**, contributes 10 of them, ahead of Rain Sounds at four and Mountain Wind at three. The unrelated Graphic Brutalism video leads the 28-day channel report but is explicitly out of scope and will not be changed or used for Yixiu referral.

The Mountain Stream video already has one WonderElian comment with a clickable attributed H5 link. Its description begins with two generic sentences, so the public collapsed description hides the continuation path after an ellipsis. Its comment and description App Store URLs contain the Focus custom-product-page identifier but omit provider and campaign tokens.

## Options

1. **Edit the existing description and owner comment in place. Selected.** Put a truthful continuation instruction in the collapsed description, keep the clickable comment as the direct path, and add Apple campaign tokens. This acts on the most active current Yixiu video without a new upload or duplicate comment.
2. Publish another YouTube Community post. Two different Community posts have already published within the current 24-hour period, their inline URLs are not clickable, and recent content rows have produced roughly one user each.
3. Publish another Pinterest or Instagram asset. A new Window Rain Pin and Reel are already live today; another immediate asset would duplicate cadence while the strongest real-time YouTube video still has a visible first-fold funnel gap.

## Public changes

The video title, media, thumbnail, visibility, AI disclosure, audience, playlist, cards, end screen and related content remain unchanged.

The description will open with:

> Keep this stream going free in Yixiu: open the WonderElian comment below, or tap WonderElian above and then Yixiu in the channel links.

The existing attributed Mountain Stream URL follows immediately. The original purpose, visual/audio disclosure and hashtags remain below. The App Store URL keeps Focus custom product page `7890afd3-dd12-4215-a5c5-17f4ebc28759` and adds provider `120014121`, campaign `yixiu_yt_stream_description_20260831` and media type `8`.

The single existing WonderElian comment keeps its permanent comment ID and H5 attribution `mountain_stream_focus_15min_01_comment`. Its opening becomes a continuation prompt for current viewers, and its App Store URL adds campaign `yixiu_yt_stream_comment_20260831` with the same provider, media type and custom product page. The creator heart will be restored if editing removes it.

## Acceptance

- YouTube Studio must return a saved state for the description.
- The original comment ID must remain unchanged and the public page must mark it edited.
- Authenticated public DOM must expose the new first-fold instruction, exact H5 destinations, Apple campaign tokens, WonderElian author and creator heart.
- Logged-out HTTP/HTML must return 200 with the video ID, title and new campaign tokens.
- Both Yixiu H5 destinations and official App Store URLs must resolve without inferring visits or downloads.
- No advanced-feature verification, identity material, phone flow, new upload, pin attempt or unrelated channel content is allowed.
