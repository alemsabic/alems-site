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
├── CLAUDE.md            # KI-Assistent-Kontext
└── README.md            # Diese Datei (Vollständiges Handbuch)
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

- **[README.md](./README.md)** - Dieses Dokument (vollständiges Handbuch)
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

### Content-Type Styling: Wörterbuch-Einträge

**Ziel**: Altes Wörterbuch-Design (dicht, Blocksatz, Serif-Schrift) für Kontrast zwischen formaler Darstellung und anarchischem Inhalt.

**Verfügbare Layouts**:

#### 1. Einzelspaltig (Standard)
```yaml
---
title: baklava
cssclasses: dictionary-entry
---
```

**CSS-Features** (`article.dictionary-entry`):
- **Font**: Baskerville/Garamond Serif-Stack
- **Layout**: Inline-Block (kein Platz verschwendet wie im alten Druck)
- **Typography Mobile**: `font-size: 1.1rem`, `line-height: 1.15`, `letter-spacing: 0.01em`
- **Typography Desktop**: `font-size: 1.25rem` (größer für bessere Lesbarkeit)
- **Text-Align**: Justify (Blocksatz)
- **Paragraphen**: `display: inline` - alles fließt als dichter Block

#### 2. Zweispaltig (Desktop-Layout)
```yaml
---
title: baklava
cssclasses: dictionary-entry-columns
---
```

**CSS-Features** (`article.dictionary-entry-columns`):
- Identisch zu `dictionary-entry`, **aber**:
- **Typography**: `font-size: 1.1rem` auf **allen** Geräten (keine Desktop-Vergrößerung)
- **Desktop (min-width: 800px)**: 2-Spalten-Layout
  - `column-count: 2`
  - `column-gap: 2rem`
  - `column-fill: balance` (beide Spalten gleich lang)
- **Mobile**: Einzelne Spalte wie `dictionary-entry`

**Wann welches Layout?**
- **`dictionary-entry`**: Kürzere Einträge, bessere Lesbarkeit durch größere Schrift auf Desktop
- **`dictionary-entry-columns`**: Längere Einträge, platzsparend wie gedruckte Wörterbücher

**Verfügbare Klassen**:
- `.headword` - Haupteintrag (bold uppercase, 1.35em)
- `.cyrillic` - Kyrillische Variante (bold, 1.35em)
- `.pronunciation` - Aussprache (0.95em)
- `.separator` - Diamant ♦ (bold)
- `.foreign-equiv` - Fremdsprachen-Äquivalente (0.95em)
- `.xref` - Querverweise (0.9em, margin-left: 8px)

**Beispiel-Markup**:
```markdown
<span class="headword">baklava</span> <span class="cyrillic">[БАКЛАВА]</span> <span class="pronunciation">[bǎklaʋa]</span>, *ž.* *(tur.)* **1.** *kulin.* Definition... **2.** *vulg.* Definition... <span class="separator">♦</span> **primjer:** Beispieltext... <span class="xref">→ *vidi još:* **link1**, **link2**.</span>
```

**Zukunft**: Weitere Content-Types möglich via `cssclasses: recipe`, `cssclasses: letter`, etc.

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

**Fragen?** Siehe [CLAUDE.md](./CLAUDE.md) für detaillierte Entwicklungshistorie
