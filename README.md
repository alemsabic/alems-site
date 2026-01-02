# alems-site (Presentation)

Dies ist die **Quartz v4 Engine** für [ale.ms](https://ale.ms).
Hier liegen Layouts, Styles (SCSS) und Konfigurationen.

## Architektur im Überblick

| Bereich | Repository | Beschreibung |
| :--- | :--- | :--- |
| **Presentation** (Hier) | [alems-site](https://github.com/alemsabic/alems-site) | Tech Stack, Quartz Config, Design. |
| **Content** | [alems-notizen](https://github.com/alemsabic/alems-notizen) | Markdown-Inhalte (werden hierher synchronisiert). |
| **Factory** | [zettel-fabrik](https://github.com/alemsabic/zettel-fabrik) | *Privat*. Entwicklungsumgebung für Inhalte. |

## Quick Start (Dev)

```bash
npx quartz build --serve
```

⚠️ **Wichtig:** Inhalte werden **nicht** hier bearbeitet, sondern im [Content-Repo](https://github.com/alemsabic/alems-notizen).
