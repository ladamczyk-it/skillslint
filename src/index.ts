export { format } from './format.ts';
export { DEFAULT_PATH, lint } from './lint.ts';
export { buildThreshold, DEFAULT_THRESHOLD, failsThreshold } from './helpers/threshold.ts';
export { hasTextlintErrors, runTextlint } from './helpers/textlint.ts';

export type {
  ILintOptions,
  ILintResult,
  IScores,
  ISkillScore,
  IThreshold,
  TTextlintFixResult,
  TTextlintLintResult,
  TTextlintResults,
} from './types.ts';
