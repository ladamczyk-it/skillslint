---
title: Usage statistics
sidebar_position: 7
description: What skillslint counts, and only with your consent.
---

Skillslint counts its own runs, and only with your say-so. The first interactive run asks; the answer is stored as `stats: true | false` in `~/.config/skillslint.json` (or `$XDG_CONFIG_HOME/skillslint.json`) and never asked again — edit or delete the key to change it. The [JavaScript API](./javascript-api.md) never prompts: `stats` is a required boolean on `lint()`, so the calling host states its own user's consent.

![Skillslint monthly usage — runs per month](https://adamczyk.ovh/img/stats/skillslint.png)

A counted run posts one constant to `https://stats.adamczyk.ovh`, the same body every time:

```jsonc
{ "tool": "skillslint", "options": [] } // `options` is always empty
```

Where an outbound POST never leaves the network, the same run counts as a plain image GET instead — `https://adamczyk.ovh/img/stats/pixel.png?tool=skillslint` — which carries the same single value and nothing more.

Never sent: your skills, file names, paths, scores, findings, thresholds, the flags you typed, project or package names, and nothing identifying you or your machine. The send is fire-and-forget with a 2s cap, so a slow or dead endpoint can't hold a run up. Runs that can't ask — `CI=true` or a piped stdin/stdout — are never prompted and never counted.
