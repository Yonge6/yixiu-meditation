# H5 Me card and work/life heading — 2026-10-20

- Requested: make the whole membership card clickable; rename the Lifestyle heading to `探索健康的工作和生活方式`. English uses `EXPLORE HEALTHIER WAYS TO WORK AND LIVE`.
- Kept the existing card layout and one semantic button, stretching its hit target across the card. Keyboard activation and Escape focus return remain intact. Long headings wrap without font shrinking or viewport-specific truncation. No access/pricing, native App or Apple submission changes.
- Verification: 28 protected runtime files unchanged; TypeScript/Vite build passed; Sites 45/45 and new focused regression 1/1 passed.
- Browser: local 390px Chinese and 320px English checked; title and bottom-padding clicks open the Plus dialog; Enter opens it and Escape returns focus. Production 390px card title opens the dialog, scrolling over the card still scrolls the Me viewport, no accidental dialog. Production Chinese/English heading checks have no horizontal overflow. Screenshots included.
- Release: `20261020-me-card-lifestyle-r1`; guarded publisher receipt in `deploy.log`. Existing target only: `/srv/wonderelian/yixiu.wonderelian.com`. Recoverable backup: `/srv/wonderelian/backups/yixiu-20261020-me-card-lifestyle-r1`.
- Archive: `/Volumes/LaCie/Yixiu-Releases/20261020-me-card-lifestyle/site.tar.gz`; SHA-256 `e7bd8ff83ca0ed5deee85ddadb118cadbd9ef6f59870d17ebbbf5fca1494752a`. Private localhost SSH tunnel used for transfer; task-owned HTTP server stopped afterward.
- Public HTML SHA-256: `8dd04a95514615e2756be271f778d7772cb1806c4328781eeab526284189900f`.
- Public JS `/assets/index-BUG9gsjz.js`: `68386790082344b136bb6e75b43048d1ed4adf45d6663bfac0438097b030201b`.
- Public CSS `/assets/index-BLnqE7-_.css`: `5a0391dc4fcd74525c7127b61ec1ed73ff830b8b7aa22f4866d7b367def33e1c`.
- All three public hashes independently match this build. Public URL: https://yixiu.wonderelian.com/?music=moonlightSonata&lang=zh
