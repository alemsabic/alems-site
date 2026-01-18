#!/usr/bin/env python3
"""
Korrigiert Fachbegriff-Formatierung in Zettel:
- Fett → Kursiv (nur beim ersten Auftreten)
- Fußnoten-Position prüfen (manuelle Review nötig)
"""

import re
import glob
from pathlib import Path

# Liste der Zettel
zettel = [
    "Interpenetration.md",
    "Lose Kopplung.md",
    "Strukturelle Kopplung.md",
    "Strukturelle Drift.md",
    "Kognitive Externalisierung.md",
    "ZK Epistemische Handlung.md",
    "Operationale Geschlossenheit.md",
    "SWE Single Responsibility.md",
    "Unterschied Irritation Information.md",
    "Unterschied Autopoiesis Allopoiesis.md",
    "ZK Atomizität.md",
    "ZK Emergenz.md",
    "ZK Konnektivität.md",
    "ZK Kontextualisierung.md",
    "ZK Retrieval.md",
    "ZK Serendipität.md",
]

base_path = Path("/Users/alemsabic/Desktop/MEMEX/NOTIZEN")

for zettel_name in zettel:
    filepath = base_path / zettel_name
    if not filepath.exists():
        print(f"⚠️  Nicht gefunden: {zettel_name}")
        continue

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    original_content = content

    # Finde alle **Fachbegriffe** (fett) und ersetze durch *Fachbegriff* (kursiv)
    # ABER: Nur im Haupttext, NICHT in Fußnoten (Fußnoten dürfen fett für Begriffsnamen nutzen)

    # Split bei "---" (Trennung Vorderseite/Rückseite)
    # Split bei "[^" (Fußnoten-Beginn)

    # Strategie: Ersetze **Wort** durch *Wort*, aber NUR wenn:
    # 1. Es KEIN Citekey ist ([@...])
    # 2. Es KEINE Fußnoten-Definition ist ([^1]: **Begriff**)

    # Regex: **Wort** → *Wort*
    # ABER: Behalte Fußnoten-Definitionen (z.B. [^1]: **Exogramm**)

    # Schritt 1: Finde alle **Begriff** im Haupttext (vor "## Rückseite")
    lines = content.split("\n")
    new_lines = []
    in_footnote_definition = False

    for line in lines:
        # Prüfe: Ist das eine Fußnoten-Definition? (Zeile beginnt mit [^)
        if re.match(r"^\[\^", line):
            in_footnote_definition = True
        elif in_footnote_definition and line.strip() == "":
            in_footnote_definition = False

        # Ersetze **Begriff** durch *Begriff*, AUSSER in Fußnoten-Definitionen
        if not in_footnote_definition:
            # Ersetze **Wort** oder **Wort Wort** durch *...*
            # ABER: Behalte **Ein-Satz-Zusammenfassung** in der Vorderseite (falls vorhanden)

            # Pattern: **Wort** oder **Wort Wort Wort** (bis zu 4 Wörter)
            # Aber NICHT: **Satz mit vielen Wörtern.** (das ist die Zusammenfassung)

            # Ersetze nur Fachbegriffe (1-3 Wörter, kein Punkt am Ende)
            line = re.sub(
                r"\*\*([A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ]?[a-zäöüß]+){0,2})\*\*(?!\*)",
                r"*\1*",
                line,
            )
            # Erklärt: \*\* = zwei Sterne
            #          ([A-Z][a-z]+...) = Wort, das mit Großbuchstaben beginnt (1-3 Wörter)
            #          (?!\*) = NICHT gefolgt von weiterem Stern (verhindert ***Fehler***)

        new_lines.append(line)

    content = "\n".join(new_lines)

    # Zeige Änderungen
    if content != original_content:
        print(f"✅ Korrigiert: {zettel_name}")
        # Schreibe zurück
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
    else:
        print(f"   Unverändert: {zettel_name}")

print("\n✅ Fertig!")
print("\n⚠️  WICHTIG: Fußnoten-Position muss MANUELL geprüft werden!")
print("   (Skript kann nicht automatisch erkennen, wo Fußnote hingehört)")
