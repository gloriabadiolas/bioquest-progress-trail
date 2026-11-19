import { ALL_EXERCISES, MISSIONS } from "@/lib/content/missions";
import { RADICAL_EXERCISES, RADICAL_SECTIONS } from "@/lib/content/radicals";
import type { Exercise } from "@/lib/content/types";
import { statsFor, type ProgressState } from "@/lib/progress";

export const SUBJECTS = [
  { id: "matematicas", name: "Matemáticas", exercises: RADICAL_EXERCISES, topics: RADICAL_SECTIONS },
  { id: "fisica-quimica", name: "Física y Química", exercises: [] as Exercise[], topics: [] },
  { id: "biologia", name: "Biología", exercises: ALL_EXERCISES, topics: MISSIONS },
];
export const ALL_SUBJECT_EXERCISES = SUBJECTS.flatMap((subject) => subject.exercises);

export function subjectStats(exercises: Exercise[], state: ProgressState) {
  const ids = new Set(exercises.map((exercise) => exercise.id));
  const days = new Map<string, { attempts: number; correct: number; checks: number }>();
  for (const event of state.history ?? []) {
    if (!ids.has(event.exerciseId)) continue;
    const day = new Date(event.at).toISOString().slice(0, 10);
    const row = days.get(day) ?? { attempts: 0, correct: 0, checks: 0 };
    row.attempts++;
    if (event.firstCheck) { row.checks++; if (event.score >= 1 - 1e-9) row.correct++; }
    days.set(day, row);
  }
  const daily = [...days.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([day, row]) => ({
    day, attempts: row.attempts, accuracy: row.checks ? Math.round(100 * row.correct / row.checks) : null,
  }));
  const scored = daily.filter((day) => day.accuracy !== null);
  const first = scored[0]?.accuracy;
  const last = scored.at(-1)?.accuracy;
  return {
    ...statsFor(exercises, state),
    attempts: exercises.reduce((sum, exercise) => sum + (state.records[exercise.id]?.attempts ?? 0), 0),
    daily,
    improvement: scored.length >= 2 && first !== null && first !== undefined && last !== null && last !== undefined ? last - first : null,
  };
}

export function canPractice(status: string) {
  return status === "student" || status === "teacher";
}