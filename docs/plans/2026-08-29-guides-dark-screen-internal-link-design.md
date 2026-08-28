# Guides Dark-Screen Internal-Link Design

Date: 2026-08-29

## Objective

Use the already indexed `/guides/` hub to describe and link to the existing rain dark-screen player more precisely. Improve discovery without creating a duplicate landing page, changing playback behavior or touching another product.

## Evidence and decision

External search currently exposes the Yixiu Guides hub and an older Sleep Sounds title, while the production `/sleep-sounds/` source already has the truthful dark-screen title, H1, timer, FAQ and player behavior. Rewriting the destination again would create unnecessary crawl churn.

Three approaches were considered:

1. Update one Guides card and its matching `ItemList` name. Selected because it strengthens an existing indexed internal path and keeps visible copy and structured data aligned.
2. Create another dark-screen landing page. Rejected as a near-duplicate of `/sleep-sounds/`.
3. Add new timer durations or fade behavior. Rejected because current evidence is about acquisition wording, not a missing player feature.

## Change

- Keep the Guides title, canonical, H1, hierarchy and all 20 destinations unchanged.
- Add `dark-screen rain` to the Guides meta description.
- Rename only the first structured-data item and visible Bedtime card to `Rain sounds with a dark screen`.
- State the existing, exact behavior: real window rain, free 15/30/60-minute timer, and darkening the open page.
- Preserve the separate iPhone lock-screen guide so browser dark-screen mode is not confused with physical device locking.

## Verification

- Assert that visible card copy and the first `ItemList` name match the new intent.
- Run runtime integrity, site tests, build and mobile browser QA.
- Deploy only after the production bundle and rollback path pass existing release checks.
- Require public HTTP, canonical, visible-copy and structured-data readback, then request one Google recrawl for `/guides/`.

Search recrawl, impressions, clicks and H5 active users remain separate evidence gates. The long-term goal still requires at least 100 exact-hostname active users on a completed Beijing natural day.
