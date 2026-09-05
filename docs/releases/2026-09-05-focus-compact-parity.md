# Focus compact layout, scrolling and membership parity

## Approved scope

- User reported tablet browser overlap and portrait scroll failure, then approved moving three compact shortcuts below the breathing practice in both H5 and App, with consistent membership settings.
- Plan: `docs/plans/2026-09-05-focus-compact-parity.md`.
- Continue the existing isolated daily-practice worktree; preserve other worktrees and unrelated products.

## Implementation

- Breathing is the primary content. Three 84px-minimum equal-width shortcut cards follow the safety note, with 12px gaps, play icons, short bilingual labels and durations. No large photographs; running/paused breathing hides shortcuts.
- Tablet Focus used a fixed-height flex column whose default shrink compressed the orbit to 0px; absolutely positioned circles then painted over settings/text. Nonshrinking children now retain geometry and create true vertical overflow. Dynamic viewport height and touch scrolling preserve access to controls above the fixed navigation.
- H5 free policy now matches native free access: seven free sounds, one-minute breathing, 5/15/30-minute listening. Longer choices remain visible with locks and open membership details. Selection/start/replay checks and normalized old local timer settings prevent accidental entitlement inference. Existing journal records are preserved.
- Me includes an explicit free membership entry. H5 accurately states that Apple subscription synchronization is unavailable and directs existing/legacy members to restore purchases in the App. No subscription status, prices or Apple conversions are invented.
- Native StoreKit/legacy/internal-preview policy is unchanged. Plus benefit copy now correctly includes 3/5/10-minute breathing. Native Focus has the matching compact lower row.
- Membership details scroll on short portrait screens; the Focus nature-sound icon now uses the intended aqua stroke.

## Validation

- Before the scroll fix: 6 of 8 Chromium/WebKit geometry regressions failed; every tested tablet orbit measured 0px. Before compact/policy changes: all 10 new tests failed for the expected old layout/access behavior.
- Final full browser suite: 110 passed (33.7s), two workers. Covers Chromium native touch scrolling, WebKit wheel scrolling, 810×880, 768×820, 1024×600, 390×600, compact Chinese/English rows at 320/390/810/1024 widths, actual vertical non-overlap, last shortcut/start/pause above navigation, gated settings/replay, and short-screen membership details.
- H5 build, static build, all 28 protected runtime hashes and 45 site tests passed. Existing bundle-size warning remains. No dependencies or protected runtime files changed.
- Swift Package: 13 tests passed. Expanded subscription policy smoke test passed for all 24 scenes and free/legacy/Plus Focus/timer matrices.
- Release iOS Simulator build passed at `/tmp/yixiu-focus-compact-simulator/Build/Products/Release-iphonesimulator/YixiuMeditation.app`.
- Automated browser screenshots inspected at `/tmp/yixiu-compact-390-top.png`, `/tmp/yixiu-compact-390-bottom.png`, `/tmp/yixiu-compact-810-bottom.png`. These are browser viewport simulations, not physical iPad or native App visual verification.
- No real-phone installation or App Store submission was attempted in this correction. Prior GitHub authentication failure remains unresolved; no push is claimed.

## Production preflight

- `origin/main` read back as `7170000cd6fbc2a806cdf4f07c3a3abe5588c630`.
- Existing production HTML SHA-256: `93a76d9e6adfd681761bcf59382f7bf9e67dc47e3b9763b94f80eea8561f8fde` (previous spacing correction), unchanged before packaging. Server has 15 GB free.
- Retain the established Yixiu-only Nginx deployment, not a Sites migration.

## Verified production release

- Source: `6389638` (`fix: compact Focus shortcuts and align H5 membership gates`).
- URL: https://yixiu.wonderelian.com/
- Package: `/tmp/yixiu-20260905-focus-compact.tar.gz`, 140454639 bytes; SHA-256 `5bc9a913fdf7892b546e3a4a6dac12545fe346178f09b7bb87a9171f0f7e523e`.
- Receipt: `DEPLOY_OK_YIXIU_20260905-6389638-focus-compact-1628`.
- Recovery backup: `/srv/wonderelian/backups/yixiu-20260905-6389638-focus-compact-1628`.
- Nginx and existing route/source checks passed. Public downloads of HTML and both resources compare byte-for-byte equal to the validated build:

| Resource | SHA-256 |
| --- | --- |
| `/index.html` | `892a8fe81ef31dcfc9174fe4164dcaa472538c299f99e69e0a1479b3278adb87` |
| `/assets/index-yoQp6ted.js` | `2faa2111140566b3f3c87fa952fa840569de23fceb77cbb041fdb0c6592f3e4e` |
| `/assets/index-Clt8uxVM.css` | `f52f9dc22985572d196315dc0e58d66be6d11801c0cb9cd9d9a007c07f068608` |

- Desktop Chrome production readback confirms breathing/settings/controls precede the three short-named presets, and 3/5/10-minute choices announce upgrade requirements. Left the updated Focus tab open as the deliverable. No physical iPad verification is claimed.
- App remains 1.10 (23), with the matching source and successful Release simulator build; this does not update an already installed phone binary or an App Store version.
