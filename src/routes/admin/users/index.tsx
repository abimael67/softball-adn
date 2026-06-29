import { createFileRoute } from "@tanstack/react-router";
import { UserCog } from "lucide-react";

export const Route = createFileRoute("/admin/users/")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <UserCog className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
      </div>
      <p className="text-muted-foreground">
        Administración de usuarios y roles del sistema. Próximamente disponible.
      </p>
    </div>
  );
}
