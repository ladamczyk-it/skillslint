# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build          # compile src/ → bin/ (rimraf + rollup + chmod)
npm run dev            # build then run the CLI directly
npm run qoq:check      # lint + format check (ESLint, Prettier, knip, jscpd)
npm run qoq:fix        # auto-fix lint and formatting issues
```

## Architecture

This is a single-entry CLI (`src/index.ts`) bundled by Rollup into `bin/skillslint.js`. All `dependencies` remain **external** at runtime (not bundled); only `devDependencies` tooling is used at build time.

**Runtime flow:**

1. `cac` parses CLI options into `IExecuteOptions` (`src/types.ts`)
2. `textlint` runs against `<path>/**/*.md` using the bundled `.textlintrc.json` (resolved via `src/helpers/paths.ts`, which handles both installed-package and `npx` invocation)
3. `agent-skills-cli.assessQuality` scores each skill subdirectory and results are compared against the threshold options

**Path resolution (`src/helpers/paths.ts`):** `resolveCliRelativePath` finds the CLI package root via `getPackageInfo` (for installed use) or falls back to `process.cwd()` (for `npx`). This is how the bundled `.textlintrc.json` is located at runtime regardless of invocation method.

**Build output:** Rollup bundles to a single `bin/skillslint.js` with a shebang, minified by terser. The `files` array in `package.json` controls what gets published: `bin/`, `.textlintrc.json`, and `AGENTS.md`.

## Key conventions

- ESM-only (`"type": "module"`); import TypeScript files with `.ts` extensions (`allowImportingTsExtensions`)
- `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` are enabled — handle array/object access accordingly
- `qoq` enforces import ordering via `no-restricted-imports` (configured in `qoq.config.js`)
- `AGENTS.md` is the consumer-facing context file for agents using this tool; `CLAUDE.md` (this file) is for development
