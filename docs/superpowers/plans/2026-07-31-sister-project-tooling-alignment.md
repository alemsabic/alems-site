# Sister Project Tooling Alignment (Phase 0) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring gpunkt.org's MCP tooling and documentation structure to parity with ale.ms, and record the sister-project relationship in both repos' `CLAUDE.md`, without touching either repo's Quartz code, `docs/` (stock upstream docs), or `content/` (auto-synced).

**Architecture:** Pure config/doc changes across two independent git repos (`/Users/alemsabic/Desktop/ale.ms`, `/Users/alemsabic/Desktop/gpunkt.org`). No shared file, no automation — each repo gets its own `.mcp.json` and `CLAUDE.md`, cross-referencing the other by absolute local path. gpunkt.org additionally gets a new `CUSTOM-MODIFICATIONS.md` (doesn't exist yet) and loses its stale `AGENTS.md`.

**Tech Stack:** Markdown, JSON (`.mcp.json`), `uvx`-based MCP servers (`jdocmunch-mcp`, `jcodemunch-mcp`) — no new dependencies, no code changes.

## Global Constraints

- Never touch `content/` in either repo (auto-synced from a separate content repo; edits are overwritten).
- Never touch `docs/` (stock upstream Quartz documentation) in either repo.
- In gpunkt.org: never `git add -A` / `git add .` — stage specific files only.
- gpunkt.org stays on Quartz v4.5.1 for this plan — no version bump, no code changes. The actual v4→v5 migration is a separate later effort (Phase 1) and is explicitly out of scope here.
- If a custom-modification mechanism can't be confidently verified from the current code, flag it back to the user rather than guessing — do not invent behavior in documentation.

---

### Task 1: Copy MCP server config to gpunkt.org and verify it works

**Files:**
- Create: `/Users/alemsabic/Desktop/gpunkt.org/.mcp.json`

**Interfaces:**
- Produces: a working project-scoped MCP config gpunkt.org sessions will pick up on next Claude Code start — no other task depends on its exact contents beyond "the file exists and both servers respond."

- [ ] **Step 1: Create the file with the exact content of ale.ms's `.mcp.json`**

Write `/Users/alemsabic/Desktop/gpunkt.org/.mcp.json`:

```json
{
  "mcpServers": {
    "jdocmunch": {
      "type": "stdio",
      "command": "uvx",
      "args": [
        "jdocmunch-mcp"
      ],
      "env": {}
    },
    "jcodemunch": {
      "type": "stdio",
      "command": "uvx",
      "args": [
        "jcodemunch-mcp"
      ],
      "env": {}
    }
  }
}
```

- [ ] **Step 2: Verify the JSON is well-formed**

Run: `python3 -m json.tool /Users/alemsabic/Desktop/gpunkt.org/.mcp.json`
Expected: pretty-printed JSON echoed back, no parse error.

- [ ] **Step 3: Verify the MCP servers actually respond from gpunkt.org**

Start (or ask the user to start, if this task is run by a background subagent without an interactive session) a Claude Code session rooted at `/Users/alemsabic/Desktop/gpunkt.org`, then call `mcp__jcodemunch__index_local` (or the equivalent tool) against `/Users/alemsabic/Desktop/gpunkt.org/quartz`.
Expected: the tool returns an index result, not a "server not found" / connection error. This confirms the `.mcp.json` is actually wired up, not just syntactically valid.

- [ ] **Step 4: Commit**

```bash
cd /Users/alemsabic/Desktop/gpunkt.org
git add .mcp.json
git commit -m "chore: add jdocmunch/jcodemunch MCP servers (sister-project parity with ale.ms)"
```

---

### Task 2: Write gpunkt.org's `CUSTOM-MODIFICATIONS.md`

**Files:**
- Create: `/Users/alemsabic/Desktop/gpunkt.org/CUSTOM-MODIFICATIONS.md`

**Interfaces:**
- Consumes: the researched mechanism descriptions below (already verified against gpunkt.org's actual source in `quartz/components/scripts/footnotes.inline.ts`, `quartz/components/Body.tsx`, `quartz/plugins/transformers/citations.ts`, `quartz/util/fileTrie.ts`, `quartz/util/ctx.ts`, `quartz/plugins/emitters/contentIndex.tsx`, `quartz.config.ts`, `quartz/styles/custom.scss`).
- Produces: a `CUSTOM-MODIFICATIONS.md` that Task 3's `CLAUDE.md` will point to.

- [ ] **Step 1: Write the file**

Write `/Users/alemsabic/Desktop/gpunkt.org/CUSTOM-MODIFICATIONS.md`:

```markdown
# Custom Modifications (gpunkt.org)

Every behavior in this repo that deviates from stock Quartz v4.5.1. Read this before editing any
of the files listed below, and before starting the v4→v5 migration (each item here needs to be
re-verified or re-ported during that migration).

**Sister project**: [[ale.ms|/Users/alemsabic/Desktop/ale.ms]] has already migrated to Quartz v5
and documented the same categories of custom behavior in its own `CUSTOM-MODIFICATIONS.md`. Where
noted below, ale.ms's version has diverged (evolved further, or become obsolete under v5) — check
there before assuming gpunkt.org's version is still the target shape post-migration.

## Footnote Highlighting

**Files**: `quartz/components/scripts/footnotes.inline.ts` (whole file, 66 lines),
`quartz/components/Body.tsx:2-19` (wires the script into `Body.afterDOMLoaded`).

On every SPA `nav` event, `highlightFootnote()` reads `window.location.hash`. If it starts with
`#user-content-fn-`, it adds a `.footnote-highlighted` class to the matching `<li>` (clearing any
previous highlight first) — a manual re-implementation of CSS `:target` styling, needed because
`:target` doesn't reliably re-fire across Quartz's client-side navigation. It also listens for
`hashchange` and for clicks on `a[href^="#user-content-fn-"]` (10ms `setTimeout` to let the browser
scroll first), registered via `window.addCleanup` for correct SPA teardown. The same handler also
renames the "Footnotes" `<h2>` to German "Fußnoten", and injects a "Quellen" `<h2>` into the
`#refs.references.csl-bib-body` bibliography block if one isn't already present. Styling for
`.footnote-highlighted` lives in `quartz/styles/custom.scss` (paired 1:1 with the `:target`
selector, ~lines 505-513 and ~640).

**Why**: book-style highlight-on-click footnote UX, plus German section headings for a
German-language dictionary site.

## Popover Behavior (Citations plugin fork)

**File**: `quartz/plugins/transformers/citations.ts:44-83`.

A full local fork of the `Citations` transformer plugin (wraps `rehype-citation`). After running
`rehypeCitation`, a second `unist-util-visit` pass walks the HTML AST and sets
`data-no-popover: true` on (a) any `<a href="#bib...">` (bibliography backlinks) and (b) any `<a>`
whose parent is a `<sup>` (footnote reference markers) — suppressing Quartz's default hover-preview
popover on same-page anchors, since previewing "the bottom of the current page" is meaningless. The
same pass also HTML-entity-decodes the `data-tooltip` attribute (`&amp;`, `&quot;`, etc. → literal
characters) so citation tooltip text renders correctly. The plugin's `Options` interface adds
`showTooltips` / `tooltipAttribute`, passed straight through to `rehype-citation`.

**Why**: same-page anchor popovers are useless; `showTooltips`/tooltip-decoding power the
hover-tooltips on `(Author, Year)` citation spans.

**Diverges from ale.ms**: ale.ms splits this into two separate local-plugin forks by concern
(`sup > a` suppression lives in its GFM/footnotes fork; tooltip handling lives in its citations
fork; bib-link popover suppression is left to stock upstream). Don't assume a 1:1 file mapping when
porting this during migration.

## Short Title Support

**Files**: `quartz/util/fileTrie.ts:4-9` (`FileTrieData.shortTitle`), `:31-38` (`displayName`
getter), `quartz/util/ctx.ts:18-23` (`BuildTimeTrieData.shortTitle`), `:35-50`
(`trieFromAllFiles()` extraction), `quartz/plugins/emitters/contentIndex.tsx:12-23`
(`ContentDetails.shortTitle`), `:96-122` (emit loop, reads `file.data.frontmatter?.shortTitle`).

Adds an optional `shortTitle` frontmatter field threaded through three build-time data structures.
`fileTrie.ts`'s `displayName` getter resolves
`displayNameOverride ?? (shortTitle ?? title) ?? fileSegmentHint ?? slugSegment`, falling back
cleanly when absent — powers server-rendered Explorer/Breadcrumbs. `ctx.ts` extracts it when
building the trie from all files. `contentIndex.tsx` threads it into the client-fetched
`contentIndex.json`.

**Why**: per inline comment, "for Zotero sources" — long imported bibliographic titles (e.g. a full
German book title) get a compact nav display like "Ahrens (2017)", while the full title still shows
in the page's own H1.

**⚠️ Known gap vs. ale.ms — check before/during migration**: ale.ms's version of this feature
touches **6 places, not 3** — beyond the three above, it also required matching `shortTitle`
fallback logic in a client-side `FileTrieNode` rebuild (`explorer.inline.ts`), a homepage
"phone-book" site index, and `RecentNotes.tsx`. ale.ms found this gap late (fixed in `RecentNotes`
as of 2026-07-31) — any component that independently reads `allFiles` and rebuilds its own list
needs the identical fallback, or short titles silently fail to appear there. gpunkt.org doesn't
currently have those extra components, but if the migration adds an Explorer sidebar rebuild, a
homepage index, or a "recent notes" list (all likely, since ale.ms's are being ported per the
sister-project plan), re-check each one for this exact bug.

## German Locale (Citations plugin config)

**File**: `quartz.config.ts:18` (`configuration.locale: "de-DE"`), `:94-102` (Citations plugin
invocation).

The `Citations` plugin is configured with
`lang: "https://raw.githubusercontent.com/citation-style-language/locales/master/locales-de-DE.xml"`
— a hardcoded URL pointing directly at the German CSL locale XML, rather than letting the plugin
derive it. Also sets `csl: "apa"`, `showTooltips: true`, `tooltipAttribute: "data-tooltip"`,
`linkCitations: false`, `suppressBibliography: false`.

**Why**: produces German-formatted citations/bibliography (German connectives, date/name ordering)
matching the site's German content.

**⚠️ Obsolete under v5 — do not re-add during migration**: ale.ms's `CUSTOM-MODIFICATIONS.md`
documents this exact manual locale-URL construction as "the old v4-era hack," now obsolete —
`@quartz-community/citations` under v5 auto-derives the correct CSL locale from
`configuration.locale: de-DE` alone. When gpunkt.org migrates, this hardcoded `lang:` URL should be
deleted, not carried forward.

## Zotero Styling

**File**: `quartz/styles/custom.scss` — three blocks:
- Dictionary-entry footnotes (~lines 444-518): compact spacing, orange (`#ee683d`, light) /
  neon-green (`#39ff14`, dark) footnote markers and superscript links, `.footnote-highlighted` /
  `:target` background highlight, hidden backrefs. Scoped to `article.dictionary-entry`.
- Global bibliography (~lines 520-556): `.csl-entry` hanging indent, popover suppression on
  `sup a`, hidden backrefs.
- Citation span + tooltip system (~lines 640-731): dotted underline, `cursor: help`, opacity fade,
  plus a pure-CSS `[data-tooltip]` tooltip via `content: attr(data-tooltip)` on `::after`
  (`:hover`-triggered, no JS), themed via a `[saved-theme="..."]` attribute selector. Comment
  credits the rehype-citation demo project as the source pattern.

**Why**: book-like typographic treatment for dictionary-entry content (no `↩` backlinks, colored
footnote markers, hanging-indent bibliography), plus zero-JS citation tooltips.

**Diverges from ale.ms**: ale.ms's Zotero styling covers substantially more surface — 8 highlight
color classes (`mark.hltr-*`, light/dark variants), a full `article.literature-note` design system
(lettered highlight numbering, `Abb. N` figure captions), and a skeuomorphic 3D book-cover effect
for Zotero book covers. **None of that exists in gpunkt.org** (`grep -E "hltr|literature-note|book-cover" quartz/styles/custom.scss` returns nothing). gpunkt.org's content model (a dictionary) apparently doesn't use Zotero "literature notes" the way ale.ms's Zettelkasten does — confirm with the gpunkt-woerter content repo before assuming this feature gap needs closing during migration; it may be correctly out of scope for this site.
```

- [ ] **Step 2: Verify the file was written correctly**

Run: `grep -c "^## " /Users/alemsabic/Desktop/gpunkt.org/CUSTOM-MODIFICATIONS.md`
Expected: `5` (one heading per modification: Footnote Highlighting, Popover Behavior, Short Title
Support, German Locale, Zotero Styling).

- [ ] **Step 3: Commit**

```bash
cd /Users/alemsabic/Desktop/gpunkt.org
git add CUSTOM-MODIFICATIONS.md
git commit -m "docs: document gpunkt.org's custom Quartz modifications

Previously only listed by filename in AGENTS.md (being retired). Documents
mechanism and rationale for each, plus known divergences from ale.ms's
already-migrated v5 versions, ahead of gpunkt.org's own v4->v5 migration."
```

---

### Task 3: Write gpunkt.org's `CLAUDE.md` and delete `AGENTS.md`

**Files:**
- Create: `/Users/alemsabic/Desktop/gpunkt.org/CLAUDE.md`
- Delete: `/Users/alemsabic/Desktop/gpunkt.org/AGENTS.md`

**Interfaces:**
- Consumes: `CUSTOM-MODIFICATIONS.md` from Task 2 (referenced by path).
- Produces: nothing later tasks depend on programmatically — this is the terminal doc for gpunkt.org in this plan.

- [ ] **Step 1: Write the new `CLAUDE.md`**

Write `/Users/alemsabic/Desktop/gpunkt.org/CLAUDE.md`:

```markdown
# Claude Code Instructions - Quartz Repository (gpunkt.org)

## Sister Project

This project and **ale.ms** (`/Users/alemsabic/Desktop/ale.ms`) are both Quartz-based sites
maintained by the same person, kept in close alignment on purpose. ale.ms has already migrated to
Quartz v5 and carries a more mature MCP/doc setup (`jdocmunch` + `jcodemunch`, this same
`CLAUDE.md` / `CUSTOM-MODIFICATIONS.md` / `upgrade.md` structure) — gpunkt.org's is being brought
to parity. When you land an improvement in one project's tooling, config conventions, or reusable
component (not content), consider whether it should be ported to the other. gpunkt.org's own
v4→v5 migration is planned separately (see "Project status" below) and will draw directly on
ale.ms's `upgrade.md`.

---

## ⚠️ Important: Two-Repository Architecture

This repository handles **PRESENTATION ONLY** (Quartz static site generator).

**Content is managed separately**:

- Content Repository: https://github.com/alemsabic/gpunkt-woerter
- Auto-syncs to this repo's `content/` folder via a GitHub Action in the content repo, on every
  push to its `main` branch.
- **DO NOT edit files in `content/` directly** — changes will be overwritten by the next sync.
- If that content-repo workflow hardcodes a target branch (as ale.ms's sister workflow does — see
  ale.ms's `CLAUDE.md`), and this repo's production branch ever changes, the workflow must be
  updated in the same session — it fails silently otherwise.

### Repository Focus

- ✅ Design, styling, layout, Quartz configuration, UI components
- ❌ Content (managed in the separate repo above)

---

## Project status

Running **Quartz v4.5.1**. Still on the pre-migration architecture (`quartz.config.ts` +
`quartz.layout.ts`, no `local-plugins/` fork directory, no `quartz.lock.json`). A v4→v5 migration
mirroring ale.ms's is planned as a separate effort, informed directly by ale.ms's `upgrade.md`
(which has a "Phase I" checklist of gotchas to carry over so they don't need rediscovering) and by
this repo's own `CUSTOM-MODIFICATIONS.md` (documents what must be re-verified or re-ported).
Explicitly gated on the user being present and giving the go-ahead — don't start it unattended.

---

## Doc Exploration Policy (jDocMunch)

This project registers the `jdocmunch` MCP server (project-scoped, `.mcp.json`) for token-efficient
navigation of real documentation sets — e.g. the upstream [Quartz docs](https://github.com/jackyzha0/quartz)
or any other sizeable third-party docs needed while working on this repo. It indexes doc-like files
(Markdown, RST, HTML, OpenAPI specs, etc.) by section instead of requiring full-file reads.

**When to use it**:

- Before exploring an external documentation set (Quartz's own docs, a plugin's docs, a new
  dependency) — `index_repo` (GitHub) or `index_local` (on disk) first, then `search_sections` /
  `get_toc` to find the relevant part.
- To pull specific content once located — use `get_section` (or `get_sections` for several) with
  the section ID, rather than opening the whole file.

**Not for**: this repo's own `CLAUDE.md`, `CUSTOM-MODIFICATIONS.md`, or `README.md` — those are
kept small deliberately and should just be `Read` directly.

This is a manual convention, not an enforced hook. Use judgment: reach for jDocMunch specifically
when indexing genuine external documentation, not this repo's own short files.

---

## Code Exploration Policy (jCodeMunch)

This project also registers the `jcodemunch` MCP server (project-scoped, `.mcp.json`) alongside
jDocMunch. Where jDocMunch indexes _documentation_ (prose, by section), jCodeMunch indexes _source
code_ (TypeScript/JS, by symbol — functions, classes, components, byte-accurate) via tree-sitter.

**Reach for jCodeMunch (not raw `Read`/grep) in these situations**:

- **Before editing any file `CUSTOM-MODIFICATIONS.md` calls out** — `quartz/util/fileTrie.ts`,
  `quartz/util/ctx.ts`, `quartz/plugins/transformers/citations.ts`,
  `quartz/components/scripts/footnotes.inline.ts`, `quartz/plugins/emitters/contentIndex.tsx`.
  Run `find_references` / `get_blast_radius` on the symbol you're about to touch before editing it.
- **When locating where a symbol, component, or type is defined or used anywhere under `quartz/`**,
  instead of grepping across dozens of files by hand. Use `search_symbols` / `find_references`.
- **Before deleting or renaming any exported symbol in `quartz/`** — run `check_delete_safe` first.
- **When exploring an unfamiliar part of the Quartz internals for the first time** — `index_local`
  the relevant directory, then query it rather than opening whole files cold.

**Not for**: this repo's own `CLAUDE.md`/`CUSTOM-MODIFICATIONS.md`/`README` (small, just `Read`
them); the `content/` folder (Markdown content, not code, out of scope per the two-repo
architecture above); trivial edits where the exact file and line are already known and no
ripple-effect risk exists.

---

## Project Overview

- **Name**: gpunkt.org
- **Type**: Static site generator using Quartz v4.5.1
- **Live Site**: https://gpunkt.org

### Key Commands

- **Dev server**: `npx quartz build --serve` (http://localhost:8080)
- **Build**: `npx quartz build`
- **Check types**: `npm run check`
- **Format code**: `npm run format`
- **Tests**: `npm run test` (Node.js test runner, files live next to source as `*.test.ts`)

---

## Deployment

**Platform**: Cloudflare Pages

- **Repository**: https://github.com/alemsabic/gpunkt-site
- **Branch**: `v4` — current production branch.
- **Build Command**: `npx quartz build`
- **Output Directory**: `public`
- **Deploy Time**: 1-2 minutes after push

---

## Custom Modifications

**See `CUSTOM-MODIFICATIONS.md` at the repo root** for every behavior that deviates from stock
Quartz — footnote highlighting, citation-popover suppression, `shortTitle` support, German-locale
citations, and Zotero/dictionary-entry styling. Read it before editing any of the files it lists,
or before starting the v4→v5 migration.

---

## Notes

- Site rebuilds automatically in dev mode (`--serve`) when files change.
- Custom styling goes in `quartz/styles/custom.scss`.
- Git safety: never `git add -A` / `git add .` in this repo — stage specific files only.
```

- [ ] **Step 2: Delete `AGENTS.md`**

```bash
rm /Users/alemsabic/Desktop/gpunkt.org/AGENTS.md
```

- [ ] **Step 3: Verify the old file is gone and the new one exists**

Run: `ls /Users/alemsabic/Desktop/gpunkt.org/CLAUDE.md /Users/alemsabic/Desktop/gpunkt.org/AGENTS.md 2>&1`
Expected: `CLAUDE.md` path printed, `AGENTS.md` path errors with "No such file or directory".

- [ ] **Step 4: Commit**

```bash
cd /Users/alemsabic/Desktop/gpunkt.org
git add CLAUDE.md
git add -u AGENTS.md
git commit -m "docs: replace AGENTS.md with CLAUDE.md for sister-project parity with ale.ms

AGENTS.md referenced a CLAUDE.md that never existed in this repo (stale
leftover). Still-valid conventions are redistributed into the new CLAUDE.md
and CUSTOM-MODIFICATIONS.md."
```

---

### Task 4: Add reciprocal Sister Project section to ale.ms's `CLAUDE.md`, verify, and wrap up

**Files:**
- Modify: `/Users/alemsabic/Desktop/ale.ms/CLAUDE.md` (insert a new section near the top, after the
  `## ⚙️ How this file is maintained` section and before `## ⚠️ Important: Two-Repository
  Architecture`)

**Interfaces:**
- Consumes: nothing from earlier tasks — independent edit to the other repo.
- Produces: nothing further consumes this; last task in the plan.

- [ ] **Step 1: Insert the Sister Project section into ale.ms's `CLAUDE.md`**

Find the line `---` that immediately precedes `## ⚠️ Important: Two-Repository Architecture` in
`/Users/alemsabic/Desktop/ale.ms/CLAUDE.md`, and insert this new section directly before it (i.e.
after the "How this file is maintained" section's closing `---`):

```markdown
## Sister Project

This project and **gpunkt.org** (`/Users/alemsabic/Desktop/gpunkt.org`) are both Quartz-based
sites maintained by the same person, kept in close alignment on purpose. gpunkt.org is still on
Quartz v4.5.1 and follows this same `CLAUDE.md` / `CUSTOM-MODIFICATIONS.md` structure (ported over
for parity — see gpunkt.org's own `CLAUDE.md` and `CUSTOM-MODIFICATIONS.md`). When you land an
improvement here — tooling, config conventions, a reusable component (not content) — consider
whether it should be ported to gpunkt.org too. gpunkt.org's v4→v5 migration is planned as a
separate effort that will draw directly on this repo's `upgrade.md`.

---
```

- [ ] **Step 2: Verify the section was inserted correctly and didn't break the file**

Run: `grep -n "^## Sister Project\|^## ⚠️ Important: Two-Repository Architecture" /Users/alemsabic/Desktop/ale.ms/CLAUDE.md`
Expected: two lines printed, `Sister Project` appearing at a lower line number than `Two-Repository
Architecture`, confirming order and that both headings still exist intact.

- [ ] **Step 3: Verify gpunkt.org's type-check still passes (this plan touched no code, confirm nothing broke)**

```bash
cd /Users/alemsabic/Desktop/gpunkt.org
npm run check
```

Expected: exits 0 (no TypeScript or Prettier errors). This plan didn't modify any `quartz/**`
source, so a failure here indicates pre-existing repo state, not this plan's changes — surface it
to the user rather than trying to fix unrelated issues.

- [ ] **Step 4: Commit ale.ms's change**

```bash
cd /Users/alemsabic/Desktop/ale.ms
git add CLAUDE.md
git commit -m "docs: add reciprocal Sister Project section pointing to gpunkt.org"
```

---

## Self-Review Notes

- **Spec coverage**: all 5 components from the design spec map 1:1 to tasks — `.mcp.json` (Task 1),
  `CUSTOM-MODIFICATIONS.md` (Task 2), gpunkt.org `CLAUDE.md` + `AGENTS.md` deletion (Task 3),
  reciprocal ale.ms section (Task 4). Verification steps from the spec (MCP servers actually
  exercised, `npm run check`, user reads both `CLAUDE.md`s) are embedded in Tasks 1 and 4 — the
  "user reads both files" verification happens naturally via the per-task commit-review checkpoint
  under subagent-driven execution.
- **No `upgrade.md` for gpunkt.org**: correctly absent from this plan, per spec's explicit
  deferral to Phase 1.
- **Guardrails**: no task touches `content/` or `docs/`; Task 3/4 commits use targeted `git add`,
  never `-A`/`.`.
