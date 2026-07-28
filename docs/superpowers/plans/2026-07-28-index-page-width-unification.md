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

- [ ] **Step 1: Replace the narrow-width block**

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

- [ ] **Step 2: Remove the now-redundant `<hr>` width cap**

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

- [ ] **Step 3: Verify visually**

Run: `npx quartz build --serve`, open `http://localhost:8080`
Expected: the title/tagline/search block now sits flush at the top-left of the page instead
of centered. The `<hr>` below it now spans the full page width. Graph and Recent Notes (still
untouched by Task 2 yet) currently render at their natural content width, no longer
horizontally capped or centered — this looks wrong/unfinished at this point, and Task 2 fixes
it. Confirm nothing else on the page moved (right sidebar still hidden, left sidebar still
hidden, Site Index still renders at the bottom).

- [ ] **Step 4: Commit**

```bash
git add quartz/styles/custom.scss
git commit -m "style(index): left-align hero, free Graph/Recent Notes from the 46rem cap"
```

---

## Task 2: Graph + Recent Notes side by side, Site Index spanning below

**Files:**
- Modify: `quartz/styles/custom.scss` (the `.page-footer > .graph` / `.page-footer >
  .site-index` rules, originally at lines 1596-1621, shifted after Task 1's edit — locate by
  the comment text quoted below rather than by line number)

**Interfaces:**
- Consumes: `.page-footer` (the `afterBody` wrapper `<div>` from
  `quartz/components/frames/DefaultFrame.tsx:46`, containing `.graph`, `.recent-notes`,
  `.site-index` as direct children in that DOM order on `index`), and Task 1's removal of
  `.graph`/`.recent-notes`'s individual width cap.
- Produces: `.page-footer` becomes a 2-column grid (`1.5fr 1fr`) at desktop width, collapsing
  to a single stacked column below the `$desktop` breakpoint (1200px, same breakpoint
  `.site-index-columns` already keys off). `.site-index` spans both columns via `grid-column:
  1 / -1`, replacing its previous individual `max-width`/`width: 100%` rule (redundant now
  that the grid itself provides the width).

- [ ] **Step 1: Add the `.page-footer` grid and update `.site-index`**

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
  // both columns beneath them — one width for the whole lower half of the page instead of
  // narrow-then-wide. Graph gets more room (it's the page's visual centerpiece); Recent
  // Notes is a short list and doesn't need as much. Collapses to a single stacked column
  // below desktop width, same breakpoint .site-index-columns below already keys off.
  .page-footer {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 2.5rem;

    @media all and not ($desktop) {
      grid-template-columns: 1fr;
    }
  }

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

  // SiteIndex: spans both grid columns below Graph/Recent Notes, at the same shared width
  // they use — via the grid now, not its own max-width.
  .page-footer > .site-index {
    grid-column: 1 / -1;
  }
```

- [ ] **Step 2: Verify visually at desktop width**

Run: `npx quartz build --serve`, open `http://localhost:8080` at a window width ≥1200px.
Expected: Graph (left, wider) and Recent Notes (right, narrower) render side by side directly
below the `<hr>`. The Site Index renders below both, spanning the same full width the
Graph+Recent Notes row uses — no visible width mismatch between the row above and the index
below. The hero above the `<hr>` stays narrow and left-aligned per Task 1.

- [ ] **Step 3: Verify visually at tablet and mobile widths**

Resize the browser window (or use device emulation) to a width between 800px and 1200px,
then below 800px.
Expected: at both widths, Graph and Recent Notes stack vertically (Graph first, then Recent
Notes, matching their DOM order), each at full available width — no leftover 2-column grid
artifacts. The Site Index's own 2-column (tablet) / 1-column (mobile) behavior is unaffected
(it was already responsive; this task doesn't touch that part).

- [ ] **Step 4: Commit**

```bash
git add quartz/styles/custom.scss
git commit -m "style(index): Graph + Recent Notes side by side, Site Index spans below"
```

---

## Task 3: Full verification and wrap-up

**Files:** none (verification only)

- [ ] **Step 1: Run the full site typecheck**

Run: `npm run check` (repo root)
Expected: no new type errors (this plan touches only `.scss`, so this is a regression check,
not expected to catch anything new).

- [ ] **Step 2: Full visual pass on the live homepage**

Run: `npx quartz build --serve`, open `http://localhost:8080`.
Check, at desktop width:
- Hero (title/tagline/search) sits top-left, narrow, not centered.
- `<hr>` spans the full page width.
- Graph (left, larger) and Recent Notes (right, smaller) sit side by side.
- Site Index spans the same full width below them, unchanged from before this plan
  (3-column phone book, sticky A–Z nav, all still working).

Then resize down through tablet and mobile widths and confirm Graph/Recent Notes stack
correctly and nothing overlaps or overflows horizontally.

- [ ] **Step 3: Confirm no other page changed**

Open a non-index content page (e.g. any note under `/content`) at `http://localhost:8080`.
Expected: three-column layout, sidebars, TOC/Graph/Backlinks all render exactly as before —
this plan's selectors are all scoped to `body[data-slug="index"]`, so nothing here should
differ.

- [ ] **Step 4: Final commit if anything was left uncommitted**

```bash
git status
```

If clean (both prior tasks already committed), nothing to do. Otherwise stage and commit any
remaining changes with a descriptive message.
