import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Atom, BookOpen, Calculator, Leaf } from "lucide-react";
import heroImg from "@/assets/mesa-mediterranea.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Mis asignaturas · Repaso 3.º ESO" },
    { name: "description", content: "Matemáticas, Física y Química y Biología de 3.º ESO. Repasa el tema 2 de alimentación y nutrición en Biología." },
    { property: "og:title", content: "Mis asignaturas · Repaso 3.º ESO" },
    { property: "og:description", content: "Tus asignaturas de 3.º ESO: Matemáticas, Física y Química y Biología." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Home,
});

function Home() {
  return (
    <div className="space-y-8">
      <div className="border-b-2 border-ink pb-6">
        <p className="mb-2 text-sm font-bold text-muted-foreground">3.º ESO</p>
        <h1 className="text-4xl font-extrabold sm:text-5xl">Mis asignaturas</h1>
      </div>
      <section aria-label="Asignaturas" className="grid gap-5 md:grid-cols-3">
        <article className="surface flex flex-col overflow-hidden">
          <div className="flex h-40 items-center justify-center border-b-2 border-ink bg-secondary"><Calculator className="size-20" strokeWidth={1.5} /></div>
          <div className="flex flex-1 flex-col items-start gap-4 p-5">
            <h2 className="text-2xl font-extrabold">Matemáticas</h2>
            <p className="text-sm text-muted-foreground">Sin temas todavía</p>
            <Button asChild variant="popPaper" className="mt-auto"><Link to="/matematicas">Ver temas <ArrowRight /></Link></Button>
          </div>
        </article>
        <article className="surface flex flex-col overflow-hidden">
          <div className="flex h-40 items-center justify-center border-b-2 border-ink bg-accent-soft"><Atom className="size-20" strokeWidth={1.5} /></div>
          <div className="flex flex-1 flex-col items-start gap-4 p-5">
            <h2 className="text-2xl font-extrabold">Física y Química</h2>
            <p className="text-sm text-muted-foreground">Sin temas todavía</p>
            <Button asChild variant="popPaper" className="mt-auto"><Link to="/fisica-quimica">Ver temas <ArrowRight /></Link></Button>
          </div>
        </article>
        <article className="surface flex flex-col overflow-hidden">
          <img src={heroImg} alt="Alimentos de la dieta mediterránea" className="h-40 w-full border-b-2 border-ink object-cover" />
          <div className="flex flex-1 flex-col items-start gap-4 p-5">
            <h2 className="flex items-center gap-2 text-2xl font-extrabold"><Leaf className="size-6 text-primary" /> Biología</h2>
            <p className="text-sm text-muted-foreground">1 tema · Alimentación y nutrición</p>
            <Button asChild variant="pop" className="mt-auto"><Link to="/biologia">Ver temas <ArrowRight /></Link></Button>
          </div>
        </article>
      </section>
      <div className="flex items-center gap-3 border-t border-border pt-5 text-sm text-muted-foreground"><BookOpen className="size-5" /> Biología · Tema 2: Alimentación y nutrición</div>
    </div>
  );
}
