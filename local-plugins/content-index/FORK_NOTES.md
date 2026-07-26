# Local fork: content-index

Forked from https://github.com/quartz-community/content-index at commit
`1342d1eacfdabbcefa2c6a26f8346945a9d9860f` (main branch, 2026-07-26).

## Patch applied

Adds an optional `shortTitle` field to `ContentDetails` (`src/emitter.ts`), threaded through from
frontmatter, so `FileTrieNode`'s `displayName` getter (`quartz/util/fileTrie.ts`, core) can fall
back to it for Explorer/Breadcrumbs navigation labels on long Zotero-imported titles. See
`shortTitle` documentation in `CLAUDE.md` for the full feature description.

To refresh against upstream: diff this against a fresh clone of the repo above, re-apply the two
`shortTitle` lines in `src/emitter.ts`.
