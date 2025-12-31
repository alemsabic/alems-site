# Template: Wörterbuch-Einträge (Bosnisch & Deutsch)

Dieses Template dient der Erstellung von Wörterbucheinträgen. Es gibt zwei Varianten: **Bosnisch** und **Deutsch**.
Fokussiere dich strikt auf diese beiden Sprachen.

**Prinzip:** Bibliophile Präzision (Form) + Lebendige, authentische Sprache (Inhalt).
**Stil:** Understatement, Coolness, keine Superlative, keine Aufregung.

---

## WICHTIGE KONVENTIONEN

### Language-Feld
- **Bosnisch:** `language: bs` (ISO-Code) – **Pflicht!**
- **Deutsch:** `language: de` (ISO-Code) – **Optional** (de = Default, wenn nicht angegeben)
- **Englisch:** `language: en` (ISO-Code) – falls nötig

### Tags-Konvention
- **Bosnisch:** Kleingeschrieben (`sarajevski-zargon`, `kulinarstvo`, `vulgarno`)
- **Deutsch:** Großgeschrieben (`Umgangssprache`, `Fachsprache`, `Vulgärsprache`) – weil deutsche Nomen großgeschrieben werden

### CSS-Classes: Zwei Layouts
- **`dictionary-entry`** – Ein Block (für kürzere/einfachere Einträge)
- **`dictionary-entry-columns`** – Zwei Kolumnen (für längere, komplexere Einträge)

---

## TONFALL & LITERARISCHE STANDARDS

### Für wen schreiben wir?

Den **literarisch gebildeten Leser**, der:
- Präzision UND Humor schätzt
- Mehrsprachig interessiert ist (Bosnisch/Deutsch/Türkisch/Englisch als Reichtum, nicht Barriere)
- Echte Sprache (inkl. Slang/Vulgaritäten) als Teil der Kultur sieht
- Zum Vergnügen liest, nicht nur zur Information

### Literarische Vorbilder:

**Samuel Johnson** ("A Dictionary of the English Language", 1755)
- Eigenwilligkeit: Definitionen mit persönlicher Meinung
- Wit: "Oats: A grain, which in England is generally given to horses, but in Scotland supports the people."
- Gelehrsamkeit mit Leichtigkeit

**Vladimir Nabokov**
- Obsessive Präzision: Jedes Wort zählt
- Mehrsprachigkeit als Asset (Russisch/Englisch/Französisch)
- Humor durch Intellekt, keine Plattitüden

**Ambrose Bierce** ("The Devil's Dictionary", 1906)
- Kurz & tödlich: Maximum Wit pro Wort
- Zynismus & Satire ohne Entschuldigung

**Karl Kraus** (Sprachkritik)
- Präzision als Waffe
- Vorbild für deutsche Einträge

**Die Straße (Baščaršija, Sarajevo)**
- Authentizität ohne Entschuldigung
- Wie Leute *tatsächlich* reden, nicht wie sie *sollten*
- Vulgarität ist Teil der Sprache, nicht peinlich

### NICHT wie:
- ❌ Duden (zu steril)
- ❌ Wikipedia (zu neutral)
- ❌ Grimm (zu akademisch)

### SONDERN:
✅ Ein Wörterbuch, das du **zum Vergnügen liest**.

---

## VARIANTE 1: BOSNISCHER EINTRAG

Nutze dies für Begriffe aus dem Bosnischen (inkl. Sarajevo-Slang).

```markdown
---
title: STICHWORT
language: bs
cssclasses: dictionary-entry-columns
tags:
  -
---

<span class="headword">STICHWORT</span> <span class="cyrillic">[КИРИЛЛИЦА]</span> [fonetika], *GENUS* *(ETYMOLOGIE)* **1.** *SACHBEREICH* Erste Definition – präzise, detailliert. Hauptsätze. Kurz und klar. **2.** *SACHBEREICH* Zweite Bedeutung (z.B. vulgär/metaphorisch); ausführliche Erklärung (*njem.* **Wörtliche Übersetzung**, **Idiomatisches Äquivalent**; *fig.* »idiomatische Wendung« [Erklärung auf Bosnisch]). ♦ **primjer:** »Vollständiger, authentischer Dialog aus Sarajevo – witzig, prägnant, lebendig.« — »Antwort des zweiten Sprechers.« — »Das **STICHWORT** organisch eingebaut.«
```

