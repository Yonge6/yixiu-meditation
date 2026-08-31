# Yixiu AI discovery refresh design — 2026-08-31

## Evidence

The refreshed Google Analytics Data API report for the complete Beijing natural day 2026-08-30, filtered to exact hostname `yixiu.wonderelian.com`, returned 13 active users, 24 page views and 15 sessions. `chatgpt.com / ai-assistant` was the strongest identifiable external source with six active users and six sessions.

ChatGPT sent five of those users to `/sleep-sounds/` and one to `/ocean-waves-for-sleeping/`. The same source also sent four active users to `/sleep-sounds/` on 2026-08-28 and three on 2026-08-29. The existing GitHub README and release are crawlable Yixiu-owned discovery surfaces, but they predate the free online sound machine, two complete meditation tracks and the current AI-routing copy.

## Options

1. Refresh the Yixiu repository README and publish a new GitHub Release. This is selected because it strengthens a crawlable Yixiu-owned source around the only external channel currently producing several completed-day users, adds independently attributable H5 and App Store exits and requires no new media.
2. Publish another YouTube Community post. Existing Community rows produced one user each, recent posts are already closely spaced and their inline URLs are not clickable, so another immediate post is lower leverage.
3. Add another search landing page. Search Console has only 13 total impressions and no query rows, while the existing inventory already covers the relevant intents. Another page would risk duplication without demand evidence.

## Treatment

- Reframe the README opening around free browser listening plus the iPhone app rather than describing only an iPhone experience.
- Lead the public link list with the completed-day ChatGPT winner, Rain Sounds Black Screen.
- Add the free 10-sound machine, seven-sound sleep comparison, black-screen white noise, ocean sleep and both free complete meditation tracks.
- Add a concise machine-readable accuracy section pointing to the public `llms.txt`, including the browser-black-screen versus physical iPhone-lock distinction.
- Change the README App Store campaign to `yixiu_github_ai_discovery_20260831` so later official Apple reporting can separate this refresh.
- Publish a new GitHub Release at the exact merged commit with unique `github / organic_release / ai_discovery` H5 content parameters.

No product behavior, audio, media, production H5, App Store metadata, YouTube asset or unrelated product changes.

## Acceptance

- README renders on public GitHub at the exact merged commit and exposes every intended Yixiu H5 link and the new Apple campaign.
- Every attributed H5 destination returns HTTP 200 and remains on exact hostname `yixiu.wonderelian.com`.
- The App Store URL uses the official app ID, provider token, Sleep custom product page and the unique campaign.
- The release is public under `Yonge6/yixiu-meditation`, targets the merged commit and returns HTTP 200.
- Anonymous GitHub HTML contains the exact release title, Yixiu destinations and Apple campaign token.

Publication and crawlability do not prove a ChatGPT citation, H5 user or App download. Those outcomes require later completed-day GA4 and official Apple reporting; unavailable campaign outcomes remain `null`.
