# Quartz Digital Garden - Operator Manual

> **Für alle, die dieses Projekt bearbeiten möchten**

## 🎯 Übersicht

Dieses Projekt besteht aus **zwei separaten Repositories**:

1. **Quartz Repository** (hier): Design, Layout, Konfiguration
   - https://github.com/alemsabic/notizen
2. **Content Repository**: Markdown-Inhalte, Wissensnotizen
   - https://github.com/alemsabic/Dein-Kopf.-Dein-Projekt.-Deine-KI.

## 📁 Projekt-Struktur

```
quartz/
├── content/              # ⚠️ AUTO-SYNCED - NICHT BEARBEITEN!
├── quartz/
│   ├── components/       # UI-Komponenten
│   ├── styles/          # CSS/SCSS Styling
│   └── ...
├── quartz.config.ts     # Hauptkonfiguration
├── quartz.layout.ts     # Layout-Definition
└── CLAUDE.md            # KI-Kontext für Quartz-Arbeit
```

## 🚀 Lokalen Server starten

```bash
cd /Users/alemsabic/Desktop/ale.ms/quartz
npx quartz build --serve
```

→ Site läuft auf: **http://localhost:8080**

Der Server rebuildet automatisch bei Dateiänderungen.

## 📝 Content bearbeiten

⚠️ **WICHTIG**: Content wird NICHT in diesem Repository bearbeitet!

### Content-Änderungen durchführen:

```bash
# 1. Wechsle ins Content-Repository
cd /Users/alemsabic/Desktop/ale.ms/content-repo

# 2. Bearbeite Markdown-Dateien
# (mit Obsidian, VS Code, oder beliebigem Editor)

# 3. Commit & Push
git add .
git commit -m "content: deine Beschreibung"
git push

# 4. Warte 1-2 Minuten
# → GitHub Action synced automatisch zu Quartz
# → Cloudflare Pages deployt automatisch
# → Änderungen live auf https://ale.ms
```

## 🎨 Design/Layout bearbeiten

**Im Quartz-Repository** (hier):

### Styling ändern

```bash
# Custom CSS bearbeiten
nano quartz/styles/custom.scss

# Quartz-Konfiguration anpassen
nano quartz.config.ts

# Layout-Komponenten ändern
nano quartz.layout.ts
```

### Änderungen deployen

```bash
git add .
git commit -m "style: deine Beschreibung"
git push

# Warte 1-2 Minuten → Live auf https://ale.ms
```

## 🔧 Nützliche Befehle

### Build ohne Server
```bash
npx quartz build
```

### Type Checking
```bash
npm run check
```

### Code Formatting
```bash
npm run format
```

### Dependencies aktualisieren
```bash
npm install
```

## 🌐 Deployment

**Automatisches Deployment via Cloudflare Pages**:

- **Branch**: `v4`
- **Build Command**: `npx quartz build`
- **Output Directory**: `public`
- **Live URL**: https://ale.ms

### Deployment-Flow:

1. **Content-Änderungen**:
   - Push zu Content-Repo → GitHub Action → Sync zu Quartz → Cloudflare Deploy

2. **Design-Änderungen**:
   - Push zu Quartz-Repo → Cloudflare Deploy

## 🐛 Troubleshooting

### Server startet nicht
```bash
# Dependencies neu installieren
rm -rf node_modules
npm install
npx quartz build --serve
```

### Content wird nicht synchronisiert
1. Prüfe GitHub Actions: https://github.com/alemsabic/Dein-Kopf.-Dein-Projekt.-Deine-KI./actions
2. Prüfe ob Token noch gültig ist (Settings → Secrets)
3. Manuell triggern: Actions → "Sync Content to Quartz" → Run workflow

### Build schlägt fehl
```bash
# TypeScript Fehler prüfen
npm run check

# Cache leeren
rm -rf .quartz-cache
npx quartz build
```

### Änderungen erscheinen nicht live
1. Warte 2-3 Minuten (Build + Deploy dauert)
2. Prüfe Cloudflare Pages: https://dash.cloudflare.com/
3. Hard-Refresh im Browser: `Cmd + Shift + R`

## 📚 Wichtige Dateien

| Datei | Zweck |
|-------|-------|
| `quartz.config.ts` | Site-Titel, Fonts, Farben, SEO |
| `quartz.layout.ts` | Komponenten-Layout (Sidebars, etc.) |
| `quartz/styles/custom.scss` | Custom CSS Overrides |
| `quartz/components/Tagline.tsx` | Custom Tagline-Komponente |
| `CLAUDE.md` | KI-Kontext für Quartz-Entwicklung |
| `content/README.md` | Info über Auto-Sync |

## 🤖 Mit KI (Claude Code) arbeiten

Lies zuerst `CLAUDE.md` für vollständigen Kontext:
```bash
cat CLAUDE.md
```

Wichtige Hinweise für Claude:
- Fokus auf Quartz/Design, nicht Content
- Alle Änderungen in Session-Logs dokumentieren
- Custom Components getrennt halten für einfachere Upstream-Merges

## 📖 Weitere Ressourcen

- **Quartz Dokumentation**: https://quartz.jzhao.xyz/
- **GitHub Quartz Repo**: https://github.com/alemsabic/notizen
- **Content Repo**: https://github.com/alemsabic/Dein-Kopf.-Dein-Projekt.-Deine-KI.
- **Live Site**: https://ale.ms

---

**Fragen?** Siehe `CLAUDE.md` für detaillierte Projekt-Historie und Entscheidungen.
