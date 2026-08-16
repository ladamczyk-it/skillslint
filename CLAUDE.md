# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build          # compile src/ → bin/ & lib/ (rimraf + rolldown + tsc + chmod)
npm run dev            # build then run the CLI directly
npm run qoq:check      # lint + format check (ESLint, Prettier, knip, jscpd)
npm run qoq:fix        # auto-fix lint and formatting issues
```

## Architecture

This package ships **two entry points**, built by a single unified Rolldown config (`rolldown.config.js`). All `dependencies` stay external (not bundled); only `devDependencies` tooling is used at build time:

- `src/cli.ts` → `bin/cli.js` — the **CLI** (`package.json` `bin`, shebang). Built by `rolldown.config.js` (minified into one self-contained bundle). Parses options with `cac` and renders output; it is a thin presentation layer over `lint()`.
- `src/index.ts` → `lib/index.mjs` + `lib/index.cjs` + `lib/src/*.d.ts` — the **JavaScript API** (`package.json` `main`/`module`/`types`/`exports`). Built by `rolldown.config.js` (dual CJS/ESM output) with TypeScript declarations emitted via `tsc --emitDeclarationOnly`. Exposes `lint()` plus helpers and types.

**Core API (`src/lint.ts`):** `lint(options: ILintOptions): Promise<ILintResult>` runs both checks and returns structured results (no printing, no `process.exit`):

1. `runTextlint` (`src/helpers/textlint.ts`) lints `<path>/**/*.md` via the **textlint programmatic API** (`createLinter` + `loadTextlintrc`) using the bundled `.textlintrc.json` (resolved via `src/helpers/paths.ts`, which handles both installed-package and `npx` invocation). With `fix`, it writes each result's `output` back to disk (the API computes fixes but does not persist them). Missing target files are treated as "nothing to lint" rather than throwing.
2. `agent-skills-cli.assessQuality` scores each skill subdirectory; scores are compared against the threshold options.

The legacy `executeCommand('textlint', …)` shell-out has been removed in favour of the textlint API.

**Usage stats (`src/helpers/stats.ts`):** `lint()` posts `{ tool: 'skillslint', options: [] }` to `https://stats.adamczyk.ovh` only when passed `stats: true`. `sendStats()` takes no arguments and the body is a constant — `options` is always empty, so a run count is all that leaves the machine and there is nothing to sanitize. The sink enforces the same thing from its side: skillslint's `SENDERS` pattern is `(?!)`, which matches nothing, so any non-empty `options` is a 400. `stats` is a **required** `boolean` on `ILintOptions` — no default, no optional marker: an API consumer must state consent, because `lint()` can't prompt. The CLI is the only caller that can ask: `resolveConsent()` reads/writes `$XDG_CONFIG_HOME/skillslint.json` and prompts once (stdlib `readline/promises`, no `prompts` dependency) when both stdin and stdout are TTYs and `CI !== 'true'`. Its return is a tri-state — `true` allows, `false` denies, `undefined` means never asked, which is what a non-interactive run gets, and it writes nothing in that case so the question stays open. Only at the `lint()` call does `undefined` collapse to `false`. `buildThreshold` takes the threshold subset of `ILintOptions`, not the whole thing, so the required `stats` doesn't leak into it. The API never prompts and never reads the consent file — callers opt in explicitly. See AGENTS.md for the user-facing contract.

**Path resolution (`src/helpers/paths.ts`):** `resolveCliRelativePath` finds the CLI package root via `getPackageInfo` (for installed use) or falls back to `process.cwd()` (for `npx`). This is how the bundled `.textlintrc.json` is located at runtime regardless of invocation method.

**Build output:** `npm run build` runs `rolldown -c` (the CLI and library CJS/ESM bundles) followed by `tsc --emitDeclarationOnly` (`.d.ts` declarations). The `files` array in `package.json` controls what gets published: `bin/`, `lib/`, `.textlintrc.json`, and `AGENTS.md`. Both `bin/` and `lib/` are git/prettier-ignored build artifacts.

## Key conventions

- ESM-only (`"type": "module"`); import TypeScript files with `.ts` extensions (`allowImportingTsExtensions`)
- `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` are enabled — handle array/object access accordingly
- `qoq` enforces import ordering via `no-restricted-imports` (configured in `qoq.config.js`)
- `AGENTS.md` is the consumer-facing context file for agents using this tool; `CLAUDE.md` (this file) is for development
