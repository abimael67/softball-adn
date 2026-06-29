import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";

export const Route = createFileRoute("/about/")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Info className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Acerca de</h1>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Sobre la Liga</h2>
        <p className="mt-2 text-muted-foreground">
          Esta aplicación es la fuente oficial de estadísticas y resultados de nuestra liga local
          de softball. Aquí encontrarás información actualizada sobre equipos, jugadores, partidos y
          standings de cada temporada.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Temporadas</h2>
        <p className="mt-2 text-muted-foreground">
          La liga opera por temporadas. Cada temporada tiene sus propios equipos, jugadores,
          partidos y estadísticas independientes. Puedes navegar entre temporadas para consultar el
          historial completo.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Proyecto Comunitario</h2>
        <p className="mt-2 text-muted-foreground">
          Este es un proyecto comunitario desarrollado para mantener informados a los aficionados y
          participantes de la liga.
        </p>
      </div>
    </div>
  );
}
