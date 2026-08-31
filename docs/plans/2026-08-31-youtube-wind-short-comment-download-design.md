# YouTube Wind Short comment download path — design

## Context

The public WonderElian Short `iMG8YanRAnA`, **Wind Sounds for Sleeping — Mountain Air, No Music**, had 160 views on 2026-08-31, making it the highest-viewed currently visible Yixiu Short. Its video description already contains a mountain-wind H5 URL and an App Store reference, but YouTube renders those description URLs as text because the channel has not completed one-time advanced-feature verification.

The Short was already in the Yixiu Sleep Sounds playlist and had one WonderElian comment. That comment exposed a genuine clickable H5 anchor with independent `organic_comment` attribution, but asked iPhone viewers to search for the App manually. The comment had not received a creator heart.

## Options

1. **Add the existing Yixiu rain long-form video as the Short's related video.** This would create a clickable Short-to-video-to-H5 path, but YouTube required one-time advanced verification before it would permit the change. The dialog was cancelled and no related-video mutation was saved.
2. **Improve the existing WonderElian comment.** Preserve its clickable mountain-wind H5 URL, add a clickable official App Store campaign URL, and add a creator heart. This creates direct web and download paths without a new upload or duplicate comment.
3. Edit the Short description only. Its external URLs would remain plain text, so this would not fix the conversion gap.

Option 2 is selected. Pinning the comment was also evaluated, but YouTube placed the same verification gate in front of that action. The pin dialog was cancelled. No selfie, ID, OTP, password or other verification material was submitted.

## Acceptance

- The existing comment keeps its permanent comment ID and H5 attribution token.
- The revised comment contains a rendered H5 anchor and a rendered App Store anchor with a new campaign token.
- YouTube marks the comment as modified and shows the creator-heart control in its active state.
- Logged-out HTML contains the Short title, H5 token, Apple campaign token and revised opening copy.
- Following the H5 YouTube redirect preserves the complete UTM and opens the intended Yixiu wind page.
- The Apple URL remains the official US App Store listing/custom-product-page URL; storefront behavior is reported separately rather than generalized from the China test location.
- No new video, comment, channel setting, verification or other-product change is made.

