import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { ROUTES } from "@/lib/constants";
// import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/providers/auth-provider";

const NAV_ITEMS = [
  { label: "Inicio", to: ROUTES.HOME },
  { label: "Equipos", to: ROUTES.TEAMS },
  { label: "Jugadores", to: ROUTES.PLAYERS },
  { label: "Calendario", to: ROUTES.SCHEDULE },
  { label: "Posiciones", to: ROUTES.STANDINGS },
  { label: "Líderes", to: ROUTES.LEADERS },
  { label: "Acerca de", to: ROUTES.ABOUT },
] as const;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const { isDark, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
          <img
            src="https://pub-27bf0bf9c1e447639bcb4a0a3693697b.r2.dev/logo%20lh.png"
            alt="Liga Deportiva La Hermandad"
            className="h-24 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-muted-foreground hover:text-foreground [&.active]:text-foreground text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user && (
            <>
              <Link
                to="/admin"
                className="text-muted-foreground hover:text-foreground hidden text-xs sm:block"
              >
                Admin
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{user.email}</span>
              </button>
            </>
          )}
          {!user && (
            <Link
              to="/login"
              className="text-muted-foreground hover:text-foreground text-sm font-medium"
            >
              Iniciar sesión
            </Link>
          )}
          {/* <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors"
            aria-label="Cambiar tema"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button> */}

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors md:hidden"
            aria-label="Menú"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="border-t md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-muted-foreground hover:bg-accent hover:text-accent-foreground [&.active]:bg-accent [&.active]:text-accent-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  to="/admin"
                  className="text-muted-foreground hover:bg-accent rounded-md px-3 py-2 text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="text-destructive hover:bg-accent rounded-md px-3 py-2 text-left text-sm font-medium"
                >
                  Cerrar sesión ({user.email})
                </button>
              </>
            )}
            {!user && (
              <Link
                to="/login"
                className="text-muted-foreground hover:bg-accent rounded-md px-3 py-2 text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
