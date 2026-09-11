# Focus follows the Sounds scene

Use the selected Sounds scene as the single source of truth on native iOS and H5: Focus uses its localized title, artwork and existing audio player. Keep the Focus readability overlay, breathing instructions, duration and explicit sound-off preference. Tab navigation alone must not start or replace audio.

The native Breathe quick practice keeps the selected scene; Bedtime and Morning remain explicit scene presets. Changing scene after leaving a practice resets that practice, preventing a record attributed to the previous scene. H5 sound toggling and pause/resume must control that same audio player, preserving the pre-practice playback state and premium gates.

Validation: native scene/quick-practice UI regressions, H5 title/artwork/actual media source and tab continuity tests, premium denial, runtime checks and builds. No deployment, device installation or Apple submission is included in this change.
