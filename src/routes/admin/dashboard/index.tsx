import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard/")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
      </div>
      <p className="text-muted-foreground">
        Bienvenido al panel de administración. Próximamente disponible.
      </p>
    </div>
  );
}
