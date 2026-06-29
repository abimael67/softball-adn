import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/teams/$teamId")({
  component: TeamDetailsPage,
});

function TeamDetailsPage() {
  const { teamId } = Route.useParams();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-foreground">Detalle del Equipo</h1>
      <p className="text-muted-foreground">
        Información del equipo con ID: {teamId}. Próximamente disponible.
      </p>
    </div>
  );
}
