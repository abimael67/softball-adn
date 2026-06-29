import { useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Shield,
  Calendar,
  MapPin,
  Users,
  UserCircle,
  UserCheck,
  CalendarDays,
} from "lucide-react";
import {
  useSeasons,
  useTeams,
  usePlayers,
  useVenues,
  useGames,
  useRostersBySeason,
} from "@/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SetupWizard } from "@/components/admin/setup-wizard";
import { PageHeader, StatusBadge, LoadingState } from "@/components/admin/admin-shared";
import { ProtectedRoute } from "@/components/auth/protected-route";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const { data: seasons, isLoading: seasonsLoading } = useSeasons();
  const { data: teams } = useTeams();
  const { data: players } = usePlayers();
  const { data: venues } = useVenues();

  const activeSeason = seasons?.find((s) => s.status === "active");
  const seasonId = activeSeason?.id || "";
  const { data: games } = useGames(seasonId);
  const { data: rosters } = useRostersBySeason(seasonId);

  const setupSteps = useMemo(() => {
    const teamCount = teams?.length || 0;
    const playerCount = players?.length || 0;
    const venueCount = venues?.length || 0;
    const rosterCount = rosters?.filter((r) => r.is_active).length || 0;
    const gameCount = games?.length || 0;

    return [
      {
        id: "seasons",
        label: "Temporada",
        description: "Crear y activar la temporada",
        count: seasons?.length || 0,
        completed: !!activeSeason,
      },
      {
        id: "venues",
        label: "Sedes",
        description: "Registrar las sedes de juego",
        count: venueCount,
        completed: venueCount > 0,
      },
      {
        id: "teams",
        label: "Equipos",
        description: "Crear los equipos participantes",
        count: teamCount,
        completed: teamCount >= 2,
      },
      {
        id: "players",
        label: "Jugadores",
        description: "Registrar los jugadores de la liga",
        count: playerCount,
        completed: playerCount > 0,
      },
      {
        id: "rosters",
        label: "Rosters",
        description: "Asignar jugadores a equipos",
        count: rosterCount,
        completed: rosterCount > 0,
      },
      {
        id: "schedule",
        label: "Calendario",
        description: "Programar los partidos",
        count: gameCount,
        completed: gameCount > 0,
      },
    ];
  }, [seasons, teams, players, venues, rosters, games, activeSeason]);

  const completedSteps = setupSteps.filter((s) => s.completed).length;
  const progress = (completedSteps / setupSteps.length) * 100;

  const stepRoutes: Record<string, string> = {
    seasons: "/admin/seasons",
    venues: "/admin/venues",
    teams: "/admin/teams",
    players: "/admin/players",
    rosters: "/admin/rosters",
    schedule: "/admin/schedule",
  };

  const activeStepId = setupSteps.find((s) => !s.completed)?.id || setupSteps[0].id;

  if (seasonsLoading) return <LoadingState />;

  return (
    <div className="space-y-8">
      <PageHeader
        icon={Shield}
        title="Panel de Administración"
        description="Configura y gestiona la liga de softball"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuración de temporada</CardTitle>
              <CardDescription>
                Sigue estos pasos para preparar la temporada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progreso</span>
                  <span className="font-medium">{completedSteps}/{setupSteps.length}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <SetupWizard
                steps={setupSteps}
                activeStep={activeStepId}
                onStepClick={(stepId) => navigate({ to: stepRoutes[stepId] })}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard
              icon={Calendar}
              label="Temporadas"
              value={seasons?.length || 0}
              onClick={() => navigate({ to: "/admin/seasons" })}
            />
            <StatCard
              icon={MapPin}
              label="Sedes"
              value={venues?.length || 0}
              onClick={() => navigate({ to: "/admin/venues" })}
            />
            <StatCard
              icon={Users}
              label="Equipos"
              value={teams?.length || 0}
              onClick={() => navigate({ to: "/admin/teams" })}
            />
            <StatCard
              icon={UserCircle}
              label="Jugadores"
              value={players?.length || 0}
              onClick={() => navigate({ to: "/admin/players" })}
            />
            <StatCard
              icon={UserCheck}
              label="En rosters"
              value={rosters?.filter((r) => r.is_active).length || 0}
              onClick={() => navigate({ to: "/admin/rosters" })}
            />
            <StatCard
              icon={CalendarDays}
              label="Partidos"
              value={games?.length || 0}
              onClick={() => navigate({ to: "/admin/schedule" })}
            />
          </div>

          {activeSeason && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{activeSeason.name}</CardTitle>
                    <CardDescription>
                      {new Date(activeSeason.start_date).toLocaleDateString("es")} - {new Date(activeSeason.end_date).toLocaleDateString("es")}
                    </CardDescription>
                  </div>
                  <StatusBadge status={activeSeason.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{teams?.length || 0}</p>
                    <p className="text-xs text-muted-foreground">Equipos</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{rosters?.filter((r) => r.is_active).length || 0}</p>
                    <p className="text-xs text-muted-foreground">Jugadores activos</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{games?.length || 0}</p>
                    <p className="text-xs text-muted-foreground">Partidos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Accesos rápidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <QuickAction label="Nueva temporada" icon={Calendar} onClick={() => navigate({ to: "/admin/seasons" })} />
                <QuickAction label="Nueva sede" icon={MapPin} onClick={() => navigate({ to: "/admin/venues" })} />
                <QuickAction label="Nuevo equipo" icon={Users} onClick={() => navigate({ to: "/admin/teams" })} />
                <QuickAction label="Nuevo jugador" icon={UserCircle} onClick={() => navigate({ to: "/admin/players" })} />
                <QuickAction label="Rosters" icon={UserCheck} onClick={() => navigate({ to: "/admin/rosters" })} />
                <QuickAction label="Programar partido" icon={CalendarDays} onClick={() => navigate({ to: "/admin/schedule" })} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-muted/50"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </button>
  );
}

function QuickAction({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  return (
    <Button variant="outline" className="justify-start gap-2 h-auto py-3" onClick={onClick}>
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  );
}
