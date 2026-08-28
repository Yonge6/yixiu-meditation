# Yixiu YouTube Owner Comment Expansion Design

Date: 2026-08-29

## Objective

Turn existing WonderElian YouTube discovery into measurable visits to matching Yixiu H5 sessions without uploading a new video, touching another product, or making unsupported performance claims.

## Current evidence

The exact-hostname GA4 Data API report for 2026-08-22 through 2026-08-28 shows `youtube / organic_video` with 16 active users and `youtube / organic_comment` with 6 active users. These are the strongest currently authorized attributable sources after direct traffic. The existing Mountain Wind owner comment is the only documented `organic_comment` path.

YouTube Studio currently shows four additional public Yixiu videos with relevant live inventory:

- `qhiCegeDFUQ` — Rain on Window for Sleep — 15 views.
- `oZFW__xNWJI` — Ocean Waves for Focus — 22 views.
- `lfDiI0TAq1c` — Mountain Stream Sounds for Focus, 15 minutes — 13 views and 2 views in the latest 48 hours.
- `8LJoPKN3CO4` — Rain Sounds for Sleep, 15 minutes — 12 views and 3 views in the latest 48 hours.

## Options considered

1. Expand channel-owner comment links on the four existing Yixiu videos. This is the recommended option because it reuses the strongest measured channel, creates immediate link paths, and requires no new upload.
2. Rewrite the Waterfall Google snippet. Search Console shows four impressions for that page but no query rows or clicks, so a CTR rewrite would be weakly evidenced and slow to evaluate.
3. Publish another Pinterest asset. Pinterest has produced only one active user in the current completed-period source table, so another immediate Pin is lower leverage than expanding the proven YouTube path.

## Publication design

Each comment will:

- open with a useful continuation prompt that matches the video's intent;
- link to the closest existing Yixiu landing page with a unique `youtube / organic_comment` UTM;
- state only true product properties: free web listening, no account, no ads, and the iPhone app's timer/background-playback value;
- avoid cross-product links, health claims, fake urgency, engagement bait and unverified performance claims.

Mappings:

| Video | Landing page | Campaign | Content |
| --- | --- | --- | --- |
| Rain Window Short | `/rain-sounds-when-iphone-locked/` | `sleep_sounds` | `rain_window_short_comment_01` |
| Ocean Focus Short | `/ocean-waves-for-focus/` | `focus_sounds` | `ocean_focus_short_comment_01` |
| Mountain Stream 15 min | `/mountain-stream-sounds-for-focus/` | `focus_sounds` | `mountain_stream_15min_comment_01` |
| Rain Sleep 15 min | `/sleep-sounds/` | `sleep_sounds` | `rain_sleep_15min_comment_01` |

## Verification

Before posting, inspect the public comment section for an equivalent existing WonderElian link and skip duplicates. After posting, require a permanent comment URL and authenticated public DOM readback for the WonderElian author, exact text and preserved destination attribution. Then verify each permanent URL and each destination returns HTTP 200 without counting these checks as UV. Record a fresh exact-hostname GA4 snapshot; absent rows and non-completed-day values remain non-results.

## Success boundary

This release succeeds as a publication only when the four non-duplicate owner comments are public and externally verified. The long-term goal remains incomplete until a completed Beijing natural day reaches at least 100 exact-hostname active users and Apple official data continues to prove downloads. Unknown trial, paid, subscription, in-app-purchase and revenue values remain `null`.
