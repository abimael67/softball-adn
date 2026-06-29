import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/standings/")({
  component: StandingsPage,
});

function StandingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Tabla de Posiciones</h1>
      </div>
      <p className="text-muted-foreground">
        Clasificación de equipos de la temporada. Próximamente disponible.
      </p>
    </div>
  );
}
