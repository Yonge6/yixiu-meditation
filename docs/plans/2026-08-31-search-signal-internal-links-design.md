# Search-signal internal links design — 2026-08-31

## Evidence and goal

Google Search Console reports 13 total impressions and zero clicks for the Yixiu property through its latest 2026-08-28 data. The thunderstorm and waterfall intent pages each received four impressions. Thunderstorm is the clearest near-term opportunity because its average position is 9.3; waterfall is an earlier ranking opportunity at 44.8. Query text is hidden because the dataset is small, so the change must not invent a query or overfit four impressions.

## Approaches considered

1. Rewrite the thunderstorm title and description. This could improve click-through, but the current title already matches the page intent and the hidden query makes a rewrite speculative.
2. Add a duplicate page or another same-intent social post. This would divide signals or add channel saturation without a new user need.
3. Add direct contextual links from the newly submitted free online sound machine hub to the two pages already receiving impressions. This is the selected approach because it improves crawl paths and gives listeners a useful next step without changing a promising search snippet.

## Design

The Distant Thunder and Forest Waterfall sound cards keep their existing one-click audio previews. Each card gains one secondary text link with a descriptive, truthful label. The matching `ItemList` entries also gain canonical URLs so the visible relationship and structured relationship agree. A restrained link style uses the current teal palette, preserves keyboard focus, and does not turn the card into a nested interactive link.

## Verification

The existing sound-machine contract test will require both canonical structured URLs and both visible links. Full site tests, runtime integrity and production build must pass. Mobile-width Chrome verification must confirm that all 10 previews remain usable, the two links are readable without horizontal overflow, and both destinations resolve correctly. Production acceptance must match the merged commit before Google discovery is refreshed.
