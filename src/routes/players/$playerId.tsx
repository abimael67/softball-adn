import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/players/$playerId")({
  component: PlayerDetailsPage,
});

function PlayerDetailsPage() {
  const { playerId } = Route.useParams();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Detalle del Jugador</h1>
      <p className="text-muted-foreground">
        Estadísticas y perfil del jugador con ID: {playerId}. Próximamente disponible.
      </p>
    </div>
  );
}
