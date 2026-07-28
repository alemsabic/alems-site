# Index Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `content/index.md` into a proper Zettelkasten front page — single-column, a
prominent hero, an all-notes graph, and a new alphabetical "phone book" index of every
published note — without touching how any other page renders.

**Architecture:** Everything is scoped to `body[data-slug="index"]` (CSS) and a new
`is-index` layout condition (config), plus one new local component
(`local-plugins/site-index`) and one newly-forked one (`local-plugins/graph`, forked solely
to reach its locale strings). No new page-frame or page-type plugin.

**Tech Stack:** Quartz v5 (TypeScript/Preact, SCSS), `tsup` for plugin builds, `vitest` for
unit tests, this repo's existing `local-plugins/*` package conventions.

## Global Constraints

- Scope is `content/index.md` only. No other page's rendering may change.
- The existing sidebar `Explorer` (`local-plugins/explorer`) is not modified.
- No client-side JS for `SiteIndex`'s base rendering — it must be fully server-rendered from
  `allFiles`.
- German alphabetization for `SiteIndex`: ä→a, ö→o, ü→u, ß→ss (sort key only; display text
  keeps the real characters).
- Reuse the exact same `shortTitle`-over-`title` precedence already established in
  `quartz/util/fileTrie.ts`, `quartz/util/ctx.ts`, `local-plugins/content-index/src/emitter.ts`,
  and `local-plugins/explorer/src/components/scripts/explorer.inline.ts` — `SiteIndex` becomes
  a 5th location; keep it consistent with those four.
- `git commit` after every task (never batch multiple tasks into one commit).
- Full spec: `docs/superpowers/specs/2026-07-28-index-page-redesign-design.md`.

## Design refinement made during planning (read before Task 4)

The spec's §1 said "collapse the grid to one column" **and** "keep the center width
unchanged" as if those were free — they aren't. `.page` (`#quartz-root`) caps the whole
3-column layout at `calc(1200px + 300px) = 1500px`; `.center`'s width is *whatever the grid
leaves over* after two 320px sidebar tracks, not a fixed number. Two options were
considered:

1. **Keep the 3-column grid, just hide sidebar content.** Rejected: an empty 320px grid
   track doesn't collapse just because its content is `display: none` — the page would show
   dead blank gutters on both sides, and the hero (which needs to sit at the true left edge)
   would start 320px+gap indented instead.
2. **Collapse the grid fully (mirrors the built-in `full-width` frame), then cap width on
   specific elements via their own `max-width`, not the grid track.** This is what Task 4
   implements: `#quartz-body` goes single-column edge-to-edge, and everything *except*
   `SiteIndex` gets an explicit `max-width: 46rem` (a concrete, comfortable prose measure —
   not a reproduction of the old fluid grid number, which was never a fixed value to begin
   with). `SiteIndex` gets no such cap, so it alone uses the freed width.

This is a refinement of *how* §1 is achieved, not a change to what was approved — the
visual outcome (narrow hero/graph/recent-notes, wide index, no dead gutters) is exactly
what was signed off on in the design conversation.

---

## Task 1: Scaffold the `site-index` package

**Files:**
- Create: `local-plugins/site-index/package.json`
- Create: `local-plugins/site-index/.eslintrc.json`
- Create: `local-plugins/site-index/.prettierrc`
- Create: `local-plugins/site-index/.prettierignore`
- Create: `local-plugins/site-index/.gitignore`
- Create: `local-plugins/site-index/tsconfig.json`
- Create: `local-plugins/site-index/tsconfig.build.json`
- Create: `local-plugins/site-index/tsup.config.ts`
- Create: `local-plugins/site-index/types/globals.d.ts`
- Create: `local-plugins/site-index/vitest.config.ts`
- Create: `local-plugins/site-index/src/index.ts`
- Create: `local-plugins/site-index/src/components/index.ts`
- Create: `local-plugins/site-index/test/smoke.test.ts`

**Interfaces:**
- Produces: an installable local package `site-index` with `./` and `./components` entry
  points, buildable via `npm run build`, testable via `npm run test`. Task 2 and Task 3 add
  real content inside `src/`.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "site-index",
  "version": "0.1.0",
  "description": "ale.ms alphabetical site index (homepage directory of all notes) — private, not published.",
  "type": "module",
  "license": "MIT",
  "private": true,
  "files": ["dist", "README.md"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./components": {
      "types": "./dist/components/index.d.ts",
      "import": "./dist/components/index.js"
    },
    "./package.json": "./package.json"
  },
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "sideEffects": false,
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "check": "npm run typecheck && npm run test"
  },
  "peerDependencies": {
    "preact": "^10.0.0"
  },
  "peerDependenciesMeta": {
    "preact": {
      "optional": false
    }
  },
  "dependencies": {
    "@quartz-community/types": "^0.2.1",
    "@quartz-community/utils": "^0.1.0"
  },
  "devDependencies": {
    "@types/node": "^24.10.0",
    "preact": "^10.28.2",
    "tsup": "^8.5.0",
    "typescript": "^5.9.3",
    "vitest": "^2.1.9"
  },
  "quartz": {
    "name": "site-index",
    "displayName": "Site Index (ale.ms)",
    "category": "component",
    "version": "1.0.0",
    "quartzVersion": ">=5.0.0",
    "dependencies": [],
    "defaultOrder": 50,
    "defaultEnabled": true,
    "defaultOptions": {},
    "components": {
      "SiteIndex": {
        "displayName": "Site Index",
        "defaultPosition": "afterBody",
        "defaultPriority": 6
      }
    }
  },
  "engines": {
    "node": ">=22",
    "npm": ">=10.9.2"
  }
}
```

- [ ] **Step 2: Create `.eslintrc.json`**

```json
{
  "root": true,
  "env": {
    "es2022": true,
    "node": true
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": "latest",
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  "ignorePatterns": ["dist", "node_modules"],
  "rules": {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ]
  }
}
```

- [ ] **Step 3: Create `.prettierrc`**

```json
{
  "semi": true,
  "singleQuote": false,
  "printWidth": 100,
  "trailingComma": "all",
  "arrowParens": "always"
}
```

- [ ] **Step 4: Create `.prettierignore`**

```
dist
node_modules
```

- [ ] **Step 5: Create `.gitignore`**

```
node_modules/
dist/
*.tsbuildinfo
.DS_Store
coverage/
.cache/
.eslintcache
```

- [ ] **Step 6: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "rootDir": ".",
    "outDir": "dist",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noEmit": true,
    "strict": true,
    "noImplicitOverride": true,
    "noUncheckedIndexedAccess": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "types": ["node"],
    "verbatimModuleSyntax": true,
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
  },
  "include": ["src", "test", "types", "tsup.config.ts"],
  "exclude": ["dist", "node_modules"]
}
```

