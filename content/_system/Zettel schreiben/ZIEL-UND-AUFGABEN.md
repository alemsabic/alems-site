# Ziel und Aufgaben

---

## Das Ziel

**Ein System, das perfekte Zettel produziert.**

Nicht: ein perfektes Dokument über Zettel.
Nicht: eine Sammlung von Regeln.
Sondern: eine funktionierende Pipeline, die aus einem Thema einen fertigen Zettel macht.

Der Maßstab: Du gibst ein Thema ein, folgst der Pipeline, und am Ende steht ein Zettel, der alle sieben Attribute erfüllt (atomar, vernetzt, zitierfähig, erweiterbar, selbsterklärend, lesbar, kurz).

---

## Die Pipeline

```
STUFE_0 → STUFE_1 → STUFE_2 → STUFE_3 → STUFE_4 → STUFE_5
Cluster   Recherche  Schreiben  Korrektur  Talmud     Anreicherung
                                           Recherche
```

**PHASE 1 (MISHNA):** STUFE_0 bis STUFE_3 → Kern steht
**PHASE 2 (GEMARA):** STUFE_4 bis STUFE_5 → Stimmen kommen dazu

---

## Aktueller Stand

| Komponente | Status | Notiz |
|------------|--------|-------|
| PERFEKTER-ZETTEL.md | v3.0 | Talmud-Prinzip, Pipeline, Fußnotentypen |
| Talmud-Recherche-Prompt (8.8) | **Überarbeitung nötig** | Fehlende CONSTRAINTS |
| Fußnoten-Migration | ✅ Erledigt | 8 Zettel migriert |
| Schreibregeln im Prompt | ✅ Erledigt | Struktur, Attribute, Stil |
| Pipeline-Test | In Arbeit | "Kognition Externalisierung" als Testfall |

---

## Offene Aufgaben

### 1. Talmud-Recherche-Prompt verbessern (PRIORITÄT)

**Problem:** Gemini liefert inhaltlich gute, aber strukturell fehlerhafte Zettel.

**Fehler im letzten Test:**
- Verwaiste Fußnote `[^4]` (kein Marker im Text)
- Phantom-Link `[[ZK Epistemische Handlung]]` (existiert nicht)
- Atomizität gebrochen (zwei Konzepte im Haupttext)
- Merksatz zu lang (13 Wörter statt max 8)
- Palimpsest-Änderungen nicht dokumentiert

**Ursache:** Der Prompt erklärt WAS zu tun ist, aber nicht die CONSTRAINTS.

**Lösung:** Explizite Constraints hinzufügen:
1. Keine verwaisten Fußnoten
2. Keine Phantom-Links
3. Atomizität bewahren
4. Merksatz-Limit (8 Wörter)
5. Palimpsest-Transparenz (Alt/Neu/Begründung)
6. Fußnotentyp markieren

### 2. Pipeline komplett testen

Nach Prompt-Verbesserung: "Kognition Externalisierung" erneut durch STUFE_4 → STUFE_5 schicken.

### 3. /talmud-Skill erstellen (NACH Pipeline-Validierung)

**Nicht jetzt.** Erst wenn der manuelle Workflow funktioniert.

Der Skill soll:
- Argument: Zettel-Name
- Zwei Modi: a) Recherche selbst durchführen, b) Prompt für externe KI exportieren
- CONSTRAINTS automatisch einhalten
- Qualitätsprüfung vor Abgabe

**Voraussetzung:** Mindestens 3 Zettel erfolgreich manuell durch STUFE_4 → STUFE_5 geschickt.

### 4. Styleguide erstellen (ZUKUNFT)

**Problem:** Gemini kann recherchieren, aber nicht schreiben. Der aktuelle writing-style Skill reicht nicht.

**Ziel:** Ein Styleguide, der so präzise ist, dass auch externe KIs gutes Deutsch produzieren:
- Gut/Schlecht-Paare für jeden Stilfehler
- Konkrete Beispiele statt abstrakte Regeln
- Grammatik-Checks (z.B. "um X zu erinnern" → falsch)

**Voraussetzung:** Mehr Praxis, mehr Fehlermuster sammeln.

### 5. Quellen in Zotero importieren

Aus der Talmud-Recherche:
- @clark_chalmers_1998 (The Extended Mind)
- @gleick_1992 (Feynman-Biografie)
- @kirsh_maglio_1994 (Epistemic Actions)
- @donald_1991 (Origins of the Modern Mind)
- @hutchins_1995 (Cognition in the Wild)

---

## Changelog

| Datum | Was |
|-------|-----|
| 01.01.2026 | STATUS.md → ZIEL-UND-AUFGABEN.md umbenannt |
| 01.01.2026 | Prompt-Schwächen identifiziert (fehlende CONSTRAINTS) |
| 01.01.2026 | Zweiter Pipeline-Test mit verbessertem Prompt (Schreibregeln) |
| 01.01.2026 | Erster Pipeline-Test: Gemini liefert gute Recherche, schlechten Zettel |
| 01.01.2026 | Fußnoten-Migration abgeschlossen |
| 01.01.2026 | PERFEKTER-ZETTEL.md auf v3.0 (Talmud-Prinzip, Pipeline) |

---

*"Make it work, make it right, make it fast."* – Kent Beck

*"Als wir das Ziel aus den Augen verloren, verdoppelten wir unsere Anstrengungen."* – Mark Twain
