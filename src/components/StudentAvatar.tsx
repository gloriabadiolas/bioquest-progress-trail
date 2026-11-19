import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2 } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/hooks/use-account";
import { supabase } from "@/integrations/supabase/client";
import { setStudentAvatar } from "@/lib/account";
import { AVATAR_BUCKET, avatarPath, prepareAvatar } from "@/lib/avatar";
import { cn } from "@/lib/utils";

export function StudentAvatar({ path, name, className }: { path: string | null; name: string; className?: string }) {
  const image = useQuery({
    queryKey: ["student-avatar", path],
    enabled: Boolean(path),
    staleTime: 45 * 60 * 1000,
    refetchInterval: 45 * 60 * 1000,
    retry: 1,
    queryFn: async () => {
      if (!path) return null;
      const { data, error } = await supabase.storage.from(AVATAR_BUCKET).createSignedUrl(path, 3600);
      if (error) throw error;
      return data.signedUrl;
    },
  });
  const initials = name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
  return <Avatar className={cn("size-12 border-2 border-border", className)}>
    <AvatarImage src={image.data ?? undefined} alt={`Avatar de ${name}`} className="object-cover" />
    <AvatarFallback className="font-bold text-primary">{initials || "?"}</AvatarFallback>
  </Avatar>;
}

export function StudentAvatarEditor() {
  const account = useAccount();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const qc = useQueryClient();
  if (account.status !== "student") return null;
  const student = account;

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setError(null);
    let uploadedPath: string | null = null;
    try {
      const blob = await prepareAvatar(file);
      const path = avatarPath(student.userId, crypto.randomUUID());
      const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(path, blob, { contentType: "image/jpeg" });
      if (uploadError) throw new Error("No se pudo subir la imagen. Inténtalo de nuevo.");
      uploadedPath = path;
      const { data, error: saveError } = await supabase.from("profiles").update({ avatar_path: path }).eq("id", student.userId).select("id").single();
      if (saveError || !data) throw new Error("No se pudo guardar tu avatar. Inténtalo de nuevo.");
      uploadedPath = null;
      setStudentAvatar(student.userId, path);
      void qc.invalidateQueries({ queryKey: ["students"] });
      if (student.avatarPath) await supabase.storage.from(AVATAR_BUCKET).remove([student.avatarPath]);
      toast.success("Tu avatar se ha guardado");
    } catch (e) {
      if (uploadedPath) await supabase.storage.from(AVATAR_BUCKET).remove([uploadedPath]);
      setError(e instanceof Error ? e.message : "No se pudo guardar la imagen.");
    } finally {
      setBusy(false);
    }
  };

  return <section aria-label="Tu avatar" className="flex flex-wrap items-center gap-4 border-b border-border pb-6">
    <StudentAvatar path={student.avatarPath} name={student.displayName} className="size-20" />
    <div className="min-w-0 flex-1 basis-48">
      <h2 className="break-words text-xl font-bold">{student.displayName}</h2>
      <p className="text-sm text-muted-foreground">{student.className}</p>
      {!student.avatarPath && <p className="mt-1 font-semibold">Sube tu avatar: una imagen de ti.</p>}
      <p className="mt-1 text-xs text-muted-foreground">Solo tú y la profesora de tu clase podéis ver esta imagen. JPG, PNG o WebP · máximo 5 MB.</p>
      {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
    <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Seleccionar avatar" className="hidden" onChange={(event) => { void upload(event); }} disabled={busy} />
    <Button className="w-full sm:w-auto" variant="outline" disabled={busy} onClick={() => input.current?.click()}>
      {busy ? <Loader2 className="animate-spin" /> : <Camera />} {busy ? "Guardando…" : student.avatarPath ? "Cambiar avatar" : "Subir avatar"}
    </Button>
  </section>;
}

export function StudentAvatarPrompt() {
  const account = useAccount();
  if (account.status !== "student" || account.avatarPath) return null;
  return <aside className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
    <p className="text-sm font-semibold">{account.displayName}, añade una imagen de ti junto a tu progreso.</p>
    <Button asChild variant="outline" size="sm"><Link to="/progreso"><Camera /> Añadir mi avatar</Link></Button>
  </aside>;
}