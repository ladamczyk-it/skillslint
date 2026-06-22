#!/usr/bin/env node

import { EExitCode } from '@ladamczyk/qoq-utils';
import cac from 'cac';

import { format } from './format.ts';
import { DEFAULT_THRESHOLD } from './helpers/threshold.ts';
import { DEFAULT_PATH, lint } from './lint.ts';

import type { ILintOptions } from './types.ts';

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

    process.stdout.write(await format(result));

    process.exit(result.passed ? EExitCode.OK : EExitCode.ERROR);
  });

cli.help();

cli.parse();
