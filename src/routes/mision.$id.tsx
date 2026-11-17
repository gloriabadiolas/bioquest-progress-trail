import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { Player } from "@/components/exercise/Player";
import { MissionIcon, MISSION_BG } from "@/components/MissionIcon";
import { getMission } from "@/lib/content/missions";

export const Route = createFileRoute("/mision/$id")({
  loader: ({ params }) => {
    const mission = getMission(params.id);
    if (!mission) throw notFound();
    return { missionId: mission.id, title: mission.title, subtitle: mission.subtitle };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `Misión: ${loaderData.title} · Repaso Tema 2` },
          { name: "description", content: `Ejercicios competenciales de ${loaderData.subtitle.toLowerCase()} (Biología 3.º ESO).` },
          { property: "og:title", content: `Misión: ${loaderData.title} · Repaso Tema 2` },
          { property: "og:description", content: `Ejercicios competenciales de ${loaderData.subtitle.toLowerCase()}.` },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary" },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="surface mx-auto max-w-md p-8 text-center">
      <h1 className="text-2xl font-extrabold">Esta misión no existe</h1>
      <Link to="/" className="mt-4 inline-block font-bold text-primary underline">
        Volver al mapa
      </Link>
    </div>
  ),
  component: MissionPage,
});

function MissionPage() {
  const { missionId } = Route.useLoaderData();
  const mission = getMission(missionId)!;
  const [round, setRound] = useState(0);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-ink">
        <ArrowLeft className="size-4" /> Mapa de misiones
      </Link>
      <div className="flex items-center gap-4">
        <MissionIcon mission={mission} className="size-14" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Misión {mission.number}</p>
          <h1 className="text-3xl font-extrabold leading-tight">{mission.title}</h1>
        </div>
      </div>
      <Player
        key={`${mission.id}-${round}`}
        exercises={mission.exercises}
        title={mission.title}
        accentClass={MISSION_BG[mission.number]}
        onRestart={() => setRound((r) => r + 1)}
      />
    </div>
  );
}
