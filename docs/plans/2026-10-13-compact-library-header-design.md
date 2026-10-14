# Compact sound-library header design — 2026-10-13

## Decision

- Keep the H5/Web library categories and card grid unchanged.
- Replace the always-visible search field and four-segment personal filter with a compact header: title, search button, native scope selector, flexible space and close button.
- Search remains collapsed by default, expands directly below the header on request and receives focus immediately. A non-empty query keeps the field visible for clear/reset.
- Keep the catalog summary as secondary text directly under the header row, avoiding the previous large gap above the library title.
- Use a native `select` for All / Free / Favorites / Recent so touch, keyboard and screen-reader behavior remain reliable without another custom menu layer.
- Preserve the fixed category row and scroll only the result grid.
- In the native App header, move only the small brand subtitle upward by 2 points; preserve icon/title sizing and adaptive layout.

## Verification

- TypeScript build and existing library filter tests.
- Browser checks at mobile portrait, short landscape and desktop for compact layout, dropdown filtering, expanded search, close action and no horizontal overflow.
- Native Debug/Release compile plus a simulator screenshot confirming the two-point subtitle adjustment does not collide with the title.
