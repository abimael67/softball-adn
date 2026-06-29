import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, Moon, Sun, LogOut } from "lucide-react";
import { useState } from "react";
import { ROUTES } from "@/lib/constants";
import { useTheme } from "@/hooks/use-theme";
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
  const { isDark, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 font-bold text-xl text-primary">
          Liga de Softball
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
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
                className="text-xs text-muted-foreground hover:text-foreground hidden sm:block"
              >
                Admin
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{user.email}</span>
              </button>
            </>
          )}
          {!user && (
            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Iniciar sesión
            </Link>
          )}
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Cambiar tema"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
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
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground [&.active]:bg-accent [&.active]:text-accent-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <>
                <Link to="/admin" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent" onClick={() => setIsMenuOpen(false)}>
                  Admin
                </Link>
                <button
                  onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                  className="rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-accent text-left"
                >
                  Cerrar sesión ({user.email})
                </button>
              </>
            )}
            {!user && (
              <Link to="/login" className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent" onClick={() => setIsMenuOpen(false)}>
                Iniciar sesión
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
