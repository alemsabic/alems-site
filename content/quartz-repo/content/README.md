# Dein Kopf. Dein Projekt. Deine KI.

> **Jede Idee ist ein Projekt. Jedes Projekt braucht eine KI.**

Content repository for [ale.ms](https://ale.ms) - A digital garden for AI course notes and knowledge.

## 🌱 About

This repository contains markdown-based content that powers the [ale.ms](https://ale.ms) digital garden. Every push to this repository automatically syncs content to the Quartz static site generator and deploys to Cloudflare Pages.

## 📝 Contributing Content

### Quick Start

```bash
# Clone the repository
git clone https://github.com/alemsabic/Dein-Kopf.-Dein-Projekt.-Deine-KI..git
cd Dein-Kopf.-Dein-Projekt.-Deine-KI.

# Edit markdown files
# (Use any editor: VS Code, Obsidian, etc.)

# Commit and push
git add .
git commit -m "content: your description"
git push

# Wait 1-2 minutes → Live on https://ale.ms
```

### Content Structure

```
/
├── index.md              # Homepage
├── about.md             # About page
└── Projekte/            # Projects and topics
    ├── project-one.md
    └── project-two.md
```

### Markdown Guidelines

All content files should include YAML frontmatter:

```yaml
---
title: "Your Page Title"
tags:
  - ai
  - learning
---

Your content here...
```

## 🔄 Auto-Deployment Pipeline

```
1. Edit & Push to this repo
   ↓
2. GitHub Action triggers
   ↓
3. Syncs to Quartz repository
   ↓
4. Cloudflare Pages builds & deploys
   ↓
5. Live on https://ale.ms (1-2 min)
```

## 🤖 Using with Obsidian

This repository works great as an Obsidian vault:

1. Open Obsidian
2. "Open folder as vault"
3. Select this repository folder
4. Edit with full Obsidian features
5. Commit & push as usual

## 🛠️ Technical Details

- **Static Site Generator**: [Quartz v4.5.1](https://quartz.jzhao.xyz/)
- **Quartz Repository**: [alemsabic/notizen](https://github.com/alemsabic/notizen)
- **Hosting**: Cloudflare Pages
- **Auto-Sync**: GitHub Actions
- **Live Site**: [ale.ms](https://ale.ms)

## 📚 Resources

- [CLAUDE.md](./CLAUDE.md) - Detailed context for AI assistants
- [SETUP-TOKEN.md](./SETUP-TOKEN.md) - GitHub token setup guide
- [Quartz Documentation](https://quartz.jzhao.xyz/)
- [Live Site](https://ale.ms)

## 📄 License

Content in this repository is personal knowledge and course notes.

---

**Questions?** See [CLAUDE.md](./CLAUDE.md) for complete documentation.
