---
title: 'Prose rules for skill files and what --fix corrects'
sidebar_label: 'Textlint rules'
sidebar_position: 5
description: 'The bundled textlint rules for skill Markdown: common misspellings and write-good readability checks, which noisy rules are off, and what --fix can correct.'
keywords: [textlint, write-good, common misspellings, markdown lint, skill prose]
---

The bundled `.textlintrc.json` enables:

- **`common-misspellings`** — catches common spelling errors
- **`write-good`** — prose checks, with the four noisiest rules switched off (`weasel`, `passive`, `adverb`, `tooWordy`), so what's left is the readability findings worth acting on

Both plugins (`@textlint/markdown` and `@textlint/text`) are registered for `.md`, so every `.md` file is read twice — once as markdown, once as plain text.

Run with `-f` / `--fix` to let textlint auto-correct issues it can resolve without manual intervention. Skills that fail with `--fix` on report `Can't perform automatic fix!` — those findings need a human.
