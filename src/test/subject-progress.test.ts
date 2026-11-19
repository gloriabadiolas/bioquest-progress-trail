import { describe, expect, it } from "vitest";
import { applyAttempt, asProgressState, EMPTY_PROGRESS, mergeProgress, progressStore } from "@/lib/progress";
import { canPractice, SUBJECTS, subjectStats } from "@/lib/subject-progress";

describe("Seguimiento de clase por asignatura", () => {
  it("counts completed exercises and attempts only in their own subject", () => {
    let state = applyAttempt(EMPTY_PROGRESS, "math-radicales-square-1", 0, true);
    state = applyAttempt(state, "math-radicales-square-1", 1, false);
    state = applyAttempt(state, "n1", 1, true);
    expect(SUBJECTS.map((subject) => subjectStats(subject.exercises, state).attempted)).toEqual([1, 0, 1]);
    expect(subjectStats(SUBJECTS[0]?.exercises ?? [], state).attempts).toBe(2);
  });
  it("measures improvement across days without counting retries as initial success", () => {
    let state = applyAttempt(EMPTY_PROGRESS, "n1", 0, true, new Date("2026-11-19T10:00:00Z"));
    state = applyAttempt(state, "n1", 1, false, new Date("2026-11-19T10:01:00Z"));
    state = applyAttempt(state, "n1", 1, true, new Date("2026-11-20T10:00:00Z"));
    const stats = subjectStats(SUBJECTS[2]?.exercises ?? [], state);
    expect(stats.daily.map((day) => day.accuracy)).toEqual([0, 100]);
    expect(stats.improvement).toBe(100);
  });
  it("retains old records and does not duplicate history when syncing devices", () => {
    const old = asProgressState({ ...EMPTY_PROGRESS, records: { n1: { attempts: 3, solved: true, firstTry: false, lastFirstCheckCorrect: true, bestScore: 1, lastAt: 1 } } });
    const state = applyAttempt(old, "n2", 1, true);
    const merged = mergeProgress(state, state);
    expect(merged.history).toHaveLength(1);
    expect(merged.records["n1"]?.attempts).toBe(3);
  });
  it("requires class membership before practicing, while permitting teacher previews", () => {
    expect(["signed_out", "user", "loading"].map(canPractice)).toEqual([false, false, false]);
    expect(["student", "teacher"].map(canPractice)).toEqual([true, true]);
  });
  it("keeps each student's history in their own account storage", () => {
    progressStore.connectAccount("student-a", EMPTY_PROGRESS, () => {});
    progressStore.record("n1", 1, true);
    progressStore.connectAccount("student-b", EMPTY_PROGRESS, () => {});
    expect(progressStore.getSnapshot().records["n1"]).toBeUndefined();
    progressStore.connectAccount("student-a", EMPTY_PROGRESS, () => {});
    expect(progressStore.getSnapshot().records["n1"]?.solved).toBe(true);
    progressStore.disconnectAccount();
  });
});