# Local fork: og-image

Forked from https://github.com/quartz-community/og-image at commit
`73dae18d4df526126d65288339f583394959b836` (main branch, 2026-07-26).

## Patch applied (`src/emitter.tsx`)

Fixed a stock v5 bug (not a v4-vs-v5 regression — `CustomOgImages` was disabled in v4 since Sept
2025 for an unrelated Satori font-rendering error, so this bug was never visible before): the
title and `pageTitleSuffix` get concatenated with no separator (`"indexAlem Šabić's Notizen und
Quellen"`), same bug already fixed in core `quartz/components/Head.tsx`. Applied the identical
conditional `" - "` separator fix here.

**Found via real visual inspection**: opened a generated `*-og-image.webp` file directly in the
browser and saw the garbled title text. The original font-rendering bug this plugin was disabled
for appears fixed in v5 — fonts render cleanly, no corruption.

Not touched: the OG image's `readingTimeText` still says "X min read" in English regardless of
site locale (a `readingTimeText` option exists but takes a function, so it'd need a `quartz.ts`
override or another fork to localize) — cosmetic, out of scope since this text never existed in a
"correct" v4 state to match (the feature was off). Flagged here in case it's worth polishing later.

To refresh against upstream: diff this against a fresh clone, re-apply the same separator fix to
the `title` computation in `src/emitter.tsx`.
