#!/usr/bin/env node

import { EExitCode } from '@ladamczyk/qoq-utils';
import { formatScoreBar, getScoreColor } from 'agent-skills-cli';
import cac from 'cac';
import c from 'picocolors';
import { loadFixerFormatter, loadLinterFormatter } from 'textlint';

import { hasTextlintErrors } from './helpers/textlint.ts';
import { DEFAULT_THRESHOLD } from './helpers/threshold.ts';
import { DEFAULT_PATH, lint } from './lint.ts';

import type {
  ILintOptions,
  TTextlintFixResult,
  TTextlintLintResult,
  TTextlintResults,
} from './types.ts';

const BAR_WIDTH = 25;

const formatTextlint = async (textlint: TTextlintResults, fixed: boolean): Promise<string> => {
  if (fixed) {
    const formatter = await loadFixerFormatter({ formatterName: 'stylish' });

    return formatter.format(textlint as TTextlintFixResult[]);
  }

  const formatter = await loadLinterFormatter({ formatterName: 'stylish' });

  return formatter.format(textlint as TTextlintLintResult[]);
};

const cli = cac('skillslint');

cli
  .command('', 'Linter for agents skills')
  .option('-p,--path <path>', 'Lint path', { default: DEFAULT_PATH })
  .option(
    '-t, --threshold <threshold>',
    'Same as --overall 70, will take effect only if no other threshold options are configured',
    { default: DEFAULT_THRESHOLD }
  )
  .option('-f,--fix', 'Try to fix findings')
  .option('-i,--ignored [ignored]', 'Ignored skills')
  .option('--overall <threshold>', 'Overall required threshold')
  .option('--structure <threshold>', 'Structure required threshold')
  .option('--clarity <threshold>', 'Clarity required threshold')
  .option('--specificity <threshold>', 'Specificity required threshold')
  .option('--advanced <threshold>', 'Advanced required threshold')
  .action(async (options: ILintOptions) => {
    const result = await lint(options);

    const output = await formatTextlint(result.textlint, result.fixed);
    if (output.trim()) {
      process.stdout.write(`${output}\n`);
    }

    if (result.fixed && hasTextlintErrors(result.textlint)) {
      process.stdout.write(c.red("Can't perform automatic fix!\n\n"));
    }

    result.skills.forEach(({ name, scores }) => {
      process.stdout.write(c.gray(`\n/${name}\n`));

      (['overall', 'structure', 'clarity', 'specificity', 'advanced'] as const).forEach(
        (dimension) => {
          const label = `${dimension[0]?.toUpperCase()}${dimension.slice(1)}:`.padEnd(13);
          const color = c[getScoreColor(scores[dimension])];

          process.stdout.write(color(`${label}${formatScoreBar(scores[dimension], BAR_WIDTH)}\n`));
        }
      );
    });

    if (result.skills.some((skill) => !skill.passed)) {
      process.stdout.write(c.red(`At least one skill doesn't meet required threshold!\n`));
    }

    if (result.passed) {
      process.stdout.write(c.green('\nAll good!\n'));
      process.exit(EExitCode.OK);
    }

    process.exit(EExitCode.ERROR);
  });

cli.help();

cli.parse();
