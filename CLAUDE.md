# Claude Code Instructions - Quartz Repository (ale.ms)

## ⚠️ Important: Two-Repository Architecture

This repository handles **PRESENTATION ONLY** (Quartz static site generator).

**Content is managed separately**:

- Content Repository: https://github.com/alemsabic/alems-notizen
- Path: `/Users/alemsabic/Desktop/MEMEX/_projects/alems-notizen/`
- Auto-syncs to `content/` folder via GitHub Actions
- **DO NOT edit files in `content/` directly** - changes will be overwritten!

### Repository Focus:

- ✅ Design, styling, layout
- ✅ Quartz configuration
- ✅ UI components
- ❌ Content (managed in separate repo)

---

## ✅ Quartz v4 → v5 Migration — Phase H complete (2026-07-26 to 2026-07-27), Phase I pending

**If you're picking up work in this repo, check this first.** The Quartz v4 → v5 migration's
deploy cutover is done: **`v5` is what's live in production now**, both on Cloudflare Pages
(`production_branch: v5`) and as this GitHub repo's default branch. The full runbook — every
customization ported, every bug found and fixed, and the exact cutover sequence — lives in
**`upgrade.md` at the repo root**. Its top status line always reflects current reality; read that
before doing anything else here, especially before touching deployment/branch settings again.

