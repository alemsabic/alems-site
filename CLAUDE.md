# Claude Code Instructions - Quartz Repository

## ⚠️ Important: Two-Repository Architecture

This repository handles **PRESENTATION ONLY** (Quartz static site generator).

**Content is managed separately**:
- Content Repository (Zettelkasten): https://github.com/alemsabic/alems-zk
- Auto-syncs to `content/` folder via GitHub Actions
- **DO NOT edit files in `content/` directly** - changes will be overwritten!

### Repository Focus:
- ✅ Design, styling, layout
- ✅ Quartz configuration
- ✅ UI components
- ❌ Content (managed in separate repo)

## Project Overview
- **Name**: "alems-site"
- **Type**: Static site generator using Quartz v4.5.1
- **Purpose**: Presentation layer for Zettelkasten (alems-zk)
- **Local dev**: `npx quartz build --serve` (runs on http://localhost:8080)
- **Live Site**: https://ale.ms

## Quick Start (Read This First!)

For complete operator manual, see: **`OPERATOR.md`**

### Key Commands
- **Dev server**: `npx quartz build --serve`
- **Build**: `npx quartz build`
- **Check types**: `npm run check`
- **Format code**: `npm run format`

### Content Workflow
⚠️ Content editing happens in separate repository!

```bash
# Go to content repo (not this one!)
cd /Users/alemsabic/Desktop/ale.ms/content-repo

# Edit markdown files
# Commit & push
git add . && git commit -m "content: ..." && git push

# Auto-syncs to this repo → Deploys to ale.ms
```

## File Structure
- `content/` - ⚠️ AUTO-SYNCED - DO NOT EDIT! (see content/README.md)
- `quartz.config.ts` - Main configuration (fonts, colors, SEO)
- `quartz.layout.ts` - Layout and component positioning
- `quartz/styles/custom.scss` - Custom CSS overrides
- `quartz/components/` - UI components (including custom Tagline)
- `public/` - Built site output (auto-generated)
- `OPERATOR.md` - Complete operator manual
- `CLAUDE.md` - This file (Quartz-specific context)

## Current Configuration
- **Page title**: "ale.ms KI"
- **Page title suffix**: "Jede Idee ein Projekt; jedes Projekt eine KI."
- **Tagline**: "Füge Deiner Intelligenz eine Intelligenz hinzu."
- **Typography**: JetBrains Mono (all text)
- **Base URL**: https://ale.ms
- **Footer**: Custom with Alem Šabić link + X/Twitter
- **Theme**: Custom Quartz with noise texture + lined paper effect

## Deployment
- **Platform**: Cloudflare Pages
- **Repository**: https://github.com/alemsabic/alems-site
- **Branch**: `v4`
- **Build Command**: `npx quartz build`
- **Output Directory**: `public`
- **Live URL**: https://ale.ms
- **Deploy Time**: 1-2 minutes after push

## Completed Tasks
✅ **Initial Setup**
- Project cloned and set up
- Dependencies installed  
- Basic configuration updated (title, footer)
- Site builds and runs successfully
- CLAUDE.md created for future sessions

✅ **GitHub Repository Setup** (Session 2)
- Installed GitHub CLI (`brew install gh`)
- Authenticated with GitHub CLI (with workflow permissions)
- Created repository: `alemsabic/alems-site` - "Präsentationsschicht für ale.ms Zettelkasten"
- Updated `.gitignore` to exclude `CLAUDE.md`, `.obsidian/`, `.claude/` (for Obsidian integration)
- Changed git remote from original Quartz repo to personal repo
- Set up SSH authentication for seamless git operations
- Successfully pushed code to GitHub on `v4` branch

✅ **Cloudflare Pages Deployment**
- Repository `alemsabic/alems-site` connected to Cloudflare Pages
- Build settings: `npx quartz build`, output: `public`, branch: `v4`
- Auto-deployment on git push configured
- Custom domain configured: `ale.ms`
- Site successfully deployed and live

⏳ **Next Session Tasks** (Resume Here)
1. **Customize styling (colors, fonts, layout)**
   - Edit `quartz/styles/custom.scss` for visual customizations
   - Consider: color scheme, typography, spacing, layout adjustments
   - Test locally with: `npx quartz build --serve`
   
2. **Add content and structure to digital garden**
   - Create more markdown files in `content/` folder
   - Organize content structure and navigation
   - Set up Obsidian integration if desired

## Session 2 Summary (Sept 7, 2025)
✅ All technical infrastructure completed successfully
- GitHub repository: `alemsabic/alems-site`
- Live deployment: https://ale.ms (auto-deploys from `v4` branch)
- SSH authentication configured (no more manual auth needed)
- Content publishing workflow documented
- Updated git remote URL to match renamed repository

## Current Deployment
- **GitHub**: https://github.com/alemsabic/alems-site
- **Live Site**: https://ale.ms
- **Cloudflare Pages**: Auto-deploys from `v4` branch

## Workflow: Publishing Content Changes

**To update your live site at https://ale.ms:**

1. **Edit content** in `content/` folder (with Obsidian or any editor)
2. **Commit and push changes**:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```
3. **Wait 1-2 minutes** - Cloudflare Pages automatically builds and deploys

**Important**: 
- NO need to run `npx quartz build` locally - Cloudflare does this automatically
- Changes appear live within 1-2 minutes of pushing to GitHub
- All commits to `v4` branch trigger automatic deployment

## Notes
- Site rebuilds automatically in dev mode when files change
- Git tracking affects file dates (warnings normal during development)
- Custom styling goes in `quartz/styles/custom.scss`
- Content managed in `content/` folder (Obsidian integration ready)

---

# CUSTOMIZATION LOG
*Track all changes made to support future upstream merges and project replication*

## Upstream Repository
- **Original**: https://github.com/jackyzha0/quartz
- **Fork Date**: Sept 7, 2025 (Quartz v4.5.1)
- **Tracking**: Changes documented to enable clean upstream merges

## Session 3 Changes (Sept 10, 2025)

### Layout Customizations
**Files Modified**: `quartz.layout.ts`

**Original State** (Baseline):
```typescript
// Left sidebar: PageTitle, Search+Darkmode+ReaderMode, Explorer
// Right sidebar: Graph, TableOfContents, Backlinks  
// Main content: Breadcrumbs, ArticleTitle, ContentMeta, TagList
```

**Layout Changes Made**:
- **Moved Graph and Backlinks to afterBody**: Relocated from right sidebar to below main content
- **Right sidebar removed**: Completely empty (removed Table of Contents)
- **Search bar repositioned**: Moved to center above page header in main content area
- **Dark mode toggle integrated**: Combined with search bar in Flex container (search grows, dark mode on right)
- **Reader mode removed**: Completely removed from all layouts
- **Component order**: Backlinks → Graph (below main content)

**Design/Styling Changes**:
- **Search bar width**: Set to 100% width using custom CSS (`.search` class)
- **Burger button padding**: Removed left padding from mobile explorer toggle (`.explorer .mobile-explorer`)
- **Page title font size**: Set to 1rem (`.page-title` class)
- **Simplified layout**: Single Dark mode toggle on all devices (removed Reader mode complexity)
- **Site name**: Changed from "My Digital Garden" to "ale.ms"
- **Footer customization**: Added "Alem Šabić" link to alemsabic.com with © 2025 and X/Twitter link (removed Quartz attribution)
- **Backlinks margin**: Added 2rem bottom margin to `.backlinks` component
- **Typography**: Changed to Geist (headers) and Geist Mono (body/code) from Google Fonts

**Rationale**:
- Cleaner right sidebar focuses user attention on Table of Contents for navigation
- Prominent search bar placement for better discoverability
- Mode toggles in sidebar keep main content area clean
- Reader mode only useful on desktop screens
- Full-width search improves usability and visual balance

## Session 4 Updates (Sept 13, 2025)

### Documentation & Maintenance
**Files Modified**: `CLAUDE.md`

**Changes Made**:
- **Typography correction**: Updated documentation from "Spectral" to "Geist" fonts (actual current implementation)
- **Font update**: Changed fonts from Geist → "Old Standard TT" → "PT Sans" → "PT Sans Narrow" → "JetBrains Mono" (all typography)
- **Deployment**: Committed and pushed typography changes to GitHub (commit 18a0708)
- **Logging improvement**: Added Session 4 tracking for better change documentation

**Current Font Configuration** (updated in `quartz.config.ts`):
```typescript
typography: {
  header: "JetBrains Mono",
  body: "JetBrains Mono",
  code: "JetBrains Mono",
}
```

**Process Improvement**:
- ✅ Established real-time logging of changes in CLAUDE.md
- ✅ Verification of actual vs documented configuration
- 🎯 Going forward: Update CLAUDE.md immediately after any changes

## Session 5 Updates (Sept 17, 2025)

### Content Structure & Styling Improvements
**Files Modified**: 9 markdown content files + `custom.scss`

**Content Changes Made**:
- **H1 to Frontmatter Migration**: Converted all H1 headings (`# Title`) to YAML frontmatter `title` properties across all content files
- **Files Updated**: `typography-demo.md`, `long-form-article.md`, `quick-notes.md`, `projects/web-redesign.md`, `projects/design-system.md`, `research/user-study-2024.md`, `research/market-analysis.md`, `personal/book-reviews.md`, `personal/travel-log.md`
- **Consistent Structure**: All files now follow the `about.md` pattern with frontmatter titles instead of markdown H1 headings

**Styling Changes Made**:
- **Explorer folder list**: Added darker background (`var(--gray)`) to `.explorer-content .folder-outer > ul` for better visibility
- **CSS cleanup**: Improved formatting and dark theme noise opacity consistency

**Benefits**:
- **SEO improvement**: Frontmatter titles are better for page metadata and navigation
- **Cleaner content**: Eliminates redundant H1 headings in markdown body
- **Consistent structure**: All pages follow same title pattern
- **Better UX**: Darker folder list improves readability

**Deployment**:
- Commit b4b0f11: "feat: move H1 headings to frontmatter titles and add styling improvements"
- Live at https://ale.ms within 1-2 minutes of push

---

## Session 6 Updates (Oct 7, 2025)

### Custom Tagline Component
**Files Created**: `quartz/components/Tagline.tsx`
**Files Modified**: `quartz/components/index.ts`, `quartz.layout.ts`, `custom.scss`

**Changes Made**:
- **New Component**: Created custom `Tagline.tsx` component to display site description
- **Text**: "Füge Deiner Intelligenz eine Intelligenz hinzu." (current)
- **Responsive Behavior**:
  - Desktop/tablet (>768px): Block element below PageTitle with 0.5rem top margin
  - Mobile (≤768px): Inline element next to PageTitle with 0.5rem left margin
- **Styling**: Font-size 0.9rem, color: `var(--gray)`
- **Layout Integration**: Replaced `MobileOnly(Spacer())` with `Tagline()` in both page layouts

**Update Strategy for Future Quartz Merges**:
When merging upstream Quartz updates:
1. ✅ `Tagline.tsx` is a new file - won't conflict (just keep it)
2. ✅ `index.ts` - Re-add import/export for Tagline after merge
3. ✅ `quartz.layout.ts` - Replace `MobileOnly(Spacer())` with `Tagline()` in left sidebar
4. ✅ `custom.scss` - Re-add tagline responsive styles (lines 50-62)

**Rationale**:
- Clean separation: No core component modifications
- Easy to maintain: Single custom component
- Update-friendly: Clear documentation for re-integration
- Core components (PageTitle, Spacer) remain untouched

### Explorer Styling Improvements
**Files Modified**: `custom.scss`

**Changes Made**:
- **Font sizes**: Reduced `.folder-container div>a` and `.explorer-content ul li>a` to 0.85rem
- **Hover effect**: Added opacity transition (0.75 → 1) with 0.2s ease on explorer links
- **Spacing**: Set uniform 0.15rem margins for both `ul` and `li` elements in explorer

**Benefits**:
- Cleaner, more compact explorer sidebar
- Better visual hierarchy with smaller font
- Smooth hover feedback for improved UX

### Additional Styling Updates (Oct 7, 2025 - continued)
**Files Modified**: `custom.scss`, `static/icon.png`

**Changes Made**:
- **Profile image background (dark mode)**: Changed from `#b60c0c` (red) to `#a9a9a9` (gray)
- **Top shadow effect**: Added inset box-shadow to create depth illusion
  - Light theme: `rgba(0, 0, 0, 0.6)` shadow
  - Dark theme: `rgba(255, 255, 255, 0.15)` lighter shadow for contrast
- **Custom scrollbar styling**: Added WebKit scrollbar customization
  - Width: 9px, height: 8px
  - Subtle transparency-based colors
  - Rounded 2px corners on thumb
  - Active state: `#d65d0e` (orange accent)
- **Site icon**: Updated `icon.png` (binary file change)

**Benefits**:
- Improved visual depth with top shadow
- Consistent scrollbar styling across browsers
- Better dark mode profile image integration

**Deployment**: Ready to commit and push

---

## Session 7 Updates (Oct 8, 2025) - **Design v1.0 Complete** ✅

### Major Styling Overhaul
**Files Modified**: `custom.scss`, `quartz.layout.ts`, `Tagline.tsx`

**Changes Made**:
- **Body shadow removed**: Eliminated inset box-shadow from body element (light & dark theme)
- **Profile image removed**: Commented out ProfileImage component and CSS (easy restore)
- **Tagline updated**:
  - Text: "Füge Deiner Intelligenz eine Intelligenz hinzu." (current)
  - Color: `var(--gray)` (responsive to theme)
- **Typography**: Removed `text-transform: uppercase` from all headers (h1-h6)
- **Noise effect**: Reduced dark theme opacity from 0.9 to 0.5 for subtler texture
- **Table of Contents**: Font-size set to 0.85rem (matching Explorer links)
- **Layout spacing**: Custom grid with 50px gap between sidebars and center content
  - Grid template: `320px auto 320px` column layout
  - Applied via `@media (min-width: 1200px)` for desktop only

**Design Philosophy**:
- Clean, minimal interface focused on content readability
- Consistent typography sizing across navigation elements
- Reduced visual noise for better focus
- Generous spacing for improved reading experience

**Version**: Design v1.0 - Base design complete, ready for content creation

---

## 📋 Next Session Tasks (Future Development)

### High Priority: Color Scheme Implementation
**Objective**: Apply professional coding color scheme to entire site

**Options to Explore**:
1. **Gruvbox** - Warm, retro groove color palette (popular in code editors)
2. **Nord** - Arctic, bluish color scheme
3. **Dracula** - Dark purple theme
4. **Solarized** - Precision colors for machines and people
5. **Tokyo Night** - Modern dark theme

**Implementation Strategy**:
- Research: Quick feasibility check for color scheme integration
- Define: Map Quartz CSS variables to chosen scheme colors
- Apply: Update `variables.scss` with new color definitions
- Test: Verify readability in light/dark modes

**Benefits**:
- Visual bridge between code and text content
- Professional, recognizable aesthetic
- Enhanced brand identity with AI/code association
- Improved accessibility with tested color contrasts

**Estimated Effort**: Quick implementation (1-2 hours) - Color schemes are well-documented with hex values readily available

### Content-Driven Improvements
*Features to add as content needs emerge during writing*

**Potential Additions**:
- Enhanced code block styling
- Custom callout boxes for different note types
- Improved link preview cards
- Better image handling and galleries
- Search improvements
- Tag organization enhancements

---

## Session 8 Updates (Oct 12, 2025) - Typography & Color Planning

### Typography Changes
**Files Modified**: `quartz.config.ts`, `custom.scss`

**Changes Made**:
- **Font update**: Changed from JetBrains Mono to serif fonts
  - **Headers**: Playfair Display (700 Bold)
  - **Body**: Spectral
  - **Code**: JetBrains Mono (maintained for code blocks)
- **Font weights**: Adjusted heading weight from 500 to 700 for better prominence
- **Page title link**: Added explicit `font-weight: 700` to `.page-title a` to match other headings
- **Tagline color**: Changed from purple (`#8877a5`) to `var(--gray)` for better theme integration
- **Lined paper effect**: Commented out light theme lined paper background (lines 129-133 in custom.scss) - easily restorable

**Rationale**:
- Serif fonts provide better readability for long-form content
- Playfair Display adds elegant, distinctive character to headings
- Spectral optimized for digital reading with modern proportions
- Combination creates visual hierarchy while maintaining cohesion

### Planned Color Scheme (NOT YET IMPLEMENTED)
**Objective**: Bold, distinctive color palette

**Background Colors (First Step)**:
- **Dark Theme**: `#0e0126` (very dark purple/violet)
- **Light Theme**: `#FFEB3B` (bright yellow)

**⚠️ IMPORTANT - Full Implementation Required**:
When implementing this color scheme, ALL color values in `quartz.config.ts` must be updated for consistency:

```typescript
// In quartz.config.ts - colors section
lightMode: {
  light: "#FFEB3B",      // Background - BRIGHT YELLOW
  lightgray: "...",      // TBD - adjust for yellow background
  gray: "...",           // TBD - adjust for yellow background
  darkgray: "...",       // TBD - adjust for yellow background
  dark: "...",           // TBD - adjust for yellow background
  secondary: "...",      // Links - TBD
  tertiary: "...",       // Tags - TBD
  highlight: "...",      // TBD
  textHighlight: "...",  // TBD
}
darkMode: {
  light: "#0e0126",      // Background - DARK PURPLE
  lightgray: "...",      // TBD - adjust for purple background
  gray: "...",           // TBD - adjust for purple background
  darkgray: "...",       // TBD - adjust for purple background
  dark: "...",           // TBD - adjust for purple background
  secondary: "...",      // Links - TBD
  tertiary: "...",       // Tags - TBD
  highlight: "...",      // TBD
  textHighlight: "...",  // TBD
}
```

**Elements Requiring Color Adjustment**:
- Text colors (body text, headings)
- Links (secondary)
- Tags (tertiary)
- Borders (lightgray, gray)
- Highlights and accents
- Graph and UI component colors
- Search bar and sidebar elements
- All interactive elements (hover states, active states)

**Implementation Notes**:
- This is a bold, distinctive palette - yellow/purple combination
- Requires careful contrast testing for accessibility
- All colors must harmonize with new backgrounds
- Consider color blindness and readability
- Test in both light and dark modes thoroughly

**Current Status**: Planning phase - colors noted for future implementation

---

## Future Sessions
*Continue logging changes in this section*