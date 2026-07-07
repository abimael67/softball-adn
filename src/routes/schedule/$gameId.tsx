import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { 
  useGame, 
  useTeams, 
  useVenues, 
  usePlayers,
  useBattingStatsByGame,
  usePitchingStatsByGame,
  useGames,
} from "@/hooks";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { storageService } from "@/services/storage-service";
import type { Team } from "@/types/database";

export const Route = createFileRoute("/schedule/$gameId")({
  component: GameDetailsPage,
});

function GameDetailsPage() {
  const { gameId } = Route.useParams();
  const { data: game, isLoading: gameLoading } = useGame(gameId);
  const { data: teams } = useTeams();
  const { data: venues } = useVenues();
  const { data: players } = usePlayers();
  const { data: battingStats = [] } = useBattingStatsByGame(gameId);
  const { data: pitchingStats = [] } = usePitchingStatsByGame(gameId);
  const { data: allGames = [] } = useGames(game?.season_id || "");
  const [activeTab, setActiveTab] = useState<string>("home");

  const getTeam = (teamId: string) => {
    return teams?.find((t) => t.id === teamId);
  };

  const getVenue = (venueId: string | null) => {
    if (!venueId) return null;
    return venues?.find((v) => v.id === venueId);
  };

  const hasScore = () => {
    if (!game) return false;
    return game.home_score !== null && game.away_score !== null;
  };

  const getWinner = () => {
    if (!hasScore()) return null;
    if (game!.home_score! > game!.away_score!) return "home";
    if (game!.away_score! > game!.home_score!) return "away";
    return "tie";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      day: date.toLocaleDateString("es-ES", { day: "2-digit" }),
      month: date.toLocaleDateString("es-ES", { month: "short" }).toUpperCase(),
      time: date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const TeamLogo = ({ team, isWinner }: { team?: Team; isWinner?: boolean }) => {
    const winnerClasses = isWinner
      ? "ring-4 ring-primary ring-offset-4 ring-offset-background shadow-lg shadow-primary/30"
      : "ring-4 ring-primary/20 ring-offset-4 ring-offset-background";

    if (team?.logo_key) {
      return (
        <img
          src={storageService.getPublicUrl(team.logo_key)}
          alt={team.name}
          className={`h-24 w-24 rounded-full object-cover ${winnerClasses}`}
        />
      );
    }
    return (
      <div className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-2xl font-black text-primary ${winnerClasses}`}>
        {team?.short_name || "?"}
      </div>
    );
  };

  const getPlayerName = (playerId: string) => {
    const player = players?.find((p) => p.id === playerId);
    if (!player) return "Jugador desconocido";
    return `${player.first_name} ${player.last_name}`;
  };

  const getTeamStats = (teamId: string) => {
    const teamBatting = battingStats.filter((stat) => stat.team_id === teamId);
    const teamPitching = pitchingStats.filter((stat) => stat.team_id === teamId);
    
    // Ordenar por nombre del jugador (ascendente)
    teamBatting.sort((a, b) => getPlayerName(a.player_id).localeCompare(getPlayerName(b.player_id)));
    teamPitching.sort((a, b) => getPlayerName(a.player_id).localeCompare(getPlayerName(b.player_id)));
    
    return { batting: teamBatting, pitching: teamPitching };
  };

  const getTeamRecord = (teamId: string) => {
    let wins = 0;
    let losses = 0;
    
    allGames.forEach((g) => {
      // Solo contar juegos completados (que tienen score)
      if (g.home_score === null || g.away_score === null) return;
      
      if (g.home_team_id === teamId) {
        if (g.home_score > g.away_score) wins++;
        else if (g.home_score < g.away_score) losses++;
      } else if (g.away_team_id === teamId) {
        if (g.away_score > g.home_score) wins++;
        else if (g.away_score < g.home_score) losses++;
      }
    });
    
    return `${wins}-${losses}`;
  };

  if (gameLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground">Cargando partido...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex flex-col gap-4">
        <Button asChild variant="outline" className="w-fit">
          <Link to="/schedule">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al calendario
          </Link>
        </Button>
        <div className="rounded-xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-muted/30 to-background p-12 text-center">
          <p className="text-lg font-bold text-foreground">Partido no encontrado</p>
          <p className="mt-1 text-sm text-muted-foreground">
            El partido que buscas no existe o fue eliminado
          </p>
        </div>
      </div>
    );
  }

  const homeTeam = getTeam(game.home_team_id);
  const awayTeam = getTeam(game.away_team_id);
  const venue = getVenue(game.venue_id);
  const dateInfo = formatDate(game.scheduled_at);
  const completed = hasScore();
  const winner = getWinner();

  return (
    <div className="flex flex-col gap-4">
      <Button asChild variant="outline" className="w-fit">
        <Link to="/schedule">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al calendario
        </Link>
      </Button>

      <Card className="schedule-card relative overflow-hidden border-2">
        <div className="relative z-10 flex flex-col">
          <div className={`flex items-stretch ${completed ? "bg-gradient-to-br from-muted/40 via-background to-muted/20" : "bg-gradient-to-br from-primary/10 via-primary/5 to-background"}`}>
            <div className="relative flex w-24 flex-col items-center justify-center border-r-2 border-primary/20 py-6">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
              <span className="relative text-xs font-bold uppercase tracking-wider text-primary/70">
                {dateInfo.month}
              </span>
              <span className="relative text-4xl font-black text-primary">{dateInfo.day}</span>
            </div>

            <div className="flex flex-1 flex-col p-4">
              <div className="mb-3 flex items-center justify-between text-xs text-foreground/70">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="font-semibold">{dateInfo.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="font-semibold">{venue?.name || "Por definir"}</span>
                </div>
              </div>

              <div className="flex flex-1 items-center justify-between gap-3 py-2">
                <Link to="/teams/$teamId" params={{ teamId: game.home_team_id }} className="flex flex-1 flex-col items-center text-center gap-2 hover:opacity-80 transition-opacity">
                  <TeamLogo team={homeTeam} isWinner={winner === "home"} />
                  <div>
                    <p className="text-base font-black text-foreground">{homeTeam?.name}</p>
                    <p className="text-xs text-muted-foreground">({getTeamRecord(game.home_team_id)})</p>
                  </div>
                </Link>

                <div className="flex flex-col items-center">
                  {completed ? (
                    <>
                      <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-background to-muted/30 px-5 py-3 shadow-lg ring-2 ring-primary/10">
                        <span className="text-3xl font-black text-foreground">
                          {game.home_score ?? 0}
                        </span>
                        <span className="text-xl font-bold text-muted-foreground">-</span>
                        <span className="text-3xl font-black text-foreground">
                          {game.away_score ?? 0}
                        </span>
                      </div>
                      <Badge variant="secondary" className="mt-2 rounded-full px-3 py-0.5 text-xs font-bold">
                        Final
                      </Badge>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-black text-primary/40">vs</span>
                      <Badge variant="outline" className="mt-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                        Próximo
                      </Badge>
                    </div>
                  )}
                </div>

                <Link to="/teams/$teamId" params={{ teamId: game.away_team_id }} className="flex flex-1 flex-col items-center text-center gap-2 hover:opacity-80 transition-opacity">
                  <TeamLogo team={awayTeam} isWinner={winner === "away"} />
                  <div>
                    <p className="text-base font-black text-foreground">{awayTeam?.name}</p>
                    <p className="text-xs text-muted-foreground">({getTeamRecord(game.away_team_id)})</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {completed && (
        <Card className="border-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
              <TabsTrigger 
                value="home" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                {homeTeam?.name}
              </TabsTrigger>
              <TabsTrigger 
                value="away" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                {awayTeam?.name}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="p-4">
              {(() => {
                const stats = getTeamStats(game.home_team_id);
                if (stats.batting.length === 0 && stats.pitching.length === 0) {
                  return <p className="text-center text-muted-foreground py-8">Sin estadísticas disponibles</p>;
                }
                return (
                  <div className="space-y-6">
                    {stats.batting.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Bateo</h3>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="sticky left-0 bg-background">Jugador</TableHead>
                                <TableHead className="text-center">AB</TableHead>
                                <TableHead className="text-center">R</TableHead>
                                <TableHead className="text-center">H</TableHead>
                                <TableHead className="text-center">2B</TableHead>
                                <TableHead className="text-center">3B</TableHead>
                                <TableHead className="text-center">HR</TableHead>
                                <TableHead className="text-center">RBI</TableHead>
                                <TableHead className="text-center">BB</TableHead>
                                <TableHead className="text-center">SO</TableHead>
                                <TableHead className="text-center">SB</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {stats.batting.map((stat) => (
                                <TableRow key={stat.id}>
                                  <TableCell className="sticky left-0 bg-background font-medium">
                                    <Link to="/players/$playerId" params={{ playerId: stat.player_id }} className="hover:text-primary transition-colors">
                                      {getPlayerName(stat.player_id)}
                                    </Link>
                                  </TableCell>
                                  <TableCell className="text-center">{stat.at_bats}</TableCell>
                                  <TableCell className="text-center">{stat.runs}</TableCell>
                                  <TableCell className="text-center">{stat.hits}</TableCell>
                                  <TableCell className="text-center">{stat.doubles}</TableCell>
                                  <TableCell className="text-center">{stat.triples}</TableCell>
                                  <TableCell className="text-center">{stat.home_runs}</TableCell>
                                  <TableCell className="text-center">{stat.rbi}</TableCell>
                                  <TableCell className="text-center">{stat.walks}</TableCell>
                                  <TableCell className="text-center">{stat.strikeouts}</TableCell>
                                  <TableCell className="text-center">{stat.stolen_bases}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}

                    {stats.pitching.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pitcheo</h3>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="sticky left-0 bg-background">Jugador</TableHead>
                                <TableHead className="text-center">IP</TableHead>
                                <TableHead className="text-center">H</TableHead>
                                <TableHead className="text-center">R</TableHead>
                                <TableHead className="text-center">ER</TableHead>
                                <TableHead className="text-center">BB</TableHead>
                                <TableHead className="text-center">SO</TableHead>
                                <TableHead className="text-center">HR</TableHead>
                                <TableHead className="text-center">WP</TableHead>
                                <TableHead className="text-center">W</TableHead>
                                <TableHead className="text-center">L</TableHead>
                                <TableHead className="text-center">SV</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {stats.pitching.map((stat) => (
                                <TableRow key={stat.id}>
                                  <TableCell className="sticky left-0 bg-background font-medium">
                                    <Link to="/players/$playerId" params={{ playerId: stat.player_id }} className="hover:text-primary transition-colors">
                                      {getPlayerName(stat.player_id)}
                                    </Link>
                                  </TableCell>
                                  <TableCell className="text-center">{stat.innings_pitched}</TableCell>
                                  <TableCell className="text-center">{stat.hits_allowed}</TableCell>
                                  <TableCell className="text-center">{stat.runs_allowed}</TableCell>
                                  <TableCell className="text-center">{stat.earned_runs}</TableCell>
                                  <TableCell className="text-center">{stat.walks}</TableCell>
                                  <TableCell className="text-center">{stat.strikeouts}</TableCell>
                                  <TableCell className="text-center">{stat.home_runs_allowed}</TableCell>
                                  <TableCell className="text-center">{stat.wild_pitches}</TableCell>
                                  <TableCell className="text-center">{stat.wins}</TableCell>
                                  <TableCell className="text-center">{stat.losses}</TableCell>
                                  <TableCell className="text-center">{stat.saves}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </TabsContent>

            <TabsContent value="away" className="p-4">
              {(() => {
                const stats = getTeamStats(game.away_team_id);
                if (stats.batting.length === 0 && stats.pitching.length === 0) {
                  return <p className="text-center text-muted-foreground py-8">Sin estadísticas disponibles</p>;
                }
                return (
                  <div className="space-y-6">
                    {stats.batting.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Bateo</h3>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="sticky left-0 bg-background">Jugador</TableHead>
                                <TableHead className="text-center">AB</TableHead>
                                <TableHead className="text-center">R</TableHead>
                                <TableHead className="text-center">H</TableHead>
                                <TableHead className="text-center">2B</TableHead>
                                <TableHead className="text-center">3B</TableHead>
                                <TableHead className="text-center">HR</TableHead>
                                <TableHead className="text-center">RBI</TableHead>
                                <TableHead className="text-center">BB</TableHead>
                                <TableHead className="text-center">SO</TableHead>
                                <TableHead className="text-center">SB</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {stats.batting.map((stat) => (
                                <TableRow key={stat.id}>
                                  <TableCell className="sticky left-0 bg-background font-medium">
                                    <Link to="/players/$playerId" params={{ playerId: stat.player_id }} className="hover:text-primary transition-colors">
                                      {getPlayerName(stat.player_id)}
                                    </Link>
                                  </TableCell>
                                  <TableCell className="text-center">{stat.at_bats}</TableCell>
                                  <TableCell className="text-center">{stat.runs}</TableCell>
                                  <TableCell className="text-center">{stat.hits}</TableCell>
                                  <TableCell className="text-center">{stat.doubles}</TableCell>
                                  <TableCell className="text-center">{stat.triples}</TableCell>
                                  <TableCell className="text-center">{stat.home_runs}</TableCell>
                                  <TableCell className="text-center">{stat.rbi}</TableCell>
                                  <TableCell className="text-center">{stat.walks}</TableCell>
                                  <TableCell className="text-center">{stat.strikeouts}</TableCell>
                                  <TableCell className="text-center">{stat.stolen_bases}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}

                    {stats.pitching.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pitcheo</h3>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="sticky left-0 bg-background">Jugador</TableHead>
                                <TableHead className="text-center">IP</TableHead>
                                <TableHead className="text-center">H</TableHead>
                                <TableHead className="text-center">R</TableHead>
                                <TableHead className="text-center">ER</TableHead>
                                <TableHead className="text-center">BB</TableHead>
                                <TableHead className="text-center">SO</TableHead>
                                <TableHead className="text-center">HR</TableHead>
                                <TableHead className="text-center">WP</TableHead>
                                <TableHead className="text-center">W</TableHead>
                                <TableHead className="text-center">L</TableHead>
                                <TableHead className="text-center">SV</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {stats.pitching.map((stat) => (
                                <TableRow key={stat.id}>
                                  <TableCell className="sticky left-0 bg-background font-medium">
                                    <Link to="/players/$playerId" params={{ playerId: stat.player_id }} className="hover:text-primary transition-colors">
                                      {getPlayerName(stat.player_id)}
                                    </Link>
                                  </TableCell>
                                  <TableCell className="text-center">{stat.innings_pitched}</TableCell>
                                  <TableCell className="text-center">{stat.hits_allowed}</TableCell>
                                  <TableCell className="text-center">{stat.runs_allowed}</TableCell>
                                  <TableCell className="text-center">{stat.earned_runs}</TableCell>
                                  <TableCell className="text-center">{stat.walks}</TableCell>
                                  <TableCell className="text-center">{stat.strikeouts}</TableCell>
                                  <TableCell className="text-center">{stat.home_runs_allowed}</TableCell>
                                  <TableCell className="text-center">{stat.wild_pitches}</TableCell>
                                  <TableCell className="text-center">{stat.wins}</TableCell>
                                  <TableCell className="text-center">{stat.losses}</TableCell>
                                  <TableCell className="text-center">{stat.saves}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
}
