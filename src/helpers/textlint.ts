import { writeFile } from 'fs/promises';

import { createLinter, loadTextlintrc } from 'textlint';

import { resolveCliRelativePath } from './paths.ts';

import type { TTextlintFixResult, TTextlintLintResult, TTextlintResults } from '../types.ts';

const ERROR_SEVERITY = 2;
const NO_TARGET_FILES_ERROR = 'TextlintFileSearchError';

export const runTextlint = async (target: string, fix: boolean): Promise<TTextlintResults> => {
  const descriptor = await loadTextlintrc({
    configFilePath: resolveCliRelativePath('/.textlintrc.json'),
  });
  const linter = createLinter({ descriptor });

  try {
    if (!fix) {
      return await linter.lintFiles([target]);
    }

    const results = await linter.fixFiles([target]);
    // fixFiles only computes the fixed output; persist it the way the textlint CLI does.
    await Promise.all(results.map((result) => writeFile(result.filePath, result.output, 'utf-8')));

    return results;
  } catch (error) {
    // textlint throws when no markdown files match the glob; treat as nothing to lint.
    if (error instanceof Error && error.name === NO_TARGET_FILES_ERROR) {
      return [];
    }

    throw error;
  }
};

export const hasTextlintErrors = (results: TTextlintResults): boolean =>
  (results as (TTextlintLintResult | TTextlintFixResult)[]).some((result) =>
    ('remainingMessages' in result ? result.remainingMessages : result.messages).some(
      (message) => message.severity === ERROR_SEVERITY
    )
  );
