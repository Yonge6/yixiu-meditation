# Yixiu YouTube Short comment download-path batch design — 2026-08-31

## Goal

Reduce the distance from four existing Yixiu rain and ocean Shorts to either a free web session or the Yixiu iPhone app, while preserving every existing public comment, URL, comment ID and historical H5 attribution value.

## Chosen treatment

Edit only the existing WonderElian comment on each Short:

- keep its current Yixiu H5 anchor and UTM values unchanged;
- add Apple provider token `120014121`, a unique `ct` campaign and `mt=8` to each App Store anchor;
- add a matching Focus custom-product-page App Store anchor to the one ocean comment that previously had only an H5 link;
- restore the WonderElian creator heart after each edit;
- verify authenticated anchor state and logged-out public HTML at the permanent comment URL.

This is the lightest reversible change. It keeps accumulated comment context and avoids a duplicate comment, a new upload or an unrelated channel action.

## Routing

- Rain comments use Sleep custom product page `67cb8784-2b16-4849-b940-90fdf4d99752`.
- Ocean comments use Focus custom product page `7890afd3-dd12-4215-a5c5-17f4ebc28759`.
- Every App Store URL uses a distinct campaign token so Apple can report each placement independently.
- The existing `organic_video` medium on `ocean_focus_short_02_comment` remains unchanged; rewriting it would break continuity with prior attribution.

## Acceptance

Each permanent comment URL must return HTTP 200 to a logged-out client and expose both its original H5 content token and its new Apple campaign token. Authenticated YouTube DOM must show the comment as modified, render both destinations as links and show the restored heart state. Representative rain and ocean H5 URLs must open the exact production hostname with their full UTM query intact.

Publishing and click-path QA do not prove a user visit or an App download. Those outcomes remain `null` until authoritative analytics reports them.
