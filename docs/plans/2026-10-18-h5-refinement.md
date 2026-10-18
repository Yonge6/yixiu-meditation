# H5 deep-water refinement Implementation Plan

> Execute in the existing release worktree; preserve unrelated native/store changes.

**Goal:** Bring H5 closer to the App's refined deep-water presentation, then deploy and read back production.

**Architecture:** App-owned CSS only, with semantic React markup retained. Preserve full-bleed photography, bounded swipes, all playback/access/privacy behavior, dismissible download banner and the conventional full-width web tab bar. No new assets, tracking, subscriptions, dependencies or native changes.

**Tech Stack:** React, existing self-hosted Noto type, CSS, Playwright regression tests, guarded nginx release script.

## Design

Prefer a restrained native-adjacent polish over either an unrelated light editorial redesign or a simulated iOS navigation capsule. Unify translucent surfaces, quiet hairlines, white/aqua hierarchy, comfortable type, optical spacing and primary/secondary button emphasis. Desktop library gets a bounded reading width; narrow screens keep compact header controls and 16px search inputs. Reduced-motion users retain their existing motion protections.

## Steps

1. Capture production baselines and inspect App-owned styles. Add `tests/ui-refinement.spec.ts` covering 320px English, 390px Chinese, desktop and short landscape; screenshots plus geometry/interaction assertions.
2. Refine `src/prototype.css`: header/player, web tabs, library cards and tools, Focus controls and Me surfaces. Record the durable user direction in `AGENTS.md`. Do not edit protected mobile runtime files.
3. Run runtime integrity, TypeScript/production build, Node behavior/asset tests, Sites worker tests and focused responsive browser checks. Compare screenshots and fix visual/geometry failures before release.
4. Package the exact `dist/client` output with `COPYFILE_DISABLE=1`, checksum it and upload to the existing Yixiu server. Execute the existing guarded deployment script using a unique release ID with recoverable backup.
5. Verify public index and hashed CSS/JS match the build, then repeat production browser interactions/screenshots. Save release evidence and report the public URL, not just the local preview.