One-paragraph history: Phases A–G (branch to v5, rebuild config, port every custom
component/plugin as a local-plugin fork under `local-plugins/`, add Bases/Canvas, verify in a real
browser) found and fixed nine real bugs via manual v4-vs-v5 visual diffing — all documented in
`upgrade.md`'s "Phase G" addenda (`quartz-fonts` cascade-layer font conflict, duplicate H1, a
beforeBody reorder + duplicate Properties panel, a hardcoded `markdown-preview-view` wrapper div
breaking `>`-combinator selectors, a multi-part search-button regression, a dark-mode
background-color drift). Phase H (this session's main event) found one more real bug purely from
trying to actually deploy: Cloudflare's build command needs `npx quartz plugin install
--from-config`, not bare `plugin install` — the bare form trusts an install-machine-specific
absolute path frozen in `quartz.lock.json` that doesn't exist on Cloudflare's build machine, so
every `local-plugins/*`-sourced component silently failed to render on the first preview deploy.
Also fixed same-session: Giscus comments excluded from folder listing pages too (previously only
tag/canvas/bases). User did the final real-browser verification against the live site directly and
confirmed everything renders correctly. **Phase I (replaying this whole migration on the sister
project at `/Users/alemsabic/Desktop/gpunkt.org`) is the only remaining phase, still explicitly
gated on the user being present and giving the go-ahead at the time — do not do it unattended.**
`upgrade.md`'s Phase I section has an explicit checklist of every Phase H gotcha to carry over
verbatim, so none of them need re-deriving there.

---

## Doc Exploration Policy (jDocMunch)

This project registers the `jdocmunch` MCP server (project-scoped, `.mcp.json`) for token-efficient navigation of real documentation sets — e.g. the upstream [Quartz docs](https://github.com/jackyzha0/quartz) or any other sizeable third-party docs needed while working on this repo. It indexes doc-like files (Markdown, RST, HTML, OpenAPI specs, etc.) by section instead of requiring full-file reads.

**When to use it**:

- Before exploring an external documentation set (Quartz's own docs, a plugin's docs, a new dependency) — `index_repo` (GitHub) or `index_local` (on disk) first, then `search_sections` / `get_toc` to find the relevant part.
- To pull specific content once located — use `get_section` (or `get_sections` for several) with the section ID, rather than opening the whole file.

**Not for**: this repo's own CLAUDE.md, README.md, or other project files — those are kept small deliberately and should just be `Read` directly.

This is a manual convention, not an enforced hook — no PreToolUse/PostToolUse hooks are installed for this repo, so nothing blocks a direct `Read`. Use judgment: reach for jDocMunch specifically when indexing genuine external documentation, not this repo's own short files.

---

## Code Exploration Policy (jCodeMunch)

This project also registers the `jcodemunch` MCP server (project-scoped, `.mcp.json`) alongside jDocMunch. Where jDocMunch indexes _documentation_ (prose, by section), jCodeMunch indexes _source code_ (TypeScript/JS, by symbol — functions, classes, components, byte-accurate) via tree-sitter. Don't confuse the two: a Quartz upstream `.md` doc goes through jDocMunch; a Quartz upstream or local `.ts`/`.tsx` file goes through jCodeMunch.

**You MUST reach for jCodeMunch (not raw `Read`/grep) in these situations:**

- **Before editing any file this CLAUDE.md calls out as shared/fragile infrastructure** — `citations.ts`, `Body.tsx`, `fileTrie.ts`, `ctx.ts`, `contentIndex.tsx`, `ContentHeader.tsx`, and the `.inline.ts` scripts under `quartz/components/scripts/`. This repo has a documented history of custom modifications threaded across multiple files that must stay in sync (footnote highlighting, tooltip decoding, `shortTitle` fallback, German locale citations — see the "Custom Modifications" section below). Run `find_references` / `get_blast_radius` on the symbol you're about to touch before editing it, so a change doesn't silently break one of these previously-hard-won fixes elsewhere.
- **When locating where a symbol, component, or type is defined or used anywhere under `quartz/`**, instead of grepping across dozens of files by hand. Use `search_symbols` / `find_references`.
- **Before deleting or renaming any exported symbol in `quartz/`** — run `check_delete_safe` first rather than assuming it's unused.
- **When exploring an unfamiliar part of the Quartz internals for the first time** (e.g. chasing a `npm run check` type error into upstream Quartz plugin code, or understanding a component's call chain before extending it) — `index_local` the relevant directory, then query it rather than opening whole files cold.

**Not for**: this repo's own CLAUDE.md/README (small, just `Read` them); the `content/` folder (Markdown content, not code, and out of scope per the two-repo architecture above — if you ever need to inspect it, `Read`/grep is fine); trivial edits where the exact file and line are already known and no ripple-effect risk exists.

This is a manual convention like the jDocMunch policy above — no enforcement hooks are installed, nothing blocks a direct `Read`. But given this repo's track record of cross-file regressions on Quartz updates, defaulting to jCodeMunch's reference/blast-radius checks before touching shared files is the safer habit, not an optional nicety.

---

## Project Overview

- **Name**: alems-site
- **Type**: Static site generator using Quartz v4.5.1
- **Purpose**: ale.ms - Quellenangaben und Schulungsunterlagen von Alem Sabic
- **Live Site**: https://ale.ms

### Key Commands

- **Dev server**: `npx quartz build --serve` (runs on http://localhost:8080)
- **Build**: `npx quartz build`
- **Check types**: `npm run check`
- **Format code**: `npm run format`

---

## File Structure

```
quartz/
├── content/              # ⚠️ AUTO-SYNCED - DO NOT EDIT!
├── quartz.config.ts      # Main configuration (fonts, colors, SEO)
├── quartz.layout.ts      # Layout and component positioning
├── quartz/
│   ├── components/       # UI components (Tagline, EditOnGitHub, etc.)
│   └── styles/
│       └── custom.scss   # Custom CSS overrides
├── public/               # Built site output (auto-generated)
└── static/               # Static assets (Giscus themes, etc.)
```

---

## Current Configuration

**Site Identity**:

- Page title: "ale.ms"
- Tagline: "Quellenangaben und Schulungsunterlagen von Alem Sabic"
- Base URL: https://ale.ms

**Typography**:

- Headers: Domine
- Body: JetBrains Mono
- Code: Inconsolata

**Layout** (Session 16):

- Left sidebar: PageTitle, Tagline, Search, Darkmode, Explorer
- Right sidebar: TableOfContents, Graph, Backlinks (gap: 1.2rem)
- After body: RecentNotes (index only), Comments (Giscus)

**Giscus Comments**:

- Repository: `alemsabic/alems-notizen`
- Custom themes: `static/giscus/light.css` & `dark.css`
- Language: German

---

## Deployment

**Platform**: Cloudflare Pages

- **Repository**: https://github.com/alemsabic/alems-site
- **Branch**: `v5` — flipped to Cloudflare Pages production branch 2026-07-27 (Phase H cutover, see
  `upgrade.md`). `v4` is the pre-migration branch, no longer deployed.
- **Project**: `ale-ms`
- **Build Command**: `npx quartz plugin install --from-config && npx quartz build` — the
  `--from-config` flag is required, not optional (see `upgrade.md` Phase H: bare `plugin install`
  restores local plugins from a dev-machine-specific absolute path frozen in `quartz.lock.json`,
  which doesn't exist on Cloudflare's build machine).
- **Output Directory**: `public`
- **Deploy Time**: 1-2 minutes after push

---

## Content Workflow

### Publishing Content Changes

1. **Edit content** in `/Users/alemsabic/Desktop/MEMEX/_projects/alems-notizen/`
2. **Commit and push**:
   ```bash
   git add . && git commit -m "content: ..." && git push
   ```
3. **Auto-sync**: GitHub Actions syncs to alems-site → Cloudflare deploys

**Important**:

- NO need to run `npx quartz build` locally
- Changes appear live within 1-2 minutes
- All commits to content repo trigger GitHub Actions workflow

---

## Custom Components

**Tagline** (`quartz/components/Tagline.tsx`):

- Displays site description below PageTitle
- Responsive: block (desktop), inline (mobile)

**EditOnGitHub** (`quartz/components/EditOnGitHub.tsx`):

- "Verbesser die Seite auf GitHub." link
- Points to content repo: `https://github.com/alemsabic/alems-notizen/`

---

## Session 16 Updates (Dec 9, 2025) - Current Session

### Layout Changes ✅

**Files Modified**: `quartz.layout.ts`, `quartz/styles/custom.scss`

**Changes Made**:

- Moved Graph & Backlinks from `afterBody` → `right` sidebar
- Right sidebar order (current, corrected 2026-07-26): TableOfContents → Graph → Backlinks
- Added `gap: 1.2rem` to `.sidebar.right`
- Commit: `cfe18a7` - "feat: move Graph and Backlinks to right sidebar"

---

## Notes

- Site rebuilds automatically in dev mode when files change
- Custom styling goes in `quartz/styles/custom.scss`
- Theme: Custom with noise texture
- Footer: Custom with Alem Šabić link + X/Twitter

---

## ⚠️ Custom Modifications (Important for Quartz Updates)

### Popover Behavior for Footnote Links

**Issue**: Footnote reference links (`<sup><a>`) should NOT show popovers on hover (they link to footnotes on the same page, not other pages).

**Solution Location**: `quartz/plugins/transformers/citations.ts`

**Code to add** (if lost during Quartz update):

```typescript
// In the visit() function, add this block:
// Disable popovers for footnote reference links (sup > a)
if (node.tagName === "a" && parent && parent.type === "element" && parent.tagName === "sup") {
  node.properties = node.properties || {}
  node.properties["data-no-popover"] = true
}
```

**Why**: Quartz uses `data-no-popover="true"` to disable popovers. This is the standard mechanism used for:

- Bibliography citations (`#bib-*`) - already in `citations.ts:45`
- Heading anchor links - in `gfm.ts:36`
- Footnote links should work the same way

**File**: `/Users/alemsabic/Desktop/ale.ms/quartz/plugins/transformers/citations.ts`

**Context**: The `visit()` function already exists and adds `data-no-popover` to bibliography links. Just extend it to also catch `sup > a` elements.

---

### German Locale for Citations Plugin

**Issue**: Citations plugin uses citation-js which only comes with `en-US` locale preloaded. Setting `locale: "de-DE"` in Quartz config caused error: "Input locale option, de-DE, is invalid or is an unknown file."

**Root Cause**:

- rehype-citation's `loadLocale()` function checks if locale is registered in `config.locales.data`
- If not found, it tries to load it as a file path or URL
- Simply passing "de-DE" tries to load a non-existent file at path "de-DE"

**Solution**: Use URL to official CSL locale file + extend Citations plugin interface

**Files Modified**:

1. **`quartz.config.ts`**:

   ```typescript
   configuration: {
     locale: "de-DE", // For Quartz UI (Graph View → Graphenansicht, etc.)
   }

   Plugin.Citations({
     bibliographyFile: "./content/bibliography.bib",
     suppressBibliography: false,
     linkCitations: false,
     csl: "apa",
     lang: "https://raw.githubusercontent.com/citation-style-language/locales/master/locales-de-DE.xml",
   })
   ```

2. **`quartz/plugins/transformers/citations.ts`**:
   - Add `lang?: string` to Options interface (line 11)
   - Update rehypeCitation config to use: `lang: opts.lang ?? ctx.cfg.configuration.locale ?? "en-US"` (line 36)

**Why This Works**:

- rehype-citation's `loadLocale()` accepts URLs (see node_modules/rehype-citation/dist/node/src/utils.js:127-151)
- It fetches the XML, extracts `xml:lang="de-DE"`, and registers it with citation-js
- `opts.lang` has priority over `ctx.cfg.configuration.locale`, so Citations uses German while Quartz UI also uses German

**Alternative Solutions Considered**:

- ❌ Local file path (`./content/locales/de-DE.xml`) - works but requires file management
- ❌ Programmatic registration in citations.ts - more complex, harder to maintain
- ✅ URL to official CSL repository - always up-to-date, no local files needed

**For Future Quartz Updates**:

- If `citations.ts` is overwritten, re-add `lang?: string` to Options interface
- Ensure rehypeCitation config uses: `lang: opts.lang ?? ctx.cfg.configuration.locale ?? "en-US"`
- The `lang` URL in quartz.config.ts will persist unless config is regenerated

**Resources**:

- Official CSL locales: https://github.com/citation-style-language/locales
- Other locales: Replace `de-DE` in URL with desired locale code (e.g., `fr-FR`, `es-ES`)

---

### Footnote Highlighting for SPA Navigation

**Issue**: Clicking footnote reference links (e.g., `[^1]`) in the text does not visually highlight the corresponding footnote at the bottom when using Quartz's SPA (Single Page Application) mode with `enableSPA: true`.

**Root Cause**:

- Standard CSS `:target` pseudo-class works on page reload but not during client-side SPA navigation
- Quartz's SPA mode intercepts link clicks and navigates without full page reload
- Hash changes (`#user-content-fn-1`) don't trigger `:target` CSS in SPA mode

**Solution**: JavaScript-based highlighting system + CSS dual selector

**Files Created/Modified**:

1. **NEW: `quartz/components/scripts/footnotes.inline.ts`**:

   ```typescript
   // Highlight footnotes when clicked (for SPA navigation)
   function highlightFootnote() {
     // Remove previous highlights
     const previousHighlight = document.querySelector(".footnotes li.footnote-highlighted")
     if (previousHighlight) {
       previousHighlight.classList.remove("footnote-highlighted")
     }

     // Get current hash and highlight target
     const hash = window.location.hash
     if (!hash || !hash.startsWith("#user-content-fn-")) return

     const target = document.querySelector(hash)
     if (target && target.tagName === "LI") {
       target.classList.add("footnote-highlighted")
     }
   }

   document.addEventListener("nav", () => {
     highlightFootnote()

     function onHashChange() {
       highlightFootnote()
     }
     window.addEventListener("hashchange", onHashChange)
     window.addCleanup(() => window.removeEventListener("hashchange", onHashChange))

     // Handle direct clicks on footnote reference links
     const footnoteLinks = document.querySelectorAll('a[href^="#user-content-fn-"]')
     footnoteLinks.forEach((link) => {
       function onClick(e: Event) {
         setTimeout(highlightFootnote, 10)
       }
       link.addEventListener("click", onClick)
       window.addCleanup(() => link.removeEventListener("click", onClick))
     })
   })
   ```

2. **MODIFIED: `quartz/components/Body.tsx`**:

   ```typescript
   // Add import at top:
   // @ts-ignore
   import footnotesScript from "./scripts/footnotes.inline"

   // Modify afterDOMLoaded to combine scripts:
   Body.afterDOMLoaded = `
     ${clipboardScript};
     ${footnotesScript};
   `
   ```

3. **MODIFIED: `quartz/styles/custom.scss`**:
   - Add `.footnote-highlighted` class to existing `:target` selectors
   - For dictionary-entry, dictionary-entry-columns, and zettelkasten articles

   ```scss
   // Example for zettelkasten (repeat for dictionary-entry):
   article.zettelkasten .footnotes li:target,
   article.zettelkasten .footnotes li.footnote-highlighted {
     background-color: var(--highlight);
     border-radius: 4px;
     padding: 0.5rem;
     margin-left: -0.5rem;
     transition: background-color 0.3s ease;
   }
   ```

**Why This Works**:

- `:target` CSS handles traditional page reloads (still works)
- `.footnote-highlighted` class handles SPA navigation
- JavaScript adds/removes class dynamically on hash changes
- Uses Quartz's `nav` event and `addCleanup` pattern for proper lifecycle management
- No conflicts with existing popover/SPA systems

**For Future Quartz Updates**:

1. **If `footnotes.inline.ts` is lost**: Re-create the file with the code above
2. **If `Body.tsx` is overwritten**: Re-add the import and combine scripts in `afterDOMLoaded`
3. **If `custom.scss` footnote styles are lost**: Re-add `.footnote-highlighted` to `:target` selectors
4. **Pattern to check**: Look for `.footnotes li:target` in custom.scss and ensure `.footnote-highlighted` is also included

**Technical Details**:

- Hash format: `#user-content-fn-1`, `#user-content-fn-2`, etc.
- Highlight persists until another footnote is clicked
- Uses `var(--highlight)` for theme-aware background color
- 0.3s transition for smooth visual feedback

---

### Short Title Support for Zotero Sources

**Issue**: Zotero-imported sources have very long titles (e.g., "Das Zettelkasten-Prinzip: erfolgreich wissenschaftlich Schreiben und Studieren mit effektiven Notizen") that create display problems:

- **Explorer** (sidebar): Titles appear as unreadable text blocks
- **Breadcrumbs**: Long titles make navigation confusing
- **ContentHeader**: Shows full title redundantly
- **ArticleTitle (H1)**: Shows full title again

This results in the same long title appearing 4x on each Zotero source page, making navigation nearly impossible.

**Solution**: Implement `shortTitle` frontmatter property with fallback logic

**Concept**:

- **Navigation** (Explorer, Breadcrumbs): Use short form → e.g., "Ahrens (2017)"
- **Content** (H1): Use full title → appears once where it belongs
- **ContentHeader**: Remove redundant title line

**Files Modified**:

1. **`quartz/util/fileTrie.ts`**:
   - Add `shortTitle?: string` to `FileTrieData` interface (line 7)
   - Modify `displayName` getter to use shortTitle fallback (lines 31-38):

   ```typescript
   interface FileTrieData {
     slug: string
     title: string
     shortTitle?: string  // Optional short title for navigation (e.g., "Ahrens (2017)")
     filePath: string
   }

   get displayName(): string {
     const nonIndexTitle = this.data?.title === "index" ? undefined : this.data?.title
     // Use shortTitle if available (for Zotero sources), fallback to title
     const titleToUse = this.data?.shortTitle ?? nonIndexTitle
     return (
       this.displayNameOverride ?? titleToUse ?? this.fileSegmentHint ?? this.slugSegment ?? ""
     )
   }
   ```

2. **`quartz/util/ctx.ts`**:
   - Add `shortTitle?: string` to `BuildTimeTrieData` type (line 21)
   - Extract shortTitle in `trieFromAllFiles()` function (line 43):

   ```typescript
   export type BuildTimeTrieData = QuartzPluginData & {
     slug: string
     title: string
     shortTitle?: string // Optional short title for navigation (Zotero sources)
     filePath: string
   }

   export function trieFromAllFiles(allFiles: QuartzPluginData[]): FileTrieNode<BuildTimeTrieData> {
     const trie = new FileTrieNode<BuildTimeTrieData>([])
     allFiles.forEach((file) => {
       if (file.frontmatter) {
         trie.add({
           ...file,
           slug: file.slug!,
           title: file.frontmatter.title,
           shortTitle: file.frontmatter.shortTitle, // Extract shortTitle from frontmatter
           filePath: file.filePath!,
         })
       }
     })
     return trie
   }
   ```

3. **`quartz/plugins/emitters/contentIndex.tsx`**:
   - Add `shortTitle?: string` to `ContentDetails` type (line 16)
   - Extract shortTitle when building content index (line 111):

   ```typescript
   export type ContentDetails = {
     slug: FullSlug
     filePath: FilePath
     title: string
     shortTitle?: string // Optional short title for navigation (Zotero sources)
     links: SimpleSlug[]
     tags: string[]
     content: string
     richContent?: string
     date?: Date
     description?: string
   }

   // In emit function:
   linkIndex.set(slug, {
     slug,
     filePath: file.data.relativePath!,
     title: file.data.frontmatter?.title!,
     shortTitle: file.data.frontmatter?.shortTitle, // Extract shortTitle from frontmatter
     links: file.data.links ?? [],
     // ...
   })
   ```

4. **`quartz/components/ContentHeader.tsx`** (lines 61-68):
   - Comment out redundant title display:
   ```typescript
   {
     /* Title removed - redundant with ArticleTitle H1
   {title && (
     <>
       <dt>Titel:</dt>
       <dd>{title}.</dd>
     </>
   )}
   */
   }
   ```

Note: Breadcrumbs.tsx requires no changes - it automatically uses `node.displayName` from fileTrie.

**Frontmatter Usage**:

For Zotero sources, add `shortTitle` to your template:

```yaml
title: "Das Zettelkasten-Prinzip: erfolgreich wissenschaftlich Schreiben und Studieren mit effektiven Notizen"
shortTitle: "Ahrens (2017)" # ← Used in Explorer & Breadcrumbs
authors:
  - "Ahrens, Sönke"
