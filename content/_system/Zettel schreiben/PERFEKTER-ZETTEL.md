# Der perfekte Zettel

---

## 0. Was ist dieses Dokument?

**0.1** Dieses Dokument beschreibt, wie du einen perfekten Zettel erstellst.

**0.2** Es enthält: Struktur, Zitier-Syntax, Recherche-Workflow, Schreib-Anleitung, Korrektur-Checkliste, Erweiterungs-Prinzip, Template, Beispiel.

**0.3** Zielgruppe: Du (Mensch) und KI (als Assistent).

**0.4** Arbeitsprinzip: Dieses Dokument wächst mit der Praxis. Nichts ist endgültig.

---

## 1. Das Ziel

**1.1** Ein perfekter Zettel ist:

- **atomar** – ein Gedanke pro Zettel, thematisch unteilbar. Nicht gemeint: kurz. Ein atomarer Zettel kann 500 Wörter haben, solange er nur ein Thema behandelt.

- **vernetzt** – durch kontextualisierte Links mit anderen Zetteln verbunden. Nicht gemeint: alles mit allem verlinken. Jeder Link braucht einen Grund.

- **zitierfähig** – Quellen sind angegeben, der Zettel kann selbst als Quelle dienen. Nicht gemeint: Zitate sammeln. Der Zettel enthält deine Worte, die Quellen stützen sie.

- **erweiterbar** – der Zettel kann wachsen, ohne seine Atomizität zu verlieren. Das klingt wie ein Widerspruch. Ist es nicht. Der Haupttext bleibt atomar (der Kern). Die Erweiterung geschieht in den Fußnoten (der Rand). Wie beim Talmud: Der Ursprungstext in der Mitte, die Kommentare drumherum. (Siehe 7. Talmud-Prinzip.)

- **selbsterklärend** – du verstehst den Zettel, ohne andere Zettel lesen zu müssen. Nicht gemeint: keine Links. Die Links zeigen Verbindungen zu anderen Gedanken – sie erweitern, sie erklären nicht. Der Zettel steht für sich.

- **lesbar** – kurze Wörter, um Schwieriges zu erklären. Nicht umgekehrt. Wenn du beim Vorlesen stolperst, stimmt etwas nicht. Ein Zettel, den du nicht vorlesen kannst, ist kein perfekter Zettel – egal wie klug der Inhalt.

- **kurz** – so wenig Wörter wie nötig für diesen Gedanken. Kürze ist nicht Minimalismus, sondern Prägnanz. Wer kürzt, muss schärfer denken. Pascal: "Ich entschuldige mich, dass dieser Brief so lang geworden ist – hätte ich mehr Zeit gehabt, wäre er kürzer."

**1.2** Perfektion ist kein Endpunkt. Ein Zettel kann wachsen (Talmud-Prinzip, siehe 7.).

**1.3** Perfektion ist kein Einstiegspunkt. Ein Zettel darf als Draft beginnen. Luhmann: "Zettelkasten als Klärgrube – nicht nur abgeklärte Notizen hineintun." Die Klärgrube klärt. Der Zettel reift.

**1.4** Der perfekte Zettel entsteht nicht isoliert. Er entsteht im Cluster mit verwandten Zetteln (siehe 4.).

---

## 2. Die Anatomie

**2.1** Struktur eines Zettels:

```
┌─────────────────────────────────────┐
│ Frontmatter                         │
│ (cssclasses, tags, aliases)         │
├─────────────────────────────────────┤
│ # Titel                             │
├─────────────────────────────────────┤
│ *Merksatz*                          │
├─────────────────────────────────────┤
│ Ein-Satz-Essenz. (optional)         │
├─────────────────────────────────────┤
│ Ausführung.                         │
│ Mit Zitierungen [@key] und          │
│ Fußnoten.^[Kommentar]               │
├─────────────────────────────────────┤
│ ### Anknüpfungspunkte               │
│ [[Link]] - Warum relevant.          │
├─────────────────────────────────────┤
│ [Quellen: automatisch via Pandoc]   │
└─────────────────────────────────────┘
```

**2.2** Frontmatter:

```yaml
---
cssclasses: zettelkasten
tags:
  - ZK-Theorie
aliases:
  - Alternativname
  - Synonym
---
```

