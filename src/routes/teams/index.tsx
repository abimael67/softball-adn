import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { useTeams } from "@/hooks/use-teams";
import { useLatestSeason } from "@/hooks/use-public-data";
import { useTeamSeasonRecord } from "@/hooks/use-public-data";
import { TeamCard } from "@/components/public/team-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import type { Team } from "@/types/database";

export const Route = createFileRoute("/teams/")({
  component: TeamsPage,
});

function TeamsPage() {
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { data: season } = useLatestSeason();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Equipos</h1>
      </div>

      {teamsLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !teams || teams.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No hay equipos registrados
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <TeamCardWithRecord key={team.id} team={team} seasonId={season?.id} />
          ))}
        </div>
      )}
    </div>
  );
}

function TeamCardWithRecord({ team, seasonId }: { team: Team; seasonId?: string }) {
  const { data: record } = useTeamSeasonRecord(team.id, seasonId || "");

  return <TeamCard team={team} record={record} />;
}
