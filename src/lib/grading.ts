import type { Answer, Exercise } from "./content/types";

export interface GradeResult {
  /** 0..1 share of the exercise answered correctly. */
  score: number;
  correct: boolean;
}

/** Accepts "27,4", "27.4", " 1 208,3 " … Returns null when not a number. */
export function parseNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (cleaned === "" || !/^-?\d*\.?\d+$/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

const ratio = (hits: number, total: number) => (total === 0 ? 0 : hits / total);

export function gradeExercise(ex: Exercise, answer: Answer): GradeResult {
  let score = 0;
  switch (ex.kind) {
    case "choice":
      score = answer === ex.answer ? 1 : 0;
      break;
    case "multi": {
      const picked = new Set(Array.isArray(answer) ? (answer as number[]) : []);
      let hits = 0;
      ex.options.forEach((_, i) => {
        if (picked.has(i) === ex.answer.includes(i)) hits++;
      });
      score = ratio(hits, ex.options.length);
      break;
    }
    case "numeric": {
      const n = typeof answer === "string" ? parseNumber(answer) : null;
      score = n !== null && Math.abs(n - ex.answer) <= ex.tolerance + 1e-9 ? 1 : 0;
      break;
    }
    case "classify": {
      const a = (answer as number[]) ?? [];
      score = ratio(ex.items.filter((it, i) => a[i] === it.category).length, ex.items.length);
      break;
    }
    case "order": {
      // answer[pos] = index of the item placed at that position
      const a = (answer as number[]) ?? [];
      score = ratio(ex.items.filter((_, pos) => a[pos] === pos).length, ex.items.length);
      break;
    }
    case "match": {
      // answer[leftIndex] = chosen pair index for the right column
      const a = (answer as number[]) ?? [];
      score = ratio(ex.pairs.filter((_, i) => a[i] === i).length, ex.pairs.length);
      break;
    }
    case "truefalse": {
      const a = (answer as (boolean | null)[]) ?? [];
      score = ratio(ex.statements.filter((s, i) => a[i] === s.answer).length, ex.statements.length);
      break;
    }
  }
  return { score, correct: score >= 1 - 1e-9 };
}

/** True when the student has filled everything needed to check the answer. */
export function isAnswerComplete(ex: Exercise, answer: Answer): boolean {
  switch (ex.kind) {
    case "choice":
      return typeof answer === "number";
    case "multi":
      return Array.isArray(answer) && answer.length > 0;
    case "numeric":
      return typeof answer === "string" && parseNumber(answer) !== null;
    case "classify":
      return Array.isArray(answer) && ex.items.every((_, i) => typeof answer[i] === "number" && (answer[i] as number) >= 0);
    case "order":
      return Array.isArray(answer) && answer.length === ex.items.length;
    case "match":
      return Array.isArray(answer) && ex.pairs.every((_, i) => typeof answer[i] === "number" && (answer[i] as number) >= 0);
    case "truefalse":
      return Array.isArray(answer) && ex.statements.every((_, i) => typeof answer[i] === "boolean");
  }
}

/** Deterministic shuffle so server and browser render the same order. */
export function seededPermutation(seed: string, length: number): number[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const rand = () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const perm = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = perm[i]!;
    perm[i] = perm[j]!;
    perm[j] = tmp;
  }
  // Never hand out the solution already in place.
  if (length > 1 && perm.every((v, i) => v === i)) perm.push(perm.shift()!);
  return perm;
}
