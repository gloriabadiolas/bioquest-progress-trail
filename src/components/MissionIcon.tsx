import { Apple, FlaskConical, Flame, HeartPulse, Salad, ScanLine } from "lucide-react";
import type { Mission } from "@/lib/content/types";
import { cn } from "@/lib/utils";

const ICONS = { apple: Apple, flame: Flame, salad: Salad, scan: ScanLine, heart: HeartPulse, flask: FlaskConical };

export const MISSION_BG: Record<number, string> = {
  1: "bg-mission-1",
  2: "bg-mission-2",
  3: "bg-mission-3",
  4: "bg-mission-4",
  5: "bg-mission-5",
  6: "bg-mission-6",
};

export const MISSION_TEXT: Record<number, string> = {
  1: "text-mission-1",
  2: "text-mission-2",
  3: "text-mission-3",
  4: "text-mission-4",
  5: "text-mission-5",
  6: "text-mission-6",
};

export function MissionIcon({ mission, className }: { mission: Mission; className?: string }) {
  const Icon = ICONS[mission.icon];
  return (
    <span
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-xl border-2 border-ink text-paper shadow-press",
        MISSION_BG[mission.number],
        className,
      )}
    >
      <Icon className="size-6" strokeWidth={2.4} />
    </span>
  );
}
