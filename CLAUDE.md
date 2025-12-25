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

## Historical Context (Archived)

**Migration History**: nekontam.com → pathologie.gpunkt.org → ale.ms
- Complete migration details in git history (Sessions 1-15)
- Current state: Clean ale.ms setup with two-repository architecture
- Old CLAUDE.md content archived for brevity
