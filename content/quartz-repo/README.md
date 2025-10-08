# ale.ms - Quartz Digital Garden

> **Presentation layer for [ale.ms](https://ale.ms)** - Static site generator using Quartz v4.5.1

🌐 **Live Site**: [ale.ms](https://ale.ms)

## 🎯 About This Repository

This repository contains the **presentation layer** (Quartz static site generator) for the ale.ms digital garden.

### Two-Repository Architecture:

1. **Quartz Repository** (this repo): Design, layout, configuration
   - https://github.com/alemsabic/notizen
2. **Content Repository**: Markdown content, managed separately
   - https://github.com/alemsabic/Dein-Kopf.-Dein-Projekt.-Deine-KI.

**Content auto-syncs** from the content repository via GitHub Actions.

## 🚀 Quick Start

### For Operators

**Complete operator manual**: See [`OPERATOR.md`](./OPERATOR.md) for all essential commands and workflows.

**Quick commands**:

```bash
# Start local development server
npx quartz build --serve
# → http://localhost:8080

# Build for production
npx quartz build

# Type check
npm run check
```

### For Content Editors

⚠️ **Content is NOT edited in this repository!**

Edit content in the separate content repository:
- Repository: https://github.com/alemsabic/Dein-Kopf.-Dein-Projekt.-Deine-KI.
- See content repo README for instructions

## 📁 Project Structure

```
quartz/
├── content/              # ⚠️ AUTO-SYNCED - DO NOT EDIT
│   └── README.md        # Explains auto-sync
├── quartz/
│   ├── components/       # UI components (incl. custom Tagline)
│   ├── styles/          # SCSS styling
│   │   └── custom.scss  # Custom overrides
│   └── ...
├── quartz.config.ts     # Site configuration
├── quartz.layout.ts     # Component layout
├── OPERATOR.md          # Complete operator manual
├── CLAUDE.md            # AI assistant context
└── README.md            # This file
```

## ⚙️ Configuration

- **Site Title**: "ale.ms"
- **Tagline**: "Kursnotizen: Künstliche Intelligenz"
- **Typography**: JetBrains Mono (all text)
- **Theme**: Custom with noise texture + lined paper effect
- **Layout**: Custom grid (320px sidebars, 50px gap)

## 🔄 Deployment Pipeline

```
Content Repo (push)
  → GitHub Action
    → Syncs to this repo's /content folder
      → Cloudflare Pages builds
        → Deploys to ale.ms (1-2 min)
```

OR

```
Quartz Repo (push design changes)
  → Cloudflare Pages builds
    → Deploys to ale.ms (1-2 min)
```

## 🛠️ Technology Stack

- **Static Site Generator**: [Quartz v4.5.1](https://quartz.jzhao.xyz/)
- **Styling**: SCSS with custom overrides
- **Typography**: JetBrains Mono (Google Fonts)
- **Deployment**: Cloudflare Pages
- **Auto-Sync**: GitHub Actions
- **Content Format**: Markdown with YAML frontmatter

## 📚 Documentation

- **[OPERATOR.md](./OPERATOR.md)** - Complete operator manual (start here!)
- **[CLAUDE.md](./CLAUDE.md)** - Context for AI assistants (Claude Code)
- **[content/README.md](./content/README.md)** - Auto-sync explanation
- **[Quartz Docs](https://quartz.jzhao.xyz/)** - Official Quartz documentation

## 🎨 Customizations

This project includes custom modifications to vanilla Quartz:

### Custom Components
- **Tagline.tsx**: Custom tagline component

### Styling Overrides
- Noise texture overlay
- Lined paper background (light theme)
- Custom grid layout with 50px gap
- Profile image removed
- Custom scrollbar styling
- Explorer and TOC font sizes reduced
- Dark theme font smoothing

### Layout Changes
- Search bar repositioned
- Graph and Backlinks in footer
- Right sidebar for TOC only
- Custom spacing and margins

See `CLAUDE.md` Session 7 for complete changelog.

## 🔮 Future Plans

- **Color Scheme**: Implement coding color scheme (Gruvbox/Nord/Tokyo Night)
- **Content-Driven Features**: Add features as content needs emerge
- See `CLAUDE.md` for detailed next steps

## 🙏 Credits

Built with [Quartz](https://quartz.jzhao.xyz/) by [Jacky Zhao](https://jzhao.xyz/)

> "[One] who works with the door open gets all kinds of interruptions, but [they] also occasionally gets clues as to what the world is and what might be important." — Richard Hamming

## 📄 License

Quartz is licensed under the MIT License.

Custom modifications and content are personal.

---

**Questions?** See [OPERATOR.md](./OPERATOR.md) or [CLAUDE.md](./CLAUDE.md)
