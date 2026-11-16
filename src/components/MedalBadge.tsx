import { Award } from "lucide-react";
import type { Medal } from "@/lib/progress";
import { cn } from "@/lib/utils";

const STYLES: Record<Exclude<Medal, null>, string> = {
  oro: "bg-gold text-ink",
  plata: "bg-silver text-ink",
  bronce: "bg-bronze text-paper",
};

export function MedalBadge({ medal, className }: { medal: Medal; className?: string }) {
  if (!medal)
    return (
      <span className={cn("grid size-9 place-items-center rounded-full border-2 border-dashed border-border text-muted-foreground", className)} title="Sin medalla todavía">
        <Award className="size-4" />
      </span>
    );
  return (
    <span
      className={cn("grid size-9 place-items-center rounded-full border-2 border-ink shadow-press", STYLES[medal], className)}
      title={`Medalla de ${medal}`}
    >
      <Award className="size-5" strokeWidth={2.4} />
    </span>
  );
}
