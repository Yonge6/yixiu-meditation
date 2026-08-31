# Yixiu YouTube Community profile-path repairs — 2026-08-31

## Scope and decision

At approximately 2026-08-31 12:29–12:31 GMT+8, two existing public WonderElian Community posts were edited in place. The already repaired sleep-comparison post was left unchanged.

The two repaired posts are:

| Intent | Permanent post | Preserved H5 content | Preserved Apple campaign |
| --- | --- | --- | --- |
| One minute or twenty? | `https://www.youtube.com/post/UgkxCy9fu4Y3e3kFnZFJ10_k2UmPfiAcmQ4G` | `community_duration_choice_01` | `yixiu_youtube_duration_choice_20260901` |
| One-minute water-breathing reset | `https://www.youtube.com/post/Ugkx2c0jlPyDpPdF8X1SgX1ubmGm_4t0yTGD` | `community_water_breathing_reset_04` | `yixiu_youtube_reset_20260830` |

Each post now places this sentence immediately after its existing H5 destination:

> On mobile, tap WonderElian above, then tap Yixiu in the channel links.

No H5 UTM, Apple custom product page, provider token, campaign token, media token, hashtag, question or original product claim was changed.

## Authenticated and public readback

Authenticated desktop Chrome showed both original permanent post URLs under WonderElian, each marked `修改过`. Their DOM retained the exact H5 and Apple campaign tokens and exposed the complete new instruction.

Logged-out HTTP readback independently returned `200` for both permanent post URLs. Each HTML response contained:

- WonderElian;
- the exact channel-link instruction;
- its original H5 content token;
- its original Apple campaign token.

The WonderElian channel homepage renders `yixiu.wonderelian.com` as a clickable anchor. Its YouTube redirect carries this exact official destination:

`https://yixiu.wonderelian.com/?utm_source=youtube&utm_medium=organic_profile&utm_campaign=yixiu_channel&utm_content=channel_profile_yixiu_01`

That attributed production URL returned HTTP 200 and retained the complete query. The post author itself is an anchor to `/@WonderElian1`, so the newly described mobile path is grounded in the live UI.

No new post, comment, video, image, poll or quiz was created. No pin, channel setting, related video, advanced-feature verification, identity material or other product was touched.

## Refreshed authority boundary

- `origin/main` before this evidence branch: merge commit `6dc620e80fe6d1ec0a23058c18c26013ea625156`.
- Production home returned HTTP 200 on 2026-08-31 and served the current Yixiu build.
- Desktop Chrome still returned GA4's explicit `缺少权限` dialog for property `549913650`; no access request was sent.
- Apple Trends still stated `于2026年8月29日结束`.
- Apple's public US and China Lookup endpoints each returned one matching app, bundle `com.health.yixiu`, public version `1.5`.
- App Store Connect's App list showed Yixiu iOS `1.6` as `正在等待审核`; this is a submission state, not a download.

The latest accepted authoritative growth boundary therefore remains:

- complete Beijing natural day: 2026-08-30;
- exact hostname `yixiu.wonderelian.com`: 13 UV, 24 views, 15 sessions and 2 CTA events;
- gap to the 100-UV gate: 87;
- Apple official Analytics through 2026-08-29: 11 first-time downloads and 4 redownloads;
- post- or channel-profile-attributed H5 users, sessions, downloads, trials, payments, subscriptions, IAP and revenue: `null`.

This release proves two repaired public conversion paths. It does not prove a new visit or download, and the overall growth goal remains active.
