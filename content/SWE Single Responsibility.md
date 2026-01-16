---
cssclasses: zettelkasten
tags: [SWE, prinzipien, zettelkasten]
aliases: [SRP, Single Responsibility Principle]
erstellt: 2026-01-16
bearbeitet: 2026-01-16
---

# SWE Single Responsibility

*Trenne, was nicht zusammen gehört.*

**Ein Modul (oder Zettel) sollte nur einen einzigen Grund haben, sich zu ändern.**

In der Softwareentwicklung ist das "Single Responsibility Principle" (SRP) eines der wichtigsten Gesetze für sauberen Code. Robert C. Martin formulierte es so: "A class should have one, and only one, reason to change."[^1]

Warum? Wenn eine Komponente X und Y erledigt (z.B. Drucken *und* Berechnen), muss ich sie anfassen, wenn sich das Druckformat ändert – und riskiere dabei, die Berechnung zu zerstören.

Das Prinzip gilt isomorph für den Zettelkasten:
-   Behandelt ein Zettel "Luhmanns Biografie" *und* "Luhmanns Theorie", hat er zwei Gründe zur Änderung.
-   Finde ich neue Details zur Biografie, muss ich den Theorie-Text anfassen.
-   Will ich die Theorie woanders verlinken, schleppe ich unnötigen Ballast (Biografie) mit.

Die Lösung ist radikale Trennung: Ein Zettel für die Biografie, einer für die Theorie, verbunden durch einen Link. So bleiben beide Teile unabhängig wartbar und wiederverwendbar.

### Anknüpfungspunkte

[[ZK Atomizität]] - SRP ist die theoretische Begründung für atomare Notizen.
[[ZK Konnektivität]] - Wer trennt (SRP), muss verbinden (Konnektivität).

---

## Rückseite

### Bestätigung
Die Idee entspricht dem Prinzip von **High Cohesion** (hoher innerer Zusammenhalt) und **Low Coupling** (geringe Abhängigkeit). Was zusammengehört, bleibt zusammen; alles andere wird ausgelagert.

### Widerspruch
Kritiker warnen vor "Ravioli Code": Wenn man alles in winzige Schnipsel zerlegt, verliert man den Überblick über das Ganze. Im Zettelkasten löst man das durch Strukturzettel (Hubs), die die Teile wieder zusammenführen, ohne sie zu verschmelzen.

### Beispiel
Die **Unix-Philosophie**: "Make each program do one thing well." `grep` sucht nur text, `sort` sortiert nur. Wenn ich suchen *und* sortieren will, baue ich kein riesiges Programm, sondern verbinde beide mit einer Pipe (`|`). Das ist SRP in Reinform. [@mcilroy_1978]

### Genealogie
Der Urvater des Prinzips ist David Parnas. In seinem Paper von 1972 ("On the criteria...") beschrieb er **Information Hiding**: Ein Modul sollte ein "Geheimnis" (eine Design-Entscheidung) vor anderen verbergen. SRP ist die moderne Anwendung dieses Denkens. [@parnas_1972]

### Vertiefung
Ein noch allgemeineres Konzept ist **Separation of Concerns** (SoC), geprägt von Edsger W. Dijkstra. Es besagt, dass man verschiedene Aspekte eines Problems (z.B. Logik vs. Darstellung) strikt trennen muss, um sie intellektuell beherrschbar zu machen. [@dijkstra_1974]

---

[^1]: Martin, R. C. (2003). *Agile Software Development*. Prentice Hall.