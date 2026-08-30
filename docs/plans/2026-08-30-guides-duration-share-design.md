# Guides duration-choice share design

## Goal

Turn the live “One minute or twenty?” module into a measurable referral loop. A visitor should be able to share the canonical Guides choice or open a Pinterest creation intent without first playing the unrelated river preview. Shared links must preserve a clean canonical destination plus explicit Yixiu attribution.

## Options considered

1. Replace only the generic Guides social image. This improves passive link previews, but creates no visible referral action and no share event.
2. Add a reusable static share surface to the duration module and align the social image. This gives visitors an immediate action, preserves the existing post-play share behavior and emits the existing `yixiu_share` event.
3. Build a new share-only comparison page. This provides a dedicated URL, but duplicates the Guides decision content and creates another thin search surface.

Option 2 is selected because it adds a measurable loop without changing the search-page architecture.

## Experience and data flow

- The existing Image2 duration infographic becomes the Guides Open Graph, Twitter and Pinterest-intent image.
- A compact share row below the two track cards offers `Share this choice` and `Save this choice to Pinterest`.
- Native share is preferred. If unavailable, the general share button copies the URL. A cancelled share records no event.
- General referrals use `utm_source=share`, `utm_medium=referral`, `utm_campaign=meditation_music`, and `utm_content=guides_duration_share`.
- Pinterest referrals use `utm_source=pinterest`, `utm_medium=organic_share`, `utm_campaign=meditation_music`, and `utm_content=guides_duration_pinterest`.
- Successful share or copy and Pinterest-intent clicks emit `yixiu_share` with the corresponding method, attributed URL and placement.
- The App Store CTA and its shared Apple campaign remain unchanged.

## Implementation boundaries

- Extend `discover.js` with one small reusable binder for explicitly marked static share surfaces; do not duplicate the existing share behavior inline in HTML.
- Keep the existing preview-triggered share surface and its event semantics unchanged.
- Use the compressed 1000×1500 Image2 derivative only on Yixiu.
- Do not add a popup, account requirement, background network request or health claim.

## Accessibility and verification

- Both controls provide 48-pixel touch targets and visible focus states.
- The feedback button announces `Shared`, `Link copied` or `Could not share` and restores its original label.
- Tests cover native success, clipboard fallback, cancellation, Pinterest URL/media and emitted event details.
- Static-site checks cover the new public image, exact 1000×1500 metadata and both share placements.
- Final acceptance requires build, site tests, runtime tests, 390-pixel no-overflow visual QA, guarded deployment and matching local/server/public hashes.
