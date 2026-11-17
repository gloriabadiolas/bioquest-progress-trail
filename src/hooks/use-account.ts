import { useSyncExternalStore } from "react";

import { accountStore } from "@/lib/account";

export function useAccount() {
  return useSyncExternalStore(accountStore.subscribe, accountStore.getSnapshot, accountStore.getServerSnapshot);
}
