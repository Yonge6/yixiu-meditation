# Native Yixiu brand lockup

Apply the user-approved Web brand combination to the native Sounds header: actual App icon, 一休冥想 / 休息、睡眠与静心, or Yixiu Meditation / Rest, Sleep & Calm.

Prefer a leading icon and two-line wordmark over a text-only or centered brand: this matches the approved website while preserving native trailing language/share actions. Use current native theme fonts/colors, a 40-point icon and a horizontal fit layout. On narrow screens or large text, stack actions below rather than truncate the name. Retain all scene gestures, lower player controls, membership and native tabs. No download banner inside the App.

Implementation: add an exact normal image-set copy of the App icon; update only header presentation; add source and simulator regression checks for bilingual brand, image availability and button access. Build and inspect simulator screenshots. No device install or App Store submission requested in this turn.

## Follow-up: Buer related-work card

User requested replacing the old Human Design domain and copy. Read the live Chinese and English homepage at https://buer.wonderelian.com/ on October 2: 不二见己 / Buer Within, 与真实的自己 · 温柔相遇 / Meet your true self, Doudoulong AI growth companion, conversations and growth profiles. Updated only Yixiu's H5 and native related-work cards with that domain and positioning. No changes to Buer or other products.

## Verification

- Native brand asset byte-equals the App icon; source guards and existing home/Focus structural guards pass.
- Xcode simulator build succeeds. Final XCTest run: bilingual brand/action checks and portrait lower-controls/left-right/upward gesture checks both pass (2/2). Initially the gesture test failed while baseline passed; constraining the adaptive header to its intrinsic vertical size restored the original gesture canvas. Result: `/tmp/yixiu-native-brand-final-20261002.xcresult`.
- Final English/Chinese screenshots inspected; icon renders and trailing actions remain separate.
- H5 production build and protected runtime check pass, Sites 45/45 plus banner/related-work tests 3/3 pass.
- H5 browser readback verifies both localized Buer copies and the exact new domain. At 390px width the card is 352px, with no horizontal document overflow. Preview runs on port 4208.
- Local code/preview only: not deployed, installed on a physical phone, or submitted to App Store.
