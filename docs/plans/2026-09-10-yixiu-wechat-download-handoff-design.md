# Yixiu WeChat App Store handoff

## Goal

When an iPhone visitor taps a Yixiu App Store action inside WeChat, move the current window to a first-party download handoff page. The handoff page keeps the top-right browser guidance visible inside WeChat. When the user chooses “Open in Default Browser”, the same page immediately replaces itself with the original attributed, region-neutral Yixiu App Store URL, so there is no second download tap.

## Chosen approach

Use the proven Wendao pattern without modifying or copying its visual design. A direct App Store navigation from the main H5 is less reliable because WeChat may intercept it before Yixiu can explain the next step. Keeping the existing in-page modal is also insufficient because WeChat opens the current Yixiu scene URL in the external browser, forcing a second download tap. A first-party `/download.html` handoff preserves control of the WeChat instruction and makes external-browser continuation automatic.

The main React experience passes `lang`, `placement`, and the clicked App Store URL to the handoff page. The handoff script accepts only HTTPS URLs on `apps.apple.com` with the exact `/app/id1461182261` path. Only Yixiu's known Apple campaign parameters are retained; invalid or missing input falls back to the existing Yixiu H5 campaign URL. This prevents the page from becoming an open redirect.

## Experience and failure handling

Inside WeChat, the page uses Yixiu's deep-water artwork, a compact pointer toward the top-right menu, bilingual instructions, a visible App Store fallback link, and a copy-link fallback. Outside WeChat, it immediately calls `location.replace` with the validated App Store URL. If JavaScript or automatic navigation fails, the real App Store link remains available in the document. The page is mobile-first, respects safe areas, remains scrollable in short landscape viewports, and uses reduced-motion preferences.

## Verification

- Existing Safari and ordinary-browser App Store actions still navigate directly in the current window.
- iPhone WeChat clicks navigate to `/download.html` with the original attributed target rather than opening an in-page modal.
- The WeChat handoff page exposes the browser guide and copies the validated App Store target.
- Opening the handoff URL under a non-WeChat browser automatically reaches `https://apps.apple.com/app/id1461182261` with attribution intact.
- An untrusted target cannot redirect away from Apple's Yixiu listing.
- Runtime lock, Playwright suites, static build, Sites worker tests, and production smoke checks all pass before release.