year: 2017
citekey: "ahrens_2017"
```

For regular notes (without `shortTitle`), the full title is used automatically.

**Why This Works**:

- `shortTitle` is a standard property in citation systems (BibTeX, CSL)
- Fallback logic ensures backward compatibility with existing content
- Navigator components (Explorer, Breadcrumbs) get readable labels
- Full title remains visible exactly once (as H1 ArticleTitle)
- No breaking changes for non-Zotero content

**For Future Quartz Updates**:

1. **If `fileTrie.ts` is overwritten**:
   - Re-add `shortTitle?: string` to `FileTrieData` interface
   - Re-add the `shortTitle` fallback in the `displayName` getter
2. **If `ctx.ts` is overwritten**:
   - Re-add `shortTitle?: string` to `BuildTimeTrieData` type
   - Re-add `shortTitle: file.frontmatter.shortTitle` in `trieFromAllFiles()` function
3. **If `contentIndex.tsx` is overwritten**:
   - Re-add `shortTitle?: string` to `ContentDetails` type
   - Re-add `shortTitle: file.data.frontmatter?.shortTitle` in the linkIndex.set() call
4. **If `ContentHeader.tsx` is overwritten**: Comment out the title display block again
5. **Pattern to check**: Search for "shortTitle" across the codebase - should appear in 4 files (fileTrie.ts, ctx.ts, contentIndex.tsx, ContentHeader.tsx)

**Expected Result**:

- Explorer: "Ahrens (2017)" instead of 100+ character title
- Breadcrumbs: "Home ❯ Quellenverzeichnis ❯ Ahrens (2017)"
- ContentHeader: No redundant title line
- ArticleTitle: Full title as H1 (unchanged)

**Zotero Template Location**: `/Users/alemsabic/Desktop/MEMEX/_templates/Zotero-Vorlage.md`

**Implementation Summary**:

- Total files modified: 4 (fileTrie.ts, ctx.ts, contentIndex.tsx, ContentHeader.tsx)
- Type definitions extended in 3 places to support optional `shortTitle` property
- Backward compatible: Works with and without `shortTitle` in frontmatter
- Navigation components automatically use short title when available
- Full title appears exactly once as H1, improving readability and reducing redundancy

**Testing**:

- Tested with `@ahrens_2017.md` (shortTitle: "Ahrens (2017)")
- Explorer sidebar: Shows "Ahrens (2017)" ✓
- Breadcrumbs: Shows "Home ❯ Quellenverzeichnis ❯ Ahrens (2017)" ✓
- ContentHeader: No redundant title line ✓
- ArticleTitle: Full title as H1 ✓

---

---

## Session 17 Updates (Dec 27, 2025) - Zotero Highlights & Styling

### Features Implemented ✅

**1. Zotero Highlight Colors** (`quartz/styles/custom.scss`):

- Added CSS for all 8 Zotero highlight colors (yellow, orange, red/pink, green, blue/cyan, purple/violet, magenta, gray)
- Light Theme: 50% opacity (40% for magenta) for subtle highlighting
- Dark Theme: 40% opacity for better readability
- Removed text-shadow (letterpress effect) from highlights
- White text on dark highlights (green, blue, purple, gray) for contrast

**2. Callout Styling** (`quartz/styles/custom.scss`):

- Made callout titles more subtle and less bold
- Changed font-weight from semibold to 400 (regular)
- Muted callout colors by adding gray tones:
  - Default: #6b8aa8 (muted blue-gray)
  - Abstract: #6b9fb5 (muted cyan-gray)
  - Info/Todo: #6ba5b0 (muted teal-gray)

**3. Skeuomorphic Book Cover Effect** (`quartz/styles/custom.scss`, Zotero Template):

- Implemented realistic 3D hardcover effect for Zotero book covers
- Based on: [Skeuomorphic book cover in CSS by Varun Dhawan](https://varundhawan.com/blog/2022/01/18/skeuomorphic-book-cover-css)
- Features:
  - 14-stage gradient overlay simulating spine "dent" and light reflection
  - 3D shadow effect (book lifted off surface)
  - Hover animation (scale + lift)
  - Dark theme support
- Template changes: HTML structure with `.book-cover-container` wrapper
- Key insight: `<img>` elements don't support pseudo-elements → gradient applied to container
- Attribution: CSS gradient technique adapted from Varun Dhawan's blog post

**Files Modified**:

- `quartz/styles/custom.scss` - Added ~120 lines for Zotero highlights, callout overrides, and book cover styling
- `/Users/alemsabic/Desktop/MEMEX/_templates/Zotero-Vorlage.md` - HTML structure for book covers

### Documentation

- Zotero highlight colors fully documented in custom.scss with comments
- Resolved "Images from Zotero" issue in CLAUDE.md
- Book cover effect credited to Varun Dhawan (https://varundhawan.com/blog/2022/01/18/skeuomorphic-book-cover-css)

### Credits

- **Skeuomorphic Book Cover CSS**: Inspired by and adapted from [Varun Dhawan's blog post](https://varundhawan.com/blog/2022/01/18/skeuomorphic-book-cover-css)
- Original technique: Gradient overlay on container (not img) with precise color stops for realistic hardcover effect

### TODO for Future Sessions

- [ ] Add "Credits" or "Acknowledgments" section to README.md (English sounds less pompous than "Ehre, wem Ehre gebührt")
  - Credit Varun Dhawan for skeuomorphic book cover CSS
  - Credit Claude Code / Anthropic for development assistance
- [ ] Add credits/acknowledgments link on ale.ms footer or dedicated page
  - Include link to this repository
  - Acknowledge contributors (Varun Dhawan, Claude, etc.)

---

## Historical Context (Archived)

**Migration History**: nekontam.com → pathologie.gpunkt.org → ale.ms

- Complete migration details in git history (Sessions 1-15)
- Current state: Clean ale.ms setup with two-repository architecture
- Old CLAUDE.md content archived for brevity

---

## ✅ RESOLVED: Images from Zotero Not Displaying on ale.ms

**Date**: 2025-12-27 (Resolved same day)
**Status**: RESOLVED

### Problem Summary

Zotero-imported source files contain image references (annotations/screenshots from PDFs) that are:

- ✅ Synced correctly to GitHub via GitHub Actions
- ✅ Present in the Site-Repo (`content/Quellenverzeichnis/Abbildungen/`)
- ❌ **NOT displaying on live site** (https://ale.ms)

### Evidence

**GitHub Actions Logs** (Run 20537552679, 2025-12-27T09:57):

```
Quellenverzeichnis/Abbildungen/
Quellenverzeichnis/Abbildungen/Hanuschek_2021-1283-x51-y414.png
Quellenverzeichnis/Abbildungen/Schmidt_2016-14-x49-y346.png
Quellenverzeichnis/Abbildungen/ahrens_2017-61-x66-y145.png
Quellenverzeichnis/Abbildungen/doto_2024-26-x56-y413.png

