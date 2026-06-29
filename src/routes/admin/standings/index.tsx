import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/admin/standings/")({
  component: AdminStandingsPage,
});

function AdminStandingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Standings</h1>
      </div>
      <p className="text-muted-foreground">
        Visualización de standings de la temporada. Próximamente disponible.
      </p>
    </div>
  );
}