- [ ] **Step 7: Create `tsconfig.build.json`**

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["node"]
  },
  "include": ["src", "types"],
  "exclude": ["dist", "node_modules", "test"]
}
```

- [ ] **Step 8: Create `tsup.config.ts`**

```ts
import { defineConfig } from "tsup";

const SINGLETON_EXTERNALS = [
  "preact",
  "preact/hooks",
  "preact/jsx-runtime",
  "preact/compat",
  "@jackyzha0/quartz",
  "@jackyzha0/quartz/*",
  "vfile",
  "vfile/*",
  "unified",
];

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "components/index": "src/components/index.ts",
  },
  format: ["esm"],
  dts: true,
  tsconfig: "tsconfig.build.json",
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2022",
  splitting: false,
  noExternal: [/.*/],
  external: SINGLETON_EXTERNALS,
  outDir: "dist",
  platform: "node",
  esbuildOptions(options) {
    options.jsx = "automatic";
    options.jsxImportSource = "preact";
  },
});
```

- [ ] **Step 9: Create `types/globals.d.ts`**

```ts
/// <reference path="../node_modules/@quartz-community/types/globals.d.ts" />
```

- [ ] **Step 10: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    reporters: ["default"],
  },
});
```

- [ ] **Step 11: Create `src/components/index.ts`** (placeholder export, replaced with a real one in Task 3)

```ts
export {};
```

- [ ] **Step 12: Create `src/index.ts`** (placeholder export, replaced with a real one in Task 3)

```ts
export {};
```

- [ ] **Step 13: Write the failing smoke test — `test/smoke.test.ts`**

```ts
import { describe, expect, it } from "vitest";

describe("site-index package", () => {
  it("has a test runner wired up", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 14: Install dependencies and run the test**

Run: `cd local-plugins/site-index && npm install && npm run test`
Expected: PASS (1 test)

- [ ] **Step 15: Run the build to confirm the package compiles**

Run: `npm run build` (from `local-plugins/site-index/`)
Expected: `dist/index.js`, `dist/index.d.ts`, `dist/components/index.js`,
`dist/components/index.d.ts` all created, no errors.

- [ ] **Step 16: Commit**

```bash
git add local-plugins/site-index
git commit -m "feat(site-index): scaffold new local plugin package"
```

---

## Task 2: Alphabetical grouping logic (`src/util/entries.ts`)

**Files:**
- Create: `local-plugins/site-index/src/util/entries.ts`
- Test: `local-plugins/site-index/test/entries.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces (used by Task 3):
  - `interface SiteIndexEntry { slug: string; title: string }`
  - `interface LetterGroup { letter: string; entries: SiteIndexEntry[] }`
  - `const ALPHABET: string[]` — `["A", "B", ..., "Z"]`, 26 entries.
  - `function resolveDisplayTitle(page: { frontmatter?: Record<string, unknown>; slug?: string }): string`
  - `function sortKeyForTitle(title: string): string`
  - `function bucketLetter(title: string): string` — one of `ALPHABET` or `"#"`.
  - `function buildIndexEntries(allFiles: (QuartzPluginData & Record<string, unknown>)[]): SiteIndexEntry[]`
  - `function groupByLetter(entries: SiteIndexEntry[]): LetterGroup[]` — only letters with
    ≥1 entry, ordered `["#", ...ALPHABET]`.