sent 2,677,024 bytes
[v4 0286661] content: sync from content repo
```

**Commit**: `0286661` on branch `v4` (alemsabic/alems-site)

### Image Link Format in Markdown

**Example from `@Sipos_2025.md`**:

```markdown
![[NOTIZEN/Quellenverzeichnis/Abbildungen/doto_2024-26-x56-y413.png]]
```

**Issue**: Wikilink syntax + incorrect path prefix

### Suspected Root Causes

1. **Wikilink Syntax**: Quartz may not transform Obsidian Wikilinks (`![[...]]`) for images
2. **Path Prefix**: Links contain `NOTIZEN/Quellenverzeichnis/...` but content structure is `Quellenverzeichnis/...` (no `NOTIZEN/` root in synced content)
3. **Missing Quartz Configuration**: Image handling might need special plugin/transformer

### Files Affected

- `Quellenverzeichnis/@Hanuschek_2021.md`
- `Quellenverzeichnis/@Schmidt_2016.md`
- `Quellenverzeichnis/@Sipos_2025.md`
- `Quellenverzeichnis/@ahrens_2017.md`
- `Quellenverzeichnis/@doto_2024.md`

All contain image annotations from Zotero imports.

### Next Steps (To Resume)

1. **Understand Quartz image handling**:
   - Check if Wikilinks for images are supported
   - Review Quartz transformers/plugins for image processing
   - Test with standard markdown syntax: `![](path/to/image.png)`

2. **Fix path prefix issue**:
   - Remove `NOTIZEN/` from image paths (via Zotero template or post-processing)
   - Or: adjust sync workflow to match expected structure

3. **Test locally**:
   - Run `npx quartz build --serve`
   - Navigate to affected source pages
   - Check browser console for 404s or path errors

4. **Verify online deployment**:
   - After fix, check https://ale.ms for image rendering
   - Ensure Cloudflare Pages serves images correctly

### Resolution

**Fixed via Zotero Template Update** (same day):

- Updated Zotero template to use simplified image paths
- Changed from: `![[NOTIZEN/Quellenverzeichnis/Abbildungen/filename.png]]`
- Changed to: `![[filename.png]]` (relative path)
- Quartz correctly resolves relative Wikilink image paths
- Images now display correctly both locally and on https://ale.ms

**Related Documentation**:

- **Content Repo**: https://github.com/alemsabic/alems-notizen
- **Site Repo**: https://github.com/alemsabic/alems-site
- **Zotero Template**: `/Users/alemsabic/Desktop/MEMEX/_templates/Zotero-Vorlage.md`

---

### Citation Tooltip HTML Entity Decoding

**Issue**: Citation tooltips (from rehype-citation) display HTML entities like `&#38;` instead of `&` when hovering over citations like "(Luhmann, 1981)".

