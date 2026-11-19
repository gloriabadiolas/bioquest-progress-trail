import type { Exercise } from "./types";
import type { TheorySection } from "./theory";

export interface RadicalSection {
  id: string;
  title: string;
  example: string;
  theory: TheorySection[];
  exercises: Exercise[];
}

export const SQUARE_ROOTS = [0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225];
export const POWER_ROOTS = [
  { base: 7, index: 2, exponent: 1 },
  { base: 5, index: 3, exponent: 1 },
  { base: 3, index: 4, exponent: 1 },
  { base: 2, index: 5, exponent: 1 },
  { base: 5, index: 2, exponent: 3 },
  { base: 2, index: 3, exponent: 2 },
  { base: 7, index: 4, exponent: 3 },
  { base: 3, index: 5, exponent: 2 },
];

export const ROOT_OPERATIONS = [
  { operation: "multiply", index: 2, a: 2, b: 8, answer: 4 },
  { operation: "multiply", index: 2, a: 3, b: 12, answer: 6 },
  { operation: "multiply", index: 2, a: 5, b: 20, answer: 10 },
  { operation: "multiply", index: 2, a: 7, b: 7, answer: 7 },
  { operation: "multiply", index: 2, a: 2, b: 3, answer: "√6" },
  { operation: "multiply", index: 3, a: 2, b: 4, answer: 2 },
  { operation: "multiply", index: 3, a: 3, b: 9, answer: 3 },
  { operation: "multiply", index: 3, a: 2, b: 5, answer: "∛10" },
  { operation: "divide", index: 2, a: 18, b: 2, answer: 3 },
  { operation: "divide", index: 2, a: 48, b: 3, answer: 4 },
  { operation: "divide", index: 2, a: 75, b: 3, answer: 5 },
  { operation: "divide", index: 2, a: 98, b: 2, answer: 7 },
  { operation: "divide", index: 2, a: 30, b: 5, answer: "√6" },
  { operation: "divide", index: 3, a: 54, b: 2, answer: 3 },
  { operation: "divide", index: 3, a: 128, b: 2, answer: 4 },
  { operation: "divide", index: 3, a: 60, b: 6, answer: "∛10" },
] as const;

function root(index: number, value: string | number) {
  if (index === 2) return `√(${value})`;
  if (index === 3) return `∛(${value})`;
  return `${index === 4 ? "⁴" : "⁵"}√(${value})`;
}

function operationExercises(operation: "multiply" | "divide"): Exercise[] {
  return ROOT_OPERATIONS.filter((item) => item.operation === operation).map((item, i) => {
    const symbol = operation === "multiply" ? "×" : "÷";
    const radicand = operation === "multiply" ? item.a * item.b : item.a / item.b;
    const correct = String(item.answer);
    const options = [...new Set([correct, root(item.index, item.a + item.b), String(radicand), root(item.index, Math.abs(item.a - item.b))])];
    return {
      id: `math-radicales-${operation}-${i + 1}`,
      kind: "choice",
      prompt: `Calcula y simplifica: ${root(item.index, item.a)} ${symbol} ${root(item.index, item.b)}`,
      options,
      answer: 0,
      explanation: `Los índices son iguales: ${root(item.index, `${item.a} ${symbol} ${item.b}`)} = ${root(item.index, radicand)}${typeof item.answer === "number" ? ` = ${correct}` : ""}. Se conserva el índice y se operan los radicandos.`,
      skills: ["calculo", "conceptos"],
    };
  });
}

export const RADICAL_SECTIONS: RadicalSection[] = [
  {
    id: "cuadrados-perfectos", title: "Cuadrados perfectos", example: "√64 = 8",
    theory: [{ title: "Raíz cuadrada de un cuadrado perfecto", points: [
      "La raíz cuadrada principal es el número no negativo que, al multiplicarse por sí mismo, da el radicando.",
      "Por ejemplo, √256 = 16 porque 16 × 16 = 256. √0 = 0.",
      "√a indica la raíz principal; no se responde ±. En cambio, una ecuación como x² = a puede tener dos soluciones.",
    ] }],
    exercises: SQUARE_ROOTS.map((n, i) => ({
      id: `math-radicales-square-${i + 1}`, kind: "numeric", prompt: `¿Cuál es el resultado de √${n}?`,
      answer: Math.sqrt(n), tolerance: 0,
      explanation: `√${n} = ${Math.sqrt(n)}, porque ${Math.sqrt(n)} × ${Math.sqrt(n)} = ${n}. La raíz principal es no negativa.`,
      skills: ["calculo"],
    })),
  },
  {
    id: "raices-a-potencias", title: "Raíces a potencias", example: "∛(5²) = 5^(2/3)",
    theory: [{ title: "Exponentes fraccionarios", points: [
      "Para bases positivas, ⁿ√(aᵐ) = a^(m/n). El exponente del radicando va en el numerador y el índice de la raíz en el denominador.",
      "Si no aparece un exponente en el radicando, es 1. Si no aparece índice, es una raíz cuadrada (índice 2).",
      "Ejemplo: ⁴√(11³) = 11^(3/4). La notación ^ significa «elevado a».",
    ] }],
    exercises: POWER_ROOTS.map(({ base, index, exponent }, i) => ({
      id: `math-radicales-power-${i + 1}`, kind: "choice",
      prompt: `Expresa como potencia: ${root(index, exponent === 1 ? base : `${base}^${exponent}`)}`,
      options: [`${base}^(${exponent}/${index})`, `${base}^(${index}/${exponent})`, `${base}^(${exponent * index})`, `${index}^(${exponent}/${base})`],
      answer: 0,
      explanation: `La base es ${base}. El exponente ${exponent} va arriba y el índice ${index} abajo: ${base}^(${exponent}/${index}).`,
      skills: ["conceptos", "calculo"],
    })),
  },
  {
    id: "multiplicar-raices", title: "Multiplicar raíces", example: "√2 × √8 = √16 = 4",
    theory: [{ title: "Producto de raíces del mismo índice", points: [
      "Con radicandos no negativos e índices iguales, ⁿ√a × ⁿ√b = ⁿ√(a × b).",
      "Se conserva el índice y se multiplican los radicandos. Ejemplo: √6 × √24 = √144 = 12.",
      "Si el radicando no es una potencia perfecta, el resultado puede quedarse como raíz: √2 × √5 = √10.",
    ] }], exercises: operationExercises("multiply"),
  },
  {
    id: "dividir-raices", title: "Dividir raíces", example: "√18 ÷ √2 = √9 = 3",
    theory: [{ title: "Cociente de raíces del mismo índice", points: [
      "Con radicandos no negativos e índices iguales, ⁿ√a ÷ ⁿ√b = ⁿ√(a ÷ b), siempre que b > 0.",
      "Se conserva el índice y se dividen los radicandos. Ejemplo: √80 ÷ √5 = √16 = 4.",
      "Simplifica si es posible; si no, conserva la raíz. No se puede dividir entre cero.",
    ] }], exercises: operationExercises("divide"),
  },
];

export const RADICAL_EXERCISES = RADICAL_SECTIONS.flatMap((section) => section.exercises);