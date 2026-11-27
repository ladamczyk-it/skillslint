<h1>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/ladamczyk-it/skillslint/main/logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/ladamczyk-it/skillslint/main/logo.svg">
    <img alt="" src="https://raw.githubusercontent.com/ladamczyk-it/skillslint/main/logo.svg" height="36" align="top">
  </picture>
  &nbsp;Skillslint
</h1>

Lint and score [Agent Skills](https://github.com/anthropics/skills) (`SKILL.md`), such as Claude Code skills, before your agents run them: textlint prose checks plus structure, clarity and specificity scores, with thresholds that fail CI. A CLI and a JavaScript API, and an optional check inside [qoq](https://qoq.adamczyk.ovh/).

Docs: [skillslint.adamczyk.ovh](https://skillslint.adamczyk.ovh/)

## Rationale

Agents skills created via Anthropics [skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator) are generally good and reliable. Nevertheless You can also create or edit them manually since they are just `SKILL.md` files.

To avoid common mistakes, this CLI runs predefined [textlint](https://textlint.org/docs/getting-started) and [agent-skills-cli](https://github.com/Karanjot786/agent-skills-cli) to provide both semantic and quality checks on all Your skills.

## Usage

You can install package locally (eg for [QoQ](https://www.npmjs.com/package/@ladamczyk/qoq-cli) usage) or run it directly:

```bash
npx @ladamczyk/skillslint
```

to list available options

```bash
npx @ladamczyk/skillslint -h
```

## AI agents and CI

Skills are prompts agents run unattended, so check them in CI and after an agent writes or edits one. Exit code `1` means a textlint error left after the run or a skill below its floor. `--threshold` (default `70`) is the overall floor; `--overall`, `--structure`, `--clarity`, `--specificity` and `--advanced` replace it with per-category floors. The CLI prints text only; for structured results call `lint()`, which returns `{ passed, fixed, skills, textlint }`. An `AGENTS.md` snippet is in [AI agents and CI](https://skillslint.adamczyk.ovh/docs/ai-agents-and-ci).

## qoq

[qoq](https://qoq.adamczyk.ovh/) runs Skillslint in-process when `qoq.config.js` has a `skillslint: { path }` block; it is off without one. A failing skill fails `qoq --check`, `qoq --fix` forwards `--fix`, `--skip-skillslint` skips it, and `--json` writes `skillslint-report.json`. qoq currently forwards only `path`, so the default overall floor of `70` applies there. More in [qoq integration](https://skillslint.adamczyk.ovh/docs/qoq).

## Anonymous usage stats

Opt-in, off until a human says yes. The first interactive run asks; the answer is stored as `stats: true|false` in `~/.config/skillslint.json` (or `$XDG_CONFIG_HOME/skillslint.json`) and never asked again — edit or delete the key to change it. Runs that can't ask (`CI=true`, a pipe) are never prompted. While no answer is stored they are never counted; once `stats: true` is stored in that file, CI and piped runs on the same machine are counted too. The JavaScript API never prompts: `stats` is a required boolean on `lint()`, so the calling host states its own user's consent.

A counted run posts one constant to `https://stats.adamczyk.ovh` and nothing else — every run, every flag combination, byte for byte the same body:

```jsonc
{ "tool": "skillslint", "options": [] } // `options` is always empty
```

Where an outbound POST never leaves the network, the same run counts as a plain image GET instead — `https://adamczyk.ovh/img/stats/pixel.png?tool=skillslint` — which carries the same single value and nothing more.

Never sent: your skills, file names, paths, scores, findings, thresholds, the flags you typed, project or package names, or anything identifying the user or machine. Sends are fire-and-forget with a 2s timeout; a failure is swallowed and never affects the exit code.

## Last 12 months usage statistics (>=4.2.0)

Regenerated on each release, for daily updated numbers click on chart or visit [skillslint.adamczyk.ovh/docs/usage-statistics](https://skillslint.adamczyk.ovh/docs/usage-statistics).

[![Last 12 months usage statistics](https://adamczyk.ovh/img/stats/skillslint.png?date=2026-08-19)](https://adamczyk.ovh/img/stats/skillslint.png)
