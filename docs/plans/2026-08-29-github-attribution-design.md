# GitHub Attribution Design — 2026-08-29

## Context

The public `Yonge6/yixiu-meditation` repository already has a product description, a live `yixiu.wonderelian.com` homepage, 11 relevant topics and a bilingual README with attributed H5 links. This is a legitimate Yixiu-owned discovery surface and does not require a backlink from another product.

The remaining measurement gap is in the README's App Store paths. The English App Store link contains a custom product page ID but no Apple provider token, campaign token or media type. The Chinese footer link contains no attribution parameters. A future download from either path therefore cannot be separated as a GitHub campaign in Apple data. The repository description and topics also omit the newly shipped browser dark-screen and sleep-timer capabilities.

## Options

### 1. Add Apple attribution and update existing metadata — selected

Use one dedicated Apple campaign token, `yixiu_github_20260829`, on both README App Store links with provider token `120014121`, media type `8` and the verified Sleep custom product page. Change the existing rain anchor to describe the dark-screen timer, and update the repository description/topics to match the live product.

This is the smallest action that creates a measurable App acquisition path while strengthening accurate search metadata on an existing authoritative surface.

### 2. Create a GitHub Release

A new release could generate another indexed page, but there is no new native binary or version in this action. Treating a web-distribution update as a software release would blur the product boundary and add a misleading artifact.

### 3. Leave the repository unchanged

The current links work, but Apple cannot distinguish GitHub downloads. This preserves an avoidable measurement gap and does not move the download-proof objective forward.

## Selected change

- Repository description: `Yixiu — real rain and nature sounds for sleep and focus on iPhone and web. Dark-screen timer. No account or ads.`
- Add repository topics: `dark-screen`, `sleep-timer`, `noise-masking`.
- Keep homepage: `https://yixiu.wonderelian.com/`.
- README rain anchor: `Rain sounds for sleep with a dark-screen timer`.
- README rain H5 attribution content: `repository_readme_dark_screen`.
- Both README App Store links:

  `https://apps.apple.com/us/app/yixiu-white-noise-sleep/id1461182261?ppid=67cb8784-2b16-4849-b940-90fdf4d99752&pt=120014121&ct=yixiu_github_20260829&mt=8`

No release, tag, binary, account setting, pricing claim, download count, trial claim, paid promotion or other-product link is created.

## Verification and measurement

Acceptance requires README link validation, GitHub source and rendered-page readback, public repository metadata readback, HTTP 200 for the H5 and App Store destinations, and confirmation that the repository retains its existing homepage and all prior relevant topics.

This action creates an attribution path only. Apple official analytics must later expose the `yixiu_github_20260829` campaign before any download can be attributed to GitHub. Until then, campaign downloads remain `null`; the existing official 10 first-time downloads and 4 redownloads remain the only verified download totals. The overall goal still requires a completed Beijing day with at least 100 exact-hostname H5 active users.
