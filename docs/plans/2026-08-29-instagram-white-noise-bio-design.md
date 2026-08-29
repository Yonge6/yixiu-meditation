# Instagram White Noise Bio Alignment Design

## Goal

Reduce the semantic gap between the public White Noise Reel, the `@wonderelian` profile and the six-path Yixiu Instagram chooser without changing the profile website, account type or any non-Yixiu product.

## Options considered

1. Lead with `White noise + black screen` and retain a compact list of the other sound families. This matches the newest Reel's call to action while keeping the profile useful for Rain, Wind, Forest and Focus visitors.
2. Use a broad `Sleep sounds without bright screens` promise. This is calmer but makes the exact `choose White noise` instruction less obvious.
3. List all six chooser paths. This is complete but exceeds the useful information density of a 150-character profile bio.

## Selected copy

`White noise + black screen → tap Yixiu below, then choose White noise. Rain, wind, forest + focus. No account. No ads.`

The selected 118-character version leads with the current acquisition intent, gives one concrete action, preserves the other major use cases and handles the account/ad objections with only verified claims. The existing `yixiu.wonderelian.com` profile link and its `ig / social / link_in_bio` attribution stay unchanged, so the bio test changes one conversion variable rather than creating a new measurement path.

## Acceptance and rollback

- The edit must affect only the `@wonderelian` bio.
- The website field, AI Creator label and account-recommendation setting must remain unchanged.
- The public profile must expose the exact selected copy, the existing Yixiu link and the new White Noise Reel.
- If the save fails, the previous bio remains the rollback state: `Rain + dark screen → tap the Yixiu link, then Sleep Sounds. Focus sounds + 1-minute reset. No account. No ads.`
- No traffic or conversion outcome is attributed until GA4 exposes a matching authoritative row.
