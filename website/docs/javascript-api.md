---
title: 'JavaScript API: lint() and format()'
sidebar_label: 'JavaScript API'
sidebar_position: 6
description: 'Run the skill checks from Node: lint() options and result with per-skill scores, format() for the CLI output, and the threshold and textlint helpers.'
keywords: [skillslint api, skill lint node, agent skills api, typescript, lint result]
---

Alongside the CLI the package exports an ESM-only JavaScript API, with TypeScript declarations. `lint` runs the same two checks and returns structured results without printing or exiting; `format` turns a result into the console output the CLI writes.

## How do I run the checks from Node?

```js
import { lint, format } from '@ladamczyk/skillslint';

const result = await lint({ path: './skills', threshold: 70, stats: false });

process.stdout.write(await format(result));
process.exitCode = result.passed ? 0 : 1;
```

## What options does lint() take?

The same options as the CLI flags: `path`, `threshold`, the five per-category floors (`overall`, `structure`, `clarity`, `specificity`, `advanced`), `fix` and `ignored`. **`stats`** is required: the API never prompts, so you state consent yourself. See [Usage statistics](./usage-statistics.md).

## What does lint() return?

```js
result.passed; // boolean — textlint clean and every skill over its threshold
result.skills; // Array<{ name, scores: { overall, structure, clarity, specificity, advanced }, passed }>
result.textlint; // raw textlint lint/fix results
result.fixed; // whether it ran in fix mode
```

To list the skills that failed:

```js
for (const skill of result.skills.filter((s) => !s.passed)) {
  console.log(skill.name, skill.scores);
}
```

## What else is exported?

`buildThreshold`, `failsThreshold`, `runTextlint`, `hasTextlintErrors`, `DEFAULT_PATH`, `DEFAULT_THRESHOLD`, and the TypeScript types (`ILintOptions`, `ILintResult`, `IScores`, `ISkillScore`, `IThreshold`, `TTextlintLintResult`, `TTextlintFixResult`, `TTextlintResults`).