- `cssclasses: zettelkasten` → Pflicht (aktiviert Design)
- `tags:` → Optional, für thematische Gruppierung
- `aliases:` → Optional, für Auffindbarkeit (Synonyme, Übersetzungen)

**2.3** Titel (H1):

**Prinzip:** Auf kürzestem Raum so viel über den Inhalt verraten wie möglich. Grammatik ist egal. Auskunft ist das Ziel.

**Techniken:**
- Präfix + Essenz: `ZK Atomizität` (wenn Kontext nötig – hier: Atomizität im Zettelkasten, nicht in der Physik)
- Telegrafisch: `Assisi Unterschied Dogmatismus Pragmatismus`
- Schlagwörter: `Luhmann Kommunikation Zettelkasten`

**Nicht:**
- Ganze Sätze: "Franz von Assisi über den Unterschied zwischen Dogmatismus und einer pragmatischen Handlungsweise"
- Vage: "Gedanken zu Pragmatismus"
- Clever: "Der Mönch und die Methode"

**2.4** Merksatz:

- Kursiv: `*Merksatz*`
- Lakonisch, wie ein Knoten im Taschentuch
- Erinnert dich sofort, worum es geht
- Beispiel: `*Ein Gedanke pro Zettel.*`

**2.5** Ein-Satz-Essenz (optional):

- Kommt NACH der Ausführung, nicht davor
- Erst möglich, wenn du den Zettel wirklich verstanden hast
- Oft erst nach mehrfachem Umschreiben
- Kein Pflichtfeld – ein guter Zettel funktioniert auch ohne
- Beispiel: "Wer zwei Gedanken in einen Zettel steckt, kann später nur beide oder keinen wiederfinden."

**2.6** Ausführung:

- Der atomare Haupttext
- Eigene Worte, nicht nur Zitate
- Mit Pandoc-Zitierungen `[@key]` und Fußnoten `^[...]`

**2.7** Anknüpfungspunkte:

- Kontextualisierte Links
- Nicht nur `[[Link]]`, sondern `[[Link]] - Warum relevant`
- Mindestens ein Link (keine Waisen)

**2.8** Quellen:

- Werden automatisch generiert durch Pandoc
- Du brauchst keine manuelle `### Quellen`-Sektion
- Jede `[@key]`-Zitierung erscheint automatisch am Ende

---

## 3. Zitieren & Belegen

Ziel ist nicht bürokratische Korrektheit, sondern gedankliche Nachvollziehbarkeit. Wir nutzen die volle Pandoc-Syntax.

### 3.1 Inline-Zitierung

Zwei Arten:
1. **Parenthetical (Klammer):** Die Quelle steht in Klammern. Fokus auf der Aussage.
2. **Narrativ (Erzählend):** Der Autor wird Teil des Satzes. Fokus auf der Person.

**Die Syntax-Matrix:**

| Typ | Syntax | Ergebnis | Wann nutzen? |
| :--- | :--- | :--- | :--- |
| Standard | `[@ahrens_2017]` | (Ahrens, 2017) | Standardfall. |
| Mit Seite | `[@ahrens_2017, p. 45]` | (Ahrens, 2017, p. 45) | Spezifisches Argument. |
| Seitenbereich | `[@ahrens_2017, pp. 33-35]` | (Ahrens, 2017, pp. 33–35) | Gedanke über mehrere Seiten. |
| Narrativ | `@ahrens_2017 sagt...` | Ahrens (2017) sagt... | Autor aktiv einbinden. |
| Narrativ + Ort | `@ahrens_2017 [p. 12]` | Ahrens (2017, p. 12) | Narrativ mit Seitenangabe. |
| Unterdrückt | `Wie Ahrens [-@ahrens_2017] zeigt` | Wie Ahrens (2017) zeigt | Name im Text, Jahr in Klammer. |
| Mehrere | `[@ahrens_2017; @doto_2024]` | (Ahrens, 2017; Doto, 2024) | Konsens oder Debatte zeigen. |
| Präfix | `[siehe @ahrens_2017]` | (siehe Ahrens, 2017) | Weiterführende Literatur. |
| Suffix | `[@ahrens_2017, für Details]` | (Ahrens, 2017, für Details) | Verweis qualifizieren. |
| Komplex | `[siehe @ahrens_2017, p. 4; aber auch @doto_2024]` | (siehe Ahrens, 2017, p. 4; aber auch Doto, 2024) | Argumente in der Klammer verknüpfen. |

