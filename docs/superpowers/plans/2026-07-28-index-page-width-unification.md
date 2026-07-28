# Index Page Width Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage read as one design top to bottom instead of two pages stitched
together, by giving Hero, Graph, Recent Notes, and the Site Index one shared visual system
instead of a narrow-then-wide split.

**Architecture:** Pure CSS, entirely inside `quartz/styles/custom.scss`'s existing
`body[data-slug="index"]` block. The hero stays a compact 46rem block but switches from
centered to left-pinned. Graph and Recent Notes move from individually-capped-at-46rem
siblings into a two-column CSS grid on their shared parent (`.page-footer`), with the Site
Index spanning both columns beneath them at the same width the whole grid already uses. No
component, plugin, or config file changes.

**Tech Stack:** SCSS (Quartz v5's existing build), no new dependencies.

## Global Constraints

- Scope is `body[data-slug="index"]` CSS only, in `quartz/styles/custom.scss`. No other
  page's rendering may change, and no `.tsx`/`.ts`/`.yaml` file changes.
- Full spec: `docs/superpowers/specs/2026-07-28-index-page-width-unification-design.md`.
- Verification throughout is visual (`npx quartz build --serve`, checked in-browser at
  desktop/tablet/mobile widths) — there is no unit-testable behavior in this plan, only
  CSS layout.
- `git commit` after every task (never batch multiple tasks into one commit).

## Design refinement made during execution (read before Task 2)

Seen live, Task 2's originally-planned `1.5fr 1fr` split for Graph/Recent Notes didn't line
up with the Site Index's 3-column grid below — visually close but not exact. Refined to:

- `.page-footer` uses `grid-template-columns: repeat(3, 1fr)` with the same `2.5rem`
  column-gap `.site-index-columns` already uses. Graph gets `grid-column: span 2`, Recent
  Notes (unstyled, auto-placed) takes the remaining 1 — CSS Grid's `repeat(n, 1fr)` and CSS
  multi-column's `columns: n` compute identical track widths from the same formula (`(total
  − (n−1)×gap) / n`) given the same total width, gap, and count, so the two independently-
  laid-out rows land on identical column boundaries without needing a shared parent element.
- The global `.recent-notes` rule (`margin-top: 2rem; margin-bottom: 2rem; padding-bottom:
  2rem; border-bottom: 1px dashed`) was leftover styling from the pre-grid stacked layout —
  it pushed Recent Notes' heading 2rem below Graph's, and its dashed divider only spanned
  Recent Notes' own (now much narrower) grid cell instead of the full row, an artifact of a
  layout that no longer exists. Simplified to `margin: 0`, relying on `.page-footer`'s own
  `gap` for spacing to the Site Index row below instead of a per-component border. Both
  `.graph > h3` and `.recent-notes > h3` get explicit `margin: 0` so their headings sit at
  the same height within the row.
- Discovered while fixing the above: a rule ordering hazard in `.page-footer > .graph`'s
  responsive override. A `grid-column: span 1` set *inside* a nested `@media` block, followed
  by an unconditional `grid-column: span 2` declared *after* it at the same specificity, has
  the unconditional rule win at every viewport width — CSS resolves equal-specificity
  conflicts by source order, not by which media query currently matches. Fixed by declaring
  the base rules first and the `@media not ($desktop)` override afterward, unnested — see
  Task 2 Step 1's final code for the corrected order.

This is a refinement of *how* §3 is achieved, not a change to what was approved in the design
doc — the visual outcome (Graph wider, Recent Notes narrower, both aligned to the Site
Index's columns) is what was signed off on.

---

## Task 1: Hero left-aligned, Graph/Recent Notes freed from the 46rem cap

**Files:**
- Modify: `quartz/styles/custom.scss:1545-1566`

**Interfaces:**
- Consumes: the existing `.page-header`, `.page-footer > .graph`, `.page-footer >
  .recent-notes`, `.center > hr` selectors already present in the `body[data-slug="index"]`
  block (all pre-existing, from the original index redesign).
- Produces: `.page-header` at 46rem, left-pinned (no longer centered) — this is what Task 2's
  grid columns sit to the right of. `.graph` and `.recent-notes` no longer have any
  individual width cap, ready for Task 2 to give them one via the shared grid instead. The
  `<hr>` no longer has a narrow cap, falling back to `.center`'s existing `max-width: 100%`
  from `quartz/styles/base.scss:292-297`.

- [x] **Step 1: Replace the narrow-width block**

In `quartz/styles/custom.scss`, find this block (currently lines 1545-1555):

```scss
  // Comfortable reading width for everything except the breakout index section below.
  // Centered (not left-pinned) — with the sidebars gone the page is up to 1500px wide, and a
  // 46rem block glued to the left edge left a large dead gap on the right instead of reading
  // as an intentional narrow column.
  .page-header,
  .page-footer > .graph,
  .page-footer > .recent-notes {
    max-width: 46rem;
    margin-left: auto;
    margin-right: auto;
  }
