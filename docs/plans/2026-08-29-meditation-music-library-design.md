# Yixiu Meditation Music Library Design — 2026-08-29

## Product decision

Yixiu will add ten instrumental meditation tracks to both the public H5 and the native iOS app: five long sessions around twenty minutes and five short, loopable sessions around ninety seconds. The H5 remains accountless and represents the free tier; locked items open the attributed App Store path instead of pretending that a web visitor has an App Store entitlement.

Access policy:

| Access level | Nature sounds | Meditation music |
| --- | --- | --- |
| Free / H5 | 5 original scenes | 2 tracks: one long and one short |
| Legacy iOS purchaser | all 14 original scenes | the same 2 free tracks |
| Yixiu Plus | all 14 original scenes | all 10 tracks |

This preserves the existing promise that verified users from version 1.2 or earlier retain all original nature sounds while making newly added premium music a Plus benefit.

## Track set

| ID | Yixiu title | Source title | Length class | License | Free |
| --- | --- | --- | --- | --- | --- |
| still-water | 静水 / Still Water | 20 Minute Meditation 1 | long | CC0 1.0 | yes |
| deep-current | 深流 / Deep Current | 20 Minute Meditation 3 | long | CC0 1.0 | no |
| moonlit-drift | 月下漂流 / Moonlit Drift | 20 Minute Meditation 8 | long | CC0 1.0 | no |
| quiet-orbit | 静默星轨 / Quiet Orbit | 20 Minute Meditation 10 | long | CC0 1.0 | no |
| dreamscape | 梦境水域 / Dreamscape | DreamScape | long | CC0 1.0 | no |
| first-breath | 初息 / First Breath | lvl 0 – the tutorial | short | CC BY 4.0 | yes |
| open-meadow | 原野舒展 / Open Meadow | lvl 3 – the grassland | short | CC BY 4.0 | no |
| oasis-rest | 绿洲停歇 / Oasis Rest | lvl 5 – the oasis or resting place | short | CC BY 4.0 | no |
| sunlit-shore | 日光浅岸 / Sunlit Shore | lvl 6 – the beach | short | CC BY 4.0 | no |
| ocean-passage | 海上行旅 / Ocean Passage | lvl 7 – the raft on the ocean | short | CC BY 4.0 | no |

The five long tracks come from HoliznaCC0's `Space - Sleep - Meditation` release. Each selected track page declares CC0 1.0 and `AI generated? No`. The five short tracks come from YannZ's `Indie Meditations FREE Music Pack`; the pack declares CC BY 4.0, asks for attribution, and supplies fully loopable MP3, WAV, and OGG files.

## Experience

The existing nature player remains the default. The library gains a top-level `自然声 / Nature` and `冥想音乐 / Music` switch. Music cards show the generated cover, bilingual title, duration, and either `免费 / FREE` or a Plus lock. Selecting an accessible music track moves it into the same persistent player, Now Playing metadata, favorites, recent listening, timer, volume, background playback, and remote controls. A locked card opens the existing iOS Plus paywall or the H5 App Store upgrade path.

The ten covers use one coherent Yixiu system: portrait, text-free atmospheric artwork; deep teal and navy water; restrained moonlight or dawn light; one distinct visual metaphor for each track; no people, logos, text, UI, or watermark. Image 2 generates every cover separately from the track mood.

## Technical shape

Both clients use a shared conceptual `ListeningItem`: original nature scene or meditation track. Existing scene deep links remain valid. Music links use `?music=<id>&lang=<zh|en>`. The native audio engine resolves bundled M4A music. Both clients loop every track to preserve uninterrupted timed sessions; the 20–22 minute tracks minimize audible repetition.

Tests must prove the exact 5 + 2 free boundary, legacy preservation, Plus access, locked-card behavior, bilingual labels, valid audio resources, media metadata, and both-client builds. License evidence records source URL, declared license, original filename, final filename, duration, and SHA-256.
