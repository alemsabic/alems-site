# Ziel und Aufgaben

---

## Das Ziel

**Perfekte Prompts → Perfekte Zettel.**

Nicht: Theorie über Zettel schreiben.
Nicht: Regeln sammeln, die niemand befolgt.
Sondern: Prompts bauen, die reproduzierbar perfekte Zettel produzieren.

**Der Maßstab:**
Du gibst MASTER-PROMPT.md + Thema an eine KI → Die KI liefert einen Zettel, der alle 7 Attribute und 9 Stilregeln erfüllt.

**Der Test:**
Wenn drei verschiedene KIs (Claude, Gemini, GPT-4) mit demselben Prompt drei gleich gute Zettel produzieren, funktioniert der Prompt.

---

## Die Methode

### 1. Testen

Jeder Prompt wird gegen echte Themen getestet:

```
1. Thema wählen (z.B. "ZK Emergenz")
2. KI A (Claude) → STUFE_0-5 durchlaufen → Zettel A
3. KI B (Gemini) → STUFE_0-5 durchlaufen → Zettel B
4. KI C (GPT-4) → STUFE_0-5 durchlaufen → Zettel C
5. Alle drei Zettel bewerten (siehe Bewertungssystem)
6. Schwachstellen dokumentieren
```

### 2. Iterieren

Wenn ein Zettel schwach ist:

```
1. Fehler identifizieren (welches Attribut? welche Stilregel?)
2. Prompt anpassen (MASTER-PROMPT.md)
3. Erneut testen
4. Changelog aktualisieren
```

### 3. Validieren

Ein Prompt gilt als "validiert", wenn:

- 3 verschiedene KIs damit 3 gleich gute Zettel produzieren
- Alle 7 Attribute erfüllt
- Alle 9 Stilregeln erfüllt
- Score: mindestens 28/30 Punkte (siehe Bewertung)

---

## Bewertungssystem

### Die 7 Attribute (je 0-2 Punkte)

| Attribut | 0 Punkte | 1 Punkt | 2 Punkte |
|----------|----------|---------|----------|
| atomar | Mehrere Gedanken | Fast atomar | Ein Gedanke |
| vernetzt | Keine Links | Links ohne Kontext | Kontextualisierte Links |
| zitierfähig | Keine Quellen | Quellen vorhanden | Quellen vollständig |
| erweiterbar | Keine Fußnoten | Fußnoten vorhanden | Fußnoten mit Typen |
| selbsterklärend | Braucht andere Zettel | Etwas unklar | Steht für sich |
| lesbar | Stolpern beim Vorlesen | Einzelne Stolperstellen | Fließt |
| kurz | Zu lang | Etwas langatmig | Prägnant |

**Maximale Punktzahl:** 14 Punkte

### Die 9 Stilregeln (je erfüllt = 1 Punkt)

```
[ ] Kein "Als" am Satzanfang
[ ] Namen statt Rollen
[ ] Show, don't tell
[ ] Originalzitate in Fußnoten
[ ] Semikolon für Kontraste
[ ] Wiederholung für Klarheit
[ ] Konkret statt abstrakt
[ ] Klares Subjekt
[ ] Ein starkes Beispiel
```

**Maximale Punktzahl:** 9 Punkte

### Bonuspunkte (je 1 Punkt)

```
[ ] Merksatz sitzt (< 8 Wörter, unvergesslich)
[ ] Ein-Satz-Essenz vorhanden und stark
[ ] Keine verwaisten Fußnoten
[ ] Keine Phantom-Links
[ ] Vorlese-Test bestanden
[ ] Palimpsest-Kandidaten dokumentiert (falls vorhanden)
[ ] Neue Zettel vorgeschlagen
```

**Maximale Punktzahl:** 7 Punkte

### Gesamt

**Maximum:** 30 Punkte
**Validierung:** ≥ 28 Punkte
**Akzeptabel:** ≥ 24 Punkte
**Überarbeitung nötig:** < 24 Punkte

---

## Aktueller Stand

| Komponente | Status | Score | Notiz |
|------------|--------|-------|-------|
| MASTER-PROMPT.md | ✅ v1.0 | - | STUFE_0-5 komplett |
| Test 1: "Kognition Externalisierung" | ✅ Fertig | 28/30 | Claude, manuell iteriert |
| Test 2: "ZK Emergenz" | 🔄 Läuft | - | Nächster Test |
| Validierung (3 KIs) | ⏳ Ausstehend | - | Nach Test 2-3 |

---

## Nächste Sessions

### Session 1: Test 2 durchführen

1. "Kognition Externalisierung" online stellen
2. "ZK Emergenz" durch MASTER-PROMPT.md schicken (Claude)
3. Bewerten (7+9+7 Checkliste)
4. Schwachstellen dokumentieren
5. MASTER-PROMPT.md anpassen

### Session 2: Vergleichstest

1. Gleiches Thema mit Gemini testen
2. Ergebnisse vergleichen
3. KI-spezifische Schwächen identifizieren
4. Prompt robuster machen

### Session 3: Vollständiger Benchmark

1. Neues Thema wählen (nicht "Kognition" oder "ZK Emergenz")
2. Alle 3 KIs parallel testen
3. Scores vergleichen
4. Bei Score ≥ 28/30 für alle drei → Prompt validiert

---

## Offene Fragen

### 1. Können wir STUFE_4+5 überspringen?

Wenn Claude STUFE_0-3 perfekt beherrscht, brauchen wir die Talmud-Recherche (extern) noch?

**Test:** Einen Zettel ohne STUFE_4+5 produzieren. Wie gut ist er?

### 2. Ist STUFE_1 (Recherche) KI-spezifisch?

Gemini hat Web-Zugriff, Claude nicht. Brauchen wir zwei Varianten von STUFE_1?

**Test:** Gemini vs. Claude bei gleichem Thema (STUFE_1 Output vergleichen).

### 3. Was ist die Mindest-Pipeline?

Können wir von STUFE_0 direkt zu STUFE_2 (Schreiben)?

**Test:** Cluster → Schreiben (ohne Recherche). Score?

---

## Changelog

| Datum | Was |
|-------|-----|
| 02.01.2026 | MASTER-PROMPT.md v1.0 erstellt (STUFE_0-5 in einer Datei) |
| 02.01.2026 | Fokus-Wechsel: Von Theorie zu reproduzierbarer Praxis |
| 02.01.2026 | Bewertungssystem definiert (7+9+7 Checkliste, 30 Punkte max) |
| 02.01.2026 | "Kognition Externalisierung" finalisiert (Score: 28/30) |
| 01.01.2026 | 9 Stilregeln aus Praxis destilliert |
| 01.01.2026 | Arbeitsteilung: Gemini recherchiert (STUFE_4), Claude schreibt (STUFE_5) |

---

*"Make it work, make it right, make it fast."* – Kent Beck

*"Die Karte ist nicht das Gebiet."* – Alfred Korzybski
