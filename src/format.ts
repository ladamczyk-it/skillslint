import { formatScoreBar, getScoreColor } from 'agent-skills-cli';
import c from 'picocolors';
import { loadFixerFormatter, loadLinterFormatter } from 'textlint';

import { hasTextlintErrors } from './helpers/textlint.ts';

import type {
  ILintResult,
  TTextlintFixResult,
  TTextlintLintResult,
  TTextlintResults,
} from './types.ts';

const BAR_WIDTH = 25;
const DIMENSIONS = ['overall', 'structure', 'clarity', 'specificity', 'advanced'] as const;

const formatTextlint = async (textlint: TTextlintResults, fixed: boolean): Promise<string> => {
  if (fixed) {
    const formatter = await loadFixerFormatter({ formatterName: 'stylish' });

    return formatter.format(textlint as TTextlintFixResult[]);
  }

  const formatter = await loadLinterFormatter({ formatterName: 'stylish' });

  return formatter.format(textlint as TTextlintLintResult[]);
};

/**
 * Renders an {@link ILintResult} into a console-ready, colorized string
 * (textlint findings, per-skill score bars and the summary verdict).
 */
export const format = async (result: ILintResult): Promise<string> => {
  let output = '';

  const textlint = await formatTextlint(result.textlint, result.fixed);
  if (textlint.trim()) {
    output += `${textlint}\n`;
  }

  if (result.fixed && hasTextlintErrors(result.textlint)) {
    output += c.red("Can't perform automatic fix!\n\n");
  }

  result.skills.forEach(({ name, scores }) => {
    output += c.gray(`\n/${name}\n`);

    DIMENSIONS.forEach((dimension) => {
      const label = `${dimension[0]?.toUpperCase()}${dimension.slice(1)}:`.padEnd(13);
      const color = c[getScoreColor(scores[dimension])];

      output += color(`${label}${formatScoreBar(scores[dimension], BAR_WIDTH)}\n`);
    });
  });

  if (result.skills.some((skill) => !skill.passed)) {
    output += c.red(`At least one skill doesn't meet required threshold!\n`);
  }

  if (result.passed) {
    output += c.green('\nAll good!\n');
  }

  return output;
};
