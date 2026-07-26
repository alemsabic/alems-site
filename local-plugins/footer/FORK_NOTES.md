# Local fork: footer

Forked from https://github.com/quartz-community/footer at commit
`329ed399aca778251f604ffb8fdd3eb1c7f45f51` (main branch, 2026-07-26).

## Patch applied (`src/components/Footer.tsx`)

Replaced the stock "Created with Quartz vX.Y.Z" line with v4's hardcoded personal links (Alem
Šabić's site, x.com/sarajevo), ported unchanged. This is why `quartz.config.yaml`'s footer
`options.links` entry is otherwise just extra links appended after this line (same as v4 — v4
also passed `links: {}`, i.e. empty, since the real content is hardcoded in the component itself).

To refresh against upstream: diff this against a fresh clone, re-apply the same replacement in
`src/components/Footer.tsx`.
