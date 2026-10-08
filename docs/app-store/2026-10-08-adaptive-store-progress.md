# 2026-10-08 adaptive layout and App Store creative work

## Scope and baseline

User authorized Duo adaptation, simulator validation, Chinese/English Duo screenshots, header/search assets, and existing custom product page updates. Work starts from `origin/main` `c1967ec1777686b293dd1d54eff9e600b734a0eb`, isolated on `codex/yixiu-adaptive-store-20261008`. No other product or original worktree changed.

App Store Connect live readback: Yixiu `1461182261`, 1.18 (32), 可分发. No new binary uploaded or submitted by this work.

## Code: preliminary changes, NOT completed Duo certification

- Listen and Focus evaluate current container size, horizontal size class, minimum column width, and accessibility Dynamic Type before choosing columns.
- Large accessibility text retains one column. Existing AnyLayout and playback ownership remain intact.
- Added orientation-change UI regression asserting playback and current scene survive transitions. This test is authored but NOT run.
- `git diff --check`, Swift syntax parse, direct iOS SDK typecheck of YixiuTheme.swift passed.
- `swift test --package-path YixiuMeditation`: 16 tests in 4 suites passed.
- `node YixiuMeditation/Tests/home-interaction-regression.mjs`: passed.

## Toolchain blocker

This machine: macOS 26.5.2, Xcode 26.6 / iOS 26.5 SDK, no simulator runtimes. Full Xcode build reports iOS 26.5 platform not installed. An initial Firebase clone failure was bypassed using existing package cache; platform availability remains the blocker.

Apple Developer downloads live page lists Xcode 27.1 Release Candidate (2026-10-05), requires macOS Tahoe 26.6+ on Apple silicon. System upgrade/restart requires separate user approval; no upgrade or download was started. No Duo screenshots are represented as completed or simulated by stretching older screenshots.

Next validation after toolchain setup: Duo folded/unfolded widths, orientation, safe areas, all 3 tabs and drawers, accessibility text, active playback/scene preservation, Focus timer preservation, Free/Plus, sharing, Chinese/English. Capture native screenshots only after those checks pass.

## Creatives

Files in `qa/app-store/1.19/creative/` are marketing artwork, NOT Duo device screenshots:

- Header zh/en PNG: 3840 × 1646, no alpha.
- Search zh/en JPEG: 3840 × 2560, no alpha.
- Initial 1920 × 1280 search PNG uploads failed on Apple; keep local copies only as provenance, not approved assets.
- `sleep-header-preview.png` is an inconclusive loading-state capture, not visual acceptance evidence.

Created with built-in image generation using the existing Rain portrait as reference. Creative direction: photoreal rainy courtyard/eaves, mist and leaves, restrained teal palette, legible centrally protected typography, no fabricated UI/device mockups, prices, QR, badges, or URLs. English and Chinese are independently composed rather than overlaid translations.

Text specifications used:

| Asset | Brand | Headline | Supporting text |
| --- | --- | --- | --- |
| Header zh | 一休冥想 | 让自然，留在耳边。 | 休息、睡眠与静心 |
| Header en | YIXIU MEDITATION | Rest with nature. | Rest, Sleep & Calm |
| Search zh | 一休冥想 | 听雨，放慢呼吸。 | 自然声音 · 古典音乐 · 一分钟静心 |
| Search en | YIXIU MEDITATION | Listen to rain. Find your calm. | Nature sounds · Classical music · Mindful breathing |

Apple references:
- https://developer.apple.com/help/app-store-connect/reference/app-information/creative-assets-specifications
- https://developer.apple.com/app-store/asset-best-practices/

Confirmed processed assets submitted together; Apple confirmation: 已提交 4 个项目. Submission ID `eb476b0d-9353-415d-a083-e285ef30a8ec`. This is marketing asset submission, not a new App binary:
- Header zh `7a000005-717d-8f35-8000-5d0e7b5fcd85`
- Header en `8fc00005-717d-8f35-8004-e462a5ed1946`
- Search zh JPEG `c7000005-717d-8f35-8024-a9a8e52259ae`
- Search en JPEG `d2400005-717d-8f35-8029-65494e4d7f65` (library display name `yixiu-search-en.jpg (50)`)

English search JPEG first attempt failed; retry processed successfully and was included in the four-item submission. Failed upload remnants remain in the library and are not submitted. Existing approved screenshots have not been deleted. Main public store creative has not changed. Confirmation screenshot: `qa/app-store/1.19/creative/creative-submission-confirmed.png`.

## Custom product pages

Saved bilingual promotional text for the existing Sleep, Focus, Reset draft pages. No product page publication or approval claimed.

| Page | Resource ID |
| --- | --- |
| Sleep | 85115193-ab75-4322-b842-86321c0fe473 |
| Focus | 327038e4-48ff-46d2-969c-b750e49efbee |
| Reset | cf20159f-39df-4488-83d5-3f61377480b7 |

Sleep zh: 让雨声、海浪与夜潮陪你慢慢放松。免费聆听多种自然声，支持 5、15、30 分钟定时；Plus 可选 60 分钟与不限时。开启后台播放，锁屏后也能继续听。无需账号，没有广告。

Sleep en: Wind down with rain and ocean sounds. Free 5, 15 and 30-minute timers; Plus adds 60 minutes and unlimited listening. Background playback. No account or ads.

Focus zh: 给阅读与工作留一段安静。溪流、鸟鸣、雨声与古典音乐，按场景切换，支持定时和后台播放。免费试听多种声音；Plus 解锁完整声音库。无需账号，没有广告。

Focus en: Make room for focus with streams, birds, rain and classical music. Timers and background playback. Try free sounds; Plus unlocks the full library. No ads.

Reset zh: 忙碌之间，留一分钟给自己。免费跟随呼吸节奏静心，让当前自然声温柔陪伴；Plus 可选 3、5、10 分钟。完成后留下轻量练习记录。无需账号，也没有连续打卡压力。

Reset en: Pause for a free minute of guided breathing with your chosen sound. Plus offers 3, 5 and 10 minutes. Keep a simple practice record, without streaks or an account.

## Remaining

Obtain upgrade decision; provision compatible Xcode/runtime; full build and UI QA; native Duo zh/en capture; after creative approval validate store previews and CPP screenshots and submit CPP updates. Do not equate saved drafts or asset submissions with approved or publicly live content.
