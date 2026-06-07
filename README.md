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