**Beispiele im Kontext:**

*Erzählender Stil (gut für Zusammenfassungen):*
> @luhmann_1981 argumentiert, dass Kommunikation unwahrscheinlich ist. Dagegen hält @baecker_2005 [p. 99], dass Computer diese Unwahrscheinlichkeit potenzieren.

*Beleg-Stil (gut für harte Fakten):*
> Das Zettelkasten-Prinzip basiert auf der Annahme, dass unser Kurzzeitgedächtnis limitiert ist [@miller_1956], weshalb wir externe Denkgerüste benötigen [@ahrens_2017, p. 23].

### 3.2 Fußnoten (Der Diskurs-Raum)

Fußnoten sind keine Müllhalde für bibliographische Daten (das macht Pandoc automatisch). Fußnoten sind Denk-Ebenen. Talmud-Prinzip.

**Syntax:**

| Syntax | Beschreibung |
| :--- | :--- |
| `^[Das ist eine Fußnote.]` | Inline-Fußnote. Wird automatisch nummeriert. |
| `Text^[Erste.]` und `mehr^[Zweite.]` | Auto-Nummerierung. Du kümmerst dich nicht um Zahlen. |

**Beispiel (diskursive Fußnote):**
> Das System erzwingt Atomizität.^[Dies ist nicht unumstritten. Schmidt [@schmidt_2016] argumentiert, dass zu starke Atomisierung den Kontext zerstört. Ich folge hier jedoch Ahrens, weil...]

Zitate innerhalb der Fußnote landen ebenfalls im Literaturverzeichnis.

### 3.3 Wann was nutzen?

**Szenario A: Direkte Stütze**
*Ich behaupte X und hier ist der Beweis.*
Nutze Inline: `Das Gehirn denkt in Assoziationen [@kahneman_2011].`

**Szenario B: Abstecher**
*Ich behaupte X, aber es gibt eine spannende Nebentheorie.*
Nutze Fußnote: `Das Gehirn denkt in Assoziationen.^[Interessanterweise widerspricht das der klassischen KI-Forschung, siehe [@dreyfus_1972].]`

**Szenario C: Akademischer Streit**
*A sagt X, B sagt Y, ich sage Z.*
Nutze Narrativ: `@freud_1900 sah Träume als Wünsche, während @jung_1934 sie als Archetypen deutete. Wir betrachten sie hier als neuronales Rauschen.`

### 3.4 Goldene Regeln

1. **Sei präzise:** Zitiere nicht das ganze Buch `[@buch]`, wenn der Gedanke auf Seite 45 steht `[@buch, p. 45]`. Atomarer Zettel, atomarer Beleg.
2. **Kein Namedropping:** Vermeide `(Müller, 2000; Meier, 2001; Schulze, 2002; ...)`, es sei denn, die Menge ist das Argument. Wähle die stärkste Quelle.
3. **Zotero ist die Wahrheit:** Der `@citekey` muss exakt mit Zotero/BetterBibTeX übereinstimmen. Tippfehler = Zitat wird nicht gerendert.

### 3.5 Workflow: Quelle → Zettel

```
3.5.1  Quelle finden (Recherche, Lektüre)
3.5.2  Quelle in Zotero aufnehmen
3.5.3  Zotero → Auto-Export → bibliography.bib
3.5.4  Citekey nutzen: [@citekey] im Zettel
3.5.5  Pandoc/Quartz generiert Bibliographie automatisch
```

### 3.6 Citekey-Format

- Zotero Better BibTeX generiert: `autor_jahr` (z.B. `ahrens_2017`)
- Bei Konflikten: `ahrens_2017a`, `ahrens_2017b`

---

## 4. Recherche

### 4.1 Stufe 0: Cluster-Exploration

Bevor du Titel festlegst, Überblick verschaffen. Kartografie vor dem Graben.

