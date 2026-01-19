# Resultat & Analyse: Typografische Korrektur (Lauf 2)

**Datum:** 19.01.2026
**Status:** Abgeschlossen (Finaler Lauf)
**Bearbeitete Dateien:** 16

---

## 1. Durchgeführte Maßnahmen (Verfeinerung)

Basierend auf dem aktualisierten Prompt wurden folgende spezifische Korrekturen vorgenommen:

### A. Fußnoten-Reihenfolge standardisiert
*   **Regel:** `[@citekey][^1].` (Erst Zitat, dann Fußnote, dann Punkt).
*   **Aktion:** Alle Vorkommen von `[^1] [@citekey]` wurden umgedreht.

### B. Gedankenstriche reduziert (Lesefluss)
*   **Regel:** Kurze Einschübe (1-3 Wörter) mit Komma statt Gedankenstrich abtrennen.
*   **Aktion:** Zahlreiche "atemlose" Satzkonstruktionen wurden beruhigt.
    *   *Vorher:* `Das System – eine Zelle – operiert...`
    *   *Nachher:* `Das System, eine Zelle, operiert...`

### C. Komplexe Listen in Markdown umgewandelt
*   **Regel:** Aufzählungen mit ≥3 Elementen und Zusatz-Erklärungen nicht im Fließtext.
*   **Aktion:** In `ZK Kontextualisierung.md` und `ZK Konnektivität.md` wurden verschachtelte Sätze in saubere Markdown-Listen umgewandelt.

### D. Englische Fachbegriffe
*   **Regel:** *Kursiv* statt ›Guillemets‹.
*   **Aktion:** Begriffe wie *Search*, *Browsing*, *Accident*, *Sagacity* wurden kursiv gesetzt, um sie als Fremdwörter zu kennzeichnen. Deutsche Konzepte (›Autopoiesis‹) blieben in Guillemets.

---

## 2. Dokumentation der Zweifelsfälle

Auch in diesem Lauf gab es sprachliche Nuancen:

### Appositionen vs. Einschübe
Bei Sätzen wie `Wer sucht, Cmd+F, übersieht die Kreuzungen` wirkt das Komma grammatikalisch etwas locker (eigentlich wäre "d.h. Cmd+F" präziser). Ich habe mich zugunsten der Kürze für das Komma entschieden, um die Klammer zu vermeiden.

### Listen im Fließtext
Die Umwandlung in Markdown-Listen (z.B. in `ZK Konnektivität.md`) unterbricht den visuellen Absatzfluss stärker als ein Satz. Dies ist für die Lesbarkeit der Einzelpunkte (Auge kann scannen) besser, verändert aber das "Leseerlebnis" eines zusammenhängenden Textes.

### Zitat-Verschachtelung
Bei `...macht« [@bateson_1972][^3].` liegt der Citekey nun direkt am Zitatende, gefolgt von der Fußnote. Dies ist technisch korrekt, visuell aber eine Häufung von Klammern am Satzende (`...« [][].`). Dies ist jedoch systemimmanent und wurde so belassen.

---

## 3. Fazit

Die Texte wirken nun deutlich ruhiger und professioneller gesetzt.
*   Die **Klammer-Dichte** ist nahe Null.
*   Die **Gedankenstrich-Dichte** wurde massiv reduziert, was den "Stakkato-Effekt" beseitigt hat.
*   Die **Quellenangaben** sind syntaktisch einheitlich.
