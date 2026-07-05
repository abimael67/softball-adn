import { createFileRoute } from "@tanstack/react-router";
import { useTeam } from "@/hooks/use-teams";
import { usePlayersByTeam } from "@/hooks/use-players";
import { usePositions } from "@/hooks/use-positions";
import {
  useLatestSeason,
  useTeamSeasonRecord,
  useRecentTeamGames,
  useTeamRoster,
} from "@/hooks/use-public-data";
import { storageService } from "@/services/storage-service";
import { SeasonRecordBadge } from "@/components/public/season-record-badge";
import { MatchResultCard } from "@/components/public/match-result-card";
import { GameHistoryTable } from "@/components/public/game-history-table";
import { PlayerCard } from "@/components/public/player-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Users, MapPin } from "lucide-react";
import { useTeams } from "@/hooks/use-teams";

export const Route = createFileRoute("/teams/$teamId")({
  component: TeamDetailsPage,
});

function TeamDetailsPage() {
  const { teamId } = Route.useParams();
  const { data: team, isLoading: teamLoading } = useTeam(teamId);
  const { data: season } = useLatestSeason();
  const { data: record } = useTeamSeasonRecord(teamId, season?.id || "");
  const { data: recentGames } = useRecentTeamGames(teamId, season?.id || "", 8);
  const { data: roster } = useTeamRoster(teamId, season?.id || "");
  const { data: positions } = usePositions();
  const { data: allTeams } = useTeams();

  const { data: rosterPlayers } = usePlayersByTeam(teamId, season?.id || "");

  const jerseyNumberMap = new Map(
    roster?.map((r) => [r.player_id, r.jersey_number]) || []
  );

  if (teamLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!team) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Equipo no encontrado
        </CardContent>
      </Card>
    );
  }

  const initials = team.short_name || team.name.substring(0, 2).toUpperCase();
  const getPositionName = (positionId: string | null) => {
    if (!positionId) return undefined;
    return positions?.find((p) => p.id === positionId)?.name;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {team.logo_key ? (
              <img
                src={storageService.getPublicUrl(team.logo_key)}
                alt={team.name}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full text-white font-bold text-2xl"
                style={{ backgroundColor: team.primary_color || "#3b82f6" }}
              >
                {initials}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">{team.name}</h1>
              {team.city && (
                <div className="flex items-center gap-1 text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{team.city}</span>
                </div>
              )}
              {season && (
                <p className="text-sm text-muted-foreground mt-2">
                  Temporada {season.name}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {record && record.totalGames > 0 && (
        <SeasonRecordBadge
          wins={record.wins}
          losses={record.losses}
          ties={record.ties}
          winningPercentage={record.winningPercentage}
        />
      )}

      {recentGames && recentGames.length > 0 && allTeams && (
        <Card>
          <CardHeader>
            <CardTitle>Últimos Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {recentGames.map((game) => {
                  const homeTeam = allTeams.find((t) => t.id === game.home_team_id);
                  const awayTeam = allTeams.find((t) => t.id === game.away_team_id);
                  if (!homeTeam || !awayTeam) return null;

                  return (
                    <CarouselItem key={game.id} className="md:basis-1/2 lg:basis-1/3">
                      <MatchResultCard
                        game={game}
                        teamId={teamId}
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                      />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      )}

      {rosterPlayers && rosterPlayers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Roster ({rosterPlayers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rosterPlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  positionName={getPositionName(player.primary_position_id)}
                  jerseyNumber={jerseyNumberMap.get(player.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recentGames && recentGames.length > 0 && allTeams && (
        <GameHistoryTable games={recentGames} teamId={teamId} teams={allTeams} />
      )}
    </div>
  );
}
