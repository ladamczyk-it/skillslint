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

// `stats` is required — see "Anonymous usage stats" below.
const result = await lint({
  path: './skills',
  threshold: 70,
  ignored: ['wip-skill'],
  stats: false,
});

result.passed; // boolean — every skill met its threshold and textlint found no errors
result.fixed; // boolean — whether `fix` was requested (fixes are written to disk)
result.skills; // Array<{ name, scores: { overall, structure, clarity, specificity, advanced }, passed }>
result.textlint; // raw textlint results for the linted markdown files
```

`lint(options)` accepts the same options as the CLI flags (`path`, `fix`, `ignored`, `threshold`, `overall`, `structure`, `clarity`, `specificity`, `advanced`), all optional, plus the required `stats: boolean` (see below). Additional named exports: `DEFAULT_PATH`, `DEFAULT_THRESHOLD`, `buildThreshold`, `failsThreshold`, `runTextlint`, `hasTextlintErrors`, and the TypeScript types (`ILintOptions`, `ILintResult`, `IScores`, `ISkillScore`, `IThreshold`).

## Anonymous usage stats

Opt-in, off until a human says yes. A counted run posts one constant to `https://stats.adamczyk.ovh` and nothing else — every run, every flag combination, byte for byte the same body:

```jsonc
{ "tool": "skillslint", "options": [] } // `options` is always empty
```

Where an outbound POST never leaves the network, the same run counts as a plain image GET instead — `https://adamczyk.ovh/img/stats/pixel.png?tool=skillslint` — which carries the same single value and nothing more.

So the only thing a send carries is that a run happened. Never sent: skills, file names, paths, scores, findings, thresholds, the flags you typed, project or package names, or anything identifying the user or machine. Sends are fire-and-forget with a 2s timeout; a failure is swallowed and never affects the exit code.

- **CLI** — asks the user, once, the first time it runs with a TTY on both stdin and stdout, and stores the answer in `$XDG_CONFIG_HOME/skillslint.json` (`~/.config/skillslint.json` by default):

  | File state           | Meaning     | Effect                                        |
  | -------------------- | ----------- | --------------------------------------------- |
  | `{ "stats": true }`  | allowed     | one POST per run                              |
  | `{ "stats": false }` | denied      | nothing sent, never asked again               |
  | no key / no file     | never asked | nothing sent, asked again on the next TTY run |

  Edit or delete the file to change the answer; deleting it returns to "never asked". Non-interactive runs — `CI=true`, a pipe, a subprocess — are never prompted, never counted, and write nothing, so they leave the question open rather than answering it for the user.

- **API** — never prompts, never reads that file, and has no default. `stats: boolean` is a **required** option on `lint()`: the caller holds its own user's consent, so it must pass `true` or `false` outright. `false` sends nothing.

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
