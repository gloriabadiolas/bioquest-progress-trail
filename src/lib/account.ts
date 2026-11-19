import type { User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { asProgressState, progressStore, type ProgressState } from "@/lib/progress";

export type Account =
  | { status: "loading" }
  | { status: "signed_out" }
  | { status: "student"; userId: string; displayName: string; username: string; className: string; avatarPath: string | null }
  | { status: "teacher"; userId: string; displayName: string; email: string }
  | { status: "user"; userId: string; email: string };

const LOADING: Account = { status: "loading" };
const SIGNED_OUT: Account = { status: "signed_out" };
/** Set right before a student joins a class so the practice done on this device moves into the new account. */
export const IMPORT_FLAG = "repaso-bio:import-anon";

let account: Account = LOADING;
const listeners = new Set<() => void>();

function set(next: Account) {
  account = next;
  listeners.forEach((l) => l());
}

export const accountStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getSnapshot: () => account,
  getServerSnapshot: () => LOADING,
};

export function setStudentAvatar(userId: string, avatarPath: string) {
  if (account.status === "student" && account.userId === userId) set({ ...account, avatarPath });
}

/* ---- progress mirroring for students ---- */

let pending: { userId: string; state: ProgressState } | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;

async function flush() {
  if (timer) clearTimeout(timer);
  timer = null;
  const job = pending;
  pending = null;
  if (!job) return;
  const { error } = await supabase
    .from("student_progress")
    .upsert({ user_id: job.userId, state: job.state as never, updated_at: new Date().toISOString() });
  if (error) console.warn("No se pudo guardar el progreso en la cuenta", error.message);
}

function schedulePush(userId: string, state: ProgressState) {
  pending = { userId, state };
  if (timer) clearTimeout(timer);
  timer = setTimeout(flush, 600);
}

/* ---- loading the signed-in account ---- */

let loadedFor: string | null = null;

async function load(user: User) {
  if (loadedFor === user.id && account.status !== "loading") return;
  loadedFor = user.id;
  const [roles, membership, profile] = await Promise.all([
    supabase.from("user_roles").select("role").eq("user_id", user.id),
    supabase.from("class_members").select("class_id, classes(name)").eq("user_id", user.id).maybeSingle(),
    supabase.from("profiles").select("display_name, username, avatar_path").eq("id", user.id).maybeSingle(),
  ]);
  if (loadedFor !== user.id) return;
  const displayName = profile.data?.display_name || user.email || "";

  if (roles.data?.some((r) => r.role === "teacher")) {
    progressStore.disconnectAccount();
    set({ status: "teacher", userId: user.id, displayName, email: user.email ?? "" });
    return;
  }

  if (membership.data) {
    const { data: row } = await supabase.from("student_progress").select("state").eq("user_id", user.id).maybeSingle();
    const importAnonymous = window.sessionStorage.getItem(IMPORT_FLAG) === "1";
    window.sessionStorage.removeItem(IMPORT_FLAG);
    const remote = asProgressState(row?.state);
    const merged = progressStore.connectAccount(user.id, remote, (s) => schedulePush(user.id, s), { importAnonymous });
    if (JSON.stringify(merged) !== JSON.stringify(remote)) schedulePush(user.id, merged);
    const cls = membership.data.classes as { name: string } | { name: string }[] | null;
    set({
      status: "student",
      userId: user.id,
      displayName,
      username: profile.data?.username ?? "",
      avatarPath: profile.data?.avatar_path ?? null,
      className: (Array.isArray(cls) ? cls[0]?.name : cls?.name) ?? "",
    });
    return;
  }

  progressStore.disconnectAccount();
  set({ status: "user", userId: user.id, email: user.email ?? "" });
}

function signedOut() {
  loadedFor = null;
  pending = null;
  progressStore.disconnectAccount();
  set(SIGNED_OUT);
}

/** Re-read roles/class after something changed them (e.g. activating the teacher panel). */
export async function refreshAccount() {
  const { data } = await supabase.auth.getUser();
  loadedFor = null;
  if (data.user) await load(data.user);
  else signedOut();
}

export async function signOut() {
  await flush();
  await supabase.auth.signOut();
}

let started = false;

/** Call once from the root layout. `onIdentityChange` runs when a different person signs in or out. */
export function startAccountSync(onIdentityChange: (event: "SIGNED_IN" | "SIGNED_OUT" | "USER_UPDATED") => void) {
  if (started) return () => {};
  started = true;
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    // Defer: querying inside this callback can deadlock the auth client.
    setTimeout(() => {
      if (event === "SIGNED_OUT" || !session?.user) {
        if (event === "SIGNED_OUT" || event === "INITIAL_SESSION") signedOut();
      } else if (event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "USER_UPDATED") {
        void load(session.user);
      }
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") onIdentityChange(event);
    }, 0);
  });
  const onHide = () => {
    if (document.visibilityState === "hidden") void flush();
  };
  document.addEventListener("visibilitychange", onHide);
  return () => {
    started = false;
    data.subscription.unsubscribe();
    document.removeEventListener("visibilitychange", onHide);
  };
}
