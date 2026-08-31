# Yixiu English default and Sounds header language control

## Goal

Make English the first-launch interface language and move language switching from the Yixiu wordmark into an explicit control in the Sounds player header.

## Behavior

`AppState.language` starts as `.en` when the app has no saved language. A user's prior explicit choice still restores from `UserDefaults`; the change does not overwrite an existing preference. This makes English the default for new installs while preserving continuity for current users.

The wordmark becomes non-interactive brand content. A separate 44-point language button sits in the top-right action group immediately before Share. It shows the language available after tapping—`中` in English mode and `EN` in Chinese mode—and announces “Switch to Chinese” or “切换到英文” to VoiceOver. Its deep-water glass treatment matches Share and the premium gem badge, while the text remains visually distinct from both icons.

## Acceptance

- A clean install opens with English as the primary language.
- The language button is to the left of Share on the Sounds tab and changes the complete interface immediately.
- The Yixiu wordmark no longer changes language when tapped.
- A previously saved Chinese or English preference still restores after relaunch.
- The two 44-point actions fit without colliding with the wordmark on the supported iPhone layout.
