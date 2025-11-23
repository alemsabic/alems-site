# nekontam-site

> **Präsentationsschicht für [nekontam.com](https://nekontam.com)** - Static Site Generator mit Quartz v4.5.1

🌐 **Live Site**: [nekontam.com](https://nekontam.com)

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
- **Typographie**: Playfair Display (Headers), Spectral (Body), JetBrains Mono (Code)
- **Theme**: Custom mit Noise-Textur
- **Layout**: Custom Grid (320px Sidebars, 50px Gap)

### Content Header (Metadata-Anzeige)

Jede Seite zeigt standardmäßig oben rechts eine kompakte Metadaten-Liste:

```
              Naslov: [Titel]
               Datum: [Datum]
    Vrijeme čitanja: [X minut/minute/minuta.]
  Uredi stranicu na GitHub-u.
```

**Frontmatter-Optionen:**
```yaml
---
title: "Deine Seite"
showContentHeader: false  # Metadaten-Liste ausblenden
comments: false           # Giscus Comments ausblenden
---
```

- `showContentHeader: false` - Blendet die komplette Metadaten-Liste aus
- `comments: false` - Blendet die Giscus-Kommentarsektion am Seitenende aus

## 🔄 Deployment-Pipeline

```
Content-Repo (push)
  → GitHub Action
    → Sync zu diesem Repo's /content Ordner
      → Cloudflare Pages Build
        → Deploy zu nekontam.com (1-2 Min)
```

ODER

```
nekontam-site (push Design-Änderungen)
  → Cloudflare Pages Build
    → Deploy zu nekontam.com (1-2 Min)
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

## 🎨 Custom Modifikationen

### Custom Komponenten
- **ContentHeader.tsx**: Unified Metadata-Anzeige (ersetzt ArticleTitle, ContentMeta, TagList, EditOnGitHub)
  - Bosnische Labels (Naslov, Datum, Vrijeme čitanja)
  - Grammatisch korrekte Plural-Formen für Lesezeit
  - Frontmatter-Option: `showContentHeader: false`
  - Rechtsbündige "Briefadresse"-Darstellung
- **Tagline.tsx**: Custom Site-Tagline
- **EditOnGitHub.tsx**: GitHub Edit-Link (integriert in ContentHeader)

### Styling Overrides
- Noise-Textur-Overlay (Dark: 0.5 opacity)
- Custom Grid-Layout mit 50px Gap
- Custom Scrollbar-Styling (orange #d65d0e Akzent)
- Explorer- und TOC-Schriftgrößen reduziert (0.85rem)
- Dark Theme Font Smoothing
- Lined Paper Effect (deaktiviert, leicht reaktivierbar)

### Layout-Änderungen
- Suchleiste repositioniert (zentral über Page Title)
- Graph und Backlinks im Footer
- Rechte Sidebar nur für TOC
- Giscus Comments (GitHub Discussions)
- Custom Spacing und Margins

### Quartz Update-Sicherheit

Die Modifikationen sind **update-sicher** gestaltet:

✅ **Keine Konflikte** (neue Dateien):
- `quartz/components/ContentHeader.tsx`
- `quartz/components/Tagline.tsx`
- `quartz/components/EditOnGitHub.tsx`
- `quartz/styles/custom.scss`

⚠️ **Manuelle Merge-Schritte** bei Quartz-Updates:
1. **`quartz/components/index.ts`**: Import/Export für custom Komponenten erneut hinzufügen
2. **`quartz.layout.ts`**: Layout-Konfiguration erneut anpassen

**Empfohlene Update-Strategie**:
```bash
# 1. Upstream Quartz als Remote hinzufügen (einmalig)
git remote add upstream https://github.com/jackyzha0/quartz.git

# 2. Upstream-Änderungen holen
git fetch upstream

# 3. Merge mit v4 Branch
git merge upstream/v4

# 4. Konflikte in index.ts und quartz.layout.ts manuell lösen
# 5. Custom Komponenten bleiben unberührt
```

Siehe `CLAUDE.md` → "CUSTOMIZATION LOG" für detaillierte Änderungshistorie und Merge-Anweisungen.

## 🙏 Credits

Gebaut mit [Quartz](https://quartz.jzhao.xyz/) von [Jacky Zhao](https://jzhao.xyz/)

## 📄 Lizenz

Quartz ist unter der MIT-Lizenz lizenziert.

Custom Modifikationen und Inhalte sind persönlich.

---

**Fragen?** Siehe [OPERATOR.md](./OPERATOR.md) oder [CLAUDE.md](./CLAUDE.md)