- [ ] **Step 1: Write the failing tests — `test/entries.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import {
  ALPHABET,
  bucketLetter,
  buildIndexEntries,
  groupByLetter,
  resolveDisplayTitle,
  sortKeyForTitle,
} from "../src/util/entries";

describe("ALPHABET", () => {
  it("has all 26 uppercase letters in order", () => {
    expect(ALPHABET).toHaveLength(26);
    expect(ALPHABET[0]).toBe("A");
    expect(ALPHABET[25]).toBe("Z");
  });
});

describe("resolveDisplayTitle", () => {
  it("prefers shortTitle over title", () => {
    expect(
      resolveDisplayTitle({
        frontmatter: { shortTitle: "Ahrens (2017)", title: "A Very Long Zotero Citation" },
        slug: "literatur/ahrens",
      }),
    ).toBe("Ahrens (2017)");
  });

  it("falls back to title when shortTitle is absent", () => {
    expect(
      resolveDisplayTitle({ frontmatter: { title: "Atomizität im ZK" }, slug: "atomizitaet-im-zk" }),
    ).toBe("Atomizität im ZK");
  });

  it("falls back to the last non-index slug segment when both are absent", () => {
    expect(resolveDisplayTitle({ frontmatter: {}, slug: "folder/my-note" })).toBe("my-note");
  });

  it("treats a literal title of 'index' as absent", () => {
    expect(resolveDisplayTitle({ frontmatter: { title: "index" }, slug: "folder/index" })).toBe(
      "folder",
    );
  });
});

describe("sortKeyForTitle", () => {
  it("lowercases and maps German umlauts to their base letter", () => {
    expect(sortKeyForTitle("Ähre")).toBe("ahre");
    expect(sortKeyForTitle("Übersicht")).toBe("ubersicht");
    expect(sortKeyForTitle("Ökonomie")).toBe("okonomie");
  });

  it("expands ß to ss", () => {
    expect(sortKeyForTitle("Straße")).toBe("strasse");
  });

  it("strips other combining diacritics", () => {
    expect(sortKeyForTitle("café")).toBe("cafe");
  });
});

describe("bucketLetter", () => {
  it("buckets by the first letter of the sort key, uppercased", () => {
    expect(bucketLetter("Ähre")).toBe("A");
    expect(bucketLetter("zettelkasten")).toBe("Z");
  });

  it("buckets titles starting with a digit or symbol under '#'", () => {
    expect(bucketLetter("3-Body Problem")).toBe("#");
    expect(bucketLetter("")).toBe("#");
  });
});

describe("buildIndexEntries", () => {
  const files = [
    { slug: "index", frontmatter: { title: "index" } },
    { slug: "atomizitaet-im-zk", frontmatter: { title: "Atomizität im ZK" } },
    { slug: "beobachtung-zweiter-ordnung", frontmatter: { title: "Beobachtung zweiter Ordnung" } },
    { slug: "literatur/index", frontmatter: { title: "Literatur" } },
    { slug: "draft-note", frontmatter: { title: "Draft" }, unlisted: true },
  ];

  it("excludes the index page itself", () => {
    const result = buildIndexEntries(files as never);
    expect(result.some((e) => e.slug === "index")).toBe(false);
  });

  it("excludes folder-index pages", () => {
    const result = buildIndexEntries(files as never);
    expect(result.some((e) => e.slug === "literatur/index")).toBe(false);
  });

  it("excludes unlisted pages", () => {
    const result = buildIndexEntries(files as never);
    expect(result.some((e) => e.slug === "draft-note")).toBe(false);
  });

  it("sorts entries alphabetically by German sort key", () => {
    const result = buildIndexEntries(files as never);
    expect(result.map((e) => e.title)).toEqual([
      "Atomizität im ZK",
      "Beobachtung zweiter Ordnung",
    ]);
  });
});

describe("groupByLetter", () => {
  it("groups entries under their bucket letter, in '#'→A→Z order, omitting empty letters", () => {
    const entries = [
      { slug: "a1", title: "Atomizität" },
      { slug: "a2", title: "Autopoiesis" },
      { slug: "z1", title: "Zirkularität" },
      { slug: "n1", title: "3-Body Problem" },
    ];
    const groups = groupByLetter(entries);
    expect(groups.map((g) => g.letter)).toEqual(["#", "A", "Z"]);
    expect(groups[1]!.entries.map((e) => e.slug)).toEqual(["a1", "a2"]);
  });

  it("returns an empty array for no entries", () => {
    expect(groupByLetter([])).toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test` (from `local-plugins/site-index/`)
Expected: FAIL — `Cannot find module '../src/util/entries'`

- [ ] **Step 3: Write the implementation — `src/util/entries.ts`**

```ts
import type { QuartzPluginData } from "@quartz-community/types";
import { isFolderPath } from "@quartz-community/utils/path";

export interface SiteIndexEntry {
  slug: string;
  title: string;
}

export interface LetterGroup {
  letter: string;
  entries: SiteIndexEntry[];
}

export const ALPHABET: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function lastSlugSegment(slug: string): string {
  const segments = slug.split("/").filter((s) => s !== "" && s !== "index");
  return segments[segments.length - 1] ?? slug;
}

export function resolveDisplayTitle(page: {
  frontmatter?: Record<string, unknown>;
  slug?: string;
}): string {
  const frontmatter = page.frontmatter ?? {};
  const shortTitle = frontmatter.shortTitle as string | undefined;
  const title = frontmatter.title as string | undefined;
  const nonIndexTitle = title === "index" ? undefined : title;
  return shortTitle || nonIndexTitle || lastSlugSegment(page.slug ?? "");
}

const GERMAN_SORT_MAP: Record<string, string> = {
  ä: "a",
  ö: "o",
  ü: "u",
  ß: "ss",
};

export function sortKeyForTitle(title: string): string {
  const lowered = title.toLowerCase();
  const germanNormalized = lowered.replace(/[äöüß]/g, (ch) => GERMAN_SORT_MAP[ch] ?? ch);
  return germanNormalized.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function bucketLetter(title: string): string {
  const key = sortKeyForTitle(title);
  const first = key.charAt(0).toUpperCase();
  return first >= "A" && first <= "Z" ? first : "#";
}

type IndexablePage = QuartzPluginData &
  Record<string, unknown> & {
    frontmatter?: Record<string, unknown>;
    slug?: string;
    unlisted?: unknown;
  };

export function buildIndexEntries(allFiles: IndexablePage[]): SiteIndexEntry[] {
  return allFiles
    .filter((p) => p.slug !== "index")
    .filter((p) => !isFolderPath(p.slug ?? ""))
    .filter((p) => p.unlisted !== true)
    .map((p) => ({
      slug: p.slug as string,
      title: resolveDisplayTitle(p),
    }))
    .sort((a, b) => {
      const keyA = sortKeyForTitle(a.title);
      const keyB = sortKeyForTitle(b.title);
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return a.title.localeCompare(b.title);
    });
}

export function groupByLetter(entries: SiteIndexEntry[]): LetterGroup[] {
  const groups = new Map<string, SiteIndexEntry[]>();
  for (const entry of entries) {
    const letter = bucketLetter(entry.title);
    const existing = groups.get(letter);
    if (existing) {
      existing.push(entry);
    } else {
      groups.set(letter, [entry]);
    }
  }
  const orderedLetters = ["#", ...ALPHABET];
  return orderedLetters
    .filter((letter) => groups.has(letter))
    .map((letter) => ({ letter, entries: groups.get(letter)! }));
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test` (from `local-plugins/site-index/`)
Expected: PASS — all tests in `test/entries.test.ts` and `test/smoke.test.ts` green.

- [ ] **Step 5: Typecheck**

