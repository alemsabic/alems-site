# Claude Code Instructions - Content Repository

## Repository Overview
- **Name**: "Dein Kopf. Dein Projekt. Deine KI."
- **Purpose**: Content repository for ale.ms digital garden
- **Description**: "Jede Idee ist ein Projekt. Jedes Projekt braucht eine KI."
- **Type**: Markdown content files / Zettelkasten / Knowledge base
- **Live Site**: https://ale.ms

## Architecture

This repository contains **ONLY content** (Markdown files). The presentation layer (Quartz) is in a separate repository.

### Two-Repository Setup:
1. **Content Repository** (this repo): Markdown files, notes, knowledge
   - https://github.com/alemsabic/Dein-Kopf.-Dein-Projekt.-Deine-KI.
2. **Quartz Repository**: Static site generator, design, layout
   - https://github.com/alemsabic/notizen

### Auto-Sync Workflow:
```
Content Repo (push)
  → GitHub Action triggers
    → Syncs to Quartz repo /content folder
      → Cloudflare Pages builds & deploys
        → Live on https://ale.ms (1-2 minutes)
```

## File Structure

```
/
├── index.md              # Homepage
├── about.md             # About page
├── Projekte/            # Projects folder
│   ├── project-one.md
│   └── project-two.md
├── .github/
│   └── workflows/
│       └── sync-to-quartz.yml  # Auto-sync GitHub Action
├── CLAUDE.md            # This file - content context
└── SETUP-TOKEN.md       # PAT setup instructions
```

## Key Commands

### Editing Content
```bash
# Work in this directory
cd /Users/alemsabic/Desktop/ale.ms/content-repo

# Edit any .md file (Obsidian, VS Code, etc.)
# Markdown syntax, frontmatter YAML supported
```

### Publishing Changes
```bash
git add .
git commit -m "content: your description"
git push

# Wait 1-2 minutes → Changes live on ale.ms
```

### Checking Sync Status
```bash
# View GitHub Actions
open https://github.com/alemsabic/Dein-Kopf.-Dein-Projekt.-Deine-KI./actions

# Manual trigger if needed
# Actions → "Sync Content to Quartz" → Run workflow
```

## Content Guidelines

### Frontmatter Format
All pages should include YAML frontmatter:

```yaml
---
title: "Page Title"
tags:
  - ai
  - learning
  - project
---

# Content starts here...
```

### Markdown Features (Quartz Support)
- **Headers**: `#`, `##`, `###`, etc.
- **Links**: `[[internal-link]]` or `[external](https://...)`
- **Images**: `![alt text](image.png)`
- **Code blocks**: ` ```language ... ``` `
- **Callouts**: Quartz supports custom callouts
- **Math**: LaTeX math via `$...$` and `$$...$$`
- **Tags**: `#tag` or frontmatter `tags: [...]`

### File Organization
- Use folders for topics/categories
- Lowercase filenames with hyphens: `my-note.md`
- Index files for folder overviews: `folder/index.md`

## GitHub Action Configuration

**File**: `.github/workflows/sync-to-quartz.yml`

**Trigger**: Every push to `main` branch

**What it does**:
1. Checks out content repo
2. Checks out Quartz repo (with PAT)
3. Syncs content to `quartz-repo/content/`
4. Commits and pushes to Quartz repo
5. Cloudflare auto-deploys

**Important**:
- Requires `QUARTZ_REPO_TOKEN` secret (PAT with repo access)
- Preserves `.gitkeep` and `.obsidian` in Quartz content folder
- Auto-commit message includes Claude Code attribution

## Obsidian Integration (Optional)

This repo can be opened as Obsidian vault:

1. Open Obsidian
2. "Open folder as vault"
3. Select: `/Users/alemsabic/Desktop/ale.ms/content-repo`
4. Edit with Obsidian UI
5. Git commit/push as usual

**Obsidian plugins recommended**:
- Git (for auto-commit)
- Templater (for content templates)
- Tag Wrangler (for tag management)

## Session Log

### Session 1 (Oct 8, 2025) - Repository Setup ✅

**Created**:
- New GitHub repository: "Dein Kopf. Dein Projekt. Deine KI."
- Initial content import from Quartz repo
- GitHub Action for auto-sync to Quartz
- Documentation files (CLAUDE.md, SETUP-TOKEN.md)

**Files**:
- `index.md`: Homepage content
- `about.md`: About page
- `Projekte/`: Project folder structure
- `.github/workflows/sync-to-quartz.yml`: Auto-sync workflow

**Configuration**:
- GitHub PAT secret: `QUARTZ_REPO_TOKEN` (repo scope)
- Auto-sync on every push to main
- Target: `alemsabic/notizen` repo, `v4` branch, `/content` folder

**Architecture Decision**:
- Separated content from presentation (Quartz)
- Content-only repo enables focus on writing
- GitHub Actions automates sync + deploy pipeline
- Cloudflare Pages handles final deployment

---

## Working with Claude Code

When using Claude Code on this repository:

**Context**: This is CONTENT-ONLY work
- Focus on: Markdown files, content structure, organization
- NOT on: Design, styling, layout (that's in Quartz repo)

**Tasks Claude can help with**:
- Writing and editing markdown content
- Organizing files and folders
- Creating content templates
- Fixing frontmatter issues
- Managing tags and links
- Content QA and consistency checks

**Tasks for Quartz repo** (not here):
- Design changes
- Component development
- CSS/styling
- Layout modifications
- Quartz configuration

**Important**: Always read this file first to understand content-only scope.

---

## Troubleshooting

### Sync not working?
1. Check GitHub Actions tab for errors
2. Verify `QUARTZ_REPO_TOKEN` secret exists and is valid
3. Check PAT has `repo` scope permissions
4. Manually trigger workflow if needed

### Content not appearing on site?
1. Wait 2-3 minutes (sync + build + deploy)
2. Check Cloudflare Pages deployment status
3. Verify markdown frontmatter is valid YAML
4. Check for broken internal links

### Git conflicts?
```bash
git pull --rebase
# Fix conflicts
git add .
git rebase --continue
git push
```

---

## Next Steps

**Content to add**:
- Course notes for AI topics
- Project documentation
- Learning resources
- Code snippets and examples

**Organization improvements**:
- Create topic-based folder structure
- Add index pages for navigation
- Tag taxonomy for filtering
- Content templates for consistency

---

## Resources

- **Live Site**: https://ale.ms
- **Quartz Repo**: https://github.com/alemsabic/notizen
- **Quartz Docs**: https://quartz.jzhao.xyz/
- **Markdown Guide**: https://www.markdownguide.org/
- **YAML Frontmatter**: https://quartz.jzhao.xyz/authoring-content

---

*This file is .gitignored - safe for local context*
