import { ROUTES } from "@/lib/constants";
import { Link } from "@tanstack/react-router";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-3 text-sm sm:flex-row sm:px-6 lg:px-8">
        <span>© {currentYear} Liga Deportiva La Hermandad</span>
        <nav className="flex items-center gap-4">
          <Link to={ROUTES.TEAMS} className="hover:text-foreground">
            Equipos
          </Link>
          <Link to={ROUTES.STANDINGS} className="hover:text-foreground">
            Posiciones
          </Link>
          <Link to={ROUTES.SCHEDULE} className="hover:text-foreground">
            Calendario
          </Link>
          <Link to={ROUTES.LEADERS} className="hover:text-foreground">
            Líderes
          </Link>
          <Link to={ROUTES.ABOUT} className="hover:text-foreground">
            Acerca de
          </Link>
        </nav>
      </div>
    </footer>
  );
}
