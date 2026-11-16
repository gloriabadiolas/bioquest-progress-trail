import { describe, expect, it } from "vitest";

import { ALL_EXERCISES, MISSIONS } from "@/lib/content/missions";
import type { Exercise } from "@/lib/content/types";
import { gradeExercise, parseNumber } from "@/lib/grading";
import { applyAttempt, EMPTY_PROGRESS, medalFor, reviewList, statsFor } from "@/lib/progress";

const byId = (id: string) => ALL_EXERCISES.find((e) => e.id === id) as Exercise;

describe("grading", () => {
  it("accepts comma decimals within tolerance (IMC de Antonio ≈ 27,4)", () => {
    expect(parseNumber("27,4")).toBe(27.4);
    expect(gradeExercise(byId("r4"), "27,4").correct).toBe(true);
    expect(gradeExercise(byId("r4"), "25").correct).toBe(false);
  });

  it("metabolismo basal de Lucía is 1208,3 kcal", () => {
    expect(gradeExercise(byId("e3"), "1208,3").correct).toBe(true);
    expect(gradeExercise(byId("e3"), "1250").correct).toBe(false);
  });

  it("multi-select needs exactly the correct set", () => {
    const ex = byId("r8");
    expect(gradeExercise(ex, [0, 1]).correct).toBe(true);
    expect(gradeExercise(ex, [0]).correct).toBe(false);
    expect(gradeExercise(ex, [0, 1, 2]).correct).toBe(false);
  });
});

describe("progress", () => {
  it("gives 10 points first try and 5 after retrying", () => {
    let s = applyAttempt(EMPTY_PROGRESS, "n1", 1, true);
    s = applyAttempt(s, "n2", 0, true);
    s = applyAttempt(s, "n2", 1, false);
    expect(statsFor(MISSIONS[0]!.exercises, s).points).toBe(15);
  });

  it("medals: bronce from 40 %, plata from 75 %, oro at 100 %", () => {
    expect(medalFor(39)).toBeNull();
    expect(medalFor(40)).toBe("bronce");
    expect(medalFor(75)).toBe("plata");
    expect(medalFor(100)).toBe("oro");
  });

  it("a failed exercise stays in review until answered right first time in a later visit", () => {
    let s = applyAttempt(EMPTY_PROGRESS, "n1", 0, true);
    s = applyAttempt(s, "n1", 1, false);
    expect(reviewList(MISSIONS, s).map((e) => e.id)).toContain("n1");
    s = applyAttempt(s, "n1", 1, true);
    expect(reviewList(MISSIONS, s).map((e) => e.id)).not.toContain("n1");
  });

  it("every exercise id is unique", () => {
    const ids = ALL_EXERCISES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
