---
title: 'Prose rules for skill files and what --fix corrects'
sidebar_label: 'Textlint rules'
sidebar_position: 5
description: 'The bundled textlint rules for skill Markdown: common misspellings and write-good readability checks, which noisy rules are off, and what --fix can correct.'
keywords: [textlint, write-good, common misspellings, markdown lint, skill prose]
---

Skillslint checks the prose of every `.md` file under `--path` with [textlint](https://textlint.org/docs/getting-started) and a bundled configuration. There is no config file to write.

## Which rules are enabled?

The bundled `.textlintrc.json` enables:

- **`common-misspellings`**: catches common spelling errors, such as `recieve` for `receive`.
- **`write-good`**: prose checks, with the four noisiest rules switched off (`weasel`, `passive`, `adverb`, `tooWordy`), so what's left is the readability findings worth acting on.

## Why is every file read twice?

Both plugins, `@textlint/markdown` and `@textlint/text`, are registered for `.md`, so every `.md` file is read once as Markdown and once as plain text.

## What does --fix correct?

Run with `-f` or `--fix` to let textlint correct what it can without a human, such as a known misspelling. The fixes are written back to the files.

```bash
npx @ladamczyk/skillslint --path .claude/skills --fix
```

When findings remain that textlint can't fix, the output says `Can't perform automatic fix!` and the run exits with `1`. Those findings need a human.
