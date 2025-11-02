# nekontam-site

> **Präsentationsschicht für [nekontam.alemsabic.com](https://nekontam.alemsabic.com)** - Static Site Generator mit Quartz v4.5.1

🌐 **Live Site**: [nekontam.alemsabic.com](https://nekontam.alemsabic.com)

## 🎯 Über dieses Repository

Dieses Repository enthält die **Präsentationsschicht** (Quartz Static Site Generator) für NE KONTAM - Rječnik sarajevskog žargona.

### Zwei-Repository-Architektur:

1. **nekontam-site** (dieses Repo): Design, Layout, Konfiguration
   - https://github.com/alemsabic/nekontam-site
2. **nekontam-zk**: Rječnik-Inhalte (Markdown), separat verwaltet
   - https://github.com/alemsabic/nekontam-zk

**Inhalte synchronisieren automatisch** vom Content-Repository via GitHub Actions.

## 🚀 Quick Start

### Für Betreiber

**Vollständiges Handbuch**: Siehe [`OPERATOR.md`](./OPERATOR.md) für alle Kommandos und Workflows.

**Schnellbefehle**:

```bash
# Lokalen Dev-Server starten
npx quartz build --serve
# → http://localhost:8080

# Production Build
npx quartz build

# Type-Check
npm run check
```

### Für Content-Editoren

⚠️ **Inhalte werden NICHT in diesem Repository bearbeitet!**

Inhalte werden im separaten Content-Repository bearbeitet:
- Repository: https://github.com/alemsabic/nekontam-zk
- Siehe README im Content-Repo für Anleitungen

## 📁 Projektstruktur

```
nekontam-site/
├── content/              # ⚠️ AUTO-SYNC - NICHT EDITIEREN
│   └── README.md        # Erklärt Auto-Sync
├── quartz/
│   ├── components/       # UI-Komponenten (inkl. custom Tagline)
│   ├── styles/          # SCSS-Styling
│   │   └── custom.scss  # Custom Overrides
│   └── ...
├── quartz.config.ts     # Site-Konfiguration
├── quartz.layout.ts     # Komponenten-Layout
├── OPERATOR.md          # Vollständiges Betreiber-Handbuch
├── CLAUDE.md            # KI-Assistent-Kontext
└── README.md            # Diese Datei
```

## ⚙️ Konfiguration

- **Site Title**: "NE KONTAM"
- **Tagline**: "Rječnik sarajevskog žargona"
- **Typographie**: Quicksand (Headers), JetBrains Mono (Body/Code)
- **Theme**: Custom mit Noise-Textur
- **Layout**: Custom Grid (320px Sidebars, 50px Gap)

## 🔄 Deployment-Pipeline

```
Content-Repo (push)
  → GitHub Action
    → Sync zu diesem Repo's /content Ordner
      → Cloudflare Pages Build
        → Deploy zu nekontam.alemsabic.com (1-2 Min)
```

ODER

```
nekontam-site (push Design-Änderungen)
  → Cloudflare Pages Build
    → Deploy zu nekontam.alemsabic.com (1-2 Min)
```

## 🛠️ Tech Stack

- **Static Site Generator**: [Quartz v4.5.1](https://quartz.jzhao.xyz/)
- **Styling**: SCSS mit Custom Overrides
- **Typographie**: Google Fonts
- **Deployment**: Cloudflare Pages
- **Auto-Sync**: GitHub Actions
- **Content-Format**: Markdown mit YAML Frontmatter

## 📚 Dokumentation

- **[OPERATOR.md](./OPERATOR.md)** - Vollständiges Betreiber-Handbuch (hier starten!)
- **[CLAUDE.md](./CLAUDE.md)** - Kontext für KI-Assistenten (Claude Code)
- **[content/README.md](./content/README.md)** - Auto-Sync-Erklärung
- **[Quartz Docs](https://quartz.jzhao.xyz/)** - Offizielle Quartz-Dokumentation

## 🎨 Anpassungen

Dieses Projekt basiert auf dem ale.ms Setup und enthält custom Modifikationen:

### Custom Komponenten
- **Tagline.tsx**: Custom Tagline-Komponente

### Styling Overrides
- Noise-Textur-Overlay
- Custom Grid-Layout mit 50px Gap
- Custom Scrollbar-Styling
- Explorer- und TOC-Schriftgrößen reduziert
- Dark Theme Font Smoothing

### Layout-Änderungen
- Suchleiste repositioniert
- Graph und Backlinks im Footer
- Rechte Sidebar nur für TOC
- Custom Spacing und Margins

Siehe `CLAUDE.md` für vollständigen Changelog.

## 🙏 Credits

Gebaut mit [Quartz](https://quartz.jzhao.xyz/) von [Jacky Zhao](https://jzhao.xyz/)

## 📄 Lizenz

Quartz ist unter der MIT-Lizenz lizenziert.

Custom Modifikationen und Inhalte sind persönlich.

---

**Fragen?** Siehe [OPERATOR.md](./OPERATOR.md) oder [CLAUDE.md](./CLAUDE.md)
