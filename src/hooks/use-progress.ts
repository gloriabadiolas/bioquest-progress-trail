import { useSyncExternalStore } from "react";
import { progressStore } from "@/lib/progress";

export function useProgress() {
  return useSyncExternalStore(
    progressStore.subscribe,
    progressStore.getSnapshot,
    progressStore.getServerSnapshot,
  );
}
