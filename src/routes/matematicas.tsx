import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/matematicas")({
  head: () => ({ meta: [
    { title: "Matemáticas · Repaso 3.º ESO" },
    { name: "description", content: "Temas de Matemáticas de 3.º ESO." },
    { property: "og:title", content: "Matemáticas · Repaso 3.º ESO" },
    { property: "og:description", content: "Temas de Matemáticas de 3.º ESO." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Outlet,
});