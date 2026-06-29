import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";

export const Route = createFileRoute("/leaders/")({
  component: LeadersPage,
});

function LeadersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Líderes de la Liga</h1>
      </div>
      <p className="text-muted-foreground">
        Mejores jugadores en cada categoría estadística. Próximamente disponible.
      </p>
    </div>
  );
}
