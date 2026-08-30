# First Breath Instagram Reel publication proof — 2026-08-30

## Creative receipt

- Source image: `yixiu-prototype/public/assets/yixiu/meditation/first-breath.jpg`
- Source audio: `yixiu-prototype/public/assets/yixiu/audio/meditation/first-breath.m4a`
- Output: `/tmp/yixiu-first-breath-reel-20260830.mp4`
- Output SHA-256: `25900d7ea575968752a61086c6ffeb43bea3b4af0943de438101f6ca097653b6`
- Format: 1080 × 1920, 15 seconds, 30 fps, H.264 High / AAC stereo, fast-start MP4
- Audio: the opening 15 seconds of the shipped `First Breath` track, with short fade-in and fade-out
- Visual: the existing First Breath music artwork, with a restrained zoom and three safe-area text states: `ONE QUIET MINUTE`, `BREATHE WITH FIRST BREATH`, and `LISTEN FREE ON YIXIU`

The rendered file decoded successfully from start to finish. A contact sheet at approximately 1, 6 and 13 seconds was visually inspected and confirmed legible text, correct 9:16 framing and no unintended crop. The source music is by Yanni Ziangos a.k.a. YannZ under CC BY 4.0; the public caption includes the creator, license and license URL.

## Publication receipt

- Account: WonderElian (`@wondereilan`)
- Public Reel: https://www.instagram.com/wonderelian/reel/DcpOEp7w-bf/
- Published at approximately 08:26 GMT+8 on 2026-08-30
- Public-profile post count after publication: `29`
- AI disclosure: enabled before publication; public Reel DOM shows `AI 内容`
- Accessibility: custom alternative text was supplied for the scene and all three on-video text states

Instagram displayed `Reels 已分享` and `你的 Reels 已分享。`. The permanent URL was then read back in the authenticated desktop Chrome session. The public DOM confirmed:

- publisher `wonderelian`;
- the complete caption and CC BY 4.0 attribution;
- hashtags `#MeditationMusic`, `#MindfulBreak`, `#BreathingExercise`, and `#Yixiu`;
- the `AI 内容` label;
- an Instagram audio page for the uploaded audio;
- the new Reel as the first item on the public profile grid.

The permanent Reel returned HTTP `200`. This proves publication and page availability, not a view, H5 visit, App Store click or download.

## Profile funnel correction

The previous public profile bio only described white noise and told visitors to choose White noise. That was too narrow for the new meditation Reel. It was changed to:

```text
Nature sounds + free short meditation. Tap Yixiu below, then choose First Breath or a sound. No account. No ads. iPhone available.
```

The existing Yixiu website link was retained. Instagram's desktop editor explicitly disables website-link editing and says that links can only be edited on mobile. No phone was used and no restriction was bypassed. The public profile readback showed the new bio and the unchanged Yixiu link. Its attributed destination remained:

https://yixiu.wonderelian.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio

That destination returned HTTP `200` and retained `analytics.js`, App Store ID `1461182261`, and the App Store download CTA. Because the existing profile link is shared by all Instagram content, future traffic through it can be identified as Instagram profile traffic but cannot be claimed as uniquely caused by this Reel.

## Metric boundary

The latest authoritative completed Beijing day remains `2026-08-29`: `21` exact-host active users, `42` page views and `32` sessions. The `100`-UV gate remains unmet with a latest verified shortfall of `79` UV.

The retained official App Store Connect evidence remains `10` first-time downloads and `4` redownloads through `2026-08-28`. Trials, paid users, subscriptions, in-app purchases, revenue, Reel-attributed visits and Reel-attributed downloads remain `null` without authoritative evidence.

No Maker, OneLaser, Wendao, Style Atlas or other product was changed or used for referral traffic.

## Duplicate guard

Do not upload this same First Breath video as a new Instagram Reel again. Future First Breath distribution must use a materially different creative or a different format and must obtain a new permanent URL before it is recorded as published.
