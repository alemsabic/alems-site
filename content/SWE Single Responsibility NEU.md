---
cssclasses: zettelkasten
tags: [SWE, prinzipien, zettelkasten]
aliases: []
erstellt: 2026-01-16
bearbeitet: 2026-01-17
---

# SWE Single Responsibility

*Trenne, was getrennt gehört.*

In der Softwareentwicklung ist das **Single Responsibility Principle** (SRP) eines der wichtigsten Gesetze für sauberen Code.[^1] Robert C. Martin formulierte es so. "A class should have one, and only one, reason to change."[^2] [@martin_2003]

Warum? Wenn eine Komponente X und Y erledigt (zum Beispiel Drucken und Berechnen), muss ich sie anfassen, wenn sich das Druckformat ändert. Ich riskiere dabei, dass ich das Berechnen zerstöre. "Gather together the things that change for the same reasons. Separate those things that change for different reasons."[^3] [@martin_2003]

Das Prinzip gilt isomorph für den Zettelkasten. Behandelt ein Zettel "Luhmanns Biografie" und "Luhmanns Theorie", hat er zwei Gründe zur Änderung. Finde ich neue Details zur Biografie, muss ich den Theorie-Text anfassen. Will ich die Theorie woanders verlinken, schleppe ich unnötigen Ballast (Biografie) mit.

Löse das durch radikale Trennung. Ein Zettel für die Biografie, einer für die Theorie, verbunden durch einen Link. So bleiben beide Teile unabhängig wartbar und wiederverwendbar.

Ein Schweizer Taschenmesser kann alles ein bisschen. Ein Skalpell kann nur schneiden, aber das perfekt. Das ist der Unterschied zwischen einem Modul mit 5 Verantwortungen und einem Modul mit einer einzigen.

### Anknüpfungspunkte

[[ZK Atomizität]] - SRP begründet theoretisch, warum Notizen atomar sein müssen.

[[ZK Konnektivität]] - Wer trennt, muss verbinden.

[[Lose Kopplung]] - SRP trennt Verantwortungen, lose Kopplung trennt Abhängigkeiten.

---

## Rückseite

### Bestätigung

Die Idee entspricht dem Prinzip von **High Cohesion** (hoher innerer Zusammenhalt) und **Low Coupling** (geringe Abhängigkeit).[^4] Was zusammengehört, bleibt zusammen. Alles andere wird ausgelagert. Software Engineering Prinzip. Module sollen einen klaren Fokus haben.

Die **Unixphilosophie** demonstriert SRP in Reinform. "Make each program do one thing well."[^5] [@mcilroy_1978] `grep` sucht nur Text, `sort` sortiert nur. Wenn ich suchen und sortieren will, baue ich kein riesiges Programm. Ich verbinde beide mit einer Pipe (`|`).

### Widerspruch

Kritiker warnen vor "Ravioli Code". Wenn man alles in winzige Schnipsel zerlegt, verliert man den Überblick über das Ganze. Zu viele kleine Klassen führen zu Fragmentierung und schwer verständlichem **Kontrollfluss** (wie das Programm von Zeile zu Zeile springt).[^6] Im Zettelkasten löst man das durch Strukturzettel (Hubs), die die Teile wieder zusammenführen. Sie bleiben aber getrennt.

### Beispiel

**Zettelkasten-Transfer.** Ein Zettel, der "Luhmanns Biografie und seine Systemtheorie" erklärt, hat zwei Gründe sich zu ändern. Trenne Biografie und Theorie. Verlinke sie. Jetzt kann ich die Biografie erweitern, die Theorie bleibt unangetastet. Ich kann die Theorie in anderen Kontexten wiederverwenden.

**Unix Tools.** `grep` sucht, `sort` sortiert, `uniq` entfernt Duplikate. Jedes Tool hat eine einzige Verantwortung. Komplexe Operationen entstehen durch Kombination (`grep | sort | uniq`). Sie entstehen niemals durch Monolithen.

### Genealogie

Der Urvater des Prinzips ist David Parnas. In seinem Paper von 1972 ("On the criteria to be used in decomposing systems into modules") beschrieb er **Information Hiding** (Informationen verbergen).[^7] Ein Modul sollte ein "Geheimnis" (eine Design-Entscheidung) vor anderen verbergen. [@parnas_1972] SRP ist die moderne Anwendung dieses Denkens.

### Vertiefung

Ein noch allgemeineres Konzept ist **Separation of Concerns** (SoC, Belange trennen), geprägt von Edsger W. Dijkstra.[^8] Es besagt, dass man verschiedene Aspekte eines Problems (zum Beispiel Logik vs. Darstellung) strikt trennen muss, um sie intellektuell beherrschbar zu machen. [@dijkstra_1974] SRP ist SoC auf Modul-Ebene.

---

[^1]: **Single Responsibility Principle (SRP).** Ein Modul (oder Zettel) sollte nur einen einzigen Grund haben, sich zu ändern. Wenn eine Komponente mehrere Aufgaben erledigt, muss ich sie ändern, sobald sich eine der Aufgaben ändert. Das Risiko steigt, dass ich dabei andere Aufgaben zerstöre. [@martin_2003]

[^2]: Originalzitat. "A class should have one, and only one, reason to change." [@martin_2003]

[^3]: Originalzitat. "Gather together the things that change for the same reasons. Separate those things that change for different reasons." [@martin_2003]

[^4]: **High Cohesion** (hoher Zusammenhalt). Elemente innerhalb eines Moduls gehören eng zusammen. Sie erledigen eine gemeinsame Aufgabe. **Low Coupling** (geringe Kopplung). Module hängen wenig voneinander ab. Änderungen in einem Modul betreffen andere Module minimal. Beide zusammen erzeugen wartbaren Code.

[^5]: Originalzitat. "Make each program do one thing well." [@mcilroy_1978]

[^6]: **Kontrollfluss.** Wie ein Programm von Zeile zu Zeile springt. Wenn es zu viele kleine Klassen gibt, springt das Programm hin und her. Der Kontrollfluss wird schwer nachvollziehbar. Man verliert den Überblick.

[^7]: **Information Hiding** (Informationen verbergen). David Parnas' Prinzip (1972). Ein Modul verbirgt seine internen Entscheidungen vor anderen Modulen. Nur das Interface ist sichtbar. Ändert sich die interne Implementierung, bleiben andere Module unberührt. [@parnas_1972]

[^8]: **Separation of Concerns (SoC, Belange trennen).** Edsger W. Dijkstra prägte das Konzept. Verschiedene Aspekte eines Problems (Logik, Darstellung, Datenhaltung) müssen strikt getrennt werden. Nur so bleibt das Problem intellektuell beherrschbar. [@dijkstra_1974] SRP ist SoC auf Modul-Ebene.
