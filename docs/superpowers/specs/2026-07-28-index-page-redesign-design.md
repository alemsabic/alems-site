# Index page redesign — design

**Date**: 2026-07-28
**Status**: approved, not yet implemented

## Purpose

The homepage (`content/index.md`) currently renders through the same three-column
`DefaultFrame` as every other content page: left sidebar (PageTitle, Tagline, Explorer),
empty center article, right sidebar (TOC, Graph, Backlinks), with RecentNotes and Comments
in `afterBody`. `index.md` itself carries no body content — the whole page is composed by
layout components.

For a Zettelkasten-style personal wiki, the homepage's job isn't "latest post first" (blog
model) — it's orientation: what is this, how much is here, how connected is it, and how do
I get to a specific note fast. The redesign reshapes the homepage around that job while
leaving every other page (and the underlying Explorer/Graph components used elsewhere)
untouched.

Scope: **`content/index.md` only**, addressed entirely through CSS scoped to
`body[data-slug="index"]`, one new condition (`is-index`), one new layout component, and
two i18n/config tweaks. No new page-frame or page-type plugin, no changes to how any other
page renders.

## 1. Single-column layout on `index`

Every rendered page already carries `data-slug` on `<body>`
(`quartz/components/renderPage.tsx:349`), so `body[data-slug="index"]` is a reliable,
build-time-free CSS hook — no plugin work needed.

In `custom.scss`, scoped to that selector:

