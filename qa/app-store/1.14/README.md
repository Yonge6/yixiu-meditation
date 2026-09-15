# App Store 1.14 posters

Upload only the three numbered PNGs in each device-locale subdirectory of `posters/`.

Order: 01 Nature / 02 Classical / 03 Focus.

- iPhone: 1320 × 2868
- iPad: 2064 × 2752
- Simplified Chinese and English (US)
- Actual 1.14 Release UI, normal Free entitlement, no internal Plus
- Nature claim: 14 total / 10 Free
- Classical claim: 10 total / 5 Free

`capture.cjs` records the source images in `raw/`; simulator IDs are specific to this capture session. `render-posters.cjs` uses deterministic HTML/CSS to preserve UI pixels and typeset poster copy. Runtime and Chromium paths can be adapted to the local tooling.

The first flat PNG draft files directly under `posters/` are not deliverables; they are excluded from version control because some captured a transient system prompt. Only the four named device-locale directories are accepted.
