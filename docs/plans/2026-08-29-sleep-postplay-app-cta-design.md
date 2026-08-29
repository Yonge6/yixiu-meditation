# Sleep Post-Play App CTA Design — 2026-08-29

## Evidence and decision

The official exact-hostname GA4 report for 2026-08-22 through 2026-08-29 shows `/sleep-sounds/` as the highest-volume named landing: 18 landing users, 9 playback users and no `yixiu_download_click` user. Other pages already produced three App Store click users in total. The sleep page therefore needs a clearer transition from a successful web preview to the iPhone app, not another acquisition page.

Three approaches were compared. First, changing only the generic `Get Yixiu for iPhone` label would improve specificity but would leave the post-play message below the timer and outside the listener's current viewport. Second, a modal or fixed bottom sheet would guarantee visibility but would interrupt a quiet sleep interaction and create dismissal/accessibility work. Third, move the existing post-play panel directly after the action row, state the physical-lock-screen benefit, and minimally scroll it into view only when the listener starts playback. The third approach is selected.

The first-screen App Store action becomes `Keep rain playing on iPhone`. After playback starts, an opt-in status panel says `Want to lock your iPhone without stopping the rain? Continue in Yixiu.` It preserves the official Sleep custom product page, Partner Token, campaign token and existing `yixiu_download_click` event. A page-only data attribute enables `scrollIntoView({ block: "nearest" })`; all other Yixiu intent pages retain their current behavior.

Acceptance requires a failing-then-passing 390×844 Playwright test proving the panel becomes visible inside the viewport, correct accessible copy and unchanged App Store attribution. Full runtime, static-site and production builds must pass. Production acceptance requires exact source/bundle hashes and live mobile behavior. A click or download is not claimed until GA4 or Apple exposes official evidence; unavailable outcomes remain `null`.
