# Yixiu zero-budget precision acquisition

Date: 2026-08-23  
Primary market: United States, then other English-speaking markets  
North-star outcome: attributable first-time iPhone downloads  

## Positioning

Yixiu is a quiet utility, not an endless wellness content library.

**One sentence:** Nature sounds and a one-minute breathing reset for people who want less noise, not more content.

The free acquisition message should lead with the immediate job to be done. “Be water, my friend” remains the product philosophy, but it should support the conversion message rather than replace it.

## Three high-intent audiences

| Intent | Person and moment | Search/problem language | First experience | Conversion page |
| --- | --- | --- | --- | --- |
| Sleep | Light sleeper, noisy neighbor, racing mind at bedtime | rain sounds for sleep, ocean sounds for sleeping, sleep timer app | Window Rain | `/sleep-sounds/` |
| Focus | Student, writer or knowledge worker starting a work block | nature sounds for focus, white noise for studying, stream sounds for work | Mountain Stream | `/focus-sounds/` |
| Reset | Overstimulated person between meetings or before sleep | one minute breathing exercise, quick calm down exercise | Water Breathing | `/one-minute-reset/` |

Do not target “everyone who meditates.” These three moments are specific, searchable and immediately testable inside the product.

## Channel focus

### 1. Owned search pages

The three English intent pages are the durable conversion layer. Each page has one promise, one primary App Store action, one free web trial and event attribution.

Weekly action:

1. Publish one genuinely useful paragraph or FAQ improvement based on Search Console queries.
2. Keep the title and first screen aligned to the exact search intent.
3. Never create near-duplicate keyword pages.

### 2. YouTube search

Use existing Yixiu scene art and audio; no presenter is required. Publish one 20–35 second vertical discovery clip and one 8–30 minute useful listening video each week. The title should name the situation, not just the brand.

Examples:

- `Rain on a Window for Sleep — No Talking, Gentle Timer | Yixiu`
- `Mountain Stream for Deep Work — 25 Minute Focus Sound`
- `A One-Minute Breathing Reset Between Meetings`

Every description starts with the matching intent URL. YouTube search uses title, description and video-content relevance; retention decides whether the promise is being fulfilled.

### Community listening, not promotion

Use Reddit and relevant question communities only to learn exact language and answer existing questions. Do not paste links into unrelated threads. Link to Yixiu only when a person explicitly asks for an iPhone app or a resource and the answer discloses that it is our product.

## Attribution names

Keep names stable for at least four weeks.

| Source | Medium | Campaign | Content example |
| --- | --- | --- | --- |
| google | organic | sleep_sounds | sleep_landing |
| youtube | organic_video | sleep_sounds | rain_window_01 |
| youtube | organic_video | focus_sounds | stream_25min_01 |
| youtube | organic_video | one_minute_reset | meeting_reset_01 |
| pinterest | organic_social | sleep_sounds | rain_pin_01 |
| reddit | community | sleep_sounds | helpful_reply_01 |
| share | referral | scene_share | rain_en |

The H5 records landing, playback, focus, share and download-click events with UTM context. App Store Campaign Links should be created once App Store Connect is signed in, using the same campaign names.

## Weekly operating cadence

### Monday — listen

- Read App Store Connect Acquisition: impressions, product-page views, first-time downloads and source.
- Read GA4 funnel by `utm_campaign`: landing → playback/focus → download click.
- Read the ten most relevant Search Console queries.

### Tuesday — make

- Produce one long useful listening video from an existing scene.
- Cut two vertical excerpts with distinct first-line hooks.

### Wednesday and Thursday — distribute

- Publish one YouTube video and one Short.
- Repurpose the strongest still and copy to Pinterest.
- Answer two relevant questions without forcing a link.

### Friday — learn

- Keep the best hook; stop the weakest one.
- Add one user phrase or objection to the matching landing page or App Store copy backlog.

## Decision rules

- Fewer than 20 landing visits: distribution problem; improve title/query match.
- Visits but fewer than 10% start a sound: promise-to-page mismatch.
- Sound starts but fewer than 8% click download: App value is unclear; improve CTA and iPhone benefits.
- App Store page views but low downloads: screenshot/title problem; test the matching custom product page when available.
- A content piece with first-time downloads gets two follow-ups before a new theme is introduced.

## First 30-day target

This is a learning target, not a vanity target:

- 12 English discovery pieces published
- 3 intent pages indexed
- 100 qualified intent-page visits
- 25 App Store click-throughs
- first 10 attributable downloads from at least two sources

The success condition is identifying one repeatable source × intent combination, not reaching a large follower count.

## Current implementation

- Main H5 metadata is English-first; non-Chinese devices default to English.
- Shared scenes retain scene/language and add source attribution.
- `/sleep-sounds/`, `/focus-sounds/` and `/one-minute-reset/` are production-ready.
- `robots.txt` and `sitemap.xml` expose the intent pages to search engines.
- Safari Smart App Banner metadata points to App ID `1461182261`.

## Blocked external step

App Store Connect Campaign Links could not be created because the browser session returned to Apple sign-in. After reauthentication, create three official links named `sleep_sounds`, `focus_sounds`, and `one_minute_reset`; use them for the primary CTA on the matching landing pages.
