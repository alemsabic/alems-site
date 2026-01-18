---
cssclasses: zettelkasten
tags: [systemtheorie, organisation, weick]
aliases: []
erstellt: 2026-01-16
bearbeitet: 2026-01-17
---

# Lose Kopplung

*Verbunden, aber nicht gefesselt.*

Elemente reagieren aufeinander, bleiben aber eigenständig.[^1] Was in einem Teil passiert, pflanzt sich nicht sofort und zwangsläufig in alle anderen Teile fort. Das klingt ineffizient – ist aber der Weg, wie komplexe Systeme überleben.

Karl Weick beobachtete Schulen und stellte fest: Was der Direktor im Büro entscheidet, dringt nicht deterministisch in jedes Klassenzimmer. Der Lehrer kann experimentieren. Die Verbindung ist da, aber sie ist elastisch – wie ein Stoßdämpfer, der Rad und Karosserie verbindet, aber Erschütterungen schluckt. Ohne diese Dämpfung würde jede Unebenheit das Auto zerstören. [@weick_1976]

Weicks Rettungsinseln-Metapher zeigt das Prinzip. Du bindest mehrere Rettungsinseln locker zusammen, um eine Einheit zu bilden. Wenn eine Insel durch eine Welle schwankt, bringt sie nicht die gesamte Flotte zum Kentern. Jede Insel behält ihre eigene Dynamik; die Verbindung ist elastisch genug, um Erschütterungen zu absorbieren.

James Orton radikalisierte Weicks These: Lose Kopplung ist kein Fehler, sondern ein evolutionärer Vorteil.[^2] Lokale Teile können sich anpassen, ohne das Gesamtsystem zu gefährden. Schulen bleiben stabil, obwohl einzelne Lehrer reformieren – oder gerade deswegen. [@orton_1990]

Das Gegenteil – **Tight Coupling** (enge Kopplung) – macht Systeme fragil.[^3] Charles Perrow analysierte Unfälle in Atomkraftwerken und prägte den Begriff **Normal Accidents** (unvermeidbare Unfälle).[^4] In eng gekoppelten Systemen gibt es keinen Spielraum; kleine Fehler kaskadieren unvermeidlich zu Katastrophen. [@perrow_1984] Der **Flash Crash** vom 6. Mai 2010 zeigt dasselbe Muster: Algorithmen im Hochfrequenzhandel interagierten so eng gekoppelt, dass ein einzelner fehlerhafter Verkaufsauftrag in Millisekunden den gesamten US-Aktienmarkt um 9% abstürzen ließ.[^5] [@min_borch_2021]

Niklas Luhmann nutzte lose Kopplung in seiner Medientheorie. Sprache besteht aus losen Elementen – Wörtern, die du frei kombinieren kannst. Sätze sind strikte Kopplungen dieser Wörter – Grammatik erzwingt Struktur. Die Lockerheit des Mediums ermöglicht Variation und Kreativität; die Strenge der Form ermöglicht Bedeutung und Verstehen. Ohne lose Elemente keine Komplexität. [@luhmann_1997]

### Anknüpfungspunkte

[[Strukturelle Kopplung]] - Systeme irritieren sich, ohne einander zu determinieren – möglich durch lose Kopplung.

[[ZK Atomizität]] - Nur lose gekoppelte Gedanken lassen sich flexibel neu kombinieren.

[[SWE Single Responsibility]] - Microservices kommunizieren über APIs, können aber unabhängig deployt werden und abstürzen.

---

## Rückseite

### Bestätigung

James Orton und Karl Weick formulierten 1990 die radikale These: Lose Kopplung ist kein Fehler, sondern ein Vorteil. Sie erlaubt lokalen Teilen, sich anzupassen, ohne das Gesamtsystem zu gefährden.[^2] Schulen sind widerstandsfähig, weil Lehrer experimentieren können, ohne auf zentrale Genehmigung zu warten. Reformen von oben verpuffen oft. Innovation von unten bleibt lokal. Das System ist ineffizient koordiniert, aber robust gegen schlechte zentrale Vorgaben. [@orton_1990]

### Widerspruch

Frederick Taylor und die Scientific-Management-Bewegung sahen das Gegenteil als Ideal: maximale Standardisierung, zentrale Steuerung, enge Kopplung aller Prozesse.[^6] Aus dieser Perspektive ist lose Kopplung verschwendete Effizienz, weil Teile redundant arbeiten. Wenn Teile nicht synchronisiert sind, wie kann das System dann kohärent handeln? Tayloristen argumentieren: Ohne enge Kopplung entsteht Chaos. Lose Kopplung verhindert zentrale Kontrolle – und das ist aus ihrer Sicht ein Problem, kein Vorteil.

