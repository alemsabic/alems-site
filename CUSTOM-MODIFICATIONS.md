# Custom Modifications

This file documents every behavior in this repo that deviates from stock Quartz — the things a
Quartz update (or a careless refactor) could silently break or delete. **Check this file before
editing any file it references, and before any future Quartz version upgrade.**

Format per entry: what the rule/mechanism is now, where it lives, and (where useful) why it exists.
Debugging narratives and rejected alternatives live in `upgrade.md` and git history, not here — this
file is the current, load-bearing truth, not the story of how we got here.

**Local-plugin fork pattern** (applies to every `local-plugins/*` entry below): each is a full clone
of the upstream `quartz-community/*` package, patched, with its own `FORK_NOTES.md` documenting the
upstream commit it was forked from and the exact patch applied — read that file before re-syncing
against a newer upstream version. **Gotcha that costs real time if forgotten**: these packages are
pre-built via `tsup` into their own `dist/`, which is what the live build actually loads. Editing
`src/**/*.tsx` or `src/**/*.ts` alone does nothing until you run `npm run build` inside that specific
`local-plugins/<name>` directory (or `npx quartz plugin install --from-config` from the repo root,
which does this for you). No error, no warning — it just silently keeps serving the old compiled
output.

---

## Footnote-reference popover suppression

**Rule**: footnote reference links (`<sup><a>`) never show Quartz's hover-preview popover — they
link to the bottom of the same page, not another page, so a preview makes no sense.

**Where**: `local-plugins/github-flavored-markdown/src/transformer.ts` — a `sup > a` →
`data-no-popover` hast-visitor wired into both `htmlPlugins()` return paths.

**Why here and not in a citations-related file**: this is a GFM/footnotes concern (remark-gfm,
which this plugin owns), not a citations concern. Bibliography-link popover suppression (`#bib-*`)
is a separate, unrelated mechanism, already built into upstream `@quartz-community/citations` —
nothing to maintain there.

## Citation tooltips (hover text on `(Author, Year)` citations)

**Rule**: hovering a citation shows the full reference as a tooltip, with HTML entities (`&amp;`
etc.) correctly decoded to plain text.

**Where, two pieces**:

1. `local-plugins/citations/src/transformer.ts` — adds `showTooltips`/`tooltipAttribute` to
   `CitationsOptions` and passes them through to `rehypeCitation`. These are real upstream
   `rehype-citation` options that the stock `@quartz-community/citations` wrapper doesn't expose
   (it hand-picks a fixed field set instead of spreading `opts`). Without this fork, no
   `data-tooltip` attribute is ever generated.
2. `local-plugins/site-scripts/src/components/scripts/tooltips.inline.ts` — client-side script that
   decodes the HTML-entity-encoded `data-tooltip` value (via the `<textarea>`-innerHTML trick) on
   every SPA navigation (`nav` event). Runs for every element with a `data-tooltip` attribute.

**German CSL locale** (a related citations concern, but _not_ a custom modification anymore):
`configuration.locale: de-DE` in `quartz.config.yaml` is enough — `@quartz-community/citations`
auto-derives the correct CSL locale XML URL from it. The old v4-era hack (constructing the locale
URL by hand) is obsolete; don't re-add it.

## SPA footnote highlighting

**Rule**: clicking a footnote reference (`[^1]`) highlights the corresponding footnote at the
bottom of the page, including across client-side (SPA) navigation, where CSS `:target` alone
doesn't fire.

**Where**: `local-plugins/site-scripts/src/components/scripts/footnotes.inline.ts` (JS logic,
unchanged from the original v4 implementation — still uses the `nav` event and `addCleanup`
lifecycle) + `quartz/styles/custom.scss`'s `.footnote-highlighted` class, paired with every
`:target` selector for footnotes (search for `.footnotes li:target` — `.footnote-highlighted` must
always accompany it, for `dictionary-entry`, `dictionary-entry-columns`, and `zettelkasten` article
types).