**Root Cause**:

- `rehype-citation` sets `data-tooltip` attributes with HTML-encoded text
- CSS `attr(data-tooltip)` displays the raw encoded value
- Example: "Luhmann, N. (1981). Kommunikation Mit Zettelkasten..." shows as "...Kepplinger, &#38; Reumann..."

**Solution**: Client-side JavaScript decoding after DOM load

**Files Created/Modified**:

1. **NEW: `quartz/components/scripts/tooltips.inline.ts`**:

   ```typescript
   // Decode HTML entities in data-tooltip attributes
   document.addEventListener("nav", () => {
     const elementsWithTooltips = document.querySelectorAll("[data-tooltip]")

     elementsWithTooltips.forEach((element) => {
       const tooltip = element.getAttribute("data-tooltip")
       if (tooltip) {
         // Create a temporary element to decode HTML entities
         const textarea = document.createElement("textarea")
         textarea.innerHTML = tooltip
         const decoded = textarea.value
         element.setAttribute("data-tooltip", decoded)
       }
     })
   })
   ```

2. **MODIFIED: `quartz/components/Body.tsx`**:

   ```typescript
   // Add import at top:
   // @ts-ignore
   import tooltipsScript from "./scripts/tooltips.inline"

   // Modify afterDOMLoaded to include tooltips script:
   Body.afterDOMLoaded = `
     ${clipboardScript};
     ${footnotesScript};
     ${tooltipsScript};
   `
   ```

