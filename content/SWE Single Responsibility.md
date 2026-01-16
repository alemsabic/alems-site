---
cssclasses: zettelkasten
tags: [SWE, prinzipien, zettelkasten]
aliases: []
erstellt: 2026-01-16
bearbeitet: 2026-01-16
---

# SWE Single Responsibility

*Trenne, was nicht zusammen gehört.*

**Ein Modul (oder Zettel) sollte nur einen einzigen Grund haben, sich zu ändern.**

In der Softwareentwicklung ist das "Single Responsibility Principle" (SRP) eines der wichtigsten Gesetze für sauberen Code. Robert C. Martin formulierte es so: "A class should have one, and only one, reason to change." [@martin_2003]

Warum? Wenn eine Komponente X und Y erledigt (z.B. Drucken und Berechnen), muss ich sie anfassen, wenn sich das Druckformat ändert – und riskiere dabei, die Berechnung zu zerstören. "Gather together the things that change for the same reasons. Separate those things that change for different reasons." [@martin_2003]

Das Prinzip gilt isomorph für den Zettelkasten. Behandelt ein Zettel "Luhmanns Biografie" und "Luhmanns Theorie", hat er zwei Gründe zur Änderung. Finde ich neue Details zur Biografie, muss ich den Theorie-Text anfassen. Will ich die Theorie woanders verlinken, schleppe ich unnötigen Ballast (Biografie) mit.

Die Lösung ist radikale Trennung: Ein Zettel für die Biografie, einer für die Theorie, verbunden durch einen Link. So bleiben beide Teile unabhängig wartbar und wiederverwendbar.

Ein Schweizer Taschenmesser kann alles ein bisschen. Ein Skalpell kann nur schneiden – aber das perfekt. Das ist der Unterschied zwischen einem Modul mit 5 Verantwortungen und einem Modul mit einer einzigen.

### Anknüpfungspunkte

[[ZK Atomizität]] - SRP ist die theoretische Begründung für atomare Notizen.

[[ZK Konnektivität]] - Wer trennt (SRP), muss verbinden (Konnektivität).

[[Lose Kopplung]] - SRP trennt Verantwortungen; Lose Kopplung trennt Abhängigkeiten.

---

## Rückseite

### Bestätigung

Die Idee entspricht dem Prinzip von **High Cohesion** (hoher innerer Zusammenhalt) und **Low Coupling** (geringe Abhängigkeit). Was zusammengehört, bleibt zusammen; alles andere wird ausgelagert. Software Engineering Prinzip: Module sollen einen klaren Fokus haben.

Die **Unix-Philosophie** demonstriert SRP in Reinform: "Make each program do one thing well." [@mcilroy_1978] `grep` sucht nur Text, `sort` sortiert nur. Wenn ich suchen und sortieren will, baue ich kein riesiges Programm, sondern verbinde beide mit einer Pipe (`|`).

### Widerspruch

Kritiker warnen vor "Ravioli Code": Wenn man alles in winzige Schnipsel zerlegt, verliert man den Überblick über das Ganze. Zu viele kleine Klassen führen zu Fragmentierung und schwer verständlichem Kontrollfluss. Im Zettelkasten löst man das durch Strukturzettel (Hubs), die die Teile wieder zusammenführen, ohne sie zu verschmelzen.

### Beispiel

**Zettelkasten-Transfer:** Ein Zettel, der "Luhmanns Biografie und seine Systemtheorie" erklärt, hat zwei Gründe sich zu ändern. Trenne Biografie und Theorie. Verlinke sie. Jetzt kann ich die Biografie erweitern, ohne die Theorie anzufassen, und die Theorie in anderen Kontexten wiederverwenden.

**Unix-Tools:** `grep` sucht, `sort` sortiert, `uniq` entfernt Duplikate. Jedes Tool hat eine einzige Verantwortung. Komplexe Operationen entstehen durch Kombination (`grep | sort | uniq`), nicht durch Monolithen.

### Genealogie

Der Urvater des Prinzips ist David Parnas. In seinem Paper von 1972 ("On the criteria to be used in decomposing systems into modules") beschrieb er **Information Hiding**: Ein Modul sollte ein "Geheimnis" (eine Design-Entscheidung) vor anderen verbergen. [@parnas_1972] SRP ist die moderne Anwendung dieses Denkens.

### Vertiefung

Ein noch allgemeineres Konzept ist **Separation of Concerns** (SoC), geprägt von Edsger W. Dijkstra. Es besagt, dass man verschiedene Aspekte eines Problems (z.B. Logik vs. Darstellung) strikt trennen muss, um sie intellektuell beherrschbar zu machen. [@dijkstra_1974] SRP ist SoC auf Modul-Ebene.

---
