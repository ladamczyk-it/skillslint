<h1>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/ladamczyk-it/skillslint/master/logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/ladamczyk-it/skillslint/master/logo.svg">
    <img alt="" src="https://raw.githubusercontent.com/ladamczyk-it/skillslint/master/logo.svg" height="36" align="top">
  </picture>
  &nbsp;Skillslint
</h1>

Browse our docs [https://adamczyk.ovh/docs/skillslint](https://adamczyk.ovh/docs/skillslint).

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

## Anonymous usage stats

Opt-in, off until a human says yes. The first interactive run asks; the answer is stored as `stats: true|false` in `~/.config/skillslint.json` (or `$XDG_CONFIG_HOME/skillslint.json`) and never asked again — edit or delete the key to change it. Runs that can't ask (`CI=true`, a pipe) are never prompted and never counted. The JavaScript API never prompts: `stats` is a required boolean on `lint()`, so the calling host states its own user's consent.

A counted run posts one constant to `https://stats.adamczyk.ovh` and nothing else — every run, every flag combination, byte for byte the same body:

```jsonc
{ "tool": "skillslint", "options": [] } // `options` is always empty
```

Where an outbound POST never leaves the network, the same run counts as a plain image GET instead — `https://adamczyk.ovh/img/stats/pixel.png?tool=skillslint` — which carries the same single value and nothing more.

Never sent: your skills, file names, paths, scores, findings, thresholds, the flags you typed, project or package names, or anything identifying the user or machine. Sends are fire-and-forget with a 2s timeout; a failure is swallowed and never affects the exit code.

## Last 12 months usage statistics (>=4.2.0)

Regenerated on each release, for daily updated numbers click on chart or visit [https://adamczyk.ovh/docs/skillslint#usage-statistics](https://adamczyk.ovh/docs/skillslint#usage-statistics).

[![Last 12 months usage statistics](https://adamczyk.ovh/img/stats/skillslint.png?date=2026-08-19)](https://adamczyk.ovh/img/stats/skillslint.png)
