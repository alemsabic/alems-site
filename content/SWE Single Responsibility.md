---
cssclasses: zettelkasten
tags:
  - SWE
  - Prinzipien
aliases:
  - SRP
  - Single Responsibility Principle
---

# SWE Single Responsibility

*Trenne, was nicht zusammen gehört.*

Gather together the things that change for the same reasons. Separate those things that change for different reasons.^[@martin_2003]

In der Softwareentwicklung sollte ein Modul nur einen einzigen Grund haben, sich zu ändern.^[Robert Martin: "A class should have one, and only one, reason to change" [@martin_2008].] Das ist keine Bürokratie, sondern Pragmatik. Ein Schweizer Taschenmesser kann alles ein bisschen. Ein Skalpell kann nur schneiden – aber das perfekt.

Das Prinzip ist isomorph zur Zettelkasten-Atomizität: Eine Klasse, eine Verantwortung. Ein Zettel, ein Gedanke. Die Begründung ist dieselbe: Nur getrennte Module lassen sich unabhängig ändern, testen und wiederverwenden.^[Kritiker sagen, SRP führe zu unnötig vielen kleinen Dateien. Aber: Bessere Wartbarkeit und Wiederverwendbarkeit überwiegen den Overhead.]

### Anknüpfungspunkte

[[ZK Atomizität]] - SRP ist die theoretische Mutter der Atomizität.

[[ZK Konnektivität]] - Kleine SRP-Module benötigen Links (Dependency Injection).
