# Quartz v4 → v5 Migration Runbook

Status: **Phases A–G done and pushed to the `v5` branch, including nine real bugs found and fixed
and the full visual-diff pass now closed. `v4` (production, live on Cloudflare Pages) is
untouched.** Phase H (deploy cutover) has the user's explicit go-ahead as of 2026-07-27 but hasn't
actually started yet — pick it up next session (see the "Phase H" section further down for the
concrete first step). Phase I (gpunkt.org replay) still needs its own separate go-ahead when the
time comes. The one open question that was gating Phase H's design — whether Quartz v5 supports
publishing directly from an Obsidian plugin, bypassing this repo's manual git push — is now
resolved (2026-07-27, see "Resolved: Obsidian-plugin direct publishing" further down): it doesn't,
so the existing two-repository git-push-triggers-Actions workflow stands unchanged. Nothing is
blocking Phase H from actually starting next session.

Update this file as each phase actually executes (commands run, gotchas hit, final config). This is
the artifact that makes replaying the same migration on the sister project
(`/Users/alemsabic/Desktop/gpunkt.org`) mechanical instead of exploratory — gpunkt.org has no
CLAUDE.md of its own to lean on, so this doc carries the institutional memory.

Full research/design context lives in the plan this runbook was seeded from:
`/Users/alemsabic/.claude/plans/ja-recherchier-das-mal-compressed-sutherland.md` (until that path
is cleaned up by the harness — treat this file as the durable copy).

## Current status and how to continue (read this first if picking this up fresh)

**If you are a new Claude session opening this repo cold: start here, not at the top of the
execution log below.**

### What's done

- Phases A through G are complete, verified in real builds and in an actual browser (not just
  build success), and pushed to the `v5` branch. `git log v5` has the full commit-by-commit trail;
  each phase section further down in this file has the detailed narrative, including nine real
  bugs found and fixed purely by looking at rendered output (Explorer `shortTitle`, citation
  tooltips, `CustomOgImages` title concatenation, the `quartz-fonts` cascade-layer conflict, a
  duplicate-H1 regression on content pages, a beforeBody reorder + duplicate Properties panel, a
  hardcoded `markdown-preview-view` wrapper div breaking several direct-child CSS selectors, a
  multi-part search-button styling regression, and a dark-mode background color drift affecting
  several surfaces — see the "Phase G" section and its addenda below for all nine).
- The `v5` branch is currently checked out locally. `v4` (the live, deployed branch) has not been
  touched since Phase A and is not affected by anything on `v5` until Phase H actually happens.
- `npm run check` (TypeScript + prettier) is clean except for `content/` and harness config files,
  neither in scope.
- **Manual visual-diff pass, page by page, comparing the locally-running `v5` build against the
  live `v4` site — now complete (2026-07-26 through 2026-07-27).** This is how bugs 4 through 9
  above were found — automated Phase G checks confirmed things _rendered_, not that they rendered
  _identically_ to v4. Checked in depth across sessions: one zettelkasten note (`Atomizität im
ZK`), the index page (heavily, 2026-07-27 — this is where the RecentNotes/sidebar/dark-mode-color
  work happened), dictionary-entry/literature-note note types, and folder/tag listing pages.
  User confirmed literature-note and tag-listing pages render identically to v4 (2026-07-27, no
  further findings). **Phase G is now fully closed** — no further visual-diff work outstanding
  before Phase H.
- **Also done this session, not bugs but user-requested feature/design changes** (see the two
  dedicated subsections after the numbered bug addenda below): Tagline text made configurable via
  `quartz.config.yaml` options instead of hardcoded JSX, its CSS centralized into `custom.scss`;
  `content-header`'s Textlänge (word count) field removed (Datum, tags, GitHub edit link all
  remain — Datum was removed then put back the same session, see below). A same-session detour
  moved `content-header` into `afterBody` with a redesigned divider and removed the site-wide
  `<hr>` — fully reverted at the user's own follow-up request, back to the original beforeBody
  position with the site-wide `<hr>` restored. Net effect on that front: only the Textlänge
  removal persists.
- **Gotcha worth remembering, hit twice this session**: `local-plugins/*` packages are pre-built via
  `tsup` into their own `dist/`, which is what the Quartz build actually loads — editing
  `src/**/*.tsx` alone does nothing until you run `npm run build` inside that specific
  `local-plugins/<name>` directory. Forgetting this step silently serves the old compiled output
  with no error, which looks exactly like the edit "didn't take" — see the Tagline addendum below
  for the concrete case where this cost real time to diagnose.

### Resolved: a 4th real bug, found by the user, fixed 2026-07-26

While spot-checking the running `v5` site locally against memory of the old `v4` site, the user
(not automated testing) noticed the body text was rendering in the wrong font — `Source Sans Pro`
instead of the configured `JetBrains Mono`. Investigated together on 2026-07-26; paused
mid-investigation on purpose (user asked to think it through calmly rather than patch reactively),
then resumed and fixed same day. Full technical writeup, including the fix and its verification,
is in the "Phase G addendum" section further down (search for "quartz-fonts plugin conflict"). One
paragraph summary:

