# Agent Guidelines for ale.ms (Quartz v4.5.1)

## Project Overview

**ale.ms** is a static site generator built on Quartz v4.5.1. This repository handles **PRESENTATION ONLY** (Quartz configuration, styling, UI components).

- **Live Site**: https://ale.ms
- **Content Repository**: https://github.com/alemsabic/alems-notizen
- **⚠️ CRITICAL**: Never edit files in `content/` directly - they are auto-synced via GitHub Actions and will be overwritten!

## Build, Test & Lint Commands

### Development

```bash
npx quartz build --serve     # Dev server on http://localhost:8080
npx quartz build             # Production build
npm run check                # Type check + Prettier validation
npm run format               # Format code with Prettier
npm run test                 # Run all tests (Node.js test runner)
```

### Running Single Test

```bash
# Run specific test file
npx tsx --test quartz/util/path.test.ts
npx tsx --test quartz/util/fileTrie.test.ts

# Run tests matching pattern
npx tsx --test --test-name-pattern="isSimpleSlug"
```

### Deployment

- **Platform**: Cloudflare Pages (branch `v4`)
- **Build Command**: `npx quartz build`
- **Output Directory**: `public`
- Changes deploy automatically within 1-2 minutes after push

## Code Style Guidelines

### TypeScript Configuration

- **Strict Mode**: Enabled (`strict: true`)
- **Target**: ESNext
- **JSX**: React JSX with Preact (`jsxImportSource: "preact"`)
- **Module**: ESNext with Node resolution
- **Unused Variables/Parameters**: Disallowed (`noUnusedLocals`, `noUnusedParameters`)

### Imports & Exports

```typescript
// Use named imports from local modules
import { QuartzComponent, QuartzComponentProps } from "./types"
import { formatDate, getDate } from "./Date"

// Use default export for components with satisfies
export default (() => Body) satisfies QuartzComponentConstructor

// Use export for plugins
export const Citations: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  // ...
}

// Use //@ts-ignore for inline script imports
// @ts-ignore
import footnotesScript from "./scripts/footnotes.inline"
```

### Formatting

- **Formatter**: Prettier (configured in package.json)
- **Max Line Length**: Not enforced (Prettier defaults)
- **Semicolons**: No (inferred from codebase)
- **Quotes**: Double quotes for JSX, mixed for TS (follow existing patterns)
- **Indentation**: 2 spaces

### Types & Interfaces

```typescript
// Prefer interfaces for object shapes
interface FileTrieData {
  slug: string
  title: string
  shortTitle?: string // Optional properties with meaningful comments
  filePath: string
}

// Use type for unions, aliases, mapped types
export type ContentDetails = {
  slug: FullSlug
  title: string
  // ...
}

// Use Partial<T> for optional options
export interface Options {
  bibliographyFile: string
  suppressBibliography: boolean
}

export const Plugin: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  // ...
}
```

### Naming Conventions

- **Components**: PascalCase (`ContentHeader`, `Body`, `FileTrieNode`)
- **Functions**: camelCase (`formatDate`, `getDate`, `resolveRelative`)
- **Constants**: camelCase for most, UPPER_CASE for true constants
- **Files**:
  - Components: PascalCase.tsx (`Body.tsx`, `ContentHeader.tsx`)
  - Utils: camelCase.ts (`path.ts`, `fileTrie.ts`)
  - Tests: fileName.test.ts (`path.test.ts`)
  - Config: kebab-case or camelCase (`quartz.config.ts`, `custom.scss`)

### Component Patterns

```typescript
// Standard Quartz component structure
const ComponentName: QuartzComponent = ({ cfg, fileData, displayClass }: QuartzComponentProps) => {
  // Component logic
  return <div class={classNames(displayClass, "component-name")}>{/* ... */}</div>
}

// Add static properties for scripts/styles
ComponentName.afterDOMLoaded = `${script};`
ComponentName.css = styleSheet

// Export with satisfies
export default (() => ComponentName) satisfies QuartzComponentConstructor
```

### Error Handling

- Use descriptive error messages
- Validate required parameters
- Provide fallbacks for optional data

```typescript
const titleToUse = this.data?.shortTitle ?? nonIndexTitle
return displayNameOverride ?? titleToUse ?? fileSegmentHint ?? slugSegment ?? ""
```

### Comments

- Use `//` for single-line comments
- Add JSDoc for public APIs and complex logic
- Document custom modifications clearly (see CLAUDE.md for examples)
- Include "why" not just "what"

```typescript
// Use shortTitle if available (for Zotero sources), fallback to title
const titleToUse = this.data?.shortTitle ?? nonIndexTitle
```

## Custom Modifications ⚠️

**CRITICAL**: This repo contains custom modifications to Quartz core. Before modifying these files, consult `CLAUDE.md`:

1. **Footnote Highlighting** (`quartz/components/scripts/footnotes.inline.ts`, `Body.tsx`)
2. **Popover Behavior** (`quartz/plugins/transformers/citations.ts`)
3. **Short Title Support** (`quartz/util/fileTrie.ts`, `quartz/util/ctx.ts`, `quartz/plugins/emitters/contentIndex.tsx`)
4. **German Locale** (`quartz.config.ts` - Citations plugin)
5. **Zotero Styling** (`quartz/styles/custom.scss`)

**Always read CLAUDE.md** for context on custom features to avoid breaking them during updates.

## File Organization

```
quartz/
├── components/           # UI components (React/Preact)
│   ├── scripts/         # Inline scripts (.inline.ts)
│   ├── pages/           # Page templates
│   └── types.ts         # Component type definitions
├── plugins/
│   ├── transformers/    # Markdown transformers
│   ├── emitters/        # HTML/Asset emitters
│   └── filters/         # Content filters
├── styles/              # SCSS stylesheets
│   └── custom.scss      # Custom overrides
├── util/                # Utility functions
└── i18n/                # Internationalization
```

## Testing

- Tests use Node.js built-in test runner
- Test files: `*.test.ts` next to source files
- Use `describe()` and `test()` from `node:test`
- Use `assert` from `node:assert`

```typescript
import test, { describe } from "node:test"
import assert from "node:assert"

describe("feature name", () => {
  test("specific behavior", () => {
    assert(condition)
    assert.strictEqual(actual, expected)
  })
})
```

## Git Workflow

- **Commit messages**: Use conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)
- **Never commit** to `content/` folder (managed separately)
- **Test locally** before pushing: `npm run check && npm run test`
- Changes to `v4` branch auto-deploy to Cloudflare Pages

## Common Tasks

### Adding a New Component

1. Create `ComponentName.tsx` in `quartz/components/`
2. Export via `quartz/components/index.ts`
3. Add to layout in `quartz.layout.ts`
4. Test locally with `npx quartz build --serve`

### Modifying Styles

1. Edit `quartz/styles/custom.scss` (never edit `base.scss` directly)
2. Use existing CSS variables from `variables.scss`
3. Check both light/dark themes
4. Test responsive behavior

### Updating Configuration

1. Main config: `quartz.config.ts`
2. Layout: `quartz.layout.ts`
3. Always preserve custom plugin options (Citations, TableOfContents, etc.)
4. Check CLAUDE.md for documented custom settings

---

**Last Updated**: 2025-01-18  
**For detailed custom modifications, always consult CLAUDE.md**
