# Yixiu universal download banner

## Scope and implementation

User requested the same dismissible browser banner recently implemented by 三慢问道. Read its AppDownloadBanner.tsx and public/download/app-banner.js/css as reference only; no Wendao files changed.

- Shared public/app-banner.js and app-banner.css render the actual Yixiu App icon, bilingual name/benefit copy, download CTA and accessible dismiss button.
- Applies to mobile H5, desktop Web, all three main tabs, journal articles and other standalone public HTML pages. Excludes the download handoff and internal phone preview.
- Dismissal uses sessionStorage only and follows navigation between pages within that browser tab/session; unavailable storage falls back to current-page dismissal.
- ResizeObserver reserves the actual banner height; root/player keep the remaining viewport and bottom navigation stays on screen. English/Chinese copy follows the app language switch through a filtered MutationObserver.
- All WeChat banner clicks use /download.html, retaining the attributed region-neutral Yixiu App Store target. Other browsers use the store URL in the same window. Do not claim the web page can open a different browser automatically from WeChat.
- prepare-app-banner.mjs performs idempotent HTML injection after journal generation in predev/prebuild; protected template runtime files remain untouched.
- Native App, subscription prices/rights and pending Apple review remain unchanged. Suno music work remains paused for licensing confirmation.

## Acceptance — October 1, 2026

- Build passed, protected runtime 28 files passed; existing Sites tests 45/45 and banner checks 2/2 passed.
- Browser widths 320/390/1095: no horizontal overflow, App top equals banner bottom and App/nav bottom equals viewport bottom. Desktop and phone screenshots visually inspected.
- English banner text and region-neutral target read back; live language switch updates banner to Chinese.
- iPhone WeChat UA: download enters first-party guide with preserved target; guide visible; Copy reports success. Safari UA on the same handoff continued through Apple's URL to itms-appss://apps.apple.com/app/id1461182261. Desktop test browser cannot launch that iOS scheme (ERR_UNKNOWN_URL_SCHEME); this is not a real-device App Store launch or download claim.
- Article banner starts above content; close + reload keeps it hidden; returning to main player also keeps it hidden and restores App top to 0.
- Article test used the explicit /index.html file in Vite dev, which otherwise routes directory-style public URLs to the SPA. Production public directory files are present in the build.
- Screenshots: /tmp/yixiu-banner-phone.png, /tmp/yixiu-banner-desktop.png, /tmp/yixiu-banner-wechat.png, /tmp/yixiu-banner-article.png.

Local preview only: http://127.0.0.1:4207/?scene=rain&lang=zh. No production deployment in this task.
