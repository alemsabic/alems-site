import os
import re
import glob


def analyze_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Metrics
    # 1. Nominalstil (Wörter auf -ung, -heit, -keit)
    nominals = re.findall(r"\b\w+(?:ung|heit|keit|ion|ismus)\b", content)
    nominal_score = len(nominals)

    # 2. Passiv / Feige Distanz ("es wird", "man kann")
    passive = re.findall(
        r"\b(?:Es|es) (?:wird|wurde|kann|lässt)\b|\b(?:Man|man) (?:kann|könnte|sollte)\b",
        content,
    )
    passive_score = len(passive)

    # 3. Satzlänge & Rhythmus (im Haupttext, vor "### Anknüpfungspunkte")
    main_text = content.split("### Anknüpfungspunkte")[0]
    # Entferne YAML Header
    main_text = re.sub(r"---.*?---", "", main_text, flags=re.DOTALL)
    # Entferne Titel
    main_text = re.sub(r"# .*", "", main_text)

    sentences = re.split(r"[.!?]+", main_text)
    sentences = [s.strip() for s in sentences if len(s.split()) > 2]  # Nur echte Sätze

    if not sentences:
        avg_len = 0
        variation = 0
    else:
        lengths = [len(s.split()) for s in sentences]
        avg_len = sum(lengths) / len(lengths)
        variation = max(lengths) - min(lengths)

    # 4. Perspektive ("Du" vs "Wir")
    wir_count = len(re.findall(r"\b[Ww]ir\b", content))
    du_count = len(re.findall(r"\b[Dd]u\b", content))

    # 5. Struktur (Ein-Satz-Absätze)
    paragraphs = main_text.split("\n\n")
    one_sentence_paragraphs = 0
    for p in paragraphs:
        if p.strip() and len(re.split(r"[.!?]+", p)) <= 2:  # 1 Satz + leeres Element
            one_sentence_paragraphs += 1

    return {
        "file": os.path.basename(filepath),
        "nominals": nominal_score,
        "passive": passive_score,
        "avg_len": round(avg_len, 1),
        "variation": variation,
        "wir": wir_count,
        "du": du_count,
        "one_sentence_p": one_sentence_paragraphs,
    }


files = sorted(glob.glob("*-neu.md") + glob.glob("*-BESSER.md"))
print("| Datei | Nominal | Passiv | Satzlänge Ø | Var | Wir/Du | 1-Satz-Abs |")
print("|---|---|---|---|---|---|---|")

for f in files:
    m = analyze_file(f)
    print(
        f"| {m['file']} | {m['nominals']} | {m['passive']} | {m['avg_len']} | {m['variation']} | {m['wir']}/{m['du']} | {m['one_sentence_p']} |"
    )