### Platzhalter (Bosnisch)
*   **STICHWORT**: Das Wort (kleingeschrieben, außer Eigennamen).
*   **language**: `bs` (ISO-Code für Bosnisch). **Pflicht!**
*   **КИРИЛЛИЦА**: Die kyrillische Schreibweise (UPPERCASE). **Pflicht!**
*   **fonetika**: Vereinfachte Phonetik ohne Akzentzeichen (z.B. `[baklava]`).
*   **GENUS**: `*ž.*`, `*m.*`, `*sr.*` (kursiv).
*   **ETYMOLOGIE**: `*(tur.)*`, `*(njem.)*`, `*(žarg.)*` (kursiv, in Klammern).
*   **SACHBEREICH**: `*kulin.*`, `*anat.*`, `*vulg.*` (kursiv).
*   **tags**: Ausgeschrieben, kleingeschrieben (z.B. `sarajevski-zargon`, `vulgarno`, `kulinarstvo`) – bosnische Konvention.
*   **Übersetzung**: Nur **Deutsch** (*njem.*). Bei unübersetzbaren Begriffen:
    1.  **Wörtliche Übersetzung** (z.B. **svjetska bol** [Weltschmerz]).
    2.  **Idiomatisches Äquivalent** (z.B. **težak vakat**).
*   **Dialog**: Authentischer Slang, `»Guillemets«`, `—` (Em-Dash) für Sprecherwechsel.

---

## VARIANTE 2: DEUTSCHER EINTRAG

Nutze dies für Begriffe aus dem Deutschen.

```markdown
---
title: STICHWORT
language: de
cssclasses: dictionary-entry-columns
tags:
  -
---

<span class="headword">STICHWORT</span> [ˈfonetik], *GENUS* *(ETYMOLOGIE)* **1.** *SACHBEREICH* Erste Definition – präzise, detailliert. Hauptsätze. Kurz und klar. **2.** *SACHBEREICH* Zweite Bedeutung (*bosn.* **Wörtliche Übersetzung**, **Idiomatisches Äquivalent**; *fig.* »idiomatische Wendung« [Erklärung auf Deutsch]). ♦ **Beispiel:** »Vollständiger, authentischer Dialog auf Deutsch.« — »Antwort des zweiten Sprechers.« — »Das **STICHWORT** organisch eingebaut.«
```

### Platzhalter (Deutsch)
*   **STICHWORT**: Das Wort (wie geschrieben).
*   **language**: `de` (ISO-Code für Deutsch). **Optional** (de = Default).
*   **fonetika**: IPA-Standard mit Betonung `ˈ` (z.B. `[ˈbʁøːtçən]`).
*   **GENUS**: `*f.*`, `*m.*`, `*n.*` (kursiv).
*   **ETYMOLOGIE**: `*(mhd.)*`, `*(lat.)*` (kursiv, in Klammern).
*   **tags**: Ausgeschrieben, großgeschrieben (z.B. `Umgangssprache`, `Vulgärsprache`, `Fachsprache`) – deutsche Nomen-Konvention.
*   **Übersetzung**: Nur **Bosnisch** (*bosn.*). Bei unübersetzbaren Begriffen:
    1.  **Wörtliche Übersetzung** (z.B. **Weltraumtasten** [space keys]).
    2.  **Idiomatisches Äquivalent**.
*   **Dialog**: Authentisch, `»Guillemets«`, `—` (Em-Dash) für Sprecherwechsel.

---

## QUALITÄTS-CHECKLISTE (Pflicht!)

### 1. Stil & Haltung
*   [ ] **Understatement:** Keine Superlative ("fantastisch", "unglaublich"). Sachlich bleiben.
*   [ ] **Lesefluss über Dogma:** Fluss ist wichtiger als starre Regeln. Hauptsätze sind gut, aber wenn ein Satz holprig klingt → umbauen. Einfache, kurze Wörter (außer bewusst für Humor). Lies es laut vor: Klingt es natürlich?
*   [ ] **Aktiv & Verbal:** "Menschen nutzen" statt "Verwendung erfolgt".

