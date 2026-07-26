# Local fork: tag-page

Forked from https://github.com/quartz-community/tag-page at commit
`a651839686ed2bd7e58beb01709b9a682dc9add8` (main branch, 2026-07-26).

## Patch applied (`src/components/PageList.tsx`)

Removed the per-item `<p class="meta"><DateDisplay .../></p>` date block (and the now-unused
`DateDisplay` component/`DateComponentProps` type) — v4's list pages never showed a date next to
each entry.

**Debugging note**: this plugin bundles its own private copy of `PageList.tsx` — it does NOT
import from the core repo's `quartz/components/PageList.tsx` (confirmed: nothing in `quartz/`
imports that core file at all). Editing the core file first (which I did, mirroring v4's
`PageList.tsx` edit 1:1) had **no effect** on tag/folder pages — caught via a real build showing
`class="meta"` still present. `folder-page` has an identical duplicated `PageList.tsx` needing the
same patch — see `local-plugins/folder-page/FORK_NOTES.md`. The core file edit was left in place
(harmless, matches intent) but is currently dead code in v5.

To refresh against upstream: diff this against a fresh clone, re-apply the same removal to
`src/components/PageList.tsx`.
