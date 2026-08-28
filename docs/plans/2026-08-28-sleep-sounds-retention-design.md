# Yixiu Sleep Sounds Retention Experiment

## Decision

Improve the existing `/sleep-sounds/` landing instead of creating another rain-sleep URL. The page is already indexed for the intended query, received five landing sessions in the August 28 partial-day GA4 readback, and has aligned metadata, FAQ content, a real one-tap recording, and an attributed App Store path. A second near-duplicate page would split authority and create keyword cannibalization.

Three approaches were considered. Image compression alone is low risk but does not materially deepen the listening experience. A new long-tail page adds crawl surface but duplicates the established intent. The selected approach combines a compressed hero image with an optional 15, 30, or 60-minute browser preview timer on the existing page. This directly addresses the two clearest gaps from the audit: the 764,758-byte PNG used as the first visual and competitor pages that answer the same query with an on-page timer.

## Interaction and data flow

The page will serve a WebP hero through `<picture>` while retaining the PNG fallback and social image. Explicit dimensions and high fetch priority keep layout and discovery metadata stable. A compact timer group sits below the primary actions. Thirty minutes is selected by default; choosing another duration updates the accessible status text. Starting Window Rain starts the selected countdown. Pausing resets the countdown, and reaching zero pauses the recording and reports completion. The existing App Store actions, Apple campaign parameters, post-preview CTA, share loop, and all other intent pages remain unchanged.

The shared discovery script will activate timer behavior only when timer markup exists, so no unrelated route changes behavior. Tests will cover image compression, metadata alignment, timer selection, countdown reset, App Store attribution, mobile overflow, protected-runtime integrity, the static-site suite, and a production hash/readback after deployment.

## Production evidence

- The hero WebP is 80,354 bytes, down from the 764,758-byte PNG while preserving the PNG fallback.
- Protected runtime checks passed for 28 files; the production build passed; static-site tests passed 27/27; Playwright passed 40/40; the focused timer funnel passed 2/2.
- A 390-by-844 visual inspection found no horizontal overflow.
- Production acceptance confirmed that selecting 15 minutes changes the status to 15:00, playback changes the control to Pause Window Rain, the timer reaches 14:58 after about two seconds, and the post-preview App Store CTA retains `ppid`, `pt`, `ct`, and `mt` attribution parameters.
- The 2026-08-28 partial-day GA4 readback at 12:05 China Standard Time reported 10 active users, 13 page views, and 13 sessions. This is not a completed natural day and is not evidence of the 100-UV completion gate.
- The latest completed natural day, 2026-08-27, recorded 14 active users, 20 page views, and 15 sessions. The 100-UV gate remains unmet.
