import { Link } from "@tanstack/react-router";
import { BarChart3, BookOpen, Home, LogIn, LogOut, RotateCcw, School } from "lucide-react";

import { useAccount } from "@/hooks/use-account";
import { signOut } from "@/lib/account";

import { useProgress } from "@/hooks/use-progress";
import { MISSIONS } from "@/lib/content/missions";
import { reviewList } from "@/lib/progress";
import { cn } from "@/lib/utils";

const linkClass =
  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-ink";
const activeClass = "bg-ink text-paper hover:bg-ink hover:text-paper";

export function AppHeader() {
  const progress = useProgress();
  const pending = reviewList(MISSIONS, progress).length;
  const account = useAccount();
  return (
    <header className="sticky top-0 z-30 border-b-2 border-ink bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg border-2 border-ink bg-accent font-display text-lg font-extrabold text-accent-foreground shadow-press">
            <BookOpen className="size-5" />
          </span>
          <span className="hidden font-display text-lg font-extrabold leading-none sm:block">
            Repaso ESO<span className="text-accent">.</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link to="/" className={linkClass} activeProps={{ className: cn(linkClass, activeClass) }} activeOptions={{ exact: true }}>
            <Home className="size-4" /> <span className="hidden sm:inline">Asignaturas</span>
          </Link>
          <Link to="/repaso" className={linkClass} activeProps={{ className: cn(linkClass, activeClass) }}>
            <RotateCcw className="size-4" /> <span className="hidden sm:inline">Fallos</span>
            {pending > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-accent px-1.5 text-xs text-accent-foreground">{pending}</span>
            )}
          </Link>
          <Link to="/progreso" className={linkClass} activeProps={{ className: cn(linkClass, activeClass) }}>
            <BarChart3 className="size-4" /> <span className="hidden sm:inline">Mi progreso</span>
          </Link>
          {(account.status === "teacher" || account.status === "user") && (
            <Link to="/aula" className={linkClass} activeProps={{ className: cn(linkClass, activeClass) }}>
              <School className="size-4" /> <span className="hidden sm:inline">Mi aula</span>
            </Link>
          )}
          {account.status === "signed_out" && (
            <Link to="/auth" className={linkClass}>
              <LogIn className="size-4" /> <span className="hidden sm:inline">Entrar</span>
            </Link>
          )}
          {account.status !== "signed_out" && account.status !== "loading" && (
            <button type="button" onClick={() => void signOut()} className={linkClass} title="Cerrar sesión">
              <LogOut className="size-4" />
              <span className="hidden max-w-24 truncate md:inline">{account.status === "user" ? account.email : account.displayName}</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
