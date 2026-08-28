# Instagram Rain Lock-Screen Post — 2026-08-28

## Public release

- Account: `WonderElian` / `https://www.instagram.com/wonderelian/`
- Public post: `https://www.instagram.com/wonderelian/p/Dck48aLm8-_/`
- Published from the logged-in Instagram website in desktop Chrome.
- Account post count increased from 21 to 22 after publication.
- Original image ratio was selected so the complete instructional poster remains available in the post.
- Instagram AI-content disclosure was enabled before publication.
- Source asset: `docs/growth/assets/rain-lock-screen-pin-01.png`
- Source asset SHA-256: `fa8233d5e36f30ec3661287cb242e9611ee6910fdb3f5db8c239119fc4e61742`

## Published caption

> Rain sounds stop when you lock your iPhone?
>
> If you’re using Apple Background Sounds:
> Settings → Accessibility → Audio & Visual → Background Sounds → turn off “Stop Sounds When Locked.”
>
> For a step-by-step guide, a real rain preview, and a free 15, 30 or 60-minute timer, tap the Yixiu link in bio.
>
> No account. No ads.
>
> #iPhoneTips #RainSounds #BackgroundSounds #SleepSounds #WhiteNoise #Yixiu

## Accessibility

Published alt text:

> Dark blue Yixiu poster asking “Rain stops when your iPhone locks?” with a lock icon and the Apple Background Sounds path: Settings, Accessibility, Audio & Visual, Background Sounds, then turn off Stop Sounds When Locked.

## Profile-link verification

- The public `wonderelian` profile exposes a clickable `yixiu.wonderelian.com` link.
- The logged-in desktop Chrome DOM showed Instagram routing the link to `http://yixiu.wonderelian.com/` with stable attribution parameters `utm_source=ig`, `utm_medium=social`, and `utm_content=link_in_bio`; Instagram also appends a transient `fbclid`.
- The Yixiu destination returned HTTP 200.
- The Instagram profile and post both returned HTTP 200.
- Unauthenticated Instagram HTML exposed the Yixiu domain on the profile and the exact caption opening on the post.

## Browser-only boundary

The profile link had been saved in Instagram's native link form immediately before the user requested that all further work use desktop Chrome and not the phone. After that instruction, iPhone Mirroring was closed. The public-link inspection, post upload, crop selection, caption, AI disclosure, alt text, publication, and public readback were all completed in the logged-in Instagram website in desktop Chrome.

## Measurement boundary

The Yixiu profile link was not clicked during verification, so this release did not intentionally create a self-visit in GA4. Publication proves a live acquisition surface, not a visit or download. The latest official partial 2026-08-28 Beijing-day GA4 readback before this release remained 16 active users, 21 page views, and 19 sessions. The latest verified completed day remained below the 100-UV gate. Apple official data already proves first-time downloads; unknown trial, payment, subscription, IAP, and revenue outcomes remain `null`.
