import { ArrowDown, ArrowUp, Check, X } from "lucide-react";
import { useMemo } from "react";

import { cn } from "@/lib/utils";
import { seededPermutation } from "@/lib/grading";
import type {
  Answer,
  ChoiceExercise,
  ClassifyExercise,
  Exercise,
  MatchExercise,
  MultiExercise,
  NumericExercise,
  OrderExercise,
  TrueFalseExercise,
} from "@/lib/content/types";
import { chipVariants, letterVariants, optionVariants, type OptionState } from "./option-styles";

export interface BodyProps<E extends Exercise> {
  exercise: E;
  answer: Answer;
  onChange: (a: Answer) => void;
  locked: boolean;
  reveal: boolean;
}

const LETTERS = "ABCDEFGH";

export function initialAnswer(ex: Exercise): Answer {
  switch (ex.kind) {
    case "choice":
      return null;
    case "numeric":
      return "";
    case "multi":
      return [];
    case "classify":
      return ex.items.map(() => -1);
    case "match":
      return ex.pairs.map(() => -1);
    case "truefalse":
      return ex.statements.map(() => null);
    case "order":
      return seededPermutation(ex.id, ex.items.length);
  }
}

export function ExerciseBody(props: BodyProps<Exercise>) {
  const { exercise } = props;
  switch (exercise.kind) {
    case "choice":
      return <ChoiceBody {...(props as BodyProps<ChoiceExercise>)} />;
    case "multi":
      return <MultiBody {...(props as BodyProps<MultiExercise>)} />;
    case "numeric":
      return <NumericBody {...(props as BodyProps<NumericExercise>)} />;
    case "classify":
      return <ClassifyBody {...(props as BodyProps<ClassifyExercise>)} />;
    case "order":
      return <OrderBody {...(props as BodyProps<OrderExercise>)} />;
    case "match":
      return <MatchBody {...(props as BodyProps<MatchExercise>)} />;
    case "truefalse":
      return <TrueFalseBody {...(props as BodyProps<TrueFalseExercise>)} />;
  }
}

function StateIcon({ state }: { state: OptionState }) {
  if (state === "correct") return <Check className="ml-auto size-5 shrink-0 text-success" />;
  if (state === "wrong") return <X className="ml-auto size-5 shrink-0 text-destructive" />;
  return null;
}

function ChoiceBody({ exercise, answer, onChange, locked, reveal }: BodyProps<ChoiceExercise>) {
  const order = useMemo(() => seededPermutation(exercise.id, exercise.options.length), [exercise]);
  return (
    <div className="grid gap-3" role="radiogroup">
      {order.map((optIndex, pos) => {
        const selected = answer === optIndex;
        const isRight = optIndex === exercise.answer;
        let state: OptionState = selected ? "selected" : "idle";
        if (locked) {
          if (selected) state = isRight ? "correct" : "wrong";
          else if (reveal && isRight) state = "missed";
          else state = "idle";
        }
        return (
          <button
            key={optIndex}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={locked}
            onClick={() => onChange(optIndex)}
            className={optionVariants({ state })}
          >
            <span className={letterVariants({ state })}>{LETTERS[pos]}</span>
            <span className="pt-0.5">{exercise.options[optIndex]}</span>
            <StateIcon state={state} />
          </button>
        );
      })}
    </div>
  );
}

function MultiBody({ exercise, answer, onChange, locked, reveal }: BodyProps<MultiExercise>) {
  const order = useMemo(() => seededPermutation(exercise.id, exercise.options.length), [exercise]);
  const picked = (answer as number[]) ?? [];
  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium text-muted-foreground">Puede haber varias respuestas correctas.</p>
      {order.map((optIndex) => {
        const selected = picked.includes(optIndex);
        const isRight = exercise.answer.includes(optIndex);
        let state: OptionState = selected ? "selected" : "idle";
        if (locked) {
          if (selected) state = isRight ? "correct" : "wrong";
          else if (reveal && isRight) state = "missed";
          else state = "idle";
        }
        return (
          <button
            key={optIndex}
            type="button"
            role="checkbox"
            aria-checked={selected}
            disabled={locked}
            onClick={() =>
              onChange(selected ? picked.filter((p) => p !== optIndex) : [...picked, optIndex])
            }
            className={optionVariants({ state })}
          >
            <span className={cn(letterVariants({ state }), "rounded-md")}>
              {selected || state === "missed" ? <Check className="size-4" /> : null}
            </span>
            <span className="pt-0.5">{exercise.options[optIndex]}</span>
            <StateIcon state={state} />
          </button>
        );
      })}
    </div>
  );
}

