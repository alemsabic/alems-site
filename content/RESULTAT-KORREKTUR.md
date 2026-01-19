# Resultat & Analyse: Typografische Korrektur

**Datum:** 19.01.2026
**Status:** Abgeschlossen
**Bearbeitete Dateien:** 16 (Alle Zettel im Hauptverzeichnis)

---

## 1. Durchgeführte Maßnahmen

Die folgenden Regeln wurden gemäß `KORREKTUR_TYPOGRAFIE.md` strikt angewendet:

### A. Zitation & Citekeys
*   **Verschiebung:** Alle Citekeys wurden vor das Satzendezeichen gezogen.
    *   *Vorher:* `Satzende.[@autor_jahr]`
    *   *Nachher:* `Satzende [@autor_jahr].`
*   **Formatierung:** Manuelle Quellen `(Autor Jahr)` wurden in korrekte Pandoc-Citekeys `[@autor_jahr]` umgewandelt.

### B. Klammer-Eliminierung
*   **Radikale Reduktion:** Klammern wurden fast vollständig entfernt und durch Gedankenstriche (`–`) oder Kommata ersetzt.
*   **Ausnahmen:** Erhalten blieben nur Citekeys `[@...]`, Fußnoten-Marker `[^1]`, und sehr kurze Abkürzungen wie `z.B.` oder `SoC`.

### C. Typografische Anführungszeichen
*   **Vereinheitlichung:** Alle geraden (`"`) und englischen (`“`) Anführungszeichen wurden ersetzt.
    *   **Wörtliche Rede / Zitate:** `»...«` (Chevrons)
    *   **Begriffe / Konzepte / Metaphern:** `›...‹` (Single Chevrons)

### D. Kursivschreibung
*   **Reduktion:** Die Kursivschreibung wurde auf Buchtitel und fremdsprachige Erstnennungen beschränkt. Wiederholte Fachbegriffe (z.B. Autopoiesis) stehen nun im Normalsatz.

---

## 2. Analyse der Zweifelsfälle (Interpretation)

Bei der Umsetzung ergaben sich Interpretationsspielräume, die wie folgt gelöst wurden:

### "Kurze Zusätze" vs. Erklärungen
Die Vorgabe erlaubte Klammern für "sehr kurze optionale Zusätze".
*   **Entscheidung:** Im Zweifel wurde **gegen** die Klammer entschieden (gemäß Anweisung "Lieber eine Klammer zu viel eliminieren").
*   **Effekt:** Der Text enthält nun sehr viele Gedankenstriche. Dies erzeugt einen dynamischen, eingeschobenen Rhythmus, kann aber bei zu hoher Dichte "atemlos" wirken.

### Zitat vs. Begriff
Die Unterscheidung zwischen einem wörtlichen Zitat und einem ironischen/metaphorischen Begriff ist fließend.
*   **Entscheidung:**
    *   Explizite Aussagen (`Luhmann sagt...`) -> `»Doppel-Chevrons«`
    *   Konzepte (`Der Begriff...`, `Das Prinzip...`) -> `›Single-Chevrons‹`
    *   Englische Fachbegriffe im Fließtext (z.B. `Search`, `Browsing`) wurden als Begriffe (`›...‹`) markiert, nicht als Zitate.

### Verschachtelte Aufzählungen
In `ZK Kontextualisierung.md` gab es Listen innerhalb von Sätzen: `(Biologie (Anpassung), Soziologie (Sozialdarwinismus))`.
*   **Entscheidung:** Auflösung zu `Biologie – Anpassung, Soziologie – Sozialdarwinismus`.
*   **Effekt:** Typografisch sauber, aber syntaktisch komplex zu lesen.

---

## 3. Vorschläge für Verbesserungen (Next Steps)

Um die Lesbarkeit zu optimieren und die Strenge der Regeln etwas abzufedern, schlage ich folgende Verfeinerungen vor:

### A. Listen-Struktur statt Schachtelsätze
Anstatt komplexe Klammer-Konstruktionen mit Gedankenstrichen im Fließtext zu lösen, sollten **Markdown-Listen** verwendet werden.

*   *Aktuell (ZK Kontextualisierung):*
    `Du kannst daraus drei Zettel machen: Biologie – Anpassung, Soziologie – Sozialdarwinismus – oder Wirtschaft – Marktmechanismen.`
*   *Vorschlag:*
    `Du kannst daraus drei Zettel machen:`
    *   `Biologie: Anpassung`
    *   `Soziologie: Sozialdarwinismus`
    *   `Wirtschaft: Marktmechanismen`

### B. Gezielte Rückkehr zu Kommata
An Stellen, wo Gedankenstriche den Lesefluss zu stark unterbrechen (doppelte Zäsur), könnte ein einfaches Komma den Fluss beruhigen, sofern es sich um eine reine Apposition handelt.

*   *Aktuell:* `Das Rhizom – ein Wurzelgeflecht – wuchert.`
*   *Alternativ:* `Das Rhizom, ein Wurzelgeflecht, wuchert.`

### C. Standardisierung der Fußnoten-Position
Die Position von `[^1]` relativ zum Citekey `[@autor]` variiert leicht, je nach logischem Bezug im Originaltext.
*   *Vorschlag:* Eine strikte Konvention festlegen, z.B. immer: `Satzende [@citekey][^1].` (Erst Quelle, dann erklärende Fußnote, dann Punkt).

### D. Review der englischen Begriffe
Prüfen, ob englische Fachbegriffe (z.B. *Search*, *Browsing*, *Retrieval*) konsequent als Begriffe `›...‹` oder kursiv `*...*` markiert werden sollen. Aktuell ist es eine Mischung basierend auf dem Kontext (Erstnennung vs. Begriffsnutzung). Eine Vereinheitlichung auf "Technische Begriffe immer kursiv" könnte ruhiger wirken als die Single-Chevrons.
