---
title: 'qoq integration'
sidebar_label: 'qoq integration'
sidebar_position: 8
description: 'Turn skill linting on inside qoq --check: the skillslint block in qoq.config.js, how qoq --fix forwards to it, the JSON report, and current limits.'
keywords: [qoq, qoq-cli, ai quality gate, agent skills lint, claude code skill]
---

[qoq](https://qoq.adamczyk.ovh/) is a quality suite for JavaScript and TypeScript projects (ESLint, Prettier, Knip, JSCPD and more behind one CLI) and a Claude Code skill that turns those checks into a guarded delivery loop. Skill linting is one of qoq's optional checks: `@ladamczyk/qoq-cli` calls the [JavaScript API](./javascript-api.md) in-process, and a failing skill fails `qoq --check`.

## Turn it on

It is off by default. Add a `skillslint` block with the skills folder to `qoq.config.js`, or turn it on in qoq's config wizard:

```js
// qoq.config.js
export default {
  skillslint: {
    path: '.claude/skills',
  },
};
```

- A failing result makes `qoq --check` exit `1`.
- `qoq --fix` forwards `--fix`, so textlint corrects what it can.
- On staged runs it is skipped when no staged file is under `path`.
- `--skip-skillslint` skips it for one run.

**Current limit:** qoq forwards only `path` (and `--fix`). Thresholds, per-category floors and `ignored` in the `skillslint` block are not passed on yet, so skills are held to the default overall floor of `70`. For other floors, run skillslint on its own in CI.

## Reports and the qoq skill

`qoq --check --json` writes `skillslint-report.json`: `{ passed, fixed, skills, textlint }`, where `textlint` lists each file's path and messages. qoq's skill summarises it as textlint findings grouped by rule, which `qoq --fix` can often correct, and skills below their floor, which need rewriting.
