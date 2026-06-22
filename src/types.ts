import type { createLinter } from 'textlint';

type TLinter = ReturnType<typeof createLinter>;

export type TTextlintLintResult = Awaited<ReturnType<TLinter['lintFiles']>>[number];

export type TTextlintFixResult = Awaited<ReturnType<TLinter['fixFiles']>>[number];

export type TTextlintResults = TTextlintLintResult[] | TTextlintFixResult[];

export interface IThreshold {
  overall?: number;
  structure?: number;
  clarity?: number;
  specificity?: number;
  advanced?: number;
}

export interface IScores {
  overall: number;
  structure: number;
  clarity: number;
  specificity: number;
  advanced: number;
}

export interface ILintOptions extends IThreshold {
  fix?: boolean;
  path?: string;
  threshold?: number;
  ignored?: string[];
}

export interface ISkillScore {
  name: string;
  scores: IScores;
  passed: boolean;
}

export interface ILintResult {
  textlint: TTextlintResults;
  fixed: boolean;
  skills: ISkillScore[];
  passed: boolean;
}