Run: `npm run typecheck` (from `local-plugins/site-index/`)
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add local-plugins/site-index/src/util/entries.ts local-plugins/site-index/test/entries.test.ts
git commit -m "feat(site-index): add alphabetical grouping and German sort-key logic"
```

---

## Task 3: `SiteIndex` component, wired into the site

**Files:**
- Create: `local-plugins/site-index/src/util/path.ts`
- Create: `local-plugins/site-index/src/components/SiteIndex.tsx`
- Modify: `local-plugins/site-index/src/components/index.ts`
- Modify: `local-plugins/site-index/src/index.ts`
- Modify: `quartz.config.yaml` (add the `site-index` plugin entry)
- Modify: `quartz.lock.json` (remove the `site-index` entry so the next install picks it up
  fresh — same trick used earlier this session for the Explorer rebuild)

**Interfaces:**
- Consumes: `SiteIndexEntry`, `LetterGroup`, `ALPHABET`, `buildIndexEntries`, `groupByLetter`
  from Task 2's `src/util/entries.ts`.
- Produces: `SiteIndex: QuartzComponentConstructor` — a self-gating component (returns
  `null` on any page where `fileData.slug !== "index"`), rendered inline for verification
  in this task; visual styling arrives in Task 8.

- [ ] **Step 1: Create the plain-string path helper — `src/util/path.ts`**

`@quartz-community/utils/path`'s `resolveRelative` takes branded `FullSlug`/`SimpleSlug`
types, not plain strings. `local-plugins/recent-notes` avoids that friction with its own
thin string-typed wrapper — same pattern here:

```ts
import { simplifySlug as utilSimplifySlug, joinSegments } from "@quartz-community/utils";

export function simplifySlug(fp: string): string {
  return utilSimplifySlug(fp);
}

export function resolveRelative(current: string, target: string): string {
  const simplified = simplifySlug(target);
  const rootPath = pathToRoot(current);
  return joinSegments(rootPath, simplified);
}

function pathToRoot(slug: string): string {
  let rootPath = slug
    .split("/")
    .filter((x) => x !== "")
    .slice(0, -1)
    .map(() => "..")
    .join("/");

  if (rootPath.length === 0) {
    rootPath = ".";
  }

  return rootPath;
}
```

- [ ] **Step 2: Create `src/components/SiteIndex.tsx`**

```tsx
import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types";
import { classNames } from "@quartz-community/utils/lang";
import { ALPHABET, buildIndexEntries, groupByLetter } from "../util/entries";
import { resolveRelative } from "../util/path";

