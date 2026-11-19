import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bar } from "@/components/ProgressRing";
import { useProgress } from "@/hooks/use-progress";
import { RADICAL_EXERCISES, RADICAL_SECTIONS } from "@/lib/content/radicals";
import { statsFor } from "@/lib/progress";

export const Route = createFileRoute("/matematicas/")({
  head: () => ({ meta: [
    { title: "Matemáticas · Radicales · Repaso 3.º ESO" },
    { name: "description", content: "Repasa radicales: cuadrados perfectos, raíces a potencias, multiplicación y división." },
    { property: "og:title", content: "Matemáticas · Radicales · Repaso 3.º ESO" },
    { property: "og:description", content: "Ejercicios de radicales con pistas y seguimiento de tu avance." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Mathematics,
});

function Mathematics() {
  const progress = useProgress();
  const stats = statsFor(RADICAL_EXERCISES, progress);
  return (
    <div className="space-y-8">
      <Button asChild variant="ghost"><Link to="/"><ArrowLeft /> Asignaturas</Link></Button>
      <div className="border-b-2 border-ink pb-6">
        <p className="mb-2 text-sm font-bold text-muted-foreground">3.º ESO</p>
        <h1 className="text-4xl font-extrabold">Matemáticas</h1>
      </div>
      <section aria-label="Temas de Matemáticas" className="grid gap-5 sm:grid-cols-2">
        <article className="surface overflow-hidden">
          <div className="flex h-36 items-center justify-center gap-5 border-b-2 border-ink bg-secondary">
            <Calculator className="size-12" /><span className="font-display text-5xl font-bold" aria-hidden="true">√a</span>
          </div>
          <div className="space-y-4 p-5">
            <h2 className="text-2xl font-extrabold">Radicales</h2>
            <p className="text-sm text-muted-foreground">{RADICAL_SECTIONS.length} apartados · {RADICAL_EXERCISES.length} ejercicios</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold"><span>{stats.solved} de {stats.total} resueltos</span><span>{stats.percent}%</span></div>
              <Bar value={stats.percent} />
            </div>
            <Button asChild variant="pop"><Link to="/matematicas/radicales">Ver apartados <ArrowRight /></Link></Button>
          </div>
        </article>
      </section>
    </div>
  );
}