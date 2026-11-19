import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bar } from "@/components/ProgressRing";
import { MedalBadge } from "@/components/MedalBadge";
import { useProgress } from "@/hooks/use-progress";
import { RADICAL_EXERCISES, RADICAL_SECTIONS } from "@/lib/content/radicals";
import { medalFor, statsFor } from "@/lib/progress";

export const Route = createFileRoute("/matematicas/radicales/")({
  head: () => ({ meta: [
    { title: "Radicales · Apartados y progreso · Matemáticas 3.º ESO" },
    { name: "description", content: "Cuadrados perfectos, raíces a potencias, multiplicación y división de raíces del mismo índice, sin mcm." },
    { property: "og:title", content: "Radicales · Matemáticas 3.º ESO" },
    { property: "og:description", content: "Cuatro apartados de radicales con ejercicios, teoría y progreso." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Radicals,
});

function Radicals() {
  const progress = useProgress();
  const overall = statsFor(RADICAL_EXERCISES, progress);
  return (
    <div className="space-y-8">
      <Button asChild variant="ghost"><Link to="/matematicas"><ArrowLeft /> Matemáticas</Link></Button>
      <div className="space-y-4 border-b-2 border-ink pb-6">
        <p className="text-sm font-bold text-muted-foreground">Matemáticas · 3.º ESO</p>
        <h1 className="text-4xl font-extrabold">Radicales</h1>
        <div className="max-w-xl space-y-2">
          <p className="flex justify-between text-sm font-semibold"><span>{overall.solved} de {overall.total} ejercicios resueltos</span><span>{overall.percent}%</span></p>
          <Bar value={overall.percent} />
        </div>
      </div>
      <section aria-label="Apartados de Radicales" className="grid gap-5 sm:grid-cols-2">
        {RADICAL_SECTIONS.map((section, i) => {
          const stats = statsFor(section.exercises, progress);
          return (
            <article key={section.id} className="surface flex flex-col gap-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div><p className="text-xs font-bold text-muted-foreground">APARTADO {i + 1}</p><h2 className="mt-1 text-2xl font-extrabold">{section.title}</h2></div>
                <MedalBadge medal={medalFor(stats.percent)} />
              </div>
              <p className="rounded-lg bg-secondary p-4 font-display text-xl font-bold">{section.example}</p>
              {(i === 2 || i === 3) && <p className="text-sm text-muted-foreground">Raíces del mismo índice</p>}
              <div className="mt-auto space-y-2">
                <p className="flex justify-between text-sm font-semibold"><span>{stats.solved}/{stats.total} resueltos</span><span>{stats.percent}%</span></p>
                <Bar value={stats.percent} />
              </div>
              <Button asChild variant="popPaper" className="self-start"><Link to="/matematicas/radicales/$apartado" params={{ apartado: section.id }}>{stats.attempted ? "Repasar" : "Empezar"} <ArrowRight /></Link></Button>
            </article>
          );
        })}
      </section>
    </div>
  );
}