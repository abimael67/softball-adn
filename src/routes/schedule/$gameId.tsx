import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { useGame, useTeams, useVenues } from "@/hooks";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

  const getTeam = (teamId: string) => {
    return teams?.find((t) => t.id === teamId);
  };

  const getVenue = (venueId: string | null) => {
    if (!venueId) return null;
    return venues?.find((v) => v.id === venueId);
  };

  const isGameCompleted = () => {
    if (!game) return false;
    return ["published", "approved", "completed"].includes(game.status);
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

  const TeamLogo = ({ team }: { team?: Team }) => {
    if (team?.logo_key) {
      return (
        <img
          src={storageService.getPublicUrl(team.logo_key)}
          alt={team.name}
          className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/20 ring-offset-4 ring-offset-background"
        />
      );
    }
    return (
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-2xl font-black text-primary ring-4 ring-primary/20 ring-offset-4 ring-offset-background">
        {team?.short_name || "?"}
      </div>
    );
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
  const completed = isGameCompleted();

  return (
    <div className="flex flex-col gap-6">
      <Button asChild variant="outline" className="w-fit">
        <Link to="/schedule">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al calendario
        </Link>
      </Button>

      <div className="relative overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg ring-4 ring-primary/20">
              <Calendar className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-foreground">Detalle del Partido</h1>
              <p className="text-sm font-semibold capitalize text-primary">{dateInfo.full}</p>
            </div>
          </div>
        </div>
      </div>

      <Card className="schedule-card relative overflow-hidden border-2">
        <div className="relative z-10 flex flex-col">
          <div className={`flex items-stretch ${completed ? "bg-gradient-to-br from-muted/40 via-background to-muted/20" : "bg-gradient-to-br from-primary/10 via-primary/5 to-background"}`}>
            <div className="relative flex w-32 flex-col items-center justify-center border-r-2 border-primary/20 py-8">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
              <span className="relative text-sm font-bold uppercase tracking-wider text-primary/70">
                {dateInfo.month}
              </span>
              <span className="relative text-5xl font-black text-primary">{dateInfo.day}</span>
              <div className="relative mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>

            <div className="flex flex-1 flex-col p-6">
              <div className="mb-4 flex items-center justify-between border-b border-dashed border-primary/20 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary/60" />
                  <span className="text-sm font-bold text-foreground/70">{dateInfo.time}</span>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
                  <MapPin className="h-4 w-4 text-primary/60" />
                  <span className="text-sm font-semibold text-primary">
                    {venue?.name || "Por definir"}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 items-center justify-between gap-4 py-4">
                <div className="flex flex-1 flex-col items-center text-center gap-3">
                  <TeamLogo team={homeTeam} />
                  <div>
                    <p className="text-lg font-black text-foreground">{homeTeam?.short_name}</p>
                    <p className="text-sm font-medium text-foreground/70">{homeTeam?.name}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  {completed ? (
                    <>
                      <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-background to-muted/30 px-6 py-4 shadow-xl ring-2 ring-primary/10">
                        <span className="text-4xl font-black text-foreground">
                          {game.home_score ?? 0}
                        </span>
                        <span className="text-2xl font-bold text-muted-foreground">-</span>
                        <span className="text-4xl font-black text-foreground">
                          {game.away_score ?? 0}
                        </span>
                      </div>
                      <Badge variant="secondary" className="mt-3 rounded-full px-4 py-1 text-xs font-bold shadow-sm">
                        Final
                      </Badge>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-black text-primary/40">vs</span>
                      <Badge variant="outline" className="mt-2 rounded-full px-3 py-0.5 text-xs font-semibold">
                        Próximo
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col items-center text-center gap-3">
                  <TeamLogo team={awayTeam} />
                  <div>
                    <p className="text-lg font-black text-foreground">{awayTeam?.short_name}</p>
                    <p className="text-sm font-medium text-foreground/70">{awayTeam?.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-2 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fecha</p>
              <p className="text-sm font-bold text-foreground capitalize">{dateInfo.full}</p>
            </div>
          </div>
        </Card>

        <Card className="border-2 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hora</p>
              <p className="text-sm font-bold text-foreground">{dateInfo.time}</p>
            </div>
          </div>
        </Card>

        <Card className="border-2 p-4 sm:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sede</p>
              <p className="text-sm font-bold text-foreground">{venue?.name || "Por definir"}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
