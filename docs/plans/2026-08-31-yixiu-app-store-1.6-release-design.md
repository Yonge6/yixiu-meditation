# Yixiu App Store 1.6 Release

## Release identity

- Marketing version: 1.6
- Build: 18
- Bundle identifier: `com.health.yixiu`
- App Store app ID: `1461182261`
- Release mode: manual after approval
- Screenshot source: real iOS 26.5 simulator captures composited over original, text-free water artwork generated in the user's logged-in Chrome ChatGPT session

The App Store build must be a normal Release archive. `YIXIU_INTERNAL_PLUS` must never be present in the archive or uploaded binary.

## Product story

Version 1.6 presents Yixiu as a calm, bilingual sound space rather than a generic utility. The release story is visual clarity: brighter meditation scenes, a visible star trail for Quiet Orbit, a refined Plus gemstone that is clearly different from Free, English as the clean-install default, a language switch beside Share, and the native iOS tab bar.

No screenshot or metadata will claim treatment, guaranteed sleep, guaranteed focus, ratings, downloads, conversion, or subscription outcomes.

## Screenshot set

Create five portrait screenshots at 1290 × 2796 with no alpha channel. Each uses a real current-app screenshot inside a deterministic rounded frame. ChatGPT artwork remains decorative background only.

1. Sounds — `Press play. Let the day soften.` / `Nature soundscapes for sleep, focus, and reading`
2. Meditation library — `Twenty-four ways to pause.` / `14 nature sounds + 10 meditation tracks`
3. Focus — `One minute is enough to begin.` / `Water Breathing with 1, 3, 5, or 10 minute sessions`
4. Bright Plus scenes — `Light, color, and room to breathe.` / `Long sessions and 88-second resets in one library`
5. My Yixiu — `Keep your own rhythm.` / `Favorites, timers, background playback, and bilingual controls`

Prepare matching English (United States) and Simplified Chinese sets. English is the primary visual set.

## What's New

### English

- A native iOS tab bar with the latest system design
- Brighter artwork for Still Water, Open Meadow, Oasis Rest, Sunlit Shore, and Ocean Passage
- A visible star trail for Quiet Orbit
- A refined Plus gemstone badge, clearly distinct from Free
- English by default on new installs, with the language switch beside Share

### Simplified Chinese

- 采用最新系统设计的原生 iOS 底部导航
- 重新绘制静水、原野舒展、绿洲停歇、日光浅岸与海上行旅，画面更加明亮
- 静默星轨新增清晰可见的星轨
- 重新设计一休 Plus 宝石徽章，与 FREE 明确区分
- 新安装默认英文，并将中英切换移到分享按钮左侧

## Review notes

Tell App Review that the app requires no account, contains no ads or user-generated content, uses Apple in-app purchase only, and is not medical treatment. Provide a direct path to Sounds, Meditation in the Sound Library, Focus, My Yixiu, the Plus paywall, Restore Purchases, and Audio Sources. Mention that the submitted Release build does not include the internal Plus preview compilation condition.

## Acceptance

- Debug simulator and unsigned Release builds pass.
- The archive reports version 1.6 build 18 and contains no internal preview text or compilation flag.
- Five English and five Simplified Chinese screenshots are 1290 × 2796 PNG, opaque, visually inspected, and show the current app.
- App Store Connect links build 18, saves both localizations, accepts all screenshots, retains correct support/privacy URLs, and uses manual release.
- The final submission includes the app version and any required subscription items, then reaches Apple's official Waiting for Review state.
