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
  // Anonymous usage stats: `true` sends, `false` doesn't. Required and strictly
  // boolean — a library can't prompt, so the embedding caller is the only one
  // who can hold the user's consent, and it has to state it rather than let an
  // omission decide. "Never asked" is not a value here: it's a state of the
  // CLI's consent file, and it reaches this boundary as `false`.
  stats: boolean;
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
