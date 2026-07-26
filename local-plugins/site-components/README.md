# site-components

Not a fork of any upstream plugin — a small local component-only plugin carrying two of
ale.ms/gpunkt.org's fully custom v4 components that have no upstream equivalent:

- **`Tagline`** — the site subtitle under the page title in the left sidebar.
- **`ContentHeader`** — date + German word count + edit-on-GitHub link below the article title on
  content pages (replaces `content-meta`'s reading-time/date line there — see the `exclude` in
  `quartz.config.yaml`'s `layout.byPageType.content`).

Registers both under one `quartz.config.yaml`-visible package (`quartz.components` manifest field
lists both), referenced from two separate plugin entries in `quartz.config.yaml` using the
object-form `source: {repo, name}` override — each entry's `name` is the kebab-case form of the
component's export name (`tagline` → `Tagline`, `content-header` → `ContentHeader`) so
`buildLayoutForEntries`'s PascalCase-fallback component lookup resolves each one independently,
letting them sit at different layout positions/priorities from a single physical plugin directory.
