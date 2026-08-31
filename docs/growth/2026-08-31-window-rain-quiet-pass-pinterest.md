# Window Rain Quiet Pass Pinterest Distribution — 2026-08-31

## Evidence and choice

The latest complete Beijing natural day available from the GA4 Data API is `2026-08-30`. Property `549913650`, property timezone `Asia/Shanghai`, filtered to the exact hostname `yixiu.wonderelian.com`, reported:

- 13 active users;
- 24 page views;
- 15 sessions;
- an 87-user gap to the 100-UV completion gate.

The incomplete `2026-08-31` report queried at `2026-08-31T05:27:36Z` showed two identifiable external sources with two active users each (`chatgpt.com / ai-assistant` and `wonderelian / owned_referral`) and one active user from the First Breath Pinterest Pin. It also showed four `yixiu_download_click` events from two active users. Those clicks are not Apple download evidence.

The scheduled WonderElian YouTube sleep-comparison Community post was publicly available at <https://www.youtube.com/post/Ugkxt0JQave_emwDpEuQx1cshRQYxXIrgn_v>. Logged-out HTML returned HTTP 200 and exposed `WonderElian`, `community_sleep_sound_comparison_05`, and `yixiu_youtube_sleep_compare_20260831`. The matching GA4 content row was still absent at the post-publication readback.

An official X post was reconsidered because the authenticated profile page initially exposed the correct `@WonderElian` identity. After the post copy was entered, X again exposed the authoritative account notice that the account is suspended and permanently read-only. The post was not submitted, the temporary draft was discarded, and no appeal, alternate identity, profile edit, or other-product change was made.

Pinterest was selected because it was the only current official social source with an attributable active user and the newly released Window Rain Quiet Pass behavior had no dedicated Pin. The new creative premise is distinct from the existing rain dark-screen, lock-screen and sleep-comparison Pins: listen for one quiet minute, then send someone the complete 96-second Window Rain moment.

## Publication

- Public Pin: <https://www.pinterest.com/pin/1147643917690533729/>
- Account: `WonderElian` / <https://www.pinterest.com/wondereilan/>
- Board: `Yixiu: Nature Sounds & Sleep`
- Title: `Send Someone 96 Seconds of Window Rain`
- Destination:

  `https://yixiu.wonderelian.com/sleep-sounds/?utm_source=pinterest&utm_medium=organic_pin&utm_campaign=quiet_pass&utm_content=window_rain_gift_pin_01`

- Image: the existing production `assets/yixiu/window-rain.png`, 941 by 1672 pixels.
- AI-modified disclosure: enabled.
- Similar-product recommendations: disabled.
- Tagged topic: `Sleep`.
- Alt text: `Blue evening rain on a window with warm amber lights outside, representing Yixiu's free Window Rain quiet gift.`

Published description:

> Listen to real window rain for one quiet minute, then send a complete 96-second rain moment to someone who came to mind. No account, notifications, music, talking or ads. Free in Yixiu. #SleepSounds #RainSounds #RelaxingSounds

## Acceptance

Pinterest returned `Publish Complete` and `Your Pin has been published!`, with permanent Pin ID `1147643917690533729`.

Authenticated desktop Chrome readback proved:

- exact permanent URL and title;
- exact `WonderElian` author;
- exact destination including `window_rain_gift_pin_01`;
- full description and hashtags;
- visible `AI modified` disclosure;
- a direct `Visit site` action.

Unauthenticated acceptance proved:

- public Pin HTTP 200;
- destination HTTP 200 with the full UTM preserved;
- logged-out HTML contained the exact title, `WonderElian`, attribution content value and supplied alt text;
- Pinterest oEmbed HTTP 200 returned `type=rich`, `author_name=WonderElian`, and `author_url=https://www.pinterest.com/wondereilan/`.

The oEmbed title was destination-derived (`Rain Sounds Black Screen for Sleep — Free, No Ads`) rather than the visible Pin title, so title acceptance uses the authenticated public DOM and logged-out HTML.

## Post-publication metrics and Apple boundary

The exact-hostname GA4 source/campaign/content report was refreshed at `2026-08-31T05:34:04Z`. Neither `window_rain_gift_pin_01` nor `community_sleep_sound_comparison_05` appeared. Their attributed H5 active users and sessions therefore remain `null`, not zero. The current date is incomplete and cannot satisfy the completion gate.

App Store Connect was refreshed in the authenticated desktop Chrome session. Its 90-day overview was current through `2026-08-29` and showed:

- 11 first-time downloads;
- 4 redownloads;
- 1,590 impressions;
- 87 product-page views;
- 1.19% average conversion.

The official campaigns page displayed `数据不足，无法显示营销活动。` Campaign-attributed downloads, trials, paid users, subscriptions, in-app purchases and revenue remain `null`. The overview also displayed insufficient data for proceeds, paying users, IAP and subscription metrics, so those values remain `null` rather than being inferred as zero.

This publication is a verified Yixiu-only acquisition action. It does not complete the long-term goal: the latest complete-day exact-host result is 13 active users, below 100, even though official Apple data proves downloads.
