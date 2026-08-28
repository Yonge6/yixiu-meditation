# TikTok Publication Recovery Design — 2026-08-29

## Context

TikTok Studio previously returned a submission receipt for Yixiu's 20-second mountain-wind video, but the official `@wonderelian1` public profile and authenticated Studio content list still expose only four older Style Atlas posts. The Yixiu video has no public URL and cannot be claimed as published.

The exact-hostname GA4 source history shows Product Hunt produced only limited referral traffic, while search has too little impression data for another defensible query-driven rewrite. A verified short-video publication therefore remains an unfilled distribution path.

## Options

### 1. Resubmit the verified Yixiu mountain-wind video — selected

Upload the same 1080 × 1920, 20-second H.264/AAC asset to the official `@wonderelian1` TikTok account. Use only Yixiu copy, a dedicated H5 attribution path, the self-promotion disclosure and the AI-content label. Require both Studio readback and a permanent public URL before claiming publication.

This repairs a failed distribution action without creating a duplicate public post, because the first submission never appeared in either authoritative surface.

### 2. Add another Product Hunt discussion

Product Hunt is already live and generated very limited launch distribution. Another discussion would add cadence but does not repair the missing short-video surface and is less likely to produce new reach.

### 3. Publish another SEO landing page

The site already has a broad set of indexed, internally linked intent pages. Search Console has not yet exposed enough query demand to justify another page in this window, and organic indexing is slower than restoring an already prepared social asset.

## Selected publication

- Account: `@wonderelian1`
- Asset: `yixiu-mountain-wind-sleep-short-10.mp4`
- SHA-256: `4d4c8f43e7fbaf96ca5c4f425023671bee091422ade825e3b811237c2eeefdca`
- Duration and format: 20 seconds, 1080 × 1920, H.264 video with AAC audio
- H5 destination:

  `https://yixiu.wonderelian.com/wind-sounds-for-sleeping/?utm_source=tiktok&utm_medium=organic_video&utm_campaign=sleep_sounds&utm_content=mountain_wind_sleep_tiktok_01`

Caption:

> Let the room end at the mountain air. Real mountain-wind sound from Yixiu — no music, no talking. Listen free: https://yixiu.wonderelian.com/wind-sounds-for-sleeping/?utm_source=tiktok&utm_medium=organic_video&utm_campaign=sleep_sounds&utm_content=mountain_wind_sleep_tiktok_01
>
> On iPhone, search “Yixiu: White Noise & Sleep” for a gentle timer and background playback.
>
> Visual created with generative AI. Sound is the real Yixiu mountain-wind recording.
>
> #WindSounds #SleepSounds #NatureSounds #NoMusic #Yixiu

## Boundaries and acceptance

- Visibility must be public and audience must remain everyone.
- Enable TikTok's AI-generated-content label and the self-promotion disclosure for Yixiu.
- Do not add a location, collaborator, unrelated product, music replacement or cross-post.
- The four pre-existing Style Atlas posts are not edited, deleted or used for Yixiu referrals.
- A submission toast alone is insufficient. Acceptance requires the authenticated Studio content list to show the Yixiu caption and the public profile to expose a permanent `/@wonderelian1/video/...` URL.
- The attributed H5 destination must return HTTP 200 and preserve the full UTM query.
- Publication creates an acquisition path only. Until GA4 exposes the matching source/campaign/content row, TikTok-attributed users and sessions remain `null`.
