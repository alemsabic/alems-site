---
cssclasses: zettelkasten
tags: [systemtheorie, autopoiesis]
aliases: []
erstellt: 2026-01-16
bearbeitet: 2026-01-17
---

# Operationale Geschlossenheit

*Selbstbezug schafft Weltbezug.*

Operationale Geschlossenheit klingt nach Isolation. Ist aber das Gegenteil. Ein System – eine Zelle, ein Bewusstsein, ein Zettelkasten – besitzt keine "Türen", durch die Informationen unverändert hineinspazieren könnten. Es operiert ausschließlich innerhalb seiner eigenen Grenzen und mit seinen eigenen Elementen. Nur so kann es überhaupt zwischen System und Umwelt unterscheiden.[^1] [@luhmann_1984]

Ein **autopoietisches System** erzeugt seine Operationen ausschließlich aus dem Netzwerk seiner eigenen Operationen.[^2] [@varela_1979] Die Umwelt kann nicht direkt durchgreifen. Jede äußere Einwirkung übersetzt das System intern als "Irritation" und verarbeitet sie nach eigenen Regeln. Dass es geschlossen ist, ermöglicht paradoxerweise, dass es offen sein kann: Nur weil das System stabil intern strukturiert ist, kann es überhaupt Informationen generieren.

Das Gehirn operiert in einer "Dunkelkammer". Es sieht kein Licht; es verarbeitet nur neuronale Impulse, die durch Licht auf der Netzhaut ausgelöst wurden. Weil es diese Impulse nach stabilen eigenen Regeln verarbeitet, kann es eine kohärente "Welt" erzeugen. Wäre es offen, würde der Input die Struktur zerstören.

Auch der Zettelkasten ist operational geschlossen. Er "versteht" keine Bücher. Er kann nur Zettel verarbeiten, die an andere Zettel anschließen. Externe Information ist nur dann relevant, wenn sie intern verlinkbar ist. [@luhmann_1981] Ohne diesen internen Resonanzboden bleibt jeder externe Input bloßes Rauschen.

In der Informatik kennt man das als **Encapsulation** (Kapselung):[^3] Ein Objekt verbirgt seinen internen Zustand und interagiert nur über definierte Schnittstellen. Die interne Logik bleibt von außen unzugänglich und damit stabil.

### Anknüpfungspunkte

[[Unterschied Autopoiesis Allopoiesis]] - Geschlossenheit ist das Merkmal autopoietischer Systeme.

[[Strukturelle Kopplung]] - Der Mechanismus, der trotz Geschlossenheit koordiniert.

[[ZK Emergenz]] - Zettel vernetzen sich intern und ordnen sich ohne externen Plan.

---

## Rückseite

### Bestätigung

Humberto Maturana betont: Kognition ist kein "Abbilden" einer objektiven Welt, sondern ein "Hervorbringen" – **enactment** – einer Welt durch das geschlossene Operieren des Lebewesens.[^4] "Living systems are cognitive systems, and living as a process is a process of cognition."[^5] Das Nervensystem repräsentiert nicht die Außenwelt; es erzeugt eine Welt durch rekursive interne Operationen. [@maturana_1980, p. 13]

### Widerspruch

Hilary Putnam und John Searle werfen der Theorie Solipsismus vor: Wenn alles hausgemacht ist, gibt es dann eine Außenwelt?[^6] Heinz von Foerster entgegnet: Die Außenwelt ist der Anstoß (Irritation), aber ihre Bedeutung konstruiert das System intern. Du erfindest die Welt nicht, aber du errechnest sie. Die Realität entsteht durch **Eigenwerte** – stabile Resultate rekursiver Operationen.[^7] [@foerster_1981] Das System stabilisiert sich selbst, indem es wiederholt dieselben Muster erzeugt.

### Beispiel

**Das Immunsystem:** Es galt lange als Armee, die Eindringlinge erkennt. Francisco Varela zeigte 1994: Es ist ein geschlossenes Netzwerk, das primär mit sich selbst interagiert. Viren sind nur **Perturbationen** – Störungen –, die das interne Gleichgewicht irritieren.[^8] Das System definiert selbst, was "Selbst" und "Nicht-Selbst" ist. Es reagiert nicht auf "fremde Antigene", sondern auf Abweichungen von seiner eigenen Norm. [@varela_1994]

