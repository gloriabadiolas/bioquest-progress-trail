import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import heroImg from "@/assets/mesa-mediterranea.jpg";
import { Button } from "@/components/ui/button";
import { Bar } from "@/components/ProgressRing";
import { useProgress } from "@/hooks/use-progress";
import { ALL_EXERCISES, MISSIONS } from "@/lib/content/missions";
import { statsFor } from "@/lib/progress";

export const Route = createFileRoute("/biologia/")({
  head: () => ({ meta: [
    { title: "Biología · Temas de repaso · 3.º ESO" },
    { name: "description", content: "Repasa Biología de 3.º ESO. Tema 2: Alimentación y nutrición, con ejercicios competenciales y seguimiento del progreso." },
    { property: "og:title", content: "Biología · Temas de repaso · 3.º ESO" },
    { property: "og:description", content: "Tema 2: Alimentación y nutrición. Ejercicios competenciales y tu avance." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Biology,
});

function Biology() {
  const progress = useProgress();
  const overall = statsFor(ALL_EXERCISES, progress);
  return (
    <div className="space-y-8">
      <Button asChild variant="ghost"><Link to="/"><ArrowLeft /> Asignaturas</Link></Button>
      <div className="border-b-2 border-ink pb-6">
        <p className="mb-2 text-sm font-bold text-muted-foreground">3.º ESO</p>
        <h1 className="text-4xl font-extrabold">Biología</h1>
      </div>
      <section aria-label="Temas de Biología" className="grid gap-5 sm:grid-cols-2">
        <article className="surface overflow-hidden">
          <img src={heroImg} alt="Mesa con alimentos de la dieta mediterránea" className="h-48 w-full border-b-2 border-ink object-cover" />
          <div className="space-y-4 p-5">
            <div>
              <p className="text-xs font-bold uppercase text-primary">Tema 2</p>
              <h2 className="mt-1 text-2xl font-extrabold">Alimentación y nutrición</h2>
              <p className="mt-2 text-sm text-muted-foreground">{MISSIONS.length} misiones · {ALL_EXERCISES.length} ejercicios</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold"><span>{overall.solved} de {overall.total} resueltos</span><span>{overall.percent}%</span></div>
              <Bar value={overall.percent} />
            </div>
            <Button asChild variant="pop"><Link to="/biologia/tema-2">{overall.attempted ? "Continuar tema" : "Empezar tema"} <ArrowRight /></Link></Button>
          </div>
        </article>
      </section>
    </div>
  );
}