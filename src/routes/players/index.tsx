import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";

export const Route = createFileRoute("/players/")({
  component: PlayersPage,
});

function PlayersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <User className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Jugadores</h1>
      </div>
      <p className="text-muted-foreground">
        Listado de jugadores de la temporada. Próximamente disponible.
      </p>
    </div>
  );
}
