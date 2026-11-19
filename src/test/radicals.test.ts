import { describe, expect, it } from "vitest";
import { POWER_ROOTS, RADICAL_EXERCISES, RADICAL_SECTIONS, ROOT_OPERATIONS, SQUARE_ROOTS } from "@/lib/content/radicals";
import { gradeExercise } from "@/lib/grading";
import { applyAttempt, EMPTY_PROGRESS, statsFor } from "@/lib/progress";
import { ALL_EXERCISES } from "@/lib/content/missions";

describe("Radicales", () => {
  it("tests square roots of perfect squares including zero and rejects negative principal roots", () => {
    const section = RADICAL_SECTIONS[0];
    expect(section?.exercises.length).toBe(16);
    section?.exercises.forEach((ex, i) => {
      const value = SQUARE_ROOTS[i];
      if (value === undefined) throw new Error("Missing square");
      expect(gradeExercise(ex, String(Math.sqrt(value))).correct).toBe(true);
      if (value > 0) expect(gradeExercise(ex, String(-Math.sqrt(value))).correct).toBe(false);
    });
  });
  it("converts roots to fractional powers with exponent above index", () => {
    const section = RADICAL_SECTIONS[1];
    expect(section?.exercises.length).toBe(8);
    section?.exercises.forEach((ex, i) => {
      const source = POWER_ROOTS[i];
      if (ex.kind !== "choice" || !source) throw new Error("Missing power");
      expect(ex.options[ex.answer]).toBe(`${source.base}^(${source.exponent}/${source.index})`);
      expect(gradeExercise(ex, 1).correct).toBe(false);
    });
  });
  it.each(["multiply", "divide"] as const)("uses only equal-index roots for %s, requiring no mcm", (operation) => {
    const section = RADICAL_SECTIONS[operation === "multiply" ? 2 : 3];
    const sources = ROOT_OPERATIONS.filter((item) => item.operation === operation);
    expect(sources.length).toBe(8);
    section?.exercises.forEach((ex, i) => {
      const source = sources[i];
      if (ex.kind !== "choice" || !source) throw new Error("Missing operation");
      const symbol = source.index === 2 ? "√" : "∛";
      expect(ex.prompt.split(symbol).length - 1).toBe(2);
      expect(ex.options[ex.answer]).toBe(String(source.answer));
      const radicand = operation === "multiply" ? source.a * source.b : source.a / source.b;
      const result = typeof source.answer === "number" ? source.answer ** source.index : Number(source.answer.slice(1));
      expect(result).toBe(radicand);
      expect(gradeExercise(ex, 1).correct).toBe(false);
    });
  });
  it("keeps math progress separate from Biology exercise totals", () => {
    const ex = RADICAL_EXERCISES[0];
    if (!ex) throw new Error("No exercise");
    const state = applyAttempt(EMPTY_PROGRESS, ex.id, 1, true);
    expect(statsFor(RADICAL_EXERCISES, state).solved).toBe(1);
    expect(statsFor(ALL_EXERCISES, state).solved).toBe(0);
    expect(new Set(RADICAL_EXERCISES.map((item) => item.id)).size).toBe(40);
  });
});