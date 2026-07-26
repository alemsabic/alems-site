import type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
} from "@quartz-community/types";
// @ts-expect-error - inline script import handled by Quartz bundler
import footnotesScript from "./scripts/footnotes.inline.ts";
// @ts-expect-error - inline script import handled by Quartz bundler
import tooltipsScript from "./scripts/tooltips.inline.ts";

export interface SiteScriptsOptions {}

// Invisible component whose only job is carrying ale.ms/gpunkt.org's global page-behavior
// scripts (SPA-aware footnote highlighting, citation tooltip HTML-entity decoding). Ported
// from v4's Body.tsx, which attached these the same way — as afterDOMLoaded on a component
// that's present on every page. componentResources.ts aggregates afterDOMLoaded across every
// component in the layout regardless of visual role, so this doesn't need to live in any
// particular page-type plugin.
export default (() => {
  const SiteScripts: QuartzComponent = (_props: QuartzComponentProps) => null;

  SiteScripts.afterDOMLoaded = `
    ${footnotesScript};
    ${tooltipsScript};
  `;

  return SiteScripts;
}) satisfies QuartzComponentConstructor;
