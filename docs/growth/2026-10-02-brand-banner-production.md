# Yixiu brand and download banner production release

- Source: PR #254, merged as `f287ae645669956e9011d621ea57cc98fba2675f`; tested tree `9b3791d`.
- Published: 2026-10-02, https://yixiu.wonderelian.com/.
- Assets: `index-BrpIyrrv.js`, `index-CAd7k38b.css`, `app-banner.js?v=20261001`, `app-banner.css?v=20261001`.
- Deployment: checksum-based rsync to the existing Yixiu directory, assets before HTML, no deletion or Nginx config changes. Replaced files backed up to `/srv/wonderelian/backups/yixiu-20261002-9b3791d-banner` (992K). Old hashed assets retained. Restore backed-up files over the same Yixiu target to roll back referenced content.
- Preflight found production still had the earlier 10-classical catalog. Uploaded the ten previously approved, already-main classical audio dependencies and credits with the current 20-classical build. No Suno recordings added; no native App, subscription or other-product changes.

## Verification

- Production build passes; protected runtime integrity: 28 files. Sites tests 45/45 and banner tests 2/2 pass.
- Post-deploy checksum rsync dry run reports no differences in built files (source maps excluded). Nginx configuration test passes.
- Public HTTP 200 and SHA-256 equality with build: root HTML, both hashed bundles, banner CSS/JS, App icon, Chinese journal article, and `traumerei.m4a`.
- Live browser at 390x844 and 1095x844: no horizontal overflow; banner bottom/app top both 76; bottom navigation bottom 844.
- Language switch shows `Yixiu Meditation / Rest, Sleep & Calm` in brand and banner.
- Production directory-style Chinese article resolves to the article, with banner and main top at 137px.
- Closing the banner on an article and navigating home keeps it dismissed; player returns to top 0.
- iPhone WeChat UA: banner goes to first-party `/download.html`, preserves the attributed region-neutral App Store URL, and shows default-browser instructions. The handoff itself has no banner.
- These are desktop-browser/UA checks, not physical iPhone WeChat verification or evidence of App downloads.
- Visual screenshot inspected: `/tmp/yixiu-banner-production-desktop.png`.
