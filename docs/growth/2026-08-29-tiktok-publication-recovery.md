# TikTok Publication Recovery — 2026-08-29

## Purpose

The earlier TikTok submission for Yixiu's 20-second mountain-wind video returned an in-product publication receipt but never appeared in the authoritative Studio content list or the public `@wonderelian1` profile. This recovery attempt checked the current account state, resubmitted the same verified Yixiu asset once and required public URL evidence before accepting publication.

## Pre-publication audit

- Authenticated account: `@wonderelian1`
- Public profile: `https://www.tiktok.com/@wonderelian1`
- Profile bio: `Yixiu · nature sounds for sleep & focus · yixiu.wonderelian.com`
- TikTok Studio content count before recovery: 4 works, 0 drafts
- Public profile before recovery: the same four older posts
- No Yixiu mountain-wind caption, fifth work or unverified video URL was present.

The four existing Style Atlas works were inspected only to confirm the count. They were not edited, deleted, linked to Yixiu or otherwise used for acquisition.

## Submitted asset and settings

- File: `yixiu-mountain-wind-sleep-short-10.mp4`
- SHA-256: `4d4c8f43e7fbaf96ca5c4f425023671bee091422ade825e3b811237c2eeefdca`
- Format: 1080 × 1920, 20 seconds, H.264 video with AAC audio
- TikTok upload receipt: `1080P` and `已上传（4.81MB）`
- Publication timing: now
- Visibility: everyone
- HD upload: enabled
- Music copyright check: no issue found
- Content quick check: no issue found
- Disclosure: enabled for `你的品牌`; third-party branded content remained off
- AI-generated-content label: enabled
- Location, collaborator, replacement music, age restriction and cross-post: not added

The submitted caption used only Yixiu copy and this attributed H5 path:

`https://yixiu.wonderelian.com/wind-sounds-for-sleeping/?utm_source=tiktok&utm_medium=organic_video&utm_campaign=sleep_sounds&utm_content=mountain_wind_sleep_tiktok_01`

## Verification result

TikTok again returned `视频已发布` and navigated back to Studio content. However:

- the refreshed Studio content list remained at 4 works and 0 drafts;
- the authenticated public profile remained at four posts;
- no Yixiu caption appeared in either surface;
- no permanent `/@wonderelian1/video/...` URL was exposed.

Therefore this recovery is **not accepted as a public publication**. The receipt is recorded, but TikTok publication status remains unverified and no TikTok view, H5 visit or App download is claimed. At that recovery checkpoint, a third duplicate upload had not yet been attempted.

## Follow-on continuation

At approximately 19:06 Asia/Shanghai, a later authorized continuation made one final controlled retry after the earlier recovery remained absent. The same SHA-verified asset was copied to the ASCII-only temporary path `/tmp/yixiu-mountain-wind-sleep-short-10.mp4` to rule out the original path's Chinese characters and spaces as an upload-streaming cause. The first transfer in this continuation stalled at `1.66MB/4.81MB` (`34.62%`) and was cancelled before publication. The ASCII-path transfer then completed at `已上传（4.81MB）`.

Before submitting, the page again showed visibility `所有人`, HD upload enabled, `你的品牌` selected, the AI-generated-content label enabled, and both the music copyright and content quick checks as `未发现问题`. TikTok returned `视频已发布`, but repeated authenticated Studio and public-profile refreshes for several minutes still showed only 4 works, 0 drafts and the same four older posts. No rejection notice or permanent Yixiu video URL appeared.

This follow-on retry is also **not accepted as a public publication**. It was the third total submission attempt for this asset; no fourth upload was attempted. The absence of a fifth Studio item and public URL outranks the transient success receipt.

## Measurement boundary

The 19:12 Asia/Shanghai GA4 Data API refresh, filtered to exact hostname `yixiu.wonderelian.com`, returned 26 active users, 41 page views and 33 sessions for the completed 2026-08-28 Beijing day. The incomplete 2026-08-29 day returned 15 active users, 25 page views and 23 sessions. The matching `tiktok / organic_video / sleep_sounds / mountain_wind_sleep_tiktok_01` acquisition row remained absent. TikTok-attributed H5 users, sessions, App Store visits and downloads remain `null`; the completed-day 100-UV gate remains unmet.
