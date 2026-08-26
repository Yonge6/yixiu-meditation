# Pinterest share intent after sound preview

## Goal

Turn a successful Yixiu sound preview into an optional, attributable Pinterest save flow without claiming that a Pin was published. The change stays inside Yixiu and uses only each page's public canonical URL, Open Graph image and visible metadata.

## Chosen approach

The shared `discover.js` runtime creates one `Save to Pinterest` link beside the existing generic share control whenever a page has an after-preview conversion area. The link remains hidden with that area until audio playback succeeds. This keeps every English intent page consistent and avoids duplicating platform URLs in each HTML file.

At click time, the runtime builds Pinterest's public create intent from:

- the page canonical URL with `utm_source=pinterest`, `utm_medium=organic_share`, `utm_campaign=scene_share` and a scene-specific `utm_content` value;
- the absolute `og:image` URL;
- the page title and meta description.

The link opens in a new tab with `noopener noreferrer`. A click records `yixiu_share` with `share_method=pinterest_intent`; it does not record a completed or public Pin.

## Alternatives rejected

- Hand-writing a Pinterest link in every page gives page-level control but creates drift across the growing intent-page set.
- Keeping only the generic Web Share path preserves less code, but desktop fallback merely copies a link and does not help a Pinterest user create a visual save.

## Verification

- Playwright checks that the control appears only after a successful preview.
- The generated Pinterest URL must contain the exact attributed canonical destination, public image and description.
- The click analytics event must use `pinterest_intent`, while mobile width remains free of horizontal overflow.
- The full runtime, site contract and production build suites must still pass before deployment.
