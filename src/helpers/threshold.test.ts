import { describe, expect, it } from 'vitest';

import { buildThreshold, DEFAULT_THRESHOLD, failsThreshold } from './threshold.ts';

describe('buildThreshold', () => {
  it('falls back to DEFAULT_THRESHOLD when no threshold options given', () => {
    expect(buildThreshold({})).toEqual({ overall: DEFAULT_THRESHOLD });
  });

  it('uses explicit threshold option when no specific thresholds given', () => {
    expect(buildThreshold({ threshold: 80 })).toEqual({ overall: 80 });
  });

  it('uses specific threshold flags and ignores threshold fallback', () => {
    expect(buildThreshold({ threshold: 80, clarity: 60, structure: 50 })).toEqual({
      clarity: 60,
      structure: 50,
    });
  });

  it('sets all specific thresholds when all provided', () => {
    expect(
      buildThreshold({ overall: 90, structure: 80, clarity: 70, specificity: 60, advanced: 50 })
    ).toEqual({ overall: 90, structure: 80, clarity: 70, specificity: 60, advanced: 50 });
  });
});

const passingScores = { overall: 80, structure: 80, clarity: 80, specificity: 80, advanced: 80 };

describe('failsThreshold', () => {
  it('passes when all scores exceed thresholds', () => {
    expect(failsThreshold(passingScores, { overall: 70 })).toBe(false);
  });

  it('fails when overall score is below threshold', () => {
    expect(failsThreshold({ ...passingScores, overall: 60 }, { overall: 70 })).toBe(true);
  });

  it('fails when a specific score is below its threshold', () => {
    expect(failsThreshold({ ...passingScores, clarity: 40 }, { clarity: 50 })).toBe(true);
  });

  it('passes when no thresholds are set (all default to 0)', () => {
    const lowScores = { overall: 0, structure: 0, clarity: 0, specificity: 0, advanced: 0 };
    expect(failsThreshold(lowScores, {})).toBe(false);
  });

  it('fails only on the specific category that misses', () => {
    expect(failsThreshold({ ...passingScores, advanced: 30 }, { overall: 70, advanced: 50 })).toBe(
      true
    );
  });
});
