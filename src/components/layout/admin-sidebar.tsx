import { Link, useMatchRoute } from "@tanstack/react-router";
import {
  Calendar,
  MapPin,
  Users,
  UserCircle,
  UserCheck,
  CalendarDays,
  Settings,
  ScrollText,
  BarChart3,
  FileText,
  UsersRound,
  LayoutDashboard,
  Church,
  Crosshair,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Temporadas", to: "/admin/seasons", icon: Calendar },
  { label: "Sedes", to: "/admin/venues", icon: MapPin },
  { label: "Equipos", to: "/admin/teams", icon: Users },
  { label: "Jugadores", to: "/admin/players", icon: UserCircle },
  { label: "Posiciones", to: "/admin/positions", icon: Crosshair },
  { label: "Iglesias", to: "/admin/churches", icon: Church },
  { label: "Rosters", to: "/admin/rosters", icon: UserCheck },
  { label: "Calendario", to: "/admin/schedule", icon: CalendarDays },
] as const;

const ADMIN_NAV_SECONDARY = [
  { label: "Estadísticas", to: "/admin/standings", icon: BarChart3 },
  { label: "Reportes", to: "/admin/game-reports", icon: FileText },
  { label: "Usuarios", to: "/admin/users", icon: UsersRound },
  { label: "Auditoría", to: "/admin/audit-log", icon: ScrollText },
  { label: "Configuración", to: "/admin/settings", icon: Settings },
] as const;

export function AdminSidebar() {
  const matchRoute = useMatchRoute();

  return (
    <aside className="hidden lg:flex lg:w-56 lg:flex-col lg:border-r lg:bg-muted/30">
      <nav className="flex-1 space-y-1 p-3">
        <p className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
          Configuración
        </p>
        {ADMIN_NAV.map((item) => {
          const isActive = matchRoute({ to: item.to, fuzzy: !("exact" in item && item.exact) });
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}

        <p className="px-3 py-2 mt-4 text-xs font-semibold uppercase text-muted-foreground">
          Operaciones
        </p>
        {ADMIN_NAV_SECONDARY.map((item) => {
          const isActive = matchRoute({ to: item.to, fuzzy: true });
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function AdminMobileNav() {
  const matchRoute = useMatchRoute();

  return (
    <div className="lg:hidden overflow-x-auto border-b">
      <nav className="flex gap-1 px-4 py-2">
        {ADMIN_NAV.map((item) => {
          const isActive = matchRoute({ to: item.to, fuzzy: !("exact" in item && item.exact) });
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
