# Sister Project Tooling Alignment (Phase 0) — Design

**Date**: 2026-07-31
**Status**: Approved by user, pending implementation

## Context

ale.ms and gpunkt.org are both static sites built on Quartz, maintained as full forks of the
Quartz engine (each ships its own copy of `quartz/`, the upstream `docs/` folder, `LICENSE.txt`,
`CODE_OF_CONDUCT.md`). Each has its own auto-synced `content/` folder from a separate content
repo (alems-notizen / gpunkt-woerter respectively) — structurally parallel, content independent.

ale.ms has completed a v4→v5 Quartz migration (see ale.ms's `upgrade.md`) and has since
accumulated project-specific tooling: two MCP servers (`jdocmunch`, `jcodemunch`, both `uvx`-based,
project-scoped via `.mcp.json`) and a documentation structure split across `CLAUDE.md` (durably-true
facts, kept lean), `CUSTOM-MODIFICATIONS.md` (every deviation from stock Quartz, with mechanism and
rationale), and `upgrade.md` (migration runbook/history).

gpunkt.org is still on Quartz v4.5.1, has neither MCP server configured, and instead of a
`CLAUDE.md` has an `AGENTS.md` (Quartz v4 conventions, code style, testing) that references a
`CLAUDE.md` in five places — a file that does not exist in that repo. This is a stale leftover,
not an intentional split.

The user wants both projects to be explicitly marked as "sister projects" so that future
improvements are ported between them, and wants gpunkt.org's tooling and documentation structure
aligned with ale.ms's *before* planning gpunkt.org's own v4→v5 migration (a separate, larger
effort deliberately out of scope here — see "Out of scope" below).

## Goal

Bring gpunkt.org's tooling and documentation structure to parity with ale.ms's, and record the
sister-project relationship in both repos, without touching either repo's Quartz code, `docs/`
(stock upstream Quartz docs), or `content/` (auto-synced, out of scope by existing policy in both
repos).

## Components

1. **`.mcp.json` in gpunkt.org** — copy of ale.ms's `.mcp.json` verbatim (jdocmunch + jcodemunch,
   both `uvx`-invoked, no path references back to ale.ms, so it works unmodified in any repo).

2. **New `CLAUDE.md` for gpunkt.org** — lean, following ale.ms's `CLAUDE.md` structure:
   - Project facts: Quartz v4.5.1, Cloudflare Pages (branch `v4`), content repo
     `alemsabic/gpunkt-woerter`, repo focus (presentation only, not content).
   - jDocMunch / jCodeMunch usage policy — carried over near-verbatim from ale.ms's `CLAUDE.md`,
     since the tools and conventions are identical between the two repos.
   - A new **"Sister Project"** section near the top: points to
     `/Users/alemsabic/Desktop/ale.ms`, states both repos are Quartz-based and kept in close
     alignment, and that tooling/doc/config improvements made in one should be considered for
     porting to the other.
   - No migration-status section — that's Phase 1's concern, not this one.

3. **New `CUSTOM-MODIFICATIONS.md` for gpunkt.org** — the five items AGENTS.md currently only
   names (footnote highlighting, popover behavior, shortTitle support, German-locale citations,
   Zotero styling) get written up properly: which file(s), what the mechanism is, why it deviates
   from stock Quartz — reconstructed from the actual code, not just copied from AGENTS.md's
   filename list. This is required groundwork for Phase 1 regardless (any migration step needs to
   know what custom behavior it must re-port), so doing it now avoids redoing it later.

4. **Delete `AGENTS.md`** — its still-valid content (code style, naming conventions, testing
   patterns) is redistributed: durably-true facts into the new `CLAUDE.md`, custom-behavior
   documentation into the new `CUSTOM-MODIFICATIONS.md`. Nothing is silently dropped.

5. **Reciprocal "Sister Project" section in ale.ms's `CLAUDE.md`** — same pointer, opposite
   direction, so future ale.ms sessions know improvements should be considered for gpunkt.org too.

No `upgrade.md` is created for gpunkt.org in this phase — that file is Phase 1's artifact, created
when the actual v4→v5 migration planning begins.

## Sequence

1. Copy `.mcp.json` to gpunkt.org.
2. Write gpunkt.org's `CUSTOM-MODIFICATIONS.md` (read the actual source for each of the 5 items;
   if a mechanism can't be reconstructed unambiguously from code, flag it back to the user rather
   than guessing).
3. Write gpunkt.org's `CLAUDE.md`.
4. Delete gpunkt.org's `AGENTS.md`.
5. Add the reciprocal Sister Project section to ale.ms's `CLAUDE.md`.
6. Verify (see below).

## Verification

- Actually exercise the MCP servers in gpunkt.org (not just confirm the config file exists) —
  e.g. run `jcodemunch`'s `index_local` against gpunkt.org's `quartz/` from a session rooted
  there.
- `npm run check` in gpunkt.org still passes (this phase shouldn't touch code, but confirm nothing
  broke).
- User reads both new/edited `CLAUDE.md` files before anything is committed.

## Guardrails

- Never touch `content/` in either repo.
- Never touch `docs/` (stock upstream Quartz documentation) in either repo.
- No `git add -A` / `git add .` in gpunkt.org — stage specific files only (this was an explicit
  rule in the AGENTS.md being retired; it doesn't need to be restated in the new CLAUDE.md since
  it's already standing tool-use policy, but it applies here procedurally).
- Where AGENTS.md's description of a custom modification can't be confidently verified against
  the current code, ask the user instead of guessing.

## Out of scope (deliberately deferred to later phases)

- **Phase 1**: gpunkt.org's actual v4→v5 Quartz migration, planned as its own brainstorm/spec/plan
  cycle, informed by ale.ms's `upgrade.md` (which already has a "Phase I" checklist of gotchas to
  carry over). Not started here.
- **Phase 2**: porting ale.ms's new homepage (single-column layout, hero, Site Index, pre-zoomed
  graph) to gpunkt.org — depends on Phase 1 being done first (v5-only components).
  gpunkt.org has no `local-plugins/` yet.
- **Phase 3**: decluttering both `CLAUDE.md`/`CUSTOM-MODIFICATIONS.md` docs once gpunkt.org's
  migration is complete and both projects have stabilized on the same Quartz version.
