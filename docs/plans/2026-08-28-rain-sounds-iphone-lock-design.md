# Rain Sounds When iPhone Locks — Design

## Outcome

Publish a focused English guide at `/rain-sounds-when-iphone-locked/` that answers a distinct iPhone troubleshooting intent, lets visitors test real rain immediately, and offers an attributable path to the Yixiu Sleep custom product page. The page must stay truthful, useful without an app download, and separate from the existing `/sleep-sounds/` sleep-listening intent.

## Options considered

1. Expand the existing sleep page FAQ. This is small, but the answer remains buried on a page optimized for a different query.
2. Publish on Medium. This could add a third-party discovery surface, but the official account is not logged in and account creation is outside the current authorization.
3. Add a dedicated Yixiu guide. This creates a crawlable answer, preserves the existing sleep page's primary intent and keeps every change inside the Yixiu project.

Option 3 is selected.

## Page and content architecture

- Route: `/rain-sounds-when-iphone-locked/`
- Primary query: `rain sounds when iPhone locks`
- H1: `How to keep rain sounds playing when your iPhone locks`
- The opening answer explains Apple's built-in Background Sounds path first and links to the official Apple support guide.
- A visible ordered walkthrough covers Apple Background Sounds and Yixiu separately.
- The comparison is neutral: Apple's built-in option is quickest and needs no app; Yixiu is useful when the listener wants its real nature recordings, 15/30/60-minute timer, favorites, bilingual interface, no account and no ads.
- A real Window Rain preview uses the existing `light-rain.m4a`, shared player and shared timer behavior.
- Related links connect the guide to `/sleep-sounds/`, rain reading/study pages and other sleep sounds without replacing their intent.
- The existing sleep page and Guides hub link back to the new guide.

## Search and structured data

- One self-canonical URL, one H1, a 50–60 character title and 150–160 character description.
- `TechArticle`, `HowTo`, `SoftwareApplication`, `ImageObject` and visible `FAQPage` content stay aligned with the rendered page.
- The page includes `datePublished` and `dateModified` as August 28, 2026 and a visible updated date.
- The sitemap receives a dated, high-priority entry; the Guides `ItemList` grows from 18 to 19.

## Conversion and measurement

- Preview placement: `rain_lock_screen_preview`.
- Primary App Store placement: `rain_lock_screen_landing`.
- Post-preview placement: `rain_lock_screen_after_preview`.
- All App Store links use the verified Sleep CPP identifier `67cb8784-2b16-4849-b940-90fdf4d99752` and the existing Apple campaign parameters.
- No download, sleep-quality or medical outcome is claimed.

## Proof gates

- Static tests verify metadata length, schema/content parity, official Apple source, audio, timer, canonical, internal links and attributed App Store URLs.
- Runtime tests verify one-tap playback, timer state, post-play CTA and 390 px overflow.
- Runtime lock, production build and all site tests must pass.
- Production acceptance requires HTTP 200, expected HTML markers, matching local/public hashes, playable audio range requests and IndexNow HTTP 200.
- This release is an acquisition improvement, not proof of the 100-UV completion gate. Only a completed Beijing natural day in GA4 can satisfy that gate.
