import { readdirSync } from 'fs';

import { resolveCwdRelativePath } from '@ladamczyk/qoq-utils';
import { assessQuality } from 'agent-skills-cli';

import { hasTextlintErrors, runTextlint } from './helpers/textlint.ts';
import { buildThreshold, failsThreshold } from './helpers/threshold.ts';

import type { ILintOptions, ILintResult, ISkillScore } from './types.ts';

export const DEFAULT_PATH = './skills';

export const lint = async (options: ILintOptions = {}): Promise<ILintResult> => {
  const { fix = false, path: optionsPath, ignored } = options;

  const path = `/${optionsPath ?? DEFAULT_PATH}`;
  const threshold = buildThreshold(options);
  const skillsPath = resolveCwdRelativePath(path);

  const textlint = await runTextlint(resolveCwdRelativePath(`${path}/**/*.md`), fix);

  const skillNames = readdirSync(skillsPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !(ignored ?? []).includes(entry.name))
    .map(({ name }) => name);

  const skills: ISkillScore[] = await Promise.all(
    skillNames.map(async (name) => {
      const { overall, structure, clarity, specificity, advanced } = await assessQuality(
        `${skillsPath}/${name}`
      );
      const scores = { overall, structure, clarity, specificity, advanced };

      return { name, scores, passed: !failsThreshold(scores, threshold) };
    })
  );

  const passed = !hasTextlintErrors(textlint) && skills.every((skill) => skill.passed);

  return { textlint, fixed: fix, skills, passed };
};
