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

/** Combine two progress states (e.g. this device + the account). The most recent record per exercise wins. */
export function mergeProgress(a: ProgressState, b: ProgressState): ProgressState {
  const records: Record<string, ExerciseRecord> = { ...a.records };
  for (const [id, rec] of Object.entries(b.records)) {
    const cur = records[id];
    if (!cur || rec.lastAt > cur.lastAt) records[id] = rec;
  }
  const studyDays = [...new Set([...a.studyDays, ...b.studyDays])].sort();
  return { version: 1, records, studyDays };
}

export function asProgressState(value: unknown): ProgressState {
  const v = value as Partial<ProgressState> | null | undefined;
  if (!v || v.version !== 1 || typeof v.records !== "object" || !Array.isArray(v.studyDays)) return EMPTY_PROGRESS;
  return { version: 1, records: v.records ?? {}, studyDays: v.studyDays };
}

/* ---------- Browser store (localStorage, optionally mirrored to a student account) ---------- */

const ANON_KEY = "repaso-tema2-biologia:v1";
let storageKey = ANON_KEY;
let pusher: ((state: ProgressState) => void) | null = null;
let cache: ProgressState | null = null;
const listeners = new Set<() => void>();

function readLocal(key: string): ProgressState {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? asProgressState(JSON.parse(raw)) : EMPTY_PROGRESS;
  } catch {
    return EMPTY_PROGRESS;
  }
}

function saveLocal(key: string, state: ProgressState) {
  try {
    window.localStorage.setItem(key, JSON.stringify(state));
  } catch {
    /* storage full or blocked: keep in memory */
  }
}

function read(): ProgressState {
  if (!cache) cache = readLocal(storageKey);
  return cache;
}

function notify() {
  listeners.forEach((l) => l());
}

function write(next: ProgressState) {
  cache = next;
  saveLocal(storageKey, next);
  pusher?.(next);
  notify();
}

export const progressStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey) {
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
  /** Switch to a student's account: merges what is saved online with this device's copy and mirrors every change. */
  connectAccount(
    userId: string,
    remote: ProgressState,
    push: (state: ProgressState) => void,
    opts: { importAnonymous?: boolean } = {},
  ): ProgressState {
    storageKey = `${ANON_KEY}:user:${userId}`;
    let merged = mergeProgress(readLocal(storageKey), remote);
    if (opts.importAnonymous) merged = mergeProgress(merged, readLocal(ANON_KEY));
    cache = merged;
    saveLocal(storageKey, merged);
    pusher = push;
    notify();
    return merged;
  },
  disconnectAccount() {
    if (storageKey === ANON_KEY && !pusher) return;
    storageKey = ANON_KEY;
    pusher = null;
    cache = null;
    notify();
  },
};
