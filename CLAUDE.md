# Claude Code Instructions - Quartz Repository (ale.ms)

## ⚙️ How this file is maintained

This file holds **only durably-true facts about the current state of the project** — config,
architecture, conventions, policies. It is read at the start of every session, so keep it lean and
current, not a historical record.

**Does NOT belong here** (put it elsewhere, or delete it once it's done its job):

- Session-by-session update logs ("Session 16 Updates...") → belongs in git commit messages.
- In-progress migration/project status → belongs in `upgrade.md` (or wherever the relevant runbook
  lives) while active; once finished, replace with a one-line pointer here, don't keep the play-by-play.
- Resolved TODOs, closed bugs, decisions already made → delete once resolved, don't leave a
  checked-off trail. Git history has the trail if anyone needs it.
- One-time debugging narratives ("Issue → Root Cause → Alternatives Considered → Resolution") →
  belongs in a commit message or a dedicated runbook (`upgrade.md`). If the _outcome_ is a rule that
  must survive future refactors, that rule belongs in **`CUSTOM-MODIFICATIONS.md`**, stated plainly,
  not narrated.

**Does belong here**: what's true right now (config, file structure, deployment setup), policies
that apply to every session (jDocMunch/jCodeMunch usage), and pointers to where the detailed,
change-prone stuff actually lives.

---

## Sister Project

This project and **gpunkt.org** (`/Users/alemsabic/Desktop/gpunkt.org`) are both Quartz v5 sites
maintained by the same person, kept in close alignment on purpose — both follow this same
`CLAUDE.md` / `CUSTOM-MODIFICATIONS.md` / `upgrade.md` structure. gpunkt.org's own v4→v5 migration
(replayed from this repo's `upgrade.md`) is complete. When you land an improvement here — tooling,
config conventions, a reusable component (not content) — consider whether it should be ported to
gpunkt.org too, and vice versa.

---

## ⚠️ Important: Two-Repository Architecture

This repository handles **PRESENTATION ONLY** (Quartz static site generator).

**Content is managed separately**:

- Content Repository: https://github.com/alemsabic/alems-notizen
- Local path: `/Users/alemsabic/Desktop/MEMEX/NOTIZEN/`
- Auto-syncs to this repo's `content/` folder via a GitHub Action in the content repo
  (`.github/workflows/sync-to-quartz.yml`) on every push to its `main` branch.
- **DO NOT edit files in `content/` directly** — changes will be overwritten by the next sync.
- **That workflow hardcodes the target branch** (currently checks out this repo's `v5` branch to
  sync into). If this repo's production branch ever changes again, that workflow file must be
  updated in the _same_ session — it fails silently (green checkmark, no error) if left pointing at
  a branch nothing serves anymore; the only symptom is content changes never appearing live.
- **`QUARTZ_REPO_TOKEN` secret (lives in `alems-notizen`, not here):** authenticates that workflow's
  checkout of this repo. Last set 2025-10-09, still working as of 2026-08-01 — but the identical
  setup in gpunkt.org's content repo (`gpunkt-woerter`) expired silently in that window (two pushes,
  no error but for the Actions tab, content just never arrived). Worth checking this one isn't quietly
  approaching the same expiry, and worth doing so *before* it fails, not after. **TODO, no deadline:**
  same fix as gpunkt.org — replace with a fine-grained PAT scoped to `alems-notizen` →
  `alems-site`, `Contents: Read and write` only, instead of whatever broader personal token is
  currently in that secret.

### Repository Focus

- ✅ Design, styling, layout, Quartz configuration, UI components, local plugin forks
- ❌ Content (managed in the separate repo above)

---

## Project status

Running **Quartz v5.0.0**. The v4 → v5 migration (config format, plugin architecture, every custom
behavior re-ported) is complete — `v5` is this repo's live, deployed branch (both Cloudflare Pages'
production branch and this repo's GitHub default branch). `v4` still exists but is no longer built
or served. Full migration history, every bug found and fixed, and the exact deploy-cutover sequence
live in **`upgrade.md`** — read it if you need archaeology on _why_ something is built the way it is,
not for what's true today (that's this file, plus `CUSTOM-MODIFICATIONS.md`).

