import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "lucide-react";

export const Route = createFileRoute("/schedule/")({
  component: SchedulePage,
});

function SchedulePage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Calendar className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Calendario</h1>
      </div>
      <p className="text-muted-foreground">
        Calendario de partidos de la temporada. Próximamente disponible.
      </p>
    </div>
  );
}
