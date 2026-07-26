# Quartz v4 → v5 Migration Runbook

Status: **Phases A–G done and pushed to the `v5` branch. `v4` (production, live on Cloudflare
Pages) is untouched.** One open item is under investigation before Phase H — see "Current status
and how to continue" immediately below. Update this file as each phase actually executes (commands
run, gotchas hit, final config). This is the artifact that makes replaying the same migration on
the sister project (`/Users/alemsabic/Desktop/gpunkt.org`) mechanical instead of exploratory —
gpunkt.org has no CLAUDE.md of its own to lean on, so this doc carries the institutional memory.

Full research/design context lives in the plan this runbook was seeded from:
`/Users/alemsabic/.claude/plans/ja-recherchier-das-mal-compressed-sutherland.md` (until that path
is cleaned up by the harness — treat this file as the durable copy).

## Current status and how to continue (read this first if picking this up fresh)

**If you are a new Claude session opening this repo cold: start here, not at the top of the
execution log below.**

### What's done

- Phases A through G are complete, verified in real builds and in an actual browser (not just
  build success), and pushed to the `v5` branch. `git log v5` has the full commit-by-commit trail;
  each phase section further down in this file has the detailed narrative, including three real
  bugs found and fixed purely by looking at rendered output (Explorer `shortTitle`, citation
  tooltips, `CustomOgImages` title concatenation — see the "Phase G" section below for all three).
- The `v5` branch is currently checked out locally. `v4` (the live, deployed branch) has not been
  touched since Phase A and is not affected by anything on `v5` until Phase H actually happens.
- `npm run check` (TypeScript + prettier) is clean except for `content/` and harness config files,
  neither in scope.

### Open item: a 4th real bug, found by the user, not yet fixed (deliberately paused)

While spot-checking the running `v5` site locally against memory of the old `v4` site, the user
(not automated testing) noticed the body text was rendering in the wrong font — `Source Sans Pro`
instead of the configured `JetBrains Mono`. Investigated together on 2026-07-26; **root cause is
understood, but the fix has deliberately not been applied yet** — the user asked to slow down,
think it through fully, and revisit calmly rather than patch reactively. Full technical writeup is
in the "Phase G addendum" section further down (search for "quartz-fonts plugin conflict"). One
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

**Next action, next session**: revisit this calmly with the user, decide between the two options
(or a third one neither of us has thought of yet), apply it, rebuild, and re-verify the correct
font renders — ideally with a real side-by-side against a screenshot of the live `v4` site, since
that's how the user caught this in the first place and a fresh screenshot comparison is the most
reliable way to confirm it's actually fixed, not just "build succeeds."

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

### Phase G — Local verification (in progress)

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

### Phase G addendum — 4th bug found by the user (2026-07-26, session end): quartz-fonts plugin conflict

**Status: diagnosed in full, deliberately NOT fixed yet.** The user asked to pause and think it
through calmly rather than patch reactively — this section is that write-up, so the decision can
be picked up fresh next time without re-deriving any of it.

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

### Phase H — CI/CD + deploy cutover

_(not started — this is the point where changes start affecting the live/production site; per
earlier discussion with the user, this phase requires their explicit go-ahead before any actual
cutover action, even though everything up to and including a Cloudflare Pages **preview**
deployment can proceed without it.)_

### Phase I — Replay on gpunkt.org

_(not started — see plan file for gpunkt.org-specific deltas to preserve: heading-badge/im-Fokus transformer plugins, TableOfContents badge rendering, footnote-heading relabeling, its more-diverged ContentHeader)_
