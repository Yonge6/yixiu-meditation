# Window Rain Quiet Pass — 2026-08-31

## Decision

Extend the existing anonymous "Send someone a quiet moment" loop to the strongest named complete-day landing page, `/sleep-sounds/`, instead of adding another closely timed social post.

The loop is intentionally lightweight:

- listen to the real Window Rain recording for 60 seconds;
- reveal a scene-specific gift action;
- create a client-side anonymous `/gift/window-rain/` URL;
- let the recipient play the complete 96-second recording without an account;
- reveal re-sharing after 60 seconds and offer an attributed App Store continuation.

It does not change membership, grant a reward, require registration, or promise an unlock.

## Source state and measurement boundary

GA4 property `549913650`, property timezone `Asia/Shanghai`, exact hostname `yixiu.wonderelian.com`:

- latest complete Beijing day queried before this release: `2026-08-30`;
- 13 active users, 24 page views, 15 sessions;
- `/sleep-sounds/` was the strongest named landing page: 6 active users, 6 sessions, 8 page views;
- 6 active users generated `playback_start`, while no `yixiu_share` row was present;
- the gap to the 100-UV completion gate was 87.

Apple's official accepted boundary through `2026-08-29` was 11 first-time downloads and 4 redownloads. This release's attributed H5 visits, gift opens, shares, App Store downloads, trials, payments, subscriptions, IAP and revenue are `null` until authoritative data becomes available.

## Implementation

- Design and implementation plan: `docs/plans/2026-08-31-window-rain-quiet-pass.md`
- Feature PR: <https://github.com/Yonge6/yixiu-meditation/pull/202>
- Feature commit: `16a7b469845040f7ef7ccfaa432170327280b691`
- Feature merge commit: `64cdb9206384821ef77ba99520e4fe2d3e790a97`
- Deployment acceptance fix PR: <https://github.com/Yonge6/yixiu-meditation/pull/203>
- Acceptance-fix commit: `d330a645dc763ec4359f10ff63cfd026a1eb50dc`
- Final merge commit built for production: `c57072a2a748be831b8e814c1a6946544cb2c59f`

Public paths:

- source: <https://yixiu.wonderelian.com/sleep-sounds/>
- recipient: <https://yixiu.wonderelian.com/gift/window-rain/>
- audio: <https://yixiu.wonderelian.com/assets/yixiu/audio/light-rain.m4a>

Share URLs use `utm_source=share`, `utm_medium=referral`, `utm_campaign=quiet_pass`, `utm_content=window_rain_gift`, a language value, and a 12-character client-generated gift ID.

## Verification

Automated and build acceptance:

- `npm run build` passed from clean source;
- `node --test tests/sites-worker.test.mjs`: 44 passed, 0 failed;
- static acceptance covered three anonymous Quiet Pass scenes, Window Rain assets, the 60-second source threshold and no membership/reward copy;
- clean output contained exactly 30 HTML pages with the `/llms.txt` discovery declaration.

Desktop Chrome local interaction:

- recipient loaded in English by default;
- the real recording entered `Now playing`;
- language toggle changed the interface and active playback state to Chinese;
- source action was hidden before playback and after 31 seconds;
- source action was visible after approximately 62 seconds;
- no console errors were observed.

Production deployment:

- release ID: `20260831-window-rain-c57072a2`;
- archive SHA-256: `ecd4631e50c8bf5c028668dbdb9128bca9e80d5f9ab5470fe0adfc71bd1bfc56`;
- deployment result: `DEPLOY_OK_YIXIU_20260831-window-rain-c57072a2`;
- Nginx configuration test passed;
- rollback backup exists at `/srv/wonderelian/backups/yixiu-20260831-window-rain-c57072a2`.

The first deployment attempt stopped before replacing production because the discovery-declaration count still expected 29 pages. PR #203 changed the exact acceptance count to 30; the empty failed-attempt backup and temporary upload were removed before the successful deployment.

Independent public readback:

- gift HTML: HTTP 200, SHA-256 `196f044bc16807c6b20689703530025d98869556b203a2f5e459d200d40bd8cb`;
- Sleep HTML: HTTP 200, SHA-256 `678c8aa6514224265648ce7f79951506639032f769c33798677ef2d73906f27e`;
- `quiet-pass.js`: HTTP 200, SHA-256 `21194c59a010c3f460cc2fd0a8b5261b0e32414c4271281b945c65b7b4529ada`;
- `quiet-pass.css`: HTTP 200;
- Window Rain byte-range request: HTTP 206;
- production Chrome showed the exact recipient title and URL, entered `Now playing`, exposed source threshold `60` and gift path `/gift/window-rain/`, and reported no console errors.

## Completion gate

This is a verified release, not completion of the long-term growth goal. The latest accepted complete-day exact-host result remains 13 active users for `2026-08-30`, below 100. Apple has official download evidence, but outcomes attributed to this Quiet Pass release remain `null` pending authoritative reporting.
