---
title: Skills directory structure
sidebar_position: 3
description: How skillslint finds skills under --path, and which file it lints.
---

Each subdirectory under `--path` is treated as one skill. Only `SKILL.md` is linted — other files in the directory are ignored.

```
skills/
  my-skill/
    SKILL.md
```
