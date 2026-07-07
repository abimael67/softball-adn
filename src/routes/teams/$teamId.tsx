import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTeam } from "@/hooks/use-teams";
import { usePlayersByTeam } from "@/hooks/use-players";
import { usePositions } from "@/hooks/use-positions";
import {
  useLatestSeason,
  useTeamSeasonRecord,
  useRecentTeamGames,
  useTeamRoster,
  useTeamSeasonBattingStats,
  useTeamGameBatting,
} from "@/hooks/use-public-data";
import { storageService } from "@/services/storage-service";
import { Badge } from "@/components/ui/badge";
import { MatchResultCard } from "@/components/public/match-result-card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { MapPin, BarChart3, Calendar, Trophy } from "lucide-react";
import { useTeams } from "@/hooks/use-teams";
import { useStandings } from "@/hooks/use-standings";

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
  const { data: standings } = useStandings(season?.id || "");

  const { data: rosterPlayers } = usePlayersByTeam(teamId, season?.id || "");
  const { data: battingStats } = useTeamSeasonBattingStats(teamId, season?.id || "");
  const { data: gamesWithBatting } = useTeamGameBatting(teamId, season?.id || "");

  const navigate = useNavigate();

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

  const positionIndex = standings?.findIndex((s) => s.teamId === teamId);
  const teamPosition = positionIndex !== undefined && positionIndex >= 0 ? positionIndex + 1 : undefined;
  const teamStanding = standings?.find((s) => s.teamId === teamId);

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
            {record && record.totalGames > 0 && (
              <div className="flex items-center gap-2 shrink-0">
                {teamPosition !== undefined && (
                  <Badge
                    variant="secondary"
                    className="text-sm px-3 py-1.5 cursor-pointer hover:bg-secondary/80 transition-colors"
                    onClick={() => navigate({ to: "/standings" })}
                  >
                    #{teamPosition}
                  </Badge>
                )}
                <Badge variant="outline" className="text-sm px-3 py-1.5">
                  {record.wins}-{record.losses}
                  {record.ties > 0 ? `-${record.ties}` : ""}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {battingStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Datos Rápidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{battingStats.homeRuns}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">HR</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{battingStats.hits}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Hits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {teamStanding ? teamStanding.runsScored : battingStats.runs}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Carreras</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {teamStanding ? teamStanding.runsAllowed : "-"}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Permitidas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{battingStats.walks}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">BB</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{battingStats.doubles}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Dobles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{battingStats.triples}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Triples</div>
              </div>
            </div>
          </CardContent>
        </Card>
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

      <Card>
        <Tabs defaultValue="historial">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Partidos
              </CardTitle>
              <TabsList>
                <TabsTrigger value="historial">Historial</TabsTrigger>
                <TabsTrigger value="roster">
                  Roster
                  {rosterPlayers && ` (${rosterPlayers.length})`}
                </TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="historial">
              {gamesWithBatting && gamesWithBatting.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Rival</TableHead>
                      <TableHead>Resultado</TableHead>
                      <TableHead className="text-center">R</TableHead>
                      <TableHead className="text-center">H</TableHead>
                      <TableHead className="text-center">E</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gamesWithBatting
                      .sort((a, b) => new Date(b.game.scheduled_at).getTime() - new Date(a.game.scheduled_at).getTime())
                      .map(({ game, batting }) => {
                        const isHome = game.home_team_id === teamId;
                        const opponentId = isHome ? game.away_team_id : game.home_team_id;
                        const opponent = allTeams?.find((t) => t.id === opponentId);
                        const teamScore = isHome ? game.home_score : game.away_score;
                        const opponentScore = isHome ? game.away_score : game.home_score;

                        let result: "V" | "D" | "E" | null = null;
                        if (teamScore !== null && opponentScore !== null) {
                          if (teamScore > opponentScore) result = "V";
                          else if (teamScore < opponentScore) result = "D";
                          else result = "E";
                        }

                        const date = new Date(game.scheduled_at).toLocaleDateString("es-ES", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });

                        return (
                          <TableRow key={game.id}>
                            <TableCell
                              className="font-medium whitespace-nowrap cursor-pointer hover:text-primary transition-colors"
                              onClick={() => navigate({ to: "/schedule/$gameId", params: { gameId: game.id } })}
                            >
                              {date}
                            </TableCell>
                            <TableCell>{opponent?.name || "Desconocido"}</TableCell>
                            <TableCell>
                              {result && (
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                                    result === "V"
                                      ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                      : result === "D"
                                        ? "bg-red-500/10 text-red-700 dark:text-red-400"
                                        : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                                  }`}
                                >
                                  {result === "V" && <Trophy className="h-3 w-3" />}
                                  {result === "V" ? "Victoria" : result === "D" ? "Derrota" : "Empate"}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-center font-semibold">
                              {teamScore ?? "-"}
                            </TableCell>
                            <TableCell className="text-center">{batting.hits || "-"}</TableCell>
                            <TableCell className="text-center">{batting.errors || "-"}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No hay partidos registrados
                </p>
              )}
            </TabsContent>
            <TabsContent value="roster">
              {rosterPlayers && rosterPlayers.length > 0 ? (
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
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No hay jugadores en el roster
                </p>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
