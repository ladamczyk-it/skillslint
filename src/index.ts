#!/usr/bin/env node

import { readdirSync } from 'fs';

import { EExitCode, executeCommand, resolveCwdRelativePath } from '@ladamczyk/qoq-utils';
import { assessQuality, formatScoreBar, getScoreColor } from 'agent-skills-cli';
import cac from 'cac';
import c from 'picocolors';

import { resolveCliRelativePath } from './helpers/paths.ts';
import { buildThreshold, DEFAULT_THRESHOLD, failsThreshold } from './helpers/threshold.ts';

import type { IExecuteOptions } from './types.ts';

const BAR_WIDTH = 25;
const DEFAULT_PATH = './skills';

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
  .action(async (options: IExecuteOptions) => {
    const { fix, path: optionsPath, ignored } = options;

    const path = `/${optionsPath ?? DEFAULT_PATH}`;
    const threshold = buildThreshold(options);

    let exitCode: EExitCode = await executeCommand('textlint', [
      fix ? '--fix' : '',
      '--config',
      resolveCliRelativePath(`/.textlintrc.json`),
      resolveCwdRelativePath(`${path}/**/*.md`),
    ]);

    if (fix && exitCode === EExitCode.ERROR) {
      process.stdout.write(c.red("Can't perform automatic fix!\n\n"));
    }

    const skills = readdirSync(resolveCwdRelativePath(path), { withFileTypes: true })
      .filter((e) => e.isDirectory() && !(ignored ?? []).includes(e.name))
      .map(({ name }) => name);
    const checks = await Promise.all(
      skills.map((name) => assessQuality(`${resolveCwdRelativePath(path)}/${name}`))
    );

    checks.forEach((item, index) => {
      let color = c.gray;
      process.stdout.write(color(`\n/${skills[index]}\n`));

      color = c[getScoreColor(item.overall)];
      process.stdout.write(color(`Overall:     ${formatScoreBar(item.overall, BAR_WIDTH)}\n`));

      color = c[getScoreColor(item.structure)];
      process.stdout.write(color(`Structure:   ${formatScoreBar(item.structure, BAR_WIDTH)}\n`));

      color = c[getScoreColor(item.clarity)];
      process.stdout.write(color(`Clarity:     ${formatScoreBar(item.clarity, BAR_WIDTH)}\n`));

      color = c[getScoreColor(item.specificity)];
      process.stdout.write(color(`Specificity: ${formatScoreBar(item.specificity, BAR_WIDTH)}\n`));

      color = c[getScoreColor(item.advanced)];
      process.stdout.write(color(`Advanced:    ${formatScoreBar(item.advanced, BAR_WIDTH)}\n`));
    });

    if (checks.some((scores) => failsThreshold(scores, threshold))) {
      process.stdout.write(c.red(`At least one skill doesn't meet required threshold!\n`));

      exitCode = EExitCode.ERROR;
    }

    if (exitCode === EExitCode.ERROR) {
      process.exit(exitCode);
    } else {
      process.stdout.write(c.green('\nAll good!\n'));
      process.exit(EExitCode.OK);
    }
  });

cli.help();

cli.parse();
