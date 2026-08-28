# Yixiu Rain Dark-Screen Player Design

Date: 2026-08-29

## Objective and decision

Improve the existing `/sleep-sounds/` search landing so it satisfies the real “rain sounds + dark/black screen + no ads” intent instead of merely mentioning that the iPhone screen can lock. Keep the canonical URL and its early Google discovery signal, use Yixiu's real Window Rain recording, and make no change to another product or domain.

Three approaches were compared. A new `/rain-sounds-black-screen/` page offers an exact-match URL but would split a very small amount of authority and risk cannibalizing `/sleep-sounds/`. Another Pinterest or Instagram post offers faster platform impressions, but the Yixiu Pinterest board already has 40 Pins and the newest video Pins have not produced an attributed H5 visit. Updating the existing Sleep page is selected because the page is already appearing in black-screen/no-ad search results and can become more useful without creating duplicate content.

The title becomes `Rain Sounds for Sleeping — Dark Screen, No Ads | Yixiu` and the meta description stays within 150–160 characters. The H1 and first paragraph answer the dark-screen intent immediately. No claim will say the web page keeps playing after the physical phone is locked; that capability remains explicitly attributed to the Yixiu iPhone app.

## Interaction and implementation

The existing Play Window Rain action remains the primary audio control. A second `Darken Screen` button is present beside it but disabled until the real rain preview is playing. This avoids a second audio implementation and makes the required sequence explicit: start the recording, then dim the interface.

When activated, a full-viewport black button overlays the page. Its very low-contrast centered copy says that rain is playing and explains that a tap or Escape restores the page. The overlay receives focus, locks page scrolling, and uses ordinary DOM/CSS rather than the Fullscreen API, so it remains predictable on desktop and mobile browsers. Closing the overlay restores focus to the original toggle without pausing the rain. The existing preview timer continues underneath; the user can return to change the timer or stop playback. If playback stops, the dark-screen action becomes unavailable until the rain starts again.

The shared `discover.js` only activates the new behavior when the page contains the dark-screen data attributes, so every other Yixiu landing remains unchanged. It emits `yixiu_dark_screen_start` and `yixiu_dark_screen_end` through the existing analytics bridge with placement `sleep_landing_dark_screen`. Visible FAQ copy and matching FAQ JSON-LD explain the distinction between the web dark-screen mode and iPhone background playback.

## Verification and release

Static tests will require the unique 50–60 character title, 150–160 character description, one H1, visible dark-screen copy, matching FAQ schema, disabled initial toggle, overlay markup, exact real rain asset and unchanged attributed Sleep App Store URL. Browser tests at 390px will prove the toggle is disabled before playback, becomes enabled after Play Window Rain, opens a full-viewport overlay, closes on click and Escape, restores focus, leaves audio playing, preserves timer progress and creates no horizontal overflow.

The protected mobile runtime check, production build, complete site tests and browser suite must pass on a dedicated port. Production acceptance requires a merge commit, guarded Nginx deployment with backup, HTTP 200, matching source/server/public hashes for the updated HTML, shared CSS and JavaScript, mobile runtime readback, and working public audio/dark-screen interaction. Submit the canonical Sleep page, Guides and sitemap to IndexNow, then request Google recrawl for the existing canonical URL. Those receipts prove discovery requests only; rankings, clicks, H5 users and App downloads remain governed by later GSC, GA4 and Apple evidence.