**Why This Works**:

- Uses `<textarea>` trick: Browser automatically decodes HTML entities when setting `innerHTML`
- Runs on every SPA navigation (`nav` event)
- Replaces encoded `data-tooltip` with decoded version before CSS displays it
- No server-side changes needed - pure client-side fix

**Alternative Approaches Considered**:

- ❌ Transform in `citations.ts` plugin: Attempted regex replacement, but `data-tooltip` value already encoded by rehype-citation
- ❌ CSS solution: CSS `attr()` has no decode function
- ✅ Client-side decode: Simple, works with SPA, no build-time overhead

**For Future Quartz Updates**:

1. **If `tooltips.inline.ts` is lost**: Re-create the file with the code above
2. **If `Body.tsx` is overwritten**: Re-add the import and include `${tooltipsScript};` in `afterDOMLoaded`
3. **Pattern to check**: Look for `tooltipsScript` import in `Body.tsx`

**Testing**:

- Hover over citation like "(Luhmann, 1981)" with multiple authors
- Tooltip should show: "Baier, Kepplinger, & Reumann" (not `&#38;`)
- Works in both light and dark themes
- Persists across SPA navigation

**Technical Details**:

- Decodes all standard HTML entities: `&`, `"`, `'`, `<`, `>`
- Uses browser's native decoding (via `textarea.innerHTML`)
- Runs after every page navigation for SPA compatibility
- Lightweight: Only processes elements with `data-tooltip` attribute

