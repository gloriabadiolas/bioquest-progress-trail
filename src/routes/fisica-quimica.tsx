import { createFileRoute } from "@tanstack/react-router";
import { EmptySubject } from "@/components/EmptySubject";

export const Route = createFileRoute("/fisica-quimica")({
  head: () => ({ meta: [
    { title: "Física y Química · Repaso 3.º ESO" },
    { name: "description", content: "Temas de Física y Química de 3.º ESO." },
    { property: "og:title", content: "Física y Química · Repaso 3.º ESO" },
    { property: "og:description", content: "Temas de Física y Química de 3.º ESO." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <EmptySubject title="Física y Química" />,
});