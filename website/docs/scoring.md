---
title: Scoring categories
sidebar_position: 4
description: The five agent-skills-cli scores and how thresholds apply to them.
---

Scores are computed by `agent-skills-cli` and range from 0 to 100.

| Category    | What it measures                           |
| ----------- | ------------------------------------------ |
| Overall     | Weighted average of all categories         |
| Structure   | Document organization and completeness     |
| Clarity     | Writing clarity and readability            |
| Specificity | Concrete examples and precise instructions |
| Advanced    | Use of advanced skill features             |

Use `--threshold` to set a single floor across all categories, or combine the individual flags (`--structure`, `--clarity`, etc.) for fine-grained control.