---

## Session 28 (Dec 28, 2025) - Zotero Source Annotations Styling

### 🔴 KRITISCH: Git Case-Sensitivity Problem - MUSS GELÖST WERDEN!

**Problem:** Uppercase/Lowercase Duplikate auf GitHub (Session 28, 2025-12-28)

**Symptome:**

- Lokal: Alle Dateien lowercase (`@schmidt_2016.md`, `schmidt_2016-*.png`)
- Online (GitHub/ale.ms): Beide Versionen existieren (`@Schmidt_2016.md` UND `@schmidt_2016.md`)
- Resultat: Bilder erscheinen nicht online, weil Wikilinks auf lowercase zeigen, aber GitHub die uppercase-Version ausliefert

**Root Cause:**

- Git auf macOS: **case-insensitive** (`Schmidt` = `schmidt`)
- GitHub/Cloudflare (Linux): **case-sensitive** (zwei verschiedene Dateien!)
- Bei `git mv` lokal: Git merkt die Umbenennung, aber GitHub behält beide Versionen

**Betroffene Dateien:**

- ❌ `Quellenverzeichnis/@*.md` (Markdown-Dateien)
- ❌ `Quellenverzeichnis/Abbildungen/*.png` (Bilder)

**LÖSUNG - Kompletter Reset (nächste Session):**

```bash
# 1. Alte Dateien komplett von GitHub löschen
cd /Users/alemsabic/Desktop/MEMEX/NOTIZEN
git rm -r Quellenverzeichnis/@*.md Quellenverzeichnis/Abbildungen/
git commit -m "chore: remove all Zotero files for case-sensitivity cleanup"
git push

# 2. Warten bis GitHub Actions synct (~1-2 Min)

# 3. Neu hinzufügen (jetzt nur lowercase)
git add Quellenverzeichnis/@*.md Quellenverzeichnis/Abbildungen/
git commit -m "feat: re-add Zotero sources with lowercase filenames"
git push
```

**Warum das funktioniert:**

- `git rm` löscht die Dateien auf GitHub (alle Versionen!)
- Neues `git add` fügt nur die aktuellen (lowercase) Dateien hinzu
- Keine Duplikate mehr ✅

**Status:** Dokumentiert, bereit für Umsetzung in nächster Session

**Zotero Better BibTeX Settings (bereits korrekt):**

- Citation key formula: `auth.lower + "_" + year` ✅
- Alle citekeys refreshed auf lowercase ✅
- Template nutzt lowercase-citekeys ✅

---

### ✅ Academic Styling for Zotero Sources - HAUPTARBEIT ERLEDIGT

**Status:** Kern-Features implementiert (Session 28, 2025-12-28)

**Abgeschlossene Features:**