gpunkt.org's own v4→v5 migration (which drew on `upgrade.md`'s "Phase I" checklist of gotchas found
here) is complete and live — see gpunkt.org's own `CLAUDE.md` for its current state.

---

## Doc Exploration Policy (jDocMunch)

This project registers the `jdocmunch` MCP server (project-scoped, `.mcp.json`) for token-efficient navigation of real documentation sets — e.g. the upstream [Quartz docs](https://github.com/jackyzha0/quartz) or any other sizeable third-party docs needed while working on this repo. It indexes doc-like files (Markdown, RST, HTML, OpenAPI specs, etc.) by section instead of requiring full-file reads.

**When to use it**:

- Before exploring an external documentation set (Quartz's own docs, a plugin's docs, a new dependency) — `index_repo` (GitHub) or `index_local` (on disk) first, then `search_sections` / `get_toc` to find the relevant part.
- To pull specific content once located — use `get_section` (or `get_sections` for several) with the section ID, rather than opening the whole file.

**Not for**: this repo's own CLAUDE.md, `CUSTOM-MODIFICATIONS.md`, `upgrade.md`, or README.md — those are kept small deliberately and should just be `Read` directly.

This is a manual convention, not an enforced hook — no PreToolUse/PostToolUse hooks are installed for this repo, so nothing blocks a direct `Read`. Use judgment: reach for jDocMunch specifically when indexing genuine external documentation, not this repo's own short files.

---

## Code Exploration Policy (jCodeMunch)

This project also registers the `jcodemunch` MCP server (project-scoped, `.mcp.json`) alongside jDocMunch. Where jDocMunch indexes _documentation_ (prose, by section), jCodeMunch indexes _source code_ (TypeScript/JS, by symbol — functions, classes, components, byte-accurate) via tree-sitter. Don't confuse the two: a Quartz upstream `.md` doc goes through jDocMunch; a Quartz upstream or local `.ts`/`.tsx` file goes through jCodeMunch.

**You MUST reach for jCodeMunch (not raw `Read`/grep) in these situations:**

- **Before editing any file `CUSTOM-MODIFICATIONS.md` calls out as shared/fragile infrastructure** — `quartz/util/fileTrie.ts`, `quartz/util/ctx.ts` (both core), and any file inside `local-plugins/citations/`, `local-plugins/content-index/`, `local-plugins/explorer/`, `local-plugins/github-flavored-markdown/`, or `local-plugins/site-scripts/`. This repo has a documented history of custom modifications threaded across multiple files that must stay in sync (footnote highlighting, tooltip decoding, `shortTitle` fallback across 5 locations, German locale citations — see `CUSTOM-MODIFICATIONS.md`). Run `find_references` / `get_blast_radius` on the symbol you're about to touch before editing it, so a change doesn't silently break one of these previously-hard-won fixes elsewhere.
- **When locating where a symbol, component, or type is defined or used anywhere under `quartz/` or `local-plugins/`**, instead of grepping across dozens of files by hand. Use `search_symbols` / `find_references`.
- **Before deleting or renaming any exported symbol in `quartz/` or a `local-plugins/*` fork** — run `check_delete_safe` first rather than assuming it's unused.
- **When exploring an unfamiliar part of the Quartz internals for the first time** (e.g. chasing a `npm run check` type error into upstream Quartz plugin code, or understanding a component's call chain before extending it) — `index_local` the relevant directory, then query it rather than opening whole files cold.

**Not for**: this repo's own CLAUDE.md/CUSTOM-MODIFICATIONS.md/README (small, just `Read` them); the `content/` folder (Markdown content, not code, and out of scope per the two-repo architecture above — if you ever need to inspect it, `Read`/grep is fine); trivial edits where the exact file and line are already known and no ripple-effect risk exists.

This is a manual convention like the jDocMunch policy above — no enforcement hooks are installed, nothing blocks a direct `Read`. But given this repo's track record of cross-file regressions on Quartz updates, defaulting to jCodeMunch's reference/blast-radius checks before touching shared files is the safer habit, not an optional nicety.

---

## Project Overview

- **Name**: alems-site
- **Type**: Static site generator using Quartz v5.0.0
- **Purpose**: ale.ms - Quellenangaben und Schulungsunterlagen von Alem Sabic
- **Live Site**: https://ale.ms

### Key Commands

- **Dev server**: `npx quartz build --serve` (runs on http://localhost:8080)
- **Build**: `npx quartz plugin install --from-config && npx quartz build` (the `--from-config` flag
  matters — see `CLAUDE.md`'s Deployment section and `upgrade.md`'s Phase H for why)
- **Check types**: `npm run check`
- **Format code**: `npm run format`
- **`local-plugins/*` source edits need a rebuild + full server restart, not just a save.** Each
  fork ships from its own `dist/` (built via `tsup`), and a running `--serve` process loads that
  `dist/` once at startup — it never rebuilds or hot-reloads it. `quartz/styles/custom.scss` is the
  exception: it hot-reloads live. After editing any `local-plugins/*/src/**`, run `npm install &&
npm run build` inside that plugin's own directory (its `node_modules` may not be installed yet),
  then kill and restart the dev server — otherwise it keeps serving the old compiled behavior
  indefinitely. See `CUSTOM-MODIFICATIONS.md`'s "Bases/Canvas file badges" entry for a worked
  example of this biting twice in one session.

---

## File Structure

```
ale.ms/
├── content/                  # ⚠️ AUTO-SYNCED from alems-notizen - DO NOT EDIT!
├── quartz.config.yaml        # Main configuration: theme, plugins, layout positions
├── quartz.ts                 # Optional TS-only override entry point (currently minimal —
│                              # see CUSTOM-MODIFICATIONS.md before assuming a quartz.ts override
│                              # will "just work" for a given plugin, it doesn't for all of them)
├── quartz.lock.json          # Installed-plugin lockfile (pins local + remote plugin versions)
├── local-plugins/            # Our forks of quartz-community plugins + a couple of new
│                              # component-only plugins — see each one's FORK_NOTES.md
├── quartz/                   # Core Quartz (mostly stock; a few direct edits — see
│                              # CUSTOM-MODIFICATIONS.md — plus quartz/styles/custom.scss)
├── public/                   # Built site output (auto-generated, gitignored)
├── CUSTOM-MODIFICATIONS.md   # Every behavior that deviates from stock Quartz — read before
│                              # editing shared/fragile files or upgrading Quartz
└── upgrade.md                # Full v4→v5 migration history/runbook
```

---

## Current Configuration

**Site Identity**:

- Page title: "ale.ms"
- Tagline text: configurable via `quartz.config.yaml`'s `tagline` plugin entry (see
  `CUSTOM-MODIFICATIONS.md`)
- Base URL: `ale.ms` (bare, no `https://` scheme — v5 convention, verified not to cause
  double/missing-scheme issues in RSS/sitemap output)

**Typography** (`quartz.config.yaml`'s `configuration.theme.typography`):

- Headers: Domine
- Body: JetBrains Mono
- Code: Inconsolata

**Layout**:

- `beforeBody`: Search + Darkmode toolbar, Breadcrumbs, ContentHeader (content pages only)
- `left`: PageTitle, Tagline, Explorer
- `right`: TableOfContents, Graph, Backlinks
- `afterBody`: RecentNotes (index page only), Comments (Giscus; excluded on tag/folder/canvas/bases
  page types)

**Homepage exception**: the `index` page doesn't use the layout above — it's single-column, with its
own hero (Title + Tagline + Search), always-expanded Graph, and phone-book Site Index. See
`CUSTOM-MODIFICATIONS.md`'s "Homepage (index page) layout" entry for the mechanism.

**Giscus Comments**:

- Repository: `alemsabic/alems-notizen`
- Custom themes: `quartz/static/giscus/light.css` & `dark.css`
- Language: German
- **Note**: `themeUrl` points at the literal production domain — see `CUSTOM-MODIFICATIONS.md`'s
  dark-mode-color entry for why a theme CSS change is unverifiable on any preview/local build.

---

## Custom Modifications

**See `CUSTOM-MODIFICATIONS.md` at the repo root for every behavior that deviates from stock
Quartz** — footnote-popover suppression, citation tooltips, SPA footnote highlighting, `shortTitle`
support (spans 5 files, easy to under-port), custom components (Tagline/ContentHeader/Footer),
RecentNotes/tag-page/folder-page tweaks, dark-mode color handling, search button styling, the
disabled `quartz-fonts` plugin, the homepage's single-column layout and Site Index/Graph forks (see
"Homepage (index page) layout" in `CUSTOM-MODIFICATIONS.md`), and Zotero content conventions (image
paths, highlight colors, book-cover CSS, the `literature-note` design system).

**Read it before**: editing any `local-plugins/*` fork, editing `quartz/util/fileTrie.ts` or
`quartz/util/ctx.ts`, touching `quartz/styles/custom.scss`, or doing any future Quartz version
upgrade. Every entry exists because it was lost or broken at least once already.

---

## Deployment

**Platform**: Cloudflare Pages

- **Repository**: https://github.com/alemsabic/alems-site
- **Branch**: `v5` — Cloudflare Pages production branch and this repo's GitHub default branch.
  `v4` is the pre-migration branch, kept but no longer deployed.
- **Project**: `ale-ms`
- **Build Command**: `npx quartz plugin install --from-config && npx quartz build` — the
  `--from-config` flag is required, not optional. Bare `npx quartz plugin install` restores local
  plugins from `quartz.lock.json`'s frozen `resolved` field, an **absolute, install-machine-specific
  path** that doesn't exist on Cloudflare's build machine — every `local-plugins/*`-sourced
  component silently fails to render if this flag is missing. See `upgrade.md`'s Phase H for the
  full trace.
- **Output Directory**: `public`
- **Deploy Time**: 1-2 minutes after push

---

## Content Workflow

### Publishing Content Changes

1. **Edit content** in `/Users/alemsabic/Desktop/MEMEX/NOTIZEN/`
2. **Commit and push**:
   ```bash
   git add . && git commit -m "content: ..." && git push
   ```
3. **Auto-sync**: GitHub Actions syncs to `alems-site`'s `content/` (onto branch `v5` — see the
   Two-Repository Architecture section above for the hardcoded-branch gotcha) → Cloudflare deploys.

**Important**:

- No need to run `npx quartz build` locally for content-only changes — the sync + Cloudflare deploy
  handles it.
- Changes appear live within a few minutes of the push.
- **Case-sensitivity gotcha**: macOS/local git is case-insensitive; GitHub/Cloudflare (Linux) is
  not. Renaming a file with _only_ a case change (e.g. `@Schmidt_2016.md` → `@schmidt_2016.md`) can
  leave both casings live on GitHub even though only one exists locally, breaking Wikilinks/images
  that assume the new casing. After such a rename, verify with `git ls-tree -r <branch> --name-only
| grep -i <name>` that only one casing exists remotely; if two show up, `git rm` both, commit,
  push, then re-add only the correct one.

---

## Notes

- Site rebuilds automatically in dev mode (`--serve`) when files change.
- Custom styling goes in `quartz/styles/custom.scss`.
- Theme: custom, with a noise-texture overlay (`static/noise.png` — load-bearing, not decorative
  cruft, don't delete it during a cleanup pass).
- Footer: custom, with Alem Šabić link + X/Twitter (see `CUSTOM-MODIFICATIONS.md`).
