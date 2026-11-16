export type Skill = "conceptos" | "calculo" | "datos" | "razonar" | "vida";

export const SKILL_LABELS: Record<Skill, string> = {
  conceptos: "Conceptos",
  calculo: "Cálculo",
  datos: "Interpretar datos",
  razonar: "Razonar",
  vida: "Vida saludable",
};

export interface DataTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

interface BaseExercise {
  id: string;
  /** Short situation that frames the task in a real context. */
  context?: string;
  /** Optional longer reading (competence text). */
  reading?: { title: string; text: string };
  table?: DataTable;
  prompt: string;
  explanation: string;
  skills: Skill[];
}

export interface ChoiceExercise extends BaseExercise {
  kind: "choice";
  options: string[];
  answer: number;
}

export interface MultiExercise extends BaseExercise {
  kind: "multi";
  options: string[];
  answer: number[];
}

export interface NumericExercise extends BaseExercise {
  kind: "numeric";
  answer: number;
  tolerance: number;
  unit?: string;
}

export interface ClassifyExercise extends BaseExercise {
  kind: "classify";
  categories: string[];
  items: { label: string; category: number }[];
}

export interface OrderExercise extends BaseExercise {
  kind: "order";
  /** Items listed in the correct order. */
  items: string[];
  topLabel?: string;
  bottomLabel?: string;
}

export interface MatchExercise extends BaseExercise {
  kind: "match";
  pairs: { left: string; right: string }[];
}

export interface TrueFalseExercise extends BaseExercise {
  kind: "truefalse";
  statements: { text: string; answer: boolean }[];
}

export type Exercise =
  | ChoiceExercise
  | MultiExercise
  | NumericExercise
  | ClassifyExercise
  | OrderExercise
  | MatchExercise
  | TrueFalseExercise;

export interface Mission {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: "apple" | "flame" | "salad" | "scan" | "heart" | "flask";
  exercises: Exercise[];
}

/**
 * Answer shapes per kind:
 * choice → number, multi → number[], numeric → string,
 * classify / order / match → number[], truefalse → (boolean | null)[]
 */
export type Answer = number | number[] | string | (boolean | null)[] | null;
