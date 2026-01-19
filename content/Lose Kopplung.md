---
cssclasses: zettelkasten
tags: [systemtheorie, organisation, weick]
aliases: []
erstellt: 2026-01-16
bearbeitet: 2026-01-17
---

# Lose Kopplung

*Verbunden, aber nicht gefesselt.*

Elemente reagieren aufeinander, bleiben aber eigenständig. Was in einem Teil passiert, pflanzt sich nicht sofort in alle anderen Teile fort. Das klingt ineffizient – ist aber der Weg, wie komplexe Systeme überleben. Karl Weick zeigte am Beispiel von Schulen: Was der Direktor im Büro entscheidet, dringt nicht deterministisch in jedes Klassenzimmer.

Die Verbindung ist da, aber sie ist elastisch.[^1] Wie ein Stoßdämpfer, der Rad und Karosserie verbindet, aber Erschütterungen schluckt. Ohne diese Dämpfung würde jede Unebenheit das Auto zerstören [@weick_1976].

James Orton radikalisierte diese These: Lose Kopplung ist kein Fehler, sondern ein evolutionärer Vorteil.[^2] Lokale Teile können sich anpassen, ohne das Gesamtsystem zu gefährden. Das System ist ineffizient koordiniert, aber robust gegen schlechte zentrale Vorgaben.

Das Gegenteil – *Tight Coupling*, enge Kopplung – macht Systeme fragil.[^3] Charles Perrow analysierte Unfälle in Atomkraftwerken und prägte den Begriff *Normal Accidents*.[^4] In eng gekoppelten Systemen gibt es keinen Spielraum; kleine Fehler kaskadieren unvermeidlich zu Katastrophen. Der *Flash Crash* von 2010 beweist dies: Algorithmen interagierten so eng, dass ein einzelner Fehler den US-Markt in Minuten crashte.

### Anknüpfungspunkte

[[Strukturelle Kopplung]] - Systeme irritieren sich, ohne einander zu determinieren.
[[ZK Atomizität]] - Nur lose gekoppelte Gedanken lassen sich flexibel neu kombinieren.
[[SWE Single Responsibility]] - Microservices stürzen nicht komplett ab, wenn ein Teil versagt.

## Des Zettels Rückseite

### Bestätigung
Orton und Weick formulierten 1990: Lose Kopplung erlaubt Organisationen, gleichzeitig stabil und flexibel zu sein. Schulen sind widerstandsfähig, weil Lehrer experimentieren können, ohne auf Genehmigung zu warten. Reformen von oben verpuffen oft; Innovation von unten bleibt lokal. Das System opfert Effizienz für Resilienz [@orton_1990].

### Widerspruch
Frederick Taylor und das Scientific Management sahen das Gegenteil als Ideal: maximale Standardisierung und zentrale Steuerung.[^5] Aus dieser Perspektive ist lose Kopplung Verschwendung. Wenn Teile nicht synchronisiert sind, wie kann das System kohärent handeln? Tayloristen argumentieren: Ohne enge Kopplung entsteht Chaos. Lose Kopplung verhindert Kontrolle.

### Beispiel
**Rettungsinseln:** Weick nutzt die Metapher einer Flotte von Rettungsinseln, die locker zusammengebunden sind. Wenn eine Insel durch eine Welle schwankt, bringt sie nicht die gesamte Flotte zum Kentern. Die Verbindung ist elastisch genug, um Erschütterungen zu absorbieren, aber fest genug, um die Gruppe zusammenzuhalten. Wären sie starr verbunden, wie ein großes Schiff, würde die Welle das ganze Schiff brechen.

### Transfer
**Software Microservices:** Netflix baut Services so, dass sie über APIs kommunizieren – Kopplung –, aber unabhängig abstürzen können – Lose. Ein Fehler im Empfehlungsalgorithmus reißt nicht den gesamten Streaming-Service mit. Der Nutzer kann weiterhin Videos abspielen; Empfehlungen werden später nachgeladen. Die Architektur akzeptiert partielle Ausfälle, statt auf perfekte Synchronisation zu setzen.

### Genealogie
Robert Glassman führte den Begriff 1973 für biologische Systeme ein. Karl Weick übertrug ihn 1976 auf Organisationen. Der Begriff wurde zur Grundlage für das Verständnis von Systemen, die man nicht von oben durchsteuern kann. Orton und Weick erweiterten die Theorie 1990.

### Vertiefung
Niklas Luhmann nutzt lose Kopplung für seine Medientheorie. Ein Medium, wie Sprache, besteht aus losen Elementen, den Wörtern. Eine Form, wie ein Satz, entsteht, wenn diese Elemente strikt gekoppelt werden. Ohne die Lockerheit der Wörter gäbe es keine neuen Sätze. Ohne die Strenge der Grammatik gäbe es keine Bedeutung. Lose Kopplung ist die Bedingung für Kreativität [@luhmann_1997].

[^1]: **Lose Kopplung** – engl. *loose coupling*: Elemente sind verbunden, bewahren aber ihre Eigenständigkeit. Ereignisse in einem Teil beeinflussen andere Teile, aber nicht zwangsläufig oder sofort.

[^2]: Originalzitat: »Loose coupling allows some portions of an organization to persist while others change.« [@orton_1990, p. 205]

[^3]: **Tight Coupling** – enge Kopplung: Elemente sind so eng verbunden, dass eine Änderung in einem Teil sofort und zwangsläufig alle anderen beeinflusst.

[^4]: **Normal Accidents**: Charles Perrows Begriff für Katastrophen, die in eng gekoppelten Systemen unvermeidbar sind, weil kleine Fehler kaskadieren [@perrow_1984].

[^5]: **Frederick Taylor** (1856–1915): Begründer des Scientific Management. Ziel: Maximale Effizienz durch enge Kopplung und zentrale Planung.