### Beispiel

**Software Microservices:** Netflix baut Services so, dass sie über APIs kommunizieren – das ist die Kopplung. Aber jeder Service kann unabhängig deployt werden und abstürzen – das ist die Lockerheit. Ein Fehler im Empfehlungsalgorithmus reißt nicht den gesamten Streaming-Service mit. Der Nutzer kann weiterhin Videos abspielen; Empfehlungen werden später nachgeladen. Die Architektur akzeptiert partielle Ausfälle, statt auf perfekte Synchronisation zu setzen.

**Schulsystem:** Der Direktor einer Grundschule in Hamburg entscheidet, dass alle Klassen projektbasiertes Lernen einführen sollen. Lehrer A ignoriert die Anweisung und unterrichtet weiter frontal. Lehrer B experimentiert mit Projekten, scheitert, kehrt zurück. Lehrer C macht brillante Projekte und wird zur Inspiration für andere Schulen. Das System ist chaotisch – aber resilient. Schlechte Entscheidungen der Schulleitung führen nicht zum Kollaps, weil die Kopplung lose ist.

### Genealogie

Robert Glassman führte den Begriff **loose coupling** 1973 für biologische Systeme ein – Organe sind verbunden, aber autonom. Karl Weick übertrug ihn 1976 auf Organisationen, insbesondere Bildungseinrichtungen. [@weick_1976] Der Begriff wurde zur Grundlage der Organisationsforschung für Systeme, die man nicht von oben durchsteuern kann. Orton und Weick erweiterten 1990 die Theorie und zeigten: Lose Kopplung ist kein Defizit, sondern Voraussetzung dafür, dass Systeme sich anpassen können. [@orton_1990]

### Vertiefung

Niklas Luhmann integriert lose Kopplung in seine Theorie der Formbildung. Ein **Medium** besteht aus losen Elementen, die nur schwach aneinander gekoppelt sind – Luft aus Molekülen, Sprache aus Wörtern. Eine **Form** entsteht, wenn diese Elemente strikt gekoppelt werden – Schallwellen in Luft, Sätze aus Wörtern. Dass das Medium locker ist, ermöglicht unendliche Variation; dass die Form streng ist, ermöglicht Wiederholung und Bedeutung. Ohne lose Elemente kann nichts Neues entstehen. Ohne strikte Formen kann nichts verstanden werden. Lose Kopplung ist die Bedingung für Komplexität. [@luhmann_1997]

---

[^1]: **Lose Kopplung** (engl. *loose coupling*): Elemente eines Systems sind verbunden, bewahren aber ihre Eigenständigkeit. Ereignisse in einem Teil beeinflussen andere Teile, aber nicht zwangsläufig oder sofort. Gegenteil: **Tight Coupling** – enge Kopplung. Hier pflanzen sich Ereignisse deterministisch und sofort fort.

[^2]: "Loose coupling allows some portions of an organization to persist while others change." [@orton_1990, p. 205]

[^3]: **Tight Coupling** (enge Kopplung): Elemente eines Systems sind so eng verbunden, dass eine Änderung in einem Teil sofort und zwangsläufig alle anderen Teile beeinflusst. Kein Spielraum für Fehler.

[^4]: **Normal Accidents** (unvermeidbare Unfälle): Charles Perrows Begriff für Katastrophen, die nicht durch menschliches Versagen, sondern durch die Struktur des Systems selbst verursacht werden. In eng gekoppelten, komplexen Systemen – Atomkraftwerke, Chemieanlagen – sind Unfälle statistisch unvermeidbar. [@perrow_1984]

[^5]: **Flash Crash**: Am 6. Mai 2010 stürzte der US-Aktienmarkt innerhalb von Minuten um 9% ab und erholte sich ebenso schnell. Ursache: Ein einzelner großer Verkaufsauftrag löste eine Kettenreaktion unter Hochfrequenzhandelsalgorithmen aus. Die Algorithmen waren so eng gekoppelt, dass sie sich gegenseitig in eine Panik-Spirale trieben. [@min_borch_2021]

[^6]: **Frederick Taylor** (1856–1915): Ingenieur und Begründer des Scientific Management. Taylor glaubte: Jede Arbeit lässt sich in optimale Einzelschritte zerlegen, die zentral geplant und strikt durchgesetzt werden müssen. Seine Vision war maximale Effizienz durch enge Kopplung – das Gegenteil von Weicks lose gekoppelten Organisationen.
