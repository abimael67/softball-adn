import { createFileRoute } from "@tanstack/react-router";
import { History } from "lucide-react";

export const Route = createFileRoute("/admin/audit-log/")({
  component: AdminAuditLogPage,
});

function AdminAuditLogPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <History className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Registro de Auditoría</h1>
      </div>
      <p className="text-muted-foreground">
        Historial completo de acciones administrativas. Próximamente disponible.
      </p>
    </div>
  );
}
