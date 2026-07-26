# Local fork: content-meta

Forked from https://github.com/quartz-community/content-meta at commit
`3066ef3eaf88c08c7e123d07cc3be8e07b2f4e10` (main branch, 2026-07-26).

## Patch applied (`src/i18n/locales/de-DE.ts`)

Changed the German `readingTime` phrasing from stock `"X Min. Lesezeit"` to v4's
`"X Minuten Lesezeit."` (with singular `"1 Minute Lesezeit."` handling and a trailing period),
matching the old core `quartz/i18n/locales/de-DE.ts` override.

Not forking the English locale's matching v4 tweak ("X minutes read." vs stock "X min read") —
the site's `configuration.locale` is `de-DE`, so `en-US` strings are never actually served; v4's
own inventory flagged this as low-value even at the time.

Note: `content-meta` itself is excluded on regular content pages (`quartz.config.yaml`'s
`layout.byPageType.content.exclude`, since `ContentHeader` — `local-plugins/site-components` —
shows a richer metadata line there instead) — this string is now only visible on folder/tag list
pages.

To refresh against upstream: diff this against a fresh clone, re-apply the same string change to
`src/i18n/locales/de-DE.ts`.
