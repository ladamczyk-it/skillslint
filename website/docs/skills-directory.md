---
title: 'Skills directory layout and what gets checked'
sidebar_label: 'Skills directory'
sidebar_position: 3
description: 'How skills are found under --path, why each subdirectory is one skill, which .md files textlint checks, and how to skip skills with --ignored.'
keywords:
  [skills directory, SKILL.md, agent skills layout, claude code skills folder, ignored skills]
---

Each direct subdirectory under `--path` (default `./skills`) is treated as one skill and scored as a whole. textlint checks every `.md` file under `--path`, at any depth, not only `SKILL.md`.

```
skills/
  pdf-forms/
    SKILL.md        # the skill: front matter plus instructions
    reference.md    # extra Markdown, also checked by textlint
    scripts/fill.py # not checked by textlint; the scorer receives the whole folder
  release-notes/
    SKILL.md
```

Point `--path` at the folder that holds your skill folders, for example `.claude/skills` for project skills in Claude Code:

```bash
npx @ladamczyk/skillslint --path .claude/skills
npx @ladamczyk/skillslint --path skills --ignored drafts
```

`--path` is resolved relative to the current working directory. `--ignored` takes skill folder names to skip; they are left out of scoring, but textlint still checks their `.md` files because it globs the whole `--path`.
