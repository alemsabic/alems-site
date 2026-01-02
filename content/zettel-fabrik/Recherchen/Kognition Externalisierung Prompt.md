# Talmud-Recherche: Kognition Externalisierung

Die Mishna steht. Jetzt kommen die Stimmen – und vielleicht wird die Mishna besser.

---

## SCHREIBREGELN FÜR DEN FINALEN ZETTEL

STRUKTUR:
- Frontmatter: cssclasses: zettelkasten, tags, aliases
- # Titel: Auskunft, kein ganzer Satz (z.B. "ZK Atomizität", nicht "Was ist Atomizität?")
- *Merksatz*: Kursiv, lakonisch, wie ein Knoten im Taschentuch
- Ein-Satz-Essenz: Optional, erst wenn der Gedanke kristallisiert ist
- Ausführung: Der atomare Haupttext, eigene Worte
- ### Anknüpfungspunkte: Links mit Begründung ([[Link]] - Warum relevant)
- Fußnotenblock: Am Dateiende, Obsidian-Syntax [^n]

SIEBEN ATTRIBUTE (jeder Zettel muss diese erfüllen):
1. atomar – ein Gedanke pro Zettel, thematisch unteilbar
2. vernetzt – Links zu anderen Zetteln vorhanden
3. zitierfähig – Quellen angegeben mit [@citekey]
4. erweiterbar – Fußnoten als Raum für Wildnis
5. selbsterklärend – ohne andere Zettel verständlich
6. lesbar – vorlesbar ohne Stolpern
7. kurz – so wenig Wörter wie nötig

STIL:
- Du statt man
- Hauptsätze statt Schachtelsätze
- Aktiv statt Passiv
- Verben statt Nomen
- Spezifisch statt generisch
- Keine Superlative ("fantastisch", "unglaublich")
- Klammern auflösen in separate Sätze

TALMUD-PRINZIP:
- Haupttext (Mishna): Der Kern, gepflegt, atomar
- Fußnoten (Gemara): Die Stimmen – Bestätigung, Widerspruch, Beispiel, Genealogie, Vertiefung
- Die Fußnoten sind keine Nachweise, sie sind der Diskurs

---

## Zettel-Kern

```markdown
---
cssclasses: zettelkasten
tags:
  - Kognition
  - Extended-Mind
aliases:
  - Extended Mind
  - Externes Gedächtnis
---

# Kognition Externalisierung

*Leere den Kopf, um ihn benutzen zu können.*

Notes on paper do not make contemporary physics easier, they make it possible.

Das Auslagern von Gedächtnisleistung auf externe Medien befreit kognitive Kapazitäten für prozessuales Denken und Kreativität. Der Zettelkasten ist kein Archiv, sondern eine Erweiterung des Denkens.

Denk an RAM vs. Festplatte: Wenn der RAM (Arbeitsgedächtnis) voll ist, stürzt der Rechner ab. Auslagern auf die SSD (Zettelkasten) hält das System schnell.

### Anknüpfungspunkte

[[ZK Emergenz]] - Wir erkennen komplexe Muster nur, wenn wir die Teile externalisiert vor uns sehen.
[[ZK Atomizität]] - Kleine Chunks entlasten das Gehirn (Chunking).
```

---

## Auftrag

Führe eine Talmud-Recherche durch:

### TEIL A: STIMMEN SAMMELN (Gemara)

1. BESTÄTIGUNGEN
   Wer sagt dasselbe? Welche Denker, Forscher, Praktiker kommen
   zum selben Schluss? Liefere Autor, Werk, Jahr, und formuliere
   eine Fußnote, die erklärt WARUM diese Stimme relevant ist.

2. WIDERSPRÜCHE
   Wer widerspricht? Was ist das stärkste Gegenargument?
   Formuliere die Gegenposition fair. Dann: Wie entkräftest du sie?

3. BEISPIELE
   Welche konkreten Fälle illustrieren den Gedanken?
   Empirische Studien, historische Ereignisse, Alltagsbeobachtungen.

4. GENEALOGIE
   Woher kommt die Idee? Wer hat sie zuerst formuliert?
   Welche Tradition steht dahinter?

5. VERTIEFUNGEN
   Wer geht weiter? Welche Konsequenzen werden anderswo gezogen?
   Was sind die radikalen Implikationen?

### TEIL B: PALIMPSEST-PRÜFUNG (Kern verbessern?)

Prüfe für jedes Goldstück:

| Frage | Wenn ja → |
|-------|-----------|
| Ist dieses Zitat besser formuliert als der aktuelle Haupttext? | Haupttext ersetzen, alten in Fußnote |
| Kann die Kernaussage präzisiert werden? | Kernaussage schärfen |
| Gibt es ein besseres Beispiel als das aktuelle? | Beispiel tauschen |
| Überzeugt ein Widerspruch so sehr, dass die Position revidiert werden muss? | Position ändern (!) |

Liefere separat:
- PALIMPSEST-VORSCHLÄGE: Konkrete Änderungen am Haupttext
- Begründung: Warum ist die neue Version besser?

---

## OUTPUT-FORMAT

Für jede Quelle IMMER angeben (ich prüfe selbst, ob sie in Zotero ist):
- Citekey-Vorschlag: @autor_jahr (z.B. @hutchins_1995)
- Autor(en): Vollständig
- Titel: Vollständig
- Jahr: JJJJ
- Typ: book / article / chapter / web
- Relevanz: Warum gehört diese Stimme hierher?
- Ziel: "fußnote" oder "haupttext" (Palimpsest)
- Import-Priorität: hoch / mittel / niedrig

Liefere:
1. Fußnoten-Kandidaten (mit Position im Text, mit [@citekey])
2. Palimpsest-Vorschläge (Verbesserungen am Haupttext)
3. Verwandte Zettel (thematisch passend)
4. Quellen-Manifest (alle Quellen mit vollen bibliographischen Daten)
5. **FINALER ZETTEL** (vollständiges Markdown, bereit zum Speichern)

## WICHTIG

Am Ende: Liefere den fertigen Zettel als vollständigen Markdown-Code.
- Alle Palimpsest-Vorschläge eingearbeitet
- Alle neuen Fußnoten eingefügt (Obsidian-Syntax: [^n])
- Fußnotenblock am Dateiende
- Keine Rückfragen. Liefern.
