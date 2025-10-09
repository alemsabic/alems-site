---
title: "Zettelkasten Workflow"
tags:
  - meta
  - zettelkasten
  - workflow
  - praxis
---

# Zettelkasten Workflow

Praktische Anleitung für die tägliche Arbeit mit diesem Zettelkasten.

## Der tägliche Zyklus

### 1. Sammeln
**Input aufnehmen**

- Lesen (Bücher, Papers, Artikel)
- Videos, Kurse, Vorträge
- Gespräche, Ideen, Beobachtungen

**Tool:** Schnelle Notizen in Obsidian oder Notiz-App

### 2. Verarbeiten
**Aus Input werden Zettel**

- Hauptgedanken identifizieren
- In eigenen Worten formulieren
- Atomare Zettel erstellen
- Titel überlegen (beschreibend, nicht kategorisierend)

**Frage:** "Was ist die eine Idee, die ich festhalten will?"

### 3. Verknüpfen
**Zettel ins Netzwerk integrieren**

- Verwandte Zettel suchen
- `[[Wikilinks]]` setzen
- Tags sparsam verwenden
- Kontext durch Verknüpfung schaffen

**Tipp:** Suche in Quartz nach verwandten Themen

### 4. Entwickeln
**Aus Zetteln werden Texte**

- Verbundene Zettel als Rohstoff
- Strukturen entdecken (nicht erzwingen)
- Essays, Artikel aus Zettel-Sequenzen
- Der Zettelkasten schreibt mit

## Mit KI arbeiten

### Claude als Denkpartner

**Beim Verarbeiten:**
- "Erkläre dieses Konzept in einfachen Worten"
- "Was sind verwandte Ideen?"
- "Kritisiere diesen Gedanken"

**Beim Verknüpfen:**
- "Welche Zettel könnten zu [Thema] passen?"
- "Finde Verbindungen zwischen [Zettel A] und [Zettel B]"

**Beim Entwickeln:**
- "Strukturiere diese Zettel zu einem Outline"
- "Welche Lücken siehst du in dieser Argumentation?"

→ Details in [[mit-ki-arbeiten]]

## Best Practices

### DOs
✅ Kleine, regelmäßige Sessions (15-30 Min täglich)
✅ Sofort verarbeiten, nicht horten
✅ Eigene Gedanken festhalten, nicht nur Quellen
✅ Verknüpfungen aktiv suchen
✅ Titel beschreibend formulieren

### DON'Ts
❌ Perfektionismus (Zettel dürfen unfertig sein)
❌ Starre Kategorien erzwingen
❌ Copy-Paste ohne Verständnis
❌ Zettel isoliert lassen
❌ Auf "den richtigen Zeitpunkt" warten

## Technischer Workflow (Obsidian → Quartz)

1. **Lokal bearbeiten** in Obsidian (`content-repo/`)
2. **Git commit** mit aussagekräftiger Message
3. **Push zu GitHub** (`alems-zk`)
4. **Auto-Sync** zu `alems-site` (GitHub Action)
5. **Cloudflare deploy** → Live auf ale.ms (1-2 Min)

---

## Weiterführend

- [[prinzipien|Zettelkasten-Prinzipien]]
- [[mit-ki-arbeiten|KI-Integration]]
- [[pioniere/luhmann|Luhmanns Arbeitsweise]]
