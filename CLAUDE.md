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

This package ships **two entry points**, each built by its own Rollup config (the build runs Rollup only — no standalone `tsc`). All `dependencies` stay external (not bundled); only `devDependencies` tooling is used at build time:

- `src/cli.ts` → `bin/cli.js` — the **CLI** (`package.json` `bin`, shebang). Built by `rollup.bin.js` (esbuild + terser into one self-contained bundle). Parses options with `cac` and renders output; it is a thin presentation layer over `lint()`.
- `src/index.ts` → `lib/index.mjs` + `lib/index.cjs` + `lib/src/*.d.ts` — the **JavaScript API** (`package.json` `main`/`module`/`types`/`exports`). Built by `rollup.config.js` via `@rollup/plugin-typescript` (dual CJS/ESM output plus declarations). Exposes `lint()` plus helpers and types.

**Core API (`src/lint.ts`):** `lint(options: ILintOptions): Promise<ILintResult>` runs both checks and returns structured results (no printing, no `process.exit`):

1. `runTextlint` (`src/helpers/textlint.ts`) lints `<path>/**/*.md` via the **textlint programmatic API** (`createLinter` + `loadTextlintrc`) using the bundled `.textlintrc.json` (resolved via `src/helpers/paths.ts`, which handles both installed-package and `npx` invocation). With `fix`, it writes each result's `output` back to disk (the API computes fixes but does not persist them). Missing target files are treated as "nothing to lint" rather than throwing.
2. `agent-skills-cli.assessQuality` scores each skill subdirectory; scores are compared against the threshold options.

The legacy `executeCommand('textlint', …)` shell-out has been removed in favour of the textlint API.

**Path resolution (`src/helpers/paths.ts`):** `resolveCliRelativePath` finds the CLI package root via `getPackageInfo` (for installed use) or falls back to `process.cwd()` (for `npx`). This is how the bundled `.textlintrc.json` is located at runtime regardless of invocation method.

**Build output:** `npm run build` runs `rollup -c rollup.bin.js` (the CLI bundle, minified by terser) then `rollup -c` (the library CJS/ESM bundles + `.d.ts` declarations via `@rollup/plugin-typescript`). The `files` array in `package.json` controls what gets published: `bin/`, `lib/`, `.textlintrc.json`, and `AGENTS.md`. Both `bin/` and `lib/` are git/prettier-ignored build artifacts.

## Key conventions

- ESM-only (`"type": "module"`); import TypeScript files with `.ts` extensions (`allowImportingTsExtensions`)
- `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` are enabled — handle array/object access accordingly
- `qoq` enforces import ordering via `no-restricted-imports` (configured in `qoq.config.js`)
- `AGENTS.md` is the consumer-facing context file for agents using this tool; `CLAUDE.md` (this file) is for development
