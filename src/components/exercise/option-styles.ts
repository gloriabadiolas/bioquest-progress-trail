import { cva } from "class-variance-authority";

export type OptionState = "idle" | "selected" | "correct" | "wrong" | "missed";

export const optionVariants = cva(
  "w-full text-left rounded-xl border-2 px-4 py-3 transition-all flex items-start gap-3 disabled:cursor-default",
  {
    variants: {
      state: {
        idle: "border-border bg-paper hover:border-ink hover:-translate-y-0.5",
        selected: "border-ink bg-secondary shadow-press",
        correct: "border-success bg-success-soft",
        wrong: "border-destructive bg-error-soft animate-shake",
        missed: "border-success border-dashed bg-paper",
      },
    },
    defaultVariants: { state: "idle" },
  },
);

export const chipVariants = cva(
  "rounded-full border-2 px-3 py-1 text-sm font-semibold transition-all disabled:cursor-default",
  {
    variants: {
      state: {
        idle: "border-border bg-paper text-muted-foreground hover:border-ink hover:text-ink",
        selected: "border-ink bg-ink text-paper",
        correct: "border-success bg-success text-success-foreground",
        wrong: "border-destructive bg-destructive text-destructive-foreground",
        missed: "border-success border-dashed bg-success-soft text-ink",
      },
    },
    defaultVariants: { state: "idle" },
  },
);

export const letterVariants = cva(
  "grid size-7 shrink-0 place-items-center rounded-lg border-2 text-sm font-bold font-display",
  {
    variants: {
      state: {
        idle: "border-border text-muted-foreground",
        selected: "border-ink bg-ink text-paper",
        correct: "border-success bg-success text-success-foreground",
        wrong: "border-destructive bg-destructive text-destructive-foreground",
        missed: "border-success border-dashed text-success",
      },
    },
    defaultVariants: { state: "idle" },
  },
);