**Encapsulation in Software:** Ein Objekt verbirgt seinen internen Zustand (`private`) und erlaubt Interaktion nur über definierte Schnittstellen (`public`). Die interne Logik bleibt von außen unzugänglich. Änderungen innen brechen nichts außen. Du kannst die Implementation ändern, ohne die API zu ändern. Das ist operative Geschlossenheit im Code.

### Genealogie

Francisco Varela definierte den Begriff 1979 in "Principles of Biological Autonomy" für biologische Netzwerke. [@varela_1979] Niklas Luhmann transferierte ihn auf soziale Systeme: Kommunikation schließt nur an Kommunikation an, nicht an Gedanken. "A social system comes into being whenever the connectivity of communication becomes an autonomous dynamic."[^9] [@luhmann_1984]

### Vertiefung

Luhmann radikalisiert den Begriff für soziale Systeme: "Kommunikation kann nur an Kommunikation anschließen, nicht an Bewusstsein oder chemische Prozesse." [@luhmann_1984] Soziale Systeme sind operational geschlossen; sie erzeugen ihre eigenen Elemente aus sich selbst. Bewusstsein ist Umwelt für Kommunikation, nicht Teil von ihr. Du denkst einen Gedanken; aber dieser Gedanke ist nicht die Kommunikation. Die Kommunikation entsteht erst, wenn jemand etwas mitteilt, jemand es wahrnimmt, und diese Differenz verstanden wird. Der Gedanke ist nur Irritation für die Kommunikation.

---

[^1]: **Operationale Geschlossenheit**: Ein System operiert ausschließlich mit eigenen Elementen und nach eigenen Regeln. Keine Operation kommt von außen ins System; alle Operationen entstehen aus Operationen des Systems selbst. Paradoxerweise ermöglicht diese Geschlossenheit Offenheit: Nur weil das System stabil ist, kann es überhaupt zwischen innen und außen unterscheiden.

[^2]: **Autopoietisches System** (griech. *autos* = selbst, *poiein* = machen): Ein System, das sich selbst erzeugt und reproduziert. Es operiert geschlossen – alle Operationen entstehen aus Operationen des Systems selbst. Beispiel: Das Bewusstsein produziert Gedanken aus Gedanken; Kommunikation produziert Kommunikation aus Kommunikation. [@varela_1979]

[^3]: **Encapsulation** (Kapselung, von lat. *capsula* = kleine Büchse): Ein Objekt-orientiertes Programmierprinzip. Der interne Zustand eines Objekts ist `private` (verborgen); Interaktion erfolgt nur über `public` Methoden (Schnittstellen). Ändert sich die interne Logik, bleibt die externe API stabil. Operative Geschlossenheit im Code.

[^4]: **Enactment** (Hervorbringen): Maturanas Begriff dafür, dass Organismen ihre Welt nicht abbilden, sondern durch ihre Operationen erzeugen. Das Nervensystem repräsentiert nicht die Außenwelt; es bringt eine Welt hervor, indem es rekursiv operiert. [@maturana_1980]

[^5]: Originalzitat: "Living systems are cognitive systems, and living as a process is a process of cognition." [@maturana_1980, p. 13]

[^6]: **Solipsismus** (lat. *solus* = allein, *ipse* = selbst): Die philosophische Position, dass nur das eigene Bewusstsein existiert. Putnam und Searle werfen Maturana vor: Wenn das Nervensystem die Welt "errechnet" statt abbildet, woher wissen wir, dass es eine Außenwelt gibt?

[^7]: **Eigenwerte** (engl. *eigenvalues*): Heinz von Foersters Begriff für stabile Resultate rekursiver Operationen. Das System wendet dieselbe Operation wiederholt an; nach einigen Iterationen entsteht ein stabiler Wert – ein Eigenwert. Beispiel: Wenn du wiederholt die Quadratwurzel von 2 ziehst und das Ergebnis wieder quadrierst, stabilisiert sich der Wert bei 1. Das System erzeugt seine eigene Stabilität durch Rekursion. [@foerster_1981]

[^8]: **Perturbationen** (lat. *perturbare* = durcheinanderbringen): Störungen, die das interne Gleichgewicht eines Systems irritieren. Varela: Viren sind keine "Eindringlinge", die das Immunsystem "erkennt". Sie sind Perturbationen, die das geschlossene Netzwerk des Immunsystems stören. Das System reagiert nicht auf das Virus selbst, sondern auf die Abweichung von seiner eigenen Norm. [@varela_1994]

[^9]: Originalzitat: "A social system comes into being whenever the connectivity of communication becomes an autonomous dynamic." [@luhmann_1984]