function NumericBody({ exercise, answer, onChange, locked, reveal }: BodyProps<NumericExercise>) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-muted-foreground" htmlFor={`num-${exercise.id}`}>
        Tu resultado
      </label>
      <div className="flex items-center gap-3">
        <input
          id={`num-${exercise.id}`}
          inputMode="decimal"
          autoComplete="off"
          disabled={locked}
          value={(answer as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe un número"
          className="h-14 w-48 rounded-xl border-2 border-ink bg-paper px-4 font-display text-2xl font-bold text-ink outline-none focus:ring-4 focus:ring-primary-soft disabled:opacity-80"
        />
        {exercise.unit && <span className="font-display text-xl font-semibold text-muted-foreground">{exercise.unit}</span>}
      </div>
      <p className="text-xs text-muted-foreground">Puedes usar coma o punto para los decimales.</p>
      {locked && reveal && (
        <p className="inline-flex rounded-lg border-2 border-dashed border-success bg-success-soft px-3 py-1.5 font-semibold">
          Solución: {exercise.answer.toLocaleString("es-ES")} {exercise.unit}
        </p>
      )}
    </div>
  );
}

function ClassifyBody({ exercise, answer, onChange, locked, reveal }: BodyProps<ClassifyExercise>) {
  const a = (answer as number[]) ?? [];
  const order = useMemo(() => seededPermutation(exercise.id, exercise.items.length), [exercise]);
  return (
    <div className="grid gap-3">
      {order.map((itemIndex) => {
        const item = exercise.items[itemIndex]!;
        const chosen = a[itemIndex];
        const rowWrong = locked && chosen !== item.category;
        return (
          <div
            key={itemIndex}
            className={cn(
              "flex flex-col gap-2 rounded-xl border-2 bg-paper px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
              locked ? (rowWrong ? "border-destructive" : "border-success") : "border-border",
            )}
          >
            <span className="font-semibold">{item.label}</span>
            <div className="flex flex-wrap gap-2">
              {exercise.categories.map((cat, ci) => {
                const selected = chosen === ci;
                let state: OptionState = selected ? "selected" : "idle";
                if (locked) {
                  if (selected) state = ci === item.category ? "correct" : "wrong";
                  else if (reveal && ci === item.category) state = "missed";
                  else state = "idle";
                }
                return (
                  <button
                    key={ci}
                    type="button"
                    disabled={locked}
                    aria-pressed={selected}
                    onClick={() => {
                      const next = [...a];
                      next[itemIndex] = ci;
                      onChange(next);
                    }}
                    className={chipVariants({ state })}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OrderBody({ exercise, answer, onChange, locked, reveal }: BodyProps<OrderExercise>) {
  const a = (answer as number[]) ?? [];
  const move = (pos: number, dir: -1 | 1) => {
    const target = pos + dir;
    if (target < 0 || target >= a.length) return;
    const next = [...a];
    const tmp = next[pos]!;
    next[pos] = next[target]!;
    next[target] = tmp;
    onChange(next);
  };
  return (
    <div className="space-y-2">
      {exercise.topLabel && (
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">↑ {exercise.topLabel}</p>
      )}
      <ol className="grid gap-2">
        {a.map((itemIndex, pos) => {
          const state: OptionState = locked ? (itemIndex === pos ? "correct" : "wrong") : "idle";
          return (
            <li key={itemIndex} className={cn(optionVariants({ state }), "items-center hover:translate-y-0")}>
              <span className={letterVariants({ state })}>{pos + 1}</span>
              <span className="flex-1 font-medium">{exercise.items[itemIndex]}</span>
              {!locked ? (
                <span className="flex gap-1">
                  <button
                    type="button"
                    aria-label="Subir"
                    onClick={() => move(pos, -1)}
                    disabled={pos === 0}
                    className="grid size-9 place-items-center rounded-lg border-2 border-border bg-paper hover:border-ink disabled:opacity-30"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Bajar"
                    onClick={() => move(pos, 1)}
                    disabled={pos === a.length - 1}
                    className="grid size-9 place-items-center rounded-lg border-2 border-border bg-paper hover:border-ink disabled:opacity-30"
                  >
                    <ArrowDown className="size-4" />
                  </button>
                </span>
              ) : (
                <StateIcon state={state} />
              )}
            </li>
          );
        })}
      </ol>
      {exercise.bottomLabel && (
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">↓ {exercise.bottomLabel}</p>
      )}
      {locked && reveal && (
        <div className="mt-3 rounded-xl border-2 border-dashed border-success bg-success-soft p-3 text-sm">
          <p className="mb-1 font-bold">Orden correcto</p>
          <ol className="list-decimal pl-5">
            {exercise.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function MatchBody({ exercise, answer, onChange, locked, reveal }: BodyProps<MatchExercise>) {
  const a = (answer as number[]) ?? [];
  const rightOrder = useMemo(() => seededPermutation(exercise.id, exercise.pairs.length), [exercise]);
  const used = new Set(a.filter((v) => v >= 0));
  return (
    <div className="grid gap-3">
      {exercise.pairs.map((pair, i) => {
        const chosen = a[i] ?? -1;
        const state: OptionState = locked ? (chosen === i ? "correct" : "wrong") : chosen >= 0 ? "selected" : "idle";
        return (
          <div
            key={pair.left}
            className={cn(
              "grid gap-2 rounded-xl border-2 bg-paper p-3 sm:grid-cols-[minmax(0,11rem)_1fr] sm:items-center",
              state === "correct" && "border-success bg-success-soft",
              state === "wrong" && "border-destructive bg-error-soft",
              (state === "idle" || state === "selected") && "border-border",
            )}
          >
            <span className="font-display font-bold">{pair.left}</span>
            <div className="space-y-1">
              <select
                aria-label={`Pareja para ${pair.left}`}
                disabled={locked}
                value={chosen}
                onChange={(e) => {
                  const next = [...a];
                  next[i] = Number(e.target.value);
                  onChange(next);
                }}
                className="h-11 w-full rounded-lg border-2 border-input bg-paper px-3 text-sm font-medium text-ink outline-none focus:border-ink disabled:opacity-90"
              >
                <option value={-1}>Elige…</option>
                {rightOrder.map((ri) => (
                  <option key={ri} value={ri}>
                    {used.has(ri) && chosen !== ri ? "· " : ""}
                    {exercise.pairs[ri]!.right}
                  </option>
                ))}
              </select>
              {locked && reveal && chosen !== i && (
                <p className="text-sm font-semibold text-success">→ {pair.right}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TrueFalseBody({ exercise, answer, onChange, locked, reveal }: BodyProps<TrueFalseExercise>) {
  const a = (answer as (boolean | null)[]) ?? [];
  return (
    <div className="grid gap-3">
      {exercise.statements.map((st, i) => {
        const chosen = a[i];
        const rowWrong = locked && chosen !== st.answer;
        return (
          <div
            key={st.text}
            className={cn(
              "flex flex-col gap-3 rounded-xl border-2 bg-paper px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
              locked ? (rowWrong ? "border-destructive" : "border-success") : "border-border",
            )}
          >
            <span>{st.text}</span>
            <div className="flex shrink-0 gap-2">
              {[true, false].map((val) => {
                const selected = chosen === val;
                let state: OptionState = selected ? "selected" : "idle";
                if (locked) {
                  if (selected) state = val === st.answer ? "correct" : "wrong";
                  else if (reveal && val === st.answer) state = "missed";
                  else state = "idle";
                }
                return (
                  <button
                    key={String(val)}
                    type="button"
                    disabled={locked}
                    aria-pressed={selected}
                    onClick={() => {
                      const next = [...a];
                      next[i] = val;
                      onChange(next);
                    }}
                    className={cn(chipVariants({ state }), "min-w-12")}
                  >
                    {val ? "V" : "F"}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
