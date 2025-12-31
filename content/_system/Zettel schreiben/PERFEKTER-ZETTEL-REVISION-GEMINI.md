# Revision: Sektion 3 (Zitieren & Fußnoten)

*Dieses Dokument ist ein Entwurf für die Erweiterung von "PERFEKTER-ZETTEL.md". Es basiert auf der Syntax von Pandoc und `rehype-citation`.*

---

## 3. Zitieren & Belegen

Ein Zettelkasten lebt von der Vernetzung, nicht vom Plagiat. Wir nutzen die volle Macht der **Pandoc-Syntax**, die von unserem Web-Renderer (`rehype-citation`) unterstützt wird. Ziel ist nicht bürokratische Korrektheit, sondern **gedankliche Nachvollziehbarkeit**.

### 3.1 Inline-Zitierung (Der Standard)

Wir unterscheiden zwei Arten der Zitierung im Fließtext:
1.  **Parenthetical (Klassisch):** Die Quelle steht in Klammern am Ende. Der Fokus liegt auf der *Aussage*.
2.  **Narrative (Erzählend):** Der Autor wird Teil des Satzes. Der Fokus liegt auf der *Person*.

#### 3.1.1 Die Syntax-Matrix

| Typ | Syntax | Ergebnis (APA Style) | Wann nutzen? |
| :--- | :--- | :--- | :--- |
| **Standard** | `[@ahrens_2017]` | (Ahrens, 2017) | Standardfall für Belege. |
| **Mit Seite** | `[@ahrens_2017, p. 45]` | (Ahrens, 2017, p. 45) | Wenn du ein spezifisches Argument referenzierst. |
| **Seitenbereich** | `[@ahrens_2017, pp. 33-35]` | (Ahrens, 2017, pp. 33–35) | Wenn ein Gedanke sich über mehrere Seiten erstreckt. |
| **Narrativ** | `@ahrens_2017 sagt...` | Ahrens (2017) sagt... | Wenn du den Autor aktiv in die Diskussion einbindest. |
| **Narrativ + Ort** | `@ahrens_2017 [p. 12]` | Ahrens (2017, p. 12) | Wie oben, aber mit Seitenangabe. |
| **Unterdrückt** | `Wie Ahrens [-@ahrens_2017] zeigt` | Wie Ahrens (2017) zeigt | Wenn der Name schon im Text steht, du aber das Jahr brauchst. |
| **Mehrere** | `[@ahrens_2017; @doto_2024]` | (Ahrens, 2017; Doto, 2024) | Um Konsens oder Debatten zwischen mehreren Autoren zu zeigen. |
| **Präfix** | `[siehe @ahrens_2017]` | (siehe Ahrens, 2017) | Um auf weiterführende Literatur zu verweisen. |
| **Suffix** | `[@ahrens_2017, für Details]` | (Ahrens, 2017, für Details) | Um den Verweis zu qualifizieren. |
| **Komplex** | `[siehe @ahrens_2017, p. 4; aber auch @doto_2024]` | (siehe Ahrens, 2017, p. 4; aber auch Doto, 2024) | Mächtig! Verknüpft Argumente direkt in der Klammer. |

#### 3.1.2 Beispiele im Kontext

**Der "Narrative Flow" (Gut für Zusammenfassungen):**
> @luhmann_1981 argumentiert, dass Kommunikation unwahrscheinlich ist. Dagegen hält @baecker_2005 [p. 99], dass Computer diese Unwahrscheinlichkeit potenzieren.

**Der "Evidence Strike" (Gut für harte Fakten):**
> Das Zettelkasten-Prinzip basiert auf der Annahme, dass unser Kurzzeitgedächtnis limitiert ist [@miller_1956], weshalb wir externe Denkgerüste benötigen [@ahrens_2017, p. 23].

---

### 3.2 Fußnoten (Der Diskurs-Raum)

Fußnoten sind im Zettelkasten **keine Müllhalde** für bibliographische Daten (das macht Pandoc automatisch am Ende). Fußnoten sind **Denk-Ebenen**.

#### 3.2.1 Syntax

| Syntax | Beschreibung |
| :--- | :--- |
| `^[Das ist eine Fußnote.]` | **Inline-Fußnote.** Wird beim Rendern automatisch nummeriert und nach unten geschoben. |
| `Text^[Erste Anmerkung.] und mehr Text^[Zweite Anmerkung.]` | **Auto-Nummerierung.** Du musst dich nicht um `[1]` oder `[2]` kümmern. |

#### 3.2.2 Die diskursive Fußnote (Best Practice)

Nutze Fußnoten für Inhalte, die den Lesefluss des Haupttextes stören würden, aber zu wichtig zum Weglassen sind ("Talmud-Prinzip").

**Beispiel:**
> Das System erzwingt Atomizität.^[Dies ist nicht unumstritten. Schmidt [@schmidt_2016] argumentiert, dass zu starke Atomisierung den Kontext zerstört. Ich folge hier jedoch Ahrens, weil...]

Das Zitat `[@schmidt_2016]` wird innerhalb der Fußnote korrekt aufgelöst und landet ebenfalls im Literaturverzeichnis.

---

### 3.3 Hybrid-Strategien: Wann was nutzen?

Die Kunst ist die Balance zwischen Lesbarkeit (Flow) und Präzision (Beleg).

#### Szenario A: Die direkte Stütze
*Ich behaupte X und hier ist der Beweis.*
👉 **Nutze Inline:** `Das Gehirn denkt in Assoziationen [@kahneman_2011].`

#### Szenario B: Der "Rabbit Hole" Verweis
*Ich behaupte X, aber es gibt dazu noch eine spannende Anekdote oder Neben-Theorie.*
👉 **Nutze Fußnote:** `Das Gehirn denkt in Assoziationen.^[Interessanterweise widerspricht das der klassischen KI-Forschung der 70er Jahre, siehe dazu [@dreyfus_1972].]`

#### Szenario C: Der akademische Streit
*A sagt X, B sagt Y, ich sage Z.*
👉 **Nutze Narrative Zitierung im Text:** `@freud_1900 sah Träume als Wünsche, während @jung_1934 sie als Archetypen deutete. Wir betrachten sie hier jedoch als neuronales Rauschen.`

### 3.4 Goldene Regeln für Zettel-Zitate

1.  **Sei präzise (Page Precision):** Zitiere nicht das ganze Buch `[@buch]`, wenn sich der Gedanke auf Seite 45 befindet `[@buch, p. 45]`. Ein Zettel ist atomar, der Beleg sollte es auch sein.
2.  **Keine "Namedropping"-Ketten:** Vermeide `(siehe Müller, 2000; Meier, 2001; Schulze, 2002; ...)`, es sei denn, die *Menge* der Autoren ist das Argument. Wähle die stärkste Quelle.
3.  **Zotero ist die Wahrheit:** Der `@citekey` im Zettel muss exakt mit dem in Zotero/BetterBibTeX übereinstimmen. Ein Tippfehler (`@ahrens2017` statt `@ahrens_2017`) führt dazu, dass das Zitat im Web nicht gerendert wird.
