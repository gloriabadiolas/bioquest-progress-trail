import { createFileRoute, Link, useHydrated } from "@tanstack/react-router";
import { ArrowRight, Check, Circle, RotateCcw, Trash2 } from "lucide-react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";

import { MedalBadge } from "@/components/MedalBadge";
import { MissionIcon, MISSION_BG } from "@/components/MissionIcon";
import { Bar } from "@/components/ProgressRing";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/use-progress";
import { SKILL_LABELS } from "@/lib/content/types";
import { ALL_EXERCISES, MISSIONS } from "@/lib/content/missions";
import { exerciseStatus, medalFor, progressStore, skillStats, statsFor } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { SUBJECTS } from "@/lib/subject-progress";
import { SubjectProgress } from "@/components/SubjectProgress";
import { useAccount } from "@/hooks/use-account";
import { StudentAvatarEditor } from "@/components/StudentAvatar";

export const Route = createFileRoute("/progreso")({
  head: () => ({
    meta: [
      { title: "Mi progreso por asignatura · Repaso ESO" },
      { name: "description", content: "Ejercicios realizados, resultados y evolución en tus asignaturas de 3.º ESO." },
      { property: "og:title", content: "Mi progreso por asignatura · Repaso ESO" },
      { property: "og:description", content: "Tu avance en Matemáticas, Física y Química y Biología." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const progress = useProgress();
  const account = useAccount();
  const hydrated = useHydrated();
  const overall = statsFor(ALL_EXERCISES, progress);
  const skills = skillStats(MISSIONS, progress);
  const radarData = skills.map((s) => ({ skill: SKILL_LABELS[s.skill], value: s.percent }));
  const strongest = [...skills].filter((s) => s.attempted).sort((a, b) => b.percent - a.percent)[0];
  const weakest = [...skills].sort((a, b) => a.percent - b.percent)[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">3.º ESO · Todas las asignaturas</p>
          <h1 className="text-4xl font-extrabold">Mi progreso</h1>
        </div>
        {account.status !== "student" && <ResetButton />}
      </div>

      <StudentAvatarEditor />
      <section className="grid gap-6 border-b border-border pb-8 lg:grid-cols-3" aria-label="Progreso por asignatura">
        {SUBJECTS.map((subject) => <SubjectProgress key={subject.id} subject={subject} state={progress} />)}
      </section>
      <h2 className="text-2xl font-extrabold">Biología · Alimentación y nutrición</h2>

      <section className="grid gap-4 md:grid-cols-3">
        <Summary label="Ejercicios resueltos" value={`${overall.solved}/${overall.total}`} bar={overall.percent} />
        <Summary label="Acierto a la primera" value={`${overall.accuracy}%`} bar={overall.accuracy} barClassName="bg-accent" />
        <Summary
          label="Puntos"
          value={`${overall.points}`}
          bar={overall.maxPoints ? (overall.points / overall.maxPoints) * 100 : 0}
          barClassName="bg-gold"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="surface p-5">
          <h2 className="text-xl font-extrabold">Tus competencias</h2>
          <p className="text-sm text-muted-foreground">% de ejercicios resueltos de cada tipo</p>
          <div className="h-72">
            {hydrated && (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="62%" margin={{ top: 10, right: 40, bottom: 10, left: 40 }}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "var(--ink)", fontSize: 11, fontWeight: 600 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.35} strokeWidth={2.5} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="grid gap-2 text-sm">
            {strongest && (
              <p className="rounded-lg bg-success-soft px-3 py-2">
                <b>Tu punto fuerte:</b> {SKILL_LABELS[strongest.skill]} ({strongest.percent} %)
              </p>
            )}
            {overall.attempted > 0 && weakest && (
              <p className="rounded-lg bg-accent-soft px-3 py-2">
                <b>Para reforzar:</b> {SKILL_LABELS[weakest.skill]} ({weakest.percent} %)
              </p>
            )}
          </div>
        </div>

        <div className="surface p-5">
          <h2 className="mb-4 text-xl font-extrabold">Por misiones</h2>
          <div className="space-y-4">
            {MISSIONS.map((m) => {
              const st = statsFor(m.exercises, progress);
              return (
                <div key={m.id} className="flex items-center gap-3">
                  <MissionIcon mission={m} className="size-10 [&_svg]:size-5" />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                      <Link to="/mision/$id" params={{ id: m.id }} className="truncate font-bold hover:underline">
                        {m.title}
                      </Link>
                      <span className="shrink-0 font-semibold text-muted-foreground">{st.percent}%</span>
                    </div>
                    <Bar value={st.percent} barClassName={MISSION_BG[m.number]} />
                  </div>
                  <MedalBadge medal={medalFor(st.percent)} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-extrabold">Ejercicio a ejercicio</h2>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Legend className="bg-success" label="Dominado" />
          <Legend className="bg-destructive" label="Para repasar" />
          <Legend className="bg-paper" label="Sin hacer" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {MISSIONS.map((m) => (
            <div key={m.id} className="surface-soft p-4">
              <p className="mb-3 font-display font-bold">
                {m.number}. {m.title}
              </p>
              <ul className="space-y-1.5">
                {m.exercises.map((e, i) => {
                  const rec = progress.records[e.id];
                  const s = exerciseStatus(rec);
                  return (
                    <li key={e.id} className="flex items-start gap-2 text-sm">
                      {s === "solved" ? (
                        <Check className="mt-0.5 size-4 shrink-0 text-success" />
                      ) : s === "review" ? (
                        <RotateCcw className="mt-0.5 size-4 shrink-0 text-destructive" />
                      ) : (
                        <Circle className="mt-0.5 size-4 shrink-0 text-border" />
                      )}
                      <span className={cn("flex-1", s === "new" && "text-muted-foreground")}>
                        {i + 1}. {e.prompt}
                      </span>
                      {rec && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {rec.attempts} {rec.attempts === 1 ? "intento" : "intentos"}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <Button asChild variant="popAccent" size="xl">
            <Link to="/repaso">
              Repasar mis fallos <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function Summary({ label, value, bar, barClassName }: { label: string; value: string; bar: number; barClassName?: string | undefined }) {
  return (
    <div className="surface-soft space-y-3 p-5">
      <p className="text-sm font-bold text-muted-foreground">{label}</p>
      <p className="font-display text-4xl font-extrabold leading-none">{value}</p>
      <Bar value={bar} barClassName={barClassName} />
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("size-3 rounded-full border-2 border-ink", className)} /> {label}
    </span>
  );
}

function ResetButton() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost">
          <Trash2 /> Borrar progreso
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Empezar de cero?</AlertDialogTitle>
          <AlertDialogDescription>
            Se borrarán todos tus puntos, medallas y ejercicios resueltos en este dispositivo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => progressStore.reset()}>Sí, borrar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
