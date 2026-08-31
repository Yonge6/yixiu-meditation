# Free online sound machine first-play optimization — design

## Evidence and objective

The new `/free-online-sound-machine/` page is already the strongest current-day landing path. The exact-hostname GA4 Data API readback for the incomplete `2026-08-31` Beijing day returned seven active users on this page, including six first visits, but only one active user triggered `yixiu_playback_start`. The same page currently makes its primary hero action an in-page jump labelled `Choose a sound`; a visitor must scroll into the 10-card collection and make a second choice before hearing anything.

This release targets that activation gap. It does not treat the incomplete day as a success boundary, and it does not claim the observed counts are stable conversion rates.

## Options considered

1. **Direct hero playback — selected.** Replace the inert hero jump with a real Window Rain preview button, then keep a secondary `Browse all 10 sounds` link. This removes one step, uses an existing licensed recording, preserves choice and immediately connects a successful listen to the existing share and iPhone continuation panel.
2. Move the complete 10-card grid above the hero timer. This preserves choice but makes the first screen denser, increases visual and decision load, and does not offer a faster default action.
3. Autoplay a recording on arrival. This would be intrusive, is commonly blocked by browsers and would create misleading playback analytics, so it is rejected.

## Selected behavior

The first hero button becomes `Play Window Rain` and uses the same real `/assets/yixiu/audio/light-rain.m4a` asset as the Window Rain card. Its analytics placement is `sound_machine_hero_rain`. A secondary text link labelled `Browse all 10 sounds` continues to the existing collection. The App Store action remains available and retains its current official campaign parameters.

Starting the hero preview must use the existing one-player controller, 30-minute default timer, post-play share loop and after-play iPhone continuation. Starting another sound later must stop Window Rain and switch cleanly. No new audio, account gate, membership promise, medical claim or automatic playback is added.

## Acceptance

- The page exposes exactly 11 preview controls backed by 10 unique real recordings: one hero shortcut plus the existing 10 choices.
- The hero control starts Window Rain, becomes `Pause Window Rain`, advances the timer and reveals the existing after-play continuation and share controls.
- `Browse all 10 sounds` reaches the collection, and choosing another card switches the active recording.
- Desktop and 390×844 Chrome checks show no overflow or clipped controls.
- Protected runtime, static-site acceptance, production build and production HTTP/audio checks pass.
- Any current-day H5 or campaign result remains provisional or `null`; the completed-day 100-UV gate remains authoritative.
