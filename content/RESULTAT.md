# RESULTAT: Projekt-Status & Recherche-Setup

Datum: 11.01.2026
Status: **Strategischer Reset auf "Master-Prompt + Power-Tools"**

Wir haben die komplexe Agenten-Automatisierung als gescheitert erklärt ("Code macht blind"). Wir kehren zurück zum manuell gesteuerten Prozess via Master-Prompt, verstärkt durch mächtige Recherche-Tools.

## 1. Das Recherche-Setup (Der Schatz)

Dies sind die Komponenten, die wir behalten und nutzen:

### A. OpenAlex (Primärquelle)
- **Status:** ✅ Aktiv & Einsatzbereit.
- **Tool:** `zettel-fabrik/tools/openalex.py`
- **Konfiguration:**
  - API Key: Hinterlegt (in `openalex.py`).
  - Polite Pool: Aktiv (`alemsabic@gmail.com`).
- **Vorteil:** Liefert strukturierte Daten, Genealogie und ist extrem schnell.

### B. Semantic Scholar (Sekundärquelle/Intent)
- **Status:** ⚠️ Wartet auf API Key.
- **Warum wir es brauchen:** OpenAlex ist super für Metadaten, aber Semantic Scholar hat bessere Daten zum **Citation Intent** (Warum wurde zitiert? Bestätigung/Widerspruch?) und Themen-Klassifizierung.
- **Code:** `zettel-fabrik/tools/librarian.py` ist bereits so programmiert, dass es S2 als Fallback nutzt. Sobald der Key da ist, wird es zur "Dual Engine".

### C. Librarian (Der Wächter)
- **Status:** ✅ Einsatzbereit (Version 2.1).
- **Funktion:** Holt BibTeX-Daten und schreibt sie in die Inbox (`imports/to_zotero.bib`).
- **CRITICAL RULE / TODSÜNDE:**
  - **Der Librarian darf NIEMALS in `bibliography.bib` schreiben.**
  - `bibliography.bib` ist ein reines Export-Artefakt von Zotero (via Better BibTeX).
  - Wer hier schreibt, zerstört den Sync und die "Single Source of Truth".
  - **Pfad:** Search -> `imports/to_zotero.bib` -> User importiert in Zotero -> Zotero exportiert nach `bibliography.bib`.

## 2. Lessons Learned (Warum wir zurückrudern)

1.  **Kontext > Code:** Ein Python-Skript ignoriert implizite Regeln (wie "Zotero ist Master"). Ein Master-Prompt, der von einem Menschen/LLM im Chat ausgeführt wird, respektiert sie.
2.  **Keine Blackbox:** Wir wollen sehen, was passiert. JSON-Outputs verstecken die Nuancen. Wir wollen den Text (Mishna/Gemara) sehen und formen.
3.  **DNA:** Die Dateien in `rules/` (7 Attribute, 9 Stilregeln, Talmud-Prinzip) sind wichtiger als jeder Python-Runner.

## 3. Nächste Schritte

1.  **Semantic Scholar API Key beantragen** (für Projekt "ale.ms").
2.  Key in `librarian.py` oder `.env` eintragen.
3.  Zettelproduktion wieder aufnehmen: Manueller Chat mit Master-Prompt, aber Recherche durch `python tools/openalex.py` statt Halluzination.