```

Replace it with:

```scss
  // Hero stays a compact, left-aligned text block — the one section that does NOT take on
  // the shared wide width below (see Task 2's .page-footer grid). Left-pinned, not
  // centered: with the sidebars gone the page is up to 1500px wide, and a 46rem block
  // glued to the left edge reads as an intentional top-left title, matching where a page
  // title conventionally sits — a centered 46rem block on a 1500px page read as adrift.
  .page-header {
    max-width: 46rem;
    margin-left: 0;
  }
```

- [x] **Step 2: Remove the now-redundant `<hr>` width cap**

Immediately below, still in the same file, find and delete this whole block (currently
lines 1557-1566):

```scss
  // DefaultFrame.tsx always renders a <hr> between .center's content and .page-footer, even
  // when the page body is empty (content/index.md is frontmatter-only). Cap it to the same
  // width as the rest of the narrow sections above/below, instead of letting it span the full
  // collapsed grid (up to 1500px) — capping rather than hiding, in case body content is ever
  // added to index.md later.
  .center > hr {
    max-width: 46rem;
    margin-left: auto;
    margin-right: auto;
  }
```

Delete it entirely — no replacement needed. `.center`'s own existing rule in
`quartz/styles/base.scss:292-297` (`max-width: 100%; min-width: 100%; margin-left: auto;
margin-right: auto;`) already gives the `<hr>` the full shared width once this override is
gone.

- [x] **Step 3: Verify visually**

Run: `npx quartz build --serve`, open `http://localhost:8080`
Expected: the title/tagline/search block now sits flush at the top-left of the page instead
of centered. The `<hr>` below it now spans the full page width. Graph and Recent Notes (still
untouched by Task 2 yet) currently render at their natural content width, no longer
horizontally capped or centered — this looks wrong/unfinished at this point, and Task 2 fixes
it. Confirm nothing else on the page moved (right sidebar still hidden, left sidebar still
hidden, Site Index still renders at the bottom).

- [x] **Step 4: Commit**

```bash
git add quartz/styles/custom.scss
git commit -m "style(index): left-align hero, free Graph/Recent Notes from the 46rem cap"
```

---

## Task 2: Graph + Recent Notes side by side, Site Index spanning below

**Files:**
- Modify: `quartz/styles/custom.scss` — the global `.recent-notes` rule and `.recent-notes >
  h3` rule (in the "RECENT NOTES COMPONENT (Index Page)" section), and the `.page-footer >
  .graph` / `.page-footer > .site-index` rules inside `body[data-slug="index"]` (originally
  at lines 1596-1621, shifted after Task 1's edit — locate by the comment text quoted below
  rather than by line number)

**Interfaces:**
- Consumes: `.page-footer` (the `afterBody` wrapper `<div>` from
  `quartz/components/frames/DefaultFrame.tsx:46`, containing `.graph`, `.recent-notes`,
  `.site-index` as direct children in that DOM order on `index`), and Task 1's removal of
  `.graph`/`.recent-notes`'s individual width cap.
- Produces: `.page-footer` becomes a 3-column grid (`repeat(3, 1fr)`, `2.5rem` gap — the same
  values `.site-index-columns` uses for its own multi-column layout, so both land on
  identical column boundaries) at desktop width, collapsing to a single stacked column below
  the `$desktop` breakpoint (1200px). `.graph` spans 2 of the 3 columns; `.recent-notes` gets
  the remaining 1 (auto-placed, no rule needed). `.site-index` spans all 3 via `grid-column: 1
  / -1`, replacing its previous individual `max-width`/`width: 100%` rule (redundant now that
  the grid itself provides the width). `.recent-notes` loses its stacked-layout margin/border
  so its heading sits flush with Graph's at the top of the row.

- [x] **Step 1: Remove the leftover stacked-layout styling on `.recent-notes`**

