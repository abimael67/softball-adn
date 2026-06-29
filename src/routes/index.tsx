import { createFileRoute } from "@tanstack/react-router";
import { Home as HomeIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-lg border bg-card p-8 text-center">
        <HomeIcon className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold text-foreground">Bienvenidos a la Liga de Softball</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Tu fuente de estadísticas, resultados y standings de la liga.
        </p>
      </section>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <section className="rounded-lg border bg-card p-6">
          <h2 className="font-semibold text-foreground">Equipos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Conoce a todos los equipos que participan en la liga.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="font-semibold text-foreground">Jugadores</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Perfiles y estadísticas de cada jugador.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="font-semibold text-foreground">Calendario</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Próximos partidos y resultados recientes.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="font-semibold text-foreground">Posiciones</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tabla de posiciones actualizada de la temporada.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="font-semibold text-foreground">Líderes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Los mejores jugadores en cada categoría estadística.
          </p>
        </section>

        <section className="rounded-lg border bg-card p-6">
          <h2 className="font-semibold text-foreground">Temporadas</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Historial completo de todas las temporadas de la liga.
          </p>
        </section>
      </div>
    </div>
  );
}
