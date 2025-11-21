# NE KONTAM - Wörterbuch Templates

Diese Templates dienen als Vorlage für zweisprachige Wörterbuch-Einträge.

## Ordnerstruktur im Content-Repo

```
content/
├── bs/                    # Bosnische Begriffe → Deutsche Übersetzung
│   ├── ablendovati.md
│   ├── fora.md
│   └── ...
│
└── de/                    # Deutsche Begriffe → Bosnische Übersetzung
    ├── blenden.md
    ├── Schnauze.md
    └── ...
```

## Verwendung

### 1. Für bosnische Einträge (bs/)

Kopiere `templates/bs/_template.md` als Ausgangspunkt.

**Beispiel**: `templates/bs/ablendovati.md`

### 2. Für deutsche Einträge (de/)

Kopiere `templates/de/_template.md` als Ausgangspunkt.

**Beispiel**: `templates/de/blenden.md`

## Wichtige Frontmatter-Felder

### Bosnisch (bs/)
```yaml
---
title: [bosnisches Wort]
lang: bs
wortart: [verb/nomen/adjektiv]
tags: [sarajevo, slang]
deutsch: [deutsche Übersetzung]
---
```

### Deutsch (de/)
```yaml
---
title: [deutsches Wort]
lang: de
wortart: [verb/nomen/adjektiv]
tags: [umgangssprache, slang]
bosnisch: [bosnische Übersetzung]
---
```

## Zettelkasten-Prinzipien

### Cross-Language Links
```markdown
**Auf Deutsch**: [[blenden]] · [[täuschen]]
**Na bosanskom**: [[ablendovati]] · [[prevariti]]
```

### Semantische Netzwerke
- Verknüpfe Synonyme: `[[prevariti]]`, `[[obmanjivati]]`
- Verknüpfe verwandte Begriffe: `[[Sarajevo Slang]]`
- Nutze bidirektionale Links zwischen Sprachen

### Graph View
- **Cluster nach Sprache**: bs/ und de/ Ordner
- **Semantische Verbindungen**: Innerhalb jeder Sprache
- **Brücken-Links**: Zwischen Sprachen

## CSS-Features

Die Custom CSS in `quartz/styles/custom.scss` bietet:
- Automatische Flaggen-Icons (🇧🇦 für Bosnisch, 🇩🇪 für Deutsch)
- Hervorhebung von Metadata (Wortart, Herkunft, etc.)
- Visuelle Trennung von Sections
- Styled Beispielsätze und Übersetzungen
- Responsive Design für Mobile

## Workflow

1. **Im Content-Repo arbeiten** (`nekontam-zk`)
2. **Template kopieren** und anpassen
3. **Bidirektionale Links** setzen
4. **Commit & Push**
5. **Auto-Sync** zu Quartz → Deploy zu nekontam.com

## UI-Lokalisierung

Die Quartz-UI ist auf **Bosnisch** (bs-BA) eingestellt:
- Suche: "Pretraga"
- Backlinks: "Povratne veze"
- Graph: "Grafički prikaz"
- etc.

Siehe `quartz/i18n/locales/bs-BA.ts` für alle Übersetzungen.
