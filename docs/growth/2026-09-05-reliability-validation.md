# Yixiu reliability validation — 2026-09-05

## Scope

Only Yixiu App/H5. No new App Store submission, no changes to other products.

- Native daily reminders use one repeating, local-wall-time request, replacing the finite 30-day queue after the new request succeeds.
- Notification mutations are serialized; errors are visible, failed time changes restore the old setting, and foreground activation refreshes authorization and saved wall time.
- H5 playback and breathing use actual deadlines, pause/resume preserves remaining milliseconds, and pageshow/visibility changes reconcile skipped callbacks.
- Sharing shows busy/failure states, prevents concurrent generation, bounds image/font waits and offers an explicit prepared-file retry when native sharing loses activation.
- App + widget are 1.9 (22). The phone build retains the approved DEBUG-only internal Plus preview. Release still uses StoreKit; no real subscription/download is implied.

## Verification before publication

- New regression assertions failed on old code (timer showed 29:59 after a simulated 5-minute gap, no share error UI, no busy guard, no recurring migration identifiers).
- Protected runtime: all 28 files unchanged.
- H5 production build: passed.
- Sites tests: 45 passed.
- Playwright: 76 passed, including 7 new reliability tests.
- Swift Testing: 9 tests passed.
- Native manager smoke: failure preservation, 30-to-1 migration, time rollback, localized copy, authorization refresh, explicit opt-in, serialized disable, unrelated notification preservation all passed.
- Signed Debug internal-preview device build: passed; codesign deep/strict verification passed; build 22, iPhone + iPad device families.
- Release simulator build: passed. iPad 13 simulator launched; Me reminder toggled on, displayed 21:30 without error, then toggled off. No notification setting was changed on the user's physical phone.
- Desktop Chrome showed the generated bilingual scene card with the lower-right QR and save/copy/share actions.

## Limits

H5 deadlines correct elapsed-time accounting when JavaScript resumes; no browser can promise a callback while the OS has suspended its process.
The physical phone was unavailable at the last pre-publication check. Do not describe the device build as installed without devicectl readback.
Production publishing and device installation evidence will be recorded separately after those actions succeed.

## Implementation references

- [Apple calendar notification triggers](https://developer.apple.com/documentation/usernotifications/uncalendarnotificationtrigger)
- [WebKit user activation](https://webkit.org/blog/13862/the-user-activation-api/)