**How it's wired into the page**: `local-plugins/site-scripts` is a standalone component-only
plugin (`SiteScripts.tsx`, renders nothing) whose sole job is carrying both this script and
`tooltips.inline.ts` on its `afterDOMLoaded`. Placed anywhere in the layout (`afterBody`, priority 90) — Quartz's `componentResources.ts` collects `afterDOMLoaded` from every component used on a
page regardless of position.

## `shortTitle` support (short labels for long Zotero titles)

**Problem it solves**: Zotero-imported sources have very long titles (e.g. "Das
Zettelkasten-Prinzip: erfolgreich wissenschaftlich Schreiben und Studieren..."). Without this
feature the same 100+ character string would appear 4× per page (Explorer, Breadcrumbs,
ContentHeader, H1) — `shortTitle` frontmatter lets Explorer/Breadcrumbs show a short form (e.g.
"Ahrens (2017)") while the H1 keeps the real full title.

**Rule**: add `shortTitle: "Ahrens (2017)"` to a note's frontmatter. Falls back to the full title
automatically if omitted — safe for every non-Zotero note.

**Where — 5 pieces, not 4** (a real gap found during the v5 migration; don't skip the 5th on a
future replay):

1. `quartz/util/fileTrie.ts` (core, direct edit) — `FileTrieData.shortTitle`, `displayName` getter
   fallback. Powers server-rendered Breadcrumbs.
2. `quartz/util/ctx.ts` (core, direct edit) — `BuildTimeTrieData.shortTitle`, extracted in
   `trieFromAllFiles()`.
3. `local-plugins/content-index/src/emitter.ts` — adds `shortTitle` to `ContentDetails`, threaded
   into `contentIndex.json`.
4. `local-plugins/explorer/src/components/scripts/explorer.inline.ts` — Explorer fetches
   `contentIndex.json` client-side and rebuilds its own trie in the browser with a **duplicate**
   `FileTrieNode` class, separate from the server-side one in `fileTrie.ts`. Its `displayName`
   getter needs the identical `shortTitle` fallback, or the sidebar shows the full title while
   Breadcrumbs correctly shows the short one. Found only by looking at the actual rendered sidebar,
   not by reading source — the divergence is invisible in any static check.
5. `local-plugins/site-index/src/util/entries.ts`'s `resolveDisplayTitle` — the homepage phone-book
   index (see the Site Index entry below) builds its own list straight from `allFiles`, independent
   of both the server-side `fileTrie.ts` trie and Explorer's client-side rebuild, so it needs its
   own copy of the same `shortTitle` → `title` → last slug segment precedence.

**Also**: `local-plugins/content-meta`'s title display is unrelated and already excluded on content
pages (see `quartz.config.yaml`'s `layout.byPageType.content.exclude` — `article-title` renders the
one real H1, `content-meta` is excluded to avoid a second, redundant title line via
`ContentHeader`).

## Custom components: Tagline, ContentHeader

**Where**: `local-plugins/site-components/` — one physical plugin package holding two named
components (`Tagline`, `ContentHeader`), referenced from `quartz.config.yaml` as two separate
plugin entries via the object-form `source: {repo, name}` override (`name: tagline` /
`name: content-header`), so they can sit at different layout positions from one package.

**Tagline**: text fully configurable via `quartz.config.yaml`'s `tagline` entry
(`options.linkText`/`linkUrl`/`text`) — not hardcoded JSX. CSS lives in `custom.scss`'s `.tagline`
block (not component-embedded `Component.css`, for consistency with the rest of the site's styling
convention).

**ContentHeader**: shows Datum (German `DD.MM.YYYY`, own inline `formatDate`, no trailing period),
Schlagwörter (tags), and a GitHub edit-on-`alems-notizen` link. Deliberately does **not** show the
title (redundant with the H1) or Textlänge/word count (dropped by request). Positioned `beforeBody`,
priority 10, directly below Breadcrumbs.

**Footer**: `local-plugins/footer` replaces the stock "Created with Quartz" line with the site's
real personal links (Alem Šabić © + X/Twitter).

## RecentNotes ("Zuletzt bearbeitet", index-page footer)

**Where**: `local-plugins/recent-notes`. Three baked-in behaviors (not exposed as YAML options,
since none of them map to a YAML-expressible callback):

- Renders only on the index page (`if (fileData.slug !== "index") return null`) — chosen over a
  `quartz.ts` `ConditionalRender` override because `loadQuartzLayout()`'s per-pageType merge is a
  whole-array replace, not an append, which would make a TS override fragile against future YAML
  `afterBody` changes.
- No per-item date display.
- `.filter(p => p.slug !== "index")` baked in (can't be expressed via YAML options).
- Section title text: "Zuletzt bearbeitet" (`src/i18n/locales/de-DE.ts`).

**Styling** (`custom.scss`): `.recent-notes li.recent-li { margin-top: 0; margin-bottom: 0; }`
overrides the fork's own `recentNotes.scss` (which sets `margin: 1rem 0` on `& > li`, adding an
uncancelled top gap v4 never had). `.recent-notes > h3` is sized identically to the site's H1
(`1.75rem` / `3rem` at `min-width: 800px`) — scoped to the section title only, not the per-entry
`<h3>` inside each list item.

## Homepage (index page) layout

**Where**: `local-plugins/site-index/`, `local-plugins/graph/`, the `is-index` condition in
`quartz.ts`, and `quartz/styles/custom.scss`'s `body[data-slug="index"]` block.

**Site Index**: `local-plugins/site-index` is a new component-only plugin (no upstream, same
pattern as `local-plugins/site-components`) — an alphabetical "phone book" index of every published
note, homepage-only, German-aware sorting (see the `shortTitle` entry above for its `resolveDisplayTitle`
duplication), server-rendered directly from `allFiles` at build time, no client-side JS.

**Graph fork**: `local-plugins/graph` is a fork of `@quartz-community/graph`, same fork pattern as
`local-plugins/explorer`/`local-plugins/citations` — a single-locale-string patch ("Graphansicht" →
"Graph"). See its own `FORK_NOTES.md` for the upstream commit and exact patch.

**`is-index` layout condition**: registered in `quartz.ts` via `registerCondition("is-index", ...)`
— the same extensibility mechanism the built-in `not-index` condition already used, just a second
named condition rather than a one-off special case. Used in `quartz.config.yaml`'s layout to gate
which components render on the homepage vs. everywhere else.

**Homepage CSS**: `quartz/styles/custom.scss`'s `body[data-slug="index"]` block gives the homepage
its own single-column layout — no sidebars, a hero (Title + Tagline + prominent Search), an
always-expanded Graph, and the Site Index's "phone book" breakout — instead of reusing the
three-column layout every other page gets. Search that block for the specifics rather than assuming
any other page's CSS applies here.

One shared width, not narrow-then-wide: the hero (Title/Tagline/Search) is the only section that
stays capped at a compact 46rem, left-aligned instead of centered. Everything below it — Recent
Notes, Graph, and the Site Index — shares one `.page-footer` CSS Grid at the page's full container
width, with column counts mirroring the Site Index's own breakpoints exactly (3 columns desktop, 2
tablet, 1 mobile) so Recent Notes/Graph's column split always lines up with the Site Index's columns
beneath them. Recent Notes sits left (1 column), Graph right (2 columns at desktop, 1 — an even
50/50 — at tablet), via CSS `order` rather than DOM order (Graph actually renders first in the DOM,
per its lower `afterBody` priority in `quartz.config.yaml`). See
`docs/superpowers/specs/2026-07-28-index-page-width-unification-design.md` and its accompanying plan
for the full rationale, including a documented CSS cascade-order hazard (a responsive override nested
inside a media query can silently lose to an unconditional rule declared later in the file) worth
knowing before touching this block again.

