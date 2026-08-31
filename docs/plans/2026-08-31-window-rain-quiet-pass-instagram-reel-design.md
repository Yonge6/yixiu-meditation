# Window Rain Quiet Pass Instagram Reel — Design

## Context and choice

The latest complete Beijing day remains 13 exact-host active users, well below the 100-UV gate. The newly published Window Rain Quiet Pass Pin has a verified click path but no attributed visit yet. Instagram has historically produced more attributable Yixiu users than static Pinterest content, while the current WonderElian Instagram profile already has a clickable Yixiu-only chooser. No Instagram content currently demonstrates the new sequence: listen for one quiet minute, then send someone the complete 96-second Window Rain moment.

Three approaches were compared:

1. **Publish the existing Window Rain image as a feed post.** Lowest production cost, but a static post is less likely to receive discovery distribution and cannot show the product sequence.
2. **Reuse the earlier dark-screen Reel.** It already has a verified format, but repeating it would confuse the new Quiet Pass premise with an older feature and duplicate existing content.
3. **Render one new 15-second Quiet Pass Reel from the existing Window Rain image and real rain audio.** This creates no new synthetic product scene, makes the three-step behavior understandable, and uses Instagram's stronger discovery format. This is selected.

The local FFmpeg binary is unavailable, so the video will use the project's already-proven macOS AVFoundation rendering pattern. No software will be installed. The reusable renderer belongs in the Yixiu repository and accepts explicit image, audio, output and cover paths.

## Creative

Format: 1080 by 1920, 30 fps, 15 seconds, H.264 video, AAC audio. The production Window Rain image receives a slow restrained drift and a dark blue overlay so the text remains legible. The real `light-rain.m4a` recording supplies the soundtrack.

Sequence:

- 0–3.7 seconds: `SOMEONE CAME TO MIND?`
- 3.7–7.5 seconds: `LISTEN FOR ONE QUIET MINUTE`
- 7.5–11.5 seconds: `SEND THEM 96 SECONDS OF WINDOW RAIN`
- 11.5–15 seconds: `FREE · NO ACCOUNT · LINK IN BIO`

The persistent eyebrow is `YIXIU / WINDOW RAIN`. A thin progress line moves across the lower frame. The copy is deliberately sparse and makes only behavior that is already live on the production Sleep page. It does not promise sleep treatment, rewards, membership, traffic or downloads.

Caption:

> Someone came to mind while you listened?
>
> Window Rain now lets you send them a complete 96-second quiet moment after one minute of listening.
>
> No account. No notifications. Just rain.
>
> Listen free → link in bio → Sleep Sounds
>
> #SleepSounds #RainSounds #RelaxingSounds #MindfulMoments #Yixiu

## Acceptance

- Verify the media stream dimensions, duration, codecs and audio presence with AVFoundation metadata readback.
- Extract and visually inspect representative frames covering all four messages, safe areas, contrast and the final CTA.
- Publish only from the authenticated public `wonderelian` account in desktop Chrome.
- Enable Instagram's AI-content disclosure because the underlying production image was AI-created; provide truthful alt text.
- Require a permanent public Reel URL, exact caption, correct author and logged-out HTTP/HTML readback.
- Do not edit the shared profile link, bio, older posts or any other product.
- Do not upload the video to YouTube.
- A publication is not a visit or download. Instagram-attributed users, downloads, trials, payments, subscriptions, IAP and revenue remain `null` until authoritative data exposes them.