**Prompt-Idee:**
```text
Ich möchte das Thema [X] für meinen Zettelkasten erschließen.

Zerlege dieses Thema in seine kleinsten, atomaren Konzepte.

Welche 5 Hauptaspekte und welche 3 ergänzenden Randaspekte sind essenziell, um [X] ganzheitlich zu verstehen?

Liefere mir nur die Titel dieser Zettel-Cluster.
```

Erst DANACH → Stufe 1 (Cluster-Recherche).

### 4.2 Das Problem mit Begriff-Recherche

**4.2.1** "Recherchiere Atomizität" → isolierter Zettel

**4.2.2** Der Zettel existiert nicht im Vakuum. Er braucht Nachbarn.

**4.2.3** Besser: Thema → Cluster → Zusammen recherchieren

### 4.3 Der Cluster-Ansatz

```
4.3.1  Thema wählen
       └── Beispiel: "Prinzipien des Zettelkastens"

4.3.2  Haupt-Zettel identifizieren (3-5)
       └── Atomizität, Konnektivität, Kontextualisierung

4.3.3  Neben-Zettel identifizieren (2-3)
       └── Single Responsibility, Modularität, Baukastenprinzip

4.3.4  Zusammen recherchieren
       └── Eine Recherche, Material für alle Zettel
```

### 4.4 Prüffrage nach der Cluster-Recherche

> Kann jeder Zettel für sich stehen, auch wenn die anderen nicht existieren würden? Wenn nein, sind die Zettel nicht atomar, sondern verklammert.

### 4.5 Recherche-Prompt

Kopiere diesen Prompt in Perplexity Pro oder Gemini Pro:

```text
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

### 4.6 Goldstück-Prinzip

Die Recherche liefert viel Material. Deine Aufgabe: Die Goldstücke finden und markieren (⭐).

**Was ist ein Goldstück?**
- Eine Definition, die es auf den Punkt bringt
- Ein Zitat, das du nie besser formulieren könntest
- Eine Analogie, die sofort einleuchtet

**Goldstücke gehören IN den Zettel:**
- In Fußnoten (Definitionen, Vertiefungen, Gegenargumente)
- Im Haupttext (wenn es den Kern stützt)

**Nicht:** Goldstücke in separate Recherche-Datei auslagern. Was nicht im Zettel landet, geht verloren.

**Regel:** Am Ende des Schreibens: Alle Goldstücke verwendet? Wenn nein → zurück zur Ausführung.

### 4.8 Recherche-Output

Speichere das Ergebnis als: `_recherchen/R-[Thema].md`

Beispiel: `_recherchen/R-Prinzipien des Zettelkastens.md`

---

## 5. Schreiben

### 5.1 Vor dem Schreiben

```
5.1.1  Thema wählen
5.1.2  Cluster definieren (Haupt- + Neben-Zettel)
5.1.3  Recherche durchführen (siehe 4.)
5.1.4  Quellen in Zotero aufnehmen
5.1.5  Recherche-Output sichten
```

### 5.2 Beim Schreiben

```
5.2.1  Template kopieren (siehe 8.)
5.2.2  Frontmatter ausfüllen (cssclasses, tags, aliases)
5.2.3  Titel schreiben (grob): Auskunft, nicht Satz
5.2.4  Ausführung schreiben: Atomar, eigene Worte
5.2.5  Zitieren: [@key] für Inline, ^[...] für Fußnoten
5.2.6  Anknüpfungspunkte: [[Link]] - Warum relevant
5.2.7  Merksatz schreiben: Lakonisch, kursiv (Knoten im Taschentuch)
5.2.8  Ein-Satz-Essenz (optional): Erst wenn du den Zettel verstanden hast
5.2.9  Titel präzisieren
```

### 5.3 Nach dem Schreiben

```
5.3.1  Korrektur (siehe 6.)
5.3.2  Vorlese-Test
5.3.3  Links prüfen (existieren die Ziele?)
```

---

## 6. Korrektur

### 6.1 Der Vorlese-Test

Lies den Zettel laut vor. Wenn du stolperst, stimmt etwas nicht.

### 6.2 Checkliste

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
[ ] Hook zieht rein
[ ] Jeder Link ist kontextualisiert
```

