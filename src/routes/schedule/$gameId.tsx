import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/schedule/$gameId")({
  component: GameDetailsPage,
});

function GameDetailsPage() {
  const { gameId } = Route.useParams();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Detalle del Partido</h1>
      <p className="text-muted-foreground">
        Información del partido con ID: {gameId}. Próximamente disponible.
      </p>
    </div>
  );
}
