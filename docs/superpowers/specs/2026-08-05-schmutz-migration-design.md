# Design: ale.ms → Schmutz (schmutz.schund.org) migration

## Goal

Move this site from the domain `ale.ms` to the subdomain `schmutz.schund.org`, rebranded as
**Schmutz** with the tagline **"Notizen zum Magazin"** (where "Magazin" links to `schund.org`, the
Substack sitting on the root of that domain — set up in a prior session). `ale.ms` is being let go
(not renewed) once the move is verified; no redirect is wanted.

## Decisions made during brainstorming

- **Email on ale.ms** (MX + DKIM, Cloudflare Email Routing): unused. No migration needed — lapses
  with the domain.
- **Redirect strategy**: none. Clean cutover, not a permanent redirect.
- **Cloudflare Pages project**: reuse the existing `ale-ms` project (confirmed via API: connected to
  GitHub repo `alemsabic/alems-site`, production branch `v5` — this is the real live site). Do not
  create a new project.
- **Orphaned `alems-site`-named Pages project**: a same-account, confusingly-named *different*
  Cloudflare Pages project, actually connected to the unrelated `nekontam-site` GitHub repo on its
  old `v4` branch, no custom domain. Deletion was attempted at the user's request (there's a known
  months-old Cloudflare bug preventing deletion of unused Pages projects) but failed with an
  auth/permission error before the bug could even be tested. **Left alone, out of scope for this
  migration** — belongs to nekontam, not to this project.
- **Tagline component**: extend `local-plugins/site-components/src/components/Tagline.tsx` with a
  new `linkPosition: "before" | "after"` option, default `"before"` (backward-compatible — every
  other site keeps working unchanged). Schmutz is the first consumer of `"after"`.
- **Cutover order**: staged, not one-shot. Add `schmutz.schund.org` as a second custom domain on the
  `ale-ms` project, verify it live, *then* remove `ale.ms` from the project. No moment where nothing
  is live.
- **Local working directory**: stays `/Users/alemsabic/Desktop/ale.ms`. Not renamed — the GitHub repo
  also stays `alems-site`. Only the domain and on-site branding change.
- **Sister-repo docs are in scope**: gpunkt.org's and stilistik.org's own `CLAUDE.md` files name this
  project "ale.ms" (with its local path) in their "Sister Projects" section — these get updated too,
  in the same effort.

## A. Infrastructure (Cloudflare)

1. Add `schmutz.schund.org` as an additional custom domain on the existing `ale-ms` Pages project
   (via API — DNS record + SSL cert are auto-provisioned, since `schund.org` is a zone in the same
   Cloudflare account).
2. Wait for the certificate to go active; verify the site under the new domain (loads, title/tagline
   correct, Giscus comments still map correctly — Giscus maps discussions by pathname, not full
   domain, so existing discussion threads should carry over without reconfiguration).
3. Only after verification: remove `ale.ms` as a custom domain from the `ale-ms` project. No
   redirect is configured — `ale.ms` simply stops serving the site from that point on. Its MX/DKIM
   records and domain registration are left alone to lapse naturally.
4. `schund.org`'s root (Substack) DNS/redirect setup from the prior session is untouched — the
   `schmutz` subdomain is independent of the root.

## B. Code & configuration (this repo)

**`local-plugins/site-components/src/components/Tagline.tsx`**
Add `linkPosition?: "before" | "after"` to `TaglineOptions`, default `"before"`. When `"after"`,
render the plain text first, then the link. Rebuild (`npm install && npm run build` inside that
plugin directory) and restart the dev server before relying on local `--serve` to reflect it (dist
is loaded once at startup, per this repo's own `CLAUDE.md`).

**`quartz.config.yaml`**
- `configuration.pageTitle`: `ale.ms` → `Schmutz`
- `configuration.baseUrl`: `ale.ms` → `schmutz.schund.org`
- `configuration.pageTitleSuffix`: unchanged (`Alem Šabić's Notizen und Quellen`) — same author,
  only the site name changes.
- Both `tagline` plugin blocks (the `not-index`/left-column one and the `is-index`/hero one):
  `linkText: Magazin`, `linkUrl: https://schund.org`, `text: "Notizen zum "`, new
  `linkPosition: after` → renders "Notizen zum **Magazin**".
- `comments.options.themeUrl` (Giscus): `https://ale.ms/static/giscus` →
  `https://schmutz.schund.org/static/giscus`.

**Explicitly unchanged**: `og-image` emitter, `custom.scss`, `Footer.tsx` (Alem Šabić / x.com/sarajevo
links are author identity, not domain identity), `quartz.ts`.

## C. Documentation

**Updated (this repo):**
- `CLAUDE.md`: Project Overview (name, live site), Site Identity section (title/tagline), Deployment
  section (domain), the Giscus `themeUrl` note, base-URL mentions.
- `CUSTOM-MODIFICATIONS.md`: the `themeUrl` paragraph. The existing "Verified live 2026-07-27: curl
  https://ale.ms/..." log line is left as a historical record (per this project's own stated
  convention that resolved/historical narrative isn't rewritten, git history has the trail) with a
  short added note that the domain has since migrated.

**Updated (sister repos, same effort):**
- `/Users/alemsabic/Desktop/gpunkt.org/CLAUDE.md` — "Sister Projects" section: `ale.ms
  (/Users/alemsabic/Desktop/ale.ms)` → `Schmutz (schmutz.schund.org, local path
  /Users/alemsabic/Desktop/ale.ms)`.
- `/Users/alemsabic/Desktop/stilistik.org/CLAUDE.md` — same rename, at both of its two mentions
  (intro sentence + the "ale.ms and gpunkt.org are both live..." sentence).
- These are edits only; per standing instructions, commits in those repos happen only if/when asked.

**Explicitly out of scope:**
- `upgrade.md` — v4→v5 Quartz migration history, unrelated to the domain rename.
- `README.md` — stock Quartz, no personalization to update.
- The ~13 `// ale.ms/gpunkt.org customization: ...` comments scattered through `local-plugins/*` —
  these label shared code lineage across sister sites, not a live reference; cosmetic-only, no
  functional or user-facing effect, not worth the churn.
- Local working directory name and GitHub repo name (`alems-site`) — confirmed staying as-is.

**Manual, external, not executable by Claude:**
- Plausible Analytics: a new site/property for `schmutz.schund.org` needs to be added in the user's
  Plausible dashboard directly.

## Cutover sequence

1. Implement Tagline `linkPosition` change, rebuild the plugin.
2. Update `quartz.config.yaml` (title, baseUrl, tagline options, Giscus themeUrl).
3. Update `CLAUDE.md` and `CUSTOM-MODIFICATIONS.md` in this repo.
4. Update the two sister repos' `CLAUDE.md` "Sister Projects" sections.
5. Commit and push to `v5` (only once the user asks) → Cloudflare auto-deploys.
6. Add `schmutz.schund.org` as a custom domain on the `ale-ms` Pages project via API.
7. Verify the live site under the new domain.
8. Remove `ale.ms` as a custom domain from the `ale-ms` project.
9. Remind the user about the manual Plausible step.
