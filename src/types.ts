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

export interface IExecuteOptions extends IThreshold {
  fix?: boolean;
  path?: string;
  threshold?: number;
  ignored?: string[];
}
