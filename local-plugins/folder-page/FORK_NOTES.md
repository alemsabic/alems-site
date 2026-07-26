# Local fork: folder-page

Forked from https://github.com/quartz-community/folder-page at commit
`213a8e98c4347aca9013c0dd5a15bc80a1dca604` (main branch, 2026-07-26).

## Patch applied (`src/components/PageList.tsx`)

Same patch as `local-plugins/tag-page` (identical duplicated file upstream): removed the per-item
`<p class="meta"><DateDisplay .../></p>` date block and the now-unused `DateDisplay`
component/`DateComponentProps` type. See `local-plugins/tag-page/FORK_NOTES.md` for the debugging
note on why the core `quartz/components/PageList.tsx` edit alone wasn't sufficient.

To refresh against upstream: diff this against a fresh clone, re-apply the same removal to
`src/components/PageList.tsx`.
