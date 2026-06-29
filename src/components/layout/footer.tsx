import { ROUTES } from "@/lib/constants";
import { Link } from "@tanstack/react-router";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="font-semibold text-foreground">Liga de Softball</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Estadísticas, resultados y más de nuestra liga local de softball.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">Enlaces</h3>
            <ul className="mt-2 flex flex-col gap-1">
              <li>
                <Link
                  to={ROUTES.TEAMS}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Equipos
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.STANDINGS}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Posiciones
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.SCHEDULE}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Calendario
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.LEADERS}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Líderes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">Información</h3>
            <ul className="mt-2 flex flex-col gap-1">
              <li>
                <Link
                  to={ROUTES.ABOUT}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Acerca de
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          © {currentYear} Liga de Softball. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
