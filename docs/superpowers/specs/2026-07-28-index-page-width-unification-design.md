# Index page width unification — design

**Date**: 2026-07-28
**Status**: approved
**Follow-up to**: `docs/superpowers/specs/2026-07-28-index-page-redesign-design.md` (§1's
narrow-hero/wide-index split is the thing this doc revises) and the "Next up" note in
`CLAUDE.md`.

## Purpose

The original index redesign deliberately kept Hero/Graph/Recent Notes at a ~46rem centered
reading width and let only the Site Index break out to the page's wide container
(`calc(1200px + 300px)` = 1500px). Seen live, this reads as two pages stitched together —
a narrow blog-post-width top half, a full-width reference-table bottom half — rather than
one design. This doc unifies the outer container width top to bottom; visual variety comes
from per-section internal layout instead of varying the outer width.

Scope: `body[data-slug="index"]` CSS only, in `quartz/styles/custom.scss`. No component,
plugin, or config changes.

## 1. Shared outer width

The existing breakout width (`calc(#{map.get($breakpoints, desktop)} + 300px)`, i.e. 1500px)
becomes the max-width for every section on the page — Hero (`.page-header`), the Graph +
Recent Notes area, and `.site-index` (already there, unchanged). This replaces the current
46rem cap on `.page-header` and the graph/recent-notes wrapper.

## 2. Hero stays compact, now left-aligned

Hero content (Title, Tagline, Search) keeps its current 46rem inner max-width — it stays a
compact text block, not stretched to fill 1500px — but switches from `margin: auto`
(centered in the old narrow container) to `margin-left: 0` (pinned to the left edge of the
new wide container). Net visual effect: the hero moves from center-of-page to top-left,
matching where a page title conventionally sits.

## 3. Graph + Recent Notes side by side

`.page-footer` becomes a two-column CSS grid at desktop width: Graph larger (`1.5fr`),
Recent Notes narrower (`1fr`). `.site-index` gets `grid-column: 1 / -1` to span both columns
full-width below them, unchanged otherwise. Below the `$tablet` breakpoint (≤1200px,
matching the breakpoint the Site Index's own column-count already uses), the grid collapses
back to a single column — Graph, then Recent Notes, then Site Index, stacked in DOM order.

## 4. The `<hr>` divider

Currently capped at 46rem to match the old narrow sections. Simplest change: let it follow
the new shared 1500px width along with everything else — no separate rule needed.

## 5. Files touched

`quartz/styles/custom.scss`'s `body[data-slug="index"]` block only. No changes to
`quartz.config.yaml`, `quartz.ts`, or any `local-plugins/*` package.
