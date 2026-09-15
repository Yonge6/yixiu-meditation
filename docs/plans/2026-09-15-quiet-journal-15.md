# Quiet Journal 15 Articles Implementation Plan

**Goal:** Expand the existing four articles to fifteen complete bilingual articles and publish the H5 column.

**Architecture:** Keep the current JSON source, reading drawer, category filters and static generator. Add eleven original editorial notes, without native App, pricing, entitlement or layout changes. Preserve the four existing slugs and dates. New articles use 2026-09-15 and verified Free practice targets.

**Tech Stack:** JSON, React, existing static generator, Playwright, Nginx.

## Editorial design

Prefer a balanced evergreen collection over eleven similar bedtime notes or an all-product FAQ. Final categories: four rest notes, four focus notes, four small pauses and three guides. Each new article has four concrete sections, Chinese and natural English copy, an accurate CTA, existing licensed artwork and honest 1–2 minute reading labels. No fabricated personal testimony, research claims, sleep guarantees or fake social-source IDs.

## Steps

1. Add regression tests in `yixiu-prototype/tests/quiet-journal.spec.ts` for 15 entries, category counts, full bilingual bodies, all static routes/metadata/CTAs and last-card scroll reachability. Run the count test against the four-article baseline and confirm failure.
2. Add eleven entries to `yixiu-prototype/src/data/quiet-journal.json`: afternoon pause, bedside setup, no need for all-night playback; opening work, breaks away from feeds, comparing background sounds; morning, arriving home, rest without streaks; favorites/privacy and timer/bell guidance.
3. Run `npm run build:journal`, `npm run build`, `npm run test:sites`, `npm run test:journal`. Generated files: `public/journal/**`, journal blocks only in `public/sitemap.xml` and `public/llms.txt`. Check actual image dimensions and unique slugs, and review the diff for unrelated changes.
4. Inspect the built drawer, category filters and short-viewport scrolling. Preserve uninterrupted playback while reading and Free/Plus boundaries.
5. Push/merge scoped changes, create immutable release archive, deploy with existing guarded Nginx script and rollback backup. Recheck remote main immediately before deployment to avoid overwriting concurrent work.
6. Verify 15 cards and all 30 public bilingual article routes, titles, canonical/hreflang, CTA language/scene and images. Record the release and public acceptance in the Yixiu growth log. No App Store submission or social publication is part of this request.