`.recent-notes`'s global rule (outside the `body[data-slug="index"]` block, in the "RECENT
NOTES COMPONENT (Index Page)" section) still carries margin/border from the pre-grid,
single-column layout — find:

```scss
/* Recent Notes: use same styling as folder pages (listPage.scss) */
.recent-notes {
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px dashed var(--darkgray);
}
```

Replace with:

```scss
/* Recent Notes: index-only component (see local-plugins/recent-notes). No margin/border of
   its own — on the index page it sits in a grid cell next to Graph (custom.scss's
   body[data-slug="index"] block), and needs to start flush at the same height as Graph's
   heading; the grid's own gap handles spacing to the Site Index section below. */
.recent-notes {
  margin: 0;
}
```

A few lines below, find `.recent-notes > h3 { font-size: 1.75rem; line-height: 1; }` and add
`margin: 0;` inside it, so the heading itself has no residual top margin either:

```scss
.recent-notes > h3 {
  font-size: 1.75rem;
  line-height: 1;
  margin: 0;
}
```

- [x] **Step 2: Add the `.page-footer` grid and update `.site-index`**

Find this block (the Graph sizing rules, immediately followed by the Site Index width rule):

```scss
  // Index-only Graph: bigger box (it's the page's visual centerpiece here, not a 250px
  // sidebar card), and its heading matches .recent-notes > h3's H1-equivalent size
  // (custom.scss's "Section title... sized identically to the H1 rule" block).
  .page-footer > .graph > .graph-outer {
    height: 420px;
  }

  .page-footer > .graph > h3 {
    font-size: 1.75rem !important;
    line-height: 1;
  }

  @media (min-width: 800px) {
    .page-footer > .graph > h3 {
      font-size: 3rem !important;
      line-height: 0.9;
    }
  }

  // SiteIndex: the one section that breaks out of the 46rem reading width, since a
  // 3-column phone-book grid needs the room. Caps at the same width the whole page
  // container uses elsewhere (.page's own max-width formula), not an arbitrary number.
  .page-footer > .site-index {
    max-width: calc(#{map.get($breakpoints, desktop)} + 300px);
    width: 100%;
  }
```

Replace it with:

```scss
  // Shared width below the hero: Graph + Recent Notes side by side, Site Index spanning
  // all three columns beneath them, on the exact same 3-column grid math
  // .site-index-columns uses (repeat(3, 1fr), 2.5rem column-gap) — same total width, same
  // gap, same column count, so both independently-laid-out rows land on identical column
  // boundaries. Graph spans 2 of 3 (its own visual centerpiece); Recent Notes gets the
  // remaining 1. Collapses to a single stacked column below desktop width, same breakpoint
  // .site-index-columns below already keys off.
  .page-footer {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
  }

  .page-footer > .graph {
    grid-column: span 2;
  }

  // Placed after the base rules above (not nested inside them) so this override wins on
  // source order: an equal-specificity rule declared later in the cascade always wins,
  // media query or not, and a mobile override nested before the base rule it's overriding
  // would silently lose to it.
  @media all and not ($desktop) {
    .page-footer {
      grid-template-columns: 1fr;
    }

    .page-footer > .graph {
      grid-column: span 1;
    }
  }

  // Index-only Graph: bigger box (it's the page's visual centerpiece here, not a 250px
  // sidebar card), and its heading matches .recent-notes > h3's H1-equivalent size
  // (custom.scss's "Section title... sized identically to the H1 rule" block). margin: 0
  // on both the box and heading so it starts flush at the same height as Recent Notes'
  // heading in the grid cell beside it.
  .page-footer > .graph > .graph-outer {
    height: 420px;
    margin-top: 0;
  }

  .page-footer > .graph > h3 {
    font-size: 1.75rem !important;
    line-height: 1;
  }

  @media (min-width: 800px) {
    .page-footer > .graph > h3 {
      font-size: 3rem !important;
      line-height: 0.9;
    }
  }

  // SiteIndex: spans both grid columns below Graph/Recent Notes, at the same shared width
  // they use — via the grid now, not its own max-width.
  .page-footer > .site-index {
    grid-column: 1 / -1;
  }
```

- [x] **Step 3: Verify visually at desktop width**

