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

Exits with code `1` if any skill fails to meet its threshold or if textlint reports an error that is still there after the run (with `--fix`, after fixing). There is no `--json` flag: for structured results use the [JavaScript API](./javascript-api.md), or `qoq --check --json`, which writes a JSON report.
