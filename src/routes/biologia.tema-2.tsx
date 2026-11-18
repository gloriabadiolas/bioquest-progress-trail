import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, Target, Trophy, Zap } from "lucide-react";

import heroImg from "@/assets/mesa-mediterranea.jpg";
import { MedalBadge } from "@/components/MedalBadge";
import { MissionIcon } from "@/components/MissionIcon";
import { ProgressRing } from "@/components/ProgressRing";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/use-progress";
import { ALL_EXERCISES, MISSIONS } from "@/lib/content/missions";
import { exerciseStatus, medalFor, statsFor } from "@/lib/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/biologia/tema-2")({
  head: () => ({
    meta: [
      { title: "Repaso Tema 2 · Alimentación y nutrición · Biología 3.º ESO" },
      {
        name: "description",
        content: "Seis misiones de ejercicios competenciales para repasar nutrientes, dietas, etiquetas y salud. Tu progreso se guarda solo.",
      },
      { property: "og:title", content: "Repaso Tema 2 · Alimentación y nutrición" },
      {
        property: "og:description",
        content: "Seis misiones de ejercicios competenciales para repasar nutrientes, dietas, etiquetas y salud.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const progress = useProgress();
  const overall = statsFor(ALL_EXERCISES, progress);
  const nextMission = MISSIONS.find((m) => statsFor(m.exercises, progress).percent < 100) ?? MISSIONS[0];
  const medals = MISSIONS.map((m) => medalFor(statsFor(m.exercises, progress).percent)).filter(Boolean).length;
  const started = overall.attempted > 0;
  if (!nextMission) return null;

  return (
    <div className="space-y-10">
      <Link to="/biologia" className="inline-flex items-center gap-2 text-sm font-bold text-primary">← Biología · Todos los temas</Link>
      <section className="surface grid overflow-hidden md:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col justify-center gap-5 p-6 sm:p-9">
          <span className="w-fit rounded-full border-2 border-ink bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Biología y Geología · 3.º ESO
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.02] sm:text-5xl">
            Tema 2: <span className="text-primary">Alimentación</span> y{" "}
            <span className="text-accent">nutrición</span>
          </h1>
          <p className="max-w-md text-muted-foreground">
            {ALL_EXERCISES.length} retos con situaciones reales: calcula, interpreta etiquetas, diseña menús y razona
            como un científico. Tu progreso se guarda en este dispositivo.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="pop" size="xl">
              <Link to="/mision/$id" params={{ id: nextMission.id }}>
                {started ? "Continuar" : "Empezar"}: {nextMission.title} <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
        <img
          src={heroImg}
          alt="Mesa con alimentos de la dieta mediterránea: aceite de oliva, pan, lentejas, pescado, ensalada y fruta"
          width={1280}
          height={832}
          className="h-56 w-full border-t-2 border-ink object-cover md:h-full md:border-l-2 md:border-t-0"
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-[auto_1fr]">
        <div className="surface-soft flex items-center gap-5 p-5">
          <ProgressRing value={overall.percent} size={112}>
            <div>
              <p className="font-display text-3xl font-extrabold leading-none">{overall.percent}%</p>
              <p className="text-[0.7rem] font-semibold text-muted-foreground">del tema</p>
            </div>
          </ProgressRing>
          <div>
            <p className="font-display text-lg font-bold">Tu avance</p>
            <p className="text-sm text-muted-foreground">
              {overall.solved} de {overall.total} ejercicios resueltos
            </p>
            <Link to="/progreso" className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
              Ver detalle <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatTile icon={<Zap />} label="Puntos" value={`${overall.points}`} sub={`de ${overall.maxPoints}`} tone="bg-secondary" />
          <StatTile icon={<Target />} label="A la primera" value={`${overall.accuracy}%`} sub="de los intentados" tone="bg-primary-soft" />
          <StatTile icon={<Trophy />} label="Medallas" value={`${medals}`} sub={`de ${MISSIONS.length}`} tone="bg-accent-soft" />
          <StatTile icon={<CalendarCheck />} label="Días de estudio" value={`${progress.studyDays.length}`} sub="con ejercicios" tone="bg-muted" />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-extrabold">Mapa de misiones</h2>
          <p className="hidden text-sm text-muted-foreground sm:block">Bronce 40 % · Plata 75 % · Oro 100 %</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {MISSIONS.map((m, i) => {
            const st = statsFor(m.exercises, progress);
            return (
              <Link
                key={m.id}
                to="/mision/$id"
                params={{ id: m.id }}
                className="surface group flex flex-col gap-4 p-5 transition-transform hover:-translate-y-1 animate-rise"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start gap-4">
                  <MissionIcon mission={m} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Misión {m.number}</p>
                    <h3 className="text-xl font-extrabold leading-tight">{m.title}</h3>
                    <p className="text-sm text-muted-foreground">{m.subtitle}</p>
                  </div>
                  <MedalBadge medal={medalFor(st.percent)} />
                </div>
                <div className="flex gap-1">
                  {m.exercises.map((e) => {
                    const s = exerciseStatus(progress.records[e.id]);
                    return (
                      <span
                        key={e.id}
                        className={cn(
                          "h-2 flex-1 rounded-full border border-ink/40",
                          s === "solved" && "border-ink bg-success",
                          s === "review" && "border-ink bg-destructive",
                          s === "new" && "bg-paper",
                        )}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">
                    {st.solved}/{st.total} resueltos · {st.points} pts
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-primary group-hover:gap-2 transition-all">
                    {st.percent === 100 ? "Repasar" : st.attempted ? "Seguir" : "Empezar"} <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatTile({ icon, label, value, sub, tone }: { icon: React.ReactNode; label: string; value: string; sub: string; tone: string }) {
  return (
    <div className={cn("flex flex-col justify-between rounded-xl border-2 border-ink p-4 [&_svg]:size-5", tone)}>
      <div className="flex items-center gap-2 text-sm font-bold">
        {icon} {label}
      </div>
      <p className="mt-2 font-display text-3xl font-extrabold leading-none">{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

