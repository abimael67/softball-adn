import { createFileRoute } from "@tanstack/react-router";
import { ClipboardCheck } from "lucide-react";

export const Route = createFileRoute("/admin/game-reports/")({
  component: AdminGameReportsPage,
});

function AdminGameReportsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <ClipboardCheck className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Reportes de Juegos</h1>
      </div>
      <p className="text-muted-foreground">
        Ingreso y revisión de estadísticas de juegos. Próximamente disponible.
      </p>
    </div>
  );
}
