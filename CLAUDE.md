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
- Headers: Victor Mono
- Body: Geist Mono
- Code: Inconsolata

**Layout** (Session 16):
- Left sidebar: PageTitle, Tagline, Search, Darkmode, Explorer
- Right sidebar: Graph, TableOfContents, Backlinks (gap: 1.2rem)
- After body: RecentNotes (index only), Comments (Giscus)

**Giscus Comments**:
- Repository: `alemsabic/alems-notizen`
- Custom themes: `static/giscus/light.css` & `dark.css`
- Language: German

---

## Deployment

**Platform**: Cloudflare Pages
- **Repository**: https://github.com/alemsabic/alems-site
- **Branch**: `v4`
- **Project**: `ale-ms`
- **Build Command**: `npx quartz build`
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
- Right sidebar order: Graph → TableOfContents → Backlinks
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
if (
  node.tagName === "a" &&
  parent &&
  parent.type === "element" &&
  parent.tagName === "sup"
) {
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

     function onHashChange() { highlightFootnote() }
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
     shortTitle?: string  // Optional short title for navigation (Zotero sources)
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
           shortTitle: file.frontmatter.shortTitle,  // Extract shortTitle from frontmatter
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
     shortTitle?: string  // Optional short title for navigation (Zotero sources)
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
     shortTitle: file.data.frontmatter?.shortTitle,  // Extract shortTitle from frontmatter
     links: file.data.links ?? [],
     // ...
   })
   ```

4. **`quartz/components/ContentHeader.tsx`** (lines 61-68):
   - Comment out redundant title display:
   ```typescript
   {/* Title removed - redundant with ArticleTitle H1
   {title && (
     <>
       <dt>Titel:</dt>
       <dd>{title}.</dd>
     </>
   )}
   */}
   ```

Note: Breadcrumbs.tsx requires no changes - it automatically uses `node.displayName` from fileTrie.

**Frontmatter Usage**:

For Zotero sources, add `shortTitle` to your template:
```yaml
title: "Das Zettelkasten-Prinzip: erfolgreich wissenschaftlich Schreiben und Studieren mit effektiven Notizen"
shortTitle: "Ahrens (2017)"  # ← Used in Explorer & Breadcrumbs
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