### 2. Typographie
*   [ ] **Dialog:** `»...«` (Guillemets) und `—` (Em-Dash/Geviertstrich) nutzen.
*   [ ] **Marker:** `♦` (Lozenge) vor dem Beispiel.
*   [ ] **Formatierung:** Labels *kursiv*, Übersetzungen **fett**.

### 3. Inhalt
*   [ ] **Sprachkonsistenz:** Erklärungen in eckigen Klammern `[...]` immer in der **Sprache der Übersetzung**. (z.B. bei *njem.* Erklärung auf Deutsch, bei *engl.* auf Englisch).
*   [ ] **Übersetzung:** Immer mindestens 2 Begriffe (Wörtlich + Idiomatisch bei unübersetzbaren Begriffen). Englisch optional ergänzen.
*   [ ] **Dialog:** Muss authentisch klingen, witzig sein und das Stichwort **fett** enthalten.

---

## STIL-PRINZIPIEN (aus writing-style Skill)

**Wichtig:** Diese Prinzipien gelten für ALLE Texte in diesem Projekt!

### 1. Coolness + Understatement
- **Keine Superlative:** "fantastisch", "unglaublich", "großartig" vermeiden
- **Keine emotionalen Marker:** "!!!", "wow", "amazing"
- **Sachlich bleiben:** Fakten sprechen lassen, nicht aufbauschen

**Schlecht:** »Das ist die *unglaublichste* baklava in ganz Sarajevo!«
**Gut:** »Die baklava schmeckt. Besser als die von gestern.«

### 2. Lesefluss über Dogma
- **Fluss ist wichtiger als Regeln:** Hauptsätze sind gut, aber wenn's holprig klingt → umbauen
- **Einfache, kurze Wörter:** Außer wenn bewusst kompliziert für Humor
- **Laut vorlesen:** Klingt es natürlich? Dann ist es gut.
- **Ein Gedanke = ein Satz:** Meistens. Aber nicht, wenn es den Fluss zerstört.

**Schlecht (zu abgehackt):** »Tanke kore. Punjena orasima. Zalivena sirupom. Servirana kao romb.«
**Gut (fließend):** »Orijentalna slastica od tankih kora punjenih orasima, zalivena šećernim sirupom, servirana kao romb.«

### 3. Aktiv & Verbal (Verben über Nomen)
- **Aktiv statt Passiv:** "Menschen nutzen" statt "wird genutzt"
- **Verben statt Nominalisierungen:** "sprechen" statt "Kommunikation"
- **Handlung zeigen:** Wer tut was?

**Schlecht:** »Die Verwendung des Wortes erfolgt hauptsächlich im informellen Kontext.«
**Gut:** »Menschen nutzen das Wort vor allem, wenn sie locker reden.«

### 4. Spezifisch statt generisch
- **Namen:** Konkrete Orte, Personen
- **Zahlen:** "drei Tage" statt "mehrere Tage"
- **Details:** Zeige, nicht erzähle

**Schlecht:** »Das Wort wird oft in der Stadt verwendet.«
**Gut:** »Auf dem Baščaršija-Markt sagen es drei von vier Verkäufern.«

### 5. Authentische Dialoge
- **Mehrere Sprecher:** Mindestens 2
- **Witzig, nicht gekünstelt:** Echte Situationen, echte Sprache
- **Ungeschliffen:** Slang, Vulgaritäten erlaubt (wenn authentisch)
- **Lebendig:** Kurze Sätze, schneller Wechsel

### 6. Was zu vermeiden ist
- ❌ Füllwörter: "eigentlich", "sozusagen", "gewissermaßen"
- ❌ Weichspüler: "vielleicht", "möglicherweise", "könnte sein"
- ❌ Floskeln: "Es ist wichtig zu erwähnen", "Man sollte beachten"
- ❌ Passiv-Konstruktionen: "Es wird gesagt" → "Menschen sagen"
- ❌ Abstrakte Nomen: "Implementierung", "Realisierung" → Verben nutzen
- ❌ "Man" statt "du": "Man nimmt" → "Du nimmst" (direkte Ansprache ist persönlicher)

### 7. Der Tonfall
**Ziel:** Bibliophil + lebendig = Museum trifft Straße

Die Form ist präzise (IPA, Etymologie, Struktur).
Der Inhalt ist roh (Dialoge, Slang, authentisch).

**Metapher:**
Ein perfekt gedrucktes Buch, in dem echte Menschen sprechen.
