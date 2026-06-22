import type { ILintOptions, IScores, IThreshold } from '../types.ts';

export const DEFAULT_THRESHOLD = 70;

export const buildThreshold = (options: ILintOptions): IThreshold => {
  const {
    threshold: optionsThreshold,
    overall,
    structure,
    clarity,
    specificity,
    advanced,
  } = options;
  const threshold: IThreshold = {};

  if (overall) {
    threshold.overall = overall;
  }

  if (structure) {
    threshold.structure = structure;
  }

  if (clarity) {
    threshold.clarity = clarity;
  }

  if (specificity) {
    threshold.specificity = specificity;
  }

  if (advanced) {
    threshold.advanced = advanced;
  }

  if (Object.keys(threshold).length === 0) {
    threshold.overall = optionsThreshold ?? DEFAULT_THRESHOLD;
  }

  return threshold;
};

export const failsThreshold = (scores: IScores, threshold: IThreshold): boolean =>
  scores.overall < (threshold.overall ?? 0) ||
  scores.structure < (threshold.structure ?? 0) ||
  scores.clarity < (threshold.clarity ?? 0) ||
  scores.specificity < (threshold.specificity ?? 0) ||
  scores.advanced < (threshold.advanced ?? 0);
