# End bell repair

User approved one gentle chime on natural completion of listening or Focus, gated by the existing default-off preference. Pause/reset/early exit must never trigger it. No membership change, UI redesign, deployment or review replacement is included.

1. Generate one original 2.8-second, softly attacked/decaying PCM bell and bundle identical bytes in native Audio and H5 assets. Verify hashes, non-silence, headroom and duration.
2. Add a separate native player, independent of ambience fade-out. Invoke only after completion and Focus playback restoration. Respect app volume, switch-off and audio interruptions.
3. H5 preloads/decodes the same asset and unlocks Web Audio during a user gesture, including silent Focus. Keep the callback stable, read current preferences and use existing completion guards. Never wait to ring later if browser audio is suspended.
4. Verify real browser completion, default-off, silent Focus, repeated ticks, pause/reset and mid-session preference changes. Build native Release and H5, run existing core/runtime regression checks.

Browser background suspension can delay timers; this is not an OS alarm or a notification permission feature. Actual locked-device audio delivery requires device QA and is not inferred from foreground browser tests.
