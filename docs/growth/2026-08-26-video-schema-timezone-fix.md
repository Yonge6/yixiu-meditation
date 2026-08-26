# Video schema timezone fix — 2026-08-26

## Google evidence

Google Search Console URL Inspection reported that `https://yixiu.wonderelian.com/river-sounds-for-studying/` is indexed. Its detected `VideoObject` was valid but had two non-critical issues:

- `uploadDate` had an invalid date-time value.
- `uploadDate` was missing timezone information.

The report showed the last successful crawl at 2026-08-25 07:04:01.

## Authoritative timestamps

The existing public videos were not edited or re-uploaded. Their publication timestamps were read from the official YouTube Atom feed for WonderElian channel `UCHVg9xxzgUvu4GPRZYeQ1Vg`:

- Mountain stream `lfDiI0TAq1c`: `2026-08-24T16:54:29+00:00`.
- Ocean focus `2nJUyIr9EOY`: `2026-08-24T10:50:56+00:00`.
- Rain sleep `8LJoPKN3CO4`: `2026-08-24T15:08:09+00:00`.

## Source correction

The matching `VideoObject.uploadDate` values now use those complete ISO 8601 timestamps on:

- `/river-sounds-for-studying/`
- `/mountain-stream-sounds-for-focus/`
- `/ocean-waves-for-focus/`
- `/sleep-sounds/`

The sitemap `lastmod` values for the three pages changed in this revision were updated to 2026-08-26. The sleep page already had that date.

## Verification

- Mobile runtime integrity: 28 protected files passed.
- TypeScript: passed.
- Vite production build: passed.
- Sites package preparation: passed.
- Site tests: 26/26 passed, including exact timestamp assertions.
- `git diff --check`: passed.

This record proves the source correction only. Production deployment and a subsequent Search Console recrawl are separate acceptance gates.
