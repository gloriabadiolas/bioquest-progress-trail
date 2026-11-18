import { Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptySubject({ title }: { title: string }) {
  return (
    <div className="space-y-8">
      <Button asChild variant="ghost"><Link to="/"><ArrowLeft /> Asignaturas</Link></Button>
      <div className="border-b-2 border-ink pb-6">
        <p className="mb-2 text-sm font-bold text-muted-foreground">3.º ESO</p>
        <h1 className="text-4xl font-extrabold">{title}</h1>
      </div>
      <section className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
        <BookOpen className="size-12 text-muted-foreground" strokeWidth={1.5} />
        <h2 className="text-2xl font-bold">Sin temas todavía</h2>
      </section>
    </div>
  );
}