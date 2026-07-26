# Local fork: recent-notes

Forked from https://github.com/quartz-community/recent-notes at commit
`2c36e87f151431b7fb05a486705adfa790126622` (main branch, 2026-07-26).

## Patches applied (`src/components/RecentNotes.tsx`)

1. **Index-only rendering**: added an early `if (fileData.slug !== "index") return null;` guard.
   v4 achieved the same thing with `Component.ConditionalRender({component: RecentNotes(...),
   condition: (page) => page.fileData.slug === "index"})` in `quartz.layout.ts`. Baking the check
   into the component itself avoids needing a `quartz.ts` TS override or a custom
   `registerCondition()` call — `loadQuartzLayout()`'s per-pageType override merge is shallow
   (`{...mergedByPageType[pageType], ...overrideLayout}`), so a TS override of `afterBody` would
   have replaced the whole array rather than one entry, which felt fragile against future YAML
   changes.
2. **Removed the per-item date display** (`<p class="meta"><time>...</time></p>` block) — v4's
   `RecentNotes.tsx` never showed a date on recent-notes list items. Also dropped the now-unused
   `formatDate` import.
3. **Never lists the index page itself** (`.filter((p) => p.slug !== "index")`) — v4 passed this
   as a `filter` callback in `quartz.config.ts` (function options can't be expressed in YAML), so
   it's baked into the fork instead of needing a `quartz.ts` TS override.

To refresh against upstream: diff this against a fresh clone, re-apply both changes to
`src/components/RecentNotes.tsx`.