- Collapse `#quartz-body`'s grid to a single column (`grid-template-areas: "grid-header"
  "grid-center" "grid-footer"`), mirroring the pattern the built-in `full-width` page frame
  already uses (`quartz/styles/base.scss:316-333`) — same technique, just condition-scoped
  by slug instead of by `data-frame`.
- Hide `.sidebar.left` and `.sidebar.right` (`display: none !important`). Their components
  (PageTitle, Tagline, Explorer, TOC, Graph, Backlinks) still mount in the DOM — the
  `DefaultFrame` doesn't know the page is single-column — but existing `not-index`/
  `is-index` conditions (see §3) keep the heaviest ones from rendering their data on this
  page at all.
- `.center` keeps its normal (non-full-width) max-width for the hero, graph, and
  recent-notes sections — **only** the new Index section (§4) breaks out wider. This was an
  explicit constraint from the design conversation: don't turn `index` into a full-bleed
  page, keep the reading measure consistent with every other page except where the
  alphabetical index genuinely needs the room.

## 2. Hero: Title + Tagline + Search

PageTitle and Tagline currently render in the (now-hidden) left sidebar. On `index` they
move into the center-column flow as the first thing on the page: top-left aligned (not
centered), sized a step up from their current sidebar treatment but not a giant landing-page
hero — this stays a note archive, not a product page.

Search moves up to sit with the hero and gets more visual weight than its current toolbar
treatment: wider input, larger type. This was an explicit "make it prominent" ask; if it
reads as too heavy once built, it's a pure CSS tweak to back off, not a structural risk.

Exact pixel values are an implementation-time call (tuned live against the real design, not
pre-committed here) — the constraint that matters is: bigger than today, still left-aligned,
still clearly a note archive rather than a marketing hero.

## 3. Page order + the index-only Graph

Center-column order top to bottom: **Hero+Search → Graph → Recent Notes → A–Z Index.**

The existing Graph instance (right sidebar, `quartz.config.yaml:185`) shows only the
current page's neighbors (`localGraph`, depth 1) — useless on `index`, which has no body
content to link from in the traditional sense. Two changes:

- Add a **second** `@quartz-community/graph` plugin entry, positioned `afterBody`, priority
  lower than RecentNotes' `5` (so it renders first), with `options.localGraph.depth: -1`
  and a taller `.graph-outer` height for `index` specifically (it's the visual centerpiece
  here, not a 250px sidebar box). `depth: -1` means unlimited hops from the current
  page — since `index` sits at the hub of a well-linked wiki this reaches effectively all
  connected notes. It won't necessarily surface a fully isolated, unlinked note; that's a
  known, accepted limitation (see §7).
- Gate both Graph instances with the layout `condition` field: existing sidebar instance
  gets `condition: not-index` (same pattern already used on Breadcrumbs,
  `quartz.config.yaml:259`), new instance needs `condition: is-index` — which doesn't exist
  yet. Register it once in `quartz.ts`:

  ```ts
  import { registerCondition } from "./quartz/plugins/loader/conditions"
  registerCondition("is-index", (props) => props.fileData.slug === "index")
  ```

  This is a plain additive side-effect call, not a `loadQuartzLayout({ byPageType: ... })`
  override — it doesn't carry the whole-array-replace fragility that made `RecentNotes`
  bake its own slug check instead of using a `quartz.ts` override (see
  `CUSTOM-MODIFICATIONS.md`'s RecentNotes entry). Safe to add.

**Rename**: "Graphansicht" → "Graph" site-wide. Unlike Explorer, `@quartz-community/graph`
isn't forked into `local-plugins/` yet — it's installed straight from the registry. Reaching
its `de-DE.ts` locale means forking it in first (same process already used for Explorer),
unless it turns out to expose a locale/label override via `options` (check before forking —
see §6). Applies everywhere the component renders, not just `index`.

**Sizing**: the Graph heading (`.graph > h3`) is set to match `.recent-notes > h3` — which
is already sized to match the site's H1 (`1.75rem` / `3rem` at `min-width: 800px`,
`custom.scss`'s RecentNotes block). Both headings should end up visually identical in
weight now that Graph sits in the same center-column context as Recent Notes.

## 4. The Index: a new component, not a reused Explorer

The existing Explorer (`local-plugins/explorer`) is a client-hydrated, JSON-fetched,
collapsible **folder tree** — built for in-context navigation while reading a note, in the
sidebar, on every content page. It stays exactly as it is; nothing here touches it.

The homepage's directory is a different job: a flat, alphabetical, phone-book-style index
of every published note by title — deliberately ignoring folder location, because in a
Zettelkasten the title/link is the real access point, not the folder (this repo has exactly
one real subfolder, `Literatur`, everything else is flat already). It needs to look right at
today's ~24 notes and stay usable at hundreds.

**New local plugin**: `local-plugins/site-index`, component name `SiteIndex`.

- **Server-rendered at build time**, not client-hydrated. `allFiles` is already part of
  `QuartzComponentProps` (see `quartz/components/frames` / the `ContentPage` emitter) —
  every page-type plugin already receives the full, already-filtered (drafts/unpublished
  already excluded upstream) file list. `SiteIndex` reads `props.allFiles` directly, no
  content-index JSON fetch, no runtime tree-building. This is a meaningful advantage over
  the Explorer's approach at scale: page weight grows linearly with note count, but there's
  no client-side render cost that could get slow with hundreds of entries.
- **Only renders on `index`** — baked-in `if (props.fileData.slug !== "index") return null`,
  the same convention `RecentNotes` already established (see `CUSTOM-MODIFICATIONS.md`),
  for the same reason: more robust against future `afterBody` layout changes than a
  `quartz.ts` conditional wrapper.
- **Title resolution** must reuse the exact same `shortTitle`-fallback precedence already
  threaded through the other 4 locations noted in `CUSTOM-MODIFICATIONS.md` — this becomes
  a 5th place that must stay in sync, and the implementation plan needs to point at all 5
  explicitly so it doesn't quietly diverge.
- **Grouping**: by first letter of the resolved title, German alphabetization (ä→a, ö→o,
  ü→u for sorting purposes only — display keeps the real character). Titles starting with a
  digit or symbol fall into a leading `#` bucket (standard phone-book convention) —
  concrete only once real title data is checked; not expected to matter today given current
  content, but the bucket should exist so it doesn't silently drop entries later.
