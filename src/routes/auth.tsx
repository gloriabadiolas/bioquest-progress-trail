import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, GraduationCap, Loader2, School } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccount } from "@/hooks/use-account";
import { supabase } from "@/integrations/supabase/client";
import { IMPORT_FLAG } from "@/lib/account";
import {
  authErrorMessage,
  isValidUsername,
  MIN_PASSWORD,
  normalizeClassCode,
  normalizeUsername,
  studentEmail,
} from "@/lib/student-auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar · Repaso Bio Tema 2" },
      { name: "description", content: "Entra con el código de tu clase para guardar tu progreso en tu cuenta, o accede al panel de la profesora." },
      { property: "og:title", content: "Entrar · Repaso Bio Tema 2" },
      { property: "og:description", content: "Entra con el código de tu clase y guarda tu progreso en cualquier dispositivo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const account = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (account.status === "student") void navigate({ to: "/", replace: true });
    if (account.status === "teacher" || account.status === "user") void navigate({ to: "/profe", replace: true });
  }, [account.status, navigate]);

  return (
    <div className="mx-auto max-w-md space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-ink">
        <ArrowLeft className="size-4" /> Volver sin entrar
      </Link>
      <div>
        <h1 className="text-4xl font-extrabold">Entrar</h1>
        <p className="text-muted-foreground">Con tu cuenta, tu progreso se guarda y lo ves en cualquier móvil u ordenador.</p>
      </div>
      <Tabs defaultValue="alumno" className="surface p-5">
        <TabsList className="mb-5 grid w-full grid-cols-2">
          <TabsTrigger value="alumno">
            <GraduationCap className="mr-1.5 size-4" /> Alumnado
          </TabsTrigger>
          <TabsTrigger value="profe">
            <School className="mr-1.5 size-4" /> Profesora
          </TabsTrigger>
        </TabsList>
        <TabsContent value="alumno">
          <StudentForms />
        </TabsContent>
        <TabsContent value="profe">
          <TeacherForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StudentForms() {
  const [mode, setMode] = useState<"login" | "join">("login");
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 rounded-xl border-2 border-ink p-1">
        {(
          [
            ["login", "Ya tengo cuenta"],
            ["join", "Unirme a una clase"],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-bold transition-colors",
              mode === m ? "bg-ink text-paper" : "text-muted-foreground hover:bg-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {mode === "login" ? <StudentLogin /> : <StudentJoin />}
    </div>
  );
}

function Field({ id, label, hint, children }: { id: string; label: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="font-bold">
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ErrorText({ children }: { children: ReactNode }) {
  return <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">{children}</p>;
}

function StudentLogin() {
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: studentEmail(code, username), password });
    setBusy(false);
    if (error) setError(authErrorMessage(error.message));
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field id="l-code" label="Código de clase">
        <Input id="l-code" value={code} onChange={(e) => setCode(normalizeClassCode(e.target.value))} placeholder="Ej.: K7M2QP" maxLength={8} required className="font-mono uppercase tracking-widest" />
      </Field>
      <Field id="l-user" label="Usuario">
        <Input id="l-user" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoCapitalize="none" required />
      </Field>
      <Field id="l-pass" label="Contraseña">
        <Input id="l-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
      </Field>
      {error && <ErrorText>{error}</ErrorText>}
      <Button type="submit" variant="pop" size="xl" className="w-full" disabled={busy}>
        {busy && <Loader2 className="animate-spin" />} Entrar
      </Button>
    </form>
  );
}

function StudentJoin() {
  const [code, setCode] = useState("");
  const [className, setClassName] = useState<string | null | undefined>(undefined);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setClassName(undefined);
    if (code.length < 6) return;
    let cancelled = false;
    void supabase.rpc("class_name_for_code", { _code: code }).then(({ data }) => {
      if (!cancelled) setClassName(data ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [code]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!className) return setError("Escribe un código de clase válido. Te lo da tu profesora.");
    if (name.trim().length < 2) return setError("Escribe tu nombre y apellido.");
    if (!isValidUsername(username)) return setError("El usuario debe tener entre 3 y 20 letras o números, sin espacios.");
    if (password.length < MIN_PASSWORD) return setError(`La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`);
    setBusy(true);
    window.sessionStorage.setItem(IMPORT_FLAG, "1");
    const { data, error } = await supabase.auth.signUp({
      email: studentEmail(code, username),
      password,
      options: { data: { display_name: name.trim(), username: normalizeUsername(username), class_code: code } },
    });
    setBusy(false);
    if (error || !data.session) {
      window.sessionStorage.removeItem(IMPORT_FLAG);
      setError(authErrorMessage(error?.message ?? "already registered"));
    }
  };

  const cleanUser = normalizeUsername(username);

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field
        id="j-code"
        label="Código de clase"
        hint={
          className ? (
            <span className="font-bold text-success">Clase: {className}</span>
          ) : className === null ? (
            <span className="font-bold text-destructive">No existe ninguna clase con ese código.</span>
          ) : (
            "Te lo da tu profesora."
          )
        }
      >
        <Input id="j-code" value={code} onChange={(e) => setCode(normalizeClassCode(e.target.value))} placeholder="Ej.: K7M2QP" maxLength={8} required className="font-mono uppercase tracking-widest" />
      </Field>
      <Field id="j-name" label="Nombre y apellido" hint="Así te verá tu profesora.">
        <Input id="j-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} required />
      </Field>
      <Field
        id="j-user"
        label="Elige un usuario"
        hint={cleanUser && cleanUser !== username ? <>Se guardará como <b>{cleanUser}</b></> : "Sin espacios ni tildes. Ej.: lucia.g → luciag"}
      >
        <Input id="j-user" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoCapitalize="none" maxLength={30} required />
      </Field>
      <Field id="j-pass" label="Elige una contraseña" hint={`Mínimo ${MIN_PASSWORD} caracteres. ¡Apúntala!`}>
        <Input id="j-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
      </Field>
      {error && <ErrorText>{error}</ErrorText>}
      <Button type="submit" variant="popAccent" size="xl" className="w-full" disabled={busy}>
        {busy && <Loader2 className="animate-spin" />} Unirme y empezar
      </Button>
      <p className="text-xs text-muted-foreground">Lo que ya hayas practicado en este dispositivo pasará a tu cuenta.</p>
    </form>
  );
}

function TeacherForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (mode === "signup" && password.length < 8) return setError("Usa una contraseña de al menos 8 caracteres.");
    setBusy(true);
    const { error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
        : await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: { emailRedirectTo: window.location.origin, data: { display_name: name.trim() } },
          });
    setBusy(false);
    if (error) setError(authErrorMessage(error.message, "teacher"));
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Zona para crear clases y ver el progreso de tu alumnado.{" "}
        {mode === "login" ? "¿Primera vez? " : "¿Ya tienes cuenta? "}
        <button type="button" className="font-bold text-primary hover:underline" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
          {mode === "login" ? "Crea tu cuenta" : "Entra"}
        </button>
      </p>
      {mode === "signup" && (
        <Field id="t-name" label="Tu nombre">
          <Input id="t-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </Field>
      )}
      <Field id="t-email" label="Correo">
        <Input id="t-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
      </Field>
      <Field id="t-pass" label="Contraseña">
        <Input
          id="t-pass"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
        />
      </Field>
      {error && <ErrorText>{error}</ErrorText>}
      <Button type="submit" variant="pop" size="xl" className="w-full" disabled={busy}>
        {busy && <Loader2 className="animate-spin" />} {mode === "login" ? "Entrar" : "Crear cuenta de profesora"}
      </Button>
    </form>
  );
}
