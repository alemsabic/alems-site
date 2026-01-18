---
cssclasses: zettelkasten
tags: [SWE, prinzipien, zettelkasten]
aliases: []
erstellt: 2026-01-16
bearbeitet: 2026-01-17
---

# SWE Single Responsibility

*Trenne, was getrennt gehört.*

In der Softwareentwicklung ist das *Single Responsibility Principle* (SRP) Gesetz. Robert C. Martin formuliert es so: Eine Klasse sollte einen und nur einen Grund haben, sich zu ändern.[^2] [@martin_2003]

Wenn eine Komponente Drucken und Berechnen erledigt, musst du sie anfassen, wenn sich das Druckformat ändert. Du riskierst dabei, dass du das Berechnen zerstörst. Martin schreibt: Sammle zusammen, was sich aus denselben Gründen ändert. Trenne, was sich aus verschiedenen Gründen ändert.[^3] [@martin_2003]

Das Prinzip gilt isomorph für den Zettelkasten. Wenn ein Zettel "Luhmanns Biografie" und "Luhmanns Theorie" behandelt, hat er zwei Gründe zur Änderung. Findest du neue Details zur Biografie, musst du den Theorie-Text anfassen. Willst du die Theorie verlinken, schleppst du unnötigen Ballast mit.

Die Lösung ist radikale Trennung. Ein Zettel für die Biografie, einer für die Theorie, verbunden durch einen Link. So bleiben beide Teile unabhängig wartbar.

### Anknüpfungspunkte

[[ZK Atomizität]] - SRP ist die technische Begründung für Atomizität.
[[ZK Konnektivität]] - Wer trennt, muss verbinden.
[[Lose Kopplung]] - SRP trennt Verantwortungen; lose Kopplung trennt Abhängigkeiten.

---

## Rückseite

### Bestätigung
Die *Unixphilosophie* demonstriert SRP in Reinform. "Make each program do one thing well."[^5] [@mcilroy_1978] `grep` sucht nur Text, `sort` sortiert nur. Wenn du suchen und sortieren willst, baust du kein riesiges Programm. Du verbindest beide mit einer Pipe (`|`).

### Widerspruch
Kritiker warnen vor "Ravioli Code". Wenn du alles in winzige Schnipsel zerlegst, verlierst du den Überblick. Zu viele kleine Klassen führen zu Fragmentierung; der *Kontrollfluss* wird schwer nachvollziehbar.[^6] Im Zettelkasten löst du das durch Strukturzettel (Hubs), die die Teile wieder zusammenführen.

### Beispiel
**Unix Tools:** `grep` sucht, `sort` sortiert, `uniq` entfernt Duplikate. Jedes Tool hat eine einzige Verantwortung. Komplexe Operationen entstehen durch Kombination (`grep | sort | uniq`). Sie entstehen niemals durch Monolithen.

### Genealogie
Der Urvater ist David Parnas (1972). Er beschrieb *Information Hiding* (Informationen verbergen).[^7] Ein Modul sollte ein "Geheimnis" vor anderen verbergen. [@parnas_1972] SRP ist die moderne Anwendung dieses Denkens.

### Vertiefung
Ein noch allgemeineres Konzept ist *Separation of Concerns* (SoC), geprägt von Edsger W. Dijkstra.[^8] Verschiedene Aspekte eines Problems (Logik vs. Darstellung) müssen strikt getrennt werden, um sie intellektuell beherrschbar zu machen. [@dijkstra_1974]

### Blick über den Rand
Im *Journalismus*: Ein Artikel behandelt ein Thema. Ein Kommentar behandelt die Meinung dazu. Eine Reportage behandelt das Erlebnis. Vermischt man Nachricht und Meinung, leidet die Glaubwürdigkeit. SRP schafft Klarheit in Textgattungen.

---

[^2]: Originalzitat: "A class should have one, and only one, reason to change." [@martin_2003]

[^3]: Originalzitat: "Gather together the things that change for the same reasons. Separate those things that change for different reasons." [@martin_2003]

[^5]: Originalzitat: "Make each program do one thing well." [@mcilroy_1978]

[^6]: **Kontrollfluss**: Der Weg, den ein Programm bei der Ausführung nimmt. Zu viele kleine Teile machen den Pfad unübersichtlich ("Spaghetti-Code" oder "Ravioli-Code").

[^7]: **Information Hiding**: David Parnas' Prinzip (1972). Ein Modul verbirgt seine internen Entscheidungen. Nur das Interface ist sichtbar. [@parnas_1972]

[^8]: **Separation of Concerns (SoC)**: Edsger W. Dijkstra. Verschiedene Aspekte eines Problems müssen getrennt werden. [@dijkstra_1974]
