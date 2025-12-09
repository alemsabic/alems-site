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

### 🔴 CURRENT ISSUE: Cloudflare Pages Deployment Failed

**Problem**:
- Commit `cfe18a7` pushed successfully
- Cloudflare deployment failed: "build failed to initialize in time"
- This is a **Cloudflare infrastructure issue**, NOT a code problem
- Local build works fine: "Done processing 9 files in 152ms"

**Status**: Awaiting Cloudflare infrastructure recovery or manual retry

**Options**:
1. Retry deployment in Cloudflare Dashboard
2. Check https://www.cloudflarestatus.com/ for outages
3. Wait 10-30 minutes for auto-resolution
4. Contact support: https://cfl.re/3WgEyrH

---

## Notes

- Site rebuilds automatically in dev mode when files change
- Custom styling goes in `quartz/styles/custom.scss`
- Theme: Custom with noise texture
- Footer: Custom with Alem Šabić link + X/Twitter

---

## Historical Context (Archived)

**Migration History**: nekontam.com → pathologie.gpunkt.org → ale.ms
- Complete migration details in git history (Sessions 1-15)
- Current state: Clean ale.ms setup with two-repository architecture
- Old CLAUDE.md content archived for brevity