### 6.3 Später ausbauen

Diese Sektion wird mit der Praxis wachsen. Beispiele, häufige Fehler, Lösungen.

---

## 7. Talmud-Prinzip

### 7.1 Die Idee

**7.1.1** Der Haupttext bleibt atomar. Er ist der "Blumengarten" – gepflegt, begrenzt.

**7.1.2** Die Fußnoten wachsen. Sie sind die "Wildnis" – hier können Dinge entstehen, die du nie geplant hast.

**7.1.3** Der Zettel selbst wächst nicht. Das Drumherum wächst.

### 7.2 Arten der Erweiterung

**7.2.1** Andere Perspektiven:
```
^[Luhmann sieht das anders: "..." [@luhmann_1981, p. 223].]
```

**7.2.2** Gegenargumente:
```
^[Kritiker wie X wenden ein, dass... Aber: ...]
```

**7.2.3** Vertiefungen:
```
^[Für eine ausführliche Behandlung siehe [@doto_2024, Kap. 3].]
```

**7.2.4** Zitat vom Zitat:
```
^[Ahrens zitiert hier Luhmann, der wiederum auf... [@ahrens_2017, p. 78].]
```

### 7.3 Wann erweitern?

```
7.3.1  Beim Wiederlesen (nach Wochen, Monaten)
7.3.2  Wenn neue Quellen auftauchen
7.3.3  Wenn du Widersprüche entdeckst
7.3.4  Wenn jemand etwas Kluges dazu gesagt hat
```

---

## 8. Template

Kopiere diese Vorlage für jeden neuen Zettel:

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

Ausführung.^[Fußnote bei Bedarf.]

### Anknüpfungspunkte

[[Link]] - Warum relevant.
```

---

## 9. Beispiel

Ein vollständiger Zettel mit allen Elementen:

```markdown
---
cssclasses: zettelkasten
tags:
  - ZK-Theorie
aliases:
  - Atomarität
  - Atomic Notes
---

# ZK Atomizität

*Ein Gedanke pro Zettel.*

Ein isolierter Zettel, der zwei Themen vermischt, ist wie ein Legostein, der Rad und Motor verklebt.^[Ahrens nennt das "Atomic Notes" – ein Begriff, den Luhmann selbst nie nutzte [@ahrens_2017, p. 45].]

Atomizität bedeutet nicht Kürze (Wortanzahl), sondern thematische Unteilbarkeit (Single Responsibility). Wenn eine Notiz "Kapitalismuskritik und Depression" behandelt, kannst du sie nicht in einem Kontext zu "Depression in der Antike" nutzen, ohne den Kapitalismus-Teil mitzuschleppen [@doto_2024].

Nur wenn Wissen in seine kleinsten sinnvollen Einheiten zerlegt ist, kann es wie Lego zu neuen Strukturen kombiniert werden.^[Das Prinzip ist isomorph zum Single Responsibility Principle in der Softwareentwicklung: Eine Klasse, eine Verantwortung.]

### Anknüpfungspunkte

[[ZK Konnektivität]] - Atomizität ist die Voraussetzung für Konnektivität. Ohne getrennte Module kein flexibles Netz.

[[ZK Kontextualisierung]] - Weil atomare Notizen aus ihrem Ursprungskontext gelöst sind, müssen Links den Kontext explizit herstellen.
```

---

## 10. Änderungshistorie

| Datum      | Version | Änderung                                                                                                                                                                                                                           |
| ---------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 30.12.2025 | 1.0     | Initiale Version                                                                                                                                                                                                                   |
| 31.12.2025 | 2.0     | Große Revision: 7 Attribute (1.1), Klärgruben-Prinzip (1.3), Titel als Auskunft (2.3), Hook → Ein-Satz-Essenz (2.5), Zitier-Sektion erweitert (3.), Recherche mit Stufe 0 und Prüffrage (4.), Schreib-Reihenfolge korrigiert (5.2) |
| 31.12.2025 | 2.1     | Recherche-Prompt erweitert (Definitionen, Modelle, Goldstück-Markierung), Goldstück-Prinzip (4.6): IN den Zettel, nicht daneben |

---

*Dieses Dokument wächst mit der Praxis.*