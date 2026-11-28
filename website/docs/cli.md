---
title: 'CLI options, thresholds and exit codes'
sidebar_label: 'Command line'
sidebar_position: 2
description: 'Every command-line option, from --path and --fix to the overall and per-category score floors, and what exit code 1 means when a skill falls short.'
keywords: [skillslint cli, skill.md lint, threshold, exit codes, textlint fix]
---

The `skillslint` command checks every skill under `--path`: textlint for prose, and a quality score per skill against the floors you set.

```bash
skillslint [options]
```

## Options

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
| `-h, --help`            | —          | List the options                                                                 |

## Common commands

```bash
# Claude Code project skills, default overall floor of 70
npx @ladamczyk/skillslint --path .claude/skills

# A stricter overall floor
npx @ladamczyk/skillslint --path .claude/skills --threshold 80

# Floors per category: only the named categories are checked
npx @ladamczyk/skillslint --clarity 75 --specificity 70

# Fix what textlint can, then report what is left
npx @ladamczyk/skillslint --path .claude/skills --fix

# Leave draft skills out of scoring
npx @ladamczyk/skillslint --ignored drafts
```

## What the output looks like

For each finding textlint prints the file, line and column, the message and the rule. Then each skill gets a score bar per category, and the run ends with a verdict:

```text
skills/my-skill/SKILL.md
  3:33  ✖  This is a commonly misspelled word. Correct it to receive  common-misspellings

/my-skill
Overall:     ████████████████░░░░░░░░░ 64/100
Structure:   █████████████████████░░░░ 82/100
Clarity:     ██████████████████░░░░░░░ 71/100
Specificity: █████████████░░░░░░░░░░░░ 52/100
Advanced:    ███████████████░░░░░░░░░░ 60/100
At least one skill doesn't meet required threshold!
```

When every skill meets its floors and textlint reports no error, the last line is `All good!`.

## What does exit code 1 mean?

The run exits with code `1` when at least one of these is true:

- a skill scores below a floor you set (a score equal to the floor passes);
- textlint reports an error. With `--fix`, only the errors still left after fixing count.

Otherwise it exits with `0`, so a CI job or an agent can use the exit code alone.

## Is there JSON output?

No, the CLI prints text only. For structured results use the [JavaScript API](./javascript-api.md), whose `lint()` returns per-skill scores, or `qoq --check --json`, which writes a JSON report (see [qoq integration](./qoq.md)).
