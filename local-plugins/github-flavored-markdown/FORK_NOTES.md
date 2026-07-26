# Local fork: github-flavored-markdown

Forked from https://github.com/quartz-community/github-flavored-markdown at commit
`287c709c12806dca76882ab8ab79567d57ede5b4` (main branch, 2026-07-26).

## Patch applied

Adds a `sup > a` → `data-no-popover` hast-visitor to `htmlPlugins()` in `src/transformer.ts`, so
footnote reference links don't show Quartz's hover-preview popover (they link to the bottom of the
same page, not another page — a preview doesn't make sense there). Ported from v4's
`quartz/plugins/transformers/citations.ts`, which had this same fix but scoped incorrectly next to
the (now upstream-native) bibliography-link popover fix. This is genuinely a GFM/footnotes concern
(remark-gfm, which this plugin owns), not a citations concern, so it belongs here in v5.

Added `unist-util-visit` to `devDependencies` (bundled by tsup like the plugin's other markdown
deps — see `SINGLETON_EXTERNALS` in `tsup.config.ts`).

To refresh against upstream: diff this against a fresh clone of the repo above, re-apply the
`footnotePopoverFix` visitor and its two `htmlPlugins()` return-site wirings in `src/transformer.ts`,
plus the `unist-util-visit` devDependency.