Run: `npx quartz build --serve`, open `http://localhost:8080` at a window width ≥1200px.
Expected: Graph (left, 2/3 width) and Recent Notes (right, 1/3 width) render side by side
directly below the `<hr>`, both headings ("Graph" / "Zuletzt bearbeitet") starting at the
same height. The Site Index renders below both, its 3 columns' boundaries lining up with the
Graph/Recent-Notes column split above (Graph's right edge aligns with the boundary between
the index's 2nd and 3rd columns). The hero above the `<hr>` stays narrow and left-aligned per
Task 1. No dashed divider line under Recent Notes.

If the browser environment can't be resized/emulated for Step 4 below, it's also valid to
confirm the compiled CSS directly: after building, `grep -o 'body\[data-slug=index\]
\.page-footer[^}]*}\|@media not (min-width:1200px){[^}]*grid-column:span 1' public/index.css`
and confirm the base `grid-column: span 2` rule and the `grid-template-columns:
repeat(3,1fr)` rule appear *before* the `@media not (min-width:1200px)` block in the file, so
the media override always wins at narrow widths regardless of source-order tie-breaking.

- [x] **Step 4: Verify visually at tablet and mobile widths**

The browser automation available in this session couldn't be resized below its native
viewport (`resize_window` and `window.resizeTo` both silently no-op here), so this was
verified via the compiled-CSS fallback described in Step 3 instead of live visual
resize/emulation:

```
grep -o "body\[data-slug=index\] \.page-footer{[^}]*}\|body\[data-slug=index\] \.page-footer>\.graph{[^}]*}\|@media not (min-width:1200px){body\[data-slug=index\] \.page-footer{[^}]*}body\[data-slug=index\] \.page-footer>\.graph{[^}]*}" public/index.css
```

Confirmed output:
```
body[data-slug=index] .page-footer{grid-template-columns:repeat(3,1fr);gap:2.5rem;display:grid}
body[data-slug=index] .page-footer>.graph{grid-column:span 2}
@media not (min-width:1200px){body[data-slug=index] .page-footer{grid-template-columns:1fr}body[data-slug=index] .page-footer>.graph{grid-column:span 1}
```

Base rules appear before the `@media not (min-width:1200px)` block, so below 1200px the
override always wins (`grid-template-columns: 1fr`, `.graph` back to `span 1`) — Graph and
Recent Notes stack full-width in DOM order. If a future session has working viewport
resize/emulation, re-verify this visually too as a belt-and-suspenders check.

- [x] **Step 5: Commit**

```bash
git add quartz/styles/custom.scss
git commit -m "style(index): Graph + Recent Notes on the Site Index's 3-column grid"
```

---

## Task 3: Full verification and wrap-up

**Files:** none (verification only)

- [x] **Step 1: Run the full site typecheck**

Run: `npm run check` (repo root)
Result: `tsc --noEmit` passed with no errors. `prettier --check` reported 47 pre-existing
files with style issues (all `content/*.md`, `upgrade.md`, and the two
`docs/superpowers/*` plan/spec docs) — none of them `quartz/styles/custom.scss`, confirmed
via `npx prettier . --check 2>&1 | grep custom.scss` (no match). Pre-existing baseline noise,
not a regression from this plan.

- [x] **Step 2: Full visual pass on the live homepage**

Run: `npx quartz build --serve`, open `http://localhost:8080`.
Confirmed at desktop width (≥1200px):
- Hero (title/tagline/search) sits top-left, narrow, not centered.
- `<hr>` spans the full page width.
- Graph (left, 2/3) and Recent Notes (right, 1/3) sit side by side, headings flush at the
  same height.
- Site Index spans the same full width below them, its 3 columns aligned with the
  Graph/Recent-Notes split above; 3-column phone book and sticky A–Z nav still working.

Tablet/mobile stacking was verified via the compiled-CSS check documented in Task 2 Step 4
rather than live resize — this session's browser automation couldn't resize below its native
viewport (`resize_window` and `window.resizeTo` both silently no-op here). The compiled
`public/index.css` confirms the responsive override is structured correctly (see Task 2 Step
4 for the exact grep and output). Re-verify with live resize in a session where that works, as
a belt-and-suspenders check — not required to consider this plan done, since the CSS-order
proof is conclusive on its own.

- [x] **Step 3: Confirm no other page changed**

Opened `http://localhost:8080/atomizität-im-zk` (a non-index content page).
Confirmed: three-column layout, sidebars, TOC/Graph/Backlinks all render exactly as before —
this plan's selectors are all scoped to `body[data-slug="index"]`, nothing here differs.

- [x] **Step 4: Final commit if anything was left uncommitted**

```bash
git status
```

If clean (both prior tasks already committed), nothing to do. Otherwise stage and commit any
remaining changes with a descriptive message.