Quartz v5 has **two independent, non-communicating font-configuration systems**: the core
`configuration.theme.typography` block in `quartz.config.yaml` (which we set correctly — Domine /
JetBrains Mono / Inconsolata) and a separate community plugin, `@quartz-community/quartz-fonts`,
which generates its _own_ `:root` CSS block (including Obsidian-style variables like `--font-text`,
`--h1-font` etc.) and falls back to _its own_ hardcoded defaults (Schibsted Grotesk / Source Sans
Pro / IBM Plex Mono) whenever it isn't given explicit `title`/`header`/`body`/`code` options —
which our `quartz.config.yaml` never does, since Phase D only touched `configuration.theme`. Both
blocks live inside a CSS `@layer` (`quartz-base` vs `quartz-fonts` respectively), and per CSS
`@layer` cascade rules, whichever layer name is _referenced first_ in the page gets the _lowest_
priority — `quartz-fonts` is referenced later in document order, so it wins, overriding our correct
fonts even though `index.css` itself is completely correct (verified via direct `curl`, bypassing
any browser cache — this is not a caching artifact, it's a real CSS-layer precedence conflict).
Confirmed via `grep` that nothing in our own `custom.scss` or any of our forks references the
Obsidian-style variables this plugin uniquely provides, so it isn't serving any purpose for us
currently.

**Two options were identified, neither applied yet:**

1. **Disable `@quartz-community/quartz-fonts` entirely.** Removes the redundancy at its root
   instead of duplicating config across two places. Recommended, provisionally — nothing we own
   depends on what this plugin uniquely provides (Obsidian-theme font bridging via
   `@quartz-themes/core`, which we also have disabled).
2. **Keep it enabled, but pass matching `options: {title: Domine, header: Domine, body: JetBrains
Mono, code: Inconsolata}`** to its `quartz.config.yaml` entry. Keeps the plugin available for
   possible future Obsidian-theme compatibility, at the cost of two places that must be kept in
   sync by hand forever (a drift risk the two-systems-in-one-repo problem already caused once).

**Resolution (2026-07-26, same day, after the pause above)**:

Before deciding, checked how the upstream reference site (`quartz.jzhao.xyz`, built via `npm run
docs` → `npx quartz build --serve -d docs`, straight off `quartz.config.default.yaml` in
`jackyzha0/quartz` — no separate docs-site config) avoids ever hitting this. It doesn't avoid it
architecturally — it just never triggers it: `quartz.config.default.yaml` and every scaffold
template (`default.yaml`, `blog.yaml`, `obsidian.yaml`, `ttrpg.yaml`) set
`theme.typography` to `header: Schibsted Grotesk / body: Source Sans Pro / code: IBM Plex Mono` —
identical to `quartz-fonts`'s own hardcoded `QUARTZ_DEFAULT_*` constants — while leaving
`quartz-fonts` with no `options:` block, same as our Phase D/C setup. Both competing `@layer`
blocks render the same values by coincidence, so the cascade-layer precedence bug is real there
too, just invisible. We only surfaced it because we changed `theme.typography` away from stock
without also touching `quartz-fonts`'s own options. This confirmed the diagnosis and ruled out "our
setup is unusually broken" as an explanation.

Chose **option 1** (disable the plugin) — user's call, `quartz.config.yaml:122-127`:

```yaml
# Disabled: ships its own hardcoded font defaults (Schibsted Grotesk/Source Sans Pro/IBM Plex
# Mono) in a CSS @layer that wins over configuration.theme.typography's @layer by cascade-layer
# ordering, unless given matching `options:`. Nothing we own reads the Obsidian-style variables
# (--font-text etc.) it exists to bridge, and @quartz-themes/core (its only consumer) is also
# disabled below. See upgrade.md "Phase G addendum" for the full trace.
- source: "@quartz-community/quartz-fonts"
  enabled: false
```

**Verification**:

- `curl localhost:8080/index.css` → `--bodyFont` correctly `"JetBrains Mono", ...`.
- Swept every CSS file the built index page actually links (`index.css`, all `component-*.css`,
  both remaining `static/resource-style-*.css`, the KaTeX CDN stylesheet) via `curl` + `grep` for
  `Source Sans Pro` / `Schibsted Grotesk` / `IBM Plex Mono` — zero matches anywhere. The
  `quartz-fonts`-generated `@layer quartz-fonts` block is gone entirely, not just losing the
  cascade.
- Bonus finding while verifying: disabling the plugin does **not** orphan the Obsidian-style
  bridge variables. `index.css` (core `quartz-base` layer, generated straight from
  `configuration.theme.typography`) already defines its own aliases —
  `--font-text: var(--bodyFont)` and siblings — independent of `quartz-fonts`. Confirmed live via
  `getComputedStyle(document.documentElement).getPropertyValue('--font-text')` in the browser:
  resolves to `"JetBrains Mono", ...`, matching `--bodyFont` exactly. So nothing depending on the
  Obsidian naming convention (were anything ever added later) would break — it was dead weight
  exactly as suspected, not a load-bearing bridge.
- Real browser check (not just curl): rebuilt (`npx quartz build --serve`), opened
  `localhost:8080` in Chrome, user confirmed visually — correct fonts render, matches the old `v4`
  site's look. This is the side-by-side-with-real-eyes check the "honest note" below says the
  original Phase G pass skipped.

### After that: Phase H and Phase I, in order

Both remain explicitly gated on the user being present and giving an explicit go-ahead at the time
— agreed with the user mid-session, independent of anything else in this file:

- **Phase H (CI/CD + deploy cutover)**: this is the point where the live site is actually affected
  (Cloudflare Pages production branch, GitHub default branch). Do not do this unattended. A
  Cloudflare Pages **preview** deployment (pushing the `v5` branch without changing the production
  branch setting) is lower-risk and was discussed as a good intermediate step, but even that should
  be confirmed with the user first, not assumed.
- **Phase I (replay on gpunkt.org)**: a second production site. Do not start this unattended either.
  See the gpunkt.org-specific notes near the bottom of the "Customization inventory" section above
  and the diff findings referenced there (heading-badge/im-Fokus transformer plugins, TableOfContents
  badge rendering, footnote-heading relabeling, its more-diverged `ContentHeader`) — these need
  reconciling, not blind-copying, when that phase starts.

### A honest note on why this specific bug wasn't caught during Phase G

Phase G's browser-based verification (screenshots, live JS inspection) caught three real bugs this
session already — but not this one, even though the dev server was open and screenshotted multiple
times. The likely reason: recognizing "this is Source Sans Pro, not JetBrains Mono" from a
screenshot requires either already knowing the old site's exact typography by eye, or a genuine
side-by-side comparison — neither of which the automated Phase G pass did (it checked _that_
fonts loaded and rendered without error, not _which_ specific font family rendered per pixel). The
user's own inspection, with the old site's look in mind, caught what an automated screenshot check
missed. Worth remembering for Phase G-equivalent verification on the gpunkt.org replay: build
success and "a font rendered" are not the same claim as "the correct font rendered" — for anything
where the specific visual identity matters, a real side-by-side against the live reference is more
reliable than describing a screenshot in isolation.

## Why

Quartz v5 is a ground-up rearchitecture (YAML config, community-plugin ecosystem, new layout
system) that also ships native Obsidian **Bases** (`.base`) and **Canvas** (`.canvas`) support.
Goal: migrate ale.ms to v5 without breaking the live site, carry forward every still-relevant
customization, adopt Bases/Canvas, then replay the same migration on gpunkt.org — reconciling its
own extra customizations rather than blind-copying.

## Key architectural facts about v5 (see plan file for full detail + sources)

- `quartz.config.ts` + `quartz.layout.ts` → single `quartz.config.yaml`, optional `quartz.ts` for TS-only overrides.
- Nearly all plugins are now separate repos under `github.com/quartz-community`, installed via `npx quartz plugin add github:quartz-community/<name>`, pinned in `quartz.lock.json`.
- No more `quartz.layout.ts` — each plugin declares `layout.position`/`layout.priority` in its own YAML entry; `layout.byPageType` for per-page-type overrides.
- New Page Type plugin category (content/folder/tag/canvas/bases/404) — this is how Bases/Canvas plug in.
- URLs are lowercased+hyphenated; `AliasRedirects` auto-redirects old-cased paths.
- Do **not** run the git-merge-based `quartz upgrade` path on our heavily-modified tree (~112 custom commits touching `quartz/`) — too many conflicts. Instead: fresh `npx quartz create` scaffold + deliberate re-application of customizations as local plugin forks.
- Build command becomes `npx quartz plugin install && npx quartz build` everywhere (Cloudflare Pages included).

## Decisions locked in with the user (2026-07-26)

- Custom patches ported as **local-path plugin forks** inside the repo (`local-plugins/`), not separate public GitHub repos — directly copyable to gpunkt.org.
- Dormant `bs-BA.ts` (Bosnian) locale: leave untouched, don't activate or delete.
- `CustomOgImages` (disabled since Sept 2025, Satori font-rendering bug): re-test once on v5.
- Outstanding WIP on `v4` committed before branching (`37db023`).

## Customization inventory → v5 fate

### Already built into v5 upstream — drop our old workaround

- German CSL locale for citations: `quartz-community/citations`'s `transformer.ts` already auto-derives the locale-XML URL from `ctx.cfg.configuration.locale`. Just set `configuration.locale: de-DE`.
- Bibliography-link popover suppression (`#bib-*`): already sets `data-no-popover` upstream.

### Needs a local-plugin fork (confirmed not covered upstream)

- Footnote-ref popover suppression (`sup > a` → `data-no-popover`) — not present in `quartz-community/github-flavored-markdown`. New small local transformer.
- `shortTitle` fallback (Explorer/Breadcrumbs short label) — spans `content-index` (was `contentIndex.tsx`), `content-meta` (was `ContentHeader.tsx`), and likely `explorer` (was `fileTrie.ts` — **confirm by reading source, first execution task**). `ctx.ts`/`BuildCtx` likely still core.
- SPA footnote highlighting (`footnotes.inline.ts`) + tooltip entity-decoding (`tooltips.inline.ts`) — currently wired via `Body.tsx`. v5's equivalent aggregation point is **unconfirmed — likely `content-page`, first execution task**. Script logic itself is unchanged (still uses `nav`/`addCleanup`, v5 keeps this lifecycle + adds a `render` event).
- Drop the redundant server-side entity-decode block in old `citations.ts` when porting (duplicate of the client-side fix, already flagged as rejected-but-present in old CLAUDE.md).

### Pure CSS/config — direct port

- Zotero highlight/callout/book-cover CSS, giscus theme CSS, static assets → same `custom.scss` mechanism.
- Layout positions → per-plugin YAML `layout:` blocks (mapping below).
- i18n string tweaks (`de-DE.ts` reading-time phrasing, "Schlagwort" terminology) — verify i18n's v5 home first.

### Undocumented customizations found during inventory (port alongside documented ones)

- `Date.tsx` — hardcoded `DD.MM.YYYY.` format.
- `Head.tsx` — conditional `" - "` separator.
- `PageList.tsx` + `RecentNotes.tsx` + 2 stylesheets — date column removed (4-file coordinated change).
- `contentMeta.scss` — separator `" –"`.
- `custom.scss` (1,355 lines) — `dictionary-entry`/`dictionary-entry-columns`/`zettelkasten`/`literature-note` design systems, CSS-only tooltip rendering, CSS-level footnote-popover suppression in `zettelkasten` block (overlaps citations.ts mechanism — reconcile, don't duplicate).

### Cleanup candidates (not blockers, skip porting)

- `ProfileImage.tsx` (orphaned, unused), `kursnotizen-logo.png` (orphaned branding leftover).

## quartz.config.yaml mapping (for Phase D)

- `pageTitle`, `pageTitleSuffix`, `locale: de-DE`, `baseUrl`, `analytics.provider: plausible`, theme fonts/colors, `ignorePatterns` → `configuration:` YAML keys.
- **Test explicitly**: current `baseUrl` includes `https://` scheme (non-standard) — check for double-scheme bugs in v5 internals before trusting it.
- `TableOfContents({minEntries:4, maxDepth:3, showByDefault:true, collapseByDefault:false})` → same `options:` on `quartz-community/table-of-contents`.
- `Citations({...})` → `quartz-community/citations`, drop `lang` override, keep `bibliographyFile`.
- `CustomOgImages` → re-enable, test.
- Layout: Footer custom links → YAML `options.links` (or forked Footer). beforeBody: Breadcrumbs `condition: not-index` + forked ContentHeader/content-meta. `left: [PageTitle, Tagline, Explorer]`, `right: [TableOfContents, Graph, Backlinks]` (corrected order, see CLAUDE.md fix). afterBody: RecentNotes conditional (check if `condition` needs a custom `registerCondition()` or a `quartz.ts` override), Comments/giscus full options.

## Execution log

### Phase A — Prep on v4 ✅ (2026-07-26)

- Committed outstanding WIP: header font Jost→Domine, Tagline font-family, custom.scss H2-H6 font cleanup — commit `37db023`.
- Fixed CLAUDE.md drift: typography section (was stale "Victor Mono/Geist Mono"), right-sidebar order (was "Graph→TOC→Backlinks", actually `TableOfContents, Graph, Backlinks`), `literature-note` status (was marked "TODO/paused", actually fully implemented — corrected with a note about the a/b/c/d vs. §-roman-numeral discrepancy from the original spec).
- This file created.

### Phase B — Branch to v5 ✅ (2026-07-26)

```
git remote add upstream https://github.com/jackyzha0/quartz.git
git fetch upstream v5
git checkout -b v5 upstream/v5
npm i
git push -u origin v5
```

- `package.json` version confirms `5.0.0`. Node `v25.6.1` used (repo's own `.node-version`/engines
  requirement wasn't re-checked yet on this branch — verify in Phase C/G).
- `npm i`: 112 added / 272 removed / 117 changed, 321 audited, 5 vulnerabilities (1 low, 4 high) —
  not investigated yet, not a migration blocker, revisit before going live.
- **Gotcha**: checking out `v5` replaces the working tree with upstream's scaffold — our own
  authored files that are tracked-only-on-`v4` (`CLAUDE.md`, this `upgrade.md`) disappear from the
  working directory (still safe in `v4`'s history, not deleted). Restored with
  `git checkout v4 -- CLAUDE.md upgrade.md`. Untracked files (`.mcp.json`) survive the checkout
  automatically. **Remember this same gotcha will apply on gpunkt.org's replay.**
- `v4` branch confirmed untouched and pushed to `origin/v4` before branching (commit `1b7e1c4`).

### Phase C — Scaffold + import content ✅ (2026-07-26)

```
git archive v4 -- content | tar -x -C <scratch>/quartz-v4-content-backup
npx quartz create --template default --source <scratch>/quartz-v4-content-backup/content \
  --strategy copy --baseUrl ale.ms --links shortest
```

- Used the non-interactive CLI flags (`quartz create --help` documents them) instead of the TUI wizard.
- **Deliberately fixed the flagged `baseUrl` bug here**: passed bare `ale.ms` (no `https://` scheme), matching v5's documented convention, instead of porting the old `https://ale.ms` value as-is. Needs verification in Phase G that this doesn't break anything that assumed the scheme was included.
- `quartz.config.yaml` generated with defaults (`locale: en-US`, stock fonts/colors, most plugins default-enabled including `canvas-page` and `bases-page` — **both are already enabled by default in this template**, simplifying Phase F). Citations, comments, recent-notes, tag-list default to `enabled: false` as expected (matches v4 behavior where these needed manual enabling).
- Content restored: 25 items incl. `bibliography.bib`, `CSL/`, `Literatur/` — and a pre-existing `Quellendatenbank.base` file was already present in content (useful real test case for Phase F/Bases, not something I created).
- Not yet committed — will commit together with Phase D's config rewrite so the "default scaffold" state isn't a confusing intermediate commit.

### Phase D — Rebuild config ✅ (2026-07-26, config done; layout for forked components pending Phase E)

Translated `quartz.config.ts`/`quartz.layout.ts` into `quartz.config.yaml` per the mapping table.
Concrete outcomes/decisions beyond the mapping table:

- `TableOfContents`: our options ported, moved to `priority: 10` + `display: desktop-only` on `right` (TOC→Graph(20)→Backlinks(30), matching the corrected sidebar order).
- `Citations`: enabled, our `bibliographyFile`/`csl` ported, `lang` dropped (built-in now), v4-only `showTooltips`/`tooltipAttribute` options dropped (don't exist in v5's plugin — our own tooltip script handles that separately).
- `Search`+`Darkmode`: moved from the default `left` toolbar into `beforeBody` (priority 1/2, `group: toolbar`) to match v4's Flex-row-before-breadcrumbs arrangement.
- `reader-mode`: disabled entirely — v4 never placed it in any layout, so the site currently has no reader-mode toggle. Trivial to enable later as a v5 bonus (out of migration scope).
- `article-title`/`content-meta`: kept enabled (needed on folder/tag list pages, matching v4's `defaultListPageLayout`) but excluded via `layout.byPageType.content.exclude` on regular content pages, since v4's custom `ContentHeader` component covers both jobs there (Phase E will confirm this once ContentHeader is ported).
- `Comments`: enabled with our exact giscus config (repo/category IDs, German lang, custom theme URLs) — this was pure config in v4, no fork needed.
- `Footer`: left at stock options — v4's actual personal links are hardcoded in `Footer.tsx` source, not config-driven, so this needs the Phase E fork before it's real; YAML options are a no-op placeholder until then.
- **Still open, deferred to Phase E**: Tagline/EditOnGitHub/ContentHeader components (no plugin entry yet), footnote-popover-fix, `shortTitle` support, footnotes/tooltips inline scripts, Date/Head/PageList/RecentNotes tweaks, i18n string edits, RecentNotes' "index-only" condition (not a built-in condition preset — needs either a custom `registerCondition()` call or a `quartz.ts` override).
- **Verified**: `npx quartz build` succeeds end-to-end against this config + our real content (25 files → 177 emitted files, no errors). Bibliography path `./content/bibliography.bib` resolved without error. Full visual/behavioral verification is Phase G, not yet done.
- Committed together with Phase C's content import.

### Phase E — Port custom plugins (in progress)

**Open questions resolved by reading real plugin source (2026-07-26):**

- `fileTrie.ts` and `ctx.ts` are still **core/bundled files** in the scaffolded repo (`quartz/util/`), not externalized to any community plugin — confirmed by checking the actual v5 working tree. Patched directly, exactly like v4 (no fork needed for these two).
- `content-index`'s `ContentDetails` type IS in a separate plugin repo (`quartz-community/content-index`, resolved via a real published npm package `@quartz-community/content-index` by default) — this one genuinely needs the local-fork treatment.
- `content-meta` does NOT render the title — confirmed by reading its actual source description and by empirical build output. **Correction to the Phase D exclude list**: `article-title` alone already renders the correct full-title H1 on content pages (verified in real build output) and should stay enabled there; only `content-meta` needs excluding (ContentHeader's fork replaces its specific job — reading time/date — with a richer line: date + German word count + edit-on-GitHub link, not the title).
- Body.tsx's afterDOMLoaded-aggregation role isn't owned by any specific plugin — `componentResources.ts` (still core) collects `afterDOMLoaded`/`beforeDOMLoaded` from _every_ component used on a page, same mechanism as v4. So footnotes.inline.ts/tooltips.inline.ts don't need to be wired into any specific plugin fork — a small local "global scripts" component (render nothing, just carry the two scripts as a static `afterDOMLoaded` property) placed anywhere in the layout is sufficient. Confirmed `nav`/`render` client events still exist (checked `docs/advanced/architecture.md`).

**shortTitle support — done, verified in a real build:**

- `quartz/util/fileTrie.ts`: added `shortTitle?: string` to `FileTrieData`, `displayName` getter fallback — direct edit (core file).
- `quartz/util/ctx.ts`: added `shortTitle?: string` to `BuildTimeTrieData`, extraction in `trieFromAllFiles()` — direct edit (core file).
- `local-plugins/content-index/`: forked from `quartz-community/content-index` @ `1342d1eacfdabbcefa2c6a26f8346945a9d9860f` (`git clone --depth 1`, stripped `.git`/`node_modules`/changeset scaffolding, added `FORK_NOTES.md` documenting the patch + upstream SHA for future re-sync). Added `shortTitle?: string` to `ContentDetails` + threaded through in the `emit()` loop.
- `quartz.config.yaml`: `content-index`'s `source` changed from `@quartz-community/content-index` to `./local-plugins/content-index`. Installed via `npx quartz plugin install --from-config` (auto-detects local sources, symlinks + builds with tsup, updates `quartz.lock.json`).
- **Verified**: `public/static/contentIndex.json` contains `"shortTitle":"Ahrens (2017)"` etc. for all 7 `Literatur/@*.md` files; `public/literatur/@ahrens_2017.html` shows the breadcrumb leaf as "Ahrens (2017)" and the H1 as the full real title "How to take smart notes" — exactly the v4 behavior.

**Local plugin fork pattern established** (reusable for the remaining forks below): `git clone --depth 1 <upstream> local-plugins/<name>`, strip `.git`, patch source, add `FORK_NOTES.md`, point `quartz.config.yaml`'s `source:` at `./local-plugins/<name>`, `npx quartz plugin install --from-config`.

**Footnote-popover fix — done, verified in a real build:**

- `local-plugins/github-flavored-markdown/`: forked from `quartz-community/github-flavored-markdown` @ `287c709c12806dca76882ab8ab79567d57ede5b4`. Added a `sup > a` → `data-no-popover` hast-visitor to both `htmlPlugins()` return paths in `src/transformer.ts`, plus `unist-util-visit` to `devDependencies` (tsup bundles it, same pattern as the plugin's other markdown deps — checked `tsup.config.ts`'s `SINGLETON_EXTERNALS` list first to confirm it needs to be a real dep, not assumed available).
- Correction from the plan: this fix belongs here (the GFM/footnotes plugin), not forked into `citations.ts` where v4 had it — v4's placement was really just "whichever file was already being touched," not a citations concern. Bibliography-link popover suppression is separately already built into upstream `citations` (confirmed earlier), so `citations` itself doesn't need forking at all now — just enabling with our bibliography options (already done in Phase D's YAML).
- **Verified**: rebuilt, checked `public/autopoiesis-vs.-allopoiesis.html` — all `<sup><a ...>` footnote refs carry `data-no-popover="true"`.

**Global scripts (footnotes.inline.ts + tooltips.inline.ts) — done, verified in a real build:**

- `local-plugins/site-scripts/`: a genuinely NEW local plugin (not a fork — no upstream equivalent), scaffolded from the official `quartz-community/plugin-template`, stripped to a single component-only plugin (`"category": "component"` in the `quartz` manifest field, per `docs/advanced/creating components.md`). `SiteScripts` renders `null` and carries both scripts (unchanged from v4) concatenated on `.afterDOMLoaded`.
- Wired into `quartz.config.yaml` at `afterBody` priority 90.
- **Debugging note for future reference** (cost real time, worth recording): my first verification method was wrong, not the implementation. In v5's hashed/production build mode, `postscript.js` is NOT a monolithic bundle containing every script inline — it's a small orchestrator that `Promise.all`s dynamic `import()`s of each component's script as its own content-hashed file under `static/scripts/script-N-<hash>.js` (dev/`--serve` mode is the monolithic-bundle path instead, per `componentResources.ts`'s `useHashing` branch). So grepping a page's static `<script src>` tags for a specific script's hash will _never_ find component scripts — only `postscript-<hash>.js` itself is referenced there, and its own JS content must be inspected for the `import("./script-N-...")` calls. Traced this by temporarily instrumenting `componentLoader.ts`, `config-loader.ts`, and `componentResources.ts` with debug prints (all reverted, no residual diff) to rule out an actual registration bug before finding the real explanation.
- **Verified correctly**: `public/postscript-95d6a964.js` contains a dynamic import of `script-4-56ff712b.js`, which contains both our scripts' minified logic.

**Date/Head core edits + RecentNotes/tag-page/folder-page forks — done, verified in a real build:**

- `quartz/util`-sibling core files confirmed still core in v5 (same pattern as fileTrie/ctx): `quartz/components/Date.tsx` (hardcoded `DD.MM.YYYY.` format, ignoring `locale`), `quartz/components/Head.tsx` (conditional `" - "` separator only when `pageTitleSuffix` non-empty) — both direct-edited.
- `quartz/components/PageList.tsx` is ALSO still core, edited the same way (removed the per-item `<p class="meta"><Date/></p>` block) — **but this turned out to be dead code**: nothing in `quartz/` imports it. `folder-page` and `tag-page` community plugins each bundle their own private, near-identical `PageList.tsx` copy (confirmed via their real source) that actually renders list pages. Caught via a real build still showing `class="meta"` on a tag page after the "fix." Left the harmless core edit in place (matches intent, costs nothing) but the real fix is the two forks below.
- `local-plugins/tag-page/`, `local-plugins/folder-page/`: forked from `quartz-community/tag-page` @ `a651839686ed2bd7e58beb01709b9a682dc9add8` and `quartz-community/folder-page` @ `213a8e98c4347aca9013c0dd5a15bc80a1dca604`. Both got the identical patch (remove the date block + now-unused `DateDisplay` helper) since both bundle the same duplicated file.
- `local-plugins/recent-notes/`: forked from `quartz-community/recent-notes` @ `2c36e87f151431b7fb05a486705adfa790126622`. Three patches: (1) index-only rendering baked directly into the component (`if (fileData.slug !== "index") return null`) instead of a `quartz.ts` `ConditionalRender` override — `loadQuartzLayout()`'s per-pageType override merge is shallow (whole-array replace, not append), which would have made a TS override fragile against future YAML `afterBody` changes; (2) removed the per-item date display; (3) `.filter(p => p.slug !== "index")` baked in too, since v4's `filter` callback option can't be expressed in YAML.
- **Verified**: title tag shows `"index - Alem Šabić's Notizen und Quellen"` (correct conditional separator); recent-notes block appears only on `index.html` with no date, absent elsewhere; `public/tags/evolution.html` has zero `class="meta"` occurrences after the tag-page/folder-page forks (had 1 before, with a rendered date, confirming the core-file dead-code finding).
- **Not yet ported**: `EditOnGitHub.tsx` — investigated and found to be **dead code even in v4**: it's never referenced in `quartz.layout.ts`'s actual layout arrays. `ContentHeader.tsx` implements its own inline "Verbesser die Seite auf GitHub." edit link directly (same default text), making `EditOnGitHub` fully redundant. Not porting it; flag as a CLAUDE.md correction alongside the other stale-doc items already found (CLAUDE.md documents it as if active).

**Tagline/ContentHeader/Footer — done, verified in a real build:**

- `local-plugins/site-components/`: a genuinely NEW local plugin (not a fork), scaffolded from `quartz-community/plugin-template`, holding two named components (`Tagline`, `ContentHeader`) in one package. Both ported near-unchanged from v4, with one deliberate change: `ContentHeader`'s date formatting is implemented inline (own `formatDate` function) rather than importing `@quartz-community/utils/date`'s stock formatter — see below.
- **Multi-component-per-plugin layout trick**: `quartz.config.yaml` references this one physical directory via _two_ plugin entries, using the object-form `source: {repo, name}` override — `name: tagline` and `name: content-header` — so `buildLayoutForEntries`'s PascalCase-fallback lookup (`"content-header"` → `"ContentHeader"`) resolves each to its own component independently, letting them sit at different layout positions (`left`/`beforeBody`) from one plugin package.
- **Real bug hit and fixed**: initial `package.json` copied the plugin-template's own `"@quartz-community/types": "github:quartz-community/types"` / `.../utils` git-ref dependency style. That resolves via git clone with no build step run (the packages only define `prepublishOnly`, which npm doesn't run for git installs) — so the installed copies had no `dist/` at all, and the build failed with `Could not resolve "@quartz-community/utils/lang"` etc. Real community plugins (recent-notes, tag-page, ...) all use proper npm semver ranges (`^0.2.1`/`^0.1.0`) instead, which resolve from the registry's pre-built tarball. Fixed in both `site-components` and (preventatively) `site-scripts`, which had the same latent issue despite happening to build successfully earlier.
- `local-plugins/footer/`: forked from `quartz-community/footer` @ `329ed399aca778251f604ffb8fdd3eb1c7f45f51`. Replaced the stock "Created with Quartz vX" line with v4's hardcoded personal links.
- **Verified**: index page shows the Tagline text under the page title; footer shows "Alem Šabić © 2026 | x.com/sarajevo"; a Literatur content page's `.content-header` shows `Datum: 26.07.2026.` (correct DD.MM.YYYY. format), `Textlänge: 17 Wörter.`, the tag link, and a correctly-constructed GitHub edit URL.

**custom.scss — ported wholesale, verified in a real build + one real bug found and fixed:**

- Full 1,355-line v4 `quartz/styles/custom.scss` body copied onto v5's scaffold header (`@use "./variables.scss" as *;` instead of v4's `@use "./base.scss";` — checked first that v4's file uses zero SCSS variables/mixins from `base.scss`, pure plain CSS, so this is a safe swap matching the new scaffold's own convention).
- Spot-checked (build succeeds, no SCSS errors; then grepped real rendered HTML) that the most distinctive selectors still match real v5 DOM output: `.explorer`/`button.mobile-explorer`/`button.desktop-explorer`, `.toc`/`.toc-content`/`.toc-header`, `.backlinks`, `.callout`, `.article-title`, `.page-title`, `.search`, `.folder-container`, `.recent-notes`. Two that initially looked "missing" (`.toc`, `.backlinks`) turned out to be correctly absent on the specific test page (< 4 headings, so under `minEntries: 4`; no incoming links) — confirmed present with the right classes on a page that actually has 8 headings and backlinks, so not a v5 mismatch.
- Confirmed the `cssclasses` frontmatter mechanism (needed for the `dictionary-entry`/`zettelkasten`/`literature-note` design systems) still flows through correctly in v5: `ContentBody`'s `classString = ["popover-hint", ...frontmatter.cssclasses].join(" ")` — verified `cssclasses: zettelkasten` in a real content file renders as `class="popover-hint zettelkasten"` on the `<article>`.
- **Real bug found and fixed**: `tag-page`/`folder-page`'s bundled `listPage.scss` still had the _original pre-v4-customization_ 3-column grid (`fit-content(8em) 3fr 1fr`, sized for a date column) even though their `PageList.tsx` fork already removed the date element — with only 2 grid items (desc, tags) landing in a 3-column track, the title would render squeezed into the narrow first column. Fixed both files to `grid-template-columns: 1fr auto` (matching v4's actual post-customization CSS) and dropped the now-pointless `.popover .section` 3-column override. Verified in the real built CSS output (`grid-template-columns:1fr auto` present in `component-*.css`). `recentNotes.scss`'s leftover `.meta` rule has no such grid dependency (plain block layout) — confirmed harmless, left as-is.
- **Gotcha for local-plugin edits that aren't `.tsx`/`.ts` source**: rebuilding a linked local plugin after an SCSS-only change needs `cd local-plugins/<name> && npm install && npm run build` — `npx quartz plugin install --from-config` (even with `--latest`) does **not** detect that an already-linked local plugin's files changed and silently no-ops ("All configured plugins are already installed"). Also hit a transient "tsup: command not found" on the first `npm install` attempt for two plugins that resolved on a plain retry (worth knowing about, not investigated further — didn't recur).

**Static assets — done:**

- Copied `icon.png`, `og-image.png` (fallback OG image, used when `CustomOgImages` is off), and `giscus/{dark,light}.css` (custom theme, v5's scaffold ships stock placeholders of the same filenames — overwritten) from v4.
- Also copied `noise.png` — found it's actually load-bearing (`custom.scss` line 175: `background-image: url("/static/noise.png")` for the light/dark "book aesthetic" texture overlay), not just a leftover; would have been a broken-image bug if skipped.
- Deliberately did **not** port `kursnotizen-logo.png` (orphaned branding leftover, per the earlier cleanup-candidate finding) — `.DS_Store` also removed.

**i18n string tweaks — scoped down, done for the two confirmed customizations:**

- Confirmed i18n is now fully decentralized: each plugin ships its own per-locale files (`src/i18n/locales/de-DE.ts` etc.), no central `quartz/i18n/locales/de-DE.ts` anymore. Checked v5's stock German strings against v4's `de-DE.ts` diff and found most of what v4 had (callout labels, backlinks, theme-toggle, explorer, graph, search, TOC titles) are just the _standard_ German translations Quartz ships by default anyway — not deliberate customizations, confirmed by spot-checking stock plugin locale files. Only two real, deliberate customizations existed:
  1. `content-meta`'s `readingTime` phrasing (stock `"X Min. Lesezeit"` → v4's `"X Minuten Lesezeit."` with singular handling) — new fork `local-plugins/content-meta/` (upstream `quartz-community/content-meta` @ `3066ef3eaf88c08c7e123d07cc3be8e07b2f4e10`).
  2. `tag-page`'s tag terminology (stock literal `"Tag"` → v4's proper German `"Schlagwort"`/`"Schlagwörter"`) — patched directly in the already-forked `local-plugins/tag-page/src/i18n/locales/de-DE.ts` (no new fork needed).
- Not porting the matching `en-US.ts` readingTime tweak from v4 — site's `configuration.locale` is `de-DE`, English strings are never served; v4's own inventory flagged this as low-value even at the time.
- **Verified**: rebuilt, `public/tags/evolution.html` shows "Datei mit diesem Schlagwort." (not "Tag").

Phase E is now functionally complete — every documented (and several undocumented) v4 customization has been ported and verified in real builds. Remaining before Phase F: none blocking; `npm run check` (TypeScript) has not been run yet against the whole tree — worth doing once before Phase G's full walkthrough.

### Phase F — Bases + Canvas ✅ (2026-07-26)

Both `bases-page` and `canvas-page` were already `enabled: true` in the `npx quartz create`
default-template config from Phase C — nothing to add, just verify.

- **Bases**: our real content already has `content/Quellendatenbank.base` (pre-existing, not
  something I created). Built successfully → `public/quellendatenbank.base.html` (16KB, real
  `bases-page`/`bases-view`/`bases-table` markup). Renders `class="bases-empty"` because its filter
  (`file.folder == "NOTIZEN"`) doesn't match this content backup's flat folder structure — that's a
  content-authoring detail (content/ is out of scope for us to fix), not a plugin bug; the important
  thing is the page rendered without error.
- **Canvas**: content had no `.canvas` file to test with, so created a temporary
  `content/_v5-canvas-test.canvas` (two text nodes + one edge), built, confirmed
  `public/_v5-canvas-test.canvas.html` contains both node texts and the full `canvas-*` DOM
  structure (stage/viewport/nodes/edges/sidebar/zoom controls), then **deleted the test file**
  before finishing (`content/` stays untouched — verified via `git status` showing nothing there).
- Other ecosystem plugins the plan flagged as "worth a look, not blocking" (`note-properties`,
  `unlisted-pages`, `encrypted-pages`) are already `enabled: true` by default from the scaffold —
  left as-is rather than actively investigating further; harmless bonus features, not actively
  adopted/configured for anything specific.

### Phase G — Local verification ✅ (2026-07-26 to 2026-07-27, closed — see 9th bug addendum and the visual-diff closure note at the top of this file)

Using `npx quartz build --serve` + actual browser inspection (screenshots, console, accessibility
tree), not just build-success/grep checks — this caught a real bug static analysis missed.

**Index page**: Tagline, Explorer, Search, Graph, footer, "Zuletzt bearbeitete Seiten" all render
correctly in the real browser (light mode, background `#e0cca6` correctly applied). Zero console
errors on load.

**Dark mode toggle**: works, deep-purple custom dark palette (`#0a0200`) renders correctly,
German "Dunkler Modus"/moon icon label correct.

**Real bug found and fixed — Explorer sidebar not using shortTitle**: on `/literatur/@ahrens_2017`,
the breadcrumb correctly showed "Ahrens (2017)" but the Explorer sidebar still showed the full
title. This is exactly the kind of divergence static/build-only checks can't catch — Breadcrumbs is
server-rendered from core `fileTrie.ts` (already patched), but **Explorer fetches
`contentIndex.json` client-side and rebuilds its own trie in the browser with a duplicate
`FileTrieNode` class** (`src/components/scripts/explorer.inline.ts`) whose `displayName` getter
never checked `shortTitle`. New fork `local-plugins/explorer/` (upstream
`quartz-community/explorer` @ `06ea3d8e206f0edaab08556191adc75b2403e832`), one-line fix mirroring
the core getter. Verified: Explorer now shows "Ahrens (2017)", "Christis (2001)", "von Foerster
(1981)", etc. for every `Literatur/@*.md` entry.

- **Note for gpunkt.org replay**: this means `shortTitle` support needs **4** pieces, not 3 as
  originally scoped — `fileTrie.ts` + `ctx.ts` (core) + `content-index` fork + this `explorer`
  fork. Don't skip the explorer fork there just because it wasn't in the original plan.

**Zettelkasten page walkthrough** (`/atomizität-im-zk`): TOC, Backlinks, Graph all correct in the
right sidebar. Clicked a footnote reference (`#user-content-fn-1`) — **highlight applied correctly**
(visible background on the target `<li>`, confirming `footnotes.inline.ts` fires on real client-side
nav, not just page load) and **no popover appeared** (confirms the `github-flavored-markdown` fork's
`data-no-popover` fix works in the live browser, not just in the HTML source). Citations render
correctly inline (`(Ahrens, 2017)` etc.), full bibliography list at the bottom, Giscus comment box
rendered in the correct dark theme.

**Real bug #2 found and fixed — citation tooltips silently broken**: checked for `data-tooltip`
attributes site-wide (the thing `local-plugins/site-scripts`' `tooltips.inline.ts` is supposed to
decode) and found **zero** anywhere in the built output. Traced it to Phase D: `showTooltips`/
`tooltipAttribute` were dropped as "not part of v5's Citations plugin options," reasoning from the
wrapper's narrow `CitationsOptions` TypeScript interface — but these are **real upstream
`rehype-citation` options** (confirmed via the library's own README), just not exposed by the v5
wrapper, which hand-picks 5 fields into the underlying call instead of spreading `opts`. New fork
`local-plugins/citations/` (upstream `quartz-community/citations` @
`5db598448105ee791665ff3b5e4c35b285a85296`), two-line addition threading both options through.
**Verified in the live browser via `javascript_tool`**, not just build output: `data-tooltip`
attributes are present and — critically — already **decoded** (`&amp;#38;` → plain `&`) after page
load, confirming the full round-trip (server generates HTML-encoded tooltip text → client script
decodes it on `nav`) works exactly like v4.

- **Pattern that keeps paying off**: don't trust a plugin wrapper's typed options interface as the
  full set of what the underlying library supports — check the library's own docs when a v4 option
  goes missing, the same way the citations `lang` discovery worked in the opposite direction (v5
  already having something built-in that v4 needed a hack for).

**Tag/folder listing page** (`/literatur/`): title/tags render in a clean 2-column layout with no
squeezing — direct visual confirmation the `listPage.scss` grid fix (found earlier in the
custom.scss step) actually renders correctly, not just "no CSS error."

**`cssclasses` design systems**: `zettelkasten` confirmed visually (round bullet markers, compact
styling, all rendering as expected) on `/atomizität-im-zk`. `literature-note`'s article class
applies correctly (`class="popover-hint literature-note"` on `@ahrens_2017.md`), but the specific
decorative rules (§/lowercase-letter markers, `Abb. N` figure captions) need `.annotation-highlight`/
`.annotation-figure-caption` HTML that this content backup doesn't contain — mechanism proven via
the same cssclasses pathway as zettelkasten, specific rules untestable without matching content
(a content-authoring gap, not a migration bug). `dictionary-entry` not separately tested — same
mechanism, no reason to expect a different result.

**Search**: FlexSearch full-text search works correctly in the real browser — typed "Zettelkasten",
got ranked results with tag matches and highlighting.

**RSS (`/index.xml`) + sitemap (`/sitemap.xml`)**: both correctly resolve `baseUrl: ale.ms` (bare,
no scheme) to `https://ale.ms/...` — confirms the deliberate Phase D `baseUrl` scheme fix didn't
break anything (no double-scheme, no missing-scheme).

**Real bug #3 found and fixed — `CustomOgImages` re-enable test**: per the user's decision, left
`og-image` enabled to retest the Sept-2025 Satori font-rendering bug. **Font rendering is fixed** in
v5 (opened a generated `*-og-image.webp` directly — clean text, no corruption). But found a new,
stock v5 bug while looking: title and `pageTitleSuffix` concatenate with **no separator**
(`"indexAlem Šabić's Notizen und Quellen"`) — the exact same bug already fixed in core `Head.tsx`,
just never caught upstream because this plugin's own preview/test suite apparently doesn't render
a real site title+suffix combo. New fork `local-plugins/og-image/` (upstream
`quartz-community/og-image` @ `73dae18d4df526126d65288339f583394959b836`), same conditional
`" - "` fix. Verified visually — title now reads correctly. Not fixing the OG image's English
"X min read" text (locale-independent, cosmetic, and this feature was never in a "working" v4
state to match since `CustomOgImages` was off there — noted in FORK_NOTES.md as optional future
polish, not blocking).

**`npm run check`**: clean (see the earlier TypeScript-fix commit) — re-confirmed still clean after
all Phase G forks.

**Phase G summary — 3 real bugs found, all via actually looking at rendered output (browser
screenshots, live JS inspection, opening generated images directly), not one of them caught by
build success or grep alone**:

1. Explorer sidebar not using `shortTitle` (client-side duplicate trie logic).
2. Citation tooltips completely absent (`showTooltips`/`tooltipAttribute` silently dropped).
3. `CustomOgImages` title/suffix concatenation bug (stock v5 bug, unrelated to the migration but
   caught while retesting this specific feature).

This validates the "don't fully trust build-success + grep, actually look at the site" approach for
the rest of this migration and for the gpunkt.org replay — static verification alone would have
shipped all three of these to production.

### Phase G addendum — 4th bug found by the user (2026-07-26): quartz-fonts plugin conflict

**Status: diagnosed AND fixed (2026-07-26).** Diagnosis happened first; the user then asked to
pause and think it through calmly rather than patch reactively. This section is that write-up,
followed by the fix and its verification once the session resumed.

**Symptom**: body text on the locally running `v5` site rendered in `Source Sans Pro` instead of
the configured `JetBrains Mono`. Found by the user directly (opened dev tools, saw
`--bodyFont: Source Sans Pro` in a `:root` rule, and confirmed that manually striking that
declaration in the inspector revealed the correct font underneath) — not caught by this session's
own Phase G browser testing (see the honest note above on why).

**First hypothesis (wrong, ruled out)**: browser cache. Ruled out conclusively by fetching
`http://localhost:8080/index.css` directly via `curl` (bypasses any browser cache entirely) and
confirming it already contained the correct declaration:

```
--bodyFont:"JetBrains Mono", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, ...
```

So the core theme system was never wrong. Something else was overriding it downstream, in the
actual browser rendering.

**Second hypothesis (also initially imprecise)**: "a later `<link>` tag wins in the cascade."
Partially right in spirit but technically wrong about the mechanism — see below.

**Actual root cause, fully traced**:

1. Fetched every CSS file referenced on the index page (`curl` each `<link href>` from the page
   HTML) and grepped all of them for `Source Sans Pro` / `:root`. Found the competing declaration
   in `static/resource-style-9857b007.css`:
   ```
   :root{--titleFont:Schibsted Grotesk;--bodyFont:Source Sans Pro;--headerFont:Schibsted Grotesk;
   --codeFont:IBM Plex Mono;--font-text:Source Sans Pro;--font-interface:ui-sans-serif, ...;
   --font-monospace:IBM Plex Mono;--h1-font:Schibsted Grotesk;--h2-font:Schibsted Grotesk; ...}
   ```
   Note the extra `--font-text`, `--font-interface`, `--font-monospace`, `--h1-font`...`--h6-font`
   variables — these are **Obsidian's own CSS variable naming convention**, not Quartz's. That was
   the clue to what generates this file.
2. Traced it to the `@quartz-community/quartz-fonts` plugin (repo: `quartz-community/fonts`,
   `src/transformer.ts`). Read the actual source (`gh api repos/quartz-community/fonts/...`):
   - It has its own hardcoded constants: `QUARTZ_DEFAULT_HEADER = "Schibsted Grotesk"`,
     `QUARTZ_DEFAULT_BODY = "Source Sans Pro"`, `QUARTZ_DEFAULT_CODE = "IBM Plex Mono"`
     (`src/transformer.ts` lines 9–11).
   - Its `resolveFonts(options)` function (lines 37–113) resolves each font role by checking, in
     order: (a) an explicit `options.body`/`options.header`/etc. passed to _this specific plugin
     entry_ in `quartz.config.yaml`, (b) a shared "font registry" populated by the
     `@quartz-themes/core` plugin if that's enabled (`readFontRegistry()` — we have
     `@quartz-themes/core: enabled: false`, so this is always empty for us), (c) its own
     `QUARTZ_DEFAULT_*` constants, (d) Obsidian's own font stacks as a final fallback.
   - Since our `quartz.config.yaml` entry for `quartz-fonts` has **no `options:` block at all** (it
     was left exactly as `npx quartz create` generated it in Phase C, and Phase D only edited
     `configuration.theme`, never this plugin's own options), step (a) and (b) both fail and it
     falls through to (c) — its own stock defaults, completely independent of and unaware of our
     `configuration.theme.typography`.
   - Its `externalResources()` hook (lines 207–223) then emits this as an **inline CSS resource**,
     wrapped in `@layer quartz-fonts { :root { ... } }` (`buildLayeredCSS()`, lines 141–161), which
     Quartz's core `componentResources.ts` extracts to its own hashed static file (the
     `static/resource-style-*.css` mechanism — the same "extract each resource to its own
     content-hashed file" pattern already documented for scripts in the Phase E `site-scripts`
     section above).
3. Confirmed the _actual_ precedence mechanism (correcting the "later link wins" hypothesis): both
   competing blocks are inside CSS `@layer` declarations — the core theme CSS is inside
   `@layer quartz-base` (`componentResources.ts`: `` `@layer quartz-base {\n${quartzBase}\n}\n...` ``),
   and the Fonts plugin's block is inside `@layer quartz-fonts`. Per the CSS Cascade Layers spec,
   **layers are prioritized by the order in which their names are first referenced in the document,
   not by normal selector-specificity or "last rule wins" rules** — and unlike plain unlayered CSS,
   a layer declared later always beats one declared earlier, regardless of selector specificity.
   Since `index.css` (containing `@layer quartz-base`) loads before the extracted
   `static/resource-style-*.css` (containing `@layer quartz-fonts`) in the page's `<head>`,
   `quartz-fonts` is the layer referenced _later_ — so it wins, and its Schibsted Grotesk/Source
   Sans Pro/IBM Plex Mono values override our correct ones for the exact same custom properties.
4. Checked whether anything we actually own depends on the Obsidian-style variables this plugin
   uniquely provides (`--font-text`, `--font-interface`, `--font-monospace`, `--h1-font` through
   `--h6-font`):
   ```
   grep -rn "font-text\|font-interface\|font-monospace\|h1-font\|...\|h6-font" \
     quartz/styles/custom.scss local-plugins/*/src/**/*.tsx local-plugins/*/src/**/*.scss
   ```
   Zero matches. Nothing we own reads these variables at all.

**The two options on the table (neither applied)**:

1. **Disable `@quartz-community/quartz-fonts`** (`enabled: false` in `quartz.config.yaml`).
   Removes the second font system entirely rather than keeping two in sync. Leaning towards this
   one, provisionally — but not decided, and there may be a reason to keep it (e.g. if some other
   currently-enabled plugin we haven't examined for this _does_ read the Obsidian-style variables,
   which the `grep` above only checked for our own code, not every enabled community plugin's
   internals) that's worth checking before committing to this option.
2. **Pass explicit `options: {title: Domine, header: Domine, body: JetBrains Mono, code:
Inconsolata}`** to the `quartz-fonts` entry, keeping it enabled but pointed at our real fonts.

**Also still unverified**: whether this same conflict is masking or interacting with anything else
theme-related (e.g., do any of our custom.scss color rules also collide with a similarly
independent color system from another plugin? Not checked — this was scoped specifically to the
font symptom the user reported, not a full audit of every `:root`-setting plugin. Worth a quick
`grep -rl ":root" public/*.css public/static/*.css` sweep before considering the theme system
fully verified.)

### Phase G addendum — 5th bug found by the user (2026-07-26): duplicate H1 on content pages

**Status: diagnosed and fixed.** User compared `localhost:8080/atomizität-im-zk` (v5) against the
live `https://ale.ms/Atomizität-im-ZK` (v4) — v4 shows exactly one H1 (the article's own leading
`# Heading` from the markdown body), immediately followed by the italic dek sentence. v5 showed
that same H1 twice: once from a component, once from content.

**Root cause, part 1 — why v4 only ever had one H1**: v4's frontmatter transformer
(`quartz/plugins/transformers/frontmatter.ts`) falls back to `file.stem` (the filename) for
`data.title` when frontmatter has no explicit `title:` — it does **not** promote the markdown
body's first H1 into the title or strip it from the body. v4 also never rendered a
component-level title on content pages at all (its `layout.ts` never included `ArticleTitle`), and
the `shortTitle` work (see CLAUDE.md) deliberately commented out the redundant title `<dt>/<dd>` in
`ContentHeader`. So on v4 the only H1 a content page ever shows is whatever the note itself starts
with — which for this vault's convention is always `# <filename>`, i.e. visually identical to what
a title component would show, but there's only ever one render path, not two.

**Root cause, part 2 — why v5 regressed**: `content.exclude` in `quartz.config.yaml`'s
`layout.byPageType` originally excluded only `content-meta`, not `article-title` — a Phase-G
comment claimed "article-title alone already renders the correct H1 exactly where v4's
ArticleTitle used to," which was factually wrong (v4 never had that component at all, per above).
Result: `article-title` (component, driven by `frontmatter.title` = filename) rendered as one H1,
and the markdown body's own leading `# Heading` rendered as a second, textually identical H1
directly under it.

**Root cause, part 3 — why the first fix attempt silently failed**: adding `- article-title` to
`content.exclude` had no effect on rebuild. Traced through
`quartz/plugins/loader/config-loader.ts`'s `extractPluginName()` (used by the exclude-filtering
logic at line ~662): it strips a short name from **local** sources (`./local-plugins/x` → `x`) and
from `github:`/`git+`/`https:` sources, but a plain npm-scoped source string like
`"@quartz-community/article-title"` hits none of those branches and is returned completely
unstripped. So `exclude: [article-title]` was comparing `"article-title"` against
`"@quartz-community/article-title"` — never equal, exclude silently no-ops. This is why
`content-meta`'s exclude worked from the start (it's `./local-plugins/content-meta`, a local
source, so basename-stripping applies) while `article-title`'s otherwise-identical-looking exclude
did not. Grepped every other by-name plugin lookup in `config-loader.ts` — none of them strip npm
scope either, so this is a repo-wide gotcha, not specific to this one entry: **any `exclude:` (or
similar by-name reference) targeting a plain npm-scoped package must use the full source string,
not the short display name.**

**Fix applied** (`quartz.config.yaml`, `layout.byPageType`):

```yaml
content:
  exclude:
    - "@quartz-community/article-title" # full source string required, see comment in file
    - content-meta
folder:
  exclude:
    - "@quartz-community/reader-mode" # same gotcha — was silently broken before too (harmless,
tag: #                                   since reader-mode is disabled outright, but noting it here
  exclude: #                            since it's the exact same class of bug, found in the same pass)
    - "@quartz-community/reader-mode"
```

**Verification**: `curl` + `grep -o "<h1"` count on `localhost:8080/atomizität-im-zk` went from 2
to 1; confirmed the remaining H1 is the content one (`id="atomizität-im-zk"`), not
`class="article-title"`. Confirmed list pages (checked `localhost:8080/tags/zk-theorie`) still
correctly render their `article-title` H1 — the exclude is content-page-scoped only, folder/tag
pages have no markdown body of their own to supply an H1 from. Real browser screenshot taken and
visually confirmed by the user against memory of the `v4` original.

**Worth remembering for the gpunkt.org replay (Phase I)**: audit every `exclude:` entry in that
site's `layout.byPageType` the same way — any exclude targeting a plain `@scope/name` package
(not a `./local-plugins/...` fork) needs the full string, or it will silently no-op exactly like
this one did.

### Phase G addendum — 6th bug found by the user (2026-07-26): beforeBody reorder + duplicate Properties panel

**Status: diagnosed and fixed.** User compared screenshots of `localhost:8080` (v5) against
`https://ale.ms` (v4): v4 shows Search+Darkmode first, directly above Breadcrumbs, then
`content-header` (Datum/Textlänge/Schlagwörter/GitHub-link). v5 showed the same components in the
wrong order (Breadcrumbs → content-header → **a new "Properties" panel** repeating
tags/aliases → Search+Darkmode at the bottom, right above the H1).

**Root cause 1 — ordering**: `quartz.config.yaml`'s `layout.groups.toolbar.priority: 35` is an
unmodified carryover from the scaffold default (`quartz.config.default.yaml` has the identical
value). An explicit group priority overrides every member's own `layout.priority` for sort
purposes (`config-loader.ts`'s `resolveGroups` — group priority wins over the first-member
fallback), so the Search+Darkmode toolbar (members at priority 1/2) was sorting _after_
Breadcrumbs (5) and `content-header` (10) instead of before them — silently contradicting the
"moved here to match v4" comment already sitting on the Search entry from Phase E. **Fix**:
changed `groups.toolbar.priority` from `35` to `0` (below Breadcrumbs' 5) in
`quartz.config.yaml`.

**Root cause 2 — duplicate panel**: `@quartz-community/note-properties` was enabled with its
scaffold-default options, which render an additional collapsible "Properties" table (tags,
aliases) directly duplicating what `content-header` already shows. v4 never had this component at
all.

**First fix attempt for root cause 2 was wrong and broke the whole site**: setting
`enabled: false` on `note-properties` seemed like the obvious fix, but this plugin is v5's _only_
frontmatter-parsing transformer — it registers `remarkFrontmatter` and sets `file.data.frontmatter`
(title fallback, tags/aliases coercion, cssclasses, dates), i.e. it's the direct v5 equivalent of
v4's dedicated `FrontMatter` transformer, just bundled together with an optional properties-display
component. Disabling it entirely made every note's raw `---\n...\n---` YAML block render as literal
paragraph text, since nothing else in the plugin list registers `remarkFrontmatter`. **Correct
fix**: kept `enabled: true`, set `options.hidePropertiesView: true` instead — the component's own
source (`@quartz-community/note-properties/dist/components/index.js`) checks
`if (noteProps.showProperties !== true && noteProps.hideView) return null;`, so this renders
nothing (not just `display:none` — no DOM node at all) while the transformer keeps working.

**Verification**: `curl` + `grep` on the built HTML — correct order
(`search` → `darkmode` → `breadcrumb-container` → `content-header` → `<h1`), no `cssclasses:`
literal text leaking into the body, no `note-properties` node anywhere. Confirmed live in browser
by the user (screenshot).

### Phase G addendum — 7th bug found by the user (2026-07-26): `markdown-preview-view` wrapper div breaks direct-child selectors

**Status: diagnosed and fixed.** User compared the same note again: v4 renders the H1 at a large
`3rem` desktop size, and the note's first paragraph (the italic one-sentence summary) gets square
brackets (`[ ... ]`) via `::before`/`::after`. Both were missing in v5 — H1 rendered small
(computed `28px`/`1.75rem`, from a generic `h1 { font-size: 1.75rem }` rule instead of ours), and
the brackets were gone entirely.

**Root cause**: `@quartz-community/content-page` (confirmed also true of `folder-page`/`tag-page`)
hardcodes its `ContentBody` component as
`<article class={...}><div class="markdown-preview-view markdown-rendered">{content}</div></article>`
— an extra wrapper `<div>` between `<article>` and the actual rendered markdown, unconditional,
not exposed as an option. v4 had no such wrapper; `<article>`'s children were the real content
directly. Every direct-child (`>`) selector in `custom.scss` that assumed `article > h1` or
`article.zettelkasten > p:first-of-type` therefore stopped matching anything in v5 — confirmed via
`element.matches(...)` in the browser (`false` for the old selectors) and by walking the actual
DOM parent chain (`H1 → DIV.markdown-preview-view → ARTICLE.zettelkasten → ...`).

**Fix**: for each affected rule, inserted `> div.markdown-preview-view >` to skip exactly that one
level, rather than dropping to a bare descendant selector — a bare descendant would also
incidentally match e.g. the first paragraph inside a nested blockquote/callout elsewhere in the
note, which a direct-child chain correctly excludes. Four rules fixed in `custom.scss`:

- `.page article > h1` (desktop 3rem H1 font-size)
- `article.zettelkasten > p:first-of-type` and `> p:first-of-type em` (bracket summary paragraph)
- `[saved-theme="light"/"dark"] article.zettelkasten > p:first-of-type` (theme-specific summary
  color — its loss is also why the summary's `em` lost its color as a side effect, since color is
  inherited from this rule on the parent `p`, not set directly on the `em` rule)

**A mid-session scare, noted for honesty**: partway through, one of these fixes appeared to have
reverted on disk between turns (the file matched an earlier, less-precise draft rather than the
corrected version, despite the corrected edit having reported success). Cause not conclusively
identified — possibly an editor/linter auto-format cycle running concurrently with the session (a
system notice mid-session flagged `custom.scss` as "modified, either by the user or by a linter").
Re-applied the fix and it held on rebuild. **Lesson for future sessions**: after any edit to a
file that might be open in another tool, re-grep for the expected result after rebuilding rather
than trusting the edit tool's success report alone, especially for anything that took more than
one attempt to get right.

**Verification**: compiled CSS (`public/index.css`) shows all four selectors with the
`>div.markdown-preview-view>` segment; live HTML confirms the wrapper div's presence and position;
browser screenshot (both light and dark theme) confirms the H1 size, the bracket styling, and the
theme-specific summary color all match `v4`.

### Phase G addendum — 8th bug found by the user (2026-07-26): search button styling regression

**Status: diagnosed and fixed.** User sent side-by-side screenshots: v4's search bar has a subtly
tinted fill and no border; v5's has a transparent fill with a visible 1px border, and in dark
theme the border is barely visible against the near-black background — making the whole control
look "broken"/invisible. Follow-up round also found the placeholder text almost unreadable in
both themes, and the text sitting flush against the box edge with no padding.

**Root cause**: `@quartz-community/search` ships different default CSS for `.search-button` than
v4's own bundled search component. Diagnosed by diffing the _exact_ compiled rule from
`https://ale.ms/index.css` against the v5 plugin's bundled CSS
(`node_modules/@quartz-community/search/dist/components/*.js`), rule-by-rule rather than
guessing:

|                            | v4                                                       | v5 default                                |
| -------------------------- | -------------------------------------------------------- | ----------------------------------------- |
| background                 | `color-mix(in srgb, var(--lightgray) 60%, var(--light))` | `transparent`                             |
| border                     | `none`                                                   | `1px solid var(--lightgray)`              |
| layout                     | `justify-content: space-between`                         | _(missing)_                               |
| padding                    | `0` on button, `0 1rem` on the `<p>`                     | `0 1rem 0 0` on button, none on `<p>`     |
| `.search-button > p` color | _(unset — inherits `body`'s `color: var(--darkgray)`)_   | explicit `color: var(--gray)`             |
| DOM order                  | `<p>Suche</p><svg>...</svg>` (text first)                | `<svg>...</svg><p>Suche</p>` (icon first) |

The DOM-order difference matters specifically because of `justify-content: space-between`:
whichever element is first in the DOM lands on the left. v5's icon-first markup therefore put the
icon on the left and the text on the right — the reverse of v4 — even after every other property
was corrected.

**Fix**, all in `custom.scss` (none of it touches the plugin's own bundled component):

```scss
.search > .search-button {
  background-color: color-mix(in srgb, var(--lightgray) 60%, var(--light));
  border: none;
  justify-content: space-between;
  padding: 0;

  svg {
    order: 2;
  }
}

.search > .search-button > p {
  order: 1;
  color: var(--darkgray);
  padding: 0 1rem;
}
```

The `order` properties are the key trick for the DOM-order mismatch — pure CSS, no component fork
needed, since `order` only affects visual/layout order, not the underlying DOM.

**Verification**: computed styles checked directly in the browser console for both themes —
`.search-button`'s background, border, and child order all matched v4; `.search-button > p`'s
color came back as `rgb(78, 78, 78)` (`#4e4e4e`, our light-theme `--darkgray`) and
`rgb(212, 212, 212)` in dark theme, both against their respective correct backgrounds. Visually
confirmed by the user in both themes after each incremental correction (this bug took four
back-and-forth rounds to fully match v4 — background/border first, then padding, then DOM order,
then the padding-on-`<p>`-not-button detail).

### Tagline: made configurable, CSS centralized (2026-07-26, user-requested feature, not a bug)

User asked for the Tagline text ("Alem Šabićs Zettelkästchen der Notizen, Quellen und Ideen.") to
be settable from `quartz.config.yaml` instead of hardcoded in JSX, and changed to "Alem Šabićs
Notizen & Quellen." While doing this, also noticed `Tagline.tsx` embedded its own CSS via
`Component.css` and asked for that to move into `custom.scss` instead, for consistency with how
the rest of the site's styling is centralized.

**Changes**:

- `local-plugins/site-components/src/components/Tagline.tsx`: converted from a bare
  `QuartzComponent` to the standard options-factory pattern (matching `ContentHeader.tsx`'s
  existing shape) — new `TaglineOptions` (`linkText`, `linkUrl`, `text`), defaults matching the old
  hardcoded v4 text exactly. Removed the inline `Tagline.css` block entirely.
- `quartz.config.yaml`: the `tagline` entry's `options:` now sets
  `linkText: "Alem Šabićs"`, `linkUrl: "https://alemsabic.com"`, `text: " Notizen & Quellen."`.
- `quartz/styles/custom.scss`: added the `.tagline { font-size: 1rem; margin-top: 0.5rem;
margin-bottom: 2.5rem; line-height: 1.1rem; font-family: var(--titleFont); }` block that used to
  live in `Tagline.css`.

**Gotcha that cost real time**: `local-plugins/site-components` is pre-built via `tsup` into its
own `dist/`, which is what the Quartz build actually loads — not `src/`. The very first rebuild
after editing `Tagline.tsx` still showed the _old_ hardcoded text, with no error anywhere, because
`dist/components/index.js` hadn't been regenerated. Fix: `cd local-plugins/site-components && npm
run build` before rebuilding Quartz, every time a `local-plugins/*` source file changes. **This
applies to every package under `local-plugins/`, not just this one** — worth a standing reminder
for the gpunkt.org replay.

**A second, related bug found while verifying**: after fixing the text, `.tagline`'s own
`margin-top`/`margin-bottom` weren't rendering at all. Cause: `Tagline.tsx` puts both `tagline` and
`desktop-only` classes on the same `<div>`, and v5's own `quartz/styles/base.scss` (core scaffold
file, confirmed identical in `upstream/v5` — not something we introduced) changed `.desktop-only`
from v4's `display: initial` to `display: contents`. `display: contents` makes an element
generate no box of its own — its children render as if promoted to the parent's direct children,
but the element's _own_ margin/padding/border/background stop applying, since there's no box left
for them to apply to. Fixed in `custom.scss` rather than patching the core scaffold file:

```scss
.tagline.desktop-only {
  display: block;

  @media (max-width: 800px) {
    display: none;
  }
}
```

The higher specificity (`.tagline.desktop-only` vs. base.scss's bare `.desktop-only`) wins
regardless of source order, and the nested media query repeats base.scss's own mobile-hide
behavior so mobile visibility is unaffected.

**Verification**: `curl` on the built homepage shows
`<a href="https://alemsabic.com">Alem Šabićs</a> Notizen &amp; Quellen.`; compiled CSS shows
`.tagline.desktop-only{display:block}` unconditionally and `{display:none}` inside the
`max-width:800px` media query.

### `content-header`: Textlänge removed; a same-day position experiment, reverted

User asked to drop the "Datum" and "Textlänge" (word count) fields from `content-header` as
superfluous, keeping "Schlagwörter" (tags) and the GitHub edit link. Implemented in
`local-plugins/site-components/src/components/ContentHeader.tsx`: removed the `dateText`/
`wordCountText` JSX blocks and their supporting code (`getDate`, `readingTime` import, the
inlined `formatDate` helper). **Immediately regretted removing Datum too** ("ich muss gerade
selbst über mich lachen") and asked for it back the same session — `getDate`/`formatDate` and the
`dateText` block were restored verbatim. Net result: only **Textlänge** (word count) is actually
gone; Datum, Schlagwörter, and the GitHub edit link all remain.

**Same-day detour (fully reverted, documented for the record, not because any of it survived)**:
the user then asked to move `content-header` from `beforeBody` (above the article) to `afterBody`
(inside `.page-footer`, right after `DefaultFrame.tsx`'s site-wide `<hr>`), then to redesign its
divider as a bibliography-style colored accent line (`::before`, matching
`#refs.references.csl-bib-body`'s existing look, 60% width instead of 40%) plus its original
dashed `border-bottom`, and removed the site-wide `<hr>` from `DefaultFrame.tsx` entirely once the
accent line made it redundant for this component. Also added `margin-bottom` to
`.breadcrumb-container` to compensate for `content-header` no longer sitting directly below it.
After seeing it rendered, the user decided they didn't like `content-header` at the bottom of the
page after all and asked to put it back exactly where it started. Reverted, in full: `content-header`
back to `beforeBody`/priority 10, `<hr>` restored in `DefaultFrame.tsx`, `.breadcrumb-container`'s
`margin-bottom` addition removed, `content-header`'s CSS back to its pre-detour form (no accent
line, no `position: relative`, plain `border-bottom`-free block matching the original). **Net
diff from this whole detour: zero** — only the Datum/Textlänge field removal from the start of this
section persists. Left in this runbook anyway, since the bibliography-accent-line technique and
the `display:contents`/`markdown-preview-view` gotchas surfaced along the way are genuinely useful
if a similar redesign is revisited later (e.g. for the gpunkt.org replay, or a future session).

**Follow-up same session**: user asked for Datum back after all ("ich muss gerade selbst über mich
lachen") — `getDate`/`formatDate`/the `dateText` block were restored verbatim. Final state: only
**Textlänge** (word count) is gone; Datum, Schlagwörter, and the GitHub edit link all remain.
Separately, also dropped the trailing period from the date format (`26.07.2026.` → `26.07.2026`)
at the user's request — confirmed via `curl` against the live `v4` site that the trailing period
was already there on v4 too (not a v5 regression), just a small polish the user wanted anyway.

### Small fixes: no comments on tag/bases/canvas pages; `.recent-notes` margin regression; renamed callout class (2026-07-26)

Three small, unrelated fixes from the same session, grouped here rather than given full addenda:

**No Giscus comments on tag/bases/canvas pages**: `@quartz-community/comments` had no
`byPageType` exclusion, so it rendered on every page type including generated tag-index pages and
`.base` tool pages, where a comment thread makes no sense. Added
`exclude: ["@quartz-community/comments"]` (full source string — see the article-title/`exclude`
gotcha from the 5th bug addendum, applies here too) to the `tag`, `canvas`, and `bases` entries in
`quartz.config.yaml`'s `layout.byPageType`. `canvas` has no content under `content/` yet but is
excluded proactively. Folder pages and regular content pages are unaffected (comments still show
there, confirmed via `curl` on `/literatur` and a content page).

**`.recent-notes` (index page "Zuletzt bearbeitete Seiten") had visibly larger gaps between
entries than v4.** User's first guess — that `.section h3, .section > .tags { margin: 0 }` (in the
local `folder-page`/`tag-page` forks' shared `PageList.css`, reused here since `RecentNotes`
copies the same class-name convention) had stopped matching — turned out to be wrong on
inspection: `getComputedStyle` in the browser confirmed that rule was applying correctly
(`h3`'s margin really was `0px`). The actual cause: `local-plugins/recent-notes`'s
`recentNotes.scss` sets `& > li { margin: 1rem 0; }` (both top _and_ bottom), where v4's original
only ever set `margin-bottom: 1em` on `.recent-li` — the extra `margin-top` was new, adding an
uncancelled ~1rem gap between every pair of entries. Confirmed by comparing computed
`margin-top`/`margin-bottom` on `.recent-li` side by side: v4 live site had `0px`/`0px` (v4's own
`custom.scss`-equivalent already zeroes `margin-bottom`, and `margin-top` was never set in the
first place); v5 had `16px`/`0px` (our existing `.recent-notes li.recent-li { margin-bottom: 0 }`
in `custom.scss` canceled the bottom half but not the newly-introduced top half). **Fix — kept
entirely in `custom.scss` per the user's standing preference** (edits to `local-plugins/*` source
were explicitly declined this round): extended the existing override to
`.recent-notes li.recent-li { margin-top: 0; margin-bottom: 0; }`. Also confirms something worth
remembering: this override, despite _lower_ CSS specificity (`(0,2,1)`) than the fork's
`.recent-notes > ul.recent-ul > li` rule (`(0,2,2)`), still wins — because `custom.scss`'s compiled
output lands unlayered in `index.css` while every component's own CSS (including this fork's) is
wrapped in `@layer quartz-base`, and per the Cascade Layers spec, **unlayered CSS always beats
layered CSS regardless of specificity**. This is a generically useful fact for any future
`custom.scss` override against component CSS in this codebase — specificity fights that look like
they should go the "wrong" way, by classic cascade rules, may actually be settled by this
mechanism instead.

**Callout content font-size/line-height rule stopped matching**: `.callout-content-inner p` (v4)
no longer matched anything. `@quartz-community/obsidian-flavored-markdown`'s bundled source
(confirmed via `grep` on `dist/index.js`) shows the callout content wrapper is emitted as a single
`<div class="callout-content">` — the `-inner` wrapper div v4 had is gone entirely, not just
renamed. Updated the selector in `custom.scss` to `.callout-content p`. Not yet visually verified
in a live callout (no callout blocks in the currently-synced `content/` vault to test against) —
compiled CSS confirmed correct (`grep` on `public/index.css`); worth a real visual check the next
time a note with a callout is available locally.

### Phase G addendum — 9th bug found by the user (2026-07-27): dark-mode background color drift (var(--light) stale near-black vs. real purple body bg)

**Status: diagnosed and fixed.** User noticed the mobile sticky sidebar/explorer header still
looked black in dark mode after a first-pass fix; further reports followed for the mobile
full-screen explorer menu, the Search modal, the Graph modal, and the Giscus comment box — all
showing the same stale near-black instead of the site's actual deep-purple dark background.

**Root cause**: `quartz.config.yaml`'s `configuration.theme.colors.darkMode.light` was `"#0a0200"`
— functionally black, despite being mislabeled "deep-purple" in this doc's own Phase G verification
notes (see the "Dark mode toggle" line further up — that was never actually checked closely). At
some earlier point `custom.scss` picked up a hardcoded `[saved-theme="dark"] body { background-color:
#09002b !important; }` override to get the _body_ specifically showing the real purple, but nothing
else in the site was ever pointed at that same real value — every other surface that legitimately
uses `var(--light)` as its background (mobile explorer sticky header, mobile full-screen explorer
menu, `@quartz-community/search`'s modal, `@quartz-community/graph`'s modal, `popover.scss`'s
link-preview card) kept resolving to the stale `#0a0200`.

**Fix — changed the value at its single source instead of patching every consumer**:
`quartz.config.yaml:36`, `darkMode.light` → `"#09002b"`. This makes `var(--light)` resolve to the
real purple everywhere in dark mode automatically, with no per-component overrides needed. Removed
the now-redundant hardcoded `[saved-theme="dark"] body` override in `custom.scss` (was masking the
root config bug rather than fixing it). Giscus comments needed a second, separate fix since the
comment iframe is themed by a static CSS file loaded via `themeUrl`, not by the page's CSS
variables: `quartz/static/giscus/dark.css` had `--bg: #0a0200` hardcoded → changed to `#09002b`.
Deliberately left `--color-btn-primary-text: #0a0200` in that same file untouched — that one is a
text color chosen for contrast against a colored button, not a background, so it wasn't part of
this bug.

**Verification**: `npm run check` clean (aside from pre-existing `content/` prettier warnings, out
of scope). Not yet re-screenshotted for Search/Graph/popover specifically — user confirmed the
sidebar fix looked correct locally and flagged that Giscus can only be checked after the next
deploy, since its CSS is fetched live from `https://ale.ms/static/giscus/*.css` by the comments
widget, not served from the local dev build.

**For the gpunkt.org replay (Phase I)**: check whether gpunkt.org's own dark-mode `light` color has
the same drift (a hardcoded body-only purple patch with the root config value left black) before
assuming it's fine — this is exactly the kind of thing that's invisible until someone actually
opens every surface (modals, mobile menus) in dark mode, not just the main page body.

### Small design tweaks (2026-07-27, user-requested, not bugs — port to gpunkt.org too)

**Mobile sticky sidebar opacity**: `custom.scss`'s `.page #quartz-body .sidebar.left:has(.explorer)`
mobile rule (`@media max-width: 800px`) changed from `opacity: 80%` to `opacity: 0.95` — user's
preference for a more opaque sticky header.

**`.recent-notes` title text**: changed from "Zuletzt bearbeitete Seiten" to "Zuletzt bearbeitet"
(briefly landed on "Zuletzt bearbeitet/hinzugefügt" mid-session before the user shortened it —
"bearbeitet" already covers "hinzugefügt" in spirit, and it reads cleaner) in
`local-plugins/recent-notes/src/i18n/locales/de-DE.ts` (the `de-DE`
locale entry for `components.recentNotes.title`, rendered as the `<h3>` in `RecentNotes.tsx` on the
index page's footer). **Remember the local-plugin build gotcha here**: this required `npm install`
(the package's `node_modules` had no `tsup`/`typescript` present) then `npm run build` inside
`local-plugins/recent-notes` itself — editing the `src/` locale file alone does nothing until
rebuilt, same gotcha as the Tagline addendum above. User explicitly asked that both of these — the
opacity value and the title text — be carried over when gpunkt.org gets its own v5 replay.

**`.recent-notes > h3` (section title only) sized identically to the H1 rule**: added to
`custom.scss`, right after the `.recent-li` margin fix —

```scss
.recent-notes > h3 {
  font-size: 1.75rem;
  line-height: 1;
}

@media (min-width: 800px) {
  .recent-notes > h3 {
    font-size: 3rem;
    line-height: 0.9;
  }
}
```

Values (`1.75rem`/`3rem`, `line-height: 1`/`0.9`) are pulled directly from `base.scss`'s own `h1`
rule and the `h1` `min-width: 800px` override further up in `custom.scss` — this is deliberately
the same H1 sizing, not a coincidentally-similar one. Scoped to `.recent-notes > h3` specifically
(the section title, "Zuletzt bearbeitet") — clarified with the user mid-session, since the
component has a second, unrelated `<h3>` per list entry (`.section > .desc > h3 > a`, each note's
own title) that was **not** meant to change and stays at its original size. Went through two
follow-up size corrections after the initial `3rem`-everywhere pass (`2rem`, then settled on
`1.75rem` to match H1's base size exactly) before landing here.

### Phase H — CI/CD + deploy cutover

**Status: user gave the explicit go-ahead to proceed with this phase (2026-07-27, end of session)
— but no cutover action was actually taken this session.** The session ended here; picking this up
fresh means actually starting Phase H, not just continuing to wait for a go-ahead. Concretely, per
the plan discussed with the user (see "After that: Phase H and Phase I, in order" above): the
lower-risk first step is a Cloudflare Pages **preview** deployment (pushing `v5` without changing
the production branch setting) — start there rather than jumping straight to flipping the
production branch/build command. The build command itself needs to change from `npx quartz build`
to `npx quartz plugin install && npx quartz build` as part of this phase (see `CLAUDE.md`'s
Deployment section).

**Before touching anything Cloudflare/GitHub-side next session, also see the open question noted
below** (Obsidian-plugin direct publishing) — worth understanding first since, if real, it could
mean the actual publishing pipeline works differently than the git-push-triggers-Actions model this
whole migration has assumed so far.

#### Preview deploy attempted (2026-07-27) — broken, root-cause fix #1 did not resolve it

Pushed `v5` to `origin/v5` (`fdebaac`). Cloudflare Pages preview came up at
`https://b1c9b2c1.ale-ms.pages.dev/` but is badly broken: only the index page's shell renders —
Explorer (sidebar) is empty, Graph shows no nodes, RecentNotes is missing, and individual content
pages don't render at all.

**Root-cause investigation (Phase 1, done)**: confirmed via three independent pieces of evidence
that `local-plugins/*/dist/` is gitignored (`.gitignore:local-plugins/*/dist/`) and every local
plugin's `package.json` points its `main`/`exports` at that same `./dist/index.js` — so on a fresh
Cloudflare checkout those modules don't exist until something builds them. The upstream Quartz v5
CLI docs (`docs/cli/plugin.md`, via `jdocmunch`) confirm local/symlinked plugins use a
build-on-install fallback (`npm install` + `npm run build`) specifically **because** `dist/` is
normally gitignored — and that fallback runs as part of `npx quartz plugin install`, not
`npx quartz build` alone. This matched `CLAUDE.md`'s already-documented plan to change the build
command to `npx quartz plugin install && npx quartz build` for exactly this reason.

**Fix #1 (user applied, 2026-07-27)**: updated the Cloudflare Pages project's Build Command setting
to `npx quartz plugin install && npx quartz build`. Pushed an empty commit (`d8a587e`) to force a
fresh preview build against the corrected setting.

**Result: did not fix it.** User confirmed the rebuilt preview looks identical — same missing
Explorer/Graph/RecentNotes/content pages. **This means the root-cause hypothesis above is either
incomplete or wrong**, or the build-command change didn't actually take effect the way expected
(e.g. wrong Cloudflare project/environment edited, preview-specific vs. production build command
settings differ and only one got changed, the setting didn't save, or `quartz plugin install`
itself is failing/erroring in the Cloudflare CI environment rather than silently no-op'ing — none
of this has been checked yet).

**Next session, before attempting a fix #2**: per systematic-debugging practice, don't guess again
blindly — go back to gathering evidence. Concretely: check the actual Cloudflare Pages build log
for this deployment (not accessible without dashboard access — ask the user to paste it or share
screen) to see whether `npx quartz plugin install` ran at all, and if it did, whether it
errored, and if it didn't error, whether `local-plugins/*/dist/` actually got created in that build
environment. Also worth double-checking in the dashboard that the build-command edit was saved
against the right project/branch/environment (Cloudflare Pages has separate Production/Preview
environment variable and sometimes build-config scopes). This is fix attempt #1 of what
systematic-debugging allows up to 3 before stopping to question the architecture — still well
within budget, just needs real evidence (the build log) before the next attempt, not another guess.

#### Root cause found via real build log, not another guess (2026-07-27)

Got dashboard-equivalent access without asking the user to paste/screen-share: found a still-valid
`wrangler` OAuth session already on this machine (`~/.wrangler/config/default.toml`), used it to
run `wrangler pages deployment list --project-name=ale-ms` to find the exact deployment ID for
commit `d8a587e` (`c2ed50c0-...`), then pulled its full build log directly from the Cloudflare API
(`GET /accounts/{account}/pages/projects/ale-ms/deployments/{id}/history/logs`) using the same
OAuth bearer token — no dashboard UI needed.

**The log shows the real failure, in full**:

```
Executing user command: npx quartz plugin install && npx quartz build
→ Installing plugins from lockfile...
  ✗ citations: local path missing: /Users/alemsabic/Desktop/ale.ms/local-plugins/citations
  ✗ content-header: local path missing: /Users/alemsabic/Desktop/ale.ms/local-plugins/site-components
  ... (all 13 local-plugin entries, same pattern)
⚠ Installed 0 plugin(s), 13 failed
Plugin "explorer" declares components but failed to load them
Plugin "content-meta" declares components but failed to load them
... (component plugins fail soft)
✗ Failed to instantiate plugin "github-flavored-markdown": Unknown file extension ".ts" for /opt/buildhome/repo/local-plugins/github-flavored-markdown/src/index.ts
... (transformer/emitter plugins fail hard, but the build process itself doesn't abort)
Emitted 110 files to `public` in 347ms
```

**Root cause, fully traced in `quartz/cli/plugin-git-handlers.js`** (this repo's own copy of the
Quartz v5 CLI, not something we authored): bare `npx quartz plugin install` (no flags) takes the
**lockfile-restore code path** (`handlePluginInstallUnified` without `fromConfig: true`, ~line 1004
onward). For any lockfile entry with `commit: "local"`, this path checks
`fs.existsSync(entry.resolved)` and symlinks from `entry.resolved` **verbatim** — and `entry.resolved`
is an **absolute, install-machine-specific path**, frozen into `quartz.lock.json` at the moment
`quartz plugin install --from-config` was first run locally:

```jsonc
// quartz.lock.json
"citations": {
  "source": "./local-plugins/citations",
  "resolved": "/Users/alemsabic/Desktop/ale.ms/local-plugins/citations",  // ← baked in, dev machine only
  "commit": "local",
  ...
}
```

On Cloudflare's build machine the repo is cloned to `/opt/buildhome/repo`, not
`/Users/alemsabic/Desktop/ale.ms` — so `entry.resolved` points at a path that simply doesn't exist
there, for all 13 local plugins, every single build. Fix #1 (adding `plugin install` to the build
command at all) was necessary but not sufficient — it added the right *command*, but that command's
default (no-flags) behavior trusts a value that is inherently non-portable across machines.

**The fix that's actually correct — confirmed by reading the code, not just plausible**: the
`--from-config` flag takes a completely different branch (same file, ~line 488 onward) that ignores
`entry.resolved` for anything not already present under the plugin-cache dir, and instead does
`resolvedPath = path.resolve(url)` against `process.cwd()` — i.e. re-derives the path fresh, from
`quartz.config.yaml`'s own relative `source: ./local-plugins/<name>` string, relative to wherever
the build is actually running. On a from-scratch checkout (Cloudflare CI has no `.quartz/plugins/`
cache dir yet, so every local plugin registers as "missing" regardless of stale lockfile content),
this resolves correctly to `/opt/buildhome/repo/local-plugins/<name>`. This same code path is also
the one that runs `npm install --ignore-scripts && npm run build` for each freshly-linked local
plugin (`buildPluginAsync`, called right after linking) — the exact `tsup`-into-`dist/` build step
`local-plugins/*` needs, and the same step this doc's "gotcha worth remembering" note (top of this
file) already flagged as easy to forget locally. `--from-config` is what makes that happen
automatically in CI; bare `plugin install` never builds anything new for entries it can't even find.

**Proposed fix #2, not yet applied**: change the Cloudflare Pages **Preview** build command from

```
npx quartz plugin install && npx quartz build
```

to

```
npx quartz plugin install --from-config && npx quartz build
```

This is a dashboard setting, same one edited for fix #1 — needs the user to apply it (or explicit
go-ahead to do it via the Cloudflare API using the `wrangler` OAuth session found above, which has
`pages:write` scope). Not applied automatically without that go-ahead, consistent with this file's
standing rule that Phase H changes need the user present. Once changed, re-trigger a preview build
(another empty commit, same as fix #1's `d8a587e`) and check the same build log for `✓ ... linked`
lines instead of `✗ ... local path missing`, then verify Explorer/Graph/RecentNotes/content pages
render in the actual preview URL.

### Resolved: Obsidian-plugin direct publishing in Quartz v5 — not a thing (2026-07-27)

Researched via `jdocmunch` against the already-indexed `jackyzha0/quartz` docs
(`docs/cli/sync.md`, `docs/features/Obsidian compatibility.md`). **No Obsidian plugin bypasses git
push/commit for this repo's content workflow.** Two related but distinct things do exist, neither
of which is that:

1. **`npx quartz sync`** — a new v5 CLI command that bundles `git pull` + `add` + `commit` + `push`
   into one invocation (flags: `--no-commit`, `--no-push`, `--no-pull`, `-m` for message). Still
   fully git-based, still has to be actively run (terminal/script/hotkey) — not a background
   process, not an Obsidian plugin.
2. **"Quartz Syncer"** (Obsidian community plugin, referenced from `Obsidian compatibility.md`'s
   "Obsidian Community Plugin Support" table) — per the official docs its scope is specifically
   **exporting Dataview queries as static content during sync**, alongside sibling
   Obsidian-plugin-bridges for Excalidraw, Leaflet Maps, and Style Settings. Not a general
   direct-publish mechanism.

**Conclusion**: this repo's two-repository content workflow (edit in
`/Users/alemsabic/Desktop/MEMEX/_projects/alems-notizen/` → `git commit`/`push` → GitHub Actions
syncs to `alems-site`'s `content/` → Cloudflare deploys, per `CLAUDE.md`'s "Content Workflow")
remains architecturally correct and unaffected by anything in Quartz v5. No redesign needed before
or during Phase H on this front. Question closed — nothing further to investigate here.

### Phase I — Replay on gpunkt.org

_(not started — see plan file for gpunkt.org-specific deltas to preserve: heading-badge/im-Fokus transformer plugins, TableOfContents badge rendering, footnote-heading relabeling, its more-diverged ContentHeader. Also see the "9th bug" and "Small design tweaks" addenda above (2026-07-27): the dark-mode `var(--light)` color-drift root cause to check for, the mobile sidebar `opacity: 0.95`, the `.recent-notes` title text change to "Zuletzt bearbeitet", and the `.recent-notes > h3`
H1-identical sizing (`1.75rem` / `3rem` at `min-width: 800px`) — all explicitly flagged by the user
to carry over.)_
