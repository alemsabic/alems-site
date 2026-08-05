# Schmutz Migration (ale.ms → schmutz.schund.org) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand this Quartz site from `ale.ms` to **Schmutz**, served at `schmutz.schund.org`
(tagline "Notizen zum Magazin", linking to the Substack at `schund.org`), and retire `ale.ms`
without a redirect once the new domain is verified live.

**Architecture:** No new systems. A one-prop extension to an existing Preact component
(`Tagline`), a handful of config/doc edits in this repo and two sibling repos, and three
Cloudflare API calls (add custom domain → verify → remove old custom domain) against the
existing `ale-ms` Pages project. Spec:
`docs/superpowers/specs/2026-08-05-schmutz-migration-design.md`.

**Tech Stack:** Quartz v5, Preact/TSX (`react-jsx` automatic runtime, `jsxImportSource: preact`),
tsup, TypeScript, Cloudflare Pages REST API.

## Global Constraints

- No redirect from `ale.ms` — clean cutover, `ale.ms` simply stops serving once removed.
- Local working directory stays `/Users/alemsabic/Desktop/ale.ms`; GitHub repo stays
  `alems-site`. Not renamed.
- Cloudflare Pages project name stays `ale-ms` — reused, not recreated.
- `Tagline`'s new `linkPosition` option defaults to `"before"` — every existing consumer
  (alemsabic.com's, gpunkt.org's, stilistik.org's own tagline configs) must keep rendering
  exactly as before. Schmutz is the only consumer that passes `"after"`.
- Any edit under `local-plugins/*/src/**` requires `npm install && npm run build` inside that
  plugin's own directory, then a full dev-server kill+restart before it's visible under
  `--serve` — the running server loads `dist/` once at startup and never rebuilds it
  (`quartz/styles/custom.scss` is the one exception that hot-reloads; not touched here).
- The orphaned Cloudflare Pages project confusingly named `alems-site` (actually connected to
  the unrelated `nekontam-site` repo, `v4` branch, no custom domain) is out of scope. Do not
  touch it.
- Commit only the files each task lists — no unrelated cleanup.

---

### Task 1: Extend `Tagline` with a `linkPosition` option

**Files:**
- Modify: `local-plugins/site-components/src/components/Tagline.tsx`

**Interfaces:**
- Produces: `TaglineOptions` gains `linkPosition: "before" | "after"` (default `"before"`).
  `quartz.config.yaml`'s `tagline` plugin entries (Task 3) will pass `linkPosition: after` for
  Schmutz's config.

- [ ] **Step 1: Read the current file to confirm line numbers before editing**

Run: `sed -n '1,40p' local-plugins/site-components/src/components/Tagline.tsx`

- [ ] **Step 2: Replace the component with the `linkPosition`-aware version**

Replace the full file contents with:

```tsx
import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types";
import { classNames } from "@quartz-community/utils/lang";

export interface TaglineOptions {
  /** Text of the link */
  linkText: string;
  /** URL the link points to */
  linkUrl: string;
  /** The plain-text part (include leading/trailing space/punctuation as needed) */
  text: string;
  /** Whether the link renders before or after the plain text. Defaults to "before". */
  linkPosition: "before" | "after";
}

const defaultOptions: TaglineOptions = {
  linkText: "Alem Šabićs",
  linkUrl: "https://alemsabic.com",
  text: " Zettelkästchen der Notizen, Quellen und Ideen.",
  linkPosition: "before",
};

// Styling for .tagline lives in quartz/styles/custom.scss (centralized there like every other
// site-wide style), not inlined here via Component.css.
export default ((opts?: Partial<TaglineOptions>) => {
  const options: TaglineOptions = { ...defaultOptions, ...opts };

  const Tagline: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const link = <a href={options.linkUrl}>{options.linkText}</a>;
    const parts = options.linkPosition === "after" ? [options.text, link] : [link, options.text];
    return <div class={classNames(displayClass, "tagline", "desktop-only")}>{parts}</div>;
  };

  return Tagline;
}) satisfies QuartzComponentConstructor<TaglineOptions>;
```

- [ ] **Step 3: Typecheck the plugin**

Run: `cd local-plugins/site-components && npm run typecheck`
Expected: exits 0, no errors.

- [ ] **Step 4: Build the plugin**

Run: `cd local-plugins/site-components && npm install && npm run build`
Expected: `dist/` is rebuilt without errors (this package has no test script — `typecheck` +
`build` is the verification, matching this package's own existing conventions; see
`package.json`'s `scripts`).

- [ ] **Step 5: Commit**

```bash
cd /Users/alemsabic/Desktop/ale.ms
git add local-plugins/site-components/src/components/Tagline.tsx local-plugins/site-components/dist
git commit -m "feat(tagline): support rendering the link after the text"
```

---

### Task 2: Rebrand `quartz.config.yaml`

**Files:**
- Modify: `quartz.config.yaml:3` (`pageTitle`)
- Modify: `quartz.config.yaml:10` (`baseUrl`)
- Modify: `quartz.config.yaml:223-226` (first `tagline` block, `not-index`)
- Modify: `quartz.config.yaml:241-244` (second `tagline` block, `is-index`)
- Modify: `quartz.config.yaml:290` (Giscus `themeUrl`)

**Interfaces:**
- Consumes: `Tagline`'s new `linkPosition` option from Task 1.

- [ ] **Step 1: Update `pageTitle`**

In `quartz.config.yaml`, change:

```yaml
  pageTitle: ale.ms
```

to:

```yaml
  pageTitle: Schmutz
```

- [ ] **Step 2: Update `baseUrl`**

Change:

```yaml
  baseUrl: ale.ms
```

to:

```yaml
  baseUrl: schmutz.schund.org
```

- [ ] **Step 3: Update the first `tagline` block (lines ~219-230, `not-index`)**

Change:

```yaml
  - source:
      repo: ./local-plugins/site-components
      name: tagline
    enabled: true
    options:
      linkText: Alem Sabics
      linkUrl: https://alemsabic.com
      text: " Notizbuch."
    layout:
      position: left
      priority: 20
      condition: not-index
```

to:

```yaml
  - source:
      repo: ./local-plugins/site-components
      name: tagline
    enabled: true
    options:
      linkText: Magazin
      linkUrl: https://schund.org
      text: "Notizen zum "
      linkPosition: after
    layout:
      position: left
      priority: 20
      condition: not-index
```

- [ ] **Step 4: Update the second `tagline` block (lines ~237-248, `is-index`)**

Change:

```yaml
  - source:
      repo: ./local-plugins/site-components
      name: tagline
    enabled: true
    options:
      linkText: Alem Sabics
      linkUrl: https://alemsabic.com
      text: " Notizbuch."
    layout:
      position: beforeBody
      priority: -1
      condition: is-index
```

to:

```yaml
  - source:
      repo: ./local-plugins/site-components
      name: tagline
    enabled: true
    options:
      linkText: Magazin
      linkUrl: https://schund.org
      text: "Notizen zum "
      linkPosition: after
    layout:
      position: beforeBody
      priority: -1
      condition: is-index
```

- [ ] **Step 5: Update the Giscus `themeUrl`**

Change:

```yaml
        themeUrl: https://ale.ms/static/giscus
```

to:

```yaml
        themeUrl: https://schmutz.schund.org/static/giscus
```

- [ ] **Step 6: Run the project's own config/type check**

Run: `npm run check`
Expected: exits 0 (this is this repo's own documented verification command — see `CLAUDE.md`'s
"Key Commands").

- [ ] **Step 7: Commit**

```bash
git add quartz.config.yaml
git commit -m "feat: rebrand site as Schmutz, move baseUrl to schmutz.schund.org"
```

---

### Task 3: Local visual verification

**Files:** none (verification-only task, no new changes)

**Interfaces:**
- Consumes: Task 1's rebuilt `local-plugins/site-components/dist`, Task 2's `quartz.config.yaml`.

- [ ] **Step 1: Full restart of the dev server**

`local-plugins/*` dist is loaded once at server startup — a plain file save will not pick up
Task 1's rebuilt component. Kill any running `quartz build --serve` process, then:

Run: `npx quartz plugin install --from-config && npx quartz build --serve`

- [ ] **Step 2: Open the homepage and a content page in a browser**

Check at `http://localhost:8080`:
- Browser tab title reads "Schmutz" (not "ale.ms").
- Hero tagline on the homepage reads "Notizen zum **Magazin**" with "Magazin" as a link.
- Open any content page (non-index): the left-column tagline also reads "Notizen zum
  **Magazin**" with "Magazin" linked.
- Hover/inspect the "Magazin" link: points to `https://schund.org`.

- [ ] **Step 3: Confirm the link target resolves as expected**

Run: `curl -sI https://schund.org | head -1`
Expected: `HTTP/2 200` (confirms the target of the new tagline link is live — set up in a prior
session).

No commit — this task makes no file changes.

---

### Task 4: Rebrand this repo's `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md:1`, `CLAUDE.md:104-105`, `CLAUDE.md:151`, `CLAUDE.md:154`, `CLAUDE.md:208`

**Interfaces:** none (documentation only).

- [ ] **Step 1: Update the title line**

Change:

```markdown
# Claude Code Instructions - Quartz Repository (ale.ms)
```

to:

```markdown
# Claude Code Instructions - Quartz Repository (Schmutz / schmutz.schund.org)
```

- [ ] **Step 2: Update the Project Overview `Purpose` and `Live Site` lines**

Change:

```markdown
- **Purpose**: ale.ms - Quellenangaben und Schulungsunterlagen von Alem Sabic
- **Live Site**: https://ale.ms
```

to:

```markdown
- **Purpose**: Schmutz (schmutz.schund.org) - Notizen zum Magazin, von Alem Sabic
- **Live Site**: https://schmutz.schund.org
```

(Leave the `**Name**: alems-site` line above it untouched — the repo name does not change; see
Global Constraints.)

- [ ] **Step 3: Update the Site Identity section**

Change:

```markdown
- Page title: "ale.ms"
- Tagline text: configurable via `quartz.config.yaml`'s `tagline` plugin entry (see
  `CUSTOM-MODIFICATIONS.md`)
- Base URL: `ale.ms` (bare, no `https://` scheme — v5 convention, verified not to cause
  double/missing-scheme issues in RSS/sitemap output)
```

to:

```markdown
- Page title: "Schmutz"
- Tagline text: "Notizen zum Magazin" — "Magazin" links to https://schund.org (the Substack on
  that domain's root). Configurable via `quartz.config.yaml`'s `tagline` plugin entry (see
  `CUSTOM-MODIFICATIONS.md`)
- Base URL: `schmutz.schund.org` (bare, no `https://` scheme — v5 convention, verified not to
  cause double/missing-scheme issues in RSS/sitemap output)
```

- [ ] **Step 4: Update the Deployment section's `Project` line**

Change:

```markdown
- **Project**: `ale-ms`
```

to:

```markdown
- **Project**: `ale-ms` (Cloudflare Pages project name — kept as-is across the rebrand; only the
  custom domain changed). Custom domain: `schmutz.schund.org` (a subdomain of the separate
  `schund.org` zone in the same Cloudflare account). `ale.ms` was removed as this project's custom
  domain once the new domain was verified live — see
  `docs/superpowers/specs/2026-08-05-schmutz-migration-design.md`.
```

- [ ] **Step 5: Verify no unintended `ale.ms` / `ale-ms` references remain in this file**

Run: `grep -n "ale\.ms\|ale-ms" CLAUDE.md`
Expected output: only the ASCII file-tree line `ale.ms/` (the working directory name, which is
staying — see Global Constraints) and nothing else.

- [ ] **Step 6: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: rebrand CLAUDE.md for the Schmutz / schmutz.schund.org move"
```

---

### Task 5: Update `CUSTOM-MODIFICATIONS.md`

**Files:**
- Modify: `CUSTOM-MODIFICATIONS.md:296-297`
- Modify: `CUSTOM-MODIFICATIONS.md:359`

**Interfaces:** none (documentation only).

- [ ] **Step 1: Update the Giscus `themeUrl` production-domain note**

Change:

```markdown
**Important operational fact**: this file is fetched from the literal **production** domain
(`https://ale.ms/static/giscus`, see `quartz.config.yaml`'s `themeUrl`), regardless of which
build/environment is rendering the surrounding page — a change here is invisible on any preview
deploy or `localhost`, correct or not, until it's actually live in production.
```

to:

```markdown
**Important operational fact**: this file is fetched from the literal **production** domain
(`https://schmutz.schund.org/static/giscus`, see `quartz.config.yaml`'s `themeUrl`), regardless of
which build/environment is rendering the surrounding page — a change here is invisible on any
preview deploy or `localhost`, correct or not, until it's actually live in production.
```

- [ ] **Step 2: Annotate (don't rewrite) the historical verification line**

Change:

```markdown
Verified live 2026-07-27: `curl https://ale.ms/Literatur/@ahrens_2017` returns exactly this redirect
page, not a 404. The same plugin also handles genuine frontmatter `aliases:` redirects — same
mechanism, different trigger.
```

to:

```markdown
Verified live 2026-07-27: `curl https://ale.ms/Literatur/@ahrens_2017` returns exactly this redirect
page, not a 404 (site has since moved to `schmutz.schund.org`, see
`docs/superpowers/specs/2026-08-05-schmutz-migration-design.md` — re-verify against the new domain
after the next case-sensitivity-relevant change). The same plugin also handles genuine frontmatter
`aliases:` redirects — same mechanism, different trigger.
```

- [ ] **Step 3: Commit**

```bash
git add CUSTOM-MODIFICATIONS.md
git commit -m "docs: update CUSTOM-MODIFICATIONS.md for the schmutz.schund.org domain"
```

---

### Task 6: Push this repo's changes

**Files:** none (git operation only).

- [ ] **Step 1: Confirm the branch and pending commits**

Run: `git status && git log --oneline origin/v5..HEAD`
Expected: on branch `v5`, exactly the commits from Tasks 1, 2, 4, 5 (plus the earlier design-spec
commit) ahead of `origin/v5`.

- [ ] **Step 2: Push**

Run: `git push`

- [ ] **Step 3: Confirm Cloudflare Pages picks up the deployment**

Wait ~1-2 minutes (this repo's documented deploy time), then check the latest deployment via the
Cloudflare API:

```javascript
async () => {
  const res = await cloudflare.request({
    method: "GET",
    path: "/accounts/f4988625e1717cfd9f32c2175468e16e/pages/projects/ale-ms/deployments",
    query: { per_page: 1 }
  });
  return res.result[0];
}
```

Expected: `latest_stage.status` is `success` and `deployment_trigger.metadata.commit_hash` matches
the commit just pushed.

No further commit — this task is push + verification only.

---

### Task 7: Update `gpunkt.org/CLAUDE.md`'s Sister Projects section

**Files:**
- Modify: `/Users/alemsabic/Desktop/gpunkt.org/CLAUDE.md` (Sister Projects section)

**Interfaces:** none (documentation only, separate repo).

- [ ] **Step 1: Update the Sister Projects sentence**

Change:

```markdown
This project, **ale.ms** (`/Users/alemsabic/Desktop/ale.ms`), and **stilistik.org**
(`/Users/alemsabic/Desktop/stilistik.org`) are all Quartz v5 sites maintained by the same person,
```

to:

```markdown
This project, **Schmutz** (`schmutz.schund.org`, local path `/Users/alemsabic/Desktop/ale.ms`), and
**stilistik.org** (`/Users/alemsabic/Desktop/stilistik.org`) are all Quartz v5 sites maintained by
the same person,
```

- [ ] **Step 2: Verify no other `ale.ms` reference remains in that file**

Run: `grep -n "ale\.ms" /Users/alemsabic/Desktop/gpunkt.org/CLAUDE.md`
Expected: no output.

- [ ] **Step 3: Commit (in the gpunkt.org repo — only once the user confirms this step)**

```bash
cd /Users/alemsabic/Desktop/gpunkt.org
git add CLAUDE.md
git commit -m "docs: update Sister Projects section, ale.ms is now Schmutz (schmutz.schund.org)"
```

---

### Task 8: Update `stilistik.org/CLAUDE.md`'s Sister Projects section

**Files:**
- Modify: `/Users/alemsabic/Desktop/stilistik.org/CLAUDE.md` (Sister Projects section, two
  mentions)

**Interfaces:** none (documentation only, separate repo).

- [ ] **Step 1: Update the first mention**

Change:

```markdown
This project, **ale.ms** (`/Users/alemsabic/Desktop/ale.ms`), and **gpunkt.org**
(`/Users/alemsabic/Desktop/gpunkt.org`) are all Quartz v5 sites maintained by the same person, kept
```

to:

```markdown
This project, **Schmutz** (`schmutz.schund.org`, local path `/Users/alemsabic/Desktop/ale.ms`), and
**gpunkt.org** (`/Users/alemsabic/Desktop/gpunkt.org`) are all Quartz v5 sites maintained by the
same person, kept
```

- [ ] **Step 2: Update the second mention**

Change:

```markdown
`upgrade.md` structure. ale.ms and gpunkt.org are both live and fully migrated to Quartz v5; this
```

to:

```markdown
`upgrade.md` structure. Schmutz and gpunkt.org are both live and fully migrated to Quartz v5; this
```

- [ ] **Step 3: Verify no other `ale.ms` reference remains in that file**

Run: `grep -n "ale\.ms" /Users/alemsabic/Desktop/stilistik.org/CLAUDE.md`
Expected: no output.

- [ ] **Step 4: Commit (in the stilistik.org repo — only once the user confirms this step)**

```bash
cd /Users/alemsabic/Desktop/stilistik.org
git add CLAUDE.md
git commit -m "docs: update Sister Projects section, ale.ms is now Schmutz (schmutz.schund.org)"
```

---

### Task 9: Add `schmutz.schund.org` as a Cloudflare Pages custom domain

**Files:** none (Cloudflare API only).

**Interfaces:**
- Consumes: `ale-ms` Pages project (account `f4988625e1717cfd9f32c2175468e16e`), `schund.org`
  zone `07c336d0ec196bc7a8a2085a9f67d205` (both already confirmed to exist in the connected
  Cloudflare account).

**Gate:** run this only after Task 6's deployment is confirmed `success` — the custom domain
should point at a build that already has the new branding, not the old `ale.ms` one.

- [ ] **Step 1: Add the custom domain**

```javascript
async () => {
  const res = await cloudflare.request({
    method: "POST",
    path: "/accounts/f4988625e1717cfd9f32c2175468e16e/pages/projects/ale-ms/domains",
    body: { name: "schmutz.schund.org" }
  });
  return res;
}
```

Expected: `success: true`, `result.status` is `"pending"` or `"initializing"`.

- [ ] **Step 2: Poll until the domain is active**

```javascript
async () => {
  const res = await cloudflare.request({
    method: "GET",
    path: "/accounts/f4988625e1717cfd9f32c2175468e16e/pages/projects/ale-ms/domains/schmutz.schund.org"
  });
  return { status: res.result.status, verification_data: res.result.verification_data };
}
```

Expected (may take a few minutes): `status` becomes `"active"`.

---

### Task 10: Verify the live site under the new domain

**Files:** none (verification only).

- [ ] **Step 1: Confirm the site serves correctly over HTTPS**

Run: `curl -sI https://schmutz.schund.org | head -5`
Expected: `HTTP/2 200`, a valid TLS handshake (curl doesn't error out).

- [ ] **Step 2: Confirm branding in the served HTML**

Run: `curl -s https://schmutz.schund.org | grep -o "<title>[^<]*</title>"`
Expected: contains "Schmutz".

- [ ] **Step 3: Manual browser check**

Open `https://schmutz.schund.org` directly (not via localhost) and confirm:
- Tagline "Notizen zum Magazin" renders, "Magazin" links to `https://schund.org`.
- Open a content page, click through to a Giscus comment thread that existed under `ale.ms`
  before the migration, confirm the same discussion still loads (Giscus maps by `pathname`, not
  full domain — see `quartz.config.yaml`'s `mapping: pathname`).

**Stop and get explicit user confirmation before Task 11** — removing `ale.ms` is the one step
in this plan that's not cleanly reversible in effect (no redirect is configured, per the spec).

---

### Task 11: Remove `ale.ms` as a custom domain from the `ale-ms` project

**Files:** none (Cloudflare API only).

**Gate:** only after the user has explicitly confirmed Task 10's verification looked good.

- [ ] **Step 1: Remove the domain**

```javascript
async () => {
  const res = await cloudflare.request({
    method: "DELETE",
    path: "/accounts/f4988625e1717cfd9f32c2175468e16e/pages/projects/ale-ms/domains/ale.ms"
  });
  return res;
}
```

Expected: `success: true`.

- [ ] **Step 2: Confirm the project's domain list now only shows the new domain**

```javascript
async () => {
  const res = await cloudflare.request({
    method: "GET",
    path: "/accounts/f4988625e1717cfd9f32c2175468e16e/pages/projects/ale-ms"
  });
  return res.result.domains;
}
```

Expected: `["ale-ms.pages.dev", "schmutz.schund.org"]` — `ale.ms` no longer listed.

- [ ] **Step 3: Remind the user of the one remaining manual step**

Tell the user: add a new site/property for `schmutz.schund.org` in the Plausible Analytics
dashboard directly — not reachable via any tool available in this session.

---

## Self-Review Notes

- **Spec coverage**: every item in the design spec's sections A–C and the cutover sequence maps
  to a task above (A → Tasks 9-11, B → Tasks 1-3, C → Tasks 4-8, manual Plausible step → Task
  11 Step 3).
- **Placeholder scan**: no TBD/TODO; every step has literal file content, commands, or code.
- **Type consistency**: `TaglineOptions.linkPosition` introduced in Task 1 is consumed with the
  exact same field name and the same two literal values (`"before"`/`"after"`) in Task 2's YAML.
- Tasks 7-8 commit inside repos other than this one — flagged explicitly as needing separate
  user confirmation at execution time, per standing project convention (commits only when asked).
