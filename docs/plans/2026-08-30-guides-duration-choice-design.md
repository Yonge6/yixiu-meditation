# Guides duration-choice design

## Purpose

Turn the Pinterest promise “1 minute or 20?” into the first concrete decision on the Guides page, while preserving the hub's broader sleep, focus and study intent. The module must send visitors to a complete web track in one click and expose a separately attributable App Store path without implying that every app track is free.

## Options considered

1. Build a new comparison page. This gives the campaign an exact URL, but duplicates two existing guide pages and risks a thin search result.
2. Replace the general Guides hero. This makes the campaign message dominant, but weakens the hub for visitors arriving with sleep, study or nature-sound intent.
3. Add a compact decision module immediately after the existing hero. This matches the campaign above the generic guide grid, strengthens internal linking and preserves the hub's original purpose.

Option 3 is the selected approach.

## Experience

- The existing hero remains the only H1.
- A new “Choose by time” section asks “One minute or twenty?” and explains that the useful duration is the time a visitor can actually protect.
- Two visual cards use the existing First Breath and Still Water track artwork. Each card states the exact complete-track duration, suitable moments and the free-web listening boundary.
- Card clicks emit `yixiu_duration_choice` with distinct placements before opening the matching guide.
- A separate App Store button emits `yixiu_download_click` with the placement `guides_duration_choice` while preserving the shared Apple campaign `yixiu_h5_20260827`.
- A visible FAQ answer matches a fourth FAQ entry in JSON-LD.

## Content and data boundaries

- “Free” applies only to the two complete web tracks shown in the module.
- The App Store CTA says “Explore Yixiu for iPhone”; it does not claim that every app track is free.
- No medical, sleep-treatment or guaranteed-outcome claims are introduced.

## Accessibility and responsive behavior

- The section and cards have semantic headings and descriptive image alternatives.
- Cards remain keyboard-focusable links with at least 48-pixel action height.
- Images reserve their 1024×1536 aspect ratio and lazy-load below the hero.
- The two-column layout becomes one column at 720 pixels without horizontal overflow.

## Verification gates

- JSON-LD parses and its FAQ count/content matches the visible FAQ.
- Tests cover both track destinations, both analytics placements, the shared Apple campaign and the sitemap date.
- Build, site tests and mobile runtime tests pass.
- A 390-pixel production screenshot has no horizontal overflow and all three tracked paths are present in the live DOM.
