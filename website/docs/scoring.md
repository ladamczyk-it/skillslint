---
title: 'Skill quality scores and thresholds'
sidebar_label: 'Scoring categories'
sidebar_position: 4
description: 'The five quality scores per skill (overall, structure, clarity, specificity, advanced), how they are computed and how the score floors decide pass or fail.'
keywords: [skill quality score, agent-skills-cli, threshold, clarity score, specificity]
---

Scores are computed by `agent-skills-cli` and range from 0 to 100.

| Category    | What it measures                           |
| ----------- | ------------------------------------------ |
| Overall     | Weighted average of all categories         |
| Structure   | Document organization and completeness     |
| Clarity     | Writing clarity and readability            |
| Specificity | Concrete examples and precise instructions |
| Advanced    | Use of advanced skill features             |

`--threshold` (default `70`) sets the floor for the **overall** score only, and only when no per-category flag is given. Set any of `--overall`, `--structure`, `--clarity`, `--specificity` or `--advanced` and those floors replace it: only the categories you name are checked. A skill fails when any checked score is below its floor.
