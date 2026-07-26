# site-scripts

Not a fork of any upstream plugin — a small local component-only plugin created during the
Quartz v4→v5 migration to carry ale.ms/gpunkt.org's global page-behavior scripts, which in v4
lived as `Body.tsx`'s `afterDOMLoaded` concatenation:

- **`footnotes.inline.ts`** — SPA-aware footnote highlighting (simulates `:target` across
  client-side navigation).
- **`tooltips.inline.ts`** — decodes HTML entities in citation tooltip `data-tooltip` attributes.

`SiteScripts` renders nothing (`null`) — it exists purely so `componentResources.ts` picks up its
`afterDOMLoaded` string, the same aggregation mechanism v4 used. Placed at `afterBody` in
`quartz.config.yaml`; position doesn't matter functionally since the scripts are global (not tied
to any particular visible widget), but they must be present on every page type the fixes should
apply to.
