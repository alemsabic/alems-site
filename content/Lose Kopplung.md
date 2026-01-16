---
cssclasses: zettelkasten
tags: [systemtheorie, organisation, weick]
aliases: []
erstellt: 2026-01-16
bearbeitet: 2026-01-16
---

# Lose Kopplung

*Verbunden, aber nicht gefesselt.*

**Lose Kopplung bedeutet, dass Elemente miteinander verbunden sind, aber ihre Eigenständigkeit bewahren; Ereignisse in einem Teil pflanzen sich nicht deterministisch oder sofort in alle anderen Teile fort.**

In komplexen Systemen ist die Starrheit von Verbindungen oft ein Risiko, kein Sicherheitsmerkmal. Karl Weick beschrieb lose Kopplung als strukturelle Eigenschaft von Systemen, bei der Teile zwar aufeinander reagieren, aber ihre Identität und physische Trennung bewahren. [@weick_1976]

Die Rettungsinseln-Metapher zeigt das Prinzip. Mehrere Rettungsinseln sind locker zusammengebunden, um eine Einheit zu bilden. Wenn eine Insel durch eine Welle schwankt, bringt sie nicht die gesamte Flotte zum Kentern. Jede Insel behält ihre eigene Dynamik; die Verbindung ist elastisch genug, um Erschütterungen zu absorbieren.

Stoßdämpfer im Auto funktionieren nach demselben Prinzip. Sie verbinden Rad und Karosserie (Kopplung), schlucken aber Erschütterungen (Lose). Ohne sie würde jede Unebenheit das Auto zerstören. Die Kopplung ist da, aber sie ist gedämpft.

Strukturelle Kopplung als Spezialfall loser Kopplung. [@orton_1990] Ein Lehrer kann im Klassenzimmer experimentieren; die Entscheidungen des Direktors dringen nicht deterministisch in den Unterricht ein. Lose Kopplung ist Voraussetzung für Resilienz und Anpassungsfähigkeit in einer sich schnell ändernden Umwelt.

Charles Perrow identifizierte das Gegenstück – "Tight Coupling" – als Hauptursache für "Normal Accidents". In eng gekoppelten Systemen wie Atomkraftwerken kaskadieren kleine Fehler unvermeidlich zu Katastrophen, weil es keinen Spielraum ("slack") gibt. [@perrow_1984] Flash Crashs im Algorithmic Trading zeigen dasselbe Muster. Algorithmen interagieren extrem eng gekoppelt; ein einzelner Fehler destabilisiert in Millisekunden den gesamten Markt. [@min_borch_2021]

Luhmann nutzt lose Kopplung in seiner Medientheorie. Medien (z.B. Sprache) sind lose Wörter; Formen (z.B. Sätze) sind strikte Kopplungen dieser Wörter. Die Lose des Mediums ermöglicht Variation; die Striktheit der Form ermöglicht Bedeutung. [@luhmann_1997]

### Anknüpfungspunkte

[[Strukturelle Kopplung]] - Lose Kopplung ist oft die strukturelle Basis für funktionale Irritation ohne Determination.

[[ZK Atomizität]] - Nur lose gekoppelte (atomare) Gedanken lassen sich flexibel neu kombinieren.

[[SWE Single Responsibility]] - In Software-Architektur manifestiert sich lose Kopplung als Microservices: Services kommunizieren über APIs, können aber unabhängig deployt werden und abstürzen.

---

## Rückseite

### Bestätigung

Orton und Weick radikalisieren Weicks These: Lose Kopplung ist kein Fehler, sondern ein evolutionärer Vorteil. Sie erlaubt lokalen Teilen, sich anzupassen, ohne das Gesamtsystem zu gefährden. "Loose coupling allows some portions of an organization to persist while others change." [@orton_1990]

### Widerspruch

Kritiker sehen lose Kopplung als Ineffizienz durch Redundanz. Wenn Teile nicht synchronisiert sind, wie kann das System dann kohärent handeln? Standardisierung und Durchgriff sind aus dieser Perspektive Tugenden, keine Risiken. Lose Kopplung verhindert zentrale Steuerung.

### Beispiel

**Software Microservices:** Services kommunizieren über APIs (Kopplung), können aber unabhängig deployt werden und abstürzen (Lose). Ein Fehler im Zahlungsservice reißt nicht den gesamten E-Commerce-Stack mit. Der Warenkorb funktioniert weiter; die Zahlung wird später nachgeholt.

**Schulsystem:** Was der Lehrer im Klassenzimmer tut, ist nur lose gekoppelt an das, was der Direktor im Büro entscheidet. Reformen von oben verpuffen oft; Innovation von unten bleibt lokal. Das System ist ineffizient koordiniert, aber robust gegen schlechte Top-Down-Entscheidungen.

### Genealogie

Robert Glassman führte den Begriff 1973 für biologische Systeme ein. Weick übertrug ihn 1976 auf Organisationen, insbesondere Schulen. Der Begriff wurde zur Grundlage der Organisationsforschung für Systeme, die nicht hierarchisch durchsteuerbar sind.

### Vertiefung

Luhmann integriert lose Kopplung in seine Medientheorie. Medien (Sprache) bestehen aus losen Elementen (Wörtern); Formen (Sätze) sind strikte Kopplungen dieser Elemente. Die Lose ermöglicht Variation und Kreativität; die Striktheit ermöglicht Bedeutung und Verstehen. Lose Kopplung ist die Bedingung für Komplexität. [@luhmann_1997]

---
