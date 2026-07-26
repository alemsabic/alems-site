# Quartz v4 → v5 Migration Runbook

Status: **in progress** — Phase A. Update this file as each phase actually executes (commands
run, gotchas hit, final config). This is the artifact that makes replaying the same migration on
the sister project (`/Users/alemsabic/Desktop/gpunkt.org`) mechanical instead of exploratory —
gpunkt.org has no CLAUDE.md of its own to lean on, so this doc carries the institutional memory.

Full research/design context lives in the plan this runbook was seeded from:
`/Users/alemsabic/.claude/plans/ja-recherchier-das-mal-compressed-sutherland.md` (until that path
is cleaned up by the harness — treat this file as the durable copy).

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
- Body.tsx's afterDOMLoaded-aggregation role isn't owned by any specific plugin — `componentResources.ts` (still core) collects `afterDOMLoaded`/`beforeDOMLoaded` from *every* component used on a page, same mechanism as v4. So footnotes.inline.ts/tooltips.inline.ts don't need to be wired into any specific plugin fork — a small local "global scripts" component (render nothing, just carry the two scripts as a static `afterDOMLoaded` property) placed anywhere in the layout is sufficient. Confirmed `nav`/`render` client events still exist (checked `docs/advanced/architecture.md`).

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
- **Debugging note for future reference** (cost real time, worth recording): my first verification method was wrong, not the implementation. In v5's hashed/production build mode, `postscript.js` is NOT a monolithic bundle containing every script inline — it's a small orchestrator that `Promise.all`s dynamic `import()`s of each component's script as its own content-hashed file under `static/scripts/script-N-<hash>.js` (dev/`--serve` mode is the monolithic-bundle path instead, per `componentResources.ts`'s `useHashing` branch). So grepping a page's static `<script src>` tags for a specific script's hash will *never* find component scripts — only `postscript-<hash>.js` itself is referenced there, and its own JS content must be inspected for the `import("./script-N-...")` calls. Traced this by temporarily instrumenting `componentLoader.ts`, `config-loader.ts`, and `componentResources.ts` with debug prints (all reverted, no residual diff) to rule out an actual registration bug before finding the real explanation.
- **Verified correctly**: `public/postscript-95d6a964.js` contains a dynamic import of `script-4-56ff712b.js`, which contains both our scripts' minified logic.

**Still to do**: Tagline/EditOnGitHub/ContentHeader/Footer components, Date/Head/PageList/RecentNotes tweaks, custom.scss port + reconciliation, static assets, i18n string tweaks.

### Phase F — Bases + Canvas
_(not started)_

### Phase G — Local verification
_(not started)_

### Phase H — CI/CD + deploy cutover
_(not started)_

### Phase I — Replay on gpunkt.org
_(not started — see plan file for gpunkt.org-specific deltas to preserve: heading-badge/im-Fokus transformer plugins, TableOfContents badge rendering, footnote-heading relabeling, its more-diverged ContentHeader)_
