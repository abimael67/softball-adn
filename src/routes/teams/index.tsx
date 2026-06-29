import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";

export const Route = createFileRoute("/teams/")({
  component: TeamsPage,
});

function TeamsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Equipos</h1>
      </div>
      <p className="text-muted-foreground">
        Listado de equipos de la temporada. Próximamente disponible.
      </p>
    </div>
  );
}
