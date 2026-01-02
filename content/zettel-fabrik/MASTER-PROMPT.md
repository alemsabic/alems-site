# Zettel-Pipeline: Vollständiger Prompt

## INHALTSVERZEICHNIS

- [PRINZIPIEN](#prinzipien)
  - [Das Talmud-Prinzip](#das-talmud-prinzip)
  - [Die 7 Attribute](#die-7-attribute)
  - [Die 9 Stilregeln](#die-9-stilregeln)
- [STUFE_0: Cluster-Exploration](#stufe_0-cluster-exploration)
- [STUFE_1: Recherche](#stufe_1-recherche)
- [STUFE_2: Schreiben](#stufe_2-schreiben)
- [STUFE_3: Korrektur](#stufe_3-korrektur)
- [STUFE_4: Talmud-Recherche](#stufe_4-talmud-recherche)
- [STUFE_5: Anreicherung](#stufe_5-anreicherung)

---

## PRINZIPIEN

### Das Talmud-Prinzip

Eine Seite des Talmud: In der Mitte steht die Mishna – der Ursprungstext, wenige Zeilen. Drumherum die Gemara – die Diskussion der Rabbiner, Fragen, Einwände, Gegenargumente.

**Ein Zettel ist eine Seite aus dem Talmud.**

- **In der Mitte:** Der Haupttext. Ein Gedanke, kristallisiert. Das ist die Mishna.
- **Drumherum:** Die Fußnoten. Wer bestätigt? Wer widerspricht? Welche Beispiele? Das ist die Gemara.

**Die Praxis:**

1. Schreibe den Kern zuerst (PHASE 1: MISHNA, STUFE_0-3)
2. Dann lass die Stimmen sprechen (PHASE 2: GEMARA, STUFE_4-5)
3. Der Haupttext bleibt. Der Diskurs wächst.

**Fünf Fußnoten-Typen:**

| Typ | Frage | Beispiel |
|-----|-------|----------|
| Bestätigung | Wer sagt dasselbe? | "Hutchins kommt zum selben Schluss..." |
| Widerspruch | Wer widerspricht? | "Schmidt wendet ein, dass..." |
| Beispiel | Welche Fälle illustrieren? | "Am Beispiel der Navigation..." |
| Genealogie | Woher kommt die Idee? | "Die Idee geht zurück auf..." |
| Vertiefung | Wer geht weiter? | "Clark zieht daraus die Konsequenz..." |

### Die 7 Attribute

Ein perfekter Zettel ist:

1. **atomar** – ein Gedanke pro Zettel, thematisch unteilbar
2. **vernetzt** – durch kontextualisierte Links verbunden
3. **zitierfähig** – Quellen sind angegeben
4. **erweiterbar** – kann wachsen (Fußnoten), ohne Atomizität zu verlieren
5. **selbsterklärend** – verständlich ohne andere Zettel lesen zu müssen
6. **lesbar** – kurze Wörter, um Schwieriges zu erklären
7. **kurz** – so wenig Wörter wie nötig

### Die 9 Stilregeln

1. **Kein "Als" am Satzanfang** – nur wenn der Zeitpunkt relevant ist
2. **Namen statt Rollen** – "Charles Weiner" statt "ein Historiker"
3. **Show, don't tell** – "Feynman sagte" statt "Feynman widersprach"
4. **Originalzitate in Fußnoten** – wenn du übersetzt, Original in Fußnote
5. **Semikolon für Kontraste** – "nicht X; Y" statt "nicht X, sondern Y"
6. **Wiederholung für Klarheit** – "kein Archiv; das Papier ist eine Werkstatt"
7. **Konkret statt abstrakt** – "Zettel verschieben" statt "externe Symbole manipulieren"
8. **Klares Subjekt** – "Du" oder konkreter Name, nicht "Man" oder "Schreiber"
9. **Ein starkes Beispiel** – besser ein gutes als zwei mittelmäßige

---

## STUFE_0: Cluster-Exploration

**Ziel:** Thema in atomare Konzepte zerlegen.

**Input:** Thema (z.B. "Prinzipien des Zettelkastens")

**Prozess:**

Bevor du Titel festlegst, verschaffe dir Überblick. Kartografie vor dem Graben.

**Prompt:**

```
Ich möchte das Thema [X] für meinen Zettelkasten erschließen.

Zerlege dieses Thema in seine kleinsten, atomaren Konzepte.

Welche 5 Hauptaspekte und welche 3 ergänzenden Randaspekte sind essenziell, um [X] ganzheitlich zu verstehen?

Liefere mir nur die Titel dieser Zettel-Cluster.
```

**Output:** CLUSTER (5 Hauptzettel, 3 Randzettel – nur Titel)

**Prüffrage:**

> Kann jeder Zettel für sich stehen, auch wenn die anderen nicht existieren würden? Wenn nein, sind die Zettel nicht atomar, sondern verklammert.

---

## STUFE_1: Recherche

**Ziel:** Für jeden Titel im Cluster recherchieren.

**Input:** CLUSTER (Titel-Liste)

**Prozess:**

Zusammen recherchieren. Eine Recherche, Material für alle Zettel.

**Prompt:**

```
Ich schreibe Zettel für meinen Zettelkasten über das Thema: "[THEMA]"

Die Haupt-Zettel sind: [ZETTEL 1], [ZETTEL 2], [ZETTEL 3]
Die Neben-Zettel sind: [ZETTEL A], [ZETTEL B]

Recherchiere für JEDEN Zettel:

## 1. Kernaussage
Ein präziser Satz, der die Idee einfängt.

## 2. Definitionen (mindestens 2)
Verschiedene Quellen (Lexika, Fachbücher, Autoren).
Format: [Quelle] [@citekey]: "Definition"
Markiere das beste mit ⭐ (Goldstück).

## 3. Zitate (die besten Fundstücke)
Was haben kluge Menschen dazu geschrieben?
Format: "Zitat" [@citekey, p. X]
Markiere Goldstücke mit ⭐.
Angeben: Verwendung → Fußnote oder Haupttext?

## 4. Modelle & Theorien
Welche Modelle/Theorien stützen oder erklären das Konzept?
Format: [Modellname] [@citekey]: Kurzbeschreibung

## 5. Gegenargument
Wer sagt was dagegen? (mit Quelle)
Wie entkräftest du das?

## 6. Analogie
Konkretes Beispiel aus anderer Domäne.

## 7. Vernetzung
Zu diesen anderen Zetteln: [LISTE DER CLUSTER-ZETTEL]
Format: [[Ziel]] - Warum relevant?

## 8. Merksatz-Kandidat
Lakonisch, wie ein Knoten im Taschentuch.

---

WICHTIG:
- Markiere alle Goldstücke (⭐) – das sind die Fundstücke, die in den Zettel MÜSSEN
- Liefere echte Citekeys im Format @autor_jahr
- Liefere die Recherche als strukturiertes Markdown
- Für jeden Zettel eine eigene Sektion
```

**Output:** BAUPLAN (mit Goldstücken ⭐ markiert)

**Goldstück-Prinzip:**

- Eine Definition, die es auf den Punkt bringt
- Ein Zitat, das du nie besser formulieren könntest
- Eine Analogie, die sofort einleuchtet

**Goldstücke gehören IN den Zettel** – in Fußnoten oder Haupttext. Was nicht im Zettel landet, geht verloren.

---

## STUFE_2: Schreiben

**Ziel:** Aus BAUPLAN einen fertigen Zettel machen.

**Input:** BAUPLAN (für einen spezifischen Zettel)

**Prozess:**

1. Template kopieren
2. Frontmatter ausfüllen
3. Titel schreiben (grob): Auskunft, nicht Satz
4. Ausführung schreiben: Atomar, eigene Worte
5. Zitieren: [@key] für Inline, [^n] für Fußnoten
6. Anknüpfungspunkte: [[Link]] - Warum relevant
7. Merksatz schreiben: Lakonisch, kursiv
8. Ein-Satz-Essenz (optional): Erst wenn du den Zettel verstanden hast
9. Titel präzisieren

**Template:**

```markdown
---
cssclasses: zettelkasten
tags:
  -
aliases:
  -
---

# Titel

*Merksatz.*

Ein-Satz-Essenz. (optional)

Ausführung.[^1]

### Anknüpfungspunkte

[[Link]] - Warum relevant.

[^1]: Fußnote bei Bedarf.
```

**Titel-Prinzip:**

Auf kürzestem Raum so viel über den Inhalt verraten wie möglich. Grammatik ist egal. Auskunft ist das Ziel.

- Präfix + Essenz: `ZK Atomizität`
- Telegrafisch: `Assisi Unterschied Dogmatismus Pragmatismus`
- Schlagwörter: `Luhmann Kommunikation Zettelkasten`

**Nicht:**
- Ganze Sätze
- Vage: "Gedanken zu Pragmatismus"
- Clever: "Der Mönch und die Methode"

**Merksatz:**

- Kursiv: `*Merksatz*`
- Lakonisch, wie ein Knoten im Taschentuch
- Beispiel: `*Ein Gedanke pro Zettel.*`

**Ein-Satz-Essenz (optional):**

- Kommt NACH der Ausführung, nicht davor
- Erst möglich, wenn du den Zettel wirklich verstanden hast
- Beispiel: "Wer zwei Gedanken in einen Zettel steckt, kann später nur beide oder keinen wiederfinden."

**Anknüpfungspunkte:**

- Kontextualisierte Links: `[[Link]] - Warum relevant`
- Mindestens ein Link (keine Waisen)

**Zitieren:**

- Inline: `[@autor_jahr, p. X]` oder `@autor_jahr sagt...`
- Fußnoten: `[^1]: Inhalt mit [@citekey]`

**Output:** ENTWURF

---

## STUFE_3: Korrektur

**Ziel:** Entwurf gegen Checkliste prüfen.

**Input:** ENTWURF

**Prozess:**

1. Vorlese-Test (wenn du stolperst, stimmt etwas nicht)
2. Checkliste durchgehen
3. 7 Attribute prüfen
4. 9 Stilregeln prüfen

**Checkliste:**

```
[ ] Du statt man
[ ] Hauptsätze statt Schachtelsätze
[ ] Keine Superlative ("fantastisch", "unglaublich")
[ ] Spezifisch statt generisch
[ ] Klammern aufgelöst (in separate Sätze)
[ ] Ein Gedanke = ein Satz (meistens)
[ ] Aktiv statt Passiv
[ ] Verben statt Nomen
[ ] Merksatz ist lakonisch (nicht zwei Sätze)
[ ] Ein-Satz-Essenz zieht rein
[ ] Jeder Link ist kontextualisiert
```

**Die 7 Attribute:**

```
[ ] atomar – ein Gedanke
[ ] vernetzt – Links vorhanden
[ ] zitierfähig – Quellen angegeben
[ ] erweiterbar – Fußnoten für Wildnis
[ ] selbsterklärend – ohne andere Zettel verständlich
[ ] lesbar – vorlesbar ohne Stolpern
[ ] kurz – so wenig Wörter wie nötig
```

**Die 9 Stilregeln:**

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

**Output:** ZETTEL_KERN (Status: kern_fertig)

---

## STUFE_4: Talmud-Recherche

**Ziel:** Stimmen zum fertigen Zettel finden.

**Input:** ZETTEL_KERN

**Prozess:**

Recherche auf Basis des fertigen Zettels. Suche nach: Bestätigungen, Widersprüche, Beispiele, Genealogie, Vertiefungen.

**Wichtig:** Dieser Schritt liefert ROHMATERIAL, keinen fertigen Text. Das Schreiben kommt in STUFE_5.

**Prompt:**

```
# Talmud-Recherche: Rohmaterial sammeln

Du recherchierst für einen Zettelkasten-Eintrag.
Deine Aufgabe: Quellen finden und strukturiert liefern.
NICHT deine Aufgabe: Den fertigen Text schreiben.

---

## ZETTEL-KERN

[ZETTEL_KERN HIER EINFÜGEN]

---

## DEIN AUFTRAG

Finde Stimmen zu diesem Zettel in 5 Kategorien:

### 1. BESTÄTIGUNG
Wer sagt dasselbe? Welche Autorität stützt die These?

### 2. WIDERSPRUCH
Wer widerspricht? Was ist das stärkste Gegenargument?

### 3. BEISPIEL
Welcher konkrete Fall illustriert den Gedanken?
(Historisch, empirisch, Alltagsbeobachtung)

### 4. GENEALOGIE
Woher kommt die Idee? Wer hat sie zuerst formuliert?

### 5. VERTIEFUNG
Wer geht weiter? Welche radikalen Konsequenzen zieht jemand?

---

## OUTPUT-FORMAT

Für JEDE Quelle liefere:

```yaml
QUELLE:
  kategorie: [Bestätigung/Widerspruch/Beispiel/Genealogie/Vertiefung]
  autor: [Vollständiger Name]
  titel: [Vollständiger Titel]
  jahr: [JJJJ]
  typ: [book/article/chapter/interview]
  citekey_vorschlag: @autor_jahr

  zitat: |
    [Wörtliches Zitat, wenn vorhanden. Mit Seitenangabe.]

  kernaussage: |
    [Was sagt diese Quelle in 1-2 Sätzen?]

  relevanz: |
    [Warum gehört das zu diesem Zettel?]

  einfüge_vorschlag: |
    [Wo im Zettel könnte das passen? Nach welchem Satz?]
```

---

## PALIMPSEST-HINWEISE

Falls du beim Recherchieren findest:
- Ein besseres Zitat als das im Haupttext
- Eine präzisere Formulierung der Kernthese
- Ein stärkeres Beispiel

→ Notiere es unter "PALIMPSEST-KANDIDATEN" mit Begründung.
→ Schreibe NICHT um. Nur Hinweis geben.

---

## VERWANDTE ZETTEL

Liste Konzepte, die eigene Zettel verdienen:
- [Konzeptname] - Kurzbeschreibung (1 Satz)

---

## WICHTIG

- Liefere ROHMATERIAL, keinen fertigen Text
- Zitate wörtlich, nicht paraphrasiert
- Bibliographische Daten vollständig
- Keine Stilentscheidungen treffen
- Keine Fußnoten formulieren
```

**Output:** ROHMATERIAL (YAML-Format mit Quellen, Zitaten, Kontext)

---

## STUFE_5: Anreicherung

**Ziel:** Aus ROHMATERIAL Fußnoten schreiben und in ZETTEL_KERN einfügen.

**Input:** ZETTEL_KERN + ROHMATERIAL

**Prozess:**

1. ROHMATERIAL sichten
2. Für jede Quelle entscheiden:
   - Fußnote schreiben ODER
   - Haupttext ändern (Palimpsest)
3. Fußnotentyp markieren (Bestätigung, Widerspruch, etc.)
4. Stil anwenden (9 Stilregeln)
5. Qualität prüfen (Checkliste aus STUFE_3)

**Fußnoten-Format:**

```markdown
[^n]: **[Typ].** [Inhalt mit Kontext und Quelle] [@citekey].
```

**Beispiel:**

```markdown
[^1]: **Beispiel.** Original: "I actually did the work on the paper." – "Well, the work was done in your head, but the record of it is still here." – "No, it's not a record, not really. It's working. You have to work on paper and this is the paper." Charles Weiner war Wissenschaftshistoriker am MIT [@gleick_1992].
```

**Palimpsest-Prinzip:**

Die Gemara darf den Kern verbessern.

| Situation | Aktion |
|-----------|--------|
| Goldstück gefunden, das besser formuliert als der Haupttext | Haupttext ersetzen, alten in Fußnote |
| Kernaussage kann präzisiert werden | Kernaussage schärfen |
| Besseres Beispiel gefunden | Beispiel tauschen |
| Widerspruch gefunden, der überzeugt | Position revidieren (!) |

**Wann bleibt die Mishna?**

| Situation | Aktion |
|-----------|--------|
| Goldstück ist gut, aber Haupttext ist besser | Goldstück in Fußnote |
| Neue Info ist Ergänzung, nicht Ersatz | Fußnote |
| Widerspruch ist interessant, aber nicht überzeugend | Fußnote mit Entkräftung |

**Qualitätsprüfung:**

- Checkliste aus STUFE_3 nochmal durchgehen
- 9 Stilregeln beachten
- Keine verwaisten Fußnoten
- Keine Phantom-Links

**Output:** ZETTEL_FINAL (Status: angereichert → final)

---

*"Make it work, make it right, make it fast."* – Kent Beck
