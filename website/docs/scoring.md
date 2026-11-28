---
title: 'Skill quality scores and thresholds'
sidebar_label: 'Scoring categories'
sidebar_position: 4
description: 'The five quality scores per skill (overall, structure, clarity, specificity, advanced), how they are computed and how the score floors decide pass or fail.'
keywords: [skill quality score, agent-skills-cli, threshold, clarity score, specificity]
---

Every skill gets five scores from 0 to 100, computed by [agent-skills-cli](https://github.com/Karanjot786/agent-skills-cli). Skillslint compares them with the floors you set and fails the run when a skill falls short.

## What do the five scores measure?

| Category    | What it measures                           |
| ----------- | ------------------------------------------ |
| Overall     | Weighted average of all categories         |
| Structure   | Document organization and completeness     |
| Clarity     | Writing clarity and readability            |
| Specificity | Concrete examples and precise instructions |
| Advanced    | Use of advanced skill features             |

Each skill folder is scored as a whole, so extra Markdown and scripts next to `SKILL.md` count too. See [Skills directory](./skills-directory.md).

## How do floors decide pass or fail?

- With no flags, the floor is an **overall** score of `70`.
- `--threshold <n>` changes that overall floor, and applies only when no per-category flag is given.
- Set any of `--overall`, `--structure`, `--clarity`, `--specificity` or `--advanced` and those floors replace `--threshold`: only the categories you name are checked.
- A skill fails when any checked score is below its floor. A score equal to the floor passes.

For example, a skill scoring overall `64`, clarity `71` and specificity `52`:

| Command                                    | Checked                        | Result |
| ------------------------------------------ | ------------------------------ | ------ |
| `skillslint`                               | overall ≥ 70                   | fails  |
| `skillslint --threshold 60`                | overall ≥ 60                   | passes |
| `skillslint --clarity 70`                  | clarity ≥ 70                   | passes |
| `skillslint --clarity 70 --specificity 60` | clarity ≥ 70, specificity ≥ 60 | fails  |

## How do I raise a low score?

Rewrite the skill rather than lowering the floor. Low specificity usually means the skill lacks concrete examples and exact instructions; low clarity, long or vague sentences; low structure, missing sections or front matter. Run skillslint again after each change to see which score moved.
