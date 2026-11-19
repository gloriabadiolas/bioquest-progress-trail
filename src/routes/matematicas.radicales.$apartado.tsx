import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Player } from "@/components/exercise/Player";
import { RADICAL_SECTIONS } from "@/lib/content/radicals";

export const Route = createFileRoute("/matematicas/radicales/$apartado")({
  loader: ({ params }) => {
    const section = RADICAL_SECTIONS.find((item) => item.id === params.apartado);
    if (!section) throw notFound();
    return { id: section.id, title: section.title };
  },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.title ?? "Apartado no disponible"} · Radicales · Matemáticas 3.º ESO` },
    { name: "description", content: `Ejercicios de ${loaderData?.title.toLowerCase() ?? "radicales"} con teoría y progreso.` },
    { property: "og:title", content: `${loaderData?.title ?? "Apartado no disponible"} · Radicales` },
    { property: "og:description", content: `Practica ${loaderData?.title.toLowerCase() ?? "radicales"} en Matemáticas de 3.º ESO.` },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: RadicalPractice,
});

function RadicalPractice() {
  const { id } = Route.useLoaderData();
  const section = RADICAL_SECTIONS.find((item) => item.id === id);
  const [round, setRound] = useState(0);
  if (!section) return null;
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button asChild variant="ghost"><Link to="/matematicas/radicales"><ArrowLeft /> Apartados de Radicales</Link></Button>
      <div><p className="text-sm font-bold text-muted-foreground">Matemáticas · Radicales</p><h1 className="mt-1 text-3xl font-extrabold">{section.title}</h1></div>
      <Player key={`${id}-${round}`} exercises={section.exercises} title={section.title} theory={section.theory} returnTo="/matematicas/radicales" accentClass="bg-secondary" showReviewLink={false} onRestart={() => setRound((value) => value + 1)} restartLabel="Repetir apartado" />
    </div>
  );
}