import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Copy, KeyRound, Loader2, Plus, Trash2, Users } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccount } from "@/hooks/use-account";
import { supabase } from "@/integrations/supabase/client";
import { refreshAccount } from "@/lib/account";
import { asProgressState, statsFor, type ProgressState } from "@/lib/progress";
import { ALL_SUBJECT_EXERCISES, SUBJECTS } from "@/lib/subject-progress";
import { SubjectProgress } from "@/components/SubjectProgress";
import { generateClassCode, MIN_PASSWORD } from "@/lib/student-auth";
import { deleteStudent, setStudentPassword } from "@/lib/teacher.functions";
import { StudentAvatar } from "@/components/StudentAvatar";

export const Route = createFileRoute("/aula")({
  head: () => ({
    meta: [
      { title: "Mi aula · Seguimiento por asignatura · Repaso ESO" },
      { name: "description", content: "Panel de la profesora: crea clases, comparte el código y sigue el progreso de cada alumno." },
      { property: "og:title", content: "Mi aula · Seguimiento por asignatura · Repaso ESO" },
      { property: "og:description", content: "Ejercicios realizados y evolución de cada alumno en Matemáticas, Física y Química y Biología." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AulaPage,
});

function AulaPage() {
  const account = useAccount();
  const [busy, setBusy] = useState(false);
  if (account.status === "loading") return <Loader2 className="mx-auto mt-20 size-8 animate-spin" />;
  if (account.status === "signed_out" || account.status === "student")
    return (
      <div className="surface mx-auto max-w-md space-y-4 p-6 text-center">
        <h1 className="text-3xl font-extrabold">Mi aula</h1>
        <p className="text-muted-foreground">Esta zona es para la profesora. Entra con tu cuenta de profesora.</p>
        <Button asChild variant="pop" size="xl"><Link to="/auth">Entrar como profesora</Link></Button>
      </div>
    );
  if (account.status === "user")
    return (
      <div className="surface mx-auto max-w-md space-y-4 p-6 text-center">
        <h1 className="text-3xl font-extrabold">Activa tu panel</h1>
        <p className="text-muted-foreground">Activa el panel de profesora para crear clases y ver el progreso del alumnado.</p>
        <Button
          variant="pop" size="xl" disabled={busy}
          onClick={async () => {
            setBusy(true);
            const { data } = await supabase.rpc("claim_teacher");
            await refreshAccount();
            setBusy(false);
            if (!data) toast.error("Ya hay otra profesora registrada en esta app.");
          }}
        >
          {busy && <Loader2 className="animate-spin" />} Activar panel de profesora
        </Button>
      </div>
    );
  return <TeacherPanel teacherId={account.userId} name={account.displayName} />;
}

type ClassRow = { id: string; name: string; code: string };

function TeacherPanel({ teacherId, name }: { teacherId: string; name: string }) {
  const qc = useQueryClient();
  const classes = useQuery({
    queryKey: ["classes", teacherId],
    queryFn: async () => {
      const { data, error } = await supabase.from("classes").select("id, name, code").eq("teacher_id", teacherId).order("created_at");
      if (error) throw error;
      return data as ClassRow[];
    },
  });
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    if (newName.trim().length < 2) return undefined;
    setCreating(true);
    let error = null;
    for (let i = 0; i < 4; i++) {
      ({ error } = await supabase.from("classes").insert({ name: newName.trim(), code: generateClassCode(), teacher_id: teacherId }));
      if (!error || !error.message.includes("duplicate")) break;
    }
    setCreating(false);
    if (error) { toast.error("No se pudo crear la clase."); return; }
    setNewName("");
    toast.success("Clase creada");
    void qc.invalidateQueries({ queryKey: ["classes", teacherId] });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold">Mi aula</h1>
        <p className="text-muted-foreground">Hola, {name}. Crea una clase y comparte su código con tu alumnado.</p>
      </div>
      <form onSubmit={create} className="surface flex flex-col gap-3 p-5 sm:flex-row">
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nombre de la clase, ej.: 3.º ESO A" maxLength={40} />
        <Button type="submit" variant="pop" disabled={creating}>
          {creating ? <Loader2 className="animate-spin" /> : <Plus />} Crear clase
        </Button>
      </form>
      {classes.isLoading && <Loader2 className="mx-auto size-6 animate-spin" />}
      {classes.isError && <p role="alert" className="text-destructive">No se pudieron cargar tus clases. Vuelve a intentarlo.</p>}
      {classes.data?.length === 0 && <p className="text-center text-muted-foreground">Aún no tienes clases. Crea la primera arriba.</p>}
      {classes.data?.map((c) => <ClassCard key={c.id} cls={c} />)}
    </div>
  );
}

type Student = { id: string; name: string; username: string; avatarPath: string | null; state: ProgressState; updatedAt: string | null };

function ClassCard({ cls }: { cls: ClassRow }) {
  const students = useQuery({
    queryKey: ["students", cls.id],
    refetchInterval: 15000,
    queryFn: async (): Promise<Student[]> => {
      const { data: members, error } = await supabase.from("class_members").select("user_id").eq("class_id", cls.id);
      if (error) throw error;
      const ids = members.map((m) => m.user_id);
      if (!ids.length) return [];
      const [profiles, progress] = await Promise.all([
        supabase.from("profiles").select("id, display_name, username, avatar_path").in("id", ids),
        supabase.from("student_progress").select("user_id, state, updated_at").in("user_id", ids),
      ]);
      if (profiles.error) throw profiles.error;
      if (progress.error) throw progress.error;
      return ids
        .map((id) => {
          const p = profiles.data?.find((x) => x.id === id);
          const g = progress.data?.find((x) => x.user_id === id);
          return { id, name: p?.display_name || "Sin nombre", username: p?.username ?? "", avatarPath: p?.avatar_path ?? null, state: asProgressState(g?.state), updatedAt: g?.updated_at ?? null };
        })
        .sort((a, b) => a.name.localeCompare(b.name, "es"));
    },
  });
  const list = students.data ?? [];
  const [subjectId, setSubjectId] = useState("all");
  const subject = SUBJECTS.find((x) => x.id === subjectId);
  const exs = subject ? subject.exercises : ALL_SUBJECT_EXERCISES;
  const avg = list.length ? Math.round(list.reduce((s, st) => s + statsFor(exs, st.state).percent, 0) / list.length) : 0;

  return (
    <section className="space-y-4 border-t-2 border-ink py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold">{cls.name}</h2>
          <p className="flex items-center gap-1 text-sm text-muted-foreground"><Users className="size-4" /> {list.length} alumnos · media {avg}% completado</p>
        </div>
        <Button
          type="button"
          onClick={() => { void navigator.clipboard.writeText(cls.code); toast.success("Código copiado"); }}
          variant="popAccent"
          className="font-mono text-xl font-extrabold"
          title="Copiar código"
        >
          {cls.code} <Copy className="size-4" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Tu alumnado entra en la app → <b>Entrar</b> → <b>Unirme a una clase</b> y escribe este código.
      </p>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Ver progreso por asignatura">
        {[{ id: "all", name: "Todas" }, ...SUBJECTS].map((x) => (
          <Button key={x.id} type="button" role="tab" aria-selected={subjectId === x.id} size="sm" variant={subjectId === x.id ? "default" : "outline"} onClick={() => setSubjectId(x.id)}>{x.name}</Button>
        ))}
      </div>
      {subject && <p className="text-sm font-bold">{subject.name}: media de la clase {avg}% · {list.reduce((n, st) => n + statsFor(exs, st.state).attempted, 0)} ejercicios realizados en total{subject.exercises.length ? "" : " (sin temas todavía)"}</p>}
      {students.isLoading && <Loader2 className="size-5 animate-spin" />}
      {students.isError && <p role="alert" className="text-destructive">No se pudo cargar el progreso del alumnado.</p>}
      {list.length > 0 && (
        <div className="divide-y-2 divide-border rounded-xl border-2 border-ink">
          {list.map((s) => <StudentRow key={s.id} s={s} classId={cls.id} subjectId={subjectId} />)}
        </div>
      )}
    </section>
  );
}

function StudentRow({ s, classId, subjectId }: { s: Student; classId: string; subjectId: string }) {
  const shown = SUBJECTS.filter((x) => subjectId === "all" || x.id === subjectId);
  const exs = subjectId === "all" ? ALL_SUBJECT_EXERCISES : shown.flatMap((x) => x.exercises);
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();
  const setPwd = useServerFn(setStudentPassword);
  const del = useServerFn(deleteStudent);
  const st = statsFor(exs, s.state);
  const pending = exs.filter((ex) => s.state.records[ex.id] && !s.state.records[ex.id]?.lastFirstCheckCorrect).length;

  const resetPassword = async () => {
    const pwd = window.prompt(`Nueva contraseña para ${s.name} (mínimo ${MIN_PASSWORD} caracteres):`);
    if (!pwd) return undefined;
    if (pwd.length < MIN_PASSWORD) { toast.error("Contraseña demasiado corta."); return; }
    try { await setPwd({ data: { studentId: s.id, password: pwd } }); toast.success("Contraseña cambiada"); }
    catch (e) { toast.error((e as Error).message); }
  };
  const remove = async () => {
    if (!window.confirm(`¿Eliminar a ${s.name} y todo su progreso?`)) return;
    try { await del({ data: { studentId: s.id } }); toast.success("Alumno eliminado"); void qc.invalidateQueries({ queryKey: ["students", classId] }); }
    catch (e) { toast.error((e as Error).message); }
  };

  return (
    <div>
      <Button type="button" variant="ghost" aria-expanded={open} onClick={() => setOpen(!open)} className="grid h-auto w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 whitespace-normal p-3 text-left">
        <span className="flex min-w-0 items-center gap-3">
          <StudentAvatar path={s.avatarPath} name={s.name} className="size-10 sm:size-12" />
          <span className="min-w-0 break-words">
          <span className="block font-bold">{s.name}</span>
          <span className="text-xs text-muted-foreground">@{s.username} · {s.state.studyDays.length} días de estudio{pending ? ` · ${pending} por repasar` : ""}</span>
          </span>
        </span>
        <span className="w-28">
          <span className="block text-right text-sm font-bold">{st.attempted} realizados</span>
          <span className="block text-right text-xs">{st.percent}% · {st.points} pts</span>
          <span className="mt-1 block h-2 overflow-hidden rounded-full bg-muted"><span className="block h-full bg-primary" style={{ width: `${st.percent}%` }} /></span>
        </span>
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </Button>
      {open && (
        <div className="space-y-3 bg-muted/40 p-3">
          <div className="grid gap-6 lg:grid-cols-3">
            {shown.map((subject) => <SubjectProgress key={subject.id} subject={subject} state={s.state} />)}
          </div>
          <p className="text-xs text-muted-foreground">
            Acierto a la primera: {st.accuracy}% · Última actividad: {s.updatedAt && st.attempted ? new Date(s.updatedAt).toLocaleString("es-ES") : "todavía no ha practicado"}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={resetPassword}><KeyRound /> Cambiar contraseña</Button>
            <Button size="sm" variant="outline" onClick={remove}><Trash2 /> Eliminar</Button>
          </div>
        </div>
      )}
    </div>
  );
}