- **Excludes**: the `index` page's own entry; and, if `allFiles` turns out to include
  generated folder/tag listing pages alongside real content pages, those too (verify during
  implementation — current assumption is `allFiles` is content-only, matching what
  Explorer/Search/Graph already assume).

### Layout

- CSS multi-column: `columns: 3` desktop, `columns: 2` tablet, `columns: 1` mobile —
  matching the site's existing `$tablet`/`$mobile` breakpoints (`variables.scss`, 800px/
  1200px). Confirmed via mockup: 3 columns preferred over 2 at desktop width.
- Each letter group (`<h?>` header + its titles) gets `break-inside: avoid` so a short
  group never splits awkwardly across columns; a letter with unusually many entries is
  allowed to flow across columns rather than force a giant single block.
- Sticky A–Z jump nav pinned above the list: all 26 letters always shown, letters with zero
  entries rendered greyed-out/non-interactive rather than omitted — the nav visibly "fills
  in" as the note collection grows, which is a nice side effect of keeping it static instead
  of dynamically hiding empty letters.
- **Width breakout**: this is the one section on `index` that does *not* keep the standard
  center reading width — it widens toward the page's outer container max-width (desktop
  breakpoint + 300px = 1500px, per `variables.scss`), since with sidebars gone that space is
  otherwise unused and a 3-column phone-book grid genuinely needs it. Hero/Graph/Recent
  Notes stay narrow above it — a deliberate editorial contrast (narrow prose, wide
  reference table), confirmed against mockups.
- **No inline filter/search box.** The site's existing global Search already serves "I know
  what I'm looking for"; a second filter field inside the index would duplicate it. The
  index is for "let me see everything" — pure alphabetical browse, no client JS required to
  serve that job.

## 5. Deliberately untouched

- **Comments**: already disables itself via `index.md`'s frontmatter (`comments: false`) —
  no config change needed.
- **Breadcrumbs / ContentHeader**: already `condition: not-index` / `showContentHeader:
  false` in `index.md`'s frontmatter — already correct for this redesign.
- **Explorer** (sidebar, all other pages): untouched, no fork changes.

## 6. Files touched

- `quartz.config.yaml` — second Graph plugin entry (index-only), `condition: not-index` on
  the existing Graph entry, Hero/Search layout position tweaks.
- `quartz.ts` — one `registerCondition("is-index", …)` call.
- `quartz/styles/custom.scss` — `body[data-slug="index"]` single-column override, hero/
  search sizing, Graph heading size-match, `SiteIndex` column/jump-nav/breakout styling.
- `local-plugins/graph`'s locale (or wherever `@quartz-community/graph`'s `de-DE.ts` lives
  once inspected — may require forking the plugin into `local-plugins/` the same way
  Explorer was forked, purely to reach its locale file; confirm during implementation
  whether the community package exposes an options-based override instead) —
  "Graphansicht" → "Graph".
- **New**: `local-plugins/site-index/` — new component package, modeled on the structure of
  `local-plugins/recent-notes` (simplest existing precedent: single-purpose, index-only,
  baked-in slug check, own `de-DE.ts`).

## 7. Known limitations / accepted trade-offs

- `localGraph.depth: -1` from `index` shows everything **reachable by link** from the
  homepage, not literally every file on disk. A fully orphaned, unlinked note wouldn't
  appear. Accepted for now; revisit only if it turns out to matter in practice once real
  content grows.
- Sidebar components (Explorer, TOC, Backlinks) still mount in the DOM on `index` even
  though hidden — `DefaultFrame` doesn't know the page is visually single-column. Explorer
  and Backlinks already/will carry `not-index`-style conditions where it's cheap to add one;
  TOC has nothing to show on `index` anyway (no headings in an empty article body) so it's
  harmless as-is.
- Exact hero/search pixel sizing intentionally left as an implementation-time call rather
  than specified in advance — the design conversation settled on direction ("bigger,
  prominent, but still an archive not a landing page"), not exact values.
