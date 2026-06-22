# @ladamczyk/skillslint — Agent Context

Linter for agent skill documentation. Runs two checks: markdown prose quality via textlint, and structured quality scoring via `agent-skills-cli`. Ships both a CLI (default) and a JavaScript API.

## Command

```bash
skillslint [options]
```

| Option                  | Default    | Description                                                                      |
| ----------------------- | ---------- | -------------------------------------------------------------------------------- |
| `-p, --path <path>`     | `./skills` | Directory containing skill subdirectories                                        |
| `-t, --threshold <n>`   | `70`       | Overall quality threshold (0–100); used when no specific threshold flags are set |
| `--overall <n>`         | —          | Required overall score                                                           |
| `--structure <n>`       | —          | Required structure score                                                         |
| `--clarity <n>`         | —          | Required clarity score                                                           |
| `--specificity <n>`     | —          | Required specificity score                                                       |
| `--advanced <n>`        | —          | Required advanced score                                                          |
| `-f, --fix`             | —          | Attempt auto-fix via textlint                                                    |
| `-i, --ignored [names]` | —          | Skill directory names to skip                                                    |

Exits with code `1` if any skill fails to meet its threshold or if textlint finds unfixable issues.

## Programmatic API

The package also exports a JavaScript API (ESM). The `lint` function runs the same two checks and returns structured results without printing or exiting:

```js
import { lint } from '@ladamczyk/skillslint';

const result = await lint({ path: './skills', threshold: 70, ignored: ['wip-skill'] });

result.passed; // boolean — every skill met its threshold and textlint found no errors
result.fixed; // boolean — whether `fix` was requested (fixes are written to disk)
result.skills; // Array<{ name, scores: { overall, structure, clarity, specificity, advanced }, passed }>
result.textlint; // raw textlint results for the linted markdown files
```

`lint(options)` accepts the same options as the CLI flags (`path`, `fix`, `ignored`, `threshold`, `overall`, `structure`, `clarity`, `specificity`, `advanced`). Additional named exports: `DEFAULT_PATH`, `DEFAULT_THRESHOLD`, `buildThreshold`, `failsThreshold`, `runTextlint`, `hasTextlintErrors`, and the TypeScript types (`ILintOptions`, `ILintResult`, `IScores`, `ISkillScore`, `IThreshold`).

## Skills directory structure

Each subdirectory under `--path` is treated as one skill:

```
skills/
  my-skill/
    SKILL.md     # the skill document linted by textlint and scored
```

## Scoring categories

| Category    | What it measures                           |
| ----------- | ------------------------------------------ |
| Overall     | Weighted average of all categories         |
| Structure   | Document organization and completeness     |
| Clarity     | Writing clarity and readability            |
| Specificity | Concrete examples and precise instructions |
| Advanced    | Use of advanced skill features             |

## Textlint rules (bundled `.textlintrc.json`)

- `common-misspellings` — catches common spelling errors
- `write-good` — passive voice and wordiness checks (weasel words, adverbs, and "too wordy" disabled)
