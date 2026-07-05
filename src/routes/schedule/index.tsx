import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, MapPin, Clock } from "lucide-react";
import { useSeasons, useGames, useTeams, useVenues } from "@/hooks";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { storageService } from "@/services/storage-service";
import type { Game } from "@/types/database";

export const Route = createFileRoute("/schedule/")({
  component: SchedulePage,
});

function SchedulePage() {
  const { data: seasons, isLoading: seasonsLoading } = useSeasons();
  const activeSeason = seasons?.find((s) => s.status === "active") || seasons?.[0];
  const { data: games, isLoading: gamesLoading } = useGames(activeSeason?.id || "");
  const { data: teams } = useTeams();
  const { data: venues } = useVenues();

  const isLoading = seasonsLoading || gamesLoading;

  const getTeamName = (teamId: string) => {
    const team = teams?.find((t) => t.id === teamId);
    return team?.name || "Equipo desconocido";
  };

  const getVenueName = (venueId: string | null) => {
    if (!venueId) return null;
    const venue = venues?.find((v) => v.id === venueId);
    return venue?.name || null;
  };

  const isGameCompleted = (game: Game) => {
    return ["published", "approved", "completed"].includes(game.status);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString("es-ES", { day: "2-digit" }),
      month: date.toLocaleDateString("es-ES", { month: "short" }).toUpperCase(),
      weekday: date.toLocaleDateString("es-ES", { weekday: "long" }),
      time: date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true }),
    };
  };

  const getTeam = (teamId: string) => {
    return teams?.find((t) => t.id === teamId);
  };

  const TeamLogo = ({ teamId }: { teamId: string }) => {
    const team = getTeam(teamId);
    if (team?.logo_key) {
      return (
        <img
          src={storageService.getPublicUrl(team.logo_key)}
          alt={team.name}
          className="h-12 w-12 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
        {team?.short_name || "?"}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground">Cargando calendario...</div>
      </div>
    );
  }

  if (!activeSeason) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Calendario</h1>
        </div>
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="text-muted-foreground">No hay temporadas disponibles</p>
        </div>
      </div>
    );
  }

  const sortedGames = [...(games || [])].sort(
    (a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg ring-4 ring-primary/20">
              <Calendar className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-foreground">Calendario</h1>
              <p className="text-sm font-semibold text-primary">{activeSeason.name}</p>
            </div>
          </div>
        </div>
      </div>

      {sortedGames.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-muted/30 to-background p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Calendar className="h-8 w-8 text-primary/60" />
          </div>
          <p className="mt-4 text-lg font-bold text-foreground">No hay partidos programados</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Los partidos de la temporada aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedGames.map((game) => {
            const dateInfo = formatDate(game.scheduled_at);
            const completed = isGameCompleted(game);
            const venueName = getVenueName(game.venue_id);

            return (
              <Link
                key={game.id}
                to="/schedule/$gameId"
                params={{ gameId: game.id }}
                className="group"
              >
                <Card className="schedule-card group/card h-full overflow-hidden border-2 transition-all hover:border-primary/50 hover:shadow-xl hover:-translate-y-1">
                  <div className={`relative z-10 flex items-stretch ${completed ? "bg-gradient-to-br from-muted/40 via-background to-muted/20" : "bg-gradient-to-br from-primary/10 via-primary/5 to-background"}`}>
                    <div className="relative flex w-24 flex-col items-center justify-center border-r-2 border-primary/20 py-4">
                      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
                      <span className="relative text-xs font-bold uppercase tracking-wider text-primary/70">
                        {dateInfo.month}
                      </span>
                      <span className="relative text-3xl font-black text-primary">{dateInfo.day}</span>
                      <div className="relative mt-1 h-0.5 w-12 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <div className="mb-3 flex items-center justify-between border-b border-dashed border-primary/20 pb-2">
                        <span className="text-xs font-semibold capitalize text-foreground/70">
                          {dateInfo.weekday}
                        </span>
                        <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                          <Clock className="h-3 w-3" />
                          {dateInfo.time}
                        </div>
                      </div>

                      <div className="flex flex-1 items-center justify-between gap-2">
                        <div className="flex flex-1 flex-col items-center text-center gap-1.5">
                          <div className="ring-2 ring-primary/20 ring-offset-2 ring-offset-background rounded-full">
                            <TeamLogo teamId={game.home_team_id} />
                          </div>
                          <span className="text-xs font-medium text-foreground/80 min-h-[2rem] flex items-center">
                            {getTeamName(game.home_team_id)}
                          </span>
                        </div>

                        <div className="flex flex-col items-center">
                          {completed ? (
                            <>
                              <div className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-background to-muted/30 px-4 py-2 shadow-lg ring-2 ring-primary/10">
                                <span className="text-2xl font-black text-foreground">
                                  {game.home_score ?? 0}
                                </span>
                                <span className="text-lg font-bold text-muted-foreground">-</span>
                                <span className="text-2xl font-black text-foreground">
                                  {game.away_score ?? 0}
                                </span>
                              </div>
                              <Badge variant="secondary" className="mt-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm">
                                Final
                              </Badge>
                            </>
                          ) : (
                            <div className="flex flex-col items-center">
                              <span className="text-xl font-black text-primary/40">vs</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col items-center text-center gap-1.5">
                          <div className="ring-2 ring-primary/20 ring-offset-2 ring-offset-background rounded-full">
                            <TeamLogo teamId={game.away_team_id} />
                          </div>
                          <span className="text-xs font-medium text-foreground/80 min-h-[2rem] flex items-center">
                            {getTeamName(game.away_team_id)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-muted/30 px-2 py-1.5 text-xs text-foreground/70">
                        <MapPin className="h-3 w-3 text-primary/60" />
                        <span className="line-clamp-1 font-medium">{venueName || "Por definir"}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
