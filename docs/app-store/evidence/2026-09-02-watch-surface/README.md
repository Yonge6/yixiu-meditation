# Yixiu Smart Stack and Controls QA

Date: 2026-09-02 (Asia/Shanghai)

## Test environment

- Paired iPhone simulator: `Yixiu QA iPhone`, iOS 26.5
- Paired Apple Watch simulator: `Yixiu QA Watch`, Apple Watch Series 11 (46 mm), watchOS 26.5
- Pair state: active and connected
- App: `com.health.yixiu`
- Widget extension: `com.health.yixiu.YixiuQuietWidget`

## Acceptance evidence

- The iPhone build embeds `YixiuQuietWidget.appex` and declares Live Activity support.
- The one-minute activity appears in the iPhone Dynamic Island with the Yixiu water-wave mark and a live countdown (`iphone-dynamic-island-active.png`).
- The same activity appears in the Apple Watch Smart Stack in the system-requested `small` family (`watch-smart-stack.png`).
- watchOS `chronod` reported a successful remote activity render for `QuietMinuteActivityAttributes` and family `small`.
- watchOS registered the remote control descriptor `com.health.yixiu.one-minute-pause` with display name `One-Minute Pause` / `一分钟安静`, `enabled = YES`, preferred size `1x1`, and action `ToggleQuietMinuteIntent`.
- The control and Live Activity use the paired iPhone app; this release does not add a standalone watchOS app.
- The activity counts down for 60 seconds and becomes complete/stale. The user can also end it immediately from the control or the Live Activity.

## Automated checks

- `swift test`: four tests passed, including boundary cases for the 4-second inhale, 2-second hold, 6-second exhale rhythm and the 60-second completion boundary.
- Debug iOS Simulator build: passed.
- Release iOS Simulator build: passed.

## Screenshots

- `iphone-app-launched.png`: Yixiu app installed and launched in the paired iPhone simulator.
- `iphone-dynamic-island-active.png`: active one-minute Live Activity in Dynamic Island.
- `watch-smart-stack.png`: Yixiu one-minute Live Activity in Apple Watch Smart Stack.
- `watch-after-start.png`: paired Apple Watch simulator state after starting the activity.