## Tag/folder listing pages

**Where**: `local-plugins/tag-page`, `local-plugins/folder-page`. Both got the same patch: the
per-item date column removed (`PageList.tsx`, each plugin bundles its own private copy — the core
`quartz/components/PageList.tsx` is dead code, nothing imports it) and the matching CSS grid fixed
from the stock 3-column layout (`fit-content(8em) 3fr 1fr`, sized for a date column) to
`grid-template-columns: 1fr auto`.

**German terminology**: `tag-page`'s `src/i18n/locales/de-DE.ts` — "Tag"/"Tags" → "Schlagwort"/
"Schlagwörter".

**Giscus comments excluded** on `tag`, `folder`, `canvas`, `bases` page types (
`quartz.config.yaml`'s `layout.byPageType`) — a comment thread makes no sense on a generated
listing/tool page. **Gotcha**: `exclude:` entries targeting a plain `@scope/name` npm package
(not a `./local-plugins/...` source) need the **full source string**
(`"@quartz-community/comments"`), not the short display name — `config-loader.ts`'s
`extractPluginName()` only strips local-plugin and `github:`/`git+`/`https:` sources, so a bare
`comments` entry silently no-ops. Same gotcha applies to any other by-name `exclude:`.

## OG image title/suffix separator

**Where**: `local-plugins/og-image` — same conditional `" - "` separator fix as core `Head.tsx`
(only inserted when `pageTitleSuffix` is non-empty). A stock v5 bug, not something we introduced;
caught while re-testing `CustomOgImages` after it had been disabled since a Sept-2025 Satori
font-rendering bug (now fixed upstream).

## `Date.tsx` / `Head.tsx` (core, direct edits)

- `Date.tsx`: hardcoded `DD.MM.YYYY` format, ignores `locale`.
- `Head.tsx`: `" - "` separator between title and `pageTitleSuffix`, only when the suffix is
  non-empty.

## Dark-mode color (single source of truth)

**Rule**: the dark-mode background color (`var(--light)` in dark mode — yes, confusingly named,
it's the CSS variable both themes share) is set **once**, in `quartz.config.yaml`:
`configuration.theme.colors.darkMode.light: "#09002b"` (deep purple). Every surface that uses
`var(--light)` — mobile explorer sticky header, mobile full-screen explorer menu, Search modal,
Graph modal, `popover.scss`'s link-preview card, the site body — picks it up automatically.

**Don't** re-add a hardcoded `[saved-theme="dark"] body { background-color: ... !important; }`
override in `custom.scss` to patch just the body — that masks the root config value being wrong
instead of fixing it, and leaves every other surface still wrong.

**Giscus is a separate, second fix**: the comment widget is themed by a static CSS file fetched by
the iframe from `themeUrl` (`quartz/static/giscus/dark.css`), not by the page's CSS variables.
`--bg` there must be kept in sync with the config value above by hand (currently also `#09002b`).
**Important operational fact**: this file is fetched from the literal **production** domain
(`https://ale.ms/static/giscus`, see `quartz.config.yaml`'s `themeUrl`), regardless of which
build/environment is rendering the surrounding page — a change here is invisible on any preview
deploy or `localhost`, correct or not, until it's actually live in production.

## Search button styling

**Where**: `custom.scss`, `.search > .search-button` + `.search > .search-button > p` rules.
`@quartz-community/search`'s own bundled CSS differs from what this site wants (transparent
background + visible border vs. a subtle tinted fill with no border; icon-before-text DOM order vs.
text-before-icon). Fixed entirely in `custom.scss` — no plugin fork needed. The DOM-order mismatch
is fixed via CSS `order` properties (`svg { order: 2 }` / `p { order: 1 }`), since `order` only
affects visual order, not the underlying DOM the plugin actually emits.

## `@quartz-community/quartz-fonts` — disabled, don't re-enable without options

**Rule**: this plugin is `enabled: false` in `quartz.config.yaml`. It ships its own hardcoded font
defaults (Schibsted Grotesk/Source Sans Pro/IBM Plex Mono) in a separate CSS `@layer` that — per
CSS Cascade Layers rules — wins over `configuration.theme.typography`'s `@layer` unless given
matching `options: {title, header, body, code}`. Nothing on this site reads the Obsidian-style
bridge variables (`--font-text` etc.) it exists to provide; `index.css`'s own `quartz-base` layer
already defines equivalent aliases pointing at the real configured fonts. If re-enabling it for any
future reason, it must be given explicit matching `options:`, or the fonts will silently revert.

## Zotero content conventions

These aren't code, but conventions the Zotero import template (
`/Users/alemsabic/Desktop/MEMEX/_templates/Zotero-Vorlage.md`) must follow for the site to render
correctly:

- **Image paths**: use relative Wikilinks, `![[filename.png]]` — not `![[NOTIZEN/.../filename.png]]`
  or any absolute-from-vault-root path. Quartz resolves relative Wikilink image paths correctly;
  an absolute-looking path that doesn't match the synced `content/` structure 404s silently.
- **Highlight colors**: all 8 Zotero highlight colors (yellow/orange/red/green/blue/purple/magenta/
  gray) have matching CSS in `custom.scss` (`mark.hltr-*` classes) — light theme ~50% opacity, dark
  theme ~40%, no text-shadow, white text on the darker highlight colors for contrast.
- **`literature-note` design system** (`cssclasses: literature-note` in frontmatter): implemented in
  `custom.scss` (search `article.literature-note`). Highlights are numbered with **lowercase
  letters** (`a.`, `b.`, `c.`, via `counter(section, lower-alpha)`) — an original planning doc
  mentioned Roman numerals (`§ I`/`§ II`); the shipped implementation uses letters. Figure captions
  use `Abb. 1`/`Abb. 2` (`counter(figure)`) as originally planned. Treat the actual CSS as the
  source of truth over any historical design sketch.
- **Book-cover effect**: skeuomorphic 3D hardcover CSS on Zotero book covers, `custom.scss`. Gradient
  technique adapted from Varun Dhawan's blog post (
  https://varundhawan.com/blog/2022/01/18/skeuomorphic-book-cover-css) — key trick: the gradient
  goes on the `.book-cover-container` wrapper `<div>`, not the `<img>` itself, since `<img>`
  elements don't support pseudo-elements.

## Stock v5 behavior we depend on (not something we built — verify after any Quartz upgrade)

**URL case-sensitivity changed between v4 and v5.** v4 preserved file/folder casing fairly directly
in URLs (this site's old, pre-migration URLs used `/Literatur/...`, capital L). **v5 forcibly
lowercases every path segment** as part of slug generation (`@quartz-community/utils`'s
`slugifyFilePath`, confirmed in its actual source — not just documented behavior). This is a real
breaking change for any external link, bookmark, or search-engine-indexed URL that assumed the old
casing.

**The mitigation, already enabled and verified working**: `@quartz-community/alias-redirects`
(`quartz.config.yaml`, `enabled: true`, default `enableCaseRedirects: true` — never explicitly
touched, just inherited from the `npx quartz create` scaffold). It emits a real static HTML page at
every old-cased URL, containing `<meta http-equiv="refresh">` to the canonical lowercase URL plus
`<link rel="canonical">` and `<meta name="robots" content="noindex">` (so search engines re-index
the new URL instead of treating the redirect page as a duplicate). Works without JavaScript.
Verified live 2026-07-27: `curl https://ale.ms/Literatur/@ahrens_2017` returns exactly this redirect
page, not a 404. The same plugin also handles genuine frontmatter `aliases:` redirects — same
mechanism, different trigger.

**For any future Quartz version upgrade or the gpunkt.org replay**: don't assume this "just works"
because it worked here — it worked here because the plugin happened to already be
`enabled: true` in the scaffold default and nobody disabled it. Explicitly verify: (1) the plugin is
enabled in `quartz.config.yaml`, (2) `curl` an old-cased URL that existed on the pre-migration site
and confirm it returns a redirect page, not a 404, after the real production cutover.

## Content-repo git hygiene: case-sensitivity

macOS's filesystem (and local git) is case-insensitive; GitHub/Cloudflare (Linux) is
case-sensitive. Renaming a file with only a case change (e.g. `@Schmidt_2016.md` →
`@schmidt_2016.md`) via a normal `git mv` can leave **both** casings live on GitHub even though
locally there's only one — breaking any Wikilink that assumed the new casing, with images silently
not rendering. If a pure-case rename ever needs to happen again: verify with `git ls-tree -r
<branch> --name-only | grep -i <name>` that only one casing exists on the remote after pushing: if
two show up, `git rm` both, commit, push, then re-add only the correct one.
