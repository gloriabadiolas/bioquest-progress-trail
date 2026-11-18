import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Check, Eye, Lightbulb, PartyPopper, RotateCcw, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { MedalBadge } from "@/components/MedalBadge";
import { SKILL_LABELS, type Answer, type Exercise } from "@/lib/content/types";
import { gradeExercise, isAnswerComplete, type GradeResult } from "@/lib/grading";
import { exerciseStatus, medalFor, POINTS_FIRST_TRY, POINTS_LATER, progressStore } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { theoryForExercise } from "@/lib/content/theory";
import { ExerciseBody, initialAnswer } from "./ExerciseBody";

type SessionResult = "first" | "later" | "failed";

export function Player({
  exercises,
  title,
  accentClass,
  onRestart,
  restartLabel = "Repetir misión",
  showReviewLink = true,
}: {
  exercises: Exercise[];
  title: string;
  accentClass?: string | undefined;
  onRestart?: () => void;
  restartLabel?: string;
  showReviewLink?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<Answer>(() => (exercises[0] ? initialAnswer(exercises[0]) : null));
  const [result, setResult] = useState<GradeResult | null>(null);
  const [checks, setChecks] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [hint, setHint] = useState(false);
  const [session, setSession] = useState<Record<string, SessionResult>>({});
  const [finished, setFinished] = useState(false);
  // Status before this visit, so the badge doesn't flip as soon as you answer.
  const [recStatus, setRecStatus] = useState<ReturnType<typeof exerciseStatus>>("new");

  const ex = exercises[index];

  useEffect(() => {
    if (!ex) return;
    setAnswer(initialAnswer(ex));
    setResult(null);
    setChecks(0);
    setReveal(false);
    setHint(false);
    setRecStatus(exerciseStatus(progressStore.getSnapshot().records[ex.id]));
  }, [ex]);

  const complete = ex ? isAnswerComplete(ex, answer) : false;

  const check = () => {
    if (!ex || !complete) return;
    const r = gradeExercise(ex, answer);
    const firstCheck = checks === 0;
    progressStore.record(ex.id, r.score, firstCheck);
    setResult(r);
    setChecks((c) => c + 1);
    setSession((s) => {
      if (s[ex.id] === "first" || s[ex.id] === "later") return s;
      return { ...s, [ex.id]: r.correct ? (firstCheck ? "first" : "later") : "failed" };
    });
  };

  const retry = () => {
    setResult(null);
    setReveal(false);
  };

  const next = () => {
    if (index + 1 >= exercises.length) setFinished(true);
    else setIndex(index + 1);
  };

  const sessionStats = useMemo(() => {
    const vals = Object.values(session);
    return {
      first: vals.filter((v) => v === "first").length,
      later: vals.filter((v) => v === "later").length,
      failed: vals.filter((v) => v === "failed").length,
      points: vals.reduce((p, v) => p + (v === "first" ? POINTS_FIRST_TRY : v === "later" ? POINTS_LATER : 0), 0),
    };
  }, [session]);

  if (!exercises.length) return null;

  if (finished) {
    const pct = Math.round(((sessionStats.first + sessionStats.later) / exercises.length) * 100);
    const failedIds = exercises.filter((e) => session[e.id] === "failed" || !session[e.id]);
    return (
      <div className="surface animate-pop-in mx-auto max-w-xl p-8 text-center">
        <PartyPopper className="mx-auto size-12 text-accent" />
        <h2 className="mt-3 text-3xl font-extrabold">¡Misión terminada!</h2>
        <p className="mt-1 text-muted-foreground">{title}</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <MedalBadge medal={medalFor(pct)} className="size-14" />
          <div className="text-left">
            <p className="font-display text-4xl font-extrabold">{pct}%</p>
            <p className="text-sm text-muted-foreground">resuelto en esta ronda</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 text-sm">
          <Stat label="A la primera" value={sessionStats.first} className="bg-success-soft" />
          <Stat label="Tras reintentar" value={sessionStats.later} className="bg-secondary" />
          <Stat label="Para repasar" value={sessionStats.failed} className="bg-error-soft" />
        </div>
        <p className="mt-4 font-semibold">+{sessionStats.points} puntos</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {showReviewLink && failedIds.length > 0 && (
            <Button asChild variant="popAccent" size="xl">
              <Link to="/repaso">
                <RotateCcw /> Repasar fallos
              </Link>
            </Button>
          )}
          {onRestart && (
            <Button variant="popPaper" size="xl" onClick={onRestart}>
              {restartLabel}
            </Button>
          )}
          <Button asChild variant="pop" size="xl">
            <Link to="/biologia/tema-2">
              Volver al mapa <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!ex) return null;
  const locked = result !== null;

  return (
    <div className="space-y-5">
      {/* progress dots */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>
            Ejercicio {index + 1} <span className="text-muted-foreground">de {exercises.length}</span>
          </span>
          <span className="text-muted-foreground">+{sessionStats.points} pts</span>
        </div>
        <div className="flex gap-1.5">
          {exercises.map((e, i) => {
            const s = session[e.id];
            return (
              <button
                key={e.id}
                type="button"
                aria-label={`Ir al ejercicio ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-2.5 flex-1 rounded-full border-2 border-ink transition-all",
                  i === index && "h-3.5 -translate-y-0.5",
                  s === "first" && "bg-success",
                  s === "later" && "bg-gold",
                  s === "failed" && "bg-destructive",
                  !s && (i === index ? "bg-ink" : "bg-paper"),
                )}
              />
            );
          })}
        </div>
      </div>

      <article key={ex.id} className="surface animate-rise overflow-hidden">
        <div className={cn("flex flex-wrap items-center gap-2 border-b-2 border-ink px-5 py-3", accentClass ?? "bg-secondary")}>
          {ex.skills.map((s) => (
            <span key={s} className="rounded-full border-2 border-ink bg-paper px-2.5 py-0.5 text-xs font-bold">
              {SKILL_LABELS[s]}
            </span>
          ))}
          {recStatus === "solved" && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full border-2 border-ink bg-success-soft px-2.5 py-0.5 text-xs font-bold">
              <Check className="size-4" /> Ya lo dominabas
            </span>
          )}
          {recStatus === "review" && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full border-2 border-ink bg-error-soft px-2.5 py-0.5 text-xs font-bold">
              <RotateCcw className="size-4" /> Para repasar
            </span>
          )}
        </div>

        <div className="space-y-5 p-5 sm:p-7">
          {ex.reading && (
            <div className="rounded-xl border-l-4 border-primary bg-primary-soft/60 p-4">
              <p className="mb-1 flex items-center gap-2 font-display font-bold">
                <BookOpen className="size-4" /> {ex.reading.title}
              </p>
              <p className="text-[0.95rem] leading-relaxed">{ex.reading.text}</p>
            </div>
          )}
          {ex.context && <p className="text-[1.02rem] leading-relaxed text-muted-foreground">{ex.context}</p>}
          {ex.table && (
            <div className="overflow-x-auto rounded-xl border-2 border-ink">
              <table className="w-full text-sm">
                {ex.table.caption && <caption className="bg-muted px-3 py-2 text-left font-bold">{ex.table.caption}</caption>}
                <thead className="bg-ink text-paper">
                  <tr>
                    {ex.table.headers.map((h, i) => (
                      <th key={i} className="px-3 py-2 text-left font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ex.table.rows.map((row, ri) => (
                    <tr key={ri} className="odd:bg-paper even:bg-muted/60">
                      {row.map((cell, ci) => (
                        <td key={ci} className={cn("px-3 py-1.5", ci === 0 && "font-semibold")}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <h2 className="text-xl font-extrabold leading-snug sm:text-2xl">{ex.prompt}</h2>
          <div>
            <Button variant="popPaper" onClick={() => setHint((h) => !h)} aria-expanded={hint}>
              <Lightbulb /> {hint ? "Ocultar pista" : "PISTA"}
            </Button>
            {hint && (
              <div className="animate-pop-in mt-3 space-y-4 rounded-xl border-2 border-ink bg-gold/15 p-4">
                {theoryForExercise(ex.id).map((sec) => (
                  <div key={sec.title}>
                    <p className="mb-1.5 flex items-center gap-2 font-display font-bold">
                      <BookOpen className="size-4" /> Teoría: {sec.title}
                    </p>
                    <ul className="list-disc space-y-1 pl-5 text-[0.95rem] leading-relaxed">
                      {sec.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <ExerciseBody exercise={ex} answer={answer} onChange={setAnswer} locked={locked} reveal={reveal || !!result?.correct} />
        </div>

        {/* feedback / actions */}
        <div
          className={cn(
            "border-t-2 border-ink px-5 py-4 sm:px-7",
            !result && "bg-muted/60",
            result?.correct && "bg-success-soft",
            result && !result.correct && "bg-error-soft",
          )}
        >
          {!result && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {complete ? "¿Lo tienes? Compruébalo." : "Completa tu respuesta para comprobarla."}
              </p>
              <Button variant="pop" size="xl" disabled={!complete} onClick={check}>
                Comprobar
              </Button>
            </div>
          )}

          {result && (
            <div className="animate-pop-in space-y-3">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-10 place-items-center rounded-full border-2 border-ink",
                    result.correct ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground",
                  )}
                >
                  {result.correct ? <Check className="size-5" /> : <X className="size-5" />}
                </span>
                <div>
                  <p className="font-display text-lg font-extrabold">
                    {result.correct
                      ? checks === 1
                        ? "¡Perfecto, a la primera!"
                        : "¡Ahora sí!"
                      : result.score > 0
                        ? `Casi: tienes bien el ${Math.round(result.score * 100)} %`
                        : "Esta vez no"}
                  </p>
                  {!result.correct && !reveal && (
                    <p className="text-sm text-muted-foreground">Revisa lo marcado en rojo e inténtalo otra vez.</p>
                  )}
                </div>
              </div>

              {(result.correct || reveal) && (
                <p className="flex gap-2 rounded-xl bg-paper/80 p-3 text-[0.95rem] leading-relaxed">
                  <Lightbulb className="mt-0.5 size-5 shrink-0 text-gold" />
                  <span>{ex.explanation}</span>
                </p>
              )}

              <div className="flex flex-wrap justify-end gap-3">
                {!result.correct && (
                  <>
                    {!reveal && (
                      <Button variant="ghost" onClick={() => setReveal(true)}>
                        <Eye /> Ver solución
                      </Button>
                    )}
                    <Button variant="popPaper" size="xl" onClick={retry}>
                      <RotateCcw /> Reintentar
                    </Button>
                  </>
                )}
                {(result.correct || reveal) && (
                  <Button variant="pop" size="xl" onClick={next}>
                    {index + 1 >= exercises.length ? "Ver resultados" : "Siguiente"} <ArrowRight />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

function Stat({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <div className={cn("rounded-xl border-2 border-ink p-3", className)}>
      <p className="font-display text-2xl font-extrabold">{value}</p>
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
    </div>
  );
}

