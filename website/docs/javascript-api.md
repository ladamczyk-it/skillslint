---
title: JavaScript API
sidebar_position: 6
description: lint(), format() and the other exports of the JavaScript API.
---

Alongside the CLI the package exports an ESM/CJS API. `lint` runs the same two checks and returns structured results without printing or exiting; `format` turns a result into the console output the CLI writes:

```js
import { lint, format } from '@ladamczyk/skillslint';

const result = await lint({ path: './skills', threshold: 70, stats: false });

result.passed; // boolean — textlint clean and every skill over its threshold
result.skills; // Array<{ name, scores: { overall, structure, clarity, specificity, advanced }, passed }>
result.textlint; // raw textlint lint/fix results
result.fixed; // whether it ran in fix mode

process.stdout.write(await format(result));
```

`lint()` takes the same options as the CLI flags (`path`, `threshold`, the five per-category floors, `fix`, `ignored`) plus **`stats`**, which is required — see [Usage statistics](./usage-statistics.md).

Additional named exports: `buildThreshold`, `failsThreshold`, `runTextlint`, `hasTextlintErrors`, `DEFAULT_PATH`, `DEFAULT_THRESHOLD`, and the TypeScript types (`ILintOptions`, `ILintResult`, `IScores`, `ISkillScore`, `IThreshold`, `TTextlintLintResult`, `TTextlintFixResult`, `TTextlintResults`).
