# Local fork: graph

Forked from https://github.com/quartz-community/graph at commit
`411971434ab698c495dfc42870eb02d3bc539b3a` (main branch, 2026-07-28).

## Patch applied (`src/i18n/locales/de-DE.ts`)

Renamed the German locale's Graph heading from "Graphansicht" to "Graph" — shorter, same
meaning. No `options`-based override exists for this (confirmed against the upstream
package's `optionSchema`, which only exposes `localGraph`/`globalGraph`), so forking was the
only way to change it.

To refresh against upstream: diff this against a fresh clone, re-apply the same one-line
locale string change to `src/i18n/locales/de-DE.ts`.
