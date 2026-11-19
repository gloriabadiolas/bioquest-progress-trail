import { Link } from "@tanstack/react-router";
import { BarChart3, Home, LogIn, LogOut, RotateCcw, School } from "lucide-react";
import schoolLogo from "@/assets/colegio-logo.png.asset.json";
import teacherImage from "@/assets/profesora-ciencias.png.asset.json";

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
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="min-w-0 max-w-[55%]" aria-label="Colegio Sagrado Corazón de Jesús · Inicio">
          <img src={schoolLogo.url} alt="Colegio Sagrado Corazón de Jesús · Fundación Educere" width={407} height={60} className="h-auto w-full max-w-[407px] object-contain" />
        </Link>
        <div className="flex min-w-0 items-center justify-end gap-3">
          <div className="max-w-40 text-right sm:max-w-56">
            <p className="font-display text-base font-bold sm:text-lg">Gloria</p>
            <p className="text-[0.65rem] leading-snug text-muted-foreground sm:text-xs">Profesora del ámbito científico-tecnológico</p>
          </div>
          <img src={teacherImage.url} alt="Gloria, profesora del ámbito científico-tecnológico" width={768} height={768} className="size-14 shrink-0 rounded-lg border border-border object-cover sm:size-20" />
        </div>
      </div>
      <div className="border-t border-border">
        <nav aria-label="Navegación principal" className="mx-auto flex max-w-5xl flex-wrap items-center justify-end gap-1 px-4 py-2">
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