- ✅ Book Cover Hover-Effekt entfernt (enhanced shadow permanent)
- ✅ Highlights: Kleinbuchstaben (a., b., c., d.) rechtsbündig, display: block
- ✅ Highlights: `mark` als block, line-height 1.15rem, kein padding/border-radius
- ✅ Seitenzahlen: `(S. 42)` rechtsbündig, display: block
- ✅ Kommentare: `display: block`, line-height 1.15rem, "Anm.:" fett
- ✅ Bildunterschriften: `(Abb. 1 - S. 61)` rechtsbündig mit CSS Counter
- ✅ Template: "Seite" → "S." + Whitespace-Fix in Klammern
- ✅ CSS `:has(> img)` für tight caption placement (p-Element ohne margin/padding)
- ✅ Spacing zwischen Elementen (2.5rem margin-top mit Adjacent Sibling Combinator)
  - comment → highlight
  - highlight → highlight
  - comment/highlight → image
  - figure-caption → highlight
  - Exception: Nach h2/h3 kein extra margin

**🔜 Nächste Schritte - Feintuning:**

1. **Callouts stylen:**
   - Schriftgröße anpassen
   - line-height anpassen
2. **Feinheiten:**
   - line-height optimieren
   - font-size anpassen
   - color/Farben verfeinern

**Wichtig:** Die Hauptstruktur steht - nur noch Politur!

---

### ✅ Academic Styling: `literature-note` — IMPLEMENTED (corrected 2026-07-26)

**Status**: This was previously logged here as "🔜 TODO (PAUSED) — CSS styling needed." That was stale:
the full `article.literature-note` styling system is implemented in `quartz/styles/custom.scss`
(search for `article.literature-note`, ~1253–1400+). Verified during the Quartz v5 migration
inventory pass.

**Goal**: Trockenes, akademisches Design für Zotero-importierte Quellen (wie alte Akten)

**CSS-Klasse**: `literature-note` (im Frontmatter: `cssclasses: literature-note`)

**Note — implementation differs from the original spec below**: the shipped CSS numbers
`.annotation-highlight` entries with **lowercase letters** (`a.`, `b.`, `c.`, …, via
`counter(section, lower-alpha)`), not the roman-numeral `§ I / § II / § III` scheme originally
planned. Figure captions do use the originally-planned `Abb. 1 / Abb. 2` numbering
(`counter(figure)`). If re-styling this system, treat the actual CSS in `custom.scss` as the
source of truth, not the historical mockup below.

**Elemente (historische Planungs-Skizze, siehe oben für Abweichungen)**:

```scss
article.literature-note {
  // 1. Highlights (Text-Annotationen aus Zotero)
  .annotation-highlight {
    .section-marker::before {
      content: "§ " counter(section, upper-roman);
      // § I, § II, § III, ...
      // CSS Counter für automatische Nummerierung
    }
    mark.hltr-yellow {
      /* Gelb */
    }
    mark.hltr-orange {
      /* Orange */
    }
    mark.hltr-red {
      /* Rot/Pink */
    }
    mark.hltr-green {
      /* Grün */
    }
    mark.hltr-blue {
      /* Blau/Cyan */
    }
    mark.hltr-purple {
      /* Lila/Violett */
    }
    mark.hltr-magenta {
      /* Magenta */
    }
    mark.hltr-gray {
      /* Grau */
    }
    .annotation-page {
      /* (S. 42) */
    }
  }

  // 2. Kommentare (Anmerkungen zu Highlights/Bildern)
  .annotation-comment {
    .comment-label {
      /* "Anm.:" */
    }
  }

  // 3. Abbildungen (Screenshots aus Zotero)
  img + .annotation-figure-caption {
    .figure-label::before {
      content: "Abb. " counter(figure);
      // Abb. 1, Abb. 2, Abb. 3, ...
      // CSS Counter für automatische Nummerierung
    }
    .figure-source {
      /* "Seite 42" */
    }
  }

  // 4. CSS Counter Setup
  counter-reset: section figure;
  .annotation-highlight {
    counter-increment: section;
  }
  .annotation-figure-caption {
    counter-increment: figure;
  }
}
```

**Design-Richtlinien**:

- **Typografie**: JetBrains Mono (body), Victor Mono (headings)
- **Stil**: Formell, trocken, akademisch (wie alte Akten)
- **§-Zeichen**: Römische Ziffern (§ I, § II, § III) — _geplant, tatsächlich: Kleinbuchstaben a/b/c/d_
- **Abb.-Label**: Arabische Ziffern (Abb. 1, Abb. 2)
- **Spacing**: Genug Luft zwischen Elementen
- **Farben**: Dezent, nicht zu grell (evtl. leicht entsättigt)

**Referenz-Dateien**:

- Live: https://ale.ms/Quellenverzeichnis/@ahrens_2017
- Template: `/Users/alemsabic/Desktop/MEMEX/_templates/Zotero-Vorlage.md`
- Custom CSS: `/Users/alemsabic/Desktop/ale.ms/quartz/styles/custom.scss`

**HTML-Struktur** (aus Template):

```html
<div class="annotation-highlight">
  <span class="section-marker"></span>
  <mark class="hltr-yellow">"Text..."</mark>
  <span class="annotation-page">(S. 42)</span>
</div>

<div class="annotation-comment"><span class="comment-label">Anm.:</span> Kommentar...</div>

![[image.png]]
<div class="annotation-figure-caption">
  <span class="figure-label"></span>
  <span class="figure-source">Seite 42</span>
</div>
```

---
