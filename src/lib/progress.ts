import type { Exercise, Mission, Skill } from "./content/types";

export interface ExerciseRecord {
  attempts: number;
  /** Solved at least once. */
  solved: boolean;
  /** Solved on the very first check ever. */
  firstTry: boolean;
  /** Result of the first check the last time the exercise was shown. Drives "repaso de fallos". */
  lastFirstCheckCorrect: boolean;
  bestScore: number;
  lastAt: number;
}

export interface ProgressState {
  version: 1;
  records: Record<string, ExerciseRecord>;
  /** ISO dates (YYYY-MM-DD) with at least one answer checked. */
  studyDays: string[];
}

export const EMPTY_PROGRESS: ProgressState = { version: 1, records: {}, studyDays: [] };

export const POINTS_FIRST_TRY = 10;
export const POINTS_LATER = 5;

export type Medal = "oro" | "plata" | "bronce" | null;

/** Medal per mission by share of exercises solved. */
export function medalFor(percent: number): Medal {
  if (percent >= 100) return "oro";
  if (percent >= 75) return "plata";
  if (percent >= 40) return "bronce";
  return null;
}

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function applyAttempt(
  state: ProgressState,
  exerciseId: string,
  score: number,
  isFirstCheckThisTime: boolean,
  now: Date = new Date(),
): ProgressState {
  const prev = state.records[exerciseId];
  const correct = score >= 1 - 1e-9;
  const isFirstEver = !prev;
  const next: ExerciseRecord = {
    attempts: (prev?.attempts ?? 0) + 1,
    solved: (prev?.solved ?? false) || correct,
    firstTry: prev ? prev.firstTry : correct,
    lastFirstCheckCorrect: isFirstCheckThisTime ? correct : (prev?.lastFirstCheckCorrect ?? false),
    bestScore: Math.max(prev?.bestScore ?? 0, score),
    lastAt: now.getTime(),
  };
  if (isFirstEver && !isFirstCheckThisTime) next.firstTry = false;
  const day = dayKey(now);
  return {
    ...state,
    records: { ...state.records, [exerciseId]: next },
    studyDays: state.studyDays.includes(day) ? state.studyDays : [...state.studyDays, day],
  };
}

export function pointsFor(rec: ExerciseRecord | undefined) {
  if (!rec?.solved) return 0;
  return rec.firstTry ? POINTS_FIRST_TRY : POINTS_LATER;
}

export interface Stats {
  total: number;
  attempted: number;
  solved: number;
  firstTry: number;
  points: number;
  maxPoints: number;
  /** % of exercises solved. */
  percent: number;
  /** % solved on first try among attempted. */
  accuracy: number;
}

export function statsFor(exercises: Exercise[], state: ProgressState): Stats {
  let attempted = 0,
    solved = 0,
    firstTry = 0,
    points = 0;
  for (const ex of exercises) {
    const r = state.records[ex.id];
    if (!r) continue;
    attempted++;
    if (r.solved) solved++;
    if (r.firstTry) firstTry++;
    points += pointsFor(r);
  }
  const total = exercises.length;
  return {
    total,
    attempted,
    solved,
    firstTry,
    points,
    maxPoints: total * POINTS_FIRST_TRY,
    percent: total ? Math.round((solved / total) * 100) : 0,
    accuracy: attempted ? Math.round((firstTry / attempted) * 100) : 0,
  };
}

export function skillStats(missions: Mission[], state: ProgressState) {
  const bySkill = new Map<Skill, Exercise[]>();
  for (const m of missions)
    for (const ex of m.exercises)
      for (const s of ex.skills) bySkill.set(s, [...(bySkill.get(s) ?? []), ex]);
  return [...bySkill.entries()].map(([skill, list]) => ({ skill, ...statsFor(list, state) }));
}

/** Exercises the student got wrong the last time they saw them. */
export function reviewList(missions: Mission[], state: ProgressState): Exercise[] {
  return missions.flatMap((m) =>
    m.exercises.filter((ex) => {
      const r = state.records[ex.id];
      return r && !r.lastFirstCheckCorrect;
    }),
  );
}

export function exerciseStatus(rec: ExerciseRecord | undefined): "new" | "solved" | "review" {
  if (!rec) return "new";
  return rec.lastFirstCheckCorrect ? "solved" : "review";
}

/* ---------- Browser store (localStorage) ---------- */

const KEY = "repaso-tema2-biologia:v1";
let cache: ProgressState | null = null;
const listeners = new Set<() => void>();

function read(): ProgressState {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as ProgressState) : null;
    cache = parsed && parsed.version === 1 ? parsed : EMPTY_PROGRESS;
  } catch {
    cache = EMPTY_PROGRESS;
  }
  return cache;
}

function write(next: ProgressState) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full or blocked: keep in memory */
  }
  listeners.forEach((l) => l());
}

export const progressStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) {
        cache = null;
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
  getSnapshot: read,
  getServerSnapshot: () => EMPTY_PROGRESS,
  record(exerciseId: string, score: number, isFirstCheckThisTime: boolean) {
    write(applyAttempt(read(), exerciseId, score, isFirstCheckThisTime));
  },
  reset() {
    write(EMPTY_PROGRESS);
  },
};
