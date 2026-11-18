import { createFileRoute, Link, useHydrated } from "@tanstack/react-router";
import { ArrowLeft, PartyPopper, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { Player } from "@/components/exercise/Player";
import { Button } from "@/components/ui/button";
import type { Exercise } from "@/lib/content/types";
import { MISSIONS } from "@/lib/content/missions";
import { progressStore, reviewList } from "@/lib/progress";

export const Route = createFileRoute("/repaso")({
  head: () => ({
    meta: [
      { title: "Repaso de fallos · Tema 2 Alimentación y nutrición" },
      { name: "description", content: "Vuelve a intentar los ejercicios que fallaste hasta dominarlos." },
      { property: "og:title", content: "Repaso de fallos · Tema 2" },
      { property: "og:description", content: "Vuelve a intentar los ejercicios que fallaste hasta dominarlos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReviewPage,
});

function ReviewPage() {
  const hydrated = useHydrated();
  const [round, setRound] = useState(0);
  // Freeze the list at the start of a round so exercises don't vanish while you fix them.
  const [list, setList] = useState<Exercise[] | null>(null);

  useEffect(() => {
    if (hydrated) setList(reviewList(MISSIONS, progressStore.getSnapshot()));
  }, [hydrated, round]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/biologia/tema-2" className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-ink">
        <ArrowLeft className="size-4" /> Mapa de misiones
      </Link>
      <div className="flex items-center gap-4">
        <span className="grid size-14 place-items-center rounded-xl border-2 border-ink bg-accent text-accent-foreground shadow-press">
          <RotateCcw className="size-7" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Modo repaso</p>
          <h1 className="text-3xl font-extrabold leading-tight">Tus fallos</h1>
        </div>
      </div>

      {list === null ? (
        <div className="surface-soft h-64 animate-pulse" />
      ) : list.length === 0 ? (
        <div className="surface mx-auto max-w-xl p-8 text-center animate-pop-in">
          <PartyPopper className="mx-auto size-12 text-accent" />
          <h2 className="mt-3 text-2xl font-extrabold">¡No tienes fallos pendientes!</h2>
          <p className="mt-2 text-muted-foreground">
            Aquí aparecerán los ejercicios que falles a la primera, para que los repitas hasta dominarlos.
          </p>
          <Button asChild variant="pop" size="xl" className="mt-6">
            <Link to="/biologia/tema-2">Ir a las misiones</Link>
          </Button>
        </div>
      ) : (
        <>
          <p className="text-muted-foreground">
            {list.length} ejercicio{list.length === 1 ? "" : "s"} para repasar. Si lo aciertas a la primera, sale de esta lista.
          </p>
          <Player
            key={round}
            exercises={list}
            title="Repaso de fallos"
            accentClass="bg-accent-soft"
            onRestart={() => setRound((r) => r + 1)}
            restartLabel="Nueva ronda de fallos"
            showReviewLink={false}
          />
        </>
      )}
    </div>
  );
}
