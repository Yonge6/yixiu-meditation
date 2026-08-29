# Yixiu Global Post-Play Share Prompt Release — 2026-08-29

## Signal and scope

The incomplete 2026-08-29 exact-hostname GA4 report showed five playback users and one share user. An implementation audit confirmed that all 22 pages with an after-preview panel already received the native-share/clipboard and Pinterest actions through `discover.js`. Only the Sleep landing page explained why someone might share and used a contextual action label; the other pages exposed the generic `Share this sound` label.

This release changes only the Yixiu web experience. It does not modify, publish through, or add referrals to another product.

## Live behavior

After a successful audio preview, a page without custom share copy now reveals:

- `Know someone who would enjoy this sound?`
- `Send this sound to someone`

The existing Sleep landing retains its custom copy:

- `Know someone who needs a quieter night?`
- `Send this rain to someone`

The generic prompt is injected only when `.intent-share-copy` is absent, so custom copy is not duplicated or overwritten. Native share, clipboard fallback, Pinterest intent, cancelled-share behavior, attributed canonical URLs and `yixiu_share` analytics remain unchanged.

All 22 after-preview pages now load `/discover.js?v=20260829-global-share-prompt` so returning visitors cannot receive the old behavior from a previously cached script URL.

## Verification

- Site tests: 35/35 passed locally and again from the exact merge commit on the server.
- Playwright runtime tests: 52/52 passed.
- Protected mobile runtime integrity: 28/28 passed.
- Production build: passed.
- Deploy-script syntax and Git whitespace checks passed.
- Automated post-play tests used a 390×844 viewport and confirmed no horizontal overflow.
- Public readback confirmed 22/22 pages use the new script cache key.
- Public `discover.js` contains both new generic strings.

Desktop Chrome production acceptance used explicit `qa=chrome-desktop-global-share-20260829` diagnostic URLs. On Focus, the panel was hidden before playback, then revealed one generic prompt and the new share label after real audio entered the playing state. On Sleep, playback revealed exactly one retained custom prompt and the retained rain-specific label. Both loaded the new script URL and showed no horizontal overflow. The desktop Chrome control surface did not expose viewport resizing, so the production result is not represented as a live 390px Chrome readback; the 390×844 claim is limited to the passing Playwright acceptance.

## Git and deployment

- Implementation PR: `https://github.com/Yonge6/yixiu-meditation/pull/144`
- Merge commit: `ecc13e177e7860d03fbc8f0dd1ce8307435f0360`
- Release ID: `20260829-ecc13e1-global-share-2019`
- Deploy result: `DEPLOY_OK_YIXIU_20260829-ecc13e1-global-share-2019`
- Archive SHA-256: `42b6f6a19c42f5a15c4b4fac6435c2889e18896dfcc1f9756d842c3a9c202f07`
- Public `discover.js` SHA-256: `ccc791cb93b2157f18174ab0ac91dd81b3976bb97853b97e86cb61c7cd6ad6b9`
- Public Focus page SHA-256: `b263aa856e442685803d8d19d0ab380127a72a28dbc44f94bbb9e4531df37c74`
- Server backup: `/srv/wonderelian/backups/yixiu-20260829-ecc13e1-global-share-2019`
- Retained release artifacts: `/srv/wonderelian/backups/yixiu-20260829-ecc13e1-global-share-2019/release-artifacts`

Temporary server build and transfer files were removed only after the archive, deploy script and release manifest were retained inside the backup.

IndexNow returned HTTP 200 for the primary Sleep, Focus, Guides, comparison, meditation and sitemap URLs. This proves submission receipt only.

## Authoritative result boundary

The post-release exact-hostname GA4 Data API refresh remained:

- Completed Beijing natural day 2026-08-28: 26 active users, 41 page views and 33 sessions.
- Incomplete Beijing day 2026-08-29: 16 active users, 28 page views and 25 sessions.
- Exact `share / referral / scene_share` session rows: absent.
- Exact `github / organic_release / nature_sound_collection` session rows: absent.

The diagnostic Chrome visits are not treated as growth. Share-referral and GitHub Release-attributed users, sessions and engagement remain `null`, not zero. The completed-day H5 result remains below 100 UV.

Apple official evidence proves 10 first-time downloads and 4 redownloads through 2026-08-26. Campaign downloads, trials, paid conversions, subscriptions, in-app purchases and revenue remain `null` where official evidence is unavailable. The overall growth goal remains active.
