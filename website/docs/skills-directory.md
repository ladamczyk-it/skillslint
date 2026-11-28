---
title: 'Skills directory layout and what gets checked'
sidebar_label: 'Skills directory'
sidebar_position: 3
description: 'How skills are found under --path, why each subdirectory is one skill, which .md files textlint checks, and how to skip skills with --ignored.'
keywords:
  [skills directory, SKILL.md, agent skills layout, claude code skills folder, ignored skills]
---

Skillslint lints a folder of skills. Point `--path` at the folder that holds them; each direct subdirectory is one skill.

## How are skills found?

Each direct subdirectory under `--path` (default `./skills`) is treated as one skill and scored as a whole. `--path` is resolved relative to the current working directory.

```text
skills/
  pdf-forms/
    SKILL.md        # the skill: front matter plus instructions
    reference.md    # extra Markdown, also checked by textlint
    scripts/fill.py # not checked by textlint; the scorer receives the whole folder
  release-notes/
    SKILL.md
```

## Which files does textlint check?

Every `.md` file under `--path`, at any depth, not only `SKILL.md`. Other files, such as scripts, are not checked for prose, but they are part of the folder the scorer sees.

## How do I lint Claude Code skills?

Claude Code keeps project skills in `.claude/skills`, so point `--path` there:

```bash
npx @ladamczyk/skillslint --path .claude/skills
```

Personal skills live in `~/.claude/skills`; lint them the same way with `--path ~/.claude/skills`.

## How do I skip a skill?

`--ignored` takes skill folder names to leave out of scoring:

```bash
npx @ladamczyk/skillslint --path skills --ignored drafts
```

Ignored skills are still checked by textlint, because textlint reads every `.md` file under `--path`.
