# Focus to Mountain Stream conversion path

## Evidence

For `yixiu.wonderelian.com` from 2026-08-22 through 2026-08-29, the GA4 Data API reports:

- `/focus-sounds`: 10 active users, 9 landing-view users, and no playback or download event row.
- `/mountain-stream-sounds-for-focus`: 11 active users, 2 playback users, and 3 users with 9 App Store click events.

The existing Focus page links to Mountain Stream only in its long footer navigation.

## Options considered

1. Add a prominent, attributed internal path near the Focus hero. This preserves both pages' search intent and sends existing Focus traffic to a verified conversion surface.
2. Replace the Focus hero with the Mountain Stream video. This is more invasive and duplicates the dedicated watch page.
3. Add another comparison landing. This expands inventory but is slower to index and risks overlapping existing focus intent.

## Decision

Use option 1. Reuse the existing `intent-comparison-visual` component directly after the Focus hero. Link to the canonical Mountain Stream page without UTM parameters and record `yixiu_focus_path_click` with placement `focus_landing_mountain_stream_path`.

## Acceptance

- The link is visible at 390 px and does not create horizontal overflow.
- The destination is `/mountain-stream-sounds-for-focus/`.
- The analytics event and placement are present.
- Existing preview, App Store path, metadata, FAQ, and related links remain unchanged.
