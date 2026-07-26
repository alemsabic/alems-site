# Local fork: explorer

Forked from https://github.com/quartz-community/explorer at commit
`06ea3d8e206f0edaab08556191adc75b2403e832` (main branch, 2026-07-26).

## Patch applied (`src/components/scripts/explorer.inline.ts`)

Added a `shortTitle` fallback to the client-side `FileTrieNode.displayName` getter, matching the
server-side `quartz/util/fileTrie.ts` getter (core, patched directly — see `CLAUDE.md`'s
`shortTitle` docs).

**Found via real browser testing, not static analysis**: the server-rendered Breadcrumbs
correctly showed the short label ("Ahrens (2017)"), but the Explorer sidebar still showed the full
100+ character title. Traced it to this file — Explorer fetches the raw `contentIndex.json` client-side
and rebuilds its own trie in the browser with a **duplicate** `FileTrieNode` class (JS, not the
TS one), so the `shortTitle` fix applied to core `fileTrie.ts` never reached it. The underlying
data already had `shortTitle` (confirmed: `content-index`'s fork adds it to `ContentDetails`, and
`buildFileTrie()` here uses the full raw per-slug object as `this.data`) — only the getter itself
needed the same one-line fallback added to the JS copy.

To refresh against upstream: diff this against a fresh clone, re-apply the same `shortTitle`
fallback to the `displayName` getter in `src/components/scripts/explorer.inline.ts`.
