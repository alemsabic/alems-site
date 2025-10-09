# alems-site

> **Präsentationsschicht für [ale.ms](https://ale.ms)** - Static Site Generator mit Quartz v4.5.1

🌐 **Live Site**: [ale.ms](https://ale.ms)

## 🎯 Über dieses Repository

Dieses Repository enthält die **Präsentationsschicht** (Quartz Static Site Generator) für den ale.ms Zettelkasten.

### Zwei-Repository-Architektur:

1. **alems-site** (dieses Repo): Design, Layout, Konfiguration
   - https://github.com/alemsabic/alems-site
2. **alems-zk**: Zettelkasten-Inhalte (Markdown), separat verwaltet
   - https://github.com/alemsabic/alems-zk

**Inhalte synchronisieren automatisch** vom Zettelkasten-Repository via GitHub Actions.

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

Inhalte werden im separaten Zettelkasten-Repository bearbeitet:
- Repository: https://github.com/alemsabic/alems-zk
- Siehe README im Zettelkasten-Repo für Anleitungen

## 📁 Projektstruktur

```
alems-site/
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

- **Site Title**: "ale.ms KI"
- **Tagline**: "Füge Deiner Intelligenz eine Intelligenz hinzu."
- **Typographie**: JetBrains Mono (gesamter Text)
- **Theme**: Custom mit Noise-Textur + liniertem Papier-Effekt
- **Layout**: Custom Grid (320px Sidebars, 50px Gap)

## 🔄 Deployment-Pipeline

```
Zettelkasten-Repo (push)
  → GitHub Action
    → Sync zu diesem Repo's /content Ordner
      → Cloudflare Pages Build
        → Deploy zu ale.ms (1-2 Min)
```

ODER

```
alems-site (push Design-Änderungen)
  → Cloudflare Pages Build
    → Deploy zu ale.ms (1-2 Min)
```

## 🛠️ Tech Stack

- **Static Site Generator**: [Quartz v4.5.1](https://quartz.jzhao.xyz/)
- **Styling**: SCSS mit Custom Overrides
- **Typographie**: JetBrains Mono (Google Fonts)
- **Deployment**: Cloudflare Pages
- **Auto-Sync**: GitHub Actions
- **Content-Format**: Markdown mit YAML Frontmatter

## 📚 Dokumentation

- **[OPERATOR.md](./OPERATOR.md)** - Vollständiges Betreiber-Handbuch (hier starten!)
- **[CLAUDE.md](./CLAUDE.md)** - Kontext für KI-Assistenten (Claude Code)
- **[content/README.md](./content/README.md)** - Auto-Sync-Erklärung
- **[Quartz Docs](https://quartz.jzhao.xyz/)** - Offizielle Quartz-Dokumentation

## 🎨 Anpassungen

Dieses Projekt enthält custom Modifikationen zum Vanilla Quartz:

### Custom Komponenten
- **Tagline.tsx**: Custom Tagline-Komponente

### Styling Overrides
- Noise-Textur-Overlay
- Linierter Papier-Hintergrund (Light Theme)
- Custom Grid-Layout mit 50px Gap
- Profilbild entfernt
- Custom Scrollbar-Styling
- Explorer- und TOC-Schriftgrößen reduziert
- Dark Theme Font Smoothing

### Layout-Änderungen
- Suchleiste repositioniert
- Graph und Backlinks im Footer
- Rechte Sidebar nur für TOC
- Custom Spacing und Margins

Siehe `CLAUDE.md` Session 7 für vollständigen Changelog.

## 🔮 Zukünftige Pläne

- **Farbschema**: Implementierung eines Coding-Farbschemas (Gruvbox/Nord/Tokyo Night)
- **Content-basierte Features**: Features hinzufügen, wenn Content-Bedarf entsteht
- Siehe `CLAUDE.md` für detaillierte nächste Schritte

## 🙏 Credits

Gebaut mit [Quartz](https://quartz.jzhao.xyz/) von [Jacky Zhao](https://jzhao.xyz/)

## 📄 Lizenz

Quartz ist unter der MIT-Lizenz lizenziert.

Custom Modifikationen und Inhalte sind persönlich.

---

**Fragen?** Siehe [OPERATOR.md](./OPERATOR.md) oder [CLAUDE.md](./CLAUDE.md)
