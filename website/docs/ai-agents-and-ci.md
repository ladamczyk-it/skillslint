---
title: 'Skill quality gate for AI agents and CI'
sidebar_label: 'AI agents and CI'
sidebar_position: 7
description: 'Fail CI when an agent skill falls below your quality floors, check skills an agent wrote before it uses them, and get structured results from the JS API.'
keywords:
  [
    agent skills ci,
    skill.md quality gate,
    agents.md,
    claude code skills ci,
    prompt quality,
    ai coding agent,
  ]
---

A quality gate for the skills your agents run. Run it in CI so a weak or misspelled `SKILL.md` never ships, and have coding agents run it after they write or edit a skill, before relying on it.

## The contract

- **Exit codes.** `0` when textlint reports no errors and every skill meets its floors, `1` otherwise. With `--fix`, only the errors still left after fixing count.
- **Floors.** `--threshold` (default `70`) is the floor for the overall score; per-category flags (`--overall`, `--structure`, `--clarity`, `--specificity`, `--advanced`) replace it. See [Scoring categories](./scoring.md).
- **Output.** The CLI prints text only: textlint findings, a score bar per skill, and a verdict. There is no `--json` flag. For structured results call [`lint()`](./javascript-api.md), which returns `{ passed, fixed, skills, textlint }`, or run it through qoq, whose `qoq --check --json` writes a JSON report.
- **Never interactive.** Runs with `CI=true` or without a terminal on stdin and stdout are never prompted.

```js
import { lint } from '@ladamczyk/skillslint';

const result = await lint({ path: '.claude/skills', threshold: 80, stats: false });

for (const skill of result.skills.filter((s) => !s.passed)) {
  console.log(skill.name, skill.scores); // { overall, structure, clarity, specificity, advanced }
}
process.exitCode = result.passed ? 0 : 1;
```

## CI example

```bash
npx @ladamczyk/skillslint --path .claude/skills --threshold 80
npx @ladamczyk/skillslint --path skills --clarity 75 --specificity 70
```

## AGENTS.md snippet

Paste this into your `AGENTS.md` or `CLAUDE.md`:

```markdown
## Skills

- Skills live in `.claude/skills/<name>/SKILL.md`.
- After creating or editing a skill, run `npx @ladamczyk/skillslint --path .claude/skills --fix`.
- Exit code 1 means a textlint error that --fix couldn't correct, or a skill below its score floor.
- For low scores, rewrite the skill: clearer steps, concrete examples and precise instructions. Don't lower the threshold to make it pass.
```

## Inside qoq

[qoq](https://qoq.adamczyk.ovh/) can run skillslint as part of `qoq --check`, where a failing skill fails the run. See [qoq integration](./qoq.md).