// Layout (columns, sticky jump-nav, letter-header size, width breakout) lives in
// quartz/styles/custom.scss, scoped to body[data-slug="index"] — same convention as
// Tagline (local-plugins/site-components): centralize site-wide styling in one place
// instead of shipping Component.css here.
export default (() => {
  const SiteIndex: QuartzComponent = ({
    fileData,
    allFiles,
    displayClass,
  }: QuartzComponentProps & { displayClass?: string }) => {
    if (fileData.slug !== "index") return null;

    const entries = buildIndexEntries(allFiles as Parameters<typeof buildIndexEntries>[0]);
    const groups = groupByLetter(entries);
    const occupiedLetters = new Set(groups.map((g) => g.letter));
    const slug = fileData.slug as string;
    const jumpLetters = ["#", ...ALPHABET];

    return (
      <div class={classNames(displayClass, "site-index")}>
        <h3>Index</h3>
        <nav class="site-index-nav" aria-label="Alphabetische Sprungleiste">
          {jumpLetters.map((letter) =>
            occupiedLetters.has(letter) ? (
              <a href={`#site-index-${letter}`}>{letter}</a>
            ) : (
              <span class="empty">{letter}</span>
            ),
          )}
        </nav>
        <div class="site-index-columns">
          {groups.map((group) => (
            <div class="site-index-group" id={`site-index-${group.letter}`}>
              <h4 class="site-index-letter">{group.letter}</h4>
              <ul>
                {group.entries.map((entry) => (
                  <li>
                    <a class="internal" href={resolveRelative(slug, entry.slug)}>
                      {entry.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return SiteIndex;
}) satisfies QuartzComponentConstructor;
```

- [ ] **Step 3: Update `src/components/index.ts`**

```ts
export { default as SiteIndex } from "./SiteIndex";
```

- [ ] **Step 4: Update `src/index.ts`**

```ts
export { default as SiteIndex } from "./components/SiteIndex";
export type {
  LetterGroup,
  SiteIndexEntry,
} from "./util/entries";
export { ALPHABET, buildIndexEntries, groupByLetter, resolveDisplayTitle } from "./util/entries";

export type { QuartzComponent, QuartzComponentProps } from "@quartz-community/types";
```

- [ ] **Step 5: Build and typecheck**

Run: `cd local-plugins/site-index && npm run build && npm run typecheck`
Expected: no errors; `dist/components/index.js` exports `SiteIndex`.

- [ ] **Step 6: Add the plugin entry to `quartz.config.yaml`**

Find the `recent-notes` entry (currently the last `afterBody` component before
`site-scripts`) and add a new entry directly after it:

```yaml
  # New local plugin (not a fork): alphabetical "phone book" index of every published note,
  # index-page only. See docs/superpowers/specs/2026-07-28-index-page-redesign-design.md.
  - source: "./local-plugins/site-index"
    enabled: true
    layout:
      position: afterBody
      priority: 6
```

- [ ] **Step 7: Force a fresh install of the new local plugin**

`quartz.lock.json` won't yet have a `site-index` entry, so `npx quartz plugin install
--from-config` will build and install it as new (no lockfile edit needed for a plugin that
was never there — unlike the mid-session Explorer rebuild, this isn't a re-install).

Run: `npx quartz plugin install --from-config`
Expected: output includes `site-index: installing dependencies...` / `site-index: building...` /
`✓ site-index built`, and `node_modules/site-index/dist/` exists afterward.

- [ ] **Step 8: Verify it renders on the index page**

Run: `npx quartz build --serve` and open `http://localhost:8080`
Expected: an "Index" heading appears near the bottom of the homepage (after Recent Notes,
before the footer), with a row of A–Z letters and, beneath it, every published note grouped
by first letter as a plain unstyled list — unstyled is expected, Task 8 adds the column/
jump-nav CSS. Confirm no note titles are missing compared to `content/` (cross-check against
`find content -iname "*.md" | wc -l`, accounting for the exclusions in Task 2's tests:
`index.md` itself and folder-index pages).

- [ ] **Step 9: Commit**

```bash
git add local-plugins/site-index quartz.config.yaml quartz.lock.json
git commit -m "feat(site-index): render alphabetical index on the homepage"
```

---

## Task 4: Single-column layout on `index`

**Files:**
- Modify: `quartz/styles/custom.scss`

**Interfaces:**
- Consumes: nothing code-level: pure CSS keyed off `body[data-slug="index"]`
  (`quartz/components/renderPage.tsx:349`) and the existing `.page-header` / `.center` /
  `.page-footer` / `.sidebar.left` / `.sidebar.right` structure from `DefaultFrame.tsx`.
- Produces: on `index` only, a single visible column, full page width, with everything
  except `.site-index` capped at a comfortable reading width. See "Design refinement" above
  for why this is a grid collapse plus a per-element `max-width`, not a grid-track resize.

- [ ] **Step 1: Add the index-only layout override**

Add this block to `quartz/styles/custom.scss`, after the existing Page Frame Overrides
section (search the file for `Full-width frame: no sidebars` — add directly below the
`.page[data-frame="minimal"]` block that follows it):

```scss
// ============================================================================
// Index page: single-column layout (body[data-slug="index"] only)
// ============================================================================
//
// See docs/superpowers/specs/2026-07-28-index-page-redesign-design.md §1 and the plan's
// "Design refinement" note: the grid collapses fully (like the built-in full-width frame)
// so the hero sits flush at the true left edge with no dead gutters. Everything except
// .site-index gets its own explicit max-width below, so it reads at the same comfortable
// measure as a normal content page despite the grid itself now being full-width.

body[data-slug="index"] {
  .page > #quartz-body {
    grid-template-columns: auto;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      "grid-header"
      "grid-center"
      "grid-footer";

    @media all and ($tablet) {
      grid-template-columns: auto;
    }
  }

  .sidebar.left,
  .sidebar.right {
    display: none !important;
  }

  .center {
    max-width: 100%;
    min-width: 100%;
  }

  // Comfortable reading width for everything except the breakout index section below.
  .page-header,
  .page-footer > .graph,
  .page-footer > .recent-notes {
    max-width: 46rem;
    margin-left: 0;
    margin-right: auto;
  }
}
```

`$tablet` is already in scope — `custom.scss` starts with `@use "./variables.scss" as *;`.

- [ ] **Step 2: Verify visually**

Run: `npx quartz build --serve`, open `http://localhost:8080`
Expected: homepage shows no left/right sidebar, hero/graph/recent-notes/index all in one
column starting at the page's left edge, hero/graph/recent-notes narrower than the index
list below them (index is still unstyled/full-width from Task 3 — that's expected, Task 8
styles it). Open any other page (e.g. `/atomizitaet-im-zk`) and confirm the sidebar layout
is completely unchanged there.

- [ ] **Step 3: Commit**

```bash
git add quartz/styles/custom.scss
git commit -m "style(index): collapse to single-column layout on the homepage"
```

---

## Task 5: Hero (Title + Tagline) and prominent search

> **Correction made during execution (2026-07-28):** this task originally assumed an
> unregistered `condition` name evaluates to "hidden." It doesn't —
> `quartz/plugins/loader/config-loader.ts`'s `applyConditionWrapper` treats an unknown
> condition as "always render, with a console warning," the opposite of what was assumed.
> Landing Steps 1-3 below without also registering `is-index` in the same change would have
> made Title+Tagline render *twice* on every non-index page (sidebar + duplicated hero) —
> a real regression, caught by Task 5's implementer before committing. Fix, per the human's
> decision when presented with the conflict: pull Task 7's `registerCondition("is-index",
> ...)` step forward into *this* task (new Step 3b below), so `is-index` is registered in
> the same commit that introduces entries depending on it. Task 7 (later) no longer performs
> that registration — see its own correction note.

**Files:**
- Modify: `quartz.config.yaml` (gate existing `page-title`/`tagline` entries with
  `condition: not-index`; add index-only duplicates in `beforeBody`)
- Modify: `quartz.ts` (register the `is-index` condition — moved forward from Task 7, see
  correction note above)
- Modify: `quartz/styles/custom.scss` (hero sizing on index; prominent search on index)

**Interfaces:**
- Consumes: the existing `@quartz-community/page-title` plugin and the existing
  `local-plugins/site-components` `tagline`-named entry — both already configured in
  `quartz.config.yaml`.
- Produces: on `index`, Title + Tagline render at the top of the center column (inside
  `.page-header`, via `beforeBody`) instead of the (now-hidden) left sidebar; search grows
  larger. On every other page, nothing changes — the *existing* `page-title`/`tagline`
  entries keep rendering in the left sidebar exactly as before.

- [ ] **Step 1: Gate the existing sidebar `page-title` entry**

In `quartz.config.yaml`, find:

```yaml
  - source: "@quartz-community/page-title"
    enabled: true
    layout:
      position: left
      priority: 10
```

Add a `condition`:

```yaml
  - source: "@quartz-community/page-title"
    enabled: true
    layout:
      position: left
      priority: 10
      condition: not-index
```

- [ ] **Step 2: Gate the existing sidebar `tagline` entry**

Find the `tagline`-named `site-components` entry (`layout: position: left, priority: 20`)
and add `condition: not-index` to its `layout` block, same as Step 1.

- [ ] **Step 3: Add the index-only hero entries**

Add these two entries directly after the (now `not-index`-gated) `tagline` entry in
`quartz.config.yaml`:

```yaml
  # Index-only hero: same PageTitle component as the sidebar, repositioned to the top of the
  # center column since the sidebar is hidden on index (see custom.scss's
  # body[data-slug="index"] block). Priority is negative so it renders before the
  # Search+Darkmode toolbar (priority 1) in the same beforeBody position.
  - source: "@quartz-community/page-title"
    enabled: true
    layout:
      position: beforeBody
      priority: -2
      condition: is-index
  - source:
      repo: "./local-plugins/site-components"
      name: tagline
    enabled: true
    options:
      linkText: "Alem Šabićs"
      linkUrl: "https://alemsabic.com"
      text: " Notizen & Quellen."
    layout:
      position: beforeBody
      priority: -1
      condition: is-index
```

- [ ] **Step 3b: Register the `is-index` condition (moved forward from Task 7)**

Replace the full contents of `quartz.ts` with:

```ts
import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { registerCondition } from "./quartz/plugins/loader/conditions"

registerCondition("is-index", (props) => props.fileData.slug === "index")

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
```

This must land in the same commit as Steps 1-3 — see the correction note at the top of this
task for why leaving it inert until Task 7 doesn't work.

- [ ] **Step 4: Hero and search sizing CSS**

Add to `quartz/styles/custom.scss`, inside the `body[data-slug="index"]` block from Task 4
(add these as new nested rules, don't create a second `body[data-slug="index"]` block):

```scss
  // Hero: Title + Tagline, now living in .page-header instead of the sidebar.
  .page-header .page-title {
    font-size: 4rem !important;
  }

  .page-header .tagline {
    font-size: 1.15rem !important;
  }

  // Prominent search: wider input, larger type, more breathing room.
  .search-button {
    max-width: 32rem;
    padding: 0.9rem 1.3rem !important;
  }

  .search-button > p {
    font-size: 1.2rem !important;
  }
```

- [ ] **Step 5: Verify visually**

Run: `npx quartz build --serve`, open `http://localhost:8080`
Expected: the *sidebar* title/tagline are gone on the homepage (hidden by Task 4's CSS and
now also `not-index`-gated so they don't even mount), and the hero (Title + Tagline) now
renders correctly at the top of the center column — `is-index` is registered in Step 3b, so
this works immediately, not just after a later task. Confirm on a non-index page (e.g.
`/atomizitaet-im-zk`) that Title + Tagline render normally in the left sidebar, exactly once
— not duplicated in the center column.

- [ ] **Step 6: Commit**

```bash
git add quartz.config.yaml quartz.ts quartz/styles/custom.scss
git commit -m "feat(index): add index-only hero, register is-index condition, hero/search sizing"
```

---

## Task 6: Fork `@quartz-community/graph` to reach its locale strings

**Files:**
- Create: `local-plugins/graph/` (forked package — see steps for exact source)
- Modify: `local-plugins/graph/src/i18n/locales/de-DE.ts`
- Create: `local-plugins/graph/FORK_NOTES.md`
- Modify: `quartz.config.yaml` (both existing Graph-related lines change `source` from
  `"@quartz-community/graph"` to `"./local-plugins/graph"` — the sidebar entry now, Task 7
  adds the index entry already pointing at the fork)

**Interfaces:**
- Produces: a `local-plugins/graph` package identical to the upstream `@quartz-community/graph`
  except its German locale's `title` string, ready for Task 7 to reference twice
  (sidebar + index-only instances).

`@quartz-community/graph` doesn't expose a title/label override via `options` — confirmed by
reading its `package.json` `optionSchema` (only `localGraph`/`globalGraph` nested objects,
no title field) and its compiled locale bundle (`"Graphansicht"` is a literal string baked
into `node_modules/@quartz-community/graph/dist/index.js`). Forking is the only way to
rename it, same as this repo already did for Explorer.

- [ ] **Step 1: Clone the upstream source**

Run:
```bash
git clone --depth 1 https://github.com/quartz-community/graph /tmp/graph-fork-src
git -C /tmp/graph-fork-src rev-parse HEAD
```
Note the printed commit hash for `FORK_NOTES.md` in Step 4.

- [ ] **Step 2: Copy it into `local-plugins/`**

```bash
rsync -a --exclude='.git' --exclude='node_modules' --exclude='dist' \
  /tmp/graph-fork-src/ /Users/alemsabic/Desktop/ale.ms/local-plugins/graph/
rm -rf /tmp/graph-fork-src
```

- [ ] **Step 3: Apply the rename**

Open `local-plugins/graph/src/i18n/locales/de-DE.ts`, find the `title: "Graphansicht"` entry
(it's the `graph`/`graphView` component's title string — check the exact key name against
this file once opened, since the plan can't see the pre-fork file structure) and change the
value to `"Graph"`. Do not touch any other locale file — this rename is German-only, per the
design conversation ("Graphansicht" → "Graph" site-wide **in German**, the site's only
active locale).

- [ ] **Step 4: Write `FORK_NOTES.md`**

```markdown
# Local fork: graph

Forked from https://github.com/quartz-community/graph at commit `<PASTE HASH FROM STEP 1>`
(main branch, 2026-07-28).

## Patch applied (`src/i18n/locales/de-DE.ts`)

Renamed the German locale's Graph heading from "Graphansicht" to "Graph" — shorter, same
meaning. No `options`-based override exists for this (confirmed against the upstream
package's `optionSchema`, which only exposes `localGraph`/`globalGraph`), so forking was the
only way to change it.

To refresh against upstream: diff this against a fresh clone, re-apply the same one-line
locale string change to `src/i18n/locales/de-DE.ts`.
```

- [ ] **Step 5: Point the sidebar Graph entry at the fork**

In `quartz.config.yaml`, change:

```yaml
  - source: "@quartz-community/graph"
    enabled: true
    layout:
      position: right
      priority: 20 # right sidebar order: TOC(10), Graph(20), Backlinks(30)
```

to:

```yaml
  # Local fork (German heading renamed "Graphansicht" → "Graph") — see local-plugins/graph/FORK_NOTES.md
  - source: "./local-plugins/graph"
    enabled: true
    layout:
      position: right
      priority: 20 # right sidebar order: TOC(10), Graph(20), Backlinks(30)
```

- [ ] **Step 6: Force a fresh install and rebuild**

Since this plugin's `source` changed (not just its options), remove any stale
`node_modules/@quartz-community/graph` and install fresh:

```bash
rm -rf node_modules/@quartz-community/graph
npx quartz plugin install --from-config
```

Expected output includes `graph: installing dependencies...` / `graph: building...` /
`✓ graph built`.

- [ ] **Step 7: Verify the rename and that nothing else broke**

Run: `npx quartz build --serve`, open any non-index content page with a Graph in the right
sidebar.
Expected: sidebar heading now reads "Graph", not "Graphansicht". Click to open the global
graph modal — still works (drag/zoom/depth unaffected, since only a locale string changed).

- [ ] **Step 8: Commit**

```bash
git add local-plugins/graph quartz.config.yaml
git commit -m "feat(graph): fork @quartz-community/graph to rename German heading to 'Graph'"
```

---

## Task 7: Index-only Graph (all notes, no click required)

> **Correction made during execution (2026-07-28):** the original Step 1 here
> (`registerCondition("is-index", ...)` in `quartz.ts`) moved to Task 5 — see that task's own
> correction note for why. `is-index` is already registered by the time this task starts;
> this task only adds entries/gates that *use* it. The old Step 2 ("verify Task 5's hero now
> activates") is gone since Task 5 already verified that itself.

**Files:**
- Modify: `quartz.config.yaml` (gate sidebar Graph/Explorer/Backlinks with `not-index`; add
  the index-only Graph entry)
- Modify: `quartz/styles/custom.scss` (index Graph height + heading size-match to
  `.recent-notes > h3`)

**Interfaces:**
- Consumes: the `is-index` condition (registered in Task 5's `quartz.ts` change).
- Produces: a second, always-expanded Graph instance on `index` showing every note reachable
  by link from the homepage (`localGraph.depth: -1`), positioned before Recent Notes.

- [ ] **Step 1: Confirm `is-index` is already registered**

Read `quartz.ts` and confirm it already contains the `registerCondition("is-index", ...)`
call from Task 5. If it's missing, stop and escalate — this task depends on it and should
not re-add it itself (that would risk a duplicate `registerCondition` call).

- [ ] **Step 2: Gate the sidebar Graph, Explorer, and Backlinks entries with `not-index`**

In `quartz.config.yaml`, change the `./local-plugins/graph` sidebar entry from Task 6:

```yaml
  - source: "./local-plugins/graph"
    enabled: true
    layout:
      position: right
      priority: 20 # right sidebar order: TOC(10), Graph(20), Backlinks(30)
```

to:

```yaml
  - source: "./local-plugins/graph"
    enabled: true
    layout:
      position: right
      priority: 20 # right sidebar order: TOC(10), Graph(20), Backlinks(30)
      condition: not-index
```

Change the `./local-plugins/explorer` entry from:

```yaml
  - source: "./local-plugins/explorer"
    enabled: true
    layout:
      position: left
      priority: 50
```

to:

```yaml
  - source: "./local-plugins/explorer"
    enabled: true
    layout:
      position: left
      priority: 50
      condition: not-index
```

Change the `@quartz-community/backlinks` entry from:

```yaml
  - source: "@quartz-community/backlinks"
    enabled: true
    layout:
      position: right
      priority: 30
```

to:

```yaml
  - source: "@quartz-community/backlinks"
    enabled: true
    layout:
      position: right
      priority: 30
      condition: not-index
```

(TOC is deliberately left untouched — it has nothing to show on `index`'s empty article body
regardless, per the design spec's §7.)

- [ ] **Step 3: Add the index-only Graph entry**

Add this directly after the (now `not-index`-gated) `./local-plugins/graph` entry in
`quartz.config.yaml`:

```yaml
  # Index-only: same forked Graph component, always-expanded (depth: -1 = every note
  # reachable by link from the homepage, not just 1-hop neighbors). Renders before Recent
  # Notes (priority 5) in afterBody.
  - source: "./local-plugins/graph"
    enabled: true
    options:
      localGraph:
        depth: -1
    layout:
      position: afterBody
      priority: 2
      condition: is-index
```

- [ ] **Step 4: Size the index Graph's heading and height**

Add to `quartz/styles/custom.scss`'s `body[data-slug="index"]` block (from Task 4/5):

```scss
  // Index-only Graph: bigger box (it's the page's visual centerpiece here, not a 250px
  // sidebar card), and its heading matches .recent-notes > h3's H1-equivalent size
  // (custom.scss's "Section title... sized identically to the H1 rule" block).
  .page-footer > .graph > .graph-outer {
    height: 420px;
  }

  .page-footer > .graph > h3 {
    font-size: 1.75rem !important;
    line-height: 1;
  }

  @media (min-width: 800px) {
    .page-footer > .graph > h3 {
      font-size: 3rem !important;
      line-height: 0.9;
    }
  }
```

- [ ] **Step 5: Force a fresh install (options changed on a plugin already forked in Task 6)**

Run: `npx quartz plugin install --from-config`
Expected: `✓ All configured plugins are already installed` is fine here — Task 6 already
built `local-plugins/graph`'s `dist/`, and this task only changes `quartz.config.yaml`
(new entry + `options`), not the plugin's own source, so no rebuild is needed. If the
homepage graph doesn't reflect `depth: -1` after a `--serve` restart, force it anyway:
`rm -rf node_modules/@quartz-community/graph node_modules/local-plugins 2>/dev/null; npx
quartz plugin install --from-config`.

- [ ] **Step 6: Verify visually**

Run: `npx quartz build --serve`, open `http://localhost:8080`
Expected: a large "Graph" section appears between the hero and "Zuletzt bearbeitet",
showing (most or all of) the site's notes as a connected graph without needing to click
anything, heading sized the same as "Zuletzt bearbeitet". Open a non-index page and confirm
its sidebar still shows the small 1-hop Graph, headed "Graph" (from Task 6), unaffected by
`depth: -1` (that option only applies to the index-only entry).

- [ ] **Step 7: Commit**

```bash
git add quartz.config.yaml quartz/styles/custom.scss
git commit -m "feat(index): add always-expanded index-only graph, gate sidebar components with not-index"
```

---

## Task 8: Style the index as a 3/2/1-column phone book

**Files:**
- Modify: `quartz/styles/custom.scss`

**Interfaces:**
- Consumes: the `.site-index`, `.site-index-nav`, `.site-index-columns`, `.site-index-group`,
  `.site-index-letter` classes from Task 3's `SiteIndex.tsx`.
- Produces: the confirmed-in-mockup 3-column desktop / 2-column tablet / 1-column mobile
  layout, sticky A–Z jump nav, bold letter headers, and the width breakout beyond the
  46rem cap Task 4 put on everything else.

- [ ] **Step 1: Add the styling block**

Add to `quartz/styles/custom.scss`'s `body[data-slug="index"]` block:

```scss
  // SiteIndex: the one section that breaks out of the 46rem reading width, since a
  // 3-column phone-book grid needs the room. Caps at the same width the whole page
  // container uses elsewhere (.page's own max-width formula), not an arbitrary number.
  .page-footer > .site-index {
    max-width: calc(#{map.get($breakpoints, desktop)} + 300px);
    width: 100%;
  }

  .site-index > h3 {
    font-size: 1.75rem;
    line-height: 1;
  }

  @media (min-width: 800px) {
    .site-index > h3 {
      font-size: 3rem;
      line-height: 0.9;
    }
  }

  .site-index-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: var(--light);
    padding: 0.6rem 0;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--lightgray);
  }

  .site-index-nav a,
  .site-index-nav span.empty {
    display: inline-block;
    min-width: 1.6rem;
    text-align: center;
    font-weight: 700;
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
  }

  .site-index-nav a {
    color: var(--secondary);
    text-decoration: none;
  }

  .site-index-nav a:hover {
    background-color: var(--lightgray);
  }

  .site-index-nav span.empty {
    color: var(--gray);
    opacity: 0.5;
  }

  .site-index-columns {
    columns: 3;
    column-gap: 2.5rem;

    @media all and ($tablet) {
      columns: 2;
    }

    @media all and ($mobile) {
      columns: 1;
    }
  }

  .site-index-group {
    break-inside: avoid;
    margin-bottom: 1.25rem;
  }

  .site-index-letter {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--secondary);
    border-bottom: 2px solid var(--lightgray);
    margin: 0 0 0.3rem 0;
    padding-bottom: 0.15rem;
  }

  .site-index-group ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .site-index-group li {
    font-size: 0.9rem;
    padding: 0.1rem 0;
  }
```

- [ ] **Step 2: Stress-test column balance with synthetic content (local-only, not committed)**

The site only has ~24 published notes today — not enough to see how 3 columns actually
balance. Temporarily create throwaway files to check:

```bash
mkdir -p content/.stress-test
for i in $(seq 1 150); do
  letter=$(printf "%s" "ABCDEFGHIJKLMNOPQRSTUVWXYZ" | cut -c$((RANDOM % 26 + 1)))
  echo "---
title: ${letter}-Stresstest-Notiz-${i}
---
" > "content/.stress-test/stress-${i}.md"
done
npx quartz build --serve
```

Open `http://localhost:8080`, confirm: columns look balanced (no single column dramatically
taller than the others), no letter group visibly splits its heading from its first item
across a column break, the sticky nav stays pinned while scrolling past the list, and the
resize-to-tablet/mobile breakpoints correctly drop to 2 and then 1 column.

Then remove the throwaway content — it must not be committed:

```bash
rm -rf content/.stress-test
```

- [ ] **Step 3: Verify with real content**

Run: `npx quartz build --serve`, open `http://localhost:8080`
Expected: same visual treatment, correctly sparse (most letters empty/greyed in the nav —
expected at ~24 notes, this is the "grows visibly as the collection grows" behavior from the
design spec).

- [ ] **Step 4: Commit**

```bash
git add quartz/styles/custom.scss
git commit -m "style(site-index): 3/2/1-column phone-book layout with sticky A-Z jump nav"
```

---

## Task 9: Full verification and wrap-up

**Files:** none (verification only)

- [ ] **Step 1: Run the full site typecheck**

Run: `npm run check` (repo root)
Expected: no type errors anywhere, including the two new/forked local plugins.

- [ ] **Step 2: Run each new local plugin's own test suite**

Run: `cd local-plugins/site-index && npm run test`
Expected: PASS, all tests from Tasks 1–2.

- [ ] **Step 3: Full production build**

Run: `npx quartz plugin install --from-config && npx quartz build` (repo root)
Expected: build completes with no errors or warnings about missing components.

- [ ] **Step 4: Manual pass — light mode**

Run: `npx quartz build --serve`, open `http://localhost:8080` with light mode active
(toolbar toggle).
Checklist: hero top-left, prominent search, big always-expanded graph, "Zuletzt bearbeitet",
then the 3-column A–Z index with sticky nav — all in one narrow-except-index column. Click
into a note from the index; confirm the link resolves correctly. Navigate to that note and
back to `/` to confirm SPA routing doesn't break anything index-specific (re-triggers the
`nav`/`render` event the sidebar Explorer listens for — confirm the *sidebar* Explorer,
still gated `not-index`, doesn't appear on the way back either).

- [ ] **Step 5: Manual pass — dark mode**

Toggle dark mode, repeat the same checklist. Pay particular attention to `.site-index-nav`'s
`background-color: var(--light)` (should be the dark navy, not a light leftover) and the
Graph's dark-mode window-depth shadow (from the earlier session's work) still applying
correctly to the index-only instance.

- [ ] **Step 6: Confirm every other page is unaffected**

Open at least: a regular content note, a page with headings (TOC should still populate in
its sidebar there), and a tag or folder listing page if any exist. Confirm the 3-column
sidebar layout, Explorer, Graphansicht→Graph rename (should show on all pages, not just
non-index), and Backlinks all look exactly as they did before this feature — the only page
that should look different is `/`.

- [ ] **Step 7: Final commit (only if any cleanup remains from the manual passes)**

```bash
git status
```
If anything changed during verification (e.g. a CSS tweak made while eyeballing sizing),
commit it now with a message describing what was adjusted and why. If nothing changed,
no commit needed — Tasks 1–8 already captured everything.
