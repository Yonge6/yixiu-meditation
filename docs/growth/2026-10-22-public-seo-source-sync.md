# Preserve the public SEO repairs in source builds

The live Yixiu site was repaired on 2026-10-22. This source change carries the same content into the next build, based on `codex/yixiu-reliability-library-20261013` at `3fc371aecde802855590b6d84f27fc8258428520`.

Before editing, all five affected `yixiu-prototype/public/` inputs matched the production originals byte for byte: `llms.txt`, `music-credits.html`, `focus-sounds/index.html`, `best-sleep-sounds/index.html`, and `sitemap.xml`. The homepage uses the same original HTML fallback in `yixiu-prototype/index.html`; the source keeps `/src/main.tsx` as its Vite entry. Generated production script or stylesheet names must not be copied into that template.

The current active web catalog is 14 nature sounds and 40 music tracks. The existing Free policy exposes 10 nature sounds and 17 music tracks, including 10 classical recordings, 5 AI originals, Oasis Rest and First Breath. The homepage and the `llms.txt` introduction now agree with that policy. The credits page has 20 full classical recordings and downloads under their individual licenses; its title, description, heading and opening paragraphs now agree with its actual list.

The raw `/?lang=zh` response remains the English homepage with the root canonical, so the three query-string language alternates are removed there. Keep the real reciprocal language alternates on the separate bilingual journal pages. The homepage `WebSite` node is English; the iPhone app's bilingual language support stays intact. Native catalog availability may differ by installed version.

The focus and sleep comparison guides each link contextually to `/free-online-sound-machine/`. These are ordinary static guide links, so they remain available after JavaScript runs. The sitemap retains all 59 existing URLs and updates only the three changed, listed HTML pages to 2026-10-22.

The existing release flow already consumes these inputs: `build:journal` regenerates only the marked journal blocks in `public/llms.txt` and `public/sitemap.xml`; Vite copies the public files and compiles the homepage source template. `prepare-app-banner.mjs` remains after journal generation. No new release hook or application/access-policy change is needed for these corrections to survive a build.

The live release was checked with all 59 sitemap URLs, six exact published-file hashes, two unknown-path 404 checks, and 32 simulated search/AI User-Agent requests. All 20 classical audio URLs also returned valid M4A range responses. These checks establish public behavior, not Google indexing or authentic crawler-IP access. This source PR targets the production branch; it must not be merged into or deployed from an unrelated older branch.
